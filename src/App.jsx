import React from "react";
import "./styles/index.css";
import {useState} from 'react'
import confetti from 'canvas-confetti'
import Square from './components/Square.jsx'
import {TURNS} from './constants.js'
import {checkWinnerFrom,checkEndGame} from './logic/board.js'
import {WinnerModal} from './components/WinnerModal.jsx'

const App = () => {
  const [board,setBoard] = useState(()=>{
    const boardFromStorage = window.localStorage.getItem('board');
    if(boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null)
  });

  const [turn,setTurn]=useState(() =>{
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  });//este estado nos indicará el turno de "X" o "O"

  const [winner,setWinner] = useState(null) // null es que no hay ganador, false es que hay un empate
  
  const resetGame = () =>{
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    window.localStorage.removeItem('board');
    window.localStorage.removeItem('turn');
  }
  const updateBoard = (index) =>{

    if(board[index] || winner) return
    const newBoard = [...board];
    newBoard[index]= turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    //guardar partida
    window.localStorage.setItem('board',JSON.stringify(newBoard))
    window.localStorage.setItem('turn',newTurn)
    //revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard);
    if(newWinner){
      setWinner(newWinner);
      confetti();
    } else if (checkEndGame(newBoard)){
      setWinner(false) //empate
    }
  
  }
  return (
    <>
      <main className='board'>
        <h1>Tic tac toe</h1>
        <button onClick={resetGame}>Reset game</button>
        <section className='game'>
          {board.map((_, index) => {
            return(
              <Square key={index} index={index} updateBoard={updateBoard}>
                {board[index]}
              </Square>
            )
          })}
        </section>
        <section className="turn">
          <Square isSelected={turn===TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn===TURNS.O}>{TURNS.O}</Square>
        </section>
        <WinnerModal resetGame={resetGame} winner={winner}/>
      </main>
    </>
  );
};

export default App;
