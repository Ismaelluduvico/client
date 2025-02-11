import React, { useState, useEffect } from 'react';
import { Table, Column, CheckboxGroup, Textarea } from 'react-rainbow-components';
import { Input, Button, Spinner, Modal, Select } from 'react-rainbow-components';
import Api from '../axios/Api';
import { SidebarMenu } from './SidebarMenu';
import styles from './todasQuestoes.module.css';

const TodasAsQuestoes = () => {
    const [questoes, setQuestoes] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const [detalhes, setDetalhes] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedQuestao, setEditedQuestao] = useState(null);
    const [alternativas, setAlternativas] = useState([]);
    const [editedAlternativas, setEditedAlternativas] = useState([]);

    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        questaoId: null
    });

    const fetchQuestoes = async () => {
        setLoading(true);
        try {
            const [questoesResponse, topicosResponse] = await Promise.all([
                Api.get('/questao'),
                Api.get('/topicos')
            ]);

            const questoesData = questoesResponse?.data || [];
            const topicosData = topicosResponse?.data || [];

            setQuestoes(questoesData);
            setTopicos(topicosData);
        } catch (error) {
            console.error('Erro ao buscar questões:', error);
            alert('Erro ao carregar questões. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDetalhesQuestao = async (questaoId) => {
        if (!questaoId) return;

        setLoading(true);
        try {
            const [questaoResponse, alternativasResponse] = await Promise.all([
                Api.get(`/questao/${questaoId}`),
                Api.get(`/alternativa/${questaoId}`)
            ]);

            const questaoData = questaoResponse?.data?.[0];
            const alternativasData = alternativasResponse?.data || [];

            if (questaoData) {
                setDetalhes(questaoData);
                setEditedQuestao(questaoData);
                setAlternativas(alternativasData);
                setEditedAlternativas(alternativasData);
                setIsModalOpen(true);
            } else {
                alert('Não foi possível carregar os detalhes da questão.');
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes da questão:', error);
            alert('Erro ao carregar detalhes da questão');
        } finally {
            setLoading(false);
        }
    };

    const handleSalvarEdicao = async () => {
        if (!editedQuestao?.id) {
            alert('Dados da questão inválidos');
            return;
        }

        setLoading(true);
        try {
            await Api.put(`/questao/${editedQuestao.id}`, editedQuestao);

            const alternativasPromises = editedAlternativas.map(alt =>
                Api.put(`/alternativa/${alt.id}`, alt)
            );
            await Promise.all(alternativasPromises);

            const updatedQuestoes = questoes.map(questao =>
                questao.id === editedQuestao.id ? editedQuestao : questao
            );
            setQuestoes(updatedQuestoes);
            setDetalhes(editedQuestao);
            setAlternativas(editedAlternativas);

            alert('Questão e alternativas atualizadas com sucesso!');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao salvar edições:', error);
            alert('Erro ao atualizar questão e alternativas');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletarQuestao = async () => {
        if (!deleteConfirmation.questaoId) return;

        setLoading(true);
        try {
            await Api.delete(`/questao/${deleteConfirmation.questaoId}`);

            const updatedQuestoes = questoes.filter(questao =>
                questao.id !== deleteConfirmation.questaoId
            );
            setQuestoes(updatedQuestoes);
            setDeleteConfirmation({ isOpen: false, questaoId: null });
            alert('Questão deletada com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar questão:', error);
            alert('Erro ao deletar questão');
        } finally {
            setLoading(false);
        }
    };

    const handleAlternativaChange = (index, field, value) => {
        console.log(index, field, value);
        setEditedAlternativas(prev => {
            const updated = [...prev];
            if (field === 'certoerrado') {
                updated.forEach(alt => alt.certoerrado = false);
            }
            updated[index] = {
                ...updated[index],
                [field]: value
            };
            return updated;
        });
    };

    const openDeleteConfirmation = (questaoId) => {
        if (!questaoId) return;
        setDeleteConfirmation({
            isOpen: true,
            questaoId: questaoId
        });
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            questaoId: null
        });
    };

    useEffect(() => {
        fetchQuestoes();
    }, []);

    const questoesFiltradas = questoes.filter(questao => {
        if (!questao || !busca) return true;
        const searchTerm = busca.toLowerCase();

        const enunciadoMatch = questao.enuciado?.toLowerCase().includes(searchTerm) || false;
        const dificuldadeMatch = questao.dificuldade?.toLowerCase().includes(searchTerm) || false;

        const topico = topicos.find(t => t?.id === questao.topicoid);
        const topicoMatch = topico?.titulo?.toLowerCase().includes(searchTerm) || false;

        return enunciadoMatch || dificuldadeMatch || topicoMatch;
    });

    const handleVerDetalhes = (questaoId) => {
        if (questaoId) {
            fetchDetalhesQuestao(questaoId);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name && editedQuestao) {
            setEditedQuestao(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setDetalhes(null);
        setAlternativas([]);
        setEditedQuestao(null);
        setEditedAlternativas([]);
    };

    return (
        <>
            <SidebarMenu isMobile={true} />
            <SidebarMenu isMobile={false} />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 style={{color:'#3F4954', marginLeft:'1%', marginTop:'3%'}}>QUESTÕES</h1>
                    <div className={styles.searchBar}>
                        <Input
                            placeholder="Buscar por enunciado, dificuldade ou tópico"
                            value={busca}
                            onChange={(e) => setBusca(e.target?.value || '')}
                            className={styles.buscaInput}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className={styles.spinnerContainer}>
                        <Spinner size="large" variant="brand" />
                    </div>
                ) : (
                    <>
                        <Table className={styles.table} data={questoesFiltradas} keyField="id">
                            <Column
                                header="Enunciado"
                                field="enuciado"
                                component={({ value }) => value || 'N/A'}
                            />
                            <Column
                                header="Dificuldade"
                                field="dificuldade"
                                component={({ value }) => value || 'N/A'}
                            />
                            <Column
                                header="Tópico"
                                component={({ row }) => {
                                    const topico = topicos.find(t => t?.id === row?.topicoid);
                                    return topico?.titulo || 'N/A';
                                }}
                            />
                            <Column
                                header="Ações"
                                component={({ row }) => (
                                    <div className={styles.actionButtons}>
                                        <Button
                                            variant="outline-brand"
                                            label="Ver Detalhes"
                                            onClick={() => row?.id && handleVerDetalhes(row.id)}
                                            className={styles.actionButton}
                                        />
                                        <Button
                                            variant="destructive"
                                            label="Deletar"
                                            onClick={() => row?.id && openDeleteConfirmation(row.id)}
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
                                <p>Tem certeza que deseja apagar essa questão?</p>
                                <div className={styles.modalActions}>
                                    <Button
                                        variant="destructive"
                                        label="Continuar"
                                        onClick={handleDeletarQuestao}
                                        className={styles.confirmButton}
                                        disabled={loading}
                                    />
                                    <Button
                                        variant="neutral"
                                        label="Cancelar"
                                        onClick={closeDeleteConfirmation}
                                        className={styles.cancelButton}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </Modal>

                        {isModalOpen && editedQuestao && (
                            <Modal
                                isOpen={isModalOpen}
                                onRequestClose={closeModal}
                                title="Editar Questão"
                                className={styles.detailsModal}
                            >
                                <div className={styles.modalContent}>
                                    <div className={styles.detailsGrid}>
                                        <div>
                                            <strong>Enunciado</strong>
                                            <Textarea
                                                name="enuciado"
                                                value={editedQuestao.enuciado || ''}
                                                onChange={handleInputChange}
                                                className={styles.editInput}
                                                multiline
                                                maxLength={500}
                                            />
                                        </div>
                                        <div>
                                            <strong>Dificuldade</strong>
                                            <Select
                                                name="dificuldade"
                                                value={editedQuestao.dificuldade || ''}
                                                onChange={handleInputChange}
                                                options={[
                                                    { value: 'Facil', label: 'Fácil' },
                                                    { value: 'Medio', label: 'Médio' },
                                                    { value: 'Dificil', label: 'Difícil' }
                                                ]}
                                                className={styles.editInput}
                                            />
                                        </div>
                                        <div>
                                            <strong>Tópico</strong>
                                            <Select
                                                name="topicoid"
                                                value={editedQuestao.topicoid || ''}
                                                onChange={handleInputChange}
                                                options={topicos.map(topico => ({
                                                    value: topico.id,
                                                    label: topico.titulo
                                                }))}
                                                className={styles.editInput}
                                            />
                                        </div>
                                        <div>
                                            <strong>Alternativas</strong>
                                            {editedAlternativas.map((alt, index) => (
                                                <div key={alt.id} className={styles.alternativaItem}>
                                                    <Textarea
                                                        value={alt.resposta || ''}
                                                        onChange={(e) => handleAlternativaChange(index, 'resposta', e.target?.value)}
                                                        className={styles.editInput}
                                                        placeholder="Digite a alternativa"
                                                        maxLength={500}
                                                    />
                                                    <CheckboxGroup
                                                        options={[
                                                            { value: "true", label: 'Correta' }
                                                        ]}
                                                        value={alt.certoerrado === true ? ["true"] : []}
                                                        onChange={(e) => handleAlternativaChange(index, 'certoerrado', e.includes("true"))}
                                                        className={styles.checkboxGroup}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.modalActions}>
                                        <Button
                                            variant="success"
                                            label="Salvar"
                                            onClick={handleSalvarEdicao}
                                            disabled={loading}
                                            className={styles.saveButton}
                                        />
                                        <Button
                                            variant="neutral"
                                            label="Cancelar"
                                            onClick={closeModal}
                                            disabled={loading}
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

export default TodasAsQuestoes;