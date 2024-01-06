
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: canvas.height / 3,
    width: 40,
    height: 40,
    color: '#FF0000',
    velocity: 4, 
    gravity: 0.15, 
    jumpStrength: 5 
};

const towers = [];
const towerWidth = 50;
const towerHeight = 150;
const towerGap = 200;
let towerSpeed = 2;

let score = 0;
let countdown = 5;
let gameStarted = false;

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('endGameScreen').style.display = 'none';
    setTimeout(() => {
        gameStarted = true;
        addTower();
        updateGameArea();
    }, 1000); //delay before start 
}

function openShop() {
    alert('Shop feature coming soon!');
}

function openSettings() {
    document.getElementById('settingsMenu').style.display = 'block';
}


function quitGame() {
    document.location.reload();
}


let gravityInput = document.getElementById('gravityInput');

function applySettings() {
    bird.velocity = parseInt(document.getElementById('velocityInput').value, 10);
    bird.gravity = parseFloat(gravityInput.value);
    
    const difficulty = document.getElementById('difficultySelect').value;
    if (difficulty === 'easy') {
        towerSpeed = 1;
    } else if (difficulty === 'moderate') {
        towerSpeed = 2;
    } else if (difficulty === 'extreme') {
        towerSpeed = 3;
    }

    const colorPalette = document.getElementById('colorSelect').value;
    updateColorPalette(colorPalette);

    closeSettings();
}


function closeSettings() {
    document.getElementById('settingsMenu').style.display = 'none';
}

function updateColorPalette(colorPalette) {
    if (colorPalette === 'dark') {
        document.body.style.backgroundColor = '#333';
    } else {
        document.body.style.backgroundColor = '#87CEEB';
    }
}

function drawBird() {
    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawTowers() {
    ctx.fillStyle = '#00FF00'; // Tower color
    for (let i = 0; i < towers.length; i++) {
        ctx.fillRect(towers[i].x, 0, towerWidth, towers[i].height);
        ctx.fillRect(towers[i].x, towers[i].bottom, towerWidth, canvas.height - towers[i].bottom);
    }
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawCountdown() {
    ctx.fillStyle = '#000';
    ctx.font = '60px Arial';
    ctx.fillText(countdown, canvas.width / 2 - 20, canvas.height / 2);
}

function drawEndGameScreen() {
    document.getElementById('endGameScreen').style.display = 'block';
    document.getElementById('scoreDisplay').innerText = `Score: ${score}`;
}

function updateGameArea() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //handle countdown at the start
    if (!gameStarted) {
        drawCountdown();
        countdown--;

        if (countdown <= 0) {
            gameStarted = true;
            countdown = 5;
            requestAnimationFrame(updateGameArea);
        } else {
            requestAnimationFrame(updateGameArea);
            return;
        }
    }

    //update bird position
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    //tower collision check
    if (checkCollision()) {
        drawEndGameScreen();
        return;
    }

    //movetowers
    for (let i = 0; i < towers.length; i++) {
        towers[i].x -= towerSpeed;

        //new towers
        if (towers[i].x + towerWidth < 0) {
            towers.splice(i, 1);
            score++;
            addTower();
        }
    }

    //elements
    drawTowers();
    drawBird();
    drawScore();

    requestAnimationFrame(updateGameArea);
}

function addTower() {
    const minHeight = 50;
    const maxHeight = canvas.height - towerGap - minHeight;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    towers.push({ x: canvas.width, height: height, bottom: height + towerGap });
}

function checkCollision() {
    //tower collision
    for (let i = 0; i < towers.length; i++) {
        if (
            (bird.x < towers[i].x + towerWidth &&
            bird.x + bird.width > towers[i].x &&
            (bird.y < towers[i].height || bird.y + bird.height > towers[i].bottom))
        ) {
            return true;
        }
    }

    //canvas collision
    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        return true;
    }

    return false;
}

function restartGame() {
    gameStarted = false;
    score = 0;
    bird.y = canvas.height / 3;
    towers.length = 0;
    document.getElementById('endGameScreen').style.display = 'none';
    startGame();
}

//jump click event
document.addEventListener('click', () => {
    if (gameStarted) {
        bird.velocity = -bird.jumpStrength;
    }
});

// Show the menu initially
document.getElementById('menu').style.display = 'block';
