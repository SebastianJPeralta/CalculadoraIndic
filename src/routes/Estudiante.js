import React,{useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import * as FaIcons from "react-icons/fa";
import AsyncSelect from "react-select/async"
import './Estudiante.css'

const Usuario = () => {
    const url = 'http://localhost:5093/api/Estudiante';
    const urlcarrera = 'http://localhost:5093/api/Carreras/Obtener';
    const urlestados = 'http://localhost:5093/api/Estados/Obtener';
    const [usuarios, setUsuarios] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [estadoValue, setEstadoValue] = useState(null);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [idCarrera, setIdCarrera] = useState('');
    const [clave, setClave] = useState('');
    const [indice, setIndice] = useState('');
    const [idEstado, setIdEstado] = useState('');
    const [title, setTitle] = useState('');
    const [operation,setOperation]=useState(1);


    useEffect(() =>{
        getUsuarios();
        getCarreras();
        getEstados();
        
    },[]);

    const getUsuarios = async () => {
        try {
          const respuesta = await axios.get(url + '/Obtener');
          console.log(respuesta);

          const usuariosResponse = respuesta.data.response;
          setUsuarios(usuariosResponse);            
        } catch (err) {
          console.log(err);
        }
      };
      
      const getCarreras = async () => {
        try {
          const respuesta = await axios.get(urlcarrera);
          const carreraResponse = respuesta.data.response; 
          
          return carreraResponse;       
        } catch (err) {
          console.log(err);
        }
      };

      const getEstados = async () => {
        try 
        {
          const respuesta = await axios.get(urlestados);
          const estadoResponse = respuesta.data.response;
          return estadoResponse          
        } 
        catch (err) 
        {
          console.log(err);
        }
      };

      const handleChange = value => {
        setSelectedValue(value);
        setIdCarrera(value.id)
      }

      const handleEstadoChange = value => {
        setEstadoValue(value);
        setIdEstado(value.id)
      }

      const openModal = (op,nombre,correo,idCarrera,clave,indice,idEstado,id,oCarrera,oEstado) =>{
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Nuevo Estudiante')
            setId('');
            setNombre('');
            setCorreo('');
            setIdCarrera('');
            setClave('');
            setIndice('');
            setIdEstado('');
            setSelectedValue('');
            setEstadoValue('');
        }
        else if(op === 2){
            setTitle('Editar Estudiante')
            setId(id);
            setNombre(nombre);
            setCorreo(correo);
            setClave(clave);

            const carreraValor = { idCarrera: idCarrera, nombre: oCarrera }; 
            setIdCarrera(idCarrera);
            setSelectedValue(carreraValor);

            const estadoValor = { idEstado: idEstado, nombre: oEstado}; 
            setIdEstado(idEstado);
            setEstadoValue(estadoValor)

            setIndice(indice);
        }
        window.setTimeout(function(){
            
        },500);
      }

      const validar = () => {
        const alertas = [
            {condicion: nombre.trim() === '', mensaje: 'Debe escribir el nombre'},
            {condicion: correo.trim() === '', mensaje: 'Debe escribir el correo'},
            {condicion: clave.trim() === '', mensaje: 'Debe escribir la contraseña'},
            {condicion: indice === '', mensaje: 'Debe escribir el índice'},
            {condicion: idCarrera === '', mensaje: 'Debe seleccionar la carrera'},
            {condicion: idEstado === '', mensaje: 'Debe seleccionar el estado'}
        ];
    
        for (const alerta of alertas) {
            if (alerta.condicion) {
                show_alerta(alerta.mensaje, 'warning');
                return; 
            }
        }
    
        let parametros; let metodo;
        if (operation === 1) {
            parametros = {nombre: nombre.trim(), correo: correo.trim(), idCarrera: idCarrera, clave: clave.trim(), indice: indice, idEstado: idEstado};
            metodo = 'POST';
            AgregarUsuario(metodo, parametros);
        } else {
            parametros = {id: id, nombre: nombre.trim(), correo: correo.trim(), idCarrera: idCarrera, clave: clave.trim(), indice: indice, idEstado: idEstado};
            metodo = 'PUT';
            EditarUsuario(metodo, parametros);
        }
    };



      const AgregarUsuario = async(metodo,parametros) => {
        await axios({ method:metodo, url: url + '/Crear', data:parametros}).then(function(respuesta){
          show_alerta('Se ha agregado el estudiante con éxito','success');
          document.getElementById('closeUsuarios').click();
          getUsuarios();
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
            console.log(error);
        });
      }

      const EditarUsuario = async(metodo,parametros) => {
        await axios({ method:metodo, url: url + '/Editar', data:parametros}).then(function(){
            show_alerta('Se ha actualizado el estudiante con éxito','success');
            document.getElementById('closeUsuarios').click();
            getUsuarios();           
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
            console.log(error);
        });
      }
   
    const deleteUsuario = (id,correo) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro que desea eliminar el estudiante '+ correo +'?',
            icon:'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if (result.isConfirmed) {
                EliminarUsuario('DELETE',id)
            }
        })
    }

    const EliminarUsuario = async(metodo,id) => {
        await axios({ method:metodo, url: url + '/Eliminar/' + id, data:id}).then(function(respuesta){
          show_alerta('Se ha eliminado el estudiante con éxito','success');
          document.getElementById('closeUsuarios').click();
          getUsuarios();        
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
                  <p>Gestión de Estudiantes</p>
                  <button onClick={() => openModal(1)}
                    className='btn btn-success'
                    data-bs-toggle='modal'
                    data-bs-target='#modalUsuarios'>
                    <i className='fa-solid fa-circle-plus'></i> Añadir
                  </button>
                </div>
              </div>
            </div>
            
            <div className='row mt-3'>
              <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                <div className='table-responsive'>
                  <table className='table table custom-table'>
                    <thead className='table-header-divider'>
                      <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Carrera</th>
                        <th>Índice</th>
                        <th>Estado</th>
                        <th style={{paddingLeft: '4%'}}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                     {Array.isArray(usuarios) && usuarios.map((usuarios) => (
                        <tr key={usuarios.id}>
                          <td>{usuarios.id}</td>
                          <td>{usuarios.nombre}</td>
                          <td>{usuarios.correo}</td>
                          <td>{usuarios.oCarrera.nombre}</td>
                          <td>{usuarios.indice.toFixed(2)}</td>
                          <td>{usuarios.oEstado.nombre}</td>
                          <td>
                            <button onClick={() => openModal(2,usuarios.nombre,usuarios.correo,usuarios.idCarrera,usuarios.clave,usuarios.indice,usuarios.idEstado,usuarios.id,usuarios.oCarrera.nombre, usuarios.oEstado.nombre)} className='btn' data-bs-toggle='modal' data-bs-target='#modalUsuarios'>
                              <i className='fa-solid fa-edit'></i>
                            </button>
                            &nbsp;
                            <button onClick={() => deleteUsuario(usuarios.id,usuarios.correo)} className='btn'>
                              <i className='fa-solid fa-trash-alt'></i>
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
          
          <div id='modalUsuarios' className='modal fade' aria-hidden='true'>
             <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button id='closeUsuarios' type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
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
                        <span className='input-group-text'><FaIcons.FaUniversity/></span>
                        
                        <AsyncSelect className='Selects'
                        cacheOptions
                        defaultOptions
                        value={selectedValue ? [selectedValue] : null}
                        getOptionLabel={e => e.nombre}
                        getOptionValue={e => e.idCarrera}
                        loadOptions={getCarreras}
                        onChange={handleChange}
                        placeholder="Selecciona una carrera"
                        isSearchable={false}
                        />
                        
                      </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><FaIcons.FaShieldAlt/></span>
                            <input type='text' id='clave' className='form-control' placeholder='Contraseña' value={clave}
                            onChange={(e)=> setClave(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><FaIcons.FaSortNumericUp/></span>
                            <input type='text' id='indice' className='form-control' placeholder='Índice' value={indice}
                            onChange={(e)=> setIndice(e.target.value)}></input>
                        </div>
                      <div className='input-group mb-3'>
                        <span className='input-group-text'><FaIcons.FaStarOfLife/></span>
                        <AsyncSelect className='Selects'
                        cacheOptions
                        defaultOptions
                        value={estadoValue}
                        getOptionLabel={e => e.nombre}
                        getOptionValue={e => e.idEstado}
                        loadOptions={getEstados}
                        onChange={handleEstadoChange}
                        isSearchable={false}
                        placeholder="Selecciona un estado"
                        
                        />
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

export default Usuario