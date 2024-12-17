import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button } from 'react-rainbow-components';
import styles from './quiz.module.css';
import Api from '../axios/Api';
import { fetchShuffledQuestions } from './homeUtils';

const QuizModal = ({ isOpen, onClose, level }) => {
  const [maxQuestions, setMaxQuestions] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [alternatives, setAlternatives] = useState([]);

  const [questionStats, setQuestionStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const resetQuizState = useCallback(() => {
    setCurrentQuestion(null);
    setSelectedAlternative(null);
    setIsAnswerSubmitted(false);
    setIsCorrectAnswer(false);
    setAlternatives([]);
    setErrorMessage(null);
    setIsQuizFinished(false);
    setCurrentQuestionIndex(0);
    setQuestionStats({
      total: 0,
      correct: 0,
      incorrect: 0
    }
    );
  }, []);

  const initializeQuiz = useCallback(async () => {
    if (!isOpen) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Fetch shuffled questions for the selected level
      const shuffledQuestions = await fetchShuffledQuestions(level);

      if (shuffledQuestions.length === 0) {
        throw new Error('Nenhuma questão encontrada para este nível');
      }
      setMaxQuestions(shuffledQuestions.length)
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);

      // Load first question's alternatives
      const firstQuestion = shuffledQuestions[0];
      const alternativesResponse = await Api.get(`/alternativa/${firstQuestion.id}`);

      if (alternativesResponse.status !== 200 || !alternativesResponse.data) {
        throw new Error('Falha ao buscar alternativas');
      }

      // Shuffle alternatives
      const shuffledAlternatives = alternativesResponse.data.sort(() => 0.5 - Math.random());

      setCurrentQuestion(firstQuestion);
      setAlternatives(shuffledAlternatives);

    } catch (error) {
      console.error('Erro detalhado ao inicializar quiz:', error);
      setErrorMessage(error.message || 'Erro desconhecido ao carregar quiz');
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, level]);

  useEffect(() => {
    if (isOpen) {
      resetQuizState();
      initializeQuiz();
    }
  }, [isOpen, initializeQuiz]);

  const handleAlternativeSelect = (alternative) => {
    if (isAnswerSubmitted) return;
    setSelectedAlternative(alternative);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAlternative) return;

    // Usa diretamente o campo certoerrado da alternativa
    const isCorrect = selectedAlternative.certoerrado;

    // Atualiza estatísticas de questões
    setQuestionStats(prev => ({
      total: prev.total + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect
    }));

    setIsAnswerSubmitted(true);
    setIsCorrectAnswer(isCorrect);
  };

  const handleNextQuestion = async () => {
    // Verifica se atingiu o máximo de questões
    if (questionStats.total >= maxQuestions) {
      setIsQuizFinished(true);
      return;
    }

    // Move to next question
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);

    try {
      // Fetch alternatives for next question
      const nextQuestion = questions[nextIndex];
      const alternativesResponse = await Api.get(`/alternativa/${nextQuestion.id}`);

      if (alternativesResponse.status !== 200 || !alternativesResponse.data) {
        throw new Error('Falha ao buscar alternativas');
      }

      // Shuffle alternatives
      const shuffledAlternatives = alternativesResponse.data.sort(() => 0.5 - Math.random());

      // Reset state for next question
      setCurrentQuestion(nextQuestion);
      setAlternatives(shuffledAlternatives);
      setSelectedAlternative(null);
      setIsAnswerSubmitted(false);
      setIsCorrectAnswer(false);

    } catch (error) {
      console.error('Erro ao buscar próxima questão:', error);
      setErrorMessage(error.message || 'Erro ao carregar próxima questão');
    }
  };

  const handleCloseQuiz = () => {
    onClose(questionStats);
    resetQuizState();
  };

  if (!isOpen) return null;

  // Renderização do modal com tratamento de erro
  if (errorMessage) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        title="Erro no Quiz"
        size="small"
      >
        <div className={styles.errorContainer}>
          <p>{errorMessage}</p>
          <Button
            label="Tentar Novamente"
            variant="brand"
            onClick={initializeQuiz}
          />
          <Button
            label="Fechar"
            variant="neutral"
            onClick={onClose}
          />
        </div>
      </Modal>
    );
  }

  // Quiz finished - show final results
  if (isQuizFinished) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCloseQuiz}
        title={`Resultados do Quiz - is Finished: ${isQuizFinished}`}
        size="medium"
      >
        <div className={styles.quizResultsContainer}>
          <h2>Seu Desempenho</h2>
          <div className={styles.resultStats}>
            <p>Total de Questões: {questionStats.total}</p>
            <p>Respostas Corretas: {questionStats.correct}</p>
            <p>Respostas Incorretas: {questionStats.incorrect}</p>
            <p>Porcentagem de Acerto: {((questionStats.correct / questionStats.total) * 100).toFixed(2)}%</p>
          </div>
          <div className={styles.resultActions}>
            <Button
              label="Fechar"
              variant="brand"
              onClick={handleCloseQuiz}
            />
          </div>
        </div>
      </Modal>
    );
  } else {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        title={`Quiz de História - Nível ${level}`}
        size="large"
        className={styles.quizModal}
      >
        {isLoading ? (
          <div className={styles.loadingContainer}>
            Carregando pergunta...
          </div>
        ) : (
          <>
            <div className={styles.questionCounter}>
              Questão {currentQuestionIndex + 1} de {maxQuestions}
            </div>

            {!isAnswerSubmitted ? (
              <div className={styles.quizContent}>
                <h2 className={styles.questionStatement}>
                  {currentQuestion?.enuciado}
                </h2>
                <div className={styles.alternativesContainer}>
                  {alternatives.map((alternative) => (
                    <Button
                      key={alternative.id}
                      label={alternative.resposta}
                      variant={
                        selectedAlternative?.id === alternative.id
                          ? 'brand'
                          : 'outline-brand'
                      }
                      onClick={() => handleAlternativeSelect(alternative)}
                      className={styles.alternativeButton}
                    />
                  ))}
                </div>
                <Button
                  label="Confirmar"
                  variant="success"
                  disabled={!selectedAlternative}
                  onClick={handleSubmitAnswer}
                  className={styles.confirmButton}
                />
              </div>
            ) : (
              <div className={styles.resultContainer}>
                <h2
                  className={
                    isCorrectAnswer
                      ? styles.correctAnswerMessage
                      : styles.wrongAnswerMessage
                  }
                >
                  {isCorrectAnswer
                    ? 'Resposta Correta!'
                    : 'Resposta Incorreta!'}
                </h2>
                <Button
                  label={
                    questionStats.total < maxQuestions
                      ? "Próxima Questão"
                      : "Finalizar Quiz"
                  }
                  variant="brand"
                  onClick={handleNextQuestion}
                />
              </div>
            )}
          </>
        )}
      </Modal>
    );
  }
};

export default QuizModal;