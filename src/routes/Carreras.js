import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { show_alerta } from '../functions';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Usuario } from './LogIn';
import { Card } from 'primereact/card';

const Carreras = () => {
  const url = 'http://localhost:5093/api/Carreras';
  const [carreras, setCarreras] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [creditos, setCreditos] = useState('');
  const [trimestres, setTrimestres] = useState('');
  const [fotoUrl, setFoto] = useState('');
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getCarreras(); 

  }, []); 

  const getCarreras = async () => {
    try {
      const respuesta = await axios.get(url + '/Obtener');
      const carrerasResponse = respuesta.data.response; console.log(carrerasResponse)
      setCarreras(carrerasResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (op, codigo, nombre, trimestres, creditos,fotoUrl) => {
    setOperation(op);

    if (op === 1) {
      setTitle('Registrar Nueva Carrera');
      setCodigo('');
      setNombre('');
      setCreditos('');
      setTrimestres('');
    } 
    else if (op === 2) {
      setTitle('Editar Carrera');
      setCodigo(codigo);
      setNombre(nombre);
      setCreditos(creditos);
      setTrimestres(trimestres);
      setFoto(fotoUrl)
    }
    window.setTimeout(function () {}, 500);
  };

  const validar = () => {
    const alertas = [
        {condicion: codigo === '', mensaje: 'Debe escribir el código'},
        {condicion: nombre.trim() === '', mensaje: 'Debe escribir el nombre'},
        {condicion: creditos === '', mensaje: 'Debe escribir el # de créditos'},
        {condicion: trimestres === '', mensaje: 'Debe escribir el # de trimestres'}
    ];

    for (const alerta of alertas) {
        if (alerta.condicion) {
            show_alerta(alerta.mensaje, 'warning');
            return;
        }
    }

    let parametros; let metodo;
    if (operation === 1) {
        parametros = {codigo:codigo, nombre: nombre.trim(), creditos:creditos, trimestres:trimestres, fotoUrl:fotoUrl};
        metodo = 'POST';
        AgregarCarrera(metodo, parametros);
    } else {
        parametros = {idUsuario: idUsuario, nombre: nombre.trim(), correo: correo.trim(), clave: clave.trim(), telefono: telefono.trim(), idEstado: idEstado};
        metodo = 'PUT';
        EditarCarrera(metodo, parametros);
    }
};

  return (
    <div>
 
        <h3 style={{marginLeft:'18%', marginTop:'3%'}}>Gestión de Carreras</h3> <hr style={{marginLeft:'36%',width:'50%', marginTop:'-1.5%'}}></hr>
        <div style={{marginTop:'-0.7%'}}>
        <Button onClick={() => openModal(1)}
                  className='btn btn-success'
                  data-bs-toggle='modal'
                  data-bs-target='#modalAsignaturas' style={{width:'7.9%', height: '45px', marginLeft: '87%', marginTop:'-5%', fontWeight:'bold'}}>
                  Añadir &nbsp; &nbsp; <i className='fa-solid fa-file-circle-plus'></i> 
          </Button> </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginLeft: '13%' }}>
  {carreras.map((carrera) => (
    <div key={carrera.nombre} style={{textAlign: 'center', marginTop:'1%'}}>
      <Card
        onClick={() => openModal(2, carrera.codigo, carrera.nombre, carrera.trimestreTotal, carrera.creditoTotal, carrera.fotoUrl)}
        className="md:w-25rem custom-card"
        style={{margin:'3%', height: '300px', boxShadow: '0 rgba(0, 0, 0, 0.2)' }}
        data-bs-toggle='modal' data-bs-target='#modalCarreras'
      >
        <div style={{ marginTop: '-6.5%', textAlign: 'left', width: '100%', fontWeight: 'bold' }}>
          <img src={carrera.fotoUrl} style={{ height: '250px', width: '550px', borderRadius: '5px', marginLeft: '-3.4%' }}></img>
          <h5 style={{ marginTop: '3%', textAlign: 'center' }}>{carrera.nombre}</h5>
        </div>
      </Card>
    </div>
  ))}
</div>
    <div id='modalCarreras' className='modal fade' aria-hidden='true'>
             <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5' style={{fontWeight:'bold'}}>{title}</label>
                        <button id='closeCarreras' type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <img src={fotoUrl} style={{ height: '250px', width: '470px', borderRadius: '5px'}}/> &nbsp;
                        <label htmlFor='foto' className='form-label' style={{marginTop:'4%'}}>UrlFoto</label>
                        <div className='input-group mb-3'>
                            <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={fotoUrl}
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <label htmlFor='nombre' className='form-label'>Nombre</label>
                        <div className='input-group mb-3'>
                            <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <label htmlFor='codigo' className='form-label'>Código</label> 
                        <label htmlFor='credito' className='form-label' style={{marginLeft:'23%'}}>Créditos</label>
                        <label htmlFor='trimestres' className='form-label' style={{marginLeft:'20%'}}>Trimestres</label>
                        <div className='input-group mb-3' >
                            <input type='text' id='codigo' className='form-control' placeholder='Código' value={codigo}
                            onChange={(e)=> setCodigo(e.target.value)}></input>&nbsp;
                            <input type='text' id='credito' className='form-control' placeholder='Créditos totales' value={creditos}
                            onChange={(e)=> setCreditos(e.target.value)}></input>&nbsp;
                            <input type='text' id='trimestres' className='form-control' placeholder='Trimestres' value={trimestres}
                            onChange={(e)=> setTrimestres(e.target.value)}></input>&nbsp;
                        </div>
                        &nbsp;
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => validar()} className='btn btn-success' style={{marginRight:'10%'}}>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    </div>
                 </div>
             </div>               
          </div>
    </div>
  );
};

export default Carreras;
