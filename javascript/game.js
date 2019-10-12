
// For pausing the game
var paused = false;
$("#pause").click(function() {
  paused = !paused;
});
// For resetting the board
var scoreResetInterval = 1000;
var resetting = false;
// Maximum Number of baricades allowed on the baord
var maxbaricadeNumber = 7;
//Player Life count
var lives = 3;
// Player score
var score = 0;
// For game over
var gameover = false;
// For starting the game
var start = false;

// Ball Stats
var ball;
var ballStartX = document.getElementById("game-board").width/2;
var ballStartY = document.getElementById("game-board").height/2;
var ballMaxStartSpeed = 2;
var ballMaxSpeed = 3;
var ballColor = "white";
var ballRadius = 10;
var ballSpeedMultiplier = 1.1;
var ballHitMultiplier = 1;

//Paddle Stats
var paddle;
var playerSpeed = 2;
var playerMaxSpeed = 17;
var playerStartX = 30;
var playerStartY = document.getElementById("game-board").height/2;
var paddleColor = "red";
var paddleWidth = 10;
var paddleHeight = 90;
var scrollY = window.scrollY;

//BaricadeStats
var baricades = [];
var lowerXBound = 100;
var upperXBound = document.getElementById("game-board").width - 100;
var lowerXSpawnBound = document.getElementById("game-board").width/2 - 50;
var upperXSpawnBound = document.getElementById("game-board").width/2 + 50;
var lowerSpdBound = 1;
var upperSpdBound = 5;
var baricadeMinSpawnSpacing = 40;

// Stationary StationaryBaricade Stats
var sBColor = "white";
var stationaryBaricadeWidth = 10;
var stationaryBaricadeHeight = 60;
var movingBaricadeWidth = 10;
var movingBaricadeHeight = 60;


/*

Main game

*/


