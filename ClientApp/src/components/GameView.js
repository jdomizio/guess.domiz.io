import React, { Component } from 'react';
import { connect } from 'react-redux';
import { thunks } from '../store/GuessingGame';

class GameView extends Component {
    constructor(...args) {
        super(...args);
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.makeGuessInputRef = this.makeGuessInputRef.bind(this);
    }

    makeGuessInputRef(el) {
        this.guessInput = el;
        this.guessInput && this.guessInput.focus();
    };
    

    handleSubmit(e) {
        e && e.preventDefault && e.preventDefault();
        
        this.props.guess(this.guessInput.value);
        this.guessInput.value = '';
        
        return false;
    }
    
    render() {
        const msg = this.props.response 
            ? this.props.response
            : `Guess a number between ${this.props.min} and ${this.props.max}`;
        
        const last = this.props.lastGuess
            ? `Your last guess: ${this.props.lastGuess}`
            : null;
        
        return (
            <form onSubmit={this.handleSubmit} className="guess-form">
                <div className="guess-msg">{last}</div>
                <div className="guess-msg">{msg}</div>
                <div className="guess-prompt">
                    <input ref={this.makeGuessInputRef} type="number" />
                </div>
                <div className="guess-button">
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
            </form>
        )
    }
}

export default connect(state => ({
    min: state.game.game.min, 
    max: state.game.game.max,
    response: state.game.response,
    lastGuess: state.game.lastGuess,
}), {
    guess: thunks.guess,
})(GameView);