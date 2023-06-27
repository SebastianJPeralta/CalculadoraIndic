import React, { useState } from 'react';
import './LogIn.css'
import { show_alerta } from '../functions';
import axios from 'axios';

export let Usuario = null;
export let DashEstudent = null;

const Login = ({ onSuccess }) => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const url = 'http://localhost:5093/api/Acceso';  

  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
  };

  const handleClaveChange = (e) => {
    setClave(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  
  const validar = () => {
        var parametros;
        var metodo;
        
        if (correo.trim() === ''){
          show_alerta('Debe escribir el correo','warning')
        }
        else if (clave.trim() === ''){
          show_alerta('Debe escribir la contraseña','warning')
        }
        else {
            parametros = {clave:clave.trim(),correo:correo.trim()}
            metodo='POST';
            validarUsuario(metodo,parametros)
        }
    }

    const validarUsuario = async (metodo, parametros) => {
      try {
        const response = await axios({ method: metodo, url: url, data: parametros });
        const data = response.data;
        if (data.mensaje === "Ok") 
        {
          console.log(data.response); 
          Usuario = data.response;

          show_alerta('Se ha iniciado sesión con éxito '+ data.response.nombre, 'success'); onSuccess();
        } 
        else 
        {
          show_alerta('Correo o contraseña incorrectos', 'error');
        }
      } catch (error) {
        show_alerta(error.response.data.mensaje, 'error');
      }
    };
    

  return (

    <div className="text-center" style={{ padding: '50px 0', height: '100vh'}}>
      <div className="logo" style={{ paddingTop: '10%', color: '#f5f5f5', fontSize: '36px', paddingBottom: '2%' }}>
        Iniciar Sesión
      </div>
      <div className="login-form-1">
        <form className="text-left" onSubmit={handleSubmit}>
          <div className="login-form-main-message"></div>
          <div className="main-login-form">
            <div className="login-group">
              <div className="form-group" style={{ paddingTop: '2%'}}>
                <input
                  type="text"
                  className="form-control" 
                  id="correo"
                  name="Correo"
                  placeholder="Correo"
                  value={correo}
                  onChange={handleCorreoChange}
                />
              </div>
              <div className="form-group" style={{ paddingTop: '2%' }}>
                <input
                  type="password"
                  className="form-control"
                  id="clave"
                  name="Clave"
                  placeholder="Contraseña"
                  value={clave}
                  onChange={handleClaveChange}
                />
              </div>
              <div style={{paddingTop: '10%', paddingRight: '18%', paddingBottom: '1px', marginRight: '12px'}}>
                <i className='btn btn-success'
                 onClick={validar}
                 style={{width: '110%'}}
                 >Ingresar</i>
              </div>
              <div
                className="etc-login-form"
                style={{
                  color: '#252525',
                  paddingTop: '9%',
                  paddingLeft: '14%',
                }}>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="soporte" style={{ paddingTop: '2%', color: '#f5f5f5', fontSize: '14px'}}>
      ¿Problemas al entrar? Contáctanos al 111-111-1111
      </div>
    </div>
  )
};          
export default Login