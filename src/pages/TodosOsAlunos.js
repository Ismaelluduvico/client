import React, { useState, useEffect } from 'react';
import { Table, Column } from 'react-rainbow-components';
import { Input, Button, Spinner, Pagination } from 'react-rainbow-components';
import Api from '../axios/Api';
import styles from './todosOsAlunos.module.css';

const TodosOsAlunos = () => {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Buscar alunos da API
    const fetchAlunos = async () => {
        setLoading(true);
        try {
            const response = await Api.get('/alunos');
            setAlunos(response.data);
            setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlunos();
    }, []);

    // Filtrar alunos baseado na busca
    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
        aluno.matricula.toString().includes(busca)
    );

    // Paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const alunosAtuais = alunosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Função para mudar de página
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Lista de Alunos</h1>
                <div className={styles.searchBar}>
                    <Input
                        placeholder="Buscar por nome ou matrícula"
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
                        <Column header="Matrícula" field="matricula" />
                        <Column header="Nome" field="nome" />
                        <Column header="Email" field="email" />
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
                                        variant="outline-brand"
                                        label="Editar"
                                        onClick={() => handleEditar(row.id)}
                                        className={styles.actionButton}
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
                </>
            )}
        </div>
    );
};

export default TodosOsAlunos;