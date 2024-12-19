import React, { useState, useEffect } from 'react';
import { Table, Column } from 'react-rainbow-components';
import { Input, Button, Spinner, Modal } from 'react-rainbow-components';
import Api from '../axios/Api';
import { SidebarMenu } from './SidebarMenu';
import styles from './todosAssuntos.module.css';

const TodosOsAssuntos = () => {
    const [assuntos, setAssuntos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const [detalhes, setDetalhes] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedAssunto, setEditedAssunto] = useState(null);

    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        assuntoId: null
    });

    const fetchAssuntos = async () => {
        setLoading(true);
        try {
            const response = await Api.get('/topicos');
            setAssuntos(response.data);
        } catch (error) {
            console.error('Erro ao buscar assuntos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetalhesAssunto = async (assuntoId) => {
        setLoading(true);
        try {
            const response = await Api.get(`/topicos/${assuntoId}`);
            setDetalhes(response.data);
            setEditedAssunto(response.data[0]);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Erro ao buscar detalhes do assunto:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSalvarEdicao = async () => {
        setLoading(true);
        try {
            await Api.put(`/topicos/${editedAssunto.id}`, editedAssunto);

            const updatedAssuntos = assuntos.map(assunto =>
                assunto.id === editedAssunto.id ? editedAssunto : assunto
            );
            setAssuntos(updatedAssuntos);

            setDetalhes([editedAssunto]);

            alert('Assunto atualizado com sucesso!');

            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao salvar edições:', error);
            alert('Erro ao atualizar assunto');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletarAssunto = async () => {
        setLoading(true);
        try {
            await Api.delete(`/topicos/${deleteConfirmation.assuntoId}`);

            const updatedAssuntos = assuntos.filter(assunto => assunto.id !== deleteConfirmation.assuntoId);
            setAssuntos(updatedAssuntos);

            setDeleteConfirmation({ isOpen: false, assuntoId: null });

            alert('Assunto deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar assunto:', error);
            alert('Erro ao deletar assunto');
        } finally {
            setLoading(false);
        }
    };

    const openDeleteConfirmation = (assuntoId) => {
        setDeleteConfirmation({
            isOpen: true,
            assuntoId: assuntoId
        });
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            assuntoId: null
        });
    };

    useEffect(() => {
        fetchAssuntos();
    }, []);

    const assuntosFiltrados = assuntos.filter(assunto =>
        assunto.titulo.toLowerCase().includes(busca.toLowerCase())
    );

    const handleVerDetalhes = (assuntoId) => {
        fetchDetalhesAssunto(assuntoId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAssunto(prev => ({
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
                    <h1>Lista de Assuntos</h1>
                    <div className={styles.searchBar}>
                        <Input
                            placeholder="Buscar por título"
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
                        <Table className={styles.table} data={assuntosFiltrados} keyField="id">
                            <Column header="Título" field="titulo" />
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
                                <p>Tem certeza que deseja apagar esse assunto? Ao apagar este assunto todas as questões relacionadas a ele também serão apagadas</p>
                                <div className={styles.modalActions}>
                                    <Button
                                        variant="destructive"
                                        label="Continuar"
                                        onClick={handleDeletarAssunto}
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
                                title="Editar Assunto"
                                className={styles.detailsModal}
                            >
                                <div className={styles.modalContent}>
                                    <div className={styles.detailsGrid}>
                                        <div>
                                            <strong>Título</strong>
                                            <Input
                                                name="titulo"
                                                value={editedAssunto.titulo}
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

export default TodosOsAssuntos;