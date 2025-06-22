let socket = io();
let symbol = '';
let room = '';

function joinGame() {
  const username = document.getElementById('username').value;
  room = document.getElementById('room').value;

  socket.emit('join', { username, room });
}

socket.on('player_info', (data) => {
  symbol = data.symbol;
  document.getElementById('status').innerText = `คุณคือ ${symbol}`;
});

socket.on('start_game', () => {
  document.getElementById('board').style.display = 'grid';
});

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', () => {
    const index = parseInt(cell.getAttribute('data-index'));
    if (cell.innerText === '-') {
      socket.emit('make_move', { room, index, symbol });
    }
  });
});

socket.on('update_board', (data) => {
  document.querySelectorAll('.cell')[data.index].innerText = data.symbol;
});

socket.on('game_over', (data) => {
  alert(`ผู้ชนะคือ: ${data.winner}`);
});
