import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QuizProvider } from './context/quiz';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import CadastroProfessor from './pages/CadastroProfessor';
import CadastroAluno from './pages/CadastroAluno';
import TodosOsAluno from './pages/TodosOsAlunos';
import CadastroAssunto from './pages/CadastroAssunto';
import TodosOsAssuntos from './pages/TodosOsAssuntos';
import NovaQuestao from './pages/NovaQuestao';
import TodasAsQuestoes from './pages/TodasAsQuestoes';
import Home from './pages/Home';
import HomeProfessor from './pages/HomeProfessor';
import TodosOsProfessores from './pages/TodosOsProfessores';
import * as jose from 'jose';

const checkUserTypeByBearer = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  const { tipo } = jose.decodeJwt(token);
  return tipo;
}

const PrivateRoute = ({ children, userType, allowedTypes }) => {
  const currentUserType = checkUserTypeByBearer();
  if (!currentUserType || !allowedTypes.includes(currentUserType)) {
    return <Navigate to="/" />;
  }
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="home" element={
        <PrivateRoute userType="aluno" allowedTypes={['aluno']}>
          <Home />
        </PrivateRoute>
      } />
      <Route path="homeprofessor" element={
        <PrivateRoute userType="professor" allowedTypes={['professor']}>
          <HomeProfessor />
        </PrivateRoute>
      } />
      <Route path="cadastroprofessor" element={
        <PrivateRoute userType="professor" allowedTypes={['professor']}>
          <CadastroProfessor />
        </PrivateRoute>
      } />
      <Route path="todososprofessores" element={
        <PrivateRoute userType="professor" allowedTypes={['professor']}>
          <TodosOsProfessores />
        </PrivateRoute>
      } />
      <Route path="cadastroassunto" element={
        <PrivateRoute userType="professor" allowedTypes={['professor']}>
          <CadastroAssunto />
        </PrivateRoute>
      } />
      <Route path="todososassuntos" element={
        <PrivateRoute userType="professor" allowedTypes={['professor']}>
          <TodosOsAssuntos />
        </PrivateRoute>
      } />
      <Route path="novaquestao" element={
        <PrivateRoute userType="professor" allowedTypes={['professor']}>
          <NovaQuestao />
        </PrivateRoute>
      } />
      <Route path="todasasquestoes" element={
        <PrivateRoute userType="professor" allowedTypes={['professor']}>
          <TodasAsQuestoes />
        </PrivateRoute>
      } />
      <Route path="*" element={<Login />} />
    </Routes>
  </Router>
);