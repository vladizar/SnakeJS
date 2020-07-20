// Non-user settings
const timeoutOneSecond = 1000;
const chanceBanana = 0.20;
const chanceStrawberry = 0.10;
const chanceGrapes = 0.05;

// User-interactive objects
const gameField = document.querySelector('.game-field');
const gameArea = document.querySelector('.game-area');
const menuScreen = document.querySelector('.menu-screen');
const deathScreen = document.querySelector('.death-screen');
const gameSettingsLength = document.querySelector('.snake-start-length');
const gameSettingsDirection = document.querySelector('.snake-start-direction');
const gameSettingsSpeed = document.querySelector('.snake-start-speed');
const gameSettingsSpeedMultiplier = document.querySelector('.snake-speed-multiplier');
const gameSettingsView = document.querySelector('.snake-body-view');
const gameSettingsFieldSize = document.querySelector('.game-field-size');
const gameSettingsFieldInfinity = document.querySelector('.game-field-infinity');
const gameSettingsMaxFruitsNumber = document.querySelector('.game-max-fruits');
const gameSettingsFruitsSpawnInterval = document.querySelector('.fruits-spawn-delay');
const gameSettingsForm = document.querySelector('.game-settings-form');
const playAgainButton = document.querySelector('.play-again');
const goLobbyButton = document.querySelector('.go-lobby');
const deathScore = document.querySelector('.death-score');
const scoreCounter = document.querySelector('.score');

// Game variables
let fruits = [];
let snake = [];
let direction = "";
let score = 0;
let speed = 0;
let snakeStartLength = 0;
let increaseSpeedMultiplier = 0;
let gameFieldSize = 0;
let gameFieldInfinity = false;
let maxFruitsNumber = 0;
let fruitsSpawnerInterval = 0;
let game;
let fruitsSpawner;

// Special variable for swipe
let touchPositions = [{x: 0, y: 0}, {x: 0, y: 0}];

// Returns random integer between 0 and 'gameFieldSize' 
function getRandomPos() 
{
    return Math.floor(Math.random().toFixed(8) * (gameFieldSize + 1));
}

// returns  
function getChance() 
{
    return Math.random().toFixed(2);
}

// Returns true if element has correct position, if incorrect - false
function isAtValidPos(element, elementsArray = []) 
{
    // Store element position
    elementPosition = {
        x: element.style.gridColumnStart,
        y: element.style.gridRowStart
    }

    // If element is outside the 'gameField'
    if ((elementPosition.x > gameFieldSize || elementPosition.y > gameFieldSize) || (elementPosition.x < 1 || elementPosition.y < 1)) 
    {
        return false;
    }

    // If element is on snake position
    for (let i = 0; i < snake.length; i++) 
    {
        if (elementPosition.x == snake[i].style.gridColumnStart && elementPosition.y == snake[i].style.gridRowStart) 
        {
            return false;
        }
    }

    // If element is on 'elementsArray' element position
    for (let i = 0; i < elementsArray.length; i++) 
    {
        if (elementPosition.x == elementsArray[i].style.gridColumnStart && elementPosition.y == elementsArray[i].style.gridRowStart) 
        {
            return false;
        }
    }

    return true;
}

// Spawns a snake 'snakeStartLength' blocks width at 'snakeStartPoint' and 'snakeStartPoint'
// Starts on head, ends on tail
function spawnSnake() 
{
    const snakeStartPoint = Math.floor(gameFieldSize / 2);

    // Creates one snake block over iteration
    for (let i = 0; i < snakeStartLength; i++) 
    {
        // Create snake block, add it class
        let snakeBlock = document.createElement('div');
        snakeBlock.classList.add('snake-block');

        // Position block considering the 'direction' of snake, 
        // 'snakeStartPoint' and 'snakeStartPoint'
        switch (direction) 
        {
            case "right":
                snakeBlock.style.gridColumnStart = snakeStartPoint - i;
                snakeBlock.style.gridRowStart = snakeStartPoint;
                break;
            case "left":
                snakeBlock.style.gridColumnStart = snakeStartPoint + i;
                snakeBlock.style.gridRowStart = snakeStartPoint;
                break;
            case "up":
                snakeBlock.style.gridColumnStart = snakeStartPoint;
                snakeBlock.style.gridRowStart = snakeStartPoint + i;
                break;
            case "down":
                snakeBlock.style.gridColumnStart = snakeStartPoint;
                snakeBlock.style.gridRowStart = snakeStartPoint - i;
                break;
        }

        // Store created block
        snake.push(snakeBlock);
        
        // Show it on gamefield
        gameField.append(snakeBlock);
    }
}

