// GLOBAL VARIABLES

// Non-user settings
const timeoutOneSecond = 1000;
const chanceBanana = 0.20;
const chanceStrawberry = 0.10;
const chanceGrapes = 0.05;
const appleYellowPoints = 1;
const appleRedPoints = 2;
const bananaPoints = 3;
const strawberryPoints = 5;
const grapesPoints = 10;
const waterHitPoints = -5;
const crashGameAttempts = 100;
const swipeLength = 30;

// Game variables
let gameFrames;
let fruitsSpawn;
let fruits = [];
let snake = [];
let water = [];
let gameSettings = {};
let direction = "";
let score = 0;
let highScore = 0;
let speed = 0;

// Special variable for swipe
let touchPositions = [{x: 0, y: 0}, {x: 0, y: 0}];

// Game objects DOMs
// On game screen
const gameField = gameScreen.querySelector('.game-screen__field');
const scoreCounter = gameScreen.querySelector('.game-screen__score');

// On death screen
const deathScore = deathScreen.querySelector('.death-screen__score');

// On pause screen
const pauseContent = pauseScreen.querySelector('.pause-screen__wrapper');
const pauseCountdown = pauseScreen.querySelector('.pause-screen__countdown');
const pauseCountdownNumbers = pauseCountdown.querySelectorAll('.countdown__number');
const pauseScore = pauseScreen.querySelector('.pause-screen__score');
const pauseHighScore = pauseScreen.querySelector('.pause-screen__score_highest');

// GAME LOGIC

// GLOBAL ELEMENTS ACTIONS

// Spawns element with 'elemClasses' classes, on 'elemPosX' and 'elemPosY' position, adding to 'elemArray' array
function spawnElement(elemClasses, elemPosX, elemPosY, elemArray)
{
    // Store new element
    const element = document.createElement('div');

    // Add classes
    for (const elemClass of elemClasses)
    {
        element.classList.add(elemClass);
    }

    // Position it
    element.style.gridColumnStart = elemPosX;
    element.style.gridRowStart = elemPosY;

    // Add to array
    elemArray.push(element);

    // Appear on field
    gameField.append(element);
}

// Removes element from game field and it's array
function removeElement(elemArray, elemIndex)
{
    // Remove element from field
    gameField.removeChild(elemArray[elemIndex]);

    // Remove from array
    elemArray.splice(elemIndex, 1);
}

// Moves element to 'elemPosX' and 'elemPosY' position
function moveElement(elem, elemPosX, elemPosY)
{
    elem.style.gridColumnStart = elemPosX;
    elem.style.gridRowStart = elemPosY;
}

// Checks if position is on game field
function isOnfieldPosition(posX, posY)
{
    if ((posX > gameSettings["gameFieldSize"] || posY > gameSettings["gameFieldSize"]) || (posX < 1 || posY < 1))
    {
        return false;
    }

    return true;
}

// Checks given position collisions with any array element of 'elemsArrayArray', ignoring 'ignorElems' indexes
// If there is a collision, returns first found element index in it's array
function isPositionCollisions(posX, posY, elemsArrayArray, ignorElems = [-1])
{
    // Iterate over elements arrays array
    for (const elemsArray of elemsArrayArray)
    {
        // Iterate over elements in elements array
        for (let i = 0; i < elemsArray.length; i++)
        {
            // Store current element
            const elem = elemsArray[i];

            // If it's position collise with checking position
            if (elem.style.gridColumnStart == posX && elem.style.gridRowStart == posY)
            {
                // If element should be ignored - ignore, else return it's index
                if (ignorElems[i] == i) { continue; }

                return i;
            }
        }
    }

    return false;
}

// FRUITS

// MATHS FUNCTIONS

// Returns random integer value between 0 and 'maxValue'
function getRandomInt(maxValue)
{
    return Math.floor(Math.random().toFixed(8) * (maxValue + 1));
}

// Returns random chance between 0% and 99% as (0.**)
function getChance() 
{
    return Math.random().toFixed(2);
}

// Returns random x and y positions between 1 and 'gameFieldSize', prevents position collisions
function getRandomFieldPosition()
{
    let position = {"x": 0, "y": 0};
    let collision;
    let attempts = 0;
    do
    {
        if (++attempts > crashGameAttempts) { endGame(); }

        position.x = getRandomInt(gameSettings["gameFieldSize"]);
        position.y = getRandomInt(gameSettings["gameFieldSize"]);
        collision = isPositionCollisions(position.x, position.y, [fruits, snake, water]);
    }
    while (collision || collision === 0 || !isOnfieldPosition(position.x, position.y));

    return position;
}

// FRUITS LOGIC

