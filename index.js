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
        return this.arrayOfGuessedLetters.toString();
    }

    set addLetterToArrayOfGuessedLetters(input) {
        switch(this.arrayOfGuessedLetters.includes(input.toUpperCase())) {
            case true:
            console.log(`Nice try, that letter has already been played`);
            return `That letter has been played already, pick another!`;
            case false:
            this.arrayOfGuessedLetters.push(input.toUpperCase());
        }
        
    }

};

let newGame = new gameInstance();
console.log(newGame.currentWord);
newGame.determineWordInPlay = 'Smorgasbord';
console.log(newGame.currentWord);
newGame.addLetterToArrayOfGuessedLetters = 'L';
newGame.addLetterToArrayOfGuessedLetters = 'L';
newGame.addLetterToArrayOfGuessedLetters = 'A';
newGame.addLetterToArrayOfGuessedLetters = 'g';
console.log(newGame.guessedLetters);