// Spawns one fruit at random position
function spawnFruit(eaten = false) 
{
    if (fruits.length < maxFruitsNumber) 
    {
        // Create fruit
        let fruit = document.createElement('div');

        if (getChance() <= chanceGrapes) 
        {
            fruit.classList.add('grapes');
        }
        else if (getChance() <= chanceStrawberry) 
        {
            fruit.classList.add('strawberry');
        }
        else if (getChance() <= chanceBanana) 
        {
            fruit.classList.add('banana');
        }
        else if (eaten)
        {
            fruit.classList.add('apple-red');
        }
        else
        {
            fruit.classList.add('apple-yellow');
        }

        fruit.classList.add('fruit');

        // Position it on random place inside gamefield if it has correct position
        do
        {
            fruit.style.gridColumnStart = getRandomPos();
            fruit.style.gridRowStart = getRandomPos();
        }
        while (!isAtValidPos(fruit, fruits));

        // Store fruit
        fruits.push(fruit);

        // Show it on gamefield
        gameField.append(fruit);
    }
}

// Ads one block to the tail of the snake
function makeSnakeLonger() 
{
    // Create snake block
    let snakeBlock = document.createElement('div');
    snakeBlock.classList.add('snake-block');

    // Position it on the tail block
    snakeBlock.style.gridColumnStart = snake[snake.length - 1].style.gridColumnStart;
    snakeBlock.style.gridRowStart = snake[snake.length - 1].style.gridRowStart;

    // Store block
    snake.push(snakeBlock);
    
    // Show it on gamefield
    gameField.append(snakeBlock);
}

// Moves all snake blocks at one cell to 'direction'
// Returns false if something went wrong, else - true
function moveSnake() 
{
    // Iterate over snake blocks except head block
    for (let i = snake.length - 1; i > 0; i--) 
    {
        // Position snake block on the block in front of it
        snake[i].style.gridColumnStart = snake[i - 1].style.gridColumnStart;
        snake[i].style.gridRowStart = snake[i - 1].style.gridRowStart;
    }

    // Position snake head block considering the 'direction'
    switch (direction) 
    {
        case "right":
            if (snake[0].style.gridColumnStart == gameFieldSize) 
            {
                if (gameFieldInfinity) 
                {
                    snake[0].style.gridColumnStart = 1;
                    break;
                }
                else
                {
                    return false;
                }
            }
            snake[0].style.gridColumnStart++;
            break;
        case "left":
            if (snake[0].style.gridColumnStart == 1) 
            {
                if (gameFieldInfinity) 
                {
                    snake[0].style.gridColumnStart = gameFieldSize;
                    break;
                }
                else
                {
                    return false;
                }
            }
            snake[0].style.gridColumnStart--;
            break;
        case "up":
            if (snake[0].style.gridRowStart == 1) 
            {
                if (gameFieldInfinity) 
                {
                    snake[0].style.gridRowStart = gameFieldSize;
                    break;
                }
                else
                {
                    return false;
                }
            }
            snake[0].style.gridRowStart--;
            break;
        case "down":
            if (snake[0].style.gridRowStart == gameFieldSize) 
            {
                if (gameFieldInfinity) 
                {
                    snake[0].style.gridRowStart = 1;
                    break;
                }
                else
                {
                    return false;
                }
            }
            snake[0].style.gridRowStart++;
            break;
    }

    // Check for snake self hit
    if (isSnakeCollision(snake, 4))
    {
        return false;
    }

    return true;
}

