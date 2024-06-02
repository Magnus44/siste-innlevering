const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 1330;
const PUCK_SIZE = 75;
const PUSHER_SIZE = 120;
const MIDDLE_LINE_WIDTH = 4;
const GOAL_WIDTH = 10;
const GOAL_HEIGHT = 150;
const friksjon = 0.993;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

let blueScore = 0;
let redScore = 0;
let player1Name = "";
let player2Name = "";


const ball = {
    x: CANVAS_WIDTH / 2 - 37.5,
    y: CANVAS_HEIGHT / 2 - 37.5,
    width: PUCK_SIZE,
    height: PUCK_SIZE,
    x_velocity: 0,
    y_velocity: 0,
    img: new Image()
};

const pusher1 = {
    x: 50,
    y: CANVAS_HEIGHT / 2 - 60,
    width: PUSHER_SIZE,
    height: PUSHER_SIZE,
    x_velocity: 0,
    y_velocity: 0,
    img: new Image()
};

const pusher2 = {
    x: 1150,
    y: CANVAS_HEIGHT / 2 - 60,
    width: PUSHER_SIZE,
    height: PUSHER_SIZE,
    x_velocity: 0,
    y_velocity: 0,
    img: new Image()
};

ball.img.src = "../bilder/puck.png";
pusher1.img.src = "../bilder/pusher2.png";
pusher2.img.src = "../bilder/pusher2.png";

function drawField() {
    ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
    ctx.fillRect(665, 0, 665, 600);

    ctx.fillStyle = "rgba(0, 0, 200, 0.7)";
    ctx.fillRect(0, 0, 665, 600);
    drawMiddleLine();
    drawGoals();
}

// Tegner midtlinjen
function drawMiddleLine() {
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.lineWidth = MIDDLE_LINE_WIDTH;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

// Tegner målene
function drawGoals() {
    ctx.fillStyle = "purple";
    ctx.fillRect(0, CANVAS_HEIGHT / 2 - GOAL_HEIGHT / 2, 10, GOAL_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - 10, CANVAS_HEIGHT / 2 - GOAL_HEIGHT / 2, 10, GOAL_HEIGHT);
}

function drawPusher1() {
    ctx.drawImage(pusher1.img, pusher1.x, pusher1.y, pusher1.width, pusher1.height);
}

function drawPusher2() {
    ctx.drawImage(pusher2.img, pusher2.x, pusher2.y, pusher2.width, pusher2.height);
}

function drawBall() {
    ctx.drawImage(ball.img, ball.x, ball.y, ball.width, ball.height);
}
function updateScore() {
    document.getElementById('redgoal').innerText = blueScore;
    document.getElementById('bluegoal').innerText = redScore;
}


let nedtellingStartet = false;

function keydownHandler(event) {
    const key = event.key.toLowerCase(); // Konverter til små bokstaver


    if (!nedtellingStartet) {
        return;
    }

    if (key === "w") {
        pusher1.y_velocity = -7; 
    } else if (key === "s") {
        pusher1.y_velocity = 7;
    } else if (key === "a") {
        pusher1.x_velocity = -7; 
    } else if (key === "d") {
        pusher1.x_velocity = 7; 
    } else if (key === "arrowup") {
        pusher2.y_velocity = -7; 
    } else if (key === "arrowdown") {
        pusher2.y_velocity = 7; 
    } else if (key === "arrowleft") {
        pusher2.x_velocity = -7; 
    } else if (key === "arrowright") {
        pusher2.x_velocity = 7; 
    }
}

function keyupHandler(event) {
    const key = event.key.toLowerCase();


    if (!nedtellingStartet) {
        return;
    }

    if (key === "w" || key === "s") {
        pusher1.y_velocity = 0; 
    } else if (key === "a" || key === "d") {
        pusher1.x_velocity = 0; 
    } else if (key === "arrowup" || key === "arrowdown") {
        pusher2.y_velocity = 0; 
    } else if (key === "arrowleft" || key === "arrowright") {
        pusher2.x_velocity = 0; 
    }
}

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);

