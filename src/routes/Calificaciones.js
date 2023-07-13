import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { show_alerta } from '../functions';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import {Usuario} from './LogIn';

const Calificaciones = () => {
    const url = 'http://localhost:5093/api/Calificar/Obtener/';
    const urlP = 'http://localhost:5093/api/Calificar/Publicar';
    const urlest = 'http://localhost:5093/api/Calificar/ObtenerEstudiantes';
    const [asignaturas, setAsignaturas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [idAsignatura, setId] = useState(''); const [activeIndex, setActiveIndex] = useState(0);
    const [codigo, setCodigo] = useState('');
    const [idEstudiante, setIdEstudiante] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [seccion, setSeccion] = useState('');
    const [calificacion, setCalificacion] = useState('');
    const [credito, setCredito] = useState('');
    const [title, setTitle] = useState('');
    const [operation,setOperation]=useState(1);
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
          console.log(asignaturasResponse)
          
        } catch (err) {
          console.log(err);
        }
      };

    const getEstudiantes = async () => {
        const respuesta = await axios.get(urlest)
          const estR = respuesta.data.response; 
          setEstudiantes(estR);
        }
      
        const handleInputChange = (e) => {
          const value = e.target.value;
          const regex = /^\d{0,2}(\.\d{0,2})?$/; // Expresión regular para validar máximo 2 decimales
          if (value === '' || regex.test(value)) {
            setCalificacion(value);
          }
        };

      const openModal = (op,codigo,nombre,correo,idEstudiante,seccion) =>{
            setOperation(op);
            setTitle('Calificar estudiante')
            setCodigo(codigo);
            setNombre(nombre);
            setCorreo(correo)
            setIdEstudiante(idEstudiante); 
            setSeccion(seccion)
            setCalificacion('');
      }

      const validar = () => {
        var parametros;
        var metodo;
        if (calificacion.trim() === ''){
          show_alerta('Debe escribir la calificación acumulada','warning')
        }
               
                parametros = {idAsignatura:idAsignatura, idEstudiante: idEstudiante, Calificacion:calificacion, Seccion: seccion};
                metodo = 'PUT';

                  axios({ method:metodo, url: urlP, data:parametros}).then(function(){
                  show_alerta('Se ha calificado el estudiante con éxito','success');
                  document.getElementById('closeAsignaturas').click();
                  getEstudiantes();          
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
            Código: asignaturas.idAsignaturaNavigation.codigo,
            Nombre: asignaturas.idAsignaturaNavigation.nombre,
            Crédito: asignaturas.idAsignaturaNavigation.credito
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
  
      const exportExcel2 = (filteredData) => {
        import('xlsx').then((xlsx) => {
          const usuariosFiltrados = filteredData.map((estudiantes) => ({ 
            Código: estudiantes.idEstudianteNavigation.codigo,
            Nombre: estudiantes.idEstudianteNavigation.idUsuarioNavigation.nombre,
            Correo: estudiantes.idEstudianteNavigation.idUsuarioNavigation.correo,
            Teléfono: estudiantes.idEstudianteNavigation.idUsuarioNavigation.telefono,
            Calificacion: estudiantes.calificacion
          }));
          const worksheet = xlsx.utils.json_to_sheet(usuariosFiltrados);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
      
          saveAsExcelFile(excelBuffer, 'Lista estudiantes');
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
          <Button type="button" className="bounce-icon-button"icon="fa-sharp fa-regular fa-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{marginRight:'57%', width:'35px',height:'35px',marginTop:'3px'}}/>
          <span className="p-input-icon-left">
            <i className="fa fa-search" style={{marginLeft: '10px', marginBottom: '3px'}}/>
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar asignatura" style={{marginLeft: '10px'}}/>
          </span>
        </div>
      );
      
    const footer = `En total tengo ${asignaturas ? asignaturas.length : 0} asignaturas.`;
    
  const actionTemplate = (estudiantes) => {
    setSeccion(estudiantes.seccion); setId(estudiantes.idAsignatura)
    return (
        <div className="flex flex-wrap gap-2">
          &nbsp;
            <Button style={{marginLeft:'17px'}} type="button" icon="fa-solid fa-medal" onClick={() => openModal(2,estudiantes.idEstudianteNavigation.codigo,estudiantes.idEstudianteNavigation.idUsuarioNavigation.nombre,estudiantes.idEstudianteNavigation.idUsuarioNavigation.correo,estudiantes.idEstudianteNavigation.idEstudiante)} severity="warning" outlined rounded data-bs-toggle='modal' data-bs-target='#modalAsignaturas'></Button>
            &nbsp;
        </div>
    );
  };

  const rowExpansionTemplate = (data) => {
    const filteredData = estudiantes.filter(
      (item) => item.idAsignatura === data.idAsignatura && data.seccion === item.seccion
    );
    return (
      <div className="p-3">
       
          <h5 style={{textAlign:'center',fontWeight:'bold'}}>Mis estudiantes de {data.idAsignaturaNavigation.nombre}</h5>
        <div style={{marginBottom:'1%', textAlign:'center',fontWeight:'bold'}}> 
        <a style={{fontSize:'20px',fontWeight:'lighter'}}>Exportar Listado:</a>
        <Button type="button" className="bounce-icon-button"icon="fa-sharp fa-regular fa-file-excel" severity="success" rounded onClick={() => exportExcel2(filteredData)} data-pr-tooltip="XLS" style={{marginLeft:'1%', width:'30px',height:'30px'}}/>
        </div>
        
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

  header="Calificación"
  sortable
  headerStyle={{textAlign: 'left', width: '2%', paddingLeft: '0%'}}
  body={(rowData) => {
    const calificacion = parseInt(rowData.calificacion);
    let letraCalificacion = '';

    if (calificacion >= 90 && calificacion <= 100) {
      letraCalificacion = 'A';
    } else if (calificacion >= 85 && calificacion <= 89) {
      letraCalificacion = 'B+';
    } else if (calificacion >= 80 && calificacion <= 84) {
      letraCalificacion = 'B';
    } else if (calificacion >= 75 && calificacion <= 79){
      letraCalificacion = 'C+';
    } else if (calificacion >= 70 && calificacion <= 74) {
      letraCalificacion = 'C'
    } else if (calificacion >= 60 && calificacion <= 69) {
      letraCalificacion = 'D'
    } else if (calificacion <= 59) {
      letraCalificacion = 'F'
    }


    return <span>{letraCalificacion}</span>;
  }}
/>

          <Column body={(rowData) => actionTemplate(rowData)} header="Calificar" style={{ width: '12%' }}></Column>
        </DataTable>
      </div>
    );
  };

  return (
    
    Usuario.idRol == 2 ? ( 
    <div className='App' style={{overflow:'hidden'}}>
   
      <div className='card' style={{ marginLeft: '15.5%', marginTop: '1%', width: '84%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
        <div>
          <DataTable value={asignaturas} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort  filters={filters} 
              expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate}> 
              <Column expander={rowExpansionTemplate} header="Estudiantes" style={{ width: '1%'}} headerStyle={{textAlign:'left', width:'1%', paddingLeft:'0%'}}></Column>
              <Column field="idAsignaturaNavigation.codigo" header="Código" sortable style={{ width: '2%'}} headerStyle={{textAlign:'left', width:'2%', paddingLeft:'0%'}}></Column>
              <Column field="idAsignaturaNavigation.nombre" header="Nombre" sortable style={{ width: '50%' }} headerStyle={{textAlign:'left', width:'30%', paddingLeft:'0%'}}></Column>
              <Column field="seccion" header="Sección" sortable style={{ width: '20%' }} headerStyle={{textAlign:'left', width:'20%', paddingLeft:'0%'}}></Column>
              <Column field="idAsignaturaNavigation.credito" header="Crédito" sortable style={{ width: '10%'}} headerStyle={{textAlign:'left', width:'5%', paddingLeft:'0%'}}></Column>
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
                          <input type='text' id='codigo' className='form-control' placeholder='Código' value={codigo} 
                          onChange={(e)=> setCodigo(e.target.value)} disabled/>
                      </div>
                      <div className='input-group mb-3'>
                          <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                          onChange={(e)=> setNombre(e.target.value)} disabled></input>
                      </div>
                      <div className='input-group mb-3'>
                          <input type='text' id='correo' className='form-control' placeholder='Nombre' value={correo}
                          onChange={(e)=> setCorreo(e.target.value)} disabled></input>
                      </div>
                      <div className='input-group mb-3'>
      <input
        type='text'
        id='calificacion'
        className='form-control'
        placeholder='Calificación'
        value={calificacion}
        onChange={handleInputChange}
      />
    </div>
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
    ) : (
      <div className="message-container">
        <p style={{fontWeight:'bold', marginTop:'5%', marginLeft:"8%"}}>No tienes permisos para ver esta pantalla.</p>
      </div>
    )
    
  );
};
export default Calificaciones;