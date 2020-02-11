// ##################
// ##### SOUNDS #####
// ##################

var popSound = new Audio("js/bubble.mp3"); 
var crashSound = new Audio("js/boom.mp3");
var chimeSound = new Audio("js/chime.mp3");

// ###################
// ### ENEMY CLASS ###
// ###################

// Defining the class for Enemies our player must avoid.
// Defining the common properties all enemies will have.
var Enemy = function(x, y, speed) {
    this.sprite = 'images/car.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position; Parameter: dt, a time delta between ticks that
// ensures smooth animation on all computers.
Enemy.prototype.update = function(dt) {
    this.x += (this.speed) * dt * (Math.floor(Math.random() * (300 - 50)) + 50);
    if (this.x > 505) {
    	this.x = -150 
    }

    // IMPLEMENTING ENEMY-PLAYER COLLISION UPDATES...
    // xdiff is the x-difference between enemy and player
    // ydiff is the y-difference between enemy and player
    // causes the score and player to reset if a collision occurs.
    var xdiff = this.x - player.x;
    var ydiff = this.y - player.y;

    if (xdiff < 40 &&
        xdiff > -40 &&
        ydiff < 40 &&
        ydiff > -40) {
        score = 0;
        $("canvas").fadeOut();
        crashSound.play();
        document.getElementById("scoredisplay").innerHTML = score;
        player.reset();
        allEnemies = enemyMaker();
        $("canvas").fadeIn();
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// ####################
// ### PLAYER CLASS ###
// ####################

// Score Tracker (resets if you lose)
var score = 0;
document.getElementById("scoredisplay").innerHTML = score;

// Defining the Player class and its starting properties.
var Player = function() {
	this.sprite = 'images/frog.png';
	this.x = 202;
	this.y = 402;
};

// Helper function for resetting the player to starting
// position. (When you reach the end or lose).
Player.prototype.reset = function() {
	this.x = 202;
	this.y = 402;	
};

// Update the player position.
// Adds 10 points for every victory (reaching the canvas end),
// and displays the score.
// Causes a quick fade-in, fade-out and resets enemies and 
// player for every victory.
Player.prototype.update = function() {
	if (this.y < 50) {
        score += 10;
        console.log(score);
        chimeSound.play();
        document.getElementById("scoredisplay").innerHTML = score;
        $("canvas").fadeOut(100);
		this.reset();
        allEnemies = enemyMaker();
        $("canvas").fadeIn(100);
	}
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// The handleInput method, which receives user input, allowedKeys (the key
// which was pressed) and moves the player according to that input.
// Also logs the key presses in the console.
Player.prototype.handleInput = function(keyCode) {
	switch(keyCode) {
		case 'left':
        if (this.x == 0) {
            this.x = 0;
        } else {
            popSound.play();            
            this.x -= 101;
        }
        console.log('left');
		break;

		case 'right':
        if (this.x == 404) {
            this.x = 404;
        } else {
            popSound.play();            
            this.x += 101;
        }
        console.log('right');
		break;

		case 'up':
        popSound.play();        
		this.y -= 83;
        console.log('up');
		break;

		case 'down':
        if (this.y == 402) {
            this.y == 402;
        } else {
            this.y += 83;
            popSound.play();            
        }
        console.log('down');
		break;
	};
};

// ###################
// ### RANDOMIZERS ###
// ###################

// Randomizes the speeds of enemies depeding on the
// player level. (Higher score, higher level, more speed).
var speedRandomizer = function(level) {
    if (level==1) {
        return Math.random() * (1.5 - 0.75) + 0.75;
    } else if (level==2) {
       return Math.random() * (2.5 - 1.5) + 1.5;
    } else {
       return Math.random() * (4 - 2.5) + 2.5;
    }
    
};

// Randomizes the start position of the enemies.
var startRandomizer = function() {
    return Math.random() * (-10 - (-250)) - 250;
};

// Randomizes the number of enemies on the canvas
// depending on the player level. 
// (Higher score, higher level, more enemies).
var quantityRandomizer = function(level) {
    if (level==1) {
        return (Math.floor(Math.random() * (6 - 4)) + 4);
    } else if (level==2) {
       return (Math.floor(Math.random() * (8 - 6)) + 6);
    } else {
       return (Math.floor(Math.random() * (10 - 7)) + 7);
    }
};

// #####################
// ### INSTANTIATION ###
// #####################

// A function for making an array of enemies. It creates a 
// random set of enemies, and is called every round.
// randomizes the speed, starting position and the quantity
// of enemies. (Based on the player's level).
var enemyMaker = function() {
    if (score <= 30) {
        level = 1;
    } else if (score <= 70) {
        level = 2;
    } else {
        level = 3;
    }

    var enemyQuantity = quantityRandomizer(level);
    var enemyArray = [];
    var rowNumber = 231;

    for (i=0; i < enemyQuantity; i++) {
        if (rowNumber < 65) {
            rowNumber = 231;
        }
        enemyArray.push(new Enemy(startRandomizer(), rowNumber, speedRandomizer(level)));
        rowNumber -= 83;
    }

    return enemyArray
};

// Instantiating objects.
// Placing all enemy objects in an array called allEnemies
// Placing the player object in a variable called player

var allEnemies = enemyMaker();

var player = new Player();

// This listens for key presses and sends the keys to
// Player.handleInput() method. 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
