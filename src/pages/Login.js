import Api from '../axios/Api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { Input, Button, Spinner, Notification } from 'react-rainbow-components';
import * as jose from 'jose'

const Login = () => {

    const navigate = useNavigate()

    const [nomeusuario, setUsuario] = useState()
    const [senha, setSenha] = useState()
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({ open: false, type: "", description: "" })

    const Logar = async () => {
        setLoading(true)
        try {
            const dadosUsuario = { nomeusuario, senha };
            const { data } = await Api.post("/auth/login", dadosUsuario);
            const { tipo } = jose.decodeJwt(data.token)
            localStorage.setItem("token", data.token)

            const screenToNavigate = {
                aluno: '/home',
                professor: '/homeprofessor',
                root: 'homeprofessor'
            }[tipo]

            navigate(screenToNavigate)

        } catch (error) {
            console.log(error)
            setNotification({ open: true, type: "error", description: "Usuário ou senha incorreta" })
        } finally { setLoading(false) }
    };

    return (
        <div className='conteiner1'>
            <Spinner type="arc" isVisible={loading} variant="brand"
                size="medium" style={{ zIndex: 9999 }}
            />
            {notification.open && <Notification
                title="Aviso"
                description={notification.description}
                icon={notification.type}
                onRequestClose={() => setNotification({ open: false })}
                style={{ position: "fixed", top: 30, right: 30 }}
            />}
            {loading && <div style={{
                position: "absolute",
                backgroundColor: "rgba(255,255,255,0.5)",
                minWidth: "100%",
                minHeight: "100%",
                zIndex: 9998
            }}
            />}
            <div className='form1'>
                <form>
                    <h1 className='usuario'>USUÁRIO</h1>

                    <div className='input'>
                        <Input

                            labelAlignment='left'
                            id="input-component-1"
                            label="Usuário"
                            placeholder="Informe o nome de Usuário"
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
                        <div className='trocarPagina1'>
                            <div className='naoTenhoConta'>
                                <a href='/cadastrousuario'>Não tenho uma conta</a>
                            </div>
                        </div>
                    </div>
                    <div className='button3'>
                        <Button
                            label='Entrar'
                            variant='brand'
                            onClick={Logar}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;