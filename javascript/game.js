
// For pausing the game
var paused = false;
// For resetting the board
var scoreResetInterval = 750;
var resetting = false;
// Maximum Number of baricades allowed on the baord
var maxbaricadeNumber = 10;
//Player Life count
var lives = 3;
// For game over
var gameover = false;

// Ball Stats
var ball;
var ballStartX = document.getElementById("game-board").width/2;
var ballStartY = document.getElementById("game-board").height/2;
var ballMaxStartSpeed = 5;
var ballMaxSpeed = 30;
var ballColor = "blue";
var ballRadius = 10;

//Paddle Stats
var paddle;
var playerSpeed = 0.75;
var playerMaxSpeed = 10;
var playerStartX = 30;
var playerStartY = document.getElementById("game-board").height/2;
var paddleColor = "red";
var paddleWidth = 10;
var paddleHeight = 70;
var scrollY = window.scrollY;

//BaricadeStats
var baricades = [];
var lowerXBound = 200;
var upperXBound = document.getElementById("game-board").width - 200;
var lowerXSpawnBound = document.getElementById("game-board").width/2 - 50;
var upperXSpawnBound = document.getElementById("game-board").width/2 + 50;
var lowerSpdBound = 1;
var upperSpdBound = 10;

// Stationary StationaryBaricade Stats
var sBColor = "green";
var stationaryBaricadeWidth = 10;
var stationaryBaricadeHeight = 60;


/*

Main game

*/


// Initializes the game
function startGame() {
  myGameArea.start();
  paddle = new Paddle(paddleColor, playerStartX, playerStartY);
  ball = new Ball(ballRadius);
}

// Defines the Gameboard/KeyListeners
var myGameArea = {
  canvas : document.getElementById("game-board"),
  start : function() {
    this.canvas.width = 720;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keydown", userInputKeyboard, false);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Defines Player Paddle Specifications/Methods
function Paddle(color, x, y) {

  // Paddle Stat setup
  this.width = paddleWidth;
  this.height = paddleHeight;
  this.x = x;
  this.y = y;
  this.speedY = 0;

  this.update = function(){
    ctx = myGameArea.context;
    ctx.fillStyle = paddleColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.newPos = function() {
    if (this.y + this.speedY > 0 && this.y + this.speedY + paddle.height <
        myGameArea.canvas.height) {
      this.y += this.speedY;
    } else {
      if (this.y + this.speedY < 0) {
        this.y = 0;
        this.speedY = 0;
      } else if (this.y + this.speedY + paddle.height >
                 myGameArea.canvas.height) {
        this.y = myGameArea.canvas.height - paddle.height;
        this.speedY = 0;
      }
    }
  }

}

function Ball(){

  // ball setup stats
  this.x = document.getElementById("game-board").width/2;
  this.y = document.getElementById("game-board").height/2;
  this.speedX = randomIntFromInterval(-ballMaxStartSpeed,ballMaxStartSpeed);
  this.speedY = randomIntFromInterval(-ballMaxStartSpeed,ballMaxStartSpeed);
  this.radius = ballRadius;

  this.update = function(){
    ctx = myGameArea.context;
    this.fillColour = ballColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.fillColour;
    ctx.fill();
    ctx.closePath();
  }

  this.collision = function(baricade){
    var distX = Math.abs(this.x - baricade.x - baricade.width / 2);
    var distY = Math.abs(this.y - baricade.y - baricade.height / 2);

    if (distX > (baricade.width / 2 + this.radius)) {
       return false;
    }
    if (distY > (baricade.height / 2 + this.radius)) {
      return false;
    }

    if (distX <= (baricade.width / 2)) {
      return true;
    }
    if (distY <= (baricade.height / 2)) {
       return true;
     }

    // also test for corner collisions
    var dx = distX - baricade.width / 2;
    var dy = distY - baricade.height / 2;
    return (dx * dx + dy * dy <= (this.radius * this.radius));
  }
  this.newPos = function() {
    // Check top/bottom collision
    if (this.y + this.speedY + this.radius <= 0 || this.y + this.speedY + this.radius >= myGameArea.canvas.height) {
      this.speedY *= -1;
    }

    // Check for a goal
    if (this.x + this.radius + this.speedX > myGameArea.canvas.width) {
      console.log("You scored!");
      // TODO: Reset game
    }
    //Check for life lsot
    if (this.x - this.radius + this.speedX < 0) {
      console.log("You lost a life!");
      lives -= 1;
      // TOFO: Reset game
    }

    //Check collisions with barricades
    var i = 0;
    for(i = 0; i < baricades.length; i++){
      this.collision(baricades[i]);
      // TODO: Edit collision to return switch case for direction response
      // TODO: Apply response to speedX and SpeedY
    }

    // Update Ball Position
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

// Defines the method for creating baricades of all types
function StationaryBaricade(type) {
  this.width = stationaryBaricadeWidth;
  this.height = stationaryBaricadeHeight;
  this.x = -1;
  this.y = -1;

  // Determine Type to set speed
  if (type == "stationary") {
    this.speedY = 0;
  } else if (type == "moving") {
    this.speedY = randomIntFromInterval(-ballMaxStartSpeed,ballMaxStartSpeed);
  }

  // Determine a valid position to other baricades
  while (this.x < lowerXBound || this.x > upperXBound) {
    this.x = randomIntFromInterval(lowerXBound,upperXBound);
    var j = 0;
    var collisionPath = false;
    for(j = 0; j < baricades.length; j++) {
      if (this.x > baricades[j].x && this.x < baricades[j].x + baricades[j].width) {
        collisionPath = true;
      }
    }
    if (this.x > lowerXSpawnBound && this.x < upperXSpawnBound || collisionPath) {
      continue;
    }
  }

  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = sBColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
    if (this.y + this.speedY > 0 && this.y + this.speedY + paddle.height <
       myGameArea.canvas.height) {
      this.y += this.speedY;
    } else {
      if (this.y + this.speedY < 0) {
        this.y = 0;
        this.speedY = 0;
      } else if (this.y + this.speedY + paddle.height >
                 myGameArea.canvas.height){
        this.y = myGameArea.canvas.height - paddle.height;
        this.speedY = 0;
      }
    }
  }
}

// Function to update the board
function updateGameArea() {
  if (lives == 0) {
    gameover = true;
    // Do game over stuff
  }
  if (!paused && !resetting && !gameover) {

    //Update board
    myGameArea.clear();

    // Update Paddle
    paddle.newPos();
    paddle.update();

    // Update ball
    ball.newPos();
    ball.update();
  }
}

//For Handdling Player Movement
// Check arrow key input and call movement function
function userInputKeyboard(event) {
	switch(event.keyCode) {
		case 38:
			// up key pressed
      playerMoveUp();
      event.preventDefault();
			break;
		case 40:
    	// down key pressed
      playerMoveDown();
      event.preventDefault();
			break;
    default:
      break;
	}
}

// PLayer Moving paddle up
function playerMoveUp() {
  if (Math.abs(paddle.speedY - playerSpeed) < playerMaxSpeed) {
      paddle.speedY -= playerSpeed;
  }
}

// Player Moving paddle down
function playerMoveDown() {
  if (paddle.speedY + playerSpeed < playerMaxSpeed) {
      paddle.speedY += playerSpeed;
  }
}

// Random Interval Function
function randomIntFromInterval(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

// Start the main game
startGame();
