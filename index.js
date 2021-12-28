/*:::::::PLANNING THE LOGIC OF THE HANDMAN GAME::::::

Store the game loop in an object. This object should have an overall
variable storing a boolean indicating whether the game is in session
or not and should have a setter method that sets the word that is being
guessed during an active game.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

class gameInstance {

    constructor() {
        this.isActive = false;
        this.currentWordInPlay = null;
        this.arrayOfGuessedLetters = [];
    }

    get currentWord() {
        //console.log(this.currentWordInPlay);
        switch(typeof this.currentWordInPlay == 'string') {
            case true:
            return `The current word in play is ${this.currentWordInPlay}`;
            case false:
            return `No word is in play currently!`
        }
        
    }

    set determineWordInPlay(input) {
        this.currentWordInPlay = input;
    }

    get guessedLetters() {
        console.log(this.arrayOfGuessedWords);
    }

    set addLetterToArrayOfGuessedLetters(input) {
        this.arrayOfGuessedLetters.push(input);
    }

};

let newGame = new gameInstance();
console.log(newGame.currentWord);
newGame.determineWordInPlay = 'Smorgasbord';
console.log(newGame.currentWord);
newGame.addLetterToArrayOfGuessedLetters = 'L';
console.log(newGame.guessedLetters);