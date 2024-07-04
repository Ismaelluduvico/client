import React from 'react'
import { useState, useEffect } from 'react'
import { Input, Button } from 'react-rainbow-components';
const CadastroAluno = () => {
  return (
    <div className='conteiner'>
        <div className='form'>
            <h1 style={{paddingTop:'2em'}}>NOVA CONTA</h1>
            <div style={{flexDirection:'column', paddingBottom:10, justifyContent:'space-between', width:'80%', height:200}}>
            <Input
                labelAlignment='left'
                id="input-component-1"
                label="Usuário"
                placeholder="Informe o Usuário"
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
            <Input
                labelAlignment='left'
                id="input-component-2"
                label="Repita a senha"
                placeholder="Informe a Senha"
                type="password"
                className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
            />
            <div style={{justifyContent:'space-between', alignSelf:'center', width:'80%', paddingTop:10}}>
                <a href=''>Não tenho uma conta</a>
            </div>
            </div>
            <Button
                label='CRIAR'
                variant='brand'
                style={{marginBottom:'10%', width:'60%'}}
            />
        </div>
    </div>
  )
}

export default CadastroAluno