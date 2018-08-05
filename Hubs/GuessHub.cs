using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace guess.domiz.io.Hubs
{
    public class GuessHub : Hub
    {
        private readonly ILogger<GuessHub> _logger;

        public GuessHub(ILogger<GuessHub> logger)
        {
            _logger = logger;
        }
        
        public Task CreateGame(string gameId, string auth)
        {
            return Task.CompletedTask;
        }
        
        public Task StartGame(string gameId, string auth)
        {
            return Task.CompletedTask;
        }

        public Task JoinGame(string name)
        {
            _logger.LogInformation("{name} has joined the game.", name);
            return Task.CompletedTask;
        }

        public Task MakeGuess(string gameId, string name, string guess)
        {    
            return Task.CompletedTask;
        }

        public Task EndGame(string gameId, string auth)
        {
            return Task.CompletedTask;
        }
    }
}