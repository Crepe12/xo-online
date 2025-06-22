const socket = io();

let symbol = '';
let room = '';

function joinGame() {
  const username = document.getElementById("username").value;
  room = document.getElementById("room").value;
  socket.emit("join", { room, username });
}

socket.on("player_info", data => {
  symbol = data.symbol;
  document.getElementById("status").innerText = `คุณคือ ${symbol}`;
});

socket.on("start_game", data => {
  document.getElementById("status").innerText = "เกมเริ่มแล้ว!";
  document.getElementById("board").style.display = "grid";
});

socket.on("update_board", data => {
  const cell = document.querySelector(`.cell[data-index='${data.index}']`);
  if (cell) {
    cell.textContent = data.symbol;
    cell.style.pointerEvents = 'none';
  }
});

socket.on("game_over", data => {
  document.getElementById("status").innerText = `เกมจบ! ผู้ชนะ: ${data.winner}`;
});

// ตั้งค่าการคลิกช่อง
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
      const index = parseInt(cell.getAttribute("data-index"));
      if (cell.textContent === '-') {
        socket.emit("make_move", { room, index, symbol });
      }
    });
  });
});
