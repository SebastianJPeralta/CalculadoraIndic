import React,{useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import * as FaIcons from "react-icons/fa";
import './Profesores.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import AsyncSelect from "react-select/async"

const Profesores = () => {
    const url = 'http://localhost:5093/api/Profesor'; 
    const urlestados = 'http://localhost:5093/api/Estados/Obtener';
    const [usuarios, setUsuarios] = useState([]);
    const [estadoValue, setEstadoValue] = useState(null);
    const [idUsuario, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [telefono, setTelefono] = useState('');
    const [idEstado, setIdEstado] = useState('');
    const [title, setTitle] = useState('');
    const [operation,setOperation]=useState(1);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        correo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        codigo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        fechaingreso: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    useEffect(() =>{
      getUsuarios();
      getEstados();
  },[]);

  const getUsuarios = async () => {
      try {
        const respuesta = await axios.get(url + '/Obtener');
        const usuariosResponse = respuesta.data.response; console.log(usuariosResponse);
        setUsuarios(usuariosResponse);      
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

    const handleEstadoChange = value => {
      setEstadoValue(value);
      setIdEstado(value.idEstado)
      console.log(value.idEstado)
    }

    const statusBodyTemplate = (usuarios) => {
      return <Tag value={usuarios.idEstadoNavigation.nombre} severity={getSeverity(usuarios)} style={{width:'75px'}}></Tag>;
  };

  const getSeverity = (usuarios) => {
      switch (usuarios.idEstadoNavigation.nombre) {
          case 'Activo':
              return 'success';

          case 'Suspendido':
              return 'warning';

          case 'Inactivo':
              return 'danger';

          default:
              return null;
      }
  };

      const openModal = (op,nombre,correo,clave,telefono,idEstado,nombreEstado,idUsuario) =>{
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Nuevo Profesor')
            setNombre('');
            setCorreo('');
            setClave('');
            setTelefono('');
            setIdEstado('');
        }
        else if(op === 2){
            setTitle('Editar Profesor')
            setId(idUsuario);
            setNombre(nombre);
            setCorreo(correo);
            setClave(clave);
            setTelefono(telefono);
            setIdEstado(idEstado);

            const estadoValor = { idEstado: idEstado, nombre: nombreEstado}; 
            setIdEstado(idEstado);
            setEstadoValue(estadoValor)
        }
        window.setTimeout(function(){
        },500);
      }

      const validar = () => {
        const alertas = [
            {condicion: nombre.trim() === '', mensaje: 'Debe escribir el nombre'},
            {condicion: correo.trim() === '', mensaje: 'Debe escribir el correo'},
            {condicion: clave.trim() === '', mensaje: 'Debe escribir la contraseña'},
            {condicion: telefono.trim() === '', mensaje: 'Debe escribir un teléfono'},
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
            parametros = {nombre: nombre.trim(), correo: correo.trim(), clave: clave.trim(), telefono: telefono.trim(), idEstado: idEstado};
            metodo = 'POST';
            AgregarProfesor(metodo, parametros);
        } else {
            parametros = {idUsuario: idUsuario, nombre: nombre.trim(), correo: correo.trim(), clave: clave.trim(), telefono: telefono.trim(), idEstado: idEstado};
            metodo = 'PUT';
            EditarProfesor(metodo, parametros);
        }
    };

      const AgregarProfesor = async(metodo,parametros) => {
        await axios({ method:metodo, url: url + '/Crear', data:parametros}).then(function(){
          show_alerta('Se ha agregado el profesor con éxito','success');
          document.getElementById('closeProfesores').click();
          getUsuarios();
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
        });
      }

      const EditarProfesor = async(metodo,parametros) => {
        await axios({ method:metodo, url: url + '/Editar', data:parametros}).then(function(){
            show_alerta('Se ha actualizado el profesor con éxito','success');
            document.getElementById('closeProfesores').click();
            getUsuarios();           
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
          getUsuarios();        
        })
        .catch(function(error){
            show_alerta(error.response.data.mensaje,'error')
            console.log(error);
        });
      }

 const onGlobalFilterChange = (e) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters['global'].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
  };
  
      const header = (
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '26px' }}>Gestión de profesores</span>
          </div>
          <Button onClick={() => openModal(1)}
                  className='btn btn-success'
                  data-bs-toggle='modal'
                  data-bs-target='#modalProfesores' style={{width:'9%', height: '45px', marginTop: '0px'}}>
                  <i className='fa-solid fa-circle-plus'></i> Añadir
          </Button>
          <span className="p-input-icon-left">
            <i className="fa fa-search" style={{marginLeft: '10px', marginBottom: '3px'}}/>
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar profesor" style={{marginLeft: '10px'}}/>
          </span>
        </div>
      );
      
    const footer = `En total existen ${usuarios ? usuarios.length : 0} profesores.`;

   

  const actionTemplate = (usuarios) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button type="button" icon="fa-solid fa-pencil-alt" onClick={() => openModal(2,usuarios.nombre,usuarios.correo,usuarios.clave,usuarios.telefono,usuarios.idEstado,usuarios.idEstadoNavigation.nombre,usuarios.idUsuario)} severity="info" outlined rounded data-bs-toggle='modal' data-bs-target='#modalProfesores'></Button>
            &nbsp;
            <Button icon="fa-solid fa-trash" onClick={() => deleteProfesor(usuarios.idUsuario,usuarios.correo)} rounded outlined severity="danger"/>
        </div>
    );
};

      return (
<div className='App'><div className='card' style={{ marginLeft: '15.5%', marginTop: '1%', width: '84%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
  <div >
    <DataTable value={usuarios} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }} removableSort filters={filters} style={{fontSize:'13.5px'}}>
  <Column field={(rowData) => rowData.profesors[0].codigo} header="Código" style={{width:'1%', textAlign: 'center' }} ></Column>
  <Column field="nombre" header="Nombre" sortable style={{textAlign:'left' }} headerStyle={{textAlign:'left', width:'21%', paddingLeft:'0%'}}></Column>
  <Column field="correo" header="Correo" sortable style={{ textAlign:'left'}} headerStyle={{textAlign:'left', width:'19%', paddingLeft:'0%'}}></Column>
  <Column field="telefono" header="Teléfono" sortable style={{textAlign:'left'}} headerStyle={{textAlign:'left', width:'9.5%', paddingLeft:'0%'}}></Column>
  <Column field="fechaingreso" header="FechaIngreso" body={(rowData) => rowData.fechaingreso.substring(0, 10)} sortable style={{ width: '10%', textAlign: 'center' }}></Column>
  <Column field="idEstadoNavigation.nombre" header="Estado" body={statusBodyTemplate} sortable style={{ width: '10%', textAlign: 'left' }}></Column>
  <Column field="accion" header="Acción" body={(rowData) => actionTemplate(rowData)} style={{ width: '12%' }}></Column>
</DataTable>

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
                        placeholder="Selecciona un estado"/>
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