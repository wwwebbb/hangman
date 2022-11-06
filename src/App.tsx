import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import words from "./wordList.json";

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]); //useState intialized to empty array of strings

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6; //hangman body parts
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return; //check to see if letter is already in guessed letters (shouldn't be punished for guessing same letter twice)
      setGuessedLetters((currentLetters) => [...currentLetters, letter]); //otherwise add new letter to end of guessed letters array
    },
    [guessedLetters, isLoser, isWinner] //addGuessedLetter is only rendered when [guessedLetters] array changes since [guessedLetters] is a dependency. e.g. helps effiency bc of useCallback
  ); //and becomes disabled once 'isLoser' or 'isWinner' condition is met

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      //event listener
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return; //Checks to see if we pressed a letter between a-z, if we did then continue, if not then ignore everything
      e.preventDefault(); //dont't do whatever was going to normally happen
      addGuessedLetter(key);
    };
    document.addEventListener("keypress", handler); //hooks up event listener and removes appropriately
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]); //so a guessed letter is only added once

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      //event listener
      const key = e.key;
      if (key !== "Enter") return; //Checks to see if we pressed 'enter', if we did then reset to a new game
      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };
    document.addEventListener("keypress", handler); //hooks up event listener and removes appropriately
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isLoser && "You lost :( Refresh to play again"}{" "}
        {isWinner && "Winner! Refresh to play again!"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser} //reveals the word if you lost
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />{" "}
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          //correctly guessed letter style
          activeLetters={guessedLetters.filter(
            (letter) => wordToGuess.includes(letter) //all the letters that are in the word
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
