
// For pausing the game
var paused = false;
// For resetting the board
var scoreResetInterval = 750;
var resetting = false;
// Maximum Number of baricades allowed on the baord
var maxBarricadeNumber = 10;


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
var lowerSpdBound = 1;
var upperSpdBound = 10;

// Stationary StationaryBaricade Stats
var sBColor = "green";


/*

Main game

*/


// Initializes the game
function startGame() {
  myGameArea.start();
  paddle = new Paddle(paddleColor, playerStartX, playerStartY);
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
  this.width = paddleWidth;
  this.height = paddleHeight;
  this.x = x;
  this.y = y;
  this.speedY = 0;
  ctx = myGameArea.context;
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
  this.update = function(){
    ctx = myGameArea.context;
    ctx.fillStyle = color;
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

// Defines the method for creating Barricades of all types
function StationaryBaricade(type) {
  this.width = stationaryBaricadeWidth;
  this.height = stationaryBaricadeHeight;
  this.x = x;
  this.y = y;
  this.speedY = 0;
  ctx = myGameArea.context;
  ctx.fillStyle = sBColor;
  ctx.fillRect(this.x, this.y, this.width, this.height);
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
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
  if (!paused && !resetting) {
    myGameArea.clear();
    paddle.newPos();
    paddle.update();
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

// Start the main game
startGame();































  /*

  Queue.js

  A function to represent a queue

  Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
  of the CC0 1.0 Universal legal code:

  http://creativecommons.org/publicdomain/zero/1.0/legalcode

  */

  /* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
   * items are added to the end of the queue and removed from the front.
   */
  function Queue(){

    // initialise the queue and offset
    var queue  = [];
    var offset = 0;

    // Returns the length of the queue.
    this.getLength = function(){
      return (queue.length - offset);
    }

    // Returns true if the queue is empty, and false otherwise.
    this.isEmpty = function(){
      return (queue.length == 0);
    }

    /* Enqueues the specified item. The parameter is:
     *
     * item - the item to enqueue
     */


     // Modified to only allow the maximum number of baricades.
    this.enqueue = function(item){
      if (queue.length + 1 < maxBarricadeNumber) {
        queue.push(item);
      }
    }

    /* Dequeues an item and returns it. If the queue is empty, the value
     * 'undefined' is returned.
     */
    this.dequeue = function(){

      // if the queue is empty, return immediately
      if (queue.length == 0) return undefined;

      // store the item at the front of the queue
      var item = queue[offset];

      // increment the offset and remove the free space if necessary
      if (++ offset * 2 >= queue.length){
        queue  = queue.slice(offset);
        offset = 0;
      }

      // return the dequeued item
      return item;

    }

    /* Returns the item at the front of the queue (without dequeuing it). If the
     * queue is empty then undefined is returned.
     */
    this.peek = function(){
      return (queue.length > 0 ? queue[offset] : undefined);
    }

  }


    // // For mobile devices
    // // function TouchListener(element) {
    // //     this.touches = [];
    // //     this.touchMoveListener = function(touch) {};
    // //
    // //     element.addEventListener("touchstart", (function(e) {
    // //         e.preventDefault();
    // //         for (var i = 0; i < e.changedTouches.length; i++) {
    // //             var touch = e.changedTouches[i];
    // //             this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY};
    // //         }
    // //     }).bind(this));
    // //
    // //     element.addEventListener("touchmove", (function(e) {
    // //         e.preventDefault();
    // //         for (var i = 0; i < e.changedTouches.length; i++) {
    // //             var touch = e.changedTouches[i];
    // //             var previousTouch = this.touches[touch.identifier];
    // //             this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY};
    // //
    // //             var offset = {x: touch.clientX - previousTouch.x, y: touch.clientY - previousTouch.y}
    // //             this.touchMoveListener({x: touch.clientX, y: touch.clientY, offset: offset});
    // //         }
    // //     }).bind(this));
    // //
    // //     element.addEventListener("touchend", (function(e) {
    // //         e.preventDefault();
    // //         for (var i = 0; i < e.changedTouches.length; i++) {
    // //             delete this.touches[e.changedTouches[i].identifier];
    // //         }
    // //     }).bind(this));
    // // }
    //
