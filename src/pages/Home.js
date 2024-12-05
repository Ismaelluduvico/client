import React, { useState, useEffect } from 'react';
import { RadioButtonGroup, Button, Table, Column, Modal } from 'react-rainbow-components';
import styles from './home.module.css';
import { levelDetails, levels, handleStartGame, fetchRankings } from './homeUtils';

const Home = () => {
  const [level, setLevel] = useState();
  const [rankings, setRankings] = useState({ 
    Facil: [], 
    Medio: [], 
    Dificil: [] 
  });
  const [showFullRankings, setShowFullRankings] = useState({
    Facil: false,
    Medio: false,
    Dificil: false
  });
  const [selectedLevelModal, setSelectedLevelModal] = useState(null);

  useEffect(() => {
    const fetchAllRankings = async () => {
      const facilRankings = await fetchRankings('Facil');
      const medioRankings = await fetchRankings('Medio');
      const dificilRankings = await fetchRankings('Dificil');

      setRankings({ 
        Facil: facilRankings, 
        Medio: medioRankings, 
        Dificil: dificilRankings 
      });
    };

    fetchAllRankings();
  }, []);

  const handleShowLevelRankings = (level) => {
    setSelectedLevelModal(level);
  };

  const handleCloseModal = () => {
    setSelectedLevelModal(null);
  };

  const renderRankingSection = (levelKey, levelName) => {
    const levelRankings = rankings[levelKey];
    
    return (
      <div className={styles[`ranking${levelKey}`]}>
        <h2>{levelName}</h2>
        <div className={styles.rankingContainer}>
          <Table 
            data={levelRankings.slice(0, 3).map((player, index) => ({
              ...player,
              rank: `${index + 1}º`
            }))} 
            keyField="name"
          >
            <Column 
              header="Ranking" 
              field="rank" 
              width={80}
            />
            <Column header="Nome" field="name" />
            <Column header="Corretas" field="correctAnswers" />
            <Column header="Incorretas" field="wrongAnswers" />
          </Table>
        </div>
        <Button
          label="Ver Todos"
          onClick={() => handleShowLevelRankings(levelKey)}
        />
      </div>
    );
  };

  const renderFullRankingModal = () => {
    if (!selectedLevelModal) return null;

    const fullRankings = rankings[selectedLevelModal];
    const levelName = {
      Facil: 'Fácil',
      Medio: 'Médio',
      Dificil: 'Difícil'
    }[selectedLevelModal];

    return (
      <Modal
        isOpen={!!selectedLevelModal}
        onRequestClose={handleCloseModal}
        title={`Ranking Completo - ${levelName}`}
        size="large"
      >
        <Table 
          data={fullRankings.map((player, index) => ({
            ...player,
            rank: `${index + 1}º`
          }))} 
          keyField="name"
        >
          <Column 
            header="Ranking" 
            field="rank" 
            width={80}
          />
          <Column header="Nome" field="name" />
          <Column header="Corretas" field="correctAnswers" />
          <Column header="Incorretas" field="wrongAnswers" />
        </Table>
      </Modal>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.quizz}>
        <h1>Quizz</h1>
        <div className={styles.quizzContent}>
          <RadioButtonGroup
            label="Selecione o nível de dificuldade"
            size="large"
            options={levels}
            variant="brand"
            value={level}
            onChange={({ target: { value } }) => setLevel(value)}
          />
        </div>
        {level && (
          <div className={styles.levelDescription}>
            <img 
              width="40%" 
              src={levelDetails[level].avatar} 
              alt={`Avatar ${level}`} 
            />
            <h1>{levelDetails[level].message}</h1>
          </div>
        )}
        <div className={styles.inicarJogo}>
          <Button
            label='JOGAR'
            size="large"
            onClick={() => handleStartGame(level)}
            disabled={!level}
          />
        </div>
      </div>
      <div className={styles.ranking}>
        <h1>Ranking</h1>
        {renderRankingSection('Facil', 'Fácil')}
        {renderRankingSection('Medio', 'Médio')}
        {renderRankingSection('Dificil', 'Difícil')}
      </div>
      {renderFullRankingModal()}
    </div>
  );
};

export default Home;