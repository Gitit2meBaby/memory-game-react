import { useState, useEffect, useCallback } from 'react';
import './App.css';
import Card from './components/Card';



function App() {
  const [data, setData] = useState({ message: [] });
  const [count, setCount] = useState(0);
  const [shuffleArray, setShuffleArray] = useState([data.message])
  const [reset, setReset] = useState(false);
  const [gameOver, setGameover] = useState(false)
  const [gameStart, setGameStart] = useState(false)


  //API request for Doggies. Had to deal with duplicates due to the imageUrl being used as the key, and then also filter out the 404 returns so to not have an empty spot wih an alt tag.
  useEffect(() => {
    fetch('https://dog.ceo/api/breeds/image/random/50')
      .then((response) => response.json())
      .then(async (data) => {
        // Filter out image URLs that result in a 404 error
        const validImageArray = await Promise.all(data.message.map(async (imageUrl) => {
          try {
            const response = await fetch(imageUrl, { method: 'HEAD' });
            if (response.status === 200) {
              return imageUrl; // URL exists and is valid
            }
          } catch (error) {
            console.error('Error checking URL:', error);
          }
          return null; // URL does not exist or has an issue
        }));

        // Remove null values (invalid URLs) and then store unique image URLs
        const filteredImageArray = validImageArray.filter((imageUrl) => imageUrl !== null);

        const uniqueImages = new Set(filteredImageArray);
        const uniqueImageArray = Array.from(uniqueImages);

        setData({ message: uniqueImageArray });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  const updateCount = () => {
    setCount(oldcount => (oldcount + 1));
  };

  //called with each click handled in Cards component
  const shuffleTheArray = () => {
    const shuffledArray = data.message;

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    setShuffleArray(shuffledArray)
  }

  //needed to bring all this into App to change state of each card when the game was over
  const gameOverDisplay = () => {
    setGameover(true)
  }
  const handleReset = useCallback(() => {
    setReset(!reset);
    setCount(0);
    setGameover(false)
  }, [reset]);

  //To display instructions on first load then change to score
  window.addEventListener('click', () => {
    setGameStart(true)
  })

  return (
    <main>
      <div className="title">
        <h1>Memory Game</h1>
        <div className="counter">
          {gameStart ? <h3>Your Score: {count}</h3> :
            <h3>Try not to pat the same pooch twice</h3>}
        </div>
      </div>
      <div className="card-container">
        {data.message.map((imageUrl) => (
          <Card key={imageUrl}
            imageUrl={imageUrl}
            updateCount={updateCount}
            shuffleTheArray={shuffleTheArray}
            reset={reset}
            gameOverDisplay={gameOverDisplay}
          />
        ))}
      </div>
      {gameOver && <div className='gameover'>
        {<h2>You scored</h2>}
        <h3>{count}</h3>
        <button onClick={handleReset}>Play Again?</button>
      </div>}
    </main>
  );
}

export default App;
