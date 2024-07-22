import { WebSocket } from 'ws';
import { INIT_GAME, MOVE } from './messages';
import { Game } from './Game';

 class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket): void {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket): void {
        this.users = this.users.filter(user => user!== socket);
        // Optionally, handle stopping the game here if necessary
    }

    // private addHandler(socket: WebSocket): void {
    //     socket.on("message", (data) => {
    //         const message = JSON.parse(data.toString());
    //         if (message.type === INIT_GAME) {
    //             if (this.pendingUser) {
    //                 const game = new Game(this.pendingUser, socket) ;
    //                 this.games.push(game) ;
    //                 this.pendingUser = null ;
                    
    //             } else {
    //                 this.pendingUser = socket;
    //             }
    //         }
    //         if(message.type === MOVE){
    //             console.log("inside move");
    //             const game = this.games.find(game => game.player1 === socket || game.player2 === socket) ;
    //             console.log(game) ;
    //             if(game){
    //                 console.log("inside make move") ;
    //                 game.makeMove(socket, message.move);
    //             }
              
    //         }
    //     });
    // }

    // In GameManager.ts, modify the addHandler method to include error handling
private addHandler(socket: WebSocket): void {
    socket.on("message", (data) => {
        const message = JSON.parse(data.toString());
        
        try {
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload.move).catch(error => {
                        console.error(`Failed to make move: ${error}`);
                    });
                }
            }
        } catch (error) {
            console.error(`Error processing message: ${error}`);
        }
    });
}


}

module.exports = GameManager;