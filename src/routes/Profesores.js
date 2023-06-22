import React,{useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import * as FaIcons from "react-icons/fa";
import './Profesores.css'

const Profesores = () => {
    const url = 'http://localhost:5093/api/Profesor';
    const [profesores, setProfesores] = useState([]);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [telefono, setTelefono] = useState('');
    const [title, setTitle] = useState('');
    const [operation,setOperation]=useState(1);

    useEffect(() =>{
        getProfesores();
    },[]);

    const getProfesores = async () => {
        try {
          const respuesta = await axios.get(url + '/Obtener');
          console.log(respuesta);
          const profesoresResponse = respuesta.data.response;
          setProfesores(profesoresResponse);            
        } catch (err) {
          console.log(err);
        }
      };
      
      const openModal = (op,nombre,correo,clave,telefono,id) =>{
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Nuevo Profesor')
            setId('');
            setNombre('');
            setCorreo('');
            setClave('');
            setTelefono('');
        }
        else if(op === 2){
            setTitle('Editar Profesor')
            setId(id);
            setNombre(nombre);
            setCorreo(correo);
            setClave(clave);
            setTelefono(telefono);
        }
        window.setTimeout(function(){
        },500);
      }

      const validar = () => {
        const alertas = [
            {condicion: nombre.trim() === '', mensaje: 'Debe escribir el nombre'},
            {condicion: correo.trim() === '', mensaje: 'Debe escribir el correo'},
            {condicion: clave.trim() === '', mensaje: 'Debe escribir la contraseña'},
            {condicion: telefono.trim() === '', mensaje: 'Debe escribir un teléfono'}
        ];
    
        for (const alerta of alertas) {
            if (alerta.condicion) {
                show_alerta(alerta.mensaje, 'warning');
                return;
            }
        }
    
        let parametros; let metodo;
        if (operation === 1) {
            parametros = {nombre: nombre.trim(), correo: correo.trim(), clave: clave.trim(), telefono: telefono.trim()};
            metodo = 'POST';
            AgregarProfesor(metodo, parametros);
        } else {
            parametros = {id: id, nombre: nombre.trim(), correo: correo.trim(), clave: clave.trim(), telefono: telefono.trim()};
            metodo = 'PUT';
            EditarProfesor(metodo, parametros);
        }
    };

      const AgregarProfesor = async(metodo,parametros) => {
        await axios({ method:metodo, url: url + '/Crear', data:parametros}).then(function(){
          show_alerta('Se ha agregado el profesor con éxito','success');
          document.getElementById('closeProfesores').click();
          getProfesores();
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
        });
      }

      const EditarProfesor = async(metodo,parametros) => {
        await axios({ method:metodo, url: url + '/Editar', data:parametros}).then(function(){
            show_alerta('Se ha actualizado el profesor con éxito','success');
            document.getElementById('closeProfesores').click();
            getProfesores();           
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
        });
      }
   
    const deleteProfesor = (id,correo) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro que desea eliminar el profesor '+ correo +'?',
            icon:'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if (result.isConfirmed) {
                EliminarProfesor('DELETE',id)
            }
        })
    }

    const EliminarProfesor = async(metodo,id) => {
        await axios({ method:metodo, url: url + '/Eliminar/' + id, data:id}).then(function(respuesta){
          show_alerta('Se ha eliminado el profesor con éxito','success');
          document.getElementById('closeProfesores').click();
          getProfesores();        
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
            console.log(error);
        });
      }
      return (
        <div className='App'>
          <div style={{marginLeft: '6%'}} className='container-fluid'>
            <div className='row mt-3'>
              <div className='col-md-8 offset-md-2'>
              <br></br>
              <br></br>
                <div className='d-flex justify-content-between align-items-center'>
                  <p>Gestión de Profesores</p>
                  <button onClick={() => openModal(1)}
                    className='btn btn-success'
                    data-bs-toggle='modal'
                    data-bs-target='#modalProfesores'>
                    <FaIcons.FaPlus className='plusalt'></FaIcons.FaPlus> Añadir
                  </button>
                </div>
              </div>
            </div>
        
            <div className='row mt-3'>
              <div className='col-10 col-lg-8 offset-0 offset-lg-2'>
                <div className='table-responsive'>
                  <table className='table table custom-table'>
                    <thead className='table-header-divider'>
                      <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Telefono</th>
                        <th>Fecha Ingreso</th>
                        <th style={{paddingLeft: '4%'}}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                     {Array.isArray(profesores) && profesores.map((profesores) => (
                        <tr key={profesores.id}>
                          <td>{profesores.id}</td>
                          <td>{profesores.nombre}</td>
                          <td>{profesores.correo}</td>
                          <td>{profesores.telefono}</td>
                          <td>{profesores.fechaIngreso.substring(0, 10)}</td>
                          <td>
                            <button onClick={() => openModal(2,profesores.nombre,profesores.correo,profesores.clave,profesores.telefono,profesores.id)} className='btn' data-bs-toggle='modal' data-bs-target='#modalProfesores'>
                              <FaIcons.FaEdit/>
                            </button>
                            &nbsp;
                            <button onClick={() => deleteProfesor(profesores.id,profesores.correo)} className='btn'>
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
          
          <div id='modalProfesores' className='modal fade' aria-hidden='true'>
             <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button id='closeProfesores' type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><FaIcons.FaPeopleArrows/></span>
                            <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><FaIcons.FaEnvelope/></span>
                            <input type='text' id='correo' className='form-control' placeholder='Correo' value={correo}
                            onChange={(e)=> setCorreo(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><FaIcons.FaShieldAlt/></span>
                            <input type='text' id='clave' className='form-control' placeholder='Contraseña' value={clave}
                            onChange={(e)=> setClave(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><FaIcons.FaPhone/></span>
                            <input type='text' id='telefono' className='form-control' placeholder='Teléfono' value={telefono}
                            onChange={(e)=> setTelefono(e.target.value)}></input>
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

export default Profesores