/*:
 * @plugindesc Play specific sounds for each letter typed during dialogue and a sound for every step the player takes.
 * @author YourName
 *
 * @param Step Sound
 * @desc The sound effect to play for each step.
 * @default Cursor1
 *
 * @param Base Typing Volume
 * @desc The base volume of the typing sound effects (0-100).
 * @default 90
 *
 * @param Typing Volume Variance
 * @desc The variance in volume for typing sound effects (-50 to 50).
 * @default 10
 *
 * @param Base Typing Pitch
 * @desc The base pitch of the typing sound effects (50-150).
 * @default 100
 *
 * @param Typing Pitch Variance
 * @desc The variance in pitch for typing sound effects (-50 to 50).
 * @default 20
 *
 * @param Typing Pan
 * @desc The pan of the typing sound effects (-100 to 100).
 * @default 0
 *
 * @param Step Volume
 * @desc The volume of the step sound effect (0-100).
 * @default 90
 *
 * @param Step Pitch
 * @desc The pitch of the step sound effect (50-150).
 * @default 100
 *
 * @param Step Pan
 * @desc The pan of the step sound effect (-100 to 100).
 * @default 0
 *
 * @help
 * This plugin plays specific sounds for each letter typed in dialogue and
 * a sound for each step the player character takes.
 */

(function() {
    // Get plugin parameters
    var parameters = PluginManager.parameters('TypingAndWalkingSounds');
    var stepSound = String(parameters['Step Sound'] || 'Crossbow');
    var baseTypingVolume = Number(parameters['Base Typing Volume'] || 30);
    var typingVolumeVariance = Number(parameters['Typing Volume Variance'] || 10);
    var baseTypingPitch = Number(parameters['Base Typing Pitch'] || 100);
    var typingPitchVariance = Number(parameters['Typing Pitch Variance'] || 90);
    var typingPan = Number(parameters['Typing Pan'] || 0);
    var stepVolume = Number(parameters['Step Volume'] || 20);
    var stepPitch = Number(parameters['Step Pitch'] || 60);
    var stepPan = Number(parameters['Step Pan'] || 10);

    // Mapping letters to sound effects (Cursor1 and Stare only)
    var letterSounds = {
        'A': 'Cursor1',
        'B': 'Cursor2',
        'C': 'Cursor1',
        'D': 'Cursor2',
        'E': 'Cursor1',
        'F': 'Cursor2',
        'G': 'Cursor1',
        'H': 'Cursor2',
        'I': 'Cursor1',
        'J': 'Cursor2',
        'K': 'Cursor1',
        'L': 'Cursor2',
        'M': 'Stare',
        'N': 'Cursor2',
        'O': 'Cursor1',
        'P': 'Cursor2',
        'Q': 'Cursor1',
        'R': 'Cursor2',
        'S': 'Cursor1',
        'T': 'Cursor2',
        'U': 'Cursor1',
        'V': 'Cursor2',
        'W': 'Cursor1',
        'X': 'Cursor2',
        'Y': 'Cursor1',
        'Z': 'Stare',
        ' ': 'Cursor1' // Sound for space or silence
    };

    // Function to play sound with error handling
    function playSound(soundName, volume, pitch, pan) {
        if (soundName && soundName !== 'undefined') {
            try {
                AudioManager.playSe({ name: soundName, volume: volume, pitch: pitch, pan: pan });
                console.log(`Playing sound: ${soundName}, Volume: ${volume}, Pitch: ${pitch}, Pan: ${pan}`);
            } catch (e) {
                console.error(`Error playing sound: ${soundName}`, e);
            }
        } else {
            console.error("Failed to play sound: Sound name is undefined or empty.");
        }
    }

    // Typing sound with specific sounds for each letter in dialogue
    var _Window_Message_processNormalCharacter = Window_Message.prototype.processNormalCharacter;
    Window_Message.prototype.processNormalCharacter = function(textState) {
        _Window_Message_processNormalCharacter.call(this, textState);
        var char = textState.text[textState.index];

        // Check if char is defined and valid
        if (typeof char === 'string' && char.length > 0) {
            var soundName = letterSounds[char.toUpperCase()] || 'Cursor1'; // Default to 'Cursor1' sound if no mapping
            var volume = Math.min(100, Math.max(0, baseTypingVolume + Math.floor(Math.random() * typingVolumeVariance * 2) - typingVolumeVariance));
            var pitch = Math.min(150, Math.max(50, baseTypingPitch + Math.floor(Math.random() * typingPitchVariance * 2) - typingPitchVariance));
            console.log(`Typing Sound: ${soundName}, Volume: ${volume}, Pitch: ${pitch}, Pan: ${typingPan}`);
            playSound(soundName, volume, pitch, typingPan);
        }
    };

    // Walking sound for each step taken by the player
    var _Game_Player_increaseSteps = Game_Player.prototype.increaseSteps;
    Game_Player.prototype.increaseSteps = function() {
        _Game_Player_increaseSteps.call(this);
        console.log(`Step Sound: ${stepSound}, Volume: ${stepVolume}, Pitch: ${stepPitch}, Pan: ${stepPan}`);
        playSound(stepSound, stepVolume, stepPitch, stepPan);
    };

})();