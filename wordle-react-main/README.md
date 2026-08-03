# React Wordle

A clone of the game **Wordle**, built with **React** and **Vite**. A clean,
well-commented implementation you can read and extend.

📖 **Read the companion article:** [How Wordle Works: Building the Game with React](https://medium.com/@aaditya.dulal/how-wordle-works-building-the-game-with-react-13520be7eeaa?source=friends_link&sk=b049baded482376d79da604369f689ca)
— a walkthrough of the code and the React ideas behind it.

## What's inside

- Scaffolding a React app with **Vite**
- Breaking a UI into small **components** (`Tile`, `Row`, `Board`, `Keyboard`)
- Managing state with the **`useState`** hook
- Extracting logic into a reusable **custom hook** (`useWordle`)
- Handling side effects (real keyboard input) with **`useEffect`**
- Writing a real algorithm: the green/yellow/grey **letter-checking** logic,
  including the tricky **duplicate-letter** case

## How to run it

```bash
npm install     # download dependencies (only needed once)
npm run dev     # start the development server
```

Then open the printed URL (usually http://localhost:5173) in your browser.

## Project structure

```
wordle/
├── index.html                # the single HTML page React mounts into
├── vite.config.js            # Vite + React plugin configuration
├── package.json              # dependencies and npm scripts
└── src/
    ├── main.jsx              # entry point — connects React to the page
    ├── App.jsx               # top-level component; wires everything together
    ├── index.css             # global page styles
    ├── App.css               # game + keyboard styles
    ├── data/
    │   └── words.js          # the word list + random answer picker
    ├── utils/
    │   └── checkGuess.js     # the green/yellow/grey algorithm (the "brain")
    ├── hooks/
    │   └── useWordle.js      # all game state and rules (the "memory")
    └── components/
        ├── Tile.jsx          # one lettered square
        ├── Row.jsx           # a horizontal line of 5 tiles
        ├── Board.jsx         # the 6 x 5 grid
        └── Keyboard.jsx      # the clickable on-screen keyboard
```

## How the pieces fit together

```
App  ──uses──▶  useWordle (state + rules)  ──uses──▶  checkGuess (colouring)
 │
 ├── renders ▶ Board ─▶ Row ─▶ Tile
 └── renders ▶ Keyboard
```

## The game rules

- The answer is a random 5-letter word from `src/data/words.js`.
- You have **6 guesses**.
- After each guess, every letter is coloured:
  - 🟩 **green** — right letter, right position
  - 🟨 **yellow** — right letter, wrong position
  - ⬛ **grey** — the letter is not in the word

Happy hacking!
