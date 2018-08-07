import { createAction, handleActions } from 'redux-actions';
import { HubConnectionBuilder } from '@aspnet/signalr';

const INITAL_STATE = {
    game: null,
    joined: false,
    response: null,
    lastGuess: null,
    joinError: null,
};

export const actionCreators = {
    joining: createAction('guessingGame/JOINING'),
    joined: createAction('guessingGame/JOINED'),
    joinError: createAction('guessingGame/JOIN_ERROR'),
    guessing: createAction('guessingGame/GUESSING'),
    guessed: createAction('guessingGame/GUESSED'),
    gameChanged: createAction('guessingGame/GAME_CHANGED'),
};

export const reducer = handleActions({
    [actionCreators.joining]: (state, { payload }) => ({
        ...state, 
        name: payload,
    }),
    
    [actionCreators.joined]: state => ({
        ...state, 
        joined: true, 
    }),
    
    [actionCreators.joinError]: (state, { payload }) => ({
        ...state, 
        joinError: payload,
    }),
    
    [actionCreators.guessing]: (state, { payload }) => ({
        ...state,
        lastGuess: payload, 
    }),
    
    [actionCreators.guessed]: (state, { payload }) => ({
        ...state, 
        response: payload,
    }),
    
    [actionCreators.gameChanged]: (state, { payload }) => ({
        ...state, 
        game: payload,
    }),
}, INITAL_STATE);

export const thunks = {
    join: name => dispatch => {
        dispatch(actionCreators.joining(name));
        hub.joinGame(name)
            .then(response => {
                // dispatch(actionCreators.joined(response));
            });
    },

    guess: num => (dispatch, getState) => {
        dispatch(actionCreators.guessing(num));
        const game = getState().game;
        const name = game.name;
        const gameId = game.game.gameId;
        
        hub.makeGuess(gameId, name, num)
            .then(response => {
                // dispatch(actionCreators.guessed(response)); 
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
        
        this.connection.on('GameCreated', game => {
            console.log('A game was created.', game);
            this.store.dispatch(actionCreators.gameChanged(game));
        });
        
        this.connection.on('GameState', game => {
            console.log('Game State Update.', game);
            this.store.dispatch(actionCreators.gameChanged(game));
        });
        
        this.connection.on('MakeGuessResponse', msg => {
            console.log('Guess Response: ', msg);
            this.store.dispatch(actionCreators.guessed(msg));
        });
        
        this.connection.on('GameJoined', name => {
            console.log('game joined', name);
            const submittedName = this.store.getState().game.name;
            if (submittedName === name) {
                this.store.dispatch(actionCreators.joined());
            } 
        });
        
        this.connection.on('GameJoinError', (name, msg) => {
            console.log('game join error', name, msg);
            this.store.dispatch(actionCreators.joinError(msg));
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
    
    makeGuess(gameId, name, guess) {
        return this.connection.invoke('MakeGuess', gameId, name, guess);
    },
};
