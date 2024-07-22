import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

// TO DO: Move together there is a code repetition
export const INIT_GAME = "init_game" ;
export const MOVE = "move" ;
export const GAME_OVER = "game_over";

export const Game = () =>{

    const socket = useSocket() ;
    const [chess, setChess] = useState(new Chess()) ;
    const [board, setBoard] = useState(chess.board()) ;

    useEffect(()=>{
       if(!socket){
         return ;
       }
       socket.onmessage = (event) => {
           const message =  JSON.parse(event.data) ;
        
           switch(message.type){
            case INIT_GAME:
               console.log("Game Initialiser") ;
               
               setBoard(chess.board()) ;
               break ;
            case MOVE:
               // eslint-disable-next-line no-case-declarations
               const move = message.payload ;
               chess.move(move) ;
               setBoard(chess.board()) ;
               console.log("Move Made") ;
               break ;
            case GAME_OVER:
               console.log("Game Over") ;
               break ;
           }
       }
       }
    , [socket])
    if(!socket) return <div>Connecting....</div>


    return <div className="justify-center flex">
       <div className="pt-8 max-w-screen-lg flex">
          <div className="grid grid-cols-6 gap-4 md:grid-cols-2">
            <div className="cols-span-4 bg-red-200 flex justify-center">
            <ChessBoard  chess={chess} setBoard={setBoard} socket={socket} board={board}/>
            </div>
            <div className="cols-span-2 bg-slate-800 flex justify-center">
               <div className="pt-16">
            <Button onClick={() => {
              socket.send(JSON.stringify({
                     type: INIT_GAME
              }))
            }}>Play</Button>
            </div>
          </div>
          </div>
       </div>
    </div>
}