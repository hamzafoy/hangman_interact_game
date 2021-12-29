/*:::::::PLANNING THE LOGIC OF THE HANDMAN GAME::::::

Store the game loop in an object. This object should have an overall
variable storing a boolean indicating whether the game is in session
or not and should have a setter method that sets the word that is being
guessed during an active game.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

class gameInstance {

    constructor() {
        //Property that reads whether game is in session.
        this.isActive = false;
        //There are only two players allowed in Hangman.
        this.positions = ['p1', 'p2']
        //Tracks who is selecting words for guessing and who is guessing selected word.
        this.isGuesser = this.positions[0];
        this.isSelector = this.positions[1];
        //Property that holds the word that is the subject of the current round.
        this.currentWordInPlay = null;
        //Property that holds an array of letters that opposite player has guessed.
        this.arrayOfGuessedLetters = [];
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
//console.log(newGame.isGuesser);