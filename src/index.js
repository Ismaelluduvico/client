import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QuizProvider } from './context/quiz';

//1- Configurando router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroProfessor from './pages/CadastroProfessor';
import CadastroAluno from './pages/CadastroAluno';
import CadastroAssunto from './pages/CadastroAssunto';
import NovaQuestao from './pages/NovaQuestao';
import Home from './pages/Home';
import HomeProfessor from './pages/HomeProfessor';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  
  {
    path: "cadastrousuario",
    element: <CadastroUsuario />,
  },

  {
    path: "home",
    element: <Home/>,
  },

  {
    path: "homeprofessor",
    element: <HomeProfessor/>,
  },
  {
    path: "cadastroprofessor",
    element: <CadastroProfessor/>,
  },
  {
    path: "cadastroaluno",
    element: <CadastroAluno/>,
  },
  {
    path: "cadastroassunto",
    element: <CadastroAssunto/>,
  },
  {
    path: "novaquestao",
    element: <NovaQuestao/>,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);
