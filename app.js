/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const wordsArray = ["example", "react", "scramble", "game", "persistent", "storage", "guess", "correct", "incorrect", "restart"];

const ScrambleGame = () => {
  const { useState, useEffect } = React;
  const [words, setWords] = useState(wordsArray);
  const [scrambledWords, setScrambledWords] = useState(wordsArray.map(word => shuffle(word)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(3);
  const [message, setMessage] = useState('');
  const maxStrikes = 3;

  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem('scrambleGame'));
    if (savedGame) {
      setWords(savedGame.words);
      setScrambledWords(savedGame.scrambledWords);
      setCurrentIndex(savedGame.currentIndex);
      setScore(savedGame.score);
      setStrikes(savedGame.strikes);
      setPasses(savedGame.passes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scrambleGame', JSON.stringify({ words, scrambledWords, currentIndex, score, strikes, passes }));
  }, [words, scrambledWords, currentIndex, score, strikes, passes]);

  const handleGuess = (e) => {
    e.preventDefault();
    const originalWord = words[currentIndex];
    if (guess.toLowerCase() === originalWord.toLowerCase()) {
      setScore(score + 1);
      setMessage('Correct. Next word.');
      setCurrentIndex(currentIndex + 1);
      setGuess('');
    } else {
      setStrikes(strikes + 1);
      setMessage('Incorrect. Try again.');
      setGuess('');
    }
  };

  const handlePass = () => {
    if (passes > 0) {
      setCurrentIndex(currentIndex + 1);
      setPasses(passes - 1);
      setMessage('');
    }
  };

  const handleRestart = () => {
    setWords(wordsArray);
    setScrambledWords(wordsArray.map(word => shuffle(word)));
    setCurrentIndex(0);
    setScore(0);
    setStrikes(0);
    setPasses(3);
    setMessage('');
  };

  if (currentIndex >= words.length || strikes >= maxStrikes) {
    return (
      <div>
        <h1>Welcome to Scramble.</h1>
        <p className="score">{score} POINTS</p>
        <p className="strikes">{strikes} STRIKES</p>
        <p className={`message ${strikes >= maxStrikes ? 'incorrect' : ''}`}>
          {strikes >= maxStrikes ? 'Game Over. Try again.' : 'Congratulations! You finished the game.'}
        </p>
        <button onClick={handleRestart}>Play Again</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to Scramble.</h1>
      <p className="score">{score} POINTS</p>
      <p className="strikes">{strikes} STRIKES</p>
      {message && <p className={`message ${message.includes('Incorrect') ? 'incorrect' : ''}`}>{message}</p>}
      <p className="current-word">{scrambledWords[currentIndex]}</p>
      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
      </form>
      <button onClick={handlePass} disabled={passes <= 0}>
        {passes} Passes Remaining
      </button>
    </div>
  );
};

ReactDOM.render(<ScrambleGame />, document.getElementById('root'));
