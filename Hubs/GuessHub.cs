using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Logging;

namespace guess.domiz.io.Hubs
{
    public class GuessHub : Hub
    {
        private readonly ILogger<GuessHub> _logger;
        private IClientProxy _master;
        private GameInfo _currentGame;
        private ConcurrentDictionary<string, PlayerInfo> _players = new ConcurrentDictionary<string, PlayerInfo>();
        
        public GuessHub(ILogger<GuessHub> logger)
        {
            _logger = logger;
        }
        
        public async Task CreateGame(GameInfo game, string auth)
        {
            _logger.LogInformation("Game {gameId} has been created.", game.GameId);

            _master = Clients.Caller;
            _currentGame = game;
            
            await Clients.Others.SendAsync("GameCreated", game);
        }
        
        public async Task StartGame(string gameId, string auth)
        {
            _logger.LogInformation("Game {gameId} is starting.", gameId);

            _currentGame.Started = true;
            
            await Clients.Others.SendAsync("GameState", _currentGame);
        }

        public async Task JoinGame(string name)
        {
            var player = new PlayerInfo(name, Context);
            _logger.LogInformation("{name} requesting to join with connection id {connectionId}", name, player.ConnectionId);
            
            if (_players.ContainsKey(name))
            {
                if (_players.TryGetValue(name, out var c))
                {
                    if (!c.DisconnectToken.IsCancellationRequested)
                    {
                        _logger.LogInformation("{name} is already taken by {connectionId}", name, c.ConnectionId);
                        await Clients.Caller.SendAsync("GameJoinError", name, "That name is already taken");
                        return;
                    }
                }
            }

            _players.AddOrUpdate(name, (x) => player, (x, y) => player);
            _logger.LogInformation("{name} has joined the game with connection id {connectionId}.", name, player.ConnectionId);
            
            _logger.LogDebug("GameState Update: {gameId}", _currentGame?.GameId ?? "null");
            await Clients.Caller.SendAsync("GameState", _currentGame);
            
            _logger.LogDebug("GameJoined To All Clients");
            await Clients.All.SendAsync("GameJoined", name);
        }

        public async Task MakeGuess(string gameId, string name, string guess)
        {    
            _logger.LogInformation("{name} has guessed {guess}", name, guess);

            await _master.SendAsync("GuessMade", name, guess);
        }

        public async Task GuessMadeResponse(string name, string message)
        {
            _logger.LogInformation("GuessMadeResponse: {name}, {message}", name, message);
            if (!_players.TryGetValue(name, out var player))
            {
                return;
            }

            var client = Clients.Client(player.ConnectionId);
            if (client == null)
            {
                return;
            }

            await client.SendAsync("MakeGuessResponse", message);
        }
        
        public async Task EndGame(GameInfo game, string auth)
        {
            _logger.LogInformation("Game {gameId} has ended.", game.GameId);

            _currentGame.Finished = true;
            _currentGame.Winner = game.Winner;
            
            await Clients.Others.SendAsync("GameState", _currentGame);
        }

        public override Task OnConnectedAsync()
        {
            _logger.LogDebug("OnConnectedAsync: {connectionId}", Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            _logger.LogDebug("OnDisconnectedAsync({exception})", exception?.ToString() ?? "null");
            string keyToRemove = null;
            foreach (var pair in _players)
            {
                if (pair.Value.ConnectionId == Context.ConnectionId)
                {
                    keyToRemove = pair.Key;
                }
            }
            
            if (keyToRemove != null)
            {
                _players.TryRemove(keyToRemove, out var playerInfo);
                _logger.LogInformation("Player {name} disconnected", playerInfo.Name);
            }
            
            return base.OnDisconnectedAsync(exception);
        }
        
        private class PlayerInfo
        {
            public PlayerInfo(string name, HubCallerContext ctx)
            {
                Name = name;
                ConnectionId = ctx.ConnectionId;
                DisconnectToken = ctx.ConnectionAborted;
            }

            public string Name { get; set; }

            public string ConnectionId { get; set; }

            public CancellationToken DisconnectToken { get; set; }
        }

        public class GameInfo
        {
            public string GameId { get; set; }
            public bool Started { get; set; }
            public bool Finished { get; set; }
            public int Min { get; set; }
            public int Max { get; set; }
            public string Winner { get; set; }
        }
    }
}