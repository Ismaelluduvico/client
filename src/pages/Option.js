import { useContext } from "react";
import { QuizContext } from "../context/quiz";

const Option = ({option, selectOption, answer}) => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <div>
    </div>
  );
};

export default Option