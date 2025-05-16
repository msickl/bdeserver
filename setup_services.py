#!/usr/bin/env python3

import os
import subprocess

flask_servicename = "bdeserver-backend.service"

abspath = os.path.dirname(os.path.abspath(__file__))

subprocess.run(f'ln -sf {abspath}/{flask_servicename} /etc/systemd/system/', shell=True)

subprocess.run(f'systemctl enable {flask_servicename}', shell=True)

subprocess.run('systemctl daemon-reload', shell=True)
subprocess.run(f'systemctl start {flask_servicename}', shell=True)

print("BDE Server services have been registered and started.")
