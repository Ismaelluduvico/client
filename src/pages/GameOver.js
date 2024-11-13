import { useContext } from "react";
import { QuizContext } from "../context/quiz";
import Questions from "./Questions";

const GameOver = () => {

    const [quizState, dispatch] = useContext(QuizContext);  
  return (
    <div id="gameover">
    </div>
  );
};

export default GameOver