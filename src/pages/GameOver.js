import { useContext } from "react";
import { QuizContext } from "../context/quiz";

import Welldone from '../img/welldone.svg';

import './gameOver.css';
import Questions from "./Questions";

const GameOver = () => {

    const [quizState, dispatch] = useContext(QuizContext);  
  return (
    <div id="gameover">
        <h2>Fim de Jogo</h2>
        <p>Pontuação: {quizState.score}</p>
        <p>Você acertou {quizState.score} de {quizState.questions.length} perguntas.</p>
        <img src={Welldone} alt="Fim do quiz" />
        <button onClick={() => dispatch({ type: "NEW_GAME" })} >Reiniciar</button>
    </div>
  );
};

export default GameOver