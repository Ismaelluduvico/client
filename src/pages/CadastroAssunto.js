import React from 'react';
import Api from '../axios/Api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './cadastroAssunto.css'
import { Input, Button, Spinner, Notification} from 'react-rainbow-components';


const CadastroAssunto = () => {
    const navigate = useNavigate()

    const [titulo, setTitulo] = useState()
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({open: false, type: "", description: ""})



    const criarTopico = async () => {
        setLoading(true)
        try {
            const adicionaTopico = {titulo};

            await Api.post("/topicos/cadastrotopico", adicionaTopico);
            navigate('/homeprofessor');
        } catch (error) {
            setNotification({open: true, type: "error", description: "Não foi possivel cadastrar"})    
        } finally{setLoading(false)}
    };

    return (
        <div className='conteiner'>
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
            <div className='form'>
                <h1 className='usuario1'>NOVO ASSUNTO</h1>
                <form>

                    <Input
                        labelAlignment='left'
                        id="input-component-1"
                        label="Novo Assunto"
                        placeholder="Informe o Assuto"
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        type='text'
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <div className='button'>
                        <div className='button1'>
                            <Button
                                label='CANCELAR'
                                variant='brand'
                                onClick={() => navigate('/homeprofessor')}
                            />
                        </div>
                        <div className='button2'>
                            <Button
                                label='CRIAR'
                                variant='brand'
                                onClick={criarTopico}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CadastroAssunto