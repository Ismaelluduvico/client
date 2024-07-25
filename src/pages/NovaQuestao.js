import React from 'react';
import Api from '../axios/Api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styleQuestao from './novaQuestao.css'
import { Input, Button, Spinner, Notification } from 'react-rainbow-components';

const NovaQuestao = () => {

    const navigate = useNavigate()

    const [enuciado, setEnuciado] = useState()
    const [dificuldade, setDificuldade] = useState()
    const [assunto, setAssunto] = useState()
    const [auternativa1, setAuternativa1] = useState()
    const [auternativa2, setAuternativa2] = useState()
    const [auternativa3, setAuternativa3] = useState()
    const [auternativa4, setAuternativa4] = useState()
    const [certo1, setCerto1] = useState(false)
    const [certo2, setCerto2] = useState(false)
    const [certo3, setCerto3] = useState(false)
    const [certo4, setCerto4] = useState(false)

    const criarQuestão = async () => {
        try {
            
        } catch (error) {
            
        }
    }

    return (
        <div>NovaQuestao</div>
    )
}

export default NovaQuestao