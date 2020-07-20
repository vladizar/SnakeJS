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
        "snakeView": gameSettingsView.value
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