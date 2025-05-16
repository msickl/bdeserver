#!/usr/bin/env python3

import os
import json

config_file_path = os.path.join(os.path.dirname(__file__), '../config.json')

with open(config_file_path, "r") as f:
    cfg = json.load(f)

def get(v):
    return cfg[v]

DATABASE_URL = f"mssql+pyodbc://{cfg['mssql']['user']}:{cfg['mssql']['pass']}@{cfg['mssql']['host']}/{cfg['mssql']['db']}?driver=ODBC+Driver+17+for+SQL+Server"
