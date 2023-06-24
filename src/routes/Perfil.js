
import './Perfil.css'
import { Usuario, getRolAdmin, getRolProfesor } from './LogIn';
import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { getRolEstudiante } from './LogIn';
import { Card } from 'primereact/card';

function Perfil() {
  const url = 'http://localhost:5093/api/Carreras/Obtener/';
  const urlestados = 'http://localhost:5093/api/Estados/Obtener/';
  const [carrera, setCarrera] = useState([]);
  const [estado, setEstado] = useState([]);
  useEffect(() =>{
  getEstado();
  getCarrera();
},[]);

const getCarrera = async () => {
  try {
    const respuesta = await axios.get(url + Usuario.idCarrera);
    const usuariosResponse = respuesta.data.response;
    setCarrera(usuariosResponse);            
  } catch (err) {
    console.log(err);
  }
};

const getEstado = async () => {
  try {
    const respuesta = await axios.get(urlestados + Usuario.idEstado);
    const usuariosRespons = respuesta.data.response;
    setEstado(usuariosRespons);            
  } catch (err) {
    console.log(err);
  }
};


  return (
    
    <div className="container emp-profile">
  <form method="post">
    <div className="row">
      <div className="col-md-4">
        <div className="card" style={{ width: '70%', marginTop: '6%', marginLeft: '50%' }}>
          <img className="card-img-top" src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="" />
          <div className="card-body">
            <h5 style={{ fontSize: '24px', textAlign: 'center' }}>
              {Usuario.nombre}
            </h5>
            {getRolEstudiante() && (
              <p className="proile-rating" style={{ fontSize: '14px', textAlign: 'center', marginTop: '15%' }}>
                Índice: <span>{Usuario.indice.toFixed(2)}</span>
              </p>
            )}
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
          <div className="row">
            <div className="col-md-6">
              <label className='label'>Id</label>
            </div>
            <div className="col-md-6">
              <p style={{ fontSize: '22px', textAlign: 'left' }}>{Usuario.id}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className='label'>Email</label>
            </div>
            <div className="col-md-6">
              <p style={{ fontSize: '22px', textAlign: 'left' }}>{Usuario.correo}</p>
            </div>
          </div>
          {(getRolAdmin())|| (getRolProfesor()) && (
          <div className="row">
            <div className="col-md-6">
              <label className='label'>Teléfono</label>
            </div>
            <div className="col-md-6">
              <p style={{ fontSize: '22px', textAlign: 'left' }}>{Usuario.telefono}</p>
            </div>
          </div>)}
          {getRolEstudiante() && (
            <div className="row">
              <div className="col-md-6">
                <label className='label'>Carrera</label>
              </div>
              <div className="col-md-6">
                <p style={{ fontSize: '22px', textAlign: 'left' }}>{carrera}</p>
              </div>
            </div>
          )}
          {getRolEstudiante() && (
            <div className="row">
              <div className="col-md-6">
                <label className='label'>Estado</label>
              </div>
              <div className="col-md-6">
                <p style={{ fontSize: '22px', textAlign: 'left' }}>{estado}</p>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-md-6">
              <label className='label'>Fecha Inscrito</label>
            </div>
            <div className="col-md-6">
              <p style={{ fontSize: '22px', textAlign: 'left' }}>{Usuario.fechaIngreso.substring(0, 10)}</p>
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