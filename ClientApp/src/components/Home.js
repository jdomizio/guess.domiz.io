import React, { Component } from 'react';
import { connect } from 'react-redux';
import JoinGame from './JoinGame';
import WaitingForGame from './WaitingForGame';
import GameStarting from './GameStarting';
import GameView from './GameView';
import GameFinished from './GameFinished';

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
        
        if (!game.game.finished) {
            return <GameView />;
        }
        
        if (game.game.finished) {
            return <GameFinished />;
        } 
        
        return <div>No State Made for this yet, super :)</div>
    }
    
    render() {
        const view = this.selectView(this.props.game);
        
        return (
            <article className="guess-view-container">
                {view}
            </article>
        );
    }
}

export default connect(state => ({
    game: state.game,
}))(Home);
