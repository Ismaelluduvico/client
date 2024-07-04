import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QuizProvider } from './context/quiz';

//1- Configurando router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home';
import Game from './Game';
import CadastroAluno from './pages/CadastroAluno';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "game",
    element: <Game />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QuizProvider>
      <RouterProvider router={router} />
    </QuizProvider>
  </React.StrictMode>
);
