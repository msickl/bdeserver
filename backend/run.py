import json, re
from flask import Flask, request, jsonify, render_template
from app.model import Item, Order, Stock, StockInfo, User, Door
from app import config

app = Flask(__name__)

@app.route('/door', methods=['GET'])
def door():
    return render_template('door.html');

@app.route('/api/door', methods=['GET'])
def api_door():
    door = Door()

    if request.method == 'GET':
        args = request.args

        required_params = {'guid', 'bde_id', 'bde_action', 'bde_target'}
        if not required_params.issubset(args.keys()):
            return jsonify({"status": "error", "message": "Missing required parameters"}), 400

        guid = args.get('guid')
        bde_id = args.get('bde_id')
        bde_action = args.get('bde_action')
        bde_target = args.get('bde_target')

        if bde_action == 'open':
            try:
                rows = door.fetch(bde_id, bde_target)

                if len(rows) == 1:
                    return jsonify({"guid": guid, "status": "success", "data": rows[0]}), 200
                else:
                    return jsonify({"guid": guid, "status": "error", "message": "No matching data found"}), 400
            except Exception as e:
                print(f"Error fetching data: {e}")
                return jsonify({"guid": guid, "status": "error", "message": "Internal server error"}), 500
        else:
            return jsonify({"guid": guid, "status": "error", "message": "Invalid action parameter"}), 400
            

@app.route('/api/user', methods=['GET'])
def api_user():
    user = User()

    if request.method == 'GET':
        args = request.args
        if 'id' in args:
            user_id = args.get('id')
            rows = user.fetch(user_id)

            data = {
                "employeeId" : rows[0]['user_id'],
                "userName": rows[0]['account_name'],
                "firstName" : rows[0]['first_name'],
                "lastName" : rows[0]['last_name']
            }

            return jsonify({"status": "success", "data": data}), 200
        else:
            return jsonify({"status": "error", "message": "id parameter is required"}), 400

@app.route('/api/stock', methods=['GET', 'PATCH'])
def api_stock():
    stock = Stock()

    if request.method == 'GET':
        args = request.args
        if 'id' and 'locationid' in args:
            stockId = args.get('id')
            stockLocationId = args.get('locationid')

            rows = stock.fetch(1, stockId, stockLocationId)

            data = {
                "Tenant" : rows[0]['tenant_id'],
                "Id" : rows[0]['stock_id'],
                "LocationId" : rows[0]['stock_location_id'],
                "Name": rows[0]['stock_id_name'],
                "LocationName": rows[0]['stock_location_id_name']
            }

            return jsonify({"status": "success", "data": data}), 200
        else:
            return jsonify({"status": "error", "message": "id and locationid parameter is required"}), 400

    if request.method == 'PATCH':
        data = request.json

@app.route('/api/stockinfo', methods=['GET'])
def api_stockinfo():
    if request.method == 'GET':
        args = request.args
        if 'id' in args:
            item_id = args.get('id')
            stockinfo = StockInfo()
            data = stockinfo.fetch(1, item_id)
            return jsonify({"status": "success", "data": data}), 200

@app.route('/api/item', methods=['GET'])
def api_item():
    if request.method == 'GET':
        args = request.args
        if 'id' in args:
            item_id = args.get('id')
            item = Item(item_id)
            items = item.fetch()
            if len(items) == 1:
                return jsonify({"status": "success", "data": items}), 200
            else:
                return jsonify({"status": "error", "data": "null"}), 200
        else:
            return jsonify({"status": "error", "message": "id parameter is required"}), 400

@app.route('/api/serial', methods=['GET'])
def api_serial():
    if request.method == 'GET':
        args = request.args
        if 'data' in args:
            data = args.get('data')

            for vendor in config.get('serialvendors'):
                pattern = vendor["pattern"]
                match = re.search(pattern, data)
                if match:
                    data = {
                        "type" : vendor["name"],
                        "number" : match.group(1) 
                    }
                    print(f"{vendor}: Extracted value -> {data}")
                    return jsonify({"status": "success", "data": data}), 200

            data = {
                "type" : "Standard",
                "number" : data
            }
            return jsonify({"status": "success", "data": data}), 200
        else:
            return jsonify({"status": "error", "message": "data parameter is required"}), 400

@app.route('/api/order', methods=['GET'])
def api_order():
    if request.method == 'GET':
        args = request.args
        order = Order()
        data = order.fetch()
        return jsonify({"status": "success", "data": data}), 200

@app.route('/api/login', methods=['GET'])
def api_login():
    return render_template('login.html');

    
@app.route('/api/qr', methods=['GET'])
def qr():
    return render_template('qr.html');


if __name__ == '__main__':
    app.run(debug=True)