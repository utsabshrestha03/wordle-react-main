// src/hooks/useWordle.js
// -----------------------------------------------------------------------------
// A CUSTOM HOOK: the game's memory and rules, all in one place.
//
// A "hook" is just a JavaScript function whose name starts with `use`. React
// lets hooks store state (with useState) and react to changes. By moving ALL
// the game logic into this one custom hook, our components can stay simple and
// focus only on *drawing* the screen.
//
// This hook remembers:
//   - the secret answer
//   - the 6 rows of guesses (and their colours once submitted)
//   - what the player is currently typing
//   - which row (turn) we are on
//   - whether the player has won
//   - the colour to paint each key on the on-screen keyboard
//
// And it exposes ONE function to the outside world: handleKeyup, which reacts
// to every key the player presses.
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { checkGuess } from '../utils/checkGuess';

// Game rules as named constants (so the numbers aren't "magic" and mysterious).
export const WORD_LENGTH = 5; // every word is 5 letters long
export const MAX_TURNS = 6;   // the player gets 6 guesses

export function useWordle(answer) {
  // ------------------------------------------------------------------ state --
  // `turn` = which row we are filling right now (0 through 5).
  const [turn, setTurn] = useState(0);

  // `currentGuess` = the word being typed in the active row, e.g. "cra".
  const [currentGuess, setCurrentGuess] = useState('');

  // `guesses` = an array with one slot per row. Each slot is either:
  //   - null  (row not submitted yet), or
  //   - an array of coloured-letter objects from checkGuess().
  // We create 6 empty (null) slots up front with Array(MAX_TURNS).fill(null).
  const [guesses, setGuesses] = useState(Array(MAX_TURNS).fill(null));

  // `isCorrect` = did the player win? Starts false, flips to true on a match.
  const [isCorrect, setIsCorrect] = useState(false);

  // `usedKeys` = remembers the best colour each letter has earned, so the
  // on-screen keyboard can show green/yellow/grey hints. e.g. { a: 'correct' }
  const [usedKeys, setUsedKeys] = useState({});

  // --------------------------------------------------------- helper actions --

  // Add a letter to the current guess (only if the row isn't full yet).
  const addLetter = (letter) => {
    setCurrentGuess((prev) =>
      prev.length < WORD_LENGTH ? prev + letter : prev
    );
  };

  // Remove the last letter (the Backspace behaviour).
  const removeLetter = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  // Submit the current guess when the player presses Enter.
  const submitGuess = () => {
    // Rule 1: the game is over once we've used all our turns or already won.
    if (turn >= MAX_TURNS || isCorrect) return;

    // Rule 2: the guess must be exactly 5 letters — no half-typed words.
    if (currentGuess.length !== WORD_LENGTH) return;

    // Run our colouring algorithm to grade this guess.
    const formattedGuess = checkGuess(currentGuess, answer);

    // Save the graded guess into the correct row of the `guesses` array.
    // We copy the array first (never mutate state directly in React!).
    setGuesses((prevGuesses) => {
      const newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });

    // Update the on-screen keyboard colours based on this guess.
    setUsedKeys((prevUsedKeys) => {
      const newKeys = { ...prevUsedKeys };
      formattedGuess.forEach(({ letter, status }) => {
        const current = newKeys[letter];
        // A green should never be "downgraded" to yellow/grey, and a yellow
        // should never be downgraded to grey. So we only upgrade colours.
        if (status === 'correct') {
          newKeys[letter] = 'correct';
        } else if (status === 'present' && current !== 'correct') {
          newKeys[letter] = 'present';
        } else if (status === 'absent' && !current) {
          newKeys[letter] = 'absent';
        }
      });
      return newKeys;
    });

    // Did they win? (The guess exactly equals the answer.)
    if (currentGuess === answer) {
      setIsCorrect(true);
    }

    // Move to the next row and clear the typing area for the next guess.
    setTurn((prevTurn) => prevTurn + 1);
    setCurrentGuess('');
  };

  // ------------------------------------------------------ the one public API --
  // This single function receives every keypress and routes it to the right
  // helper above. Components will wire this up to the real keyboard and to the
  // clickable on-screen keyboard.
  const handleKeyup = (key) => {
    if (key === 'Enter') {
      submitGuess();
      return;
    }

    if (key === 'Backspace') {
      removeLetter();
      return;
    }

    // Only accept single alphabet letters (a–z or A–Z). This ignores keys like
    // Shift, Tab, arrows, numbers, etc.
    if (/^[a-zA-Z]$/.test(key)) {
      addLetter(key.toLowerCase());
    }
  };

  // Expose the pieces the UI needs to draw itself, plus the input handler.
  return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup };
}
