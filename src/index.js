import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QuizProvider } from './context/quiz';

//1- Configurando router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './pages/Login';
//rotas professor
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroProfessor from './pages/CadastroProfessor';

//rotas alunos
import CadastroAluno from './pages/CadastroAluno';
import TodosOsAluno from './pages/TodosOsAlunos';

//rotas Assuntos
import CadastroAssunto from './pages/CadastroAssunto';
import TodosOsAssuntos from './pages/TodosOsAssuntos';

//rotas Questões
import NovaQuestao from './pages/NovaQuestao';
import TodasAsQuestoes from './pages/TodasAsQuestoes';

import Home from './pages/Home';
import HomeProfessor from './pages/HomeProfessor';
import TodosOsProfessores from './pages/TodosOsProfessores';

const router = createBrowserRouter([
  //rota de login
  {
    path: "/",
    element: <Login />,
  },
  //rota de cadastro de usuario
  {
    path: "cadastrousuario",
    element: <CadastroUsuario />,
  },
  //rota tela home
  {
    path: "home",
    element: <Home/>,
  },
  //rota tela rome de professor
  {
    path: "homeprofessor",
    element: <HomeProfessor/>,
  },
  //rota tela cadastro de professor
  {
    path: "cadastroprofessor",
    element: <CadastroProfessor/>,
  },
  //rota todos os professores
  {
    path: "todososprofessores",
    element: <TodosOsProfessores/>,
  },
  //rota cadastro de aluno
  {
    path: "cadastroaluno",
    element: <CadastroAluno/>,
  },
  //rota todos os aluno
  {
    path: "todososalunos",
    element: <TodosOsAluno/>,
  },
  //rota cadastro de assunto
  {
    path: "cadastroassunto",
    element: <CadastroAssunto/>,
  },
  //rota todos os assunto
  {
    path: "todososassuntos",
    element: <TodosOsAssuntos/>,
  },
  //rota cadastro de uma nova questão
  {
    path: "novaquestao",
    element: <NovaQuestao/>,
  },
  {
    path: "todasasquestoes",
    element: <TodasAsQuestoes/>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
