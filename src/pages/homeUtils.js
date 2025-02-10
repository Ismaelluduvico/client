import easyLevelImage from '../img/american_16464845.png';
import mediumLevelImage from '../img/8502003.jpg';
import hardLevelImage from '../img/freepik__adjust__92133.png';
import randomLevelImage from '../img/—Pngtree—indian aboriginal side head elements_4178735.png';
import Api from '../axios/Api';

export const levels = [
  { value: 'Facil', label: 'Fácil' },
  { value: 'Medio', label: 'Médio' },
  { value: 'Dificil', label: 'Díficil' },
  { value: 'Aleatorio', label: 'Aleatórias' }
];

export const getLevelDisplayName = (levelValue) => {
  const levelOption = levels.find(l => l.value === levelValue);
  return levelOption ? levelOption.label : levelValue;
};

export const levelDetails = {
  Facil: {
    avatar: easyLevelImage,
    message: "Explore a formação inicial da cultura dos povos brasileiros em um nível introdutório."
  },
  Medio: {
    avatar: mediumLevelImage,
    message: "Aprofunde-se nos processos de interação e formação cultural no Brasil."
  },
  Dificil: {
    avatar: hardLevelImage,
    message: "Desafie-se com questões complexas sobre a diversidade cultural brasileira."
  },
  Aleatorio: {
    avatar: randomLevelImage,
    message: "Teste seus conhecimentos com uma seleção completamente aleatória de questões!"
  }
};

export const handleStartGame = (level, setIsQuizModalOpen) => {
  if (!level) {
    console.error('Nenhum nível selecionado');
    return;
  }

  console.log(`Iniciando jogo no nível: ${level}`);
  setIsQuizModalOpen(true);
};

export const fetchRankings = async (level) => {
  try {
    // Ignore ranking for Aleatorio level
    if (level === 'Aleatorio') {
      return [];
    }

    const response = await Api.get(`/placar/${level}`);
    if (response.status !== 200) {
      throw new Error('Falha ao buscar o ranking');
    }
    const data = response.data;

    // Transform the data to include user details
    const transformedData = data.map((item) => ({
      name: item.nomecompleto,
      correctAnswers: item.questoescorretas,
      wrongAnswers: item.questoeserradas,
    }));

    // Sort by correct answers in descending order
    const sortedData = transformedData.sort((a, b) => 
      b.correctAnswers - a.correctAnswers
    );

    // Assign rankings, handling ties
    const rankedData = sortedData.reduce((acc, current, index) => {
      // If it's the first item or has a different number of correct answers from the previous item
      if (index === 0 || current.correctAnswers !== sortedData[index - 1].correctAnswers) {
        current.rank = index + 1;
      } else {
        // Share the same rank if correct answers are the same
        current.rank = acc[index - 1].rank;
      }
      acc.push(current);
      return acc;
    }, []);

    return rankedData;
  } catch (error) {
    console.error('Erro ao buscar o ranking:', error);
    return [];
  }
};

// Modified fetchShuffledQuestions to handle random questions
export const fetchShuffledQuestions = async (level) => {
  try {
    let response;
    // Use different endpoint for Aleatorio level
    if (level === 'Aleatorio') {
      response = await Api.get('/questao/');
    } else {
      response = await Api.get(`/questao/dificuldade/${level}`);
    }
    
    if (response.status !== 200 || !response.data || response.data.length === 0) {
      throw new Error('Nenhuma questão encontrada');
    }

    // Shuffle the questions using Fisher-Yates algorithm
    const questions = response.data;
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return questions;
  } catch (error) {
    console.error('Erro ao buscar questões:', error);
    return [];
  }
};