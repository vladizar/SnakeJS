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
const gameSettingsFruitsSpawnInterval = gameSettingsForm.querySelector('input[name=fruits-spawn-delay]');
const gameSettingsSnakeSelfDestruct = gameSettingsForm.querySelector('select[name=snake-self-destruct]');

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
        "fruitsSpawnInterval": Number(gameSettingsFruitsSpawnInterval.value),
        "snakeView": gameSettingsView.value,
        "snakeSelfDestruct": Boolean(Number(gameSettingsSnakeSelfDestruct.value))
    }

    // Start game with animation delay
    startGame(400);
}

// When user clicks on lobby button
goLobbyButton.onclick = function ()
{
    // Show menu screen and hide all others
    gameScreen.style.display = deathScreen.style.display = "none";
    menuScreen.style.display = "";
}

// When user clicks on play again button
playAgainButton.onclick = function ()
{
    // Start game without delay
    startGame();
}