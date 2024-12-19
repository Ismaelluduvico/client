import React, { useState, useEffect } from 'react';
import { Table, Column } from 'react-rainbow-components';
import { Input, Button, Spinner, Modal } from 'react-rainbow-components';
import Api from '../axios/Api';
import { SidebarMenu } from './SidebarMenu';
import styles from './todosOsAlunos.module.css';

const TodosOsAlunos = () => {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const [detalhes, setDetalhes] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedAluno, setEditedAluno] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        alunoId: null
    });

    const fetchAlunos = async () => {
        setLoading(true);
        try {
            const response = await Api.get('/usuario/todosalunos/aluno');
            setAlunos(response.data);
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetalhesAluno = async (alunoId) => {
        setLoading(true);
        try {
            const response = await Api.get(`/usuario/${alunoId}`);
            setDetalhes(response.data);
            setEditedAluno(response.data[0]);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Erro ao buscar detalhes do aluno:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSalvarEdicao = async () => {
        setLoading(true);
        try {
            await Api.put(`/usuario/${editedAluno.id}`, editedAluno);
            const updatedAlunos = alunos.map(aluno =>
                aluno.id === editedAluno.id ? editedAluno : aluno
            );
            setAlunos(updatedAlunos);
            setDetalhes([editedAluno]);
            alert('Aluno atualizado com sucesso!');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao salvar edições:', error);
            alert('Erro ao atualizar aluno');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletarAluno = async () => {
        setLoading(true);
        try {
            await Api.delete(`/usuario/${deleteConfirmation.alunoId}`);
            const updatedAlunos = alunos.filter(aluno => aluno.id !== deleteConfirmation.alunoId);
            setAlunos(updatedAlunos);
            setDeleteConfirmation({ isOpen: false, alunoId: null });
            alert('Aluno deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar aluno:', error);
            alert('Erro ao deletar aluno');
        } finally {
            setLoading(false);
        }
    };

    const openDeleteConfirmation = (alunoId) => {
        setDeleteConfirmation({
            isOpen: true,
            alunoId: alunoId
        });
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            alunoId: null
        });
    };

    useEffect(() => {
        fetchAlunos();
    }, []);

    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nomeusuario.toLowerCase().includes(busca.toLowerCase()) ||
        aluno.turma.toString().includes(busca)
    );

    const handleVerDetalhes = (alunoId) => {
        fetchDetalhesAluno(alunoId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAluno(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setDetalhes(null);
    };

    return (
        <>
            <SidebarMenu isMobile={true} />
            <SidebarMenu isMobile={false} />
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
                        <Table className={styles.table} data={alunosFiltrados} keyField="id">
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
        </>
    );
};

export default TodosOsAlunos;