const socket = io();

let room = '';
let symbol = '';

function joinRoom() {
  room = document.getElementById('room').value;
  const username = prompt("ใส่ชื่อผู้เล่น:");

  socket.emit('join', { room, username });

  socket.on('player_info', data => {
    symbol = data.symbol;
    document.getElementById('info')?.remove();
    const info = document.createElement('div');
    info.id = 'info';
    info.textContent = 'คุณคือ ' + symbol;
    document.body.appendChild(info);
  });

  socket.on('start_game', data => {
    console.log('เกมเริ่มแล้ว:', data.players);
  });

  socket.on('update_board', data => {
    const cell = document.getElementById(`cell-${data.index}`);
    if (cell) cell.textContent = data.symbol;
  });

  socket.on('game_over', data => {
    alert(`เกมจบ ผู้ชนะคือ ${data.winner}`);
  });
}

// สร้างกระดานเกม
const boardEl = document.getElementById('board');
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.id = `cell-${i}`;
  cell.textContent = '-';
  cell.addEventListener('click', () => {
    socket.emit('make_move', {
      room,
      index: i,
      symbol
    });
  });
  boardEl.appendChild(cell);
}
