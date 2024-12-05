import React, { useState, useEffect } from 'react';
import Api from '../axios/Api';
import { useNavigate } from 'react-router-dom';
import styles from './novaQuestao.module.css';
import { Button, Notification, Textarea, RadioGroup, Select, Spinner } from 'react-rainbow-components';

const NovaQuestao = () => {
    const navigate = useNavigate();
    const [enuciado, setEnunciado] = useState('');
    const [dificuldade, setDificuldade] = useState('');
    const [assunto, setAssunto] = useState('');
    const [alternativas, setAlternativas] = useState([...Array(5)].map(i => ({
        resposta: '', certoerrado: false, questaoid: null
    })));
    const [correta, setCorreta] = useState(null);
    const [assuntos, setAssuntos] = useState([]);
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({ open: false, type: "", description: "" });

    useEffect(() => {
        const fetchAssuntos = async () => {
            try {
                const response = await Api.get("/topicos/");
                setAssuntos(response.data.map(i => ({ value: i.id, label: i.titulo })));
            } catch (err) {
                console.error("Ops! Ocorreu um erro: " + err);
            }
        };
        fetchAssuntos();
    }, []);

    const criarQuestao = async () => {
        setLoading(true)
        if (!enuciado || !dificuldade || !assunto) {
            setNotification({ open: true, type: "error", description: "Preencha todos os campos obrigatórios!" });
            return;
        }

        if (alternativas.some(alt => alt.resposta === "")){
            setNotification({ open: true, type: "error", description: "Preencha todos os campos obrigatórios!" });
            setLoading(false)
            return;
        }

        const payload = {
            topicoid: parseInt(assunto),
            enuciado: enuciado,
            dificuldade: dificuldade
        };

        try {
            const result = await Api.post("/questao/", payload);
            const dados = result.data; // Supondo que a API retorna o ID da nova questão 
            const questaoid = dados[0].id;
            const {status} = await criarAlternativas(questaoid);

            if (status === "error"){
                setNotification({ open: true, type: "error", description: "Não foi possivel adicionar alternativas" });
                return 
            }

            setNotification({ open: true, type: "success", description: "Questão e alternativas criadas com sucesso!" });
            navigate('/homeprofessor');
        } catch (error) {
            console.error("Ops! ocorreu um erro: " + error);
            setNotification({ open: true, type: "error", description: "Erro ao criar questão." });
        }
    };

    const criarAlternativas = async (questaoid) => {
        
        const payloadAlternativas = alternativas.map((alt, index) => ({
            resposta: alt.resposta,
            certoerrado: alt.certoerrado, // Define se é a alternativa correta
            questaoid: questaoid
        }));

        try {
            await Promise.all(payloadAlternativas.map(alt => Api.post("/alternativa/", alt)));
            return {status: "success"}
        } catch (error) {
            console.error("Ops! ocorreu um erro ao criar alternativas: " + error);
            setNotification({ open: true, type: "error", description: "Erro ao criar alternativas." });
        }
    };

    const dificuldades = [
        {value: "", label: "Selecione uma dificuldade"},
        { value: "Facil", label: "Fácil" },
        { value: "Medio", label: "Médio" },
        { value: "Dificil", label: "Difícil" },
    ];

    const handleAlternativaChange = (index, value) => {
        const newAlternativas = [...alternativas];
        newAlternativas[index].resposta = value;
        setAlternativas(newAlternativas);
    };

    const handleCorretoChange = (index) => {
        setCorreta(parseInt(index));
        const newAlternativas = [...alternativas];
        newAlternativas.forEach((_alt, i) => {
            newAlternativas[i].certoerrado = i === parseInt(index);
        });
        setAlternativas(newAlternativas);
    };

    return (
        <div className={styles.container}>
            <Spinner type="arc" isVisible={loading} variant="brand"
                size="medium" style={{zIndex: 9999}}
            />
            {notification.open &&
                <Notification
                    title="Aviso"
                    description={notification.description}
                    icon={notification.type}
                    onRequestClose={() => setNotification({ open: false })}
                />
            }
            {loading && <div style={{position: "absolute",
                 backgroundColor: "rgba(255,255,255,0.5)",
                 minWidth: "100%",
                minHeight: "100%",
                 zIndex: 9998}}
            />}
            <div className={styles.form}>
                <h1 className={styles.titulo}>Nova Questão</h1>
                <form onSubmit={(e) => { e.preventDefault()}}>
                    <Textarea
                        labelAlignment='left'
                        label="Enunciado"
                        onChange={(e) => setEnunciado(e.target.value)}
                        required
                        rows={5}
                        placeholder="Adicione o Enunciado da Questão"
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        style={{ marginBottom: "5%", width: "100%" }}
                    />
                    <Select
                        labelAlignment='left'
                        label="Adicionar Assunto"
                        required
                        onChange={(e) => setAssunto(e.target.value)}
                        options={[{value: "", label: "Selecione um assunto"}, ...assuntos]}
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        style={{ marginBottom: "5%", width: "100%" }}
                    />
                    <Select
                        labelAlignment='left'
                        label="Selecione a dificuldade"
                        required
                        options={dificuldades}
                        onChange={(e) => setDificuldade(e.target.value)}
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        style={{ marginBottom: "5%", width: "100%" }}
                    />
                    {alternativas.map((alt, index) => (
                        <Textarea
                            key={index}
                            labelAlignment='left'
                            label={`Alternativa ${index + 1}`}
                            required
                            rows={3}
                            onChange={(e) => handleAlternativaChange(index, e.target.value)}
                            placeholder="Adicione resposta"
                            className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                            style={{ marginBottom: "5%", width: "100%" }}
                        />
                    ))}
                    <div className={styles.radiogroup}>
                        <RadioGroup
                            id="radio-group-component-2"
                            options={alternativas.map((_, index) => ({
                                value: index,
                                label: <div >Alternativa {index + 1}</div>
                            }))}
                            value={alternativas.findIndex(i => i?.certoerrado)}
                            onChange={(e) => handleCorretoChange(e.target.value)}
                            label={<p className={styles.labelStyle}>Das alternativas acima, selecione a correta</p>}
                            orientation="horizontal"
                            style={{ marginTop: "1%", marginLeft: "0%", marginBottom: "5%" }}
                        />
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
                                type='submit'
                                onClick={criarQuestao}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NovaQuestao;