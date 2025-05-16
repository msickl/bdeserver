from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from . import config

engine = create_engine(config.DATABASE_URL, echo=True)
Session = sessionmaker(bind=engine)

class Door:
    def fetch(self, bde_id, bde_target):
        columns = ['user_internal_id', 'user_id', 'user_last_name', 'user_first_name', 'user_email']
        session = Session()

        try:
            result = session.execute(
                text("EXEC sp_bde_dooracl_fetch @bde_id = :bde_id, @bde_target = :bde_target"),
                {
                    'bde_id' : bde_id,
                    'bde_target' : bde_target
                }
            )

            items = [dict(zip(columns, row)) for row in result.fetchall()]
            return items
        
        finally:
            session.close()


class User:
    def fetch(self, user_id):
        columns = ['user_internal_id', 'tenant_id', 'user_id', 'bde_id', 'account_name', 'last_name', 'first_name']
        session = Session()
        
        try:
            result = session.execute(
                text("EXEC sp_bde_user_fetch @tenant_id = 1, @user_id = :user_id"),
                {'user_id': user_id}
            )
            items = [dict(zip(columns, row)) for row in result.fetchall()]
            return items

        finally:
            session.close()

class Item:
    def __init__(self, item_id):
        self.item_id = item_id

    def fetch(self):
        columns = ['ITM_IDNR', 'ITM_VAR1', 'ITM_VAR2', 'ITM_VAR3', 'ITM_MATERIAL', 'ITM_STANDARD', 'ITM_UNIT', 'ITM_UNIT_DESC', 'ITM_SERIALREQUIRED']
        session = Session()
        
        try:
            result = session.execute(
                text("EXEC sp_bde_item_fetch @id = :item_id"),
                {'item_id': self.item_id}
            )
            items = [dict(zip(columns, row)) for row in result.fetchall()]
            return items

        finally:
            session.close()

class Order:
    def fetch(self):
        columns = ['VORGANG', 'VORGNR', 'ERSTELLT', 'LTPROD', 'KURZBEZ', 'KUNR', 'NAME1', 'UIDLAND', 'VORGTYP','BEZ', 'KURZ', 'GRUPPE']
        session = Session()
        
        try:
            result = session.execute(
                text("EXEC sp_bde_order_fetch")
            )
            items = [dict(zip(columns, row)) for row in result.fetchall()]
            return items

        finally:
            session.close()

class Stock:
     def fetch(self, tenant_id, stock_id, stock_location_id):
        session = Session()
        
        try:
            sql_query = """
            EXEC [dbo].[sp_bde_stock_fetch]
                @tenant_id = :tenant_id,
                @stock_id = :stock_id,
                @stock_location_id = :stock_location_id
            """

            params = {
                'tenant_id': tenant_id,
                'stock_id': stock_id,
                'stock_location_id': stock_location_id
            }

            result = session.execute(text(sql_query), params)

            columns = ['tenant_id', 'stock_id', 'stock_location_id', 'stock_id_name', 'stock_location_id_name']
            items = [dict(zip(columns, row)) for row in result.fetchall()]
            return items
        
        finally:
            session.close()

     def patch(self, tenant_id, operation_type, operation_description, stock_id, stock_location_id, user_id, item_id, item_serial_number, item_quantity, order_id):
        session = Session()

        try:
            sql_query = """
            EXEC [dbo].[sp_bde_stock_update]
                @tenant_id = :tenant_id,
                @operation_type = :operation_type,
                @operation_description = :operation_description,
                @stock_id = :stock_id,
                @stock_location_id = :stock_location_id,
                @user_id = :user_id,
                @item_id = :item_id,
                @item_serial_number = :item_serial_number,
                @item_quantity = :item_quantity,
                @order_id = :order_id
            """

            params = {
                'tenant_id': tenant_id,
                'operation_type': operation_type,
                'operation_description': operation_description,
                'stock_id': stock_id,
                'stock_location_id': stock_location_id,
                'user_id': user_id,
                'item_id': item_id,
                'item_serial_number': item_serial_number,
                'item_quantity': item_quantity,
                'order_id': order_id
            }

            result = session.execute(text(sql_query), params)

        finally:
            session.close()

class StockInfo:
    def fetch(self, tenant_id, item_id):
        columns = [
            'stock_id',
            'location_id',
            'storage_unit_id',
            'inventory_quantity',
            'reserved_quantity',
            'ordered_quantity'
        ]

        
        session = Session()
        
        try:
            result = session.execute(
                text("EXEC sp_bde_item_stock_info_fetch @item_id = :item_id, @tenant_id = :tenant_id"),
                {
                    'tenant_id' : tenant_id,
                    'item_id': item_id
                }
            )
            items = [dict(zip(columns, row)) for row in result.fetchall()]
            return items

        finally:
            session.close()