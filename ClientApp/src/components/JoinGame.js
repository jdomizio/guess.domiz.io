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
        return (
            <section>
                <form onSubmit={this.handleSubmit}>
                    <header>Please enter your name</header>
                    <div>
                        <input ref={this.makeNameInputRef} type="text" />
                        <button onClick={this.handleSubmit}>Join Game</button>
                    </div>
              </form>
            </section>
        );    
    }
}

export default connect(undefined, {
    join: thunks.join,
})(JoinGame);