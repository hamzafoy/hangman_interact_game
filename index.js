/*:::::::PLANNING THE LOGIC OF THE HANDMAN GAME::::::

Store the game loop in an object. This object should have an overall
variable storing a boolean indicating whether the game is in session
or not and should have a setter method that sets the word that is being
guessed during an active game.

UPDATE 20220106: Will first program this to be a terminal app where the
computer selects a random word from a list and the user has to guess the word.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

//Initializing `readline` module allowing for terminal input/output
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


//This is a temporary list of words which will be selected from randomly by the terminal in the terminal-based version of the Hangman game.
let playbook = ['stultify', 'amorphous', 'telos', 'inflection', 'tutelage', 'hallow', 'affluence', 'forelock', 'onomatopoeia', 'rectitude', 'ontology', 'phonetics', 'feldspar'];


class gameInstance {

    constructor() {
        //Property that reads whether game is in session. This is kept for the gameInstance object when it will be ported to a browser-based game.
        this.isActive = false;
        //There are only two players allowed in Hangman. This is kept for the gameInstance object when it will be ported to a browser-based game.
        this.positions = ['p1', 'p2']
        //Tracks who is selecting words for guessing and who is guessing selected word. This is kept for the gameInstance object when it will be ported to a browser-based game.
        this.isGuesser = this.positions[Math.round(Math.random())];
        this.isSelector = this.positions[(this.isGuesser == 'p1') ? 1 : 0];
        //Property that holds the word that is the subject of the current game round.
        this.currentWordInPlay = null;
        //Property that holds an array of underscores for each letter in the word in play.
        this.currentWordUnderscores = null;
        //"Body parts" are traditionally the way, visually, to count the number of chances a player has to guess the word before losing.
        this.bodyPartCountForLoss = 0;
        //Property that holds an array of letters that opposite player has guessed.
        this.arrayOfGuessedLetters = [];
    }

    //This method switches the game 'on' and 'off'.
    turnOnGame() {
        this.isActive = !this.isActive;
    }

    //This method increments the counter of 'body parts' which serves as a way to track how many guesses a player has left before losing the round.
    addPartToBody() {
        this.bodyPartCountForLoss++;
    }

    //This method swaps out underscores for correct letters to be displayed in the terminal to show players their progress towards guessing the entire word in play.
    exchangeUnderscoreForCorrectLetter(input) {
        //The while loop and `indices` array allows for .indexOf Array method to be used to find multiples of the same letter.
        let indices = [];
        let idx = this.currentWordInPlay.split('').indexOf(input);
        while (idx != -1) {
        indices.push(idx);
        idx = this.currentWordInPlay.split('').indexOf(input, idx + 1);
        indices.forEach(element => this.currentWordUnderscores[element] = input)
        }
    }

    //This method takes the currentWordInPlay and creates an array of underscores matching the number of letters in said currentWordInPlay.
    renderWordToUnderscores() {
        //Splits the current word into an Array.
        let wordArray = this.currentWordInPlay.split('');
        //Creates new Array using the `spread` operator and fills it with underscores equal in amount to the letters found in the word in play.
        let underscoreArray = [...Array(wordArray.length).fill('_', 0, wordArray.length)];
        //Stores the array of underscores in the gameInstance Object.
        this.currentWordUnderscores = underscoreArray;
    }

    //A getter that checks if there a word in play then returns it.
    get currentWord() {
        switch(typeof this.currentWordInPlay == 'string') {
            case true:
            return `The current word in play is ${this.currentWordInPlay}`;
            case false:
            return `No word is in play currently!`
        }
    }

    //A setter that takes input and accepts it as the word that is in play.
    set determineWordInPlay(input) {
        if (typeof input == 'string') {
            this.currentWordInPlay = input.toLowerCase();
        } else {
            throw Error(`This input must be a string!`)
        }
    }

    //A getter that fetches a string composed of letters guessed by player.
    get guessedLetters() {
        return this.arrayOfGuessedLetters.toString();
    }

    //A setter that submits a letter as a player's guess.
    set addLetterToArrayOfGuessedLetters(input) {
        //This prevents the submission of the same letter twice and tests letters based on capitalized versions.
        switch(this.arrayOfGuessedLetters.includes(input.toUpperCase())) {
            case true:
                console.log(this.arrayOfGuessedLetters);
                console.log(`Nice try, that letter has already been played`);
                break;
            case false:
                this.arrayOfGuessedLetters.push(input.toUpperCase());
                break;
        }
        
    }

};



rl.question('Do you want to play Hangman in the Terminal - Y/N? ', (answer) => {
    //Initial question will continue with game initialization if Y is answered, will close the terminal input process if N is answered.
    let newGame = new gameInstance();
    switch(answer.toUpperCase()) {
        case 'Y':
            //Selecting a random word from the playbook variable and storing it in the gameInstance Object.
            let randomNum = Math.floor(Math.random() * (playbook.length - 0) + 0);
            newGame.determineWordInPlay = playbook[randomNum];
            //Creating an Array of underscores whose number matches the number of letters found in the word that is in play.
            newGame.renderWordToUnderscores();
            break;
        case 'N':
            console.log('Terminal closing, goodbye!');
            rl.close();
            return;
    }

    //Initializing the recursive function and storing it in a `const` variable.
    const recursiveAsyncReadLine = function () {
        rl.question('Input a letter you wish to guess, or type "guesses" to see which letters you have already played: ', function(answer) {
            //Checks user input to see whether user wants to check the number of guesses they have or whether they want to play a letter.
            switch(answer == 'guesses') {
                case true:
                    console.log(`You have guessed the following letters so far: ${newGame.guessedLetters}`);
                    break;
                case false:
                    let lowerCasedLetter = answer.toLowerCase();
                    //console.log(`You guessed ${lowerCasedLetter}`);
                    //console.log(newGame.currentWordInPlay.includes(lowerCasedLetter));
                    if(newGame.currentWordInPlay.includes(lowerCasedLetter)) {
                        
                        console.log(`Yes! There is a(n) ${lowerCasedLetter} in the word!`);
                        newGame.addLetterToArrayOfGuessedLetters = lowerCasedLetter;
                        newGame.exchangeUnderscoreForCorrectLetter(lowerCasedLetter);
                        console.log(newGame.currentWordUnderscores.join(''));
                        //Win condition is met when there are no more underscores stored in currentWordUnderscores in the gameInstance Object. Triggers a message and closes the terminal input process.
                        if (newGame.currentWordUnderscores.includes("_") == false) {
                            console.log(`You have won and guessed ${newGame.currentWordInPlay}`);
                            return rl.close();
                        }
                    } else {
                        
                        console.log(`So sorry, ${lowerCasedLetter} is not found in the word.`);
                        newGame.addPartToBody();
                        newGame.addLetterToArrayOfGuessedLetters = lowerCasedLetter;
                        console.log(newGame.currentWordUnderscores.join(''));
                        if (newGame.bodyPartCountForLoss == 6) { //What will break the infinite recursive loop is whether the player uses up all of his/her guesses without finding the full word.
                            console.log(`You have used up all of your guesses, the correct word was ${newGame.currentWordInPlay} - game ending!`)
                            return rl.close();
                        }
                    }
            }
            
            recursiveAsyncReadLine(); //Calling this function again to ask new question

        });
    };

    recursiveAsyncReadLine();

});