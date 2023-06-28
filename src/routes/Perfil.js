
import './Perfil.css'
import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { Usuario } from '../routes/LogIn';

function Perfil() {
  const urlUsuario = 'http://localhost:5093/api/Usuario/Obtener/';
  const urlCarrera = 'http://localhost:5093/api/Carreras/Obtener/';
  const [usuario, setUsuario] = useState([]);
  const [profesor, setProfesor] = useState([]);
  const [carrera, setCarrera] = useState([]);

  useEffect(() => {
    console.log(Usuario);
    getUsuarios();
  }, []);
  
  useEffect(() => {
    if (usuario && usuario.idCarrera) {
      getCarrera();
    }
  }, [usuario]);
  
  const getUsuarios = async () => {
    try {
      const respuesta = await axios.get(urlUsuario + Usuario.idUsuario);
      const usuariosResponse = respuesta.data.response;
      setUsuario(usuariosResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const getCarrera = async () => {
    try {
      const respuesta = await axios.get(urlCarrera + usuario.idCarrera);
      const carrerares = respuesta.data.response;
  
      setCarrera(carrerares);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    
    <div className="container emp-profile">
  <form method="post">
    <div className="row">
      <div className="col-md-4">
        <div className="card" style={{ width: '70%', marginTop: '6%', marginLeft: '50%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          <img className="card-img-top" src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="" />
          <div className="card-body">
            <h5 style={{ fontSize: '24px', textAlign: 'center' }}>
              {Usuario.nombre}
            </h5>
            {/* {Usuario.idRol == 1 && (
              <p className="proile-rating" style={{ fontSize: '14px', textAlign: 'center', marginTop: '15%' }}>
                Índice: <span>{Usuario.indice.toFixed(2)}</span>
              </p>
            )} */}
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="profile-head">
          <ul className="nav nav-tabs" style={{ width: '70%', marginLeft: '170px' }}>
            <li className="nav-item" style={{ marginLeft: '45%' }}>
              <a className="nav-link active" id="home-tab" data-toggle="tab" aria-selected="true" style={{ textAlign: 'center' }}>Detalles</a>
            </li>
          </ul>
        </div>
        <div className="tab-content profile-tab" id="myTabContent" style={{marginLeft: '20%'}}>
        {[1, 2].includes(Usuario.idRol) && (
  <div className="row">
    <div className="col-md-6">
      <label className='label'>Código</label>
    </div>
    <div className="col-md-6">
      <p style={{ fontSize: '22px', textAlign: 'left' }}>{usuario.codigo}</p>
    </div>
  </div> 
)}

          {Usuario.idRol == 3 && (
          <div className="row">
            <div className="col-md-6">
              <label className='label'>Id</label>
            </div>
              <div className="col-md-6">
              <p style={{ fontSize: '22px', textAlign: 'left' }}>{usuario.idUsuario}</p>
            </div>
          </div> 
          )}
          <div className="row">
            <div className="col-md-6">
              <label className='label'>Email</label>
            </div>
            <div className="col-md-6">
              <p style={{ fontSize: '22px', textAlign: 'left' }}>{Usuario.correo}</p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <label className='label'>Teléfono</label>
            </div>
            <div className="col-md-6">
              <p style={{ fontSize: '22px', textAlign: 'left' }}>{Usuario.telefono}</p>
            </div>
          </div>
          {Usuario.idRol == 1 && (
          <div className="row">
              <div className="col-md-6">
                <label className='label'>Carrera</label>
              </div>
              <div className="col-md-6">
                <p style={{ fontSize: '22px', textAlign: 'left' }}>{carrera}</p>
              </div>
          </div>
          )}

          <div className="row">
              <div className="col-md-6">
                <label className='label'>Estado</label>
              </div>
              <div className="col-md-6">
                <p style={{ fontSize: '22px', textAlign: 'left' }}>{Usuario.idEstadoNavigation.nombre}</p>
              </div>
          </div>
         
          

          <div className="row">
            <div className="col-md-6">
              <label className='label'>Fecha Inscrito</label>
            </div>
            <div className="col-md-6">
              <p style={{ fontSize: '22px', textAlign: 'left' }}>{Usuario.fechaingreso.substring(0, 10)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</div>


  )
}

export default Perfil