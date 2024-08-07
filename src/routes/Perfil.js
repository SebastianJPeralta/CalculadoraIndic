
import './Perfil.css'
import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { Usuario } from '../routes/LogIn';
import {Card } from 'primereact/card';
import * as FaIcons from 'react-icons/fa';
import { Button } from 'primereact/button';


function Perfil() {
  const urlUsuario = 'http://localhost:5093/api/Usuario/Obtener/';
  const urlCarrera = 'http://localhost:5093/api/Carreras/Obtener/';
  const [usuario, setUsuario] = useState([]);
  const [profesor, setProfesor] = useState([]);
  const [carrera, setCarrera] = useState([]);
  const [changePasswordClicked, setChangePasswordClicked] = useState(false);

  useEffect(() => {
    console.log(Usuario)
    document.title = 'UNI-X';
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

  const handleChangePasswordClick = () => {
    setChangePasswordClicked(true);
  };

  const handleChangePasswordClick2 = () => {
    setChangePasswordClicked(false);
  };

  const cardheader = (
    <img alt="Card" src="https://img.freepik.com/vector-gratis/ilustracion-concepto-seguridad_114360-1528.jpg?w=740&t=st=1692381353~exp=1692381953~hmac=0ba36e1dbceacf598f95ae7801d2d36985a623239f51fec3611994b21238ea16" style={{height: '300px', width:'350px', marginBottom:'-7%', marginLeft:'9%'}}/>
);

  return (
    <div className="container emp-profile">
      {changePasswordClicked ? (
        <div style={{width:'29.29%', marginLeft:'40%', marginTop:'-5.5%'}}>
        <Card header={cardheader} className="md:w-25rem" style={{width:"450px", height:'600px', marginLeft:'-9%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
        <div class="form-group" >
              <label>Contraseña Actual</label> 
              <input style={{marginTop:'1%'}} class="form-control" type="text" name="fullname" required placeholder="Ingrese su contraseña actual"/>
              <span class="Success"></span>
          </div>
          <div class="form-group">
              <label>Nueva Contraseña</label>
              <input style={{marginTop:'1%'}} class="form-control" type="email" name="email" required placeholder="Ingrese su nueva contraseña"/>
              <span class="Success"></span>
          </div>
          <div class="form-group">
              <label>Confirmar Contraseña</label>
              <input style={{marginTop:'1%'}} class="form-control" type="password" name="password" required placeholder="Ingrese su nueva contraseña"/>
              <span class="Success"></span>
          </div>
          &nbsp;
          <div className='d-flex justify-content-between' style={{ width: "380px", marginLeft:'26%', marginTop:'-6%'}}>
  <Button onClick={() => validar()} severity="success" style={{ width: "170px", fontWeight:'bold'}}>
      <a style={{marginLeft:'17%'}}>Guardar</a>  &nbsp; &nbsp; &nbsp;<i className='fa-solid fa-floppy-disk'></i> 
  </Button>
</div>
</Card>
</div>
      ) : (
        <>
  <form method="post">
    <div className="row">
      <div className="col-md-4">
        <div className="card" style={{ width: '70%', marginTop: '6%', marginLeft: '50%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          <img className="card-img-top" src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="" />
          <div className="card-body">
            <h5 style={{ fontSize: '24px', textAlign: 'center' }}>
              {Usuario.nombre}
            </h5>
            {[1].includes(Usuario.idRol) && (
              <div>
              <h1 className="proile-rating" style={{ fontSize: '14px', textAlign: 'center', marginTop: '15%' }}>
                Índice: 3.65
              </h1>
              <h1 className="proile-rating" style={{ fontSize: '14px', textAlign: 'center', marginBottom:'-15px', fontWeight:'bold'}}>
                Honor: Magna Cum Laude
              </h1>
</div>
)}
          </div>
          
        </div>
        <div style={{marginLeft:'50%'}}>
        <FaIcons.FaTools  onClick={handleChangePasswordClick}/> &nbsp;
          <a target="_blank" rel="noopener noreferrer" style={{ color: '#252525', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleChangePasswordClick}>Cambiar Contraseña</a>
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
  </>
)
  }
</div>

  )
}

export default Perfil