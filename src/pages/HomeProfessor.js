import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, HelpCircle, Menu, X, Home, Book, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Drawer, Divider, Button } from '@mui/material';
import styles from './homeProfessor.module.css';

const HomeProfessor = () => {
  const navigate = useNavigate()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const menuItems = [
    { text: 'Home', icon: <Home size={20} />, active: true },
    { text: 'Professores', icon: <GraduationCap size={20} /> },
    { text: 'Alunos', icon: <Users size={20} /> },
    { text: 'Questões', icon: <Book size={20} /> },
    { text: 'Configurações', icon: <Settings size={20} /> }
  ];
  const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Centraliza os elementos no eixo vertical
    justifyContent: 'center', // Centraliza os elementos no eixo horizontal
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    backgroundColor: '#0C4070',
    borderRadius: '0.5rem',
    color: 'white',
    '&:hover': {
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      transform: 'translateY(-2px)',
      transition: 'all 0.2s ease-in-out'
    }
  };
  const iconWrapperStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px' // Adiciona espaço entre o ícone e os botões
  };
  const sidebarStyle = {
    width: 240,
    '& .MuiDrawer-paper': {
      width: 240,
      boxSizing: 'border-box',
      backgroundColor: '#1a237e',
      color: 'white'
    }
  };
  const listItemStyle = {
    marginY: 0.5,
    borderRadius: 1,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&.active': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    }
  };
  return (
    <div className={styles.container}>
      <Box sx={{ display: { sm: 'none' }, p: 2, bgcolor: '#1a237e' }}>
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'white' }}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Box>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          ...sidebarStyle
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Dashboard
          </Typography>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  ...listItemStyle,
                  ...(item.active ? { backgroundColor: 'rgba(255, 255, 255, 0.2)' } : {})
                }}
                button
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Drawer
        variant="temporary"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{
          display: { xs: 'block', sm: 'none' },
          ...sidebarStyle
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
            Dashboard
          </Typography>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                sx={listItemStyle}
                button
                onClick={toggleSidebar}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: '240px' },
          bgcolor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3,
          mt: 3
        }}>
          <Card sx={cardStyle}>
            <CardHeader
              title="Professores"
              titleTypographyProps={{ color: 'white' }}
              sx={{ pb: 0, textAlign: 'center' }} // Centraliza o título
            />
            <CardContent sx={{ textAlign: 'center' }}> {/* Centraliza o conteúdo do card */}
              <Box sx={{
                ...iconWrapperStyle,
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <GraduationCap size={24} color="white" />
              </Box>
              <Button variant="newprofessor"
                sx={{ background: 'darkgreen', color: 'white', width: '100%', '&:hover': { background: 'lightgreen' } }}
                onClick={() => navigate('/cadastroprofessor')}
              >
                Novo Professor
              </Button>
              <Button variant="verprofessor" sx={{ background: 'darkgreen', color: 'white', width: '100%', mt: 2, '&:hover': { background: 'lightgreen' } }}>
                Ver Professores
              </Button>
            </CardContent>
          </Card>
          <Card sx={cardStyle}>
            <CardHeader
              title="Alunos"
              titleTypographyProps={{ color: 'white' }}
              sx={{ pb: 0 }}
            />
            <CardContent>
              <Box sx={{
                ...iconWrapperStyle,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                mb: 2
              }}>
                <Users size={24} color="white" />
              </Box>
              <Button variant="newaluno"
                onClick={() => navigate('/cadastroaluno')}
                sx={{ background: 'darkgreen', color: 'white', width: '100%', '&:hover': { background: 'lightgreen' } }}>
                Novo Aluno
              </Button>
              <Button variant="veraluno" sx={{ background: 'darkgreen', color: 'white', width: '100%', mt: 2, '&:hover': { background: 'lightgreen' } }}>
                Ver Alunos
              </Button>
            </CardContent>
          </Card>
          <Card sx={cardStyle}>
            <CardHeader
              title="Questões"
              titleTypographyProps={{ color: 'white' }}
              sx={{ pb: 0 }}
            />
            <CardContent>
              <Box sx={{
                ...iconWrapperStyle,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                mb: 2
              }}>
                <HelpCircle size={24} color="white" />
              </Box>
              <Button
                onClick={() => navigate('/novaquestao')}
                variant="newqustao" sx={{ background: 'darkgreen', color: 'white', width: '100%', '&:hover': { background: 'lightgreen' } }}>
                Nova Questão
              </Button>
              <Button variant="verqustao" sx={{ background: 'darkgreen', color: 'white', width: '100%', mt: 2, '&:hover': { background: 'lightgreen' } }}>
                Ver Questões
              </Button>
            </CardContent>
          </Card>
          <Card sx={cardStyle}>
            <CardHeader
              title="Assunto"
              titleTypographyProps={{ color: 'white' }}
              sx={{ pb: 0 }}
            />
            <CardContent>
              <Box sx={{
                ...iconWrapperStyle,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                mb: 2
              }}>
                <Book size={24} color="white" />
              </Box>
              <Button variant="newassunto"
                onClick={() => navigate('/cadastroassunto')}
                sx={{ background: 'darkgreen', color: 'white', width: '100%', '&:hover': { background: 'lightgreen' } }}>
                Novo Assunto
              </Button>
              <Button variant="verassunto" sx={{ background: 'darkgreen', color: 'white', width: '100%', mt: 2, '&:hover': { background: 'lightgreen' } }}>
                Ver Assuntos
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </div>
  );
};

export default HomeProfessor;