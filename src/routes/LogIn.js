import React, { useState } from 'react';
import './LogIn.css'
import { show_alerta } from '../functions';
import axios from 'axios';
import * as FaIcons from "react-icons/fa";
export let Usuario = null;

const Login = ({ onSuccess }) => {
  const [correo, setCorreo] = useState('');
  const [correo2, setCorreo2] = useState('');
  const [clave, setClave] = useState('');
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);

  const url = 'http://localhost:5093/api/Acceso';  

  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
  };

  const handleCorreoRecuperarChange = (e) => {
    setCorreo2(e.target.value);
  };

  const handleClaveChange = (e) => {
    setClave(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  
  const handleForgotPasswordClick = () => {
    setForgotPasswordClicked(true);
  };

  const handleForgotPasswordClick2 = () => {
    setForgotPasswordClicked(false);
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
          Usuario = data.response;

          show_alerta('Ha iniciado sesión '+ data.response.nombre, 'success'); onSuccess();
        } 
        else 
        {
          show_alerta('Correo o contraseña incorrectos', 'error');
        }
      } catch (error) {
        show_alerta(error.response.data.mensaje, 'error');
      }
    };
    
    const RecuperarContra = () => {
      var parametros;
      var metodo;
      
      if (correo2.trim() === ''){
        show_alerta('Debe escribir el correo','warning')
      }
      else {
          parametros = {correo:correo2}
          metodo='POST';
          try {
            const response = axios({ method: metodo, url: url + "/Recuperar", data: parametros });
            show_alerta('Se ha enviado un correo con su nueva clave','success');
            handleForgotPasswordClick2();
          } catch (error) {
            show_alerta(error.response.mensaje, 'error');
          }
      }
  }

    return (
      <div className="text-center " style={{ padding: '50px 0', height: '100vh'}}>
        {forgotPasswordClicked ? (
          <>
          <div className="logo fade-in-card" style={{ paddingTop: '5%', color: '#f5f5f5', fontSize: '36px'}}>
          <div>
                <h3 style={{color:'cornsilk',fontSize: '60px', fontFamily: 'system-ui',marginTop:'4%',marginLeft:'4%',marginBottom:'-1%'}}>UNI-X</h3>
              <FaIcons.FaUserGraduate style={{fontSize: '60px', color: 'cornsilk',marginRight:'14%', marginTop:'-7%'}}/>
              </div>
          </div>
          <div className="login-form-1 fade-in-card2">
            <form className="text-left" onSubmit={handleSubmit}>
              <div className="login-form-main-message"></div>
              <div className="main-login-form">
                <div style={{textAlign:'left', marginBottom:'8%'}}>
                     <a style={{color:'#f5f5f5', fontWeight:'bold', fontSize:'15px', marginLeft:'2.5%'}}>Ingrese el correo de su cuenta UNI-X</a> 
                  </div>
                <div className="login-group">
                  <div className="form-group" style={{ paddingTop: '2%' }}>
                    <input
                      type="text"
                      className="form-control"
                      id="correo"
                      name="Correo"
                      placeholder="Correo"
                      value={correo2}
                      onChange={handleCorreoRecuperarChange}
                    />
                  </div>
                  <div style={{ paddingTop: '10%', paddingRight: '18%', marginRight: '12px' }}>
                    <i
                      className='btn btn-info'
                      onClick={RecuperarContra}
                      style={{
                        width: '110%',
                        backgroundColor: '#002570',
                        color: 'white',
                        transition: 'background-color 0.3s',
                      }}
                    >
                      Recuperar
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
            <div className="soporte fade-in-text" style={{ paddingTop: '5%', color: '#f5f5f5', fontSize: '14px', fontWeight:'bold'}}>
  <a target="_blank" rel="noopener noreferrer" onClick={handleForgotPasswordClick2} style={{ color: '#f5f5f5', textDecoration: 'underline', cursor: 'pointer' }}>Iniciar sesión</a>
</div>
          </div></>
        ) : (
      <div className="text-center " style={{ padding: '50px 0', height: 'auto'}}>
      <div className="logo fade-in-card" style={{ paddingTop: '5%', color: '#f5f5f5', fontSize: '36px'}}>
      <div>
            <h3 style={{color:'cornsilk',fontSize: '60px', fontFamily: 'system-ui',marginTop:'1%',marginLeft:'4%',marginBottom:'-1%'}}>UNI-X</h3>
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
  <a target="_blank" rel="noopener noreferrer" onClick={handleForgotPasswordClick} style={{ color: '#f5f5f5', textDecoration: 'underline', cursor: 'pointer' }}>¿Olvidaste tu contraseña?</a>
</div>
    </div>
  )
  }
  </div>
)
}
    
export default Login