// Initializes the game
function startGame() {
  myGameArea.start();
  paddle = new Paddle(paddleColor, playerStartX, playerStartY);
  ball = new Ball(ballRadius);
  ball.init();
  ballHitMultiplier = 1;
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
	ctx.globalCompositeOperation = "copy";
	ctx.rect(this.x, this.y, this.width, this.height);
	ctx.fillStyle = paddleColor;
	ctx.shadowColor = 'black';
	ctx.shadowBlur = 10;
	ctx.shadowOffsetX = 10;
	ctx.shadowOffsetY = 0;
	ctx.fill();

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
  this.init = function() {
	this.x = document.getElementById("game-board").width/2;
	this.y = document.getElementById("game-board").height/2;

	// Make sure that ball is never moving orthogonally to screen
	this.speedX = randomIntFromInterval(-ballMaxStartSpeed, ballMaxStartSpeed);
	while(this.speedX == 0) {
		this.speedX = randomIntFromInterval(-ballMaxStartSpeed, ballMaxStartSpeed);
	}
	this.speedY = randomIntFromInterval(-ballMaxStartSpeed,ballMaxStartSpeed);
	while(this.speedY == 0) {
		this.speedY = randomIntFromInterval(-ballMaxStartSpeed, ballMaxStartSpeed);
	}
	this.radius = ballRadius;
	resetting = false;
	this.speedX += 0.5;
  }

  this.update = function(){
		ctx = myGameArea.context;
		ctx.globalCompositeOperation = "lighter";
		var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
		var step = (Math.PI/2)/this.radius;
		for(var i = 0; i < (Math.PI/2); i += step){
		  var c = "" + Math.floor(Math.max(0,255 * Math.abs(Math.cos(i))));
		  var gradientSphereColor = "rgba(" + c + "," + c + "," + c + "," + "0.85)";
		  grd.addColorStop(i/(Math.PI/2), gradientSphereColor);
		}

		// For drawing the ball
		ctx.fillStyle = grd; 	// Applies the 3D overlay
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.closePath();

		// Gives the ball a shadow
		ctx.shadowColor = "black";
		ctx.shadowBlur = 1;
		ctx.shadowOffsetX = 0.1;
		ctx.shadowOffsetY = 0.1;
		ctx.fill();
  }

  this.collision = function(baricade){

		// Defines the edges of the baricades
		var baricadeRangeLow = baricade.x;
		var baricadeRangeHigh = baricade.x + baricade.width;
		var baricadeRangeTop = baricade.y + baricade.speedY;
		var baricadeRangeBottom = baricade.y + baricade.height + baricade.speedY;

		// Passing the baricade horizontally
		//For top collision
		if(this.x + this.speedX > baricadeRangeLow &&
			this.x + this.speedX < baricadeRangeHigh && this.y + this.radius +  this.speedY > baricadeRangeTop && this.y - this.radius + this.speedY < baricadeRangeBottom) {
		  this.speedY *= -1;
		  this.y += Math.sign(this.speedY)*this.radius;
		  return true;
		}

		//For bottom collision
		if(this.x + this.speedX > baricadeRangeLow &&
			this.x + this.speedX < baricadeRangeHigh && this.y + this.radius + this.speedY < baricadeRangeBottom && this.y - this.radius + this.speedY > baricadeRangeTop) {
		  this.speedY *= -1;
		  this.y += Math.sign(this.speedY)*this.radius;
		  return true;
		}
		// For left Collision
		if(this.y + this.speedY > baricadeRangeTop && this.y + this.speedY < baricadeRangeBottom && this.x + this.radius + this.speedX > baricadeRangeLow && this.x + this.radius + this.speedX < baricadeRangeHigh){
		  this.speedX *= -1;
		  this.x += Math.sign(this.speedX)*this.radius;
		  return true;
		}
		// For RIght Collision
		if(this.y + this.speedY > baricadeRangeTop &&
			this.y + this.speedY < baricadeRangeBottom && this.x - this.radius + this.speedX < baricadeRangeHigh && this.x - this.radius + this.speedX > baricadeRangeLow) {
		  this.speedX *= -1;
		  this.x += Math.sign(this.speedX)*this.radius;
		  return true;
		}

		return false;
  }

  this.newPos = function() {

		// Check top/bottom collision
		if (this.y + this.speedY - this.radius < 0 || this.y + this.speedY +
				this.radius >= myGameArea.canvas.height) {
		  this.speedY *= -1;
		}

		// Check for a goal
		if (this.x + this.speedX > myGameArea.canvas.width) {
		  score += 1;
		  this.speedX *= -1;
		  var newBaricade = new Baricade();
		  newBaricade.init();
		  baricades.unshift(newBaricade);
		  while (baricades.length > maxbaricadeNumber) {
				baricades.pop();
		  }
		}

		//Check for life lsot
		if (this.x + this.speedX < 0) {
		  resetting = true;
		  $("#life"+lives).animate({opacity: 0.4}, 500);
		  lives -= 1;
		  setTimeout(resetBall, scoreResetInterval);
		}

		// Paddle collision
		if (this.collision(paddle)) {
		  ballHitMultiplier += 0.05;
		}

		baricades.forEach(function(baricade) {
		  ball.collision(baricade);
		});

		// Update Ball Position
		this.x += (this.speedX) * ballHitMultiplier * ballSpeedMultiplier;
		this.y += this.speedY * ballHitMultiplier * ballSpeedMultiplier;
	}
}

