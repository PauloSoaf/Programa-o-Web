(function () {
  let FPS = 10;
  const SIZE = 40;
  let board;
  let snake;
  let food;
  let score = 0;
  let gameRunning = false;
  let gamePaused = false;
  let interval;
  let frameCount = 0;

  function init() {
    board = new Board(SIZE);
    snake = new Snake([[4, 4], [4, 5], [4, 6]]);
    food = new Food();
    food.spawn();
    document.getElementById('score').textContent = score.toString().padStart(5, '0');
    window.addEventListener("keydown", handleKeyDown);
  
    
    const boardElement = document.getElementById('board');
    boardElement.style.margin = '2rem auto';
    boardElement.style.position = 'absolute';
    boardElement.style.top = '50%';
    boardElement.style.left = '50%';
    boardElement.style.transform = 'translate(-50%, -50%)';
  
    
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.style.position = 'absolute';
    scoreboard.style.top = '10px';
    scoreboard.style.left = '50%';
    scoreboard.style.transform = 'translateX(-50%)';
    scoreboard.style.backgroundColor = '#000';
    scoreboard.style.color = '#fff';
    scoreboard.style.padding = '10px';
    scoreboard.style.borderRadius = '10px';
    scoreboard.style.fontSize = '2em';
    scoreboard.style.zIndex = '10'; 
  }
  


  function handleKeyDown(e) {
    switch (e.key) {
      case "s":
      case "S":
        startGame();
        break;
      case "p":
      case "P":
        togglePauseGame();
        break;
      case "r":
      case "R":
        restartGame();
        break;
      case "ArrowUp":
        snake.changeDirection(0);
        break;
      case "ArrowRight":
        snake.changeDirection(1);
        break;
      case "ArrowDown":
        snake.changeDirection(2);
        break;
      case "ArrowLeft":
        snake.changeDirection(3);
        break;
      default:
        break;
    }
      
    if (["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
    }
  }

  function startGame() {
    if (!gameRunning) {
      gameRunning = true;
      gamePaused = false;
      frameCount = 0;
      score = 0;
      FPS = 10;
      document.getElementById('score').textContent = score.toString().padStart(5, '0');
      snake.reset();
      food.reset();
      interval = setInterval(run, 1000 / FPS);
      removeGameOverMessage();
    }
  }

  function restartGame() {
    if (!gameRunning) {
      startGame();
    }
  }

  function togglePauseGame() {
    if (gameRunning) {
      if (gamePaused) {
        interval = setInterval(run, 1000 / FPS);
        gamePaused = false;
      } else {
        clearInterval(interval);
        gamePaused = true;
      }
    }
  }

  function updateSpeed() {
    clearInterval(interval);
    FPS *= 1.03; 
    interval = setInterval(run, 1000 / FPS);
  }

  function showGameOverMessage() {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.setAttribute('id', 'game-over');
    gameOverMessage.innerHTML = '<p style="text-align: center;">Game Over!<br>Reinicie apertando R</p>';
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.fontSize = '3em';
    gameOverMessage.style.color = '#ff0000'; 
    gameOverMessage.style.backgroundColor = '#000'; 
    gameOverMessage.style.padding = '20px';
    gameOverMessage.style.borderRadius = '10px';
    gameOverMessage.style.zIndex = '10';
    document.body.appendChild(gameOverMessage);
  }

  function removeGameOverMessage() {
    const gameOverMessage = document.getElementById('game-over');
    if (gameOverMessage) {
      gameOverMessage.remove();
    }
  }

  class Board {
    constructor(size) {
      this.element = document.createElement("table");
      this.element.setAttribute("id", "board");
      this.color = "#ccc";
      document.body.appendChild(this.element);
      for (let i = 0; i < size; i++) {
        const row = document.createElement("tr");
        this.element.appendChild(row);
        for (let j = 0; j < size; j++) {
          const field = document.createElement("td");
          row.appendChild(field);
        }
      }
    }
  }

  class Snake {
    constructor(body) {
      this.body = body;
      this.color = "#222";
      this.direction = 1; 
      this.body.forEach(field => document.querySelector(`#board tr:nth-child(${field[0]}) td:nth-child(${field[1]})`).style.backgroundColor = this.color);
    }

    walk() {
      const head = this.body[this.body.length - 1];
      let newHead;
      switch (this.direction) {
        case 0:
          newHead = [head[0] - 1, head[1]];
          break;
        case 1:
          newHead = [head[0], head[1] + 1];
          break;
        case 2:
          newHead = [head[0] + 1, head[1]];
          break;
        case 3:
          newHead = [head[0], head[1] - 1];
          break;
        default:
          break;
      }

      if (this.checkCollision(newHead)) {
        endGame();
        return;
      }

      if (newHead[0] === food.position[0] && newHead[1] === food.position[1]) {
        this.body.push(newHead);
        if (food.color === "#000") {
          score += 1; 
        } else {
          score += 2; 
        }
        food.remove(); 
        food.spawn();  
        document.getElementById('score').textContent = score.toString().padStart(5, '0');
      } else {
        this.body.push(newHead);
        const oldTail = this.body.shift();
        document.querySelector(`#board tr:nth-child(${oldTail[0]}) td:nth-child(${oldTail[1]})`).style.backgroundColor = board.color;
      }

      document.querySelector(`#board tr:nth-child(${newHead[0]}) td:nth-child(${newHead[1]})`).style.backgroundColor = this.color;
    }

    changeDirection(newDirection) {
      
      if ((this.direction === 0 && newDirection !== 2) ||
          (this.direction === 1 && newDirection !== 3) ||
          (this.direction === 2 && newDirection !== 0) ||
          (this.direction === 3 && newDirection !== 1)) {
        this.direction = newDirection;
      }
    }

    checkCollision(newHead) {
      
      if (newHead[0] < 1 || newHead[0] > SIZE || newHead[1] < 1 || newHead[1] > SIZE) {
        return true;
      }
      
      return this.body.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1]);
    }

    reset() {
      
      this.body.forEach(field => document.querySelector(`#board tr:nth-child(${field[0]}) td:nth-child(${field[1]})`).style.backgroundColor = board.color);
      this.body = [[4, 4], [4, 5], [4, 6]];
      this.direction = 1;
      this.body.forEach(field => document.querySelector(`#board tr:nth-child(${field[0]}) td:nth-child(${field[1]})`).style.backgroundColor = this.color);
    }
  }

  class Food {
    constructor() {
      this.position = [];
      this.color = this.randomColor();
    }

    randomColor() {
      
      return Math.random() < 0.666 ? "#000" : "#f00";
    }

    spawn() {
      let newPosition;
      do {
        newPosition = [
          Math.floor(Math.random() * SIZE) + 1,
          Math.floor(Math.random() * SIZE) + 1
        ];
      } while (snake.body.some(segment => segment[0] === newPosition[0] && segment[1] === newPosition[1]));

      this.position = newPosition;
      this.color = this.randomColor();
      document.querySelector(`#board tr:nth-child(${newPosition[0]}) td:nth-child(${newPosition[1]})`).style.backgroundColor = this.color;
    }

    remove() {
      if (this.position.length) {
        const oldFoodCell = document.querySelector(`#board tr:nth-child(${this.position[0]}) td:nth-child(${this.position[1]})`);
        if (oldFoodCell) {
          oldFoodCell.style.backgroundColor = board.color;
        }
      }
    }

    reset() {
      this.remove();
      this.spawn();
    }
  }

  function run() {
    snake.walk();
    frameCount++;
    if (frameCount % 60 === 0) {
      updateSpeed(); 
    }
  }

  function endGame() {
    clearInterval(interval);
    gameRunning = false;
    showGameOverMessage();
  }

  init();
})();
