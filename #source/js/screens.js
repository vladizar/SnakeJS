// Game settings inputs
const gameSettingsForm = menuScreen.querySelector('.game-settings-form');
const gameSettingsLength = gameSettingsForm.querySelector('input[name=snake-start-length]');
const gameSettingsDirection = gameSettingsForm.querySelector('select[name=snake-start-direction]');
const gameSettingsSpeed = gameSettingsForm.querySelector('input[name=snake-start-speed]');
const gameSettingsSpeedMultiplier = gameSettingsForm.querySelector('input[name=snake-speed-multiplier]');
const gameSettingsView = gameSettingsForm.querySelector('select[name=snake-body-view]');
const gameSettingsFieldSize = gameSettingsForm.querySelector('input[name=game-field-size]');
const gameSettingsFieldInfinity = gameSettingsForm.querySelector('select[name=game-field-infinity]');
const gameSettingsMaxFruitsNumber = gameSettingsForm.querySelector('input[name=game-max-fruits]');
const gameSettingsMinFruitsNumber = gameSettingsForm.querySelector('input[name=game-min-fruits]');
const gameSettingsFruitsSpawnInterval = gameSettingsForm.querySelector('input[name=fruits-spawn-delay]');
const gameSettingsSnakeSelfDestruct = gameSettingsForm.querySelector('select[name=snake-self-destruct]');
const gameSettingsWaterAreaSize = gameSettingsForm.querySelector('input[name=water-area-size]');

// Buttons
const playAgainButtons = document.querySelectorAll('.button_play');
const goLobbyButtons = document.querySelectorAll('.button_menu');
const continueButton = document.querySelector('.button_continue');

// placeholder="2 - 24" value="3" max="24" min="2"

gameSettingsFieldSize.onchange = function ()
{
    if (gameSettingsFieldSize.value)
    {
        let maxSnakeLength = Math.floor(gameSettingsFieldSize.value / 2);

        gameSettingsLength.placeholder = "2 - " + maxSnakeLength;
        gameSettingsLength.max = maxSnakeLength;

        if (gameSettingsLength.value > maxSnakeLength)
        {
            gameSettingsLength.value = maxSnakeLength;
        }
    }
}

// SCREENS SWITCH LOGIC

// When user starts the game from menu screen
gameSettingsForm.onsubmit = function (evt)
{
    // Stop browser from sending the form
    evt.preventDefault();

    // Store game settings
    gameSettings =
    {
        "snakeLength": Number(gameSettingsLength.value),
        "direction": gameSettingsDirection.value,
        "speed": Number(gameSettingsSpeed.value),
        "speedMultiplier": Number(gameSettingsSpeedMultiplier.value),
        "gameFieldSize": Number(gameSettingsFieldSize.value),
        "gameFieldInfinity": Boolean(Number(gameSettingsFieldInfinity.value)),
        "maxFruitsNumber": Number(gameSettingsMaxFruitsNumber.value),
        "minFruitsNumber": Number(gameSettingsMinFruitsNumber.value),
        "fruitsSpawnInterval": Number(gameSettingsFruitsSpawnInterval.value),
        "snakeView": gameSettingsView.value,
        "snakeSelfDestruct": Boolean(Number(gameSettingsSnakeSelfDestruct.value)),
        "waterAreaSize": Number(gameSettingsWaterAreaSize.value) / 100 * Number(gameSettingsFieldSize.value) ** 2
    };

    // Start game with animation delay
    startGame(400);
}

// Iterate over play again buttons
for (const button of playAgainButtons)
{
    // When user clicks on play again button
    button.onclick = function ()
    {
        // Start game without delay
        startGame();
    }
}

// Ignore start game button
playAgainButtons[0].onclick = () => {void this.offsetWidth;};

// Iterate over lobby buttons
for (const button of goLobbyButtons)
{
    // When user clicks on lobby button
    button.onclick = function ()
    {
        // Stop game procceses
        clearInterval(gameFrames);
        clearInterval(fruitsSpawn);
        gameFrames = false;

        // Show menu screen and hide all others
        setTimeout(() =>
        {
            gameScreen.style.display = pauseScreen.style.display = deathScreen.style.display = "none";
        }, 400);
        menuScreen.classList.add('menu-screen_animated');
        menuScreen.style.display = "";
    }
}

// When user clicks on continue button
continueButton.onclick = function ()
{
    // Continue game
    continueGame();
}

gameScreen.onclick = function ()
{
    pauseGame();
}

window.onkeyup = function (evt)
{
    if (evt.key == " ")
    {
        pauseGame();
    }
}