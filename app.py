from flask import Flask, render_template
from flask_socketio import SocketIO
import eventlet

eventlet.monkey_patch()  # สำคัญมากเมื่อใช้กับ eventlet

app = Flask(__name__)
socketio = SocketIO(app, async_mode='eventlet')  # ใช้ eventlet แน่ๆ

@app.route('/')
def index():
    return render_template('index.html')

# ตัวอย่าง event สำหรับ XO
@socketio.on('connect')
def on_connect():
    print('Client connected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
