import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QuizProvider } from './context/quiz';

//1- Configurando router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './pages/Login';
import Game from './Game';
import CadastroUsuario from './pages/CadastroUsuario';
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
    path: "game",
    element: <Game />,
  },

  {
    path: "home",
    element: <Home/>,
  },

  {
    path: "homeprofessor",
    element: <HomeProfessor/>,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QuizProvider>
      <RouterProvider router={router} />
    </QuizProvider>
  </React.StrictMode>
);
