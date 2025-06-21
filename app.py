from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')  # เปลี่ยนจาก eventlet เป็น threading

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('make_move')
def handle_move(data):
    socketio.emit('move_made', data, broadcast=True)

import os

port_env = os.environ.get('PORT')
port = int(port_env) if port_env and port_env.isdigit() else 10000

socketio.run(app, host='0.0.0.0', port=port, allow_unsafe_werkzeug=True)
