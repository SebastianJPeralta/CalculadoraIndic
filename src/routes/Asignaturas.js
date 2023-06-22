import React,{useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from "react-icons/gi";
import './Profesores.css'

const Asignaturas = () => {
    const url = 'http://localhost:5093/api/Asignatura';
    const [asignaturas, setAsignaturas] = useState([]);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [crédito, setCredito] = useState('');
    const [title, setTitle] = useState('');
    const [operation,setOperation]=useState(1);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() =>{
        getAsignaturas();
    },[]);

    const getAsignaturas = async () => {
        try {
          const respuesta = await axios.get(url + '/Obtener');
          console.log(respuesta);
          const asignaturasResponse = respuesta.data.response;
          setAsignaturas(asignaturasResponse);            
        } catch (err) {
          console.log(err);
        }
      };
      
      const openModal = (op,nombre,crédito,id) =>{
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Nueva Asignatura')
            setId('');
            setNombre('');
            setCredito('');
        }
        else if(op === 2){
            setTitle('Editar Asignatura')
            setId(id);
            setNombre(nombre);
            setCredito(crédito);
        }

        setIsEditing(op === 2);
        window.setTimeout(function(){
        },500);
      }

      const validar = () => {
        var parametros;
        var metodo;
        if (id === '') {
            show_alerta('Debe escribir el id','warning')
        }
        else if (nombre.trim() === ''){
            show_alerta('Debe escribir el nombre','warning')
        }
        else if (crédito === ''){
          show_alerta('Debe escribir el # de créditos','warning')
      }
        else {
            if (operation === 1) {
                parametros = {id:id,nombre:nombre.trim(),crédito:crédito}
                metodo='POST';
                AgregarAsignatura(metodo,parametros)
            }
            else{
                parametros = {id:id,nombre:nombre.trim(),crédito:crédito};
                metodo = 'PUT';
                EditarAsignatura(metodo,parametros)
            }
            
        }
      }

      const AgregarAsignatura = async(metodo,parametros) => {
        await axios({ method:metodo, url: url + '/Crear', data:parametros}).then(function(){
          show_alerta('Se ha agregado la asignatura con éxito','success');
          document.getElementById('closeAsignaturas').click();
          getAsignaturas();
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
            console.log(error);
        });
      }

      const EditarAsignatura = async(metodo,parametros) => {
        await axios({ method:metodo, url: url + '/Editar', data:parametros}).then(function(){
            show_alerta('Se ha actualizado la asignatura con éxito','success');
            document.getElementById('closeAsignaturas').click();
            getAsignaturas();           
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
            console.log(error);
        });
      }
   
    const deleteAsignatura = (id,nombre) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro que desea eliminar la asignatura '+ nombre +'?',
            icon:'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if (result.isConfirmed) {
                EliminarAsignatura('DELETE',id)
            }
        })
    }

    const EliminarAsignatura = async(metodo,id) => {
        await axios({ method:metodo, url: url + '/Eliminar/' + id, data:id}).then(function(respuesta){
          show_alerta('Se ha eliminado la asignatura con éxito','success');
          document.getElementById('closeAsignaturas').click();
          getAsignaturas();        
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
            console.log(error);
        });
      }
      return (
        <div className='App'>
          <div className='container-fluid'>
            <div className='row mt-3'>
              <div className='col-md-8 offset-md-2'>
              <br></br>
              <br></br>
                <div className='d-flex justify-content-between align-items-center'>
                  <p>Gestión de Asignaturas</p>
                  <button onClick={() => openModal(1)}
                    className='btn btn-success'
                    data-bs-toggle='modal'
                    data-bs-target='#modalAsignaturas'>
                    <FaIcons.FaPlus className='plusalt'></FaIcons.FaPlus> Añadir
                  </button>
                </div>
              </div>
            </div>
        
            <div className='row mt-3'>
              <div className='col-9 col-lg-8 offset-lg-2'>
                <div className='table-responsive'>
                  <table className='table table custom-table'>
                    <thead className='table-header-divider'>
                      <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Créditos</th>
                        <th style={{paddingLeft: '4%'}}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                     {Array.isArray(asignaturas) && asignaturas.map((asignaturas) => (
                        <tr key={asignaturas.id}>
                          <td>{asignaturas.id}</td>
                          <td>{asignaturas.nombre}</td>
                          <td>{asignaturas.crédito}</td>
                          <td>
                            <button onClick={() => openModal(2,asignaturas.nombre,asignaturas.crédito,asignaturas.id)} className='btn' data-bs-toggle='modal' data-bs-target='#modalAsignaturas'>
                              <FaIcons.FaEdit />
                            </button>
                            &nbsp;
                            <button onClick={() => deleteAsignatura(asignaturas.id,asignaturas.nombre,asignaturas.crédito)} className='btn'>
                              <FaIcons.FaTrashAlt/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div id='modalAsignaturas' className='modal fade' aria-hidden='true'>
             <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button id='closeAsignaturas' type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                    <div className='input-group mb-3'>
                     <span className='input-group-text'>
                      <FaIcons.FaUserAlt/>
                     </span>
                      <input type='text' id='id' className='form-control' placeholder='Id' value={id} onChange={(e) => setId(e.target.value)} disabled={isEditing}/>
                    </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><GiIcons.GiNotebook/></span>
                            <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><AiIcons.AiOutlineNumber/></span>
                            <input type='text' id='crédito' className='form-control' placeholder='Créditos' value={crédito}
                            onChange={(e)=> setCredito(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => validar()} className='btn btn-success'>
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

export default Asignaturas