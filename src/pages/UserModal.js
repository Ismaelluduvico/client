import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../axios/Api';
import { 
  Modal, 
  Button, 
  Input 
} from 'react-rainbow-components';

export const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Api.post('/auth/logout');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Erro durante o logout:', error);
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      title="Confirmar Logout"
    >
      <p>Tem certeza de que deseja sair do sistema?</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button variant="neutral" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </Modal>
  );
};

export const UserModal = ({ isOpen, onClose, userInfo, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserInfo, setEditableUserInfo] = useState({ ...userInfo });

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setEditableUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUserInfo = async () => {
    try {
      const payload = {
        nomecompleto: editableUserInfo.nomecompleto,
        nomeusuario: editableUserInfo.nomeusuario,
        turma: editableUserInfo.turma,
        senha: editableUserInfo.senha,
        novasenha: editableUserInfo.novasenha
      };
      
      await Api.put('/auth/update', payload);

      onUpdateUser(editableUserInfo);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const renderEditMode = () => (
    <div>
      <Input
        label="Nome"
        name="nomecompleto"
        value={editableUserInfo.nomecompleto}
        onChange={handleUserInfoChange}
      />
      <Input
        label="Usuário"
        name="nomeusuario"
        value={editableUserInfo.nomeusuario}
        onChange={handleUserInfoChange}
      />
      <Input
        label="Turma"
        name="turma"
        value={editableUserInfo.turma}
        onChange={handleUserInfoChange}
      />
      <Input
        label="Senha Anterior"
        name="senha"
        type="password"
        value={editableUserInfo.senha}
        onChange={handleUserInfoChange}
      />
      <Input
        label="Nova Senha"
        name="novasenha"
        type="password"
        value={editableUserInfo.novasenha}
        onChange={handleUserInfoChange}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button variant="neutral" onClick={() => {
          setIsEditing(false);
          onClose();
        }}>
          Cancelar
        </Button>
        <Button variant="brand" onClick={handleSaveUserInfo}>
          Salvar
        </Button>
      </div>
    </div>
  );

  const renderViewMode = () => (
    <div>
      <p><strong>Usuário:</strong> {userInfo.nomeusuario}</p>
      <p><strong>Nome Completo:</strong> {userInfo.nomecompleto}</p>
      <p><strong>Turma:</strong> {userInfo.turma}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button variant="brand" onClick={() => setIsEditing(true)}>
          Editar
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      title={`Informações do Usuário ${isEditing ? '(Editando)' : ''}`}
    >
      {isEditing ? renderEditMode() : renderViewMode()}
    </Modal>
  );
};