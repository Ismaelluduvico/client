import { useContext } from "react";
import { QuizContext } from "../context/quiz";

import Quiz from "../img/quiz.svg";

import { Input, Button } from 'react-rainbow-components';

const Welcome = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  const handleAlternativaChange = (index, field, value) => {
    setEditedAlternativas(prev => {
        const updated = [...prev];
        
        // Se a alternativa sendo marcada é "correta", desmarque as outras
        if (field === 'certoerrado' && value) {
            updated.forEach((alt, i) => {
                if (i !== index) {
                    alt.certoerrado = false; // Desmarcar as outras
                }
            });
        }
        
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        return updated;
    });
};


  return (
    <div id = "welcome">
      

{editedAlternativas.map((alt, index) => (
    <div key={alt.id} className={styles.alternativaItem}>
        <Input
            value={alt.resposta || ''}
            onChange={(e) => handleAlternativaChange(index, 'resposta', e.target.value)}
            className={styles.editInput}
            placeholder="Digite a alternativa"
        />
        <CheckboxGroup
            options={[
                { value: true, label: 'Correta' },
                { value: false, label: 'Incorreta' }
            ]}
            value={[alt.certoerrado]} // Isso já garantirá que apenas o valor true/false do banco seja marcado
            onChange={(e) => handleAlternativaChange(index, 'certoerrado', e[0] === 'true')}
            className={styles.radioGroup}
        />
    </div>
))}
    </div>
  )
}

export default Welcome