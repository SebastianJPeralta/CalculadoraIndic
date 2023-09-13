import React, { useState } from 'react';
import { show_alerta } from '../functions';
import axios from 'axios';
import * as FaIcons from "react-icons/fa";
export let Usuario = null;

const RecuperarContra = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const url = 'http://localhost:5093/api/Acceso/Recuperar';  
  document.title = 'UNI-X';
  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
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
        else {
            parametros = {correo:correo.trim()}
            metodo='POST';
            validarUsuario(metodo,parametros)
        }
    }

    const validarUsuario = async (metodo, parametros) => {
      try {
        const response = await axios({ method: metodo, url: url, data: parametros });
        const data = response.data;
        if (data.mensaje === "Ok")  {
          show_alerta('Se ha enviado un correo para cambiar su clave', 'success');
        } 
        else {
          show_alerta('Este correo no está vinculado a una cuenta de UNI-X', 'error');
        }
      } catch (error) {
        show_alerta(error.response.data.mensaje, 'error');
      }
    };
    
    const Recuperar = () => {
      
    }

  return (

    <div className="text-center " style={{ padding: '50px 0', height: '100vh'}}>
      <div className="logo fade-in-card" style={{ paddingTop: '5%', color: '#f5f5f5', fontSize: '36px'}}>
      <div style={{}}>
            <h3 style={{color:'cornsilk',fontSize: '60px', fontFamily: 'system-ui',marginTop:'4%',marginLeft:'4%',marginBottom:'-1%'}}>UNI-X</h3>
          <FaIcons.FaUserGraduate style={{fontSize: '60px', color: 'cornsilk',marginRight:'14%', marginTop:'-7%'}}/>
          </div>
      </div>
      <div className="login-form-1 fade-in-card2">
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
              <div style={{paddingTop: '10%', paddingRight: '18%', paddingBottom: '1px', marginRight: '12px'}}>
  <i
    className='btn btn-info'
    onClick={validar}
    style={{
      width: '110%',
      backgroundColor: '#002570',
      color: 'white',
      transition: 'background-color 0.3s',
    }}
  >
    Ingresar
  </i>
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
      <div className="soporte fade-in-text" style={{ paddingTop: '2%', color: '#f5f5f5', fontSize: '14px', fontWeight:'bold'}}>
</div>
    </div>
  )
};          

export default RecuperarContra