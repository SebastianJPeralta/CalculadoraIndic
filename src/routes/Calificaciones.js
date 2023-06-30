import React,{useEffect, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import AsyncSelect from "react-select/async"
import {Usuario} from './LogIn';

const Calificaciones = () => {
    const url = 'http://localhost:5093/api/Calificar/Obtener/';
    const urlest = 'http://localhost:5093/api/Calificar/ObtenerEstudiantes';
    const [asignaturas, setAsignaturas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [idProfesor, setIdProfesor] = useState([]);
    const [idAsignatura, setId] = useState(''); const [activeIndex, setActiveIndex] = useState(0);
    const [selectedValue, setSelectedValue] = useState(null);
    const [profesorValue, setProfesorValue] = useState(null);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [credito, setCredito] = useState('');
    const [title, setTitle] = useState('');
    const [operation,setOperation]=useState(1);
    const [isEditing, setIsEditing] = useState(false)
    const [expandedRows, setExpandedRows] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        idAsignatura: { value: null, matchMode: FilterMatchMode.EQUALS },
        codigo: { value: null, matchMode: FilterMatchMode.EQUALS },
        nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        credito: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    useEffect(() =>{
        getAsignaturas();
        getEstudiantes();
    },[]);

    const getAsignaturas = async () => {
        try {
          const respuesta = await axios.get(url + Usuario.profesors[0].idProfesor);
          const asignaturasResponse = respuesta.data.response; 
          setAsignaturas(asignaturasResponse);    
 
          
        } catch (err) {
          console.log(err);
        }
      };

const getEstudiantes = async () => {
  const respuesta = await axios.get(urlest)
          const estR = respuesta.data.response ; 
        
          setEstudiantes(estR);
}
      

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
                parametros = {idAsignatura:idAsignatura,codigo:codigo.trim(),nombre:nombre.trim(),credito:credito};
                metodo = 'PUT';
                EditarAsignatura(metodo,parametros)
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
   
      const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
  
        _filters['global'].value = value;
  
        setFilters(_filters);
        setGlobalFilterValue(value);
      };

      const exportExcel = () => {
        import('xlsx').then((xlsx) => {
          const usuariosFiltrados = asignaturas.map((asignaturas) => ({
            Código: asignaturas.codigo,
            Nombre: asignaturas.nombre,
            Crédito: asignaturas.credito,
            Prerequisito: asignaturas.idPrerequisitoNavigation?.idAsignaturaNavigation?.codigo || ''
          }));
      
          const worksheet = xlsx.utils.json_to_sheet(usuariosFiltrados);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
      
          saveAsExcelFile(excelBuffer, 'Asignaturas');
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

      const header = (
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '26px', marginLeft:'-0.1%' }}>Mis Asignaturas</span>
          </div>
          <Button type="button" className="bounce-icon-button"icon="fa-sharp fa-regular fa-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{marginRight:'60%', width:'35px',height:'35px',marginTop:'3px'}}/>
          <span className="p-input-icon-left">
            <i className="fa fa-search" style={{marginLeft: '10px', marginBottom: '3px'}}/>
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar asignatura" style={{marginLeft: '10px'}}/>
          </span>
        </div>
      );
      
    const footer = `En total tengo ${asignaturas ? asignaturas.length : 0} asignaturas.`;
    
  const actionTemplate = (asignaturas) => {
    return (
        <div className="flex flex-wrap gap-2">
          &nbsp;
            <Button type="button" icon="fa-solid fa-pencil-alt" onClick={() => openModal(2,asignaturas.idAsignatura,asignaturas.nombre,asignaturas.credito,asignaturas.codigo)} severity="info" outlined rounded data-bs-toggle='modal' data-bs-target='#modalAsignaturas'></Button>
            &nbsp;
        </div>
    );
  };

  const rowExpansionTemplate = (data) => {
    const filteredData = estudiantes.filter(
      (item) => item.idAsignatura === data.idAsignatura
    );console.log(filteredData)
    return (
      <div className="p-3">
        <h5>Mis estudiantes de {data.idAsignaturaNavigation.nombre}</h5>
        <DataTable value={filteredData} removableSort>
          <Column
            field="idEstudianteNavigation.codigo"
            header="Codigo" headerStyle={{textAlign:'left', width:'2%', paddingLeft:'0%'}}
            sortable
          ></Column>
          <Column
            field="idEstudianteNavigation.idUsuarioNavigation.nombre"
            header="Nombre" headerStyle={{textAlign:'left', width:'20%', paddingLeft:'0%'}}
            sortable
          ></Column>
          <Column
            field="idEstudianteNavigation.idUsuarioNavigation.correo"
            header="Correo" style={{width:'20%'}}
            sortable headerStyle={{textAlign:'left', width:'20%', paddingLeft:'0%'}}
          ></Column>
          <Column
            field=""
            header="Calificación"
            sortable headerStyle={{textAlign:'left', width:'2%', paddingLeft:'0%'}}
          ></Column>
          <Column body={(rowData) => actionTemplate(rowData)} header="Acción" style={{ width: '12%' }}></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <div className='App' style={{overflow:'hidden'}}>
   
      <div className='card' style={{ marginLeft: '15.5%', marginTop: '1%', width: '84%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
        <div>
          <DataTable value={asignaturas} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort  filters={filters} 
              expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate}> 
              <Column expander={rowExpansionTemplate} header="Estudiantes" style={{ width: '1%'}} headerStyle={{textAlign:'left', width:'1%', paddingLeft:'0%'}}></Column>
              <Column field="idAsignaturaNavigation.codigo" header="Código" sortable style={{ width: '2%'}} headerStyle={{textAlign:'left', width:'2%', paddingLeft:'0%'}}></Column>
              <Column field="idAsignaturaNavigation.nombre" header="Nombre" sortable style={{ width: '50%' }} headerStyle={{textAlign:'left', width:'30%', paddingLeft:'0%'}}></Column>
              <Column field="idAsignaturaNavigation.credito" header="Crédito" sortable style={{ width: '2%'}} headerStyle={{textAlign:'left', width:'1%', paddingLeft:'0%'}}></Column>
              
          </DataTable>
        </div>
      </div>
      <div id='modalAsignaturas' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                  <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5' style={{fontWeight:'bold'}}>{title}</label>
                        <button id='closeAsignaturas' type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                      <div className='input-group mb-3'>
                          <input type='hidden' id='idAsignatura' className='form-control' value={idAsignatura} onChange={(e) => setAsignaturas(e.target.value)} disabled={isEditing}/>
                      </div>
                      <div className='input-group mb-3'>
                          <input type='text' id='codigo' className='form-control' placeholder='Código' value={codigo} 
                          onChange={(e)=> setCodigo(e.target.value)}/>
                      </div>
                      <div className='input-group mb-3'>
                          <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                          onChange={(e)=> setNombre(e.target.value)}></input>
                      </div>
                      {/* <div className='input-group mb-3'>
                          <input type='text' id='credito' className='form-control' placeholder='Créditos' value={credito} max={5} onChange={handleCreditoChange}
                          ></input>
                      </div> */}
                      <br/>
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
export default Calificaciones;