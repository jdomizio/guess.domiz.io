import { createAction, handleActions } from 'redux-actions';
import { HubConnectionBuilder } from '@aspnet/signalr';

export const GAME_STATES = {
    JOIN: 'join',
};

const INITAL_STATE = {
    gameState: GAME_STATES.JOIN,
};

export const actionCreators = {
    joining: createAction('guessingGame/JOINING'),
    joined: createAction('guessingGame/JOINED'),
    guessing: createAction('guessingGame/GUESSING'),
    guessed: createAction('guessingGame/GUESSED'),
};

export const reducer = handleActions({
    [actionCreators.joining]: (state, { payload }) => ({
        ...state, 
        name: payload.name,
    }),
    
    [actionCreators.joined]: state => ({
        ...state, 
    }),
}, INITAL_STATE);

export const thunks = {
    join: name => dispatch => {
        dispatch(actionCreators.joining(name));
        hub.joinGame(name)
            .then(response => {
                dispatch(actionCreators.joined(response));
            });
    },

    guess: num => (dispatch, getState) => {
        dispatch(actionCreators.guessing(num));
        const name = getState().game.name;
        hub.makeGuess(name, num)
            .then(response => {
                dispatch(actionCreators.guessed(response)); 
            });
    },
};

export const hub = {
    store: null,
    connection: null,
    
    init(store) {
        console.log('Initializing game hub...');
        
        this.connection = new HubConnectionBuilder().withUrl('/game').build();
        this.store = store;
        
        this.connection.on('CreateGame', (msg) => {
            console.log('A new game has been created.', msg); 
        });
        
        this.connection.on('StartGame', (msg) => {
            console.log('The game has started.', msg);
        });
        
        this.connection.on('EndGame', (msg) => {
            console.log('The game has ended.', msg);
        });
        
        this.connection.start()
            .then(() => {
                console.log('Game Hub Initialized.');
            })
            .catch(console.error);
    },
    
    joinGame(name) {
        console.log('Joining game with name: ', name);
        return this.connection.invoke('JoinGame', name);  
    },
    
    makeGuess(name, guess) {
        return this.connection.invoke('MakeGuess', name, guess);
    },
};