// Funksjon for å sjekke kollisjon mellom to sirkler
function checkCollision(circle1, circle2) {
    const dx = (circle1.x + circle1.width / 2) - (circle2.x + circle2.width / 2);
    const dy = (circle1.y + circle1.height / 2) - (circle2.y + circle2.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (circle1.width / 2 + circle2.width / 2);
}

// Elastisk kollisjonsbehandling mellom ball og pusher
function handleCollision(ball, pusher) {
    const dx = ball.x + ball.width / 2 - (pusher.x + pusher.width / 2);
    const dy = ball.y + ball.height / 2 - (pusher.y + pusher.height / 2);
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance < (ball.width / 2 + pusher.width / 2)) {
        // Beregn overlappingsavstand
        const overlap = (ball.width / 2 + pusher.width / 2) - distance;
        const normX = dx / distance;
        const normY = dy / distance;

        // Skyv ballen ut av overlapp
        ball.x += normX * overlap / 2;
        ball.y += normY * overlap / 2;

        // Skyv pusheren ut av overlapp
        pusher.x -= normX * overlap / 2;
        pusher.y -= normY * overlap / 2;

        // Beregn relative hastigheter
        const relVelocityX = ball.x_velocity - pusher.x_velocity;
        const relVelocityY = ball.y_velocity - pusher.y_velocity;
        const dotProduct = relVelocityX * normX + relVelocityY * normY;

        // Oppdater hastigheter etter kollisjon
        ball.x_velocity -= 2 * dotProduct * normX;
        ball.y_velocity -= 2 * dotProduct * normY;
    }
}

let countdownInterval;
let gameEnded = false;

function countdown(minutes, seconds) {
    function tick() {
        var teller = document.getElementById("timer");
        teller.innerHTML =
            minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
        seconds--;
        if (seconds >= 0) {
            Nedtelling = setTimeout(tick, 1000);
        } else {
            if (minutes >= 1) {
                setTimeout(function () {
                    countdown(minutes - 1, 59);
                }, 1000);
            } else {
                endGame()
            }
        }
    }
    tick();
}



function resetBall() {
    ball.x = CANVAS_WIDTH / 2 - ball.width / 2;
    ball.y = CANVAS_HEIGHT / 2 - ball.height / 2;
    ball.x_velocity = 0;
    ball.y_velocity = 0;
}