// Returns fruit name considering their chances
function chooseRandomFruit()
{
    if (getChance() <= chanceGrapes) { return 'grapes'; }
    else if (getChance() <= chanceStrawberry) { return 'strawberry'; }
    else if (getChance() <= chanceBanana) { return 'banana'; }
    else if (fruits.length == gameSettings["minFruitsNumber"] - 1) { return 'apple-red'; }
    else { return 'apple-yellow'; }
}

// Increments score considering fruit name
function addFruitScore(fruitClass)
{
    switch (fruitClass)
    {
        case "apple-yellow":
            score += appleYellowPoints;
            break;
    
        case "apple-red":
            score += appleRedPoints;
            break;

        case "banana":
            score += bananaPoints;
            break;
    
        case "strawberry":
            score += strawberryPoints;
            break;
    
        case "grapes":
            score += grapesPoints;
            break;
    }

    if (score > highScore) { highScore = score; }
}

// Spawns a fruit (if their number is less than 'maxFruitsNumber') with random name considering it's chance on random game field position
function spawnFruit()
{
    // If fruits number is less than their max number
    if (fruits.length < gameSettings["maxFruitsNumber"])
    {
        // Store fruit positon if it is on game field and there is no collisions with snake body
        let position = getRandomFieldPosition();

        // Store random fruit name considering their chances
        fruitClass = chooseRandomFruit();

        // Appear it on the game field
        spawnElement(["fruit", fruitClass], position.x, position.y, fruits);
    }
}

// WATER LOGIC

function spawnWater()
{
    const comfortableObstacleDistance = gameSettings["speed"] * 3;
    let position = getRandomFieldPosition();
    switch (gameSettings["direction"])
    {
        case "ArrowRight":
            if (position.y == snake[0].style.gridRowStart && position.x > snake[0].style.gridColumnStart - gameSettings["snakeLength"] && position.x < Number(snake[0].style.gridColumnStart) + comfortableObstacleDistance)
            {
                position.y += 1;
            }
            break;
    
        case "ArrowLeft":
            if (position.y == snake[0].style.gridRowStart && position.x < snake[0].style.gridColumnStart - gameSettings["snakeLength"] && position.x > Number(snake[0].style.gridColumnStart) - comfortableObstacleDistance)
            {
                position.y += 1;
            }
            break;

        case "ArrowUp":
            if (position.x == snake[0].style.gridColumnStart && position.y < snake[0].style.gridRowStart - gameSettings["snakeLength"] && position.y > Number(snake[0].style.gridRowStart) - comfortableObstacleDistance)
            {
                position.x += 1;
            }
            break;
    
        case "ArrowDown":
            if (position.x == snake[0].style.gridColumnStart && position.y > snake[0].style.gridRowStart - gameSettings["snakeLength"] && position.y < Number(snake[0].style.gridRowStart) + comfortableObstacleDistance)
            {
                position.x += 1;
            }
            break;
    }
    spawnElement(['water'], position.x, position.y, water);
}

// SNAKE

// DIRECTION CHANGE

// Change snake direction when users swipes
// When user started swipe
document.addEventListener('touchstart', function (evt) 
{
    // Store swipe start points
    touchPositions[0].x = evt.changedTouches[0].pageX;
    touchPositions[0].y = evt.changedTouches[0].pageY;    
}, false);

// When user finished swipe
document.addEventListener('touchend', function (evt) 
{
    // Store swipe end points
    touchPositions[1].x = evt.changedTouches[0].pageX;
    touchPositions[1].y = evt.changedTouches[0].pageY;

    // Store horizontal or not direction of swipe
    let horizontal = Math.abs(touchPositions[0].x - touchPositions[1].x) > Math.abs(touchPositions[0].y - touchPositions[1].y);
    
    // If swipe is horizontal and longer than 'swipeLength'
    if (horizontal && Math.abs(touchPositions[0].x - touchPositions[1].x) > swipeLength) 
    {
        // Store swipe direction and change snake direction
        let swipeDirection = (touchPositions[0].x > touchPositions[1].x) ? "ArrowLeft" : "ArrowRight";
        switchDirection(swipeDirection);
    }
    // If swipe is vertical and longer than 'swipeLength'
    else if(Math.abs(touchPositions[0].y - touchPositions[1].y) > swipeLength)
    {
        // Store swipe direction and change snake direction
        let swipeDirection = (touchPositions[0].y > touchPositions[1].y) ? "ArrowUp" : "ArrowDown";
        switchDirection(swipeDirection);
    }
    else { pauseGame(); }
}, false);

// When user pressed any key
window.onkeydown = function (evt)
{
    // Change direction if possible
    switchDirection(evt.key);
}

