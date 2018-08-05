import React, { Component } from 'react';
import { connect } from 'react-redux';
import JoinGame from './JoinGame';
import { GAME_STATES } from '../store/GuessingGame';

class Home extends Component {
    selectView(gameState) {
        switch (gameState) {
            case GAME_STATES.JOIN:
                return <JoinGame />;
            default:
                return <div>Error</div>;
        } 
    }
    
    render() {
        const view = this.selectView(this.props.game.gameState);
        
        return (
            <article>
                {view}
            </article>
        );
    }
}

export default connect(state => ({
    game: state.game,
}))(Home);
