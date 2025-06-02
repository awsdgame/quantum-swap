const size = 5;
const lightBoard = document.getElementById("light-board");
const shadowBoard = document.getElementById("shadow-board");
const message = document.getElementById("message");

let walls = {
  light: [],
  shadow: []
}

const levels = [
  {
    lightPlayer: { x: 0, y: 0 },
    shadowPlayer: { x: 4, y: 4 },
    lightExit: { x: 4, y: 4 },
    shadowExit: { x: 0, y: 0 },
    walls: {
      light: [ { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 } ],
      shadow: [ { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 } ]
    }
  },
  {
    lightPlayer: { x: 0, y: 2 },
    shadowPlayer: { x: 4, y: 2 },
    lightExit: { x: 4, y: 0 },
    shadowExit: { x: 0, y: 4 },
    walls: {
      light: [ { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 } ],
      shadow: [ { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 } ]
    }
  },
  {
    lightPlayer: { x: 1, y: 1 },
    shadowPlayer: { x: 3, y: 3 },
    lightExit: { x: 3, y: 1 },
    shadowExit: { x: 1, y: 3 },
    walls: {
      light: [ { x: 2, y: 1 }, { x: 2, y: 2 } ],
      shadow: [ { x: 2, y: 3 }, { x: 2, y: 4 } ]
    }
  },
  {
    lightPlayer: { x: 0, y: 0 },
    shadowPlayer: { x: 4, y: 4 },
    lightExit: { x: 4, y: 4 },
    shadowExit: { x: 0, y: 0 },
    walls: {
      light: [ { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 } ],
      shadow: [ { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 } ]
    }
  }
];

let currentLevel = 0;

function loadLevel(index) {
  const level = levels[index];
  if (!level) return;

  lightPlayer = { ...level.lightPlayer };
  shadowPlayer = { ...level.shadowPlayer };
  lightExit = { ...level.lightExit };
  shadowExit = { ...level.shadowExit };
  walls.light = [...level.walls.light];
  walls.shadow = [...level.walls.shadow];

  update();
}


function createGrid(boardEl, boardType) {
  boardEl.innerHTML = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      const isWall = walls[boardType].some(w => w.x === x && w.y === y);
      if (isWall) cell.classList.add("wall");

      if (boardType === "light") {
        if (x === lightPlayer.x && y === lightPlayer.y) {
          cell.classList.add("player");
        }
        if (x === lightExit.x && y === lightExit.y) {
          cell.classList.add("exit");
        }
      } else {
        if (x === shadowPlayer.x && y === shadowPlayer.y) {
          cell.classList.add("shadow-player");
        }
        if (x === shadowExit.x && y === shadowExit.y) {
          cell.classList.add("shadow-exit");
        }
      }

      boardEl.appendChild(cell);
    }
  }
}function move(dx, dy) {
  const newLight = { x: lightPlayer.x + dx, y: lightPlayer.y + dy };
  const newShadow = { x: shadowPlayer.x - dx, y: shadowPlayer.y - dy }; // move opposite

  const isInside = ({ x, y }) => x >= 0 && y >= 0 && x < size && y < size;
  const isBlocked = ({ x, y }, boardType) => {
    return walls[boardType].some(w => w.x === x && w.y === y);
  };

  if (
    isInside(newLight) && !isBlocked(newLight, "light") &&
    isInside(newShadow) && !isBlocked(newShadow, "shadow")
  ) {
    lightPlayer = newLight;
    shadowPlayer = newShadow;
    update();
  }
}
function update() {
  createGrid(lightBoard, "light");
  createGrid(shadowBoard, "shadow");

  if (
    lightPlayer.x === lightExit.x && lightPlayer.y === lightExit.y &&
    shadowPlayer.x === shadowExit.x && shadowPlayer.y === shadowExit.y
  ) {
    message.textContent = "🎉 Level Complete!";
    document.removeEventListener("keydown", keyControl);
    setTimeout(() => {
      currentLevel++;
      if (levels[currentLevel]) {
        loadLevel(currentLevel);
        message.textContent = "";
        document.addEventListener("keydown", keyControl);
      } else {
        message.textContent = "🏁 All levels complete!";
      }
    }, 1000);
  }
}


function keyControl(e) {
  console.log(`Key pressed: ${e.key}`);
  switch (e.key) {
    case "ArrowUp": move(0, -1); break;
    case "ArrowDown": move(0, 1); break;
    case "ArrowLeft": move(-1, 0); break;
    case "ArrowRight": move(1, 0); break;
  }
}

document.addEventListener("keydown", keyControl);

document.getElementById("reset").addEventListener("click", () => {
  loadLevel(currentLevel);
  message.textContent = "";
  document.addEventListener("keydown", keyControl);
});

loadLevel(currentLevel);