// Switches direction if possible
function switchDirection(newDirection)
{
    if (gameFrames)
    {
        switch (newDirection)
        {
            case "ArrowRight":
                direction = (Number(snake[0].style.gridColumnStart) + 1 == snake[1].style.gridColumnStart) ? direction : newDirection;
                break;

            case "ArrowLeft":
                direction = (Number(snake[0].style.gridColumnStart) - 1 == snake[1].style.gridColumnStart) ? direction : newDirection;
                break;

            case "ArrowUp":
                direction = (Number(snake[0].style.gridRowStart) - 1 == snake[1].style.gridRowStart) ? direction : newDirection;
                break;

            case "ArrowDown":
                direction = (Number(snake[0].style.gridRowStart) + 1 == snake[1].style.gridRowStart) ? direction : newDirection;
                break;
        }
    }
}

// SNAKE LOGIC

// Spawns snake 'snakeLength' length and looking head in 'direction' direction on the center of game field
function spawnSnake(snakeLength, direction)
{
    // Store snake head position
    let snakePosX = snakePosY = Math.floor(gameSettings["gameFieldSize"] / 2);

    // Spawn snake head
    spawnElement(['snake-block', 'snake-block_head'], snakePosX, snakePosY, snake);

    // Spawn snake body considering the direction and length
    for (let i = 1; i < snakeLength; i++)
    {
        switch (direction)
        {
            case "ArrowRight":
                spawnElement(['snake-block'], snakePosX - i, snakePosY, snake);
                break;

            case "ArrowLeft":
                spawnElement(['snake-block'], snakePosX + i, snakePosY, snake);
                break;

            case "ArrowUp":
                spawnElement(['snake-block'], snakePosX, snakePosY + i, snake);
                break;

            case "ArrowDown":
                spawnElement(['snake-block'], snakePosX, snakePosY - i, snake);
                break;
        }
    }
}

// Moves snake, starting with last snake body part, ending with head, considering the direction, ends the game if snake is outside of game field
function moveSnake()
{
    // Move each body part to body part in front of position
    if (snake.length - 1)
    {
        for (let i = snake.length - 1; i > 0; i--)
        {
            moveElement(snake[i], snake[i - 1].style.gridColumnStart, snake[i - 1].style.gridRowStart);
        }
    }
    else { endGame(); }

    // Move snake head considering the direction
    switch (direction)
    {
        case "ArrowRight":
            if (isOnfieldPosition(Number(snake[0].style.gridColumnStart) + 1, 1))
            {
                snake[0].style.gridColumnStart++;
            }
            else if (gameSettings["gameFieldInfinity"]) { snake[0].style.gridColumnStart = 1; }
            else { endGame(); }

            break;

        case "ArrowLeft":
            if (isOnfieldPosition(Number(snake[0].style.gridColumnStart) - 1, 1))
            {
                snake[0].style.gridColumnStart--;
            }
            else if (gameSettings["gameFieldInfinity"]) { snake[0].style.gridColumnStart = gameSettings["gameFieldSize"]; }
            else { endGame(); }

            break;

        case "ArrowUp":
            if (isOnfieldPosition(1, Number(snake[0].style.gridRowStart) - 1))
            {
                snake[0].style.gridRowStart--;
            }
            else if (gameSettings["gameFieldInfinity"]) { snake[0].style.gridRowStart = gameSettings["gameFieldSize"]; }
            else { endGame(); }

            break;

        case "ArrowDown":
            if (isOnfieldPosition(1, Number(snake[0].style.gridRowStart) + 1))
            {
                snake[0].style.gridRowStart++;
            }
            else if (gameSettings["gameFieldInfinity"]) { snake[0].style.gridRowStart = 1; }
            else { endGame(); }

            break;
    }
}

// GAME CONTROLS

// Starts the game with 'animationDuration' delay
function startGame(animationDuration = 0)
{
    // Show game screen
    gameScreen.style.display = "";

    // When animation has gone
    setTimeout(() =>
    {
        // Hide menu and death screens
        menuScreen.style.display = deathScreen.style.display = pauseScreen.style.display = "none";

        // Start game
        gameFrames = setInterval(gameFrame, timeoutOneSecond / speed);
    }, animationDuration);

    // Set up game field size and snake view
    gameField.style.gridTemplateRows = gameField.style.gridTemplateColumns = "repeat(" + gameSettings["gameFieldSize"] + ", 1fr)";
    gameField.style.gridGap = gameSettings["snakeView"];

    // Clear game field and variables
    gameField.innerHTML = "";
    speed = gameSettings["speed"];
    direction = gameSettings["direction"];
    score = highScore = scoreCounter.textContent = 0;
    snake = [];
    fruits = [];
    water = [];

    // Spawn snake
    spawnSnake(gameSettings["snakeLength"], direction);

    // Spawn fruit
    for (let i = 0; i < gameSettings["minFruitsNumber"]; i++)
    {
        spawnFruit();
    }

    while (water.length < gameSettings["waterAreaSize"])
    {
        spawnWater();
    }

    // Set up fruits spawner
    fruitsSpawn = setInterval(spawnFruit, timeoutOneSecond * gameSettings["fruitsSpawnInterval"]);
}

