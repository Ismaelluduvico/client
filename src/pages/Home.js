import Api from '../axios/Api';
import React from 'react';
import styles from './home.module.css';
import { RadioButtonGroup, Button } from 'react-rainbow-components';
import { useState } from 'react';

const Home = () => {

  const [level, setLevel] = useState();
  const hardAvatar = "https://img.freepik.com/free-vector/coloured-knight-design_1152-54.jpg?t=st=1721778061~exp=1721781661~hmac=834d0dedda278c69996d92e73a77d8eb7bd07801960484c4988fc0b5c685164a&w=740"
  const easyAvatar = "https://img.freepik.com/free-vector/coloured-knight-design_1152-54.jpg?t=st=1721778061~exp=1721781661~hmac=834d0dedda278c69996d92e73a77d8eb7bd07801960484c4988fc0b5c685164a&w=740"
  const mediumAvatar = "https://img.freepik.com/free-vector/fantasy-warrior-sword_225004-1263.jpg?t=st=1721778151~exp=1721781751~hmac=c06aeed18db5bbfbb7ac6a4106870a5194442de267c4948f62e549fa987d84ee&w=740"
  const randomAvatar = "https://img.freepik.com/free-vector/fantasy-warrior-sword_225004-1263.jpg?t=st=1721778151~exp=1721781751~hmac=c06aeed18db5bbfbb7ac6a4106870a5194442de267c4948f62e549fa987d84ee&w=740"

  const easyMensage = "Este modo de jogo possui questões com um nível de dificuldade baixo. Feito principalmente para quem ainda é iniciante."
  const mediumMensage = "Este modo de jogo possui questões com um nível de dificuldade média. Feito pra quem quer uma experiencia de jogo equilibrada."
  const hardMensage = "Este modo de jogo possui questões com um nível de ficuldade auta. Neste nível você colocará os seus mais profundos conhecimentos sobre história à prova!"
  const randomMensage = "Este modo de jogo contém questões de todoas as dificuldades."

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
        <div className={styles.levelDescription}>
          <img width={"40%"} src={{ easy: easyAvatar, medium: mediumAvatar, hard: hardAvatar, random: randomAvatar }[level]} />
          <h1>{{ easy: easyMensage, medium: mediumMensage, hard: hardMensage, random: randomMensage }[level]}</h1>
        </div>
        <div className={styles.inicarJogo}>
          <Button
            label='JOGAR'
            size="large"
          />
        </div>
      </div>
      <div className={styles.ranking}>
        <h1>Ranking</h1>
        <div className={styles.rankingHard}></div>
        <div className={styles.rankingMedium}></div>
        <div className={styles.rankingEasy}></div>
      </div>
    </div>
  )
}

export default Home

const levels = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Médio' },
  { value: 'hard', label: 'Difícil' },
  { value: 'random', label: 'Aleatório' },
]