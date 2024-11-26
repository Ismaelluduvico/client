import React, { useState, useEffect } from 'react';
import { Table, Column } from 'react-rainbow-components';
import { Input, Button, Spinner, Pagination, Modal } from 'react-rainbow-components';
import Api from '../axios/Api';
import styles from './todosProfessores.module.css';

const TodosOsProfessores = () => {
    const [professores, setProfessores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const [detalhes, setDetalhes] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedProfessor, setEditedProfessor] = useState(null);
    
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        professorId: null
    });

    const fetchProfessores = async () => {
        setLoading(true);
        try {
            const response = await Api.get('/usuario/todosalunos/professor');
            setProfessores(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetalhesProfessor = async (professorId) => {
        setLoading(true);
        try {
            const response = await Api.get(`/usuario/${professorId}`);
            setDetalhes(response.data);
            setEditedProfessor(response.data[0]);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Erro ao buscar detalhes do professor:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSalvarEdicao = async () => {
        setLoading(true);
        try {
            await Api.put(`/usuario/${editedProfessor.id}`, editedProfessor);
            
            const updatedProfessores = professores.map(professor => 
                professor.id === editedProfessor.id ? editedProfessor : professor
            );
            setProfessores(updatedProfessores);

            setDetalhes([editedProfessor]);
            
            alert('Professor atualizado com sucesso!');
            
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao salvar edições:', error);
            alert('Erro ao atualizar professor');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletarProfessor = async () => {
        setLoading(true);
        try {
            await Api.delete(`/usuario/${deleteConfirmation.professorId}`);
            
            const updatedProfessores = professores.filter(professor => professor.id !== deleteConfirmation.professorId);
            setProfessores(updatedProfessores);
            
            setDeleteConfirmation({ isOpen: false, professorId: null });
            
            setTotalPages(Math.ceil(updatedProfessores.length / itemsPerPage));
            
            if (currentPage > Math.ceil(updatedProfessores.length / itemsPerPage)) {
                setCurrentPage(Math.max(1, Math.ceil(updatedProfessores.length / itemsPerPage)));
            }
            
            alert('Professor deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar professor:', error);
            alert('Erro ao deletar professor');
        } finally {
            setLoading(false);
        }
    };

    const openDeleteConfirmation = (professorId) => {
        setDeleteConfirmation({
            isOpen: true,
            professorId: professorId
        });
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            professorId: null
        });
    };

    useEffect(() => {
        fetchProfessores();
    }, []);

    const professoresFiltrados = professores.filter(professor =>
        professor.nomeusuario.toLowerCase().includes(busca.toLowerCase()) ||
        professor.turma.toString().includes(busca)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const professoresAtuais = professoresFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleVerDetalhes = (professorId) => {
        fetchDetalhesProfessor(professorId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfessor(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setDetalhes(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Lista de Professores</h1>
                <div className={styles.searchBar}>
                    <Input
                        placeholder="Buscar por usuário ou turma"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {loading ? (
                <div className={styles.spinnerContainer}>
                    <Spinner size="large" variant="brand" />
                </div>
            ) : (
                <>
                    <Table data={professoresAtuais} keyField="id">
                        <Column header="Nome Completo" field="nomecompleto" />
                        <Column header="Usuário" field="nomeusuario" />
                        <Column header="Turma" field="turma" />
                        <Column
                            header="Ações"
                            component={({ row }) => (
                                <div className={styles.actionButtons}>
                                    <Button
                                        variant="outline-brand"
                                        label="Ver Detalhes"
                                        onClick={() => handleVerDetalhes(row.id)}
                                        className={styles.actionButton}
                                    />
                                    <Button
                                        variant="destructive"
                                        label="Deletar"
                                        onClick={() => openDeleteConfirmation(row.id)}
                                        className={styles.deleteButton}
                                    />
                                </div>
                            )}
                        />
                    </Table>

                    <div className={styles.paginationContainer}>
                        <Pagination
                            pages={totalPages}
                            activePage={currentPage}
                            onChange={handlePageChange}
                        />
                    </div>

                    <Modal
                        isOpen={deleteConfirmation.isOpen}
                        onRequestClose={closeDeleteConfirmation}
                        title="Confirmação de Exclusão"
                        className={styles.confirmationModal}
                    >
                        <div className={styles.modalContent}>
                            <p>Tem certeza que deseja apagar esse professor?</p>
                            <div className={styles.modalActions}>
                                <Button 
                                    variant="destructive" 
                                    label="Continuar" 
                                    onClick={handleDeletarProfessor} 
                                    className={styles.confirmButton}
                                />
                                <Button 
                                    variant="neutral" 
                                    label="Cancelar" 
                                    onClick={closeDeleteConfirmation} 
                                    className={styles.cancelButton}
                                />
                            </div>
                        </div>
                    </Modal>

                    {isModalOpen && detalhes && (
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            title="Editar Professor"
                            className={styles.detailsModal}
                        >
                            <div className={styles.modalContent}>
                                <div className={styles.detailsGrid}>
                                    <div>
                                        <strong>Usuário</strong>
                                        <Input
                                            name="nomeusuario"
                                            value={editedProfessor.nomeusuario}
                                            onChange={handleInputChange}
                                            className={styles.editInput}
                                        />
                                    </div>
                                    <div>
                                        <strong>Nome Completo</strong>
                                        <Input
                                            name="nomecompleto"
                                            value={editedProfessor.nomecompleto}
                                            onChange={handleInputChange}
                                            className={styles.editInput}
                                        />
                                    </div>
                                    <div>
                                        <strong>Turma</strong>
                                        <Input
                                            name="turma"
                                            value={editedProfessor.turma}
                                            onChange={handleInputChange}
                                            className={styles.editInput}
                                        />
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <Button 
                                        variant="success" 
                                        label="Salvar" 
                                        onClick={handleSalvarEdicao} 
                                        className={styles.saveButton}
                                    />
                                    <Button 
                                        variant="neutral" 
                                        label="Cancelar" 
                                        onClick={closeModal} 
                                        className={styles.cancelButton}
                                    />
                                </div>
                            </div>
                        </Modal>
                    )}
                </>
            )}
        </div>
    );
};

export default TodosOsProfessores;