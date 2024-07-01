import { WebSocket } from "ws";
import { Chess } from 'chess.js' ;
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;
    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1 ;
        this.player2 = player2 ;
        this.board = new Chess();
        this.startTime = new Date() ;
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }
    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }){
        // validate the type of move using zod
        if(this.board.moves.length%2 === 0 && socket !== this.player1)
        {
            return;
        }
        if(this.board.moves.length%2 === 0 && socket !== this.player2)
        {
             return;
        }
        // console.log("Does not early return")
        try 
        {
            this.board.move(move) ;
        } 
        catch (e) 
        {
            console.log(e) ;    
            return ; 
        }
        // console.log("move succeded") ;
        if(this.board.isGameOver()){
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner : this.board.turn() === 'w' ? this.player2 : this.player1
                }
            }))
            this.player2.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner : this.board.turn() === 'w' ? this.player2 : this.player1
                }
            }))
            return ;
        }

        if(this.board.moves.length%2 === 0)
            {
                this.player2.emit(JSON.stringify({
                    type: MOVE,
                    payload: move
                }))
            }
            else{
                this.player1.emit(JSON.stringify({
                    type: "move",
                    payload: move
                }))
            }
         
    }
}