function updateItems() {
    ball.x += ball.x_velocity;
    ball.y += ball.y_velocity;

    ball.x_velocity *= friksjon;
    ball.y_velocity *= friksjon;

    // Sjekk om ballen går i målet
    if (ball.x <= GOAL_WIDTH && ball.y + ball.height / 2 >= CANVAS_HEIGHT / 2 - GOAL_HEIGHT / 2 && ball.y + ball.height / 2 <= CANVAS_HEIGHT / 2 + GOAL_HEIGHT / 2) {
        redScore++;
        resetBall();
    }

    if (ball.x + ball.width >= CANVAS_WIDTH - GOAL_WIDTH && ball.y + ball.height / 2 >= CANVAS_HEIGHT / 2 - GOAL_HEIGHT / 2 && ball.y + ball.height / 2 <= CANVAS_HEIGHT / 2 + GOAL_HEIGHT / 2) {
        blueScore++;
        resetBall();
    }

    // Sjekk grenser for ballen
    if (ball.x + ball.width > CANVAS_WIDTH) {
        ball.x = CANVAS_WIDTH - ball.width;
        ball.x_velocity = -ball.x_velocity;
    }
    if (ball.x < 0) {
        ball.x = 0;
        ball.x_velocity = -ball.x_velocity;
    }
    if (ball.y + ball.height > CANVAS_HEIGHT) {
        ball.y = CANVAS_HEIGHT - ball.height;
        ball.y_velocity = -ball.y_velocity;
    }
    if (ball.y < 0) {
        ball.y = 0;
        ball.y_velocity = -ball.y_velocity;
    }

    pusher1.x += pusher1.x_velocity;
    pusher1.y += pusher1.y_velocity;

    // Sjekk grenser for pusher 1
    if (pusher1.x + pusher1.width > CANVAS_WIDTH / 2) {
        pusher1.x = CANVAS_WIDTH / 2 - pusher1.width; 
        pusher1.x_velocity = 0;
    }
    if (pusher1.x < 0) {
        pusher1.x = 0; 
        pusher1.x_velocity = 0;
    }
    if (pusher1.y + pusher1.height > CANVAS_HEIGHT) {
        pusher1.y = CANVAS_HEIGHT - pusher1.height; 
        pusher1.y_velocity = 0;
    }
    if (pusher1.y < 0) {
        pusher1.y = 0; 
        pusher1.y_velocity = 0;
    }

    pusher2.x += pusher2.x_velocity;
    pusher2.y += pusher2.y_velocity;

    // Sjekk grenser for pusher 2
    if (pusher2.x < CANVAS_WIDTH / 2) {
        pusher2.x = CANVAS_WIDTH / 2; 
        pusher2.x_velocity = 0;
    }
    if (pusher2.x + pusher2.width > CANVAS_WIDTH) {
        pusher2.x = CANVAS_WIDTH - pusher2.width; 
        pusher2.x_velocity = 0;
    }
    if (pusher2.y + pusher2.height > CANVAS_HEIGHT) {
        pusher2.y = CANVAS_HEIGHT - pusher2.height; 
        pusher2.y_velocity = 0;
    }
    if (pusher2.y < 0) {
        pusher2.y = 0; 
        pusher2.y_velocity = 0;
    }
}
let trueFalse = true
function fpsTestTrue() {
    trueFalse = false
}
function fpsTest() {
    if (trueFalse) {
        console.log("update")
    }
}

function update() {

    // Fysikken:
    updateItems();
    handleCollision(ball, pusher1);
    handleCollision(ball, pusher2);

    // Tegn ballen og pushere
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawField();
    drawBall();
    drawPusher1();
    drawPusher2();
    updateScore()

    fpsTest()
    setTimeout(fpsTestTrue, 1000)





    requestAnimationFrame(update);
}

function endGame() {
    clearTimeout(Nedtelling)
    nedtellingStartet = false

    let playerName, score
    if (blueScore > redScore) {
        playerName = player1Name
        score = blueScore - redScore
    } else {
        playerName = player2Name
        score = redScore - blueScore
    }

    checkHigh()
    // Send high score og player til API-et

    document.getElementById('endboks').style.display = 'block'
    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('endboks').style.display = 'none'
        location.reload() // Restart the game
    })
}

function checkHigh() {
    setTimeout(function () {
        if (score > playerArr[4].hs) {
            postRequest(score, playerName)
        }
 
        playerArr = []
        pullNames()
    }, 1000);
}


document.getElementById("tilbake").addEventListener("click", function(){
    document.location = "forside.html";
});


document.getElementById("tilLeaderboard").addEventListener("click", function(){
    document.location = "Leaderboard.html";
});

document.getElementById('startButton').addEventListener('click', () => {
    player1Name = document.getElementById('player1').value || 'Blå Spiller';
    player2Name = document.getElementById('player2').value || 'Rød Spiller';
    console.log(player1Name)
    console.log(player2Name)
    document.getElementById('spiller1').innerText = player1Name;
    document.getElementById('spiller2').innerText = player2Name;
    document.getElementById('startboks').style.display = 'none';
    setTimeout(() => {
        countdown(2, 0);
        nedtellingStartet = true;
        gameEnded = false; // Reset game ended flag for a new game
    }, 4000); 


});


update();

window.onload = () => {
    document.getElementById('startboks').style.display = 'block';
}

// postHS("Magnus", 200)

