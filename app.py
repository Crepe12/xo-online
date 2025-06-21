from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, emit
import os

app = Flask(__name__)
socketio = SocketIO(app)

players = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join_room')
def handle_join(data):
    room = data['room']
    join_room(room)

    if room not in players:
        players[room] = []

    players[room].append(request.sid)

    if len(players[room]) == 2:
        emit('start_game', {'room': room}, room=room)

if __name__ == '__main__':
    socketio.run(
        app,
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 10000)
    )