// Returns collised element from array if any, else - false
function isSnakeCollision(elementsArray, startIndex = 0) 
{
    // Iterate over elements in array
    for (let i = startIndex; i < elementsArray.length; i++) 
    {
        // If element is collised with snake head block
        if (elementsArray[i].style.gridColumnStart == snake[0].style.gridColumnStart && elementsArray[i].style.gridRowStart == snake[0].style.gridRowStart) 
        {
            return {DOM: elementsArray[i], index: i};
        }
    }

    return false;
}

// Changes direction of snake if possible
function switchDirection(givenDirection) 
{
    if (game)
    {
        switch (givenDirection) 
        {
            case "ArrowUp":
                if (direction != "down" && Number(snake[0].style.gridRowStart) - 1 != snake[1].style.gridRowStart) 
                {
                    direction = "up";
                }
                break;
        
            case "ArrowDown":
                if (direction != "up" && Number(snake[0].style.gridRowStart) + 1 != snake[1].style.gridRowStart) 
                {
                    direction = "down";
                }
                break;
                
            case "ArrowLeft":
                if (direction != "right" && Number(snake[0].style.gridColumnStart) - 1 != snake[1].style.gridColumnStart) 
                {
                    direction = "left";
                }
                break;

            case "ArrowRight":
                if (direction != "left"  && Number(snake[0].style.gridColumnStart) + 1 != snake[1].style.gridColumnStart) 
                {
                    direction = "right";
                }
                break;
        }
    }
}

// Change direction of snake when user presses the arrow
document.onkeydown = function (evt) 
{
    switchDirection(evt.key);
}

// Change snake direction when users swipes
// When user started to swipe
document.addEventListener('touchstart', function (evt) 
{
    // Store swipe start points
    touchPositions[0].x = evt.changedTouches[0].pageX;
    touchPositions[0].y = evt.changedTouches[0].pageY;    
}, false);

// When user finished to swipe
document.addEventListener('touchend', function (evt) 
{
    if (game) 
    {
        // Store swipe end points
        touchPositions[1].x = evt.changedTouches[0].pageX;
        touchPositions[1].y = evt.changedTouches[0].pageY;

        // Store horizontal direction of swipe
        let horizontal = Math.abs(touchPositions[0].x - touchPositions[1].x) > Math.abs(touchPositions[0].y - touchPositions[1].y);
        
        // If swipe is horizontal and longer than 50px
        if (horizontal && Math.abs(touchPositions[0].x - touchPositions[1].x) > 50) 
        {
            // Store swipe direction and change snake direction
            let swipeDirection = (touchPositions[0].x > touchPositions[1].x) ? "ArrowLeft" : "ArrowRight";
            switchDirection(swipeDirection);
        }
        // If swipe is vertical and longer than 50px
        else if(Math.abs(touchPositions[0].y - touchPositions[1].y) > 50)
        {
            // Store swipe direction and change snake direction
            let swipeDirection = (touchPositions[0].y > touchPositions[1].y) ? "ArrowUp" : "ArrowDown";

            switchDirection(swipeDirection);
        }    
    }
}, false);

// Represents all actions for one frame
function gameFrame()
{
    // If snake hit herself or went out of 'gameField'
    if (!moveSnake()) 
    {
        // Stop the game
        clearInterval(game);
        clearInterval(fruitsSpawner);

        // Show deathScreen
        deathScreen.style.opacity = 1;
        deathScreen.style.zIndex = 2;
        deathScore.textContent = score;
    }

    // If snake eats an fruit
    let fruit = isSnakeCollision(fruits);
    if (fruit) 
    {
        // Remove eaten fruit from fruits array
        fruits.splice(fruit.index, 1);

        // Hide fruit on 'gameField'
        gameField.removeChild(fruit.DOM);

        // Increase snake length
        makeSnakeLonger();

        // Add score
        switch (fruit.DOM.classList[0]) 
        {
            case "apple-red":
                score += 2;
                break;
            case "apple-yellow":
                score++;
                break;
            case "banana":
                score += 3;
                break;
            case "strawberry":
                score += 5;
                break;
            case "grapes":
                score += 10;
                break;
        }

        // Increase speed
        speed += (score - scoreCounter.textContent) * increaseSpeedMultiplier;

        // Show new score to user
        scoreCounter.textContent = score;

        // Reset the game interval to increase speed
        clearInterval(game);
        game = setInterval(gameFrame, timeoutOneSecond / speed);

        // Spawn new fruit
        if (fruits.length == 0) 
        {
            spawnFruit(true);
        }
    }
}

