import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


const Card = ({ imageUrl, updateCount, shuffleTheArray, reset, gameOverDisplay }) => {
    const [click, setClick] = useState(false);

    useEffect(() => {
        setClick(false);
    }, [reset]);

    const handleClick = () => {
        shuffleTheArray();
        if (!click) {
            setClick(true)
            updateCount();
            console.log(click)
        } else {
            shuffleTheArray();
            gameOverDisplay()
        }
    }

    return (
        <div
            className="card"
            key={imageUrl}
            onClick={handleClick}>
            <img src={imageUrl} alt="dog" />
        </div>
    );
}
Card.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    updateCount: PropTypes.func.isRequired,
    shuffleTheArray: PropTypes.func.isRequired,
    reset: PropTypes.bool.isRequired,
    gameOverDisplay: PropTypes.bool.isRequired,
};

export default Card;
