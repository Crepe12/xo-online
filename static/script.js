const socket = io();

function joinRoom() {
    const room = document.getElementById('room').value;
    if (room) {
        socket.emit('join_room', { room: room });
        console.log('ส่ง join_room ไปแล้ว:', room);
    }
}

socket.on('connect', () => {
    console.log('เชื่อมต่อกับเซิร์ฟเวอร์แล้ว!');
});

socket.on('start_game', (data) => {
    console.log('เริ่มเกมห้อง:', data.room);

    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';

    // สร้างกระดาน 3x3
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.textContent = '-';
        cell.style.width = '60px';
        cell.style.height = '60px';
        cell.style.margin = '5px';
        gameDiv.appendChild(cell);
        if ((i + 1) % 3 === 0) {
            gameDiv.appendChild(document.createElement('br'));
        }
    }
});
