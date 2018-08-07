import React, { Component } from 'react';
import { connect } from 'react-redux';
import { thunks } from '../store/GuessingGame';

class JoinGame extends Component {
    constructor(...args) {
        super(...args);
        
        this.makeNameInputRef = this.makeNameInputRef.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    makeNameInputRef(el) {
        this.nameInput = el;
        this.nameInput && this.nameInput.focus();
    };
    
    handleSubmit(e) {
        e && e.preventDefault && e.preventDefault();
        
        this.props.join(this.nameInput.value);
        
        return false;
    };
    
    render() {
        const msg = this.props.joinError 
            ? this.props.joinError
            : "Please enter your name";
        
        return (
            <form onSubmit={this.handleSubmit} className="guess-form">
                <div className="guess-msg">{msg}</div>
                <div className="guess-prompt">
                    <input ref={this.makeNameInputRef} type="text" />
                </div>
                <div className="guess-button">
                    <button onClick={this.handleSubmit}>Join Game</button>
                </div>
          </form>
        );    
    }
}

export default connect(state => ({
    joinError: state.game.joinError,
}), {
    join: thunks.join,
})(JoinGame);