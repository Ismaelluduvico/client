import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    CircularProgress,
    Typography,
    Box,
    Button
} from '@mui/material';
import Api from '../axios/Api';

export const ResultsModal = ({ open, onClose, userId }) => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('UseEffect triggered with:', { 
            open, 
            userId, 
            token: localStorage.getItem('token') 
        });

        const fetchResults = async () => {
            // Extensive logging to track function execution
            console.log('Fetch results function started');
            console.log('Current state:', { 
                open, 
                userId, 
                token: localStorage.getItem('token') 
            });

            // Validate inputs
            if (!open) {
                console.log('Modal is not open, skipping fetch');
                setIsLoading(false);
                return;
            }

            if (!userId) {
                console.error('No userId provided');
                setError('ID do usuário não encontrado');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                console.log(`Fetching results for userId: ${userId}`);

                // Verify token
                const token = localStorage.getItem('token');
                console.log('Token status:', token ? 'Token exists' : 'No token found');

                if (!token) {
                    throw new Error('Nenhum token de autenticação encontrado');
                }

                // Detailed API call logging
                console.log('Attempting API call with:', {
                    url: `/topicos/resultado/${userId}`,
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    }
                });

                const response = await Api.get(`/placar/reslutado/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Log full response
                console.log('Full API Response:', response);

                // Validate response
                if (!response) {
                    throw new Error('Resposta vazia do servidor');
                }

                // Check data
                const responseData = response.data;
                console.log('Response Data:', responseData);

                if (!responseData || !Array.isArray(responseData)) {
                    throw new Error('Dados inválidos recebidos');
                }

                setResults(responseData);
                setIsLoading(false);
            } catch (err) {
                // Comprehensive error logging
                console.error('Complete error object:', err);
                console.error('Error name:', err.name);
                console.error('Error message:', err.message);
                
                // Log additional error details if available
                if (err.response) {
                    console.error('Response error:', err.response.data);
                    console.error('Response status:', err.response.status);
                }

                setError(err.message || 'Erro desconhecido ao buscar resultados');
                setIsLoading(false);
            }
        };

        // Only fetch when modal opens
        if (open) {
            fetchResults();
        }
    }, [open, userId]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box textAlign="center" p={2}>
                    <Typography color="error" variant="h6" gutterBottom>
                        Erro ao carregar resultados
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => {
                            // Reset error and try fetching again
                            setError(null);
                            setIsLoading(true);
                        }}
                        sx={{ mt: 2 }}
                    >
                        Tentar Novamente
                    </Button>
                </Box>
            );
        }

        if (results.length === 0) {
            return (
                <Typography align="center" variant="body1" sx={{ p: 2 }}>
                    Nenhum resultado encontrado.
                </Typography>
            );
        }

        return (
            <TableContainer component={Paper} sx={{ backgroundColor: '#2196f3', color: 'white' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dificuldade</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Questões Corretas</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Questões Erradas</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map((result, index) => (
                            <TableRow key={index} hover>
                                <TableCell sx={{ color: 'white' }}>{result.dificuldade}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{result.questoescorretas}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{result.questoeserradas}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: '#1a237e',
                    color: 'white'
                }
            }}
        >
            <DialogTitle sx={{ color: 'white' }}>Meus Resultados</DialogTitle>
            <DialogContent>
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
};