from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, emit

app = Flask(__name__)
socketio = SocketIO(app)
import os

rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def on_join(data):
    room = data['room']
    username = data['username']

    join_room(room)

    if room not in rooms:
        rooms[room] = {'players': [], 'board': [''] * 9, 'turn': 0}

    players = rooms[room]['players']

    if username not in players and len(players) < 2:
        players.append(username)

    emit('player_info', {'players': players, 'symbol': 'X' if players[0] == username else 'O'}, room=request.sid)

    if len(players) == 2:
        emit('start_game', {'message': 'เกมเริ่มแล้ว!', 'players': players}, room=room)

@socketio.on('make_move')
def handle_move(data):
    room = data['room']
    index = data['index']
    symbol = data['symbol']

    board = rooms[room]['board']

    if board[index] == '':
        board[index] = symbol
        rooms[room]['turn'] += 1

        emit('update_board', {'index': index, 'symbol': symbol}, room=room)

        # เช็คว่ามีผู้ชนะ
        winner = check_winner(board)
        if winner:
            emit('game_over', {'winner': winner}, room=room)

def check_winner(board):
    win_combos = [(0,1,2), (3,4,5), (6,7,8),
                  (0,3,6), (1,4,7), (2,5,8),
                  (0,4,8), (2,4,6)]
    for a, b, c in win_combos:
        if board[a] == board[b] == board[c] != '':
            return board[a]
    return None

if __name__ == '__main__':
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PORT") or 10000),
        allow_unsafe_werkzeug=True
    )
