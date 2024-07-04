import api from '../api'
import { useState, useEffect } from 'react'
import './home.css'
import { Input, Button } from 'react-rainbow-components';

function Home() {
    return (
        <div className='conteiner'>
            <div className='form'>
                <h1 style={{paddingTop:'2em'}}>ALUNO</h1>
                <div style={{flexDirection:'column', paddingBottom:10, justifyContent:'space-between', width:'80%', height:200}}>
                <Input
                    labelAlignment='left'
                    id="input-component-1"
                    label="Usuário"
                    placeholder="Informe o nome de Usuário"
                    className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                    type='text'
                />
                <Input
                    labelAlignment='left'
                    id="input-component-2"
                    label="Senha"
                    placeholder="Informe a Senha"
                    type="password"
                    className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                />
                    <div style={{justifyContent:'space-between', alignSelf:'center', width:'80%', paddingTop:10}}>
                        <a href=''>Criar conta</a>
                    </div>
                </div>
                <Button
                    label='Entrar'
                    variant='brand'
                    style={{marginBottom:'10%', width:'60%'}}
                />
            </div>
        </div>
    );
}

export default Home;