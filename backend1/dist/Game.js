"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.moveCount = 0;
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    // makeMove(socket: WebSocket, move: {
    //     from: string;
    //     to: string;
    // }){
    //     // validate the type of move using zod
    //     if(this.board.moves().length%2 === 0 && socket !== this.player1)
    //     {
    //         return;
    //     }
    //     if(this.board.moves().length%2 === 0 && socket !== this.player2)
    //     {
    //          return;
    //     }
    //     console.log("Did not early return")
    //     try 
    //     {
    //         this.board.move(move) ;
    //     } 
    //     catch (e) 
    //     {
    //         console.log(e) ;    
    //         return ; 
    //     }
    //     console.log("move succeded") ;
    //     if(this.board.isGameOver()){
    //         this.player1.emit(JSON.stringify({
    //             type: GAME_OVER,
    //             payload: {
    //                 winner : this.board.turn() === 'w' ? this.player2 : this.player1
    //             }
    //         }))
    //         this.player2.emit(JSON.stringify({
    //             type: GAME_OVER,
    //             payload: {
    //                 winner : this.board.turn() === 'w' ? this.player2 : this.player1
    //             }
    //         }))
    //         return ;
    //     }
    //     console.log(this.board.moves().length) ;
    //     console.log(this.board.moves()) ;
    //     if(this.board.moves().length%2 === 0)
    //         {
    //             console.log("sent 1") ;
    //             this.player2.send(JSON.stringify({
    //                 type: MOVE,
    //                 payload: move
    //             }))
    //         }
    //         else{
    //             console.log("sent 2") ;
    //             this.player1.send(JSON.stringify({
    //                 type: "move",
    //                 payload: move
    //             }))
    //         }
    // }
    // Inside your Game class
    makeMove(socket, move) {
        // Existing validation and move making logic...
        return new Promise((resolve, reject) => {
            try {
                // Your existing logic here...
                console.log(this.moveCount);
                if (this.moveCount % 2 === 0 && socket !== this.player1) {
                    console.log("Early Return 1");
                    return;
                }
                if (this.moveCount % 2 === 1 && socket !== this.player2) {
                    console.log("Early Return 2");
                    return;
                }
                console.log("Did not early return");
                try {
                    this.board.move(move);
                }
                catch (e) {
                    console.log(e);
                    return;
                }
                console.log("move succeded");
                if (this.board.isGameOver()) {
                    this.player1.emit(JSON.stringify({
                        type: messages_1.GAME_OVER,
                        payload: {
                            winner: this.board.turn() === 'w' ? this.player2 : this.player1
                        }
                    }));
                    this.player2.emit(JSON.stringify({
                        type: messages_1.GAME_OVER,
                        payload: {
                            winner: this.board.turn() === 'w' ? this.player2 : this.player1
                        }
                    }));
                    return;
                }
                console.log(this.moveCount);
                if (this.moveCount === 0) {
                    console.log("sent 1");
                    this.player2.send(JSON.stringify({
                        type: messages_1.MOVE,
                        payload: move
                    }));
                }
                else {
                    console.log("sent 2");
                    this.player1.send(JSON.stringify({
                        type: "move",
                        payload: move
                    }));
                }
                this.moveCount++;
                resolve(); // Indicate successful completion
            }
            catch (e) {
                console.log(e);
                reject(e); // Pass the error to the promise rejection
            }
        });
    }
}
exports.Game = Game;