// Defines the method for creating baricades of all types
function Baricade() {

  this.init = function() {
		// For first 10 levels - Stationsary -
		if (score <= maxbaricadeNumber) {
		  this.width = stationaryBaricadeWidth;
		  this.height = stationaryBaricadeHeight;
		  this.speedY = 0;
		}

		// For levels 10-20 = Moving =
		else if (score > maxbaricadeNumber && score <= maxbaricadeNumber*2) {
		  this.width = movingBaricadeWidth;
		  this.height = movingBaricadeHeight;
		  this.speedY = randomIntFromInterval(lowerSpdBound, upperSpdBound);
		}

		// Past level 20 - get increasingly harder
		else if (score > maxbaricadeNumber*2) {
		  this.width = movingBaricadeWidth;
		  this.height = movingBaricadeHeight;
		  this.speedY = randomIntFromInterval(lowerSpdBound, upperSpdBound);
		  ballMaxSpeed += 1;
		  ballMaxStartSpeed += 1;
		}

		// Initialize positions before being set
	  this.x = -1;
	  this.y = randomIntFromInterval(0,myGameArea.canvas.height - this.height);

		// Determine a valid position to other baricades
		while (this.x < lowerXBound || this.x > upperXBound) {
			this.x = randomIntFromInterval(lowerXBound,upperXBound);
			var j = 0;
			var collisionPath = false;
			for(j = 0; j < baricades.length; j++) {
			  if (this.x > baricades[j].x + baricadeMinSpawnSpacing && this.x <
						baricades[j].x + baricades[j].width + baricadeMinSpawnSpacing) {
					collisionPath = true;
				}
				if (this.x > lowerXSpawnBound && this.x < upperXSpawnBound ||
						collisionPath) {
				  continue;
				}
	  	}
		}
	}

  this.update = function() {
		ctx = myGameArea.context;
		ctx.fillStyle = sBColor;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	  // Update Baricade Position
	this.newPos = function() {
		if (this.y - this.speedY <= 0 || this.y + this.speedY + this.height >=
		  myGameArea.canvas.height) {
		  this.speedY *= -1;
		  this.y += Math.sign(this.speedY)*10;
		}
		this.y += this.speedY;
	}
}

// Function to update the board
function updateGameArea() {

	// If gameover
  if (lives == 0) {
		gameover = true;
		$("#game-board, #lives").fadeOut(2000);
		$("#gameover, #start").fadeIn(2000);
		$("#start").css("margin-top", "10vh");
		$("#gameover").css("margin-top", "30vh");
		if(gameover) {
			highscore(score);
		}
  }

  //Update score
  $("#score").text("Score: "+score);
  if (!paused && !gameover && !resetting) {

		//Update board
		myGameArea.clear();

		// Update Paddle
		paddle.newPos();
		paddle.update();

		// Update ball
		if(ball.y+ball.radius < 0 - ball.radius * 2 || ball.y+ball.radius > myGameArea.canvas.height + ball.radius * 2){
		  ball.init();
		  alert("Ball bounced out of arena");
		}
		if(ball.speedX > ballMaxSpeed) {
		  ball.speedX = ballMaxSpeed;
		}
		if(ball.speedY > ballMaxSpeed) {
		  ball.speedY = ballMaxSpeed;
		}
		ball.newPos();
		ball.update();

		//Update each baricade position in baricades
		baricades.forEach(function(baricade) {
		  baricade.newPos();
		  baricade.update();
		});
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
	if(Math.sign(paddle.speedY) > 0) {
	  paddle.speedY = 0;
	}
	paddle.speedY -= playerSpeed;
  }
}

// Player Moving paddle down
function playerMoveDown() {
  if (paddle.speedY + playerSpeed < playerMaxSpeed) {
	if(Math.sign(paddle.speedY) < 0) {
	  paddle.speedY = 0;
	}
	paddle.speedY += playerSpeed;
  }
}

// Random Interval Function
function randomIntFromInterval(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

// Start the main game
function resetBall() {
  ball = new Ball(ballRadius);
  ball.init();
}

//FUnction to change paddle Color
function changePaddleColor(color) {
  $(document).ready(function(){
	paddleColor = color.value;
	console.log(paddleColor);
	paddle.update();
  });
}

// Board Setup
$(document).ready(function(){

	// Setup Initial Gameboard
	$("#game-board, #score, #lives").hide();
	$("#start").show();
	$(".life").animate({opacity: 0.0});
	$("#start").click(function(){
		if (!start) {
			start = true;
			startGameSequence();
		}
	});

	function startGameSequence(){
		if (start) {
			$("#score, #lives").show();
			$(".life").animate({opacity: 1.0}, 2000);
			$("#game-board").fadeIn(2000);
			$("#start").fadeOut(2000);
			score = 0;
			lives = 3;
			baricades = [];
			gameover = false;
			setTimeout(startGame, 2250);
			start = false;
		}
	}
});

// Updates score for the highscore API
// update_score();
