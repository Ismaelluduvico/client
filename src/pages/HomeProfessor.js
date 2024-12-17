import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, HelpCircle, Book } from 'lucide-react';
import { Card, CardContent, CardHeader, Box, Button } from '@mui/material';
import { SidebarMenu } from './SidebarMenu';
import styles from './homeProfessor.module.css';

const HomeProfessor = () => {
  const navigate = useNavigate();

  const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: '16px'
  };

  return (
    <div className={styles.container}>
      <SidebarMenu isMobile={true} />
      <SidebarMenu isMobile={false} />

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
              sx={{ pb: 0, textAlign: 'center' }}
            />
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{
                ...iconWrapperStyle,
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <GraduationCap size={24} color="white" />
              </Box>
              <Button 
                variant="newprofessor"
                sx={{ 
                  background: 'darkgreen', 
                  color: 'white', 
                  width: '100%', 
                  '&:hover': { background: 'lightgreen' } 
                }}
                onClick={() => navigate('/cadastroprofessor')}
              >
                Novo Professor
              </Button>
              <Button 
                variant="verprofessor" 
                onClick={() => navigate('/todososprofessores')}
                sx={{ 
                  background: 'darkgreen', 
                  color: 'white', 
                  width: '100%', 
                  mt: 2, 
                  '&:hover': { background: 'lightgreen' } 
                }}
              >
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
              <Button 
                variant="newaluno"
                onClick={() => navigate('/cadastroaluno')}
                sx={{ 
                  background: 'darkgreen', 
                  color: 'white', 
                  width: '100%', 
                  '&:hover': { background: 'lightgreen' } 
                }}
              >
                Novo Aluno
              </Button>
              <Button 
                variant="veraluno" 
                onClick={() => navigate('/todososalunos')}
                sx={{ 
                  background: 'darkgreen', 
                  color: 'white', 
                  width: '100%', 
                  mt: 2, 
                  '&:hover': { background: 'lightgreen' } 
                }}
              >
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
                variant="newqustao" 
                sx={{ 
                  background: 'darkgreen', 
                  color: 'white', 
                  width: '100%', 
                  '&:hover': { background: 'lightgreen' } 
                }}
              >
                Nova Questão
              </Button>
              <Button 
                variant="verqustao" 
                onClick={() => navigate('/todasasquestoes')}
                sx={{ 
                  background: 'darkgreen', 
                  color: 'white', 
                  width: '100%', 
                  mt: 2, 
                  '&:hover': { background: 'lightgreen' } 
                }}
              >
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
              <Button 
                variant="newassunto"
                onClick={() => navigate('/cadastroassunto')}
                sx={{ 
                  background: 'darkgreen', 
                  color: 'white', 
                  width: '100%', 
                  '&:hover': { background: 'lightgreen' } 
                }}
              >
                Novo Assunto
              </Button>
              <Button 
                variant="verassunto" 
                onClick={() => navigate('/todososassuntos')}
                sx={{ 
                  background: 'darkgreen', 
                  color: 'white', 
                  width: '100%', 
                  mt: 2, 
                  '&:hover': { background: 'lightgreen' } 
                }}
              >
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