// Stops the game
function endGame()
{
    // Stop game procceses
    clearInterval(gameFrames);
    clearInterval(fruitsSpawn);
    gameFrames = false;

    // Change death score counter
    deathScore.textContent = highScore;

    // Hide menu, show game screen with death screen
    menuScreen.style.display = pauseScreen.style.display = "none";
    deathScreen.style.display = gameScreen.style.display = "";
}

// Pauses the game
function pauseGame()
{
    if (gameFrames)
    {
        // Stop game procceses
        clearInterval(gameFrames);
        clearInterval(fruitsSpawn);

        // Change score counters
        pauseScore.textContent = score;
        pauseHighScore.textContent = highScore;

        // Hide menu and death screens, show game screen with pause screen
        menuScreen.style.display = deathScreen.style.display = pauseCountdown.style.display = "none";
        pauseScreen.style.display = pauseContent.style.display = gameScreen.style.display = "";
    }
}

// Continues the game
function continueGame()
{
    pauseContent.style.display = "none";
    pauseCountdown.style.display = "";

    let i = 0;
    pauseCountdownNumbers[i].style.display = "";

    let countdown = setInterval(() =>
    {
        i++;

        pauseCountdownNumbers[i - 1].style.display = "none";
        pauseCountdownNumbers[i].style.display = "";
    }, 1100);

    // When animation has gone
    setTimeout(() =>
    {
        clearInterval(countdown);

        // Hide menu, death and pause screens
        menuScreen.style.display = pauseScreen.style.display = pauseCountdown.style.display = deathScreen.style.display = "none";

        // Start game
        gameFrames = setInterval(gameFrame, timeoutOneSecond / speed);

        // Set up fruits spawner
        fruitsSpawn = setInterval(spawnFruit, timeoutOneSecond * gameSettings["fruitsSpawnInterval"]);
    }, 3300);
}

// Changes speed considering 'changeByValue'
function changeSpeed(changeByValue)
{
    if (speed + changeByValue > gameSettings["speed"])
    {
        speed += changeByValue;
        clearInterval(gameFrames);
        gameFrames = setInterval(gameFrame, timeoutOneSecond / speed);
    }
}

// Represetns one game frame, moves snake, stops game and change score if needed, 
function gameFrame()
{
    // Moves snake
    moveSnake();

    // If snake hits herself stop the game
    let selfHitPlace = isPositionCollisions(snake[0].style.gridColumnStart, snake[0].style.gridRowStart, [snake], [0, 1, 2, 3])
    if (selfHitPlace)
    {
        if (gameSettings["snakeSelfDestruct"])
        {
            for (let i = snake.length - 1; i >= selfHitPlace; i--)
            {
                let timeout = (timeoutOneSecond / speed) * (snake.length - 1 - i) / 8;
                setTimeout(() =>
                {
                    snake[i].classList.add("snake-block_damaged");
                    setTimeout(() =>
                    {
                        removeElement(snake, i);
                        if (score)
                        {
                            changeSpeed(-gameSettings["speedMultiplier"]);
                            scoreCounter.textContent = --score;
                        }
                    }, timeout / 1.5);
                }, timeout);
            }
        }
        else
        {
            endGame();
        }
    }

    // If snake eats any fruit
    let eatenFruit = isPositionCollisions(snake[0].style.gridColumnStart, snake[0].style.gridRowStart, [fruits]);
    if (eatenFruit || eatenFruit === 0)
    {
        // Increment score
        addFruitScore(fruits[eatenFruit].classList[1]);

        // Increment speed
        changeSpeed((score - scoreCounter.textContent) * gameSettings["speedMultiplier"]);

        // Show new score to user
        scoreCounter.textContent = score;

        // Remove eaten fruit and make snake longer
        removeElement(fruits, eatenFruit);
        spawnElement(['snake-block'], snake[snake.length - 1].style.gridColumnStart, snake[snake.length - 1].style.gridRowStart, snake);

        // Spawn new fruit if there is no others
        if (fruits.length < gameSettings["minFruitsNumber"]) { spawnFruit(); }
    }

    let waterHit = isPositionCollisions(snake[0].style.gridColumnStart, snake[0].style.gridRowStart, [water]);
    if (waterHit || waterHit === 0)
    {
        removeElement(water, waterHit);

        if (score + waterHitPoints > -1)
        {
            removeElement(snake, snake.length - 1);
            changeSpeed(gameSettings["speedMultiplier"] * waterHitPoints);
            score += waterHitPoints;
            scoreCounter.textContent = score;
        }
        else { endGame(); }
    }
}