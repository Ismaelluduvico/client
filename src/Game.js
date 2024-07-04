import { useContext, useEffect } from "react";
import { QuizContext } from "./context/quiz";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Questions from "./pages/Questions";
import GameOver from "./pages/GameOver";

import"./Game.css";

    function Game() {

        const [quizState, dispatch] = useContext(QuizContext);
        
        useEffect(() => {
        dispatch({type: "REORDER_QUESTIONS"});
        }, [])

        return (
        <div className="Game">
            <h1>Quiz de História</h1>
            
            {quizState.gameStage === "Start" && <Welcome/>}
            {quizState.gameStage === "Playing" && <Questions/>}
            {quizState.gameStage === "End" && <GameOver/>}
        
        </div>
        );
    }
export default Game;