// Starts the game
function startGame()
{  
    // Hide 'menuScreen'
    menuScreen.style.opacity = 0;
    menuScreen.style.zIndex = -1;

    // Hide 'deathScreen'
    deathScreen.style.opacity = 0;
    deathScreen.style.zIndex = -1;

    // Show 'gameArea' 
    gameArea.style.opacity = 1;
    gameArea.style.zIndex = 1;  

    // Clear 'gameField'
    gameField.innerHTML = "";

    // Clear game variables
    snake = [];
    fruits = [];
    score = 0;

    // Clear user-shown scores
    scoreCounter.textContent = 0;

    // Spawn snake
    spawnSnake();
    
    // Spawn fruit
    spawnFruit(true);  

    fruitsSpawner = setInterval(spawnFruit, fruitsSpawnerInterval);

    // Start game frame loop
    game = setInterval(gameFrame, timeoutOneSecond / speed);

    // Fix scroll
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
}

// Game code ended

// When browser loaded
window.onload = function () 
{
    // Show 'menuScreen'
    menuScreen.style.opacity = 1;
    menuScreen.style.zIndex = 1;

    // Hide 'gameArea'
    gameArea.style.opacity = 0;
    gameArea.style.zIndex = -1;
    
    // Hide 'deathScreen'
    deathScreen.style.opacity = 0;
    deathScreen.style.zIndex = -1;
};

// When user started the game
gameSettingsForm.onsubmit = function (evt)
{
    // Set game variables
    snakeStartLength = Number(gameSettingsLength.value);
    speed = Number(gameSettingsSpeed.value);
    increaseSpeedMultiplier = Number(gameSettingsSpeedMultiplier.value);
    gameFieldSize = Number(gameSettingsFieldSize.value);
    gameFieldInfinity = Boolean(Number(gameSettingsFieldInfinity.value));
    maxFruitsNumber = Number(gameSettingsMaxFruitsNumber.value);
    fruitsSpawnerInterval = Number(gameSettingsFruitsSpawnInterval.value) * timeoutOneSecond;
    direction = gameSettingsDirection.value;

    // Show game field
    gameField.style.gap = gameSettingsView.value;
    gameField.style.gridTemplateColumns = "repeat(" + String(gameFieldSize) + ", 1fr)";
    gameField.style.gridTemplateRows = "repeat(" + String(gameFieldSize) + ", 1fr)";    

    // Stop from sending form
    evt.preventDefault();

    // Start the game
    startGame();    
};

// When user pressed 'playAgainButton'
playAgainButton.onclick = function ()
{
    // Set game variables
    snakeStartLength = Number(gameSettingsLength.value);
    speed = Number(gameSettingsSpeed.value);
    direction = gameSettingsDirection.value;

    // Start the game
    startGame();    
};

// When user pressed 'goLobbyButton'
goLobbyButton.onclick = function ()
{
    // Show 'menuScreen'
    menuScreen.style.opacity = 1;
    menuScreen.style.zIndex = 1;

    // Hide 'gameArea'
    gameArea.style.opacity = 0;
    gameArea.style.zIndex = -1;

    // Hide 'deathScreen'
    deathScreen.style.opacity = 0;
    deathScreen.style.zIndex = -1;  

    // Unfix scroll
    document.body.style.overflow = "scroll";
    document.body.style.overflowX = "hidden";
    document.body.style.position = "relative";
};