var canvas,
    canvasContext,

    ballX = 400,
    ballSpeedX = 10,
    ballY = 300,
    ballSpeedY = 2,

    paddle1Y = 250,
    paddle2Y = 250,
    AImovement = 5,

    player1Score = 0,
    player2Score = 0,

    winScreen = false;

const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;

const WINNING_SCORE = 10;

function calcMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY,
    };
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    setInterval(function() {
        move();
        draw();
    }, 1000 / 60);

    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = calcMousePos(evt);
        paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
    });

    canvas.addEventListener('mousedown', function() {
        if (winScreen) {
            player1Score = 0;
            player2Score = 0;
            winScreen = false;
        }
    });
}

function computerMovement() {
    // Follow BallY at center
    var paddleCenter = paddle2Y + PADDLE_HEIGHT / 2;
    
    if (paddleCenter < ballY - 35) {
        paddle2Y += AImovement;
    } else if (paddleCenter > ballY + 35) {
        paddle2Y -= AImovement;
    }
}

function move() {
    if (winScreen) {
        return;
    }

    computerMovement();

    // Increment ball X + Y
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // Change Direction/Reset X
    if (ballX >= canvas.width) { // Right side
        if (!(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT)) {
            player1Score++;
            resetBall();
        }
    } else if (ballX <= 0) { // Left side
        if (!(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT)) {
            player2Score++;
            resetBall();
        }
    }
    // Hit paddle
    if (ballX >= canvas.width - 50) { // Right side
        if (ballY > paddle2Y-10 && ballY < paddle2Y+PADDLE_HEIGHT+10) {
            ballSpeedX = -ballSpeedX;
            ballX = canvas.width - 50;

            var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = Math.floor(deltaY / 6);
        }
    } else if (ballX <= 50) { // Left side
        if (ballY > paddle1Y-10 && ballY < paddle1Y+PADDLE_HEIGHT+10) {
            ballSpeedX = -ballSpeedX;
            ballX = 50;

            var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = Math.floor(deltaY / 6);
        }
    }

    // Change Y Direction
    if (ballY >= canvas.height - 10 || ballY <= 10) {
        ballSpeedY = -ballSpeedY;
    }
}

function resetBall() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        winScreen = true;
    }

    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.floor(Math.random() * 20) - 9;
}

function drawNet() {
    for (var i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'grey');
    }
}

function draw() {
    colorRect(0, 0, canvas.width, canvas.height, 'black'); // Background

    // Score
    canvasContext.fillStyle = 'white';
    canvasContext.font = "30px Courier, monospace";
    canvasContext.fillText(player1Score, 10, 40);
    canvasContext.fillText(player2Score, canvas.width-40, 40);

    if (winScreen) {
        canvasContext.fillStyle = 'white';

        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText('You Won!', canvas.width / 2 - 60, canvas.height / 2 - 20);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText('The Computer Won...', canvas.width / 2 - 160, canvas.height / 2 - 20);
        }

        canvasContext.fillText('Click to Play Again', canvas.width / 2 - 160, canvas.height / 2 + 30);
        return;
    }

    drawNet();

    // Paddles
    colorRect(30, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); // Player Paddle
    colorRect(canvas.width-PADDLE_WIDTH-30, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); // Computer Paddle

    // Ball
    colorRect(ballX-5, ballY-5, 20, 20, 'white');
}

function colorRect(x, y, width, height, color) { // XY = TopLeft corner
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}