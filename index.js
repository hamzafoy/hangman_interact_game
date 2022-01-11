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

let playbook = ['stultify', 'amorphous', 'telos', 'inflection', 'tutelage', 'hallow', 'affluence', 'forelock', 'onomatopoeia', 'rectitude', 'ontology', 'phonetics', 'feldspar'];

class gameInstance {

    constructor() {
        //Property that reads whether game is in session.
        this.isActive = false;
        //There are only two players allowed in Hangman.
        this.positions = ['p1', 'p2']
        //Tracks who is selecting words for guessing and who is guessing selected word.
        this.isGuesser = this.positions[Math.round(Math.random())];
        this.isSelector = this.positions[(this.isGuesser == 'p1') ? 1 : 0];
        //Property that holds the word that is the subject of the current round.
        this.currentWordInPlay = null;
        //Property that holds an array of underscores for each letter in the word in play.
        this.currentWordUnderscores = null;
        //"Body parts" are traditionally the way, visually, to count the number of chances a player has to guess the word before losing.
        this.bodyPartCountForLoss = 0;
        //Property that holds an array of letters that opposite player has guessed.
        this.arrayOfGuessedLetters = [];
    }

    turnOnGame() {
        this.isActive = !this.isActive;
    }

    addPartToBody() {
        this.bodyPartCountForLoss++;
    }

    exchangeUnderscoreForCorrectLetter(input) {
        let indices = [];
        let idx = this.currentWordInPlay.split('').indexOf(input);
        while (idx != -1) {
        indices.push(idx);
        idx = this.currentWordInPlay.split('').indexOf(input, idx + 1);
        indices.forEach(element => this.currentWordUnderscores[element] = input)
        }
    }

    renderWordToUnderscores() {
        let wordArray = this.currentWordInPlay.split('');
        let underscoreArray = [...Array(wordArray.length).fill('_', 0, wordArray.length)];
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
    let newGame = new gameInstance();
    switch(answer) {
        case 'Y':
            //console.log(`Hangman Loading`);
            let randomNum = Math.floor(Math.random() * (playbook.length - 0) + 0);
            newGame.determineWordInPlay = playbook[randomNum];
            newGame.renderWordToUnderscores();
            //console.log(newGame.currentWord);
            break;
        case 'N':
            console.log('Terminal closing, goodbye!');
            rl.close();
            return;
    }

    const recursiveAsyncReadLine = function () {
        console.log(newGame.currentWordUnderscores.join(''))
        rl.question('Input a letter you wish to guess, or type "guesses" to see which letters you have already played: ', function(answer) {
            switch(answer == 'guesses') {
                case true:
                    console.log(`You have guessed the following letters so far: ${newGame.guessedLetters}`)
                    console.log(newGame.currentWordInPlay);
                    console.log(newGame.bodyPartCountForLoss);
                    console.log(newGame.arrayOfGuessedLetters);
                    break;
                case false:
                    let lowerCasedLetter = answer.toLowerCase();
                    //console.log(`You guessed ${lowerCasedLetter}`);
                    console.log(newGame.currentWordInPlay.includes(lowerCasedLetter));
                    if(newGame.currentWordInPlay.includes(lowerCasedLetter)) {
                        //console.log(`Yes! There is a(n) ${lowerCasedLetter} in the word!`);
                        newGame.addLetterToArrayOfGuessedLetters = lowerCasedLetter;
                        newGame.exchangeUnderscoreForCorrectLetter(lowerCasedLetter);
                        //console.log(`You have guessed the following letters so far: ${newGame.guessedLetters}`)
                        console.log(newGame.currentWordUnderscores);
                        if (newGame.currentWordUnderscores.includes("_") == false) {
                            console.log(`You have won and guessed ${newGame.currentWordInPlay}`);
                            return rl.close();
                        }
                    } else {
                        //console.log(`So sorry, ${lowerCasedLetter} is not found in the word.`);
                        newGame.addPartToBody();
                        newGame.addLetterToArrayOfGuessedLetters = lowerCasedLetter;
                        //console.log(`You have guessed the following letters so far: ${newGame.guessedLetters}`)
                        //console.log(newGame.bodyPartCountForLoss);
                        if (newGame.bodyPartCountForLoss == 6) { //What will break the infinite recursive loop is whether the player uses up all of his/her guesses without finding the full word.
                            console.log(`You have used up all of your guesses, game ending!`)
                            return rl.close();
                        }
                    }
            }
            
            recursiveAsyncReadLine(); //Calling this function again to ask new question
        });
    };

    recursiveAsyncReadLine();
    /* rl.question('Input a letter you wish to guess: ', (answer) => {
        let lowerCasedLetter = answer.toLowerCase();
        console.log(`You guessed ${lowerCasedLetter}`);
        switch(newGame.currentWord.includes(lowerCasedLetter)) {
            case true:
                console.log(`Yes! There is a(n) ${lowerCasedLetter} in the word!`);
                break;
            case false:
                console.log(`So sorry, ${lowerCasedLetter} is not found in the word.`);
                break;
        }
        rl.close();
    }) */
})