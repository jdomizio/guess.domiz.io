import React from 'react';
import { connect } from 'react-redux';

const GameFinished = (props) => (
    <div className="guess-msg --hero">
        {props.winner ? 'You are the winner!' : `Game over - ${props.winnerName} had the correct guess!`}
    </div>
);

export default connect(state => ({
    winner: state.game.game.winner === state.game.name,
    winnerName: state.game.game.winner,
}))(GameFinished);
