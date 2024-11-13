import React from 'react';
import Api from '../axios/Api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './cadastroUsuario.module.css';
import { Input, Button, Spinner, Notification} from 'react-rainbow-components';


const CadastroProfessor = () => {
    const navigate = useNavigate()

    const [nomeusuario, setUsuario] = useState()
    const [senha, setSenha] = useState()
    const [turma, setTurma] = useState()
    const [nomecompleto, setNomeCompleto] = useState()
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({open: false, type: "", description: ""})



    const criarUsuario = async () => {
        setLoading(true)
        try {
            const adicionaUsuario = { nomeusuario, senha, turma, nomecompleto, tipo: "aluno" };

            await Api.post("/usuario/cadastro", adicionaUsuario);
            navigate('/');
        } catch (error) {
            setNotification({open: true, type: "error", description: "Não foi possivel cadastrar usuário"})    
        } finally{setLoading(false)}
    };

    return (
        <div className={styles.conteiner}>
            <Spinner type="arc" isVisible={loading} variant="brand"
                size="medium" style={{zIndex: 9999}}
            />
            {notification.open && <Notification
                title="Aviso"
                description={notification.description}
                icon={notification.type}
                onRequestClose={() => setNotification({open: false})}
                style={{position: "fixed", top: 30, right: 30}}
            />}
            {loading && <div style={{position: "absolute",
                 backgroundColor: "rgba(255,255,255,0.5)",
                 minWidth: "100%",
                minHeight: "100%",
                 zIndex: 9998}}
            />}
            <div className={styles.form}>
                <h1 className={styles.usuario1}>NOVA CONTA</h1>
                <form>

                    <Input
                        labelAlignment='left'
                        id="input-component-1"
                        label="Usuário"
                        placeholder="Informe o Usuário"
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        type='text'
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <Input
                        labelAlignment='left'
                        id="input-component-2"
                        label="Senha"
                        placeholder="Informe a Senha"
                        type="password"
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <Input
                        labelAlignment='left'
                        id="input-component-1"
                        label="Turma"
                        placeholder="Adicione a turma"
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        type='text'
                        onChange={(e) => setTurma(e.target.value)}
                    />
                    <Input
                        labelAlignment='left'
                        id="input-component-1"
                        label="Nome completo"
                        placeholder="Informe o seu nome completo"
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        type='text'
                        onChange={(e) => setNomeCompleto(e.target.value)}
                    />
                    <div className={styles.trocarPagina}>
                        <div className={styles.tenhoConta}>
                            <a href='/'>Já tenho uma conta</a>
                        </div>
                    </div>
                    <div className={styles.button}>
                        <div className={styles.button1}>
                            <Button
                                label='CANCELAR'
                                variant='brand'
                                onClick={() => navigate('/homeprofessor')}
                            />
                        </div>
                        <div className={styles.button2}>
                            <Button
                                label='CRIAR'
                                variant='brand'
                                onClick={criarUsuario}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CadastroProfessor