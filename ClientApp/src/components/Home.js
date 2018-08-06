import React, { Component } from 'react';
import { connect } from 'react-redux';
import JoinGame from './JoinGame';
import WaitingForGame from './WaitingForGame';
import GameStarting from './GameStarting';

import { GAME_STATES } from '../store/GuessingGame';

class Home extends Component {
    selectView(game) {
        if (!game.joined) {
            return <JoinGame />;
        }
        
        if (!game.game) {
            return <WaitingForGame />;
        }
        
        if (!game.game.started) {
            return <GameStarting />;
        }
        
        return <div>No State Made for this yet, super :)</div>
    }
    
    render() {
        const view = this.selectView(this.props.game);
        
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
