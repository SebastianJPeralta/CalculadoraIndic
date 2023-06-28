import React,{useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from "react-icons/gi";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';

const Asignaturas = () => {
    const url = 'http://localhost:5093/api/Asignatura';
    const [asignaturas, setAsignaturas] = useState([]);
    const [idAsignatura, setId] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [credito, setCredito] = useState('');
    const [title, setTitle] = useState('');
    const [operation,setOperation]=useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        codigo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        credito: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

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
      
      const openModal = (op,idAsignatura,nombre,credito,codigo) =>{
        setOperation(op);

        if (op === 1) {
            setTitle('Registrar Nueva Asignatura')
            setNombre('');
            setCodigo('');
            setCredito('');
        }
        else if(op === 2){
            setTitle('Editar Asignatura')
            setId(idAsignatura);
            setCodigo(codigo);
            setNombre(nombre);
            setCredito(credito);
            console.log(idAsignatura)
        }

        setIsEditing(op === 2);
        window.setTimeout(function(){
        },500);
      }

      const validar = () => {
        var parametros;
        var metodo;
        if (codigo.trim() === ''){
          show_alerta('Debe escribir el código','warning')
        }
        else if (nombre.trim() === ''){
            show_alerta('Debe escribir el nombre','warning')
        }
        else if (credito === ''){
          show_alerta('Debe escribir el # de créditos','warning')
      }
        else {
            if (operation === 1) {
                parametros = {codigo:codigo.trim(),nombre:nombre.trim(),credito:credito}
                metodo='POST';
                AgregarAsignatura(metodo,parametros)
            }
            else{
                parametros = {idAsignatura:idAsignatura,codigo:codigo.trim(),nombre:nombre.trim(),credito:credito};
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
   
    const deleteAsignatura = (idAsignatura,nombre) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro que desea eliminar la asignatura '+ nombre +'?',
            icon:'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if (result.isConfirmed) {
                EliminarAsignatura('DELETE',idAsignatura)
            }
        })
    }

    const EliminarAsignatura = async(metodo,idAsignatura) => {
        await axios({ method:metodo, url: url + '/Eliminar/' + idAsignatura, data:idAsignatura}).then(function(){
          show_alerta('Se ha eliminado la asignatura con éxito','success');
          document.getElementById('closeAsignaturas').click();
          getAsignaturas();        
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
            <span style={{ fontSize: '26px' }}>Gestión de asignaturas</span>
          </div>
          <Button onClick={() => openModal(1)}
                  className='btn btn-success'
                  data-bs-toggle='modal'
                  data-bs-target='#modalAsignaturas' style={{width:'9%', height: '45px', marginTop: '0px'}}>
                  <i className='fa-solid fa-circle-plus'></i> Añadir
          </Button>
          <span className="p-input-icon-left">
            <i className="fa fa-search" style={{marginLeft: '10px', marginBottom: '3px'}}/>
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar asignatura" style={{marginLeft: '10px'}}/>
          </span>
        </div>
      );
      
    const footer = `En total existen ${asignaturas ? asignaturas.length : 0} asignaturas.`;

  const actionTemplate = (asignaturas) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button type="button" icon="fa-solid fa-pencil-alt" onClick={() => openModal(2,asignaturas.idAsignatura,asignaturas.nombre,asignaturas.credito,asignaturas.codigo)} severity="info" outlined rounded data-bs-toggle='modal' data-bs-target='#modalAsignaturas'></Button>
            &nbsp;
            <Button icon="fa-solid fa-trash" onClick={() => deleteAsignatura(asignaturas.idAsignatura,asignaturas.nombre)} rounded outlined severity="danger"/>
        </div>
    );
  };

  return (
    <div className='App'><div className='card' style={{ marginLeft: '18%', marginTop: '2%', width: '78.5%' }}>
        <div>
          <DataTable value={asignaturas} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}  removableSort  filters={filters}>
              <Column field="idAsignatura" header="Id" sortable style={{ width: '1%', textAlign: 'center' }}></Column>      
              <Column field="codigo" header="Código" sortable style={{ width: '1%', textAlign: 'center' }}></Column>
              <Column field="nombre" header="Nombre" sortable style={{ width: '20%' }}></Column>
              <Column field="credito" header="Crédito" sortable style={{ width: '18%'}}></Column>
              <Column body={(rowData) => actionTemplate(rowData)} header="Acción" style={{ width: '12%' }}></Column>
          </DataTable>
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
                          <input type='hidden' id='idAsignatura' className='form-control' value={idAsignatura} onChange={(e) => setAsignaturas(e.target.value)} disabled={isEditing}/>
                      </div>
                      <div className='input-group mb-3'>
                          <span className='input-group-text'>
                            <FaIcons.FaUserAlt/>
                          </span>
                          <input type='text' id='codigo' className='form-control' placeholder='Código' value={codigo} 
                          onChange={(e)=> setCodigo(e.target.value)}/>
                      </div>
                      <div className='input-group mb-3'>
                          <span className='input-group-text'><GiIcons.GiNotebook/></span>
                          <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                          onChange={(e)=> setNombre(e.target.value)}></input>
                      </div>
                      <div className='input-group mb-3'>
                          <span className='input-group-text'><AiIcons.AiOutlineNumber/></span>
                          <input type='text' id='credito' className='form-control' placeholder='Créditos' value={credito}
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