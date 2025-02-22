document.addEventListener("DOMContentLoaded", () => {
    const bird = document.getElementById("bird");
    const gameContainer = document.getElementById("game-container");
    const scoreDisplay = document.getElementById("score");
    const startMessage = document.getElementById("start-message");

    const backgroundMusic = document.getElementById("background-music");
    const jumpSound = document.getElementById("jump-sound");
    const hitSound = document.getElementById("hit-sound");

    let gravity = 0.4;
    let velocity = 0;
    let isGameRunning = false;
    let pipes = [];
    let score = 0;
    let gameSpeed = 1;
    let pipeInterval;

    function startGame() {
        isGameRunning = true;
        startMessage.style.display = "none";
        score = 0;
        scoreDisplay.innerText = score;
        bird.style.top = "50%";
        velocity = 0;
        pipes.forEach(pipe => pipe.remove());
        pipes = [];
        gameLoop();
        createPipe();
        pipeInterval = setInterval(createPipe, 2000);

        // Fon musiqasini qayta yoqish
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
    }

    function gameLoop() {
        if (!isGameRunning) return;

        velocity += gravity;
        bird.style.top = (bird.offsetTop + velocity) + "px";

        if (bird.offsetTop <= 0 || bird.offsetTop + bird.clientHeight >= gameContainer.clientHeight) {
            gameOver();
        }

        movePipes();
        detectCollision();
        requestAnimationFrame(gameLoop);
    }

    function jump() {
        velocity = -7;
        jumpSound.currentTime = 0;
        jumpSound.play();
    }

    function createPipe() {
        if (!isGameRunning) return;

        let pipeGap = 300;
        let minHeight = 150;
        let maxHeight = gameContainer.clientHeight - pipeGap - minHeight;
        let pipeHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        
        let topPipe = document.createElement("div");
        topPipe.classList.add("pipe", "top");
        topPipe.style.height = pipeHeight + "px";
        topPipe.style.left = "100vw";

        let bottomPipe = document.createElement("div");
        bottomPipe.classList.add("pipe", "bottom");
        bottomPipe.style.height = (gameContainer.clientHeight - pipeHeight - pipeGap) + "px";
        bottomPipe.style.left = "100vw";

        gameContainer.appendChild(topPipe);
        gameContainer.appendChild(bottomPipe);
        pipes.push(topPipe, bottomPipe);
    }

    function movePipes() {
        pipes.forEach(pipe => {
            let pipeLeft = pipe.offsetLeft;
            pipe.style.left = (pipeLeft - gameSpeed) + "px";

            if (pipeLeft < -80) {
                pipe.remove();
                pipes = pipes.filter(p => p !== pipe);
                score++;
                scoreDisplay.innerText = score;
            }
        });
    }

    function detectCollision() {
        pipes.forEach(pipe => {
            let birdRect = bird.getBoundingClientRect();
            let pipeRect = pipe.getBoundingClientRect();

            if (
                birdRect.left < pipeRect.left + pipeRect.width &&
                birdRect.left + birdRect.width > pipeRect.left &&
                birdRect.top < pipeRect.top + pipeRect.height &&
                birdRect.top + birdRect.height > pipeRect.top
            ) {
                gameOver();
            }
        });
    }

    function gameOver() {
        isGameRunning = false;
        startMessage.style.display = "block";
        startMessage.innerText = "Game Over! Press ENTER to Restart";
        clearInterval(pipeInterval);

        // Urilish tovushini o‘ynatish
        hitSound.currentTime = 0;
        hitSound.play();

        // Fon musiqani to‘xtatish
        backgroundMusic.pause();
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !isGameRunning) {
            startGame();
        }
        if (event.key === " " || event.key === "ArrowUp") {
            jump();
        }
    });
});
