import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../axios/Api';
import { Menu, X, Home, LogOut, User as UserIcon, Edit, Award, Trash2 } from 'lucide-react';
import {
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Drawer,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';
import { ResultsModal } from './ResultsModal'; // Import the new modal component

export const SidebarMenuHomeAluno = ({ isMobile }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [userType, setUserType] = useState(null);
    const [userId, setUserId] = useState(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDeleteUser = async () => {
        try {
            await Api.delete('/usuario/delete');
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
        }
    };

    // User information state
    const [userInfo, setUserInfo] = useState({
        nomecompleto: '',
        nomeusuario: '',
        turma: '',
        senha: '',
        novasenha: ''
    });

    // Editable state
    const [editableUserInfo, setEditableUserInfo] = useState({ ...userInfo });
    const [isEditing, setIsEditing] = useState(false);
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Invalid token', e);
            return null;
        }
    };
    // Update the useEffect to also set the user ID
    useEffect(() => {
        const bearerToken = localStorage.getItem('token');
        const { nomecompleto, nomeusuario, turma, tipo, id } = parseJwt(bearerToken) || {};

        setUserInfo({
            nomecompleto: nomecompleto || '',
            nomeusuario: nomeusuario || '',
            turma: turma || ''
        });

        setEditableUserInfo({
            nomecompleto: nomecompleto || '',
            nomeusuario: nomeusuario || '',
            turma: turma || ''
        });

        setUserType(tipo);
        setUserId(id); // Set the user ID
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogoutConfirmation = () => {
        setIsLogoutDialogOpen(true);
    };

    const handleLogoutCancel = () => {
        setIsLogoutDialogOpen(false);
    };

    const handleLogout = () => {
        setUserInfo({
            nomecompleto: '',
            nomeusuario: '',
            turma: '',
            senha: '',
            novasenha: ''
        });
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleOpenUserModal = () => {
        setEditableUserInfo({ ...userInfo });
        setIsUserModalOpen(true);
        setIsEditing(false);
    };

    const handleCloseUserModal = () => {
        setIsUserModalOpen(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

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

            setUserInfo({ ...editableUserInfo });
            setIsEditing(false);
            setIsUserModalOpen(false);
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    };

    const menuItems = [
        {
            text: 'Home',
            icon: <Home size={20} />,
            path: '/home',
            active: true
        },
        {
            text: 'Meus resultados',
            icon: <Award size={20} />,
            onClick: () => setIsResultsModalOpen(true)
        }
    ];

    const sidebarStyle = {
        width: 240,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1a237e',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
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

    // Modify the renderMenuItems to handle the new menu item
    const renderMenuItems = (closeSidebar = false, userType) => (
        <Box
            style={{ overflow: 'auto', zIndex: 9999 }}
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                zIndex: 9999
            }}
        >
            <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Menu
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
                            onClick={() => {
                                if (item.path) {
                                    navigate(item.path);
                                    if (closeSidebar) toggleSidebar();
                                } else if (item.onClick) {
                                    item.onClick();
                                    if (closeSidebar) toggleSidebar();
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* User Profile Section */}
            <Box sx={{ mt: 'auto', width: '100%' }}>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)', mb: 2 }} />
                <ListItem
                    button
                    onClick={handleOpenUserModal}
                    sx={{
                        ...listItemStyle,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="subtitle1" sx={{ color: 'white', lineHeight: 1 }}>
                                {userInfo.nomeusuario}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {userInfo.nomecompleto}
                            </Typography>
                        </Box>
                    </Box>
                    <UserIcon size={20} color="white" />
                </ListItem>

                {/* Logout Button */}
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<LogOut size={20} />}
                    onClick={handleLogoutConfirmation}
                    sx={{
                        mt: 1,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)'
                        }
                    }}
                >
                    Sair
                </Button>
            </Box>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={isLogoutDialogOpen}
                onClose={handleLogoutCancel}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: '#1a237e',
                        color: 'white'
                    }
                }}
            >
                <DialogTitle id="logout-dialog-title" style={{color:'white'}}>Confirmar Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Tem certeza de que deseja sair do sistema?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLogoutCancel} sx={{ color: 'white' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleLogout} color="error" autoFocus>
                        Sair
                    </Button>
                </DialogActions>
            </Dialog>

            {/* User Information Modal */}
            <Dialog
                open={isUserModalOpen}
                onClose={handleCloseUserModal}
                maxWidth="xs"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: '#1a237e',
                        color: 'white'
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: 'white', marginLeft: '15%' }}>Informações do Usuário</h3>

                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: 1, ml: 11 }}>
                        <Button
                            onClick={handleEditToggle}
                            startIcon={<Edit size={20} />}
                            sx={{ color: 'white', mr: 1 }}
                        >
                            {isEditing ? 'Cancelar' : 'Editar'}
                        </Button>
                        {!isEditing && (
                            <Button
                                onClick={() => setIsDeleteDialogOpen(true)}
                                startIcon={<Trash2 size={20} />}
                                sx={{ color: 'error.main' }}
                            >
                                Deletar
                            </Button>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        {isEditing ? (
                            <>
                                <TextField
                                    fullWidth
                                    name="nomecompleto"
                                    label="Nome Completo"
                                    value={editableUserInfo.nomecompleto}
                                    onChange={handleUserInfoChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: { color: 'white' }
                                    }}
                                    InputProps={{
                                        style: { color: 'white' },
                                        sx: {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(255,255,255,0.3)'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white'
                                            }
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    style={{ color: 'white' }}
                                    name="nomeusuario"
                                    label="Usuário"
                                    value={editableUserInfo.nomeusuario}
                                    //onChange={handleUserInfoChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: { color: 'white' }
                                    }}
                                    InputProps={{
                                        style: { color: 'white' },
                                        sx: {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(255,255,255,0.3)'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white'
                                            }
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    name="turma"
                                    label="Turma"
                                    value={editableUserInfo.turma}
                                    onChange={handleUserInfoChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: { color: 'white' }
                                    }}
                                    InputProps={{
                                        style: { color: 'white' },
                                        sx: {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(255,255,255,0.3)'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white'
                                            }
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    name="senha"
                                    label="Senha Anterior"
                                    value={editableUserInfo.senha}
                                    onChange={handleUserInfoChange}
                                    margin="normal"
                                    variant="outlined"
                                    type="password"
                                    InputLabelProps={{
                                        style: { color: 'white' }
                                    }}
                                    InputProps={{
                                        style: { color: 'white' },
                                        sx: {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(255,255,255,0.3)'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white'
                                            }
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    name="novasenha"
                                    label="Nova Senha"
                                    type="password"
                                    value={editableUserInfo.novasenha}
                                    onChange={handleUserInfoChange}
                                    margin="normal"
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: { color: 'white' }
                                    }}
                                    InputProps={{
                                        style: { color: 'white' },
                                        sx: {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(255,255,255,0.3)'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white'
                                            }
                                        }
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <h2>Usuário</h2>
                                <Typography label="Usuário" variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                    {userInfo.nomeusuario}
                                </Typography>
                                <h2>Nome Completo</h2>
                                <Typography label="Nome Completo" variant="h6" sx={{ color: 'white', mb: 1 }}>
                                    {userInfo.nomecompleto}
                                </Typography>
                                <h2>Turma</h2>
                                <Typography label="Turma" variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {userInfo.turma}
                                </Typography>
                            </>
                        )}
                    </Box>
                </DialogContent>
                {isEditing && (
                    <DialogActions>
                        <Button
                            onClick={handleCloseUserModal}
                            sx={{ color: 'white' }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleSaveUserInfo}
                            color="primary"
                            variant="contained"
                        >
                            Salvar
                        </Button>
                    </DialogActions>
                )}
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: '#1a237e',
                        color: 'white'
                    }
                }}
            >
                <DialogTitle id="delete-dialog-title">Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} sx={{ color: 'white' }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteUser} color="error" autoFocus>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Results Modal */}
            {userId && (
                <ResultsModal
                    open={isResultsModalOpen}
                    onClose={() => setIsResultsModalOpen(false)}
                    userId={userId}
                />
            )}
        </Box>
    );

    if (isMobile) {
        return (
            <>
                <Box sx={{ display: { sm: 'none' }, p: 2, bgcolor: '#1a237e' }}>
                    <button
                        onClick={toggleSidebar}
                        style={{ background: 'none', border: 'none', color: 'white' }}
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </Box>
                <Drawer
                    variant="temporary"
                    open={isSidebarOpen}
                    onClose={toggleSidebar}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        ...sidebarStyle
                    }}
                >
                    {renderMenuItems(true, userType)}
                </Drawer>
            </>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', sm: 'block' },
                ...sidebarStyle
            }}
        >
            {renderMenuItems()}
        </Drawer>
    );
};
