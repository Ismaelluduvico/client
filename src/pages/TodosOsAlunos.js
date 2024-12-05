import React, { useState, useEffect } from 'react';
import { Table, Column } from 'react-rainbow-components';
import { Input, Button, Spinner, Pagination, Modal } from 'react-rainbow-components';
import Api from '../axios/Api';
import styles from './todosOsAlunos.module.css';

const TodosOsAlunos = () => {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const [detalhes, setDetalhes] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedAluno, setEditedAluno] = useState(null);

    // Novo estado para confirmação de exclusão
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        alunoId: null
    });

    // Buscar alunos da API
    const fetchAlunos = async () => {
        setLoading(true);
        try {
            const response = await Api.get('/usuario/todosalunos/aluno');
            setAlunos(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Buscar detalhes do aluno
    const fetchDetalhesAluno = async (alunoId) => {
        setLoading(true);
        try {
            const response = await Api.get(`/usuario/${alunoId}`);
            setDetalhes(response.data);
            setEditedAluno(response.data[0]); // Preparar dados para edição
            setIsModalOpen(true);
        } catch (error) {
            console.error('Erro ao buscar detalhes do aluno:', error);
        } finally {
            setLoading(false);
        }
    };

    // Salvar edições do aluno
    const handleSalvarEdicao = async () => {
        setLoading(true);
        try {
            // Substitua pela sua API de atualização de aluno
            await Api.put(`/usuario/${editedAluno.id}`, editedAluno);

            // Atualizar lista de alunos
            const updatedAlunos = alunos.map(aluno =>
                aluno.id === editedAluno.id ? editedAluno : aluno
            );
            setAlunos(updatedAlunos);

            // Atualizar detalhes
            setDetalhes([editedAluno]);

            // Opcional: Adicionar feedback de sucesso
            alert('Aluno atualizado com sucesso!');

            // Fechar modal
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao salvar edições:', error);
            alert('Erro ao atualizar aluno');
        } finally {
            setLoading(false);
        }
    };

    // Nova função para deletar aluno
    const handleDeletarAluno = async () => {
        setLoading(true);
        try {
            // Substitua pela sua API de exclusão de aluno
            await Api.delete(`/usuario/${deleteConfirmation.alunoId}`);

            // Atualizar lista de alunos removendo o aluno deletado
            const updatedAlunos = alunos.filter(aluno => aluno.id !== deleteConfirmation.alunoId);
            setAlunos(updatedAlunos);

            // Fechar modal de confirmação
            setDeleteConfirmation({ isOpen: false, alunoId: null });

            // Atualizar total de páginas
            setTotalPages(Math.ceil(updatedAlunos.length / itemsPerPage));

            // Ajustar página atual se necessário
            if (currentPage > Math.ceil(updatedAlunos.length / itemsPerPage)) {
                setCurrentPage(Math.max(1, Math.ceil(updatedAlunos.length / itemsPerPage)));
            }

            // Opcional: Adicionar feedback de sucesso
            alert('Aluno deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar aluno:', error);
            alert('Erro ao deletar aluno');
        } finally {
            setLoading(false);
        }
    };

    // Função para abrir modal de confirmação de exclusão
    const openDeleteConfirmation = (alunoId) => {
        setDeleteConfirmation({
            isOpen: true,
            alunoId: alunoId
        });
    };

    // Fechar modal de confirmação de exclusão
    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            alunoId: null
        });
    };

    useEffect(() => {
        fetchAlunos();
    }, []);

    // Filtrar alunos baseado na busca
    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nomeusuario.toLowerCase().includes(busca.toLowerCase()) ||
        aluno.turma.toString().includes(busca)
    );

    // Paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const alunosAtuais = alunosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Função para mudar de página
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Função para ver detalhes do aluno
    const handleVerDetalhes = (alunoId) => {
        fetchDetalhesAluno(alunoId);
    };

    // Manipular mudanças nos campos de edição
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAluno(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fechar modal de detalhes
    const closeModal = () => {
        setIsModalOpen(false);
        setDetalhes(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Lista de Alunos</h1>
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
                    <Table data={alunosAtuais} keyField="id">
                        <Column header="Nome Completo" field="nomecompleto" />
                        <Column header="Usuario" field="nomeusuario" />
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

                    {/* Modal de Confirmação de Exclusão */}
                    <Modal
                        isOpen={deleteConfirmation.isOpen}
                        onRequestClose={closeDeleteConfirmation}
                        title="Confirmação de Exclusão"
                        className={styles.confirmationModal}
                    >
                        <div className={styles.modalContent}>
                            <p>Tem certeza que deseja apagar esse aluno?</p>
                            <div className={styles.modalActions}>
                                <Button
                                    variant="destructive"
                                    label="Continuar"
                                    onClick={handleDeletarAluno}
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

                    {/* Modal de Detalhes do Aluno */}
                    {isModalOpen && detalhes && (
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            title="Editar Aluno"
                            className={styles.detailsModal}
                        >
                            <div className={styles.modalContent}>
                                <div className={styles.detailsGrid}>
                                    <div>
                                        <strong>Usuário</strong>
                                        <Input
                                            name="nomeusuario"
                                            value={editedAluno.nomeusuario}
                                            onChange={handleInputChange}
                                            className={styles.editInput}
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <strong>Nome Completo</strong>
                                        <Input
                                            name="nomecompleto"
                                            value={editedAluno.nomecompleto}
                                            onChange={handleInputChange}
                                            className={styles.editInput}
                                        />
                                    </div>
                                    <div>
                                        <strong>Turma</strong>
                                        <Input
                                            name="turma"
                                            value={editedAluno.turma}
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

export default TodosOsAlunos;