import { useContext } from "react";
import { QuizContext } from "../context/quiz";

import Quiz from "../img/quiz.svg";

import { Input, Button } from 'react-rainbow-components';

const Welcome = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <div id = "welcome">
    </div>
  )
}

export default Welcome