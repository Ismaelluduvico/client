import easyLevelImage from '../img/american_16464845.png';
import mediumLevelImage from '../img/8502003.jpg';
import hardLevelImage from '../img/freepik__adjust__92133.png';
import randomLevelImage from '../img/—Pngtree—indian aboriginal side head elements_4178735.png';
import Api from '../axios/Api';

export const levelDetails = {
  easy: {
    avatar: easyLevelImage,
    message: "Explore a formação inicial da cultura dos povos brasileiros em um nível introdutório."
  },
  medium: {
    avatar: mediumLevelImage,
    message: "Aprofunde-se nos processos de interação e formação cultural no Brasil."
  },
  hard: {
    avatar: hardLevelImage,
    message: "Desafie-se com questões complexas sobre a diversidade cultural brasileira."
  },
  random: {
    avatar: randomLevelImage,
    message: "Explore a rica e diversa cultura brasileira através de questões de múltiplas dificuldades."
  }
};

export const levels = [
  { value: 'easy', label: 'Facil' },
  { value: 'medium', label: 'Medio' },
  { value: 'hard', label: 'Dificil' },
  { value: 'random', label: 'Aleatorio' },
];

export const handleStartGame = (level) => {
  if (!level) {
    console.error('Nenhum nível selecionado');
    return;
  }

  console.log(`Iniciando jogo no nível: ${level}`);
};

export const fetchRankings = async (level) => {
  try {
    const response = await Api.get(`/placar/${level}`);
    if (response.status !== 200) {
      throw new Error('Falha ao buscar o ranking');
    }
    const data = response.data;
    console.log(data)
    // Transformar os dados para incluir nome do usuário
    const transformedData = await Promise.all(data.map(async (item) => {
      return {
        name: item.nomecompleto,
        correctAnswers: item.questoescorretas,
        wrongAnswers: item.questoeserradas,
      };
    }));
    console.log(transformedData)
    return transformedData;
  } catch (error) {
    console.error('Erro ao buscar o ranking:', error);
    return [];
  }
};