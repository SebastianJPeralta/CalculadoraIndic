import React,{useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import AsyncSelect from "react-select/async"
import './Estudiante.css'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Usuario } from '../routes/LogIn'
import * as FaIcons from "react-icons/fa";

const Estudiantes = () => {
    const url = 'http://localhost:5093/api/Estudiante';
    const urlcarrera = 'http://localhost:5093/api/Carreras/Obtener';
    const urlestados = 'http://localhost:5093/api/Estados/Obtener';
    const [usuarios, setUsuarios] = useState([]);
    const [fechaingreso, setFechaIngreso] = useState(null);
    const [estudiante, setEstudiantes] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [estadoValue, setEstadoValue] = useState(null);
    const [idUsuario, setId] = useState('');
    const [codigo, setCodigo] = useState([]);
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [codigoest, setCodigoEstudiante] = useState('');
    const [correo, setCorreo] = useState('');
    const [idCarrera, setIdCarrera] = useState('');
    const [clave, setClave] = useState('');
    const [idEstado, setIdEstado] = useState('');
    const [title, setTitle] = useState('');
    const [operation,setOperation]=useState(1);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        correo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        codigo: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    useEffect(() =>{
        getUsuarios();
        getCarreras();
        getEstados();
        
    },[]);

    const exportExcel = () => {
      import('xlsx').then((xlsx) => {
        const usuariosFiltrados = usuarios.map((usuario) => ({
          Código: usuario.estudiantes[0].codigo,
          Nombre: usuario.nombre,
          Correo: usuario.correo,
          Teléfono: usuario.telefono,
          Fechaingreso: usuario.fechaingreso.substring(0, 10),
          Estado: usuario.idEstadoNavigation.nombre,
          Carrera: usuario.estudiantes[0].idCarreraNavigation.nombre,
        }));
    
        const worksheet = xlsx.utils.json_to_sheet(usuariosFiltrados);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
    
        saveAsExcelFile(excelBuffer, 'Estudiantes');
      });
    };

  const saveAsExcelFile = (buffer, fileName) => {
      import('file-saver').then((module) => {
          if (module && module.default) {
              let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
              let EXCEL_EXTENSION = '.xlsx';
              const data = new Blob([buffer], {
                  type: EXCEL_TYPE
              });

              module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
          }
      });
  };
    const getUsuarios = async () => {
        try {
          const respuesta = await axios.get(url + '/Obtener'); 
          const usuariosResponse = respuesta.data.response; const codigores = respuesta.data.test; setCodigoEstudiante(codigores);
          const codigoEstudiante = usuariosResponse.map(usuario => usuario.estudiantes[0]?.codigo);
          setCodigo(codigoEstudiante); 
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

      const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

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

    const header = (
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '26px' }}>Gestión de estudiantes</span>
          </div>
          <Button type="button" icon="fa-sharp fa-regular fa-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{marginRight:'451px', width:'35px',height:'35px',marginTop:'3px'}}/>
          <Button onClick={() => openModal(1)}
                  className='btn btn-success'
                  data-bs-toggle='modal'
                  data-bs-target='#modalUsuarios' style={{width:'10%', height: '45px', marginTop: '0px', fontWeight:'bold'}}>
                  Añadir &nbsp; &nbsp;<i className='fa-solid fa-user-plus'></i> 
          </Button>
          <span className="p-input-icon-left">
            <i className="fa fa-search" style={{marginLeft: '10px', marginBottom: '3px'}}/>
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar estudiante" style={{marginLeft: '10px'}}/>
          </span>
        </div>
      );
      
    const footer = `En total existen ${usuarios ? usuarios.length : 0} estudiantes.`;

      const handleChange = value => {
        setSelectedValue(value);
        setIdCarrera(value.idCarrera)
      }

      const handleEstadoChange = value => {
        setEstadoValue(value);
        setIdEstado(value.idEstado)
      }

      const openModal = (op,nombre,correo,clave,telefono,nombreEstado,nombreCarrera,idEstado,idCarrera,idUsuario) =>{
        setOperation(op);
        
        if (op === 1) {
            setTitle('Registrar Nuevo Estudiante')
            setNombre('');
            setCorreo(''); 
            setClave('');
            setTelefono('');
            setIdEstado('');setEstadoValue('');
            setIdCarrera('');setSelectedValue('');
            
        }
        else if(op === 2){
            setTitle('Editar Estudiante')
            setId(idUsuario);
            setNombre(nombre);
            setCorreo(correo);
            setClave(clave);
            setTelefono(telefono)

            const estadoValor = { idEstado: idEstado, nombre: nombreEstado}; 
            setIdEstado(idEstado);
            setEstadoValue(estadoValor)

            const carreraValor = { idCarrera: idCarrera, nombre: nombreCarrera }; 
            setIdCarrera(idCarrera);
            setSelectedValue(carreraValor);
        }
        window.setTimeout(function(){
            
        },500);
      }

      const validar = () => {
        const alertas = [
            {condicion: nombre.trim() === '', mensaje: 'Debe escribir el nombre'},
            {condicion: correo.trim() === '', mensaje: 'Debe escribir el correo'},
            {condicion: clave.trim() === '', mensaje: 'Debe escribir la contraseña'},
            {condicion: telefono.trim() === '', mensaje: 'Debe escribir el teléfono'},
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
            parametros = {nombre: nombre.trim(), correo: correo.trim(), idCarrera: idCarrera, clave: clave.trim(), telefono:telefono, idEstado: idEstado};
            metodo = 'POST';
            AgregarUsuario(metodo, parametros);
        } else {
            parametros = {idUsuario: idUsuario, nombre: nombre.trim(), correo: correo.trim(), clave: clave.trim(), telefono:telefono.trim(), idCarrera: idCarrera,   idEstado: idEstado};
            metodo = 'PUT';
            EditarUsuario(metodo, parametros);
        }
    };

    const actionTemplate = (usuarios) => {
      return (
          <div className="flex flex-wrap gap-2">
              <Button type="button" icon="fa-solid fa-pencil" onClick={() => openModal(2,usuarios.nombre,usuarios.correo,usuarios.clave,usuarios.telefono,usuarios.idEstadoNavigation.nombre,usuarios.estudiantes[0].idCarreraNavigation.nombre,usuarios.idEstado,usuarios.estudiantes[0].idCarreraNavigation.idCarrera,usuarios.idUsuario)} severity="info" outlined rounded data-bs-toggle='modal' data-bs-target='#modalUsuarios'></Button>
              &nbsp;
              <Button icon="fa-solid fa-trash" onClick={() => deleteUsuario(usuarios.idUsuario,usuarios.correo)} rounded outlined severity="danger"/>
          </div>
      );
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
   
    const deleteUsuario = (idUsuario,correo) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro que desea eliminar el estudiante '+ correo +'?',
            icon:'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if (result.isConfirmed) {
                EliminarUsuario('DELETE',idUsuario)
            }
        })
    }

    const EliminarUsuario = async(metodo,idUsuario) => {
        await axios({ method:metodo, url: url + '/Eliminar/' + idUsuario, data:idUsuario}).then(function(respuesta){
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
        Usuario.idRol != 1 && Usuario.idRol != 2 ? (
<div className='App fade-in-card'><div className='card' style={{ marginLeft: '15.5%', marginTop: '1%', width: '84%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
  <div >
    <DataTable value={usuarios} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort  filters={filters} style={{fontSize:'13.5px'}}>
        <Column field={(rowData) => rowData.estudiantes[0].codigo} header="Código" style={{width:'1%', textAlign: 'center' }} ></Column>
        <Column field="nombre" header="Nombre" sortable style={{textAlign:'left' }} headerStyle={{textAlign:'left', width:'13%', paddingLeft:'0%'}}></Column>
        <Column field="correo" header="Correo" sortable style={{ textAlign:'left'}} headerStyle={{textAlign:'left', width:'19%', paddingLeft:'0%'}}></Column>
        <Column field="telefono" header="Teléfono" sortable style={{textAlign:'left'}} headerStyle={{textAlign:'left', width:'12%', paddingLeft:'0%'}}></Column>
        <Column field="estudiantes[0].idCarreraNavigation.nombre" body={(rowData) => rowData.estudiantes[0].idCarreraNavigation.nombre} header="Carrera" sortable style={{textAlign: 'left'}} headerStyle={{textAlign:'left', width:'16.5%', paddingLeft:'0%'}}></Column>
        <Column field="fechaingreso" header="FechaIngreso" body={(rowData) => rowData.fechaingreso.substring(0, 10)} sortable style={{ width: '1%', textAlign: 'center' }}></Column>
        <Column field="idEstadoNavigation.nombre" header="Estado" body={statusBodyTemplate} sortable style={{ width: '1%', textAlign: 'left' }}></Column>
        <Column field={(rowData) => actionTemplate(rowData)} header="Acción" style={{ width: '12%' }}></Column>
    </DataTable>
 </div>
</div>
<div id='modalUsuarios' className='modal fade' aria-hidden='true' style={{zIndex: 1051}}>
  <div className='modal-dialog'>
    <div className='modal-content'>
      <div className='modal-header' style={{textAlign:'center'}} >
        <label className='h5' style={{ fontWeight: 'bold'}}>{title}</label>
        <button id='closeUsuarios' type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
      </div>
      
      <div className='modal-body'>
         {operation === 1 && (
      <div className='input-group mb-3'>
        <FaIcons.FaInfoCircle style={{color:'#007bff', width:'22px', height:'22px', marginRight:'1%'}}/>
    <input style={{textAlign:'center', fontWeight:'bold',fontStyle:'italic', width:'50px'}}
      type='text' 
      id='codigo'
      className='form-control'
      placeholder='Código' 
      value={'Su código de estudiante será: ' + codigoest}
      disabled
    />
 
</div> )}
        <label htmlFor='nombre' className='form-label'>Nombre</label>
      <div className='input-group mb-3'>
  <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} />
</div>
<label htmlFor='correo' className='form-label'>Correo</label>
<div className='input-group mb-3'>
  <input type='text' id='correo' className='form-control' placeholder='Correo' value={correo} onChange={(e) => setCorreo(e.target.value)} />
</div>
<label htmlFor='clave' className='form-label'>Contraseña</label>
<label htmlFor='telefono' className='form-label' style={{marginLeft:'34%'}}>Teléfono</label>
<div className='input-group mb-3'>
  <input type='password' id='clave' className='form-control' placeholder='Contraseña' value={clave} onChange={(e) => setClave(e.target.value)} />
  &nbsp;
  <input type='text' id='telefono' className='form-control' placeholder='Teléfono' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
</div>
<label htmlFor='idEstado' className='form-label'>Estado</label>
<label htmlFor='telefono' className='form-label' style={{marginLeft:'42%'}}>Carrera</label>
        <div className='input-group mb-3'>
          <AsyncSelect className='Selectsss'
            cacheOptions
            defaultOptions
            value={estadoValue}
            getOptionLabel={e => e.nombre}
            getOptionValue={e => e.idEstado}
            loadOptions={getEstados}
            onChange={handleEstadoChange}
            isSearchable={false}
            placeholder="Selecciona un estado" />
        &nbsp;
          <AsyncSelect className='Selectsss'
            cacheOptions
            defaultOptions
            value={selectedValue ? [selectedValue] : null}
            getOptionLabel={e => e.nombre}
            getOptionValue={e => e.idCarrera}
            loadOptions={getCarreras}
            onChange={handleChange}
            placeholder="Selecciona la carrera"
            isSearchable={false} />
        </div> <br></br>
        
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
) : (
  <div className="message-container">
        <p style={{fontWeight:'bold', marginTop:'5%', marginLeft:"8%"}}>No tienes permisos para ver esta pantalla.</p>
      </div>
)
      );
    };

export default Estudiantes