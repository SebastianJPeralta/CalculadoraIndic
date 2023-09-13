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
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';


const Carreras = () => {
  const url = 'http://localhost:5093/api/Carreras';
  const [carreras, setCarreras] = useState([]);
  const [idCarrera, setId] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [creditos, setCreditos] = useState('');
  const [trimestres, setTrimestres] = useState('');
  const [fotoUrl, setFoto] = useState('');
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState('');

  useEffect(() => {
    document.title = 'UNI-X';
    getCarreras(); 
  }, []); 

  const getCarreras = async () => {
    try {
      const respuesta = await axios.get(url + '/Obtener');
      const carrerasResponse = respuesta.data.response; 
      setCarreras(carrerasResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = (op, codigo, nombre, trimestres, creditos, fotoUrl, idCarrera) => {
    setOperation(op);

    if (op === 1) {
      setTitle('Registrar Nueva Carrera');
      setFoto('')
      setCodigo('');
      setNombre('');
      setCreditos('');
      setTrimestres('');
    } 
    else if (op === 2) {
      setTitle('Editar ' + nombre);
      setCodigo(codigo);
      setNombre(nombre);
      setCreditos(creditos);
      setTrimestres(trimestres);
      setFoto(fotoUrl)
      setId(idCarrera);
    }
    window.setTimeout(function () {}, 500);
  };

  const validar = () => {
    const alertas = [
        {condicion: fotoUrl === '', mensaje: 'Debe escribir la url de la foto'},
        {condicion: codigo === '', mensaje: 'Debe escribir el código'},
        {condicion: codigo.length === 4, mensaje: 'El código de la carrera debe ser de 3 caracteres'},
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
        parametros = {codigo:codigo, nombre: nombre.trim(), creditoTotal:creditos, trimestreTotal:trimestres, fotoUrl:fotoUrl};
        metodo = 'POST';
        AgregarCarrera(metodo, parametros);
    } else {
        parametros = {idCarrera: idCarrera, codigo:codigo, nombre: nombre.trim(), creditoTotal:creditos, trimestreTotal:trimestres, fotoUrl:fotoUrl};
        metodo = 'PUT';
        EditarCarrera(metodo, parametros);
    }
};

const AgregarCarrera = async(metodo,parametros) => {
  await axios({ method:metodo, url: url + '/Crear', data:parametros}).then(function(){
    show_alerta('Se ha agregado la carrera con éxito','success');
    document.getElementById('closeCarreras').click();
    getCarreras();
  })
  .catch(function(error){
      show_alerta(error.response.data.mensaje,'error')
  });
}

const EditarCarrera = async(metodo,parametros) => {
  await axios({ method:metodo, url: url + '/Editar', data:parametros}).then(function(){
      show_alerta('Se ha actualizado la carrera con éxito','success');
      document.getElementById('closeCarreras').click();
      getCarreras();           
  })
  .catch(function(error){
      show_alerta(error.response.data.mensaje,'error')
  });
}

const EliminarCarrera = () =>{
  const MySwal = withReactContent(Swal);
  MySwal.fire({
      title:'¿Seguro que desea eliminar esta carrera?',
      icon:'question',text:'No se podrá dar marcha atrás',
      showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
  }).then((result) =>{
      if (result.isConfirmed) {
          axios({ method:'DELETE', url: url + '/Eliminar/' + idCarrera}).then(function(respuesta){
          show_alerta('Se ha eliminado la carrera con éxito','success');
          document.getElementById('closeCarreras').click();
          getCarreras();        
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
            console.log(error);
        });
      }
  })
}

  return (
    <div>
 
        <h3 style={{marginLeft:'18%', marginTop:'3%'}}>Gestión de Carreras</h3> <hr style={{marginLeft:'36%',width:'50%', marginTop:'-1.5%'}}></hr>
        <div style={{marginTop:'-0.7%'}}>
        <Button onClick={() => openModal(1)}
                  className='btn btn-success'
                  data-bs-toggle='modal'
                  data-bs-target='#modalCarreras' style={{width:'7.9%', height: '45px', marginLeft: '87%', marginTop:'-5%', fontWeight:'bold'}}>
                  Añadir &nbsp; &nbsp; <i className='fa-solid fa-file-circle-plus'></i> 
          </Button> </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginLeft: '13%' }}>
  {carreras.map((carrera) => (
    <div key={carrera.nombre} className="fade-in-card2" style={{textAlign: 'center', marginTop:'1%'}}>
      <Card
        onClick={() => openModal(2, carrera.codigo, carrera.nombre, carrera.trimestreTotal, carrera.creditoTotal, carrera.fotoUrl, carrera.idCarrera)}
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
                        <img src={fotoUrl ? fotoUrl : 'https://i0.wp.com/theperfectroundgolf.com/wp-content/uploads/2022/04/placeholder.png?fit=1200%2C800&ssl=1'} style={{ height: '250px', width: '470px', borderRadius: '5px'}}/>
                        <label htmlFor='foto' className='form-label' style={{marginTop:'4%'}}>UrlFoto</label>
                        <div className='input-group mb-3'>
                            <input type='text' id='fotoUrl' className='form-control' placeholder='Url de la foto' value={fotoUrl}
                            onChange={(e)=> setFoto(e.target.value)}></input>
                        </div>
                        <label htmlFor='nombre' className='form-label'>Nombre</label>
                        <div className='input-group mb-3'>
                            <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <label htmlFor='codigo' className='form-label'>Código</label> 
                        <label htmlFor='credito' className='form-label' style={{marginLeft:'24%'}}>Créditos</label>
                        <label htmlFor='trimestres' className='form-label' style={{marginLeft:'20%'}}>Trimestres</label>
                        <div className='input-group mb-3' >
                            <input type='text' id='codigo' className='form-control' placeholder='Código' value={codigo}
                            onChange={(e)=> setCodigo(e.target.value)}></input>&nbsp;
                            <input type='text' id='credito' className='form-control' placeholder='Créditos totales' value={creditos}
                               onChange={(e) => {
                                 const value = e.target.value;
                                 const regex = /^[0-9]+$/;
                                 if ((regex.test(value) || value === '') && parseInt(value) <= 300) {
                                   setCreditos(value);
                                 }
                               }}
                            inputMode='numeric' pattern='[0-9]*'/>&nbsp;
                            <input type='text' id='trimestres' className='form-control' placeholder='Trimestres' value={trimestres}
                              onChange={(e) => {
                                const value = e.target.value; const regex = /^[0-9]+$/;
                                if ((regex.test(value) || value === '') && parseInt(value) <= 15) {
                                  setTrimestres(value);
                                }}} 
                                inputMode='numeric' pattern='[0-9]*'/>
                        </div> &nbsp;
                        <div className='d-flex justify-content-between' style={{ width: "380px", marginLeft:'8%'}}>
    <Button onClick={() => validar()} severity="success" style={{ width: "170px", fontWeight:'bold'}}>
        <a style={{marginLeft:'15%'}}>Guardar</a>  &nbsp; &nbsp; &nbsp;<i className='fa-solid fa-floppy-disk'></i> 
    </Button>
    <Button onClick={() => EliminarCarrera()} severity="danger" style={{ width: "170px", fontWeight:'bold'}}>
    <a style={{marginLeft:'15%'}}>Eliminar</a>  &nbsp; &nbsp; &nbsp;<i className='fa-solid fa-trash'></i> 
    </Button>
</div>

                    </div>
                 </div>
             </div>               
          </div>
    </div>
  );
};

export default Carreras;
