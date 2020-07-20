// Screens DOMs
// Game screen
const gameScreen = document.querySelector('.game-screen');

// Menu screen
const menuScreen = document.querySelector('.menu-screen');
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

// Death screen
const deathScreen = document.querySelector('.death-screen');
const playAgainButton = deathScreen.querySelector('.button_play');
const goLobbyButton = deathScreen.querySelector('.button_menu');

//@prepros-append game.js
//@prepros-append screens.js