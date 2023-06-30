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

const Asignaturas = () => {
    const url = 'http://localhost:5093/api/Asignatura';
    const urlP = 'http://localhost:5093/api/Profesor'; 
    const [asignaturas, setAsignaturas] = useState([]);
    const [profesorimparte, setProfesores] = useState([]);
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
        getProfesores();
    },[]);

    useEffect(() => {
      getAsignaturas();
      setSelectedValue('');
      setProfesorValue('');
      setIdProfesor(''); setId('');
    }, [activeIndex]);

    const getAsignaturas = async () => {
        try {
          const respuesta = await axios.get(url + '/Obtener');
          const asignaturasResponse = respuesta.data.response; console.log(respuesta)
          setAsignaturas(asignaturasResponse);            

          const profesores = [];

          asignaturasResponse.forEach((asignatura) => {
            const profesorimparte = asignatura.asignaturaProfesors;
            profesores.push(...profesorimparte);
          });

          setProfesores(profesores); console.log(profesores)
        } catch (err) {
          console.log(err);
        }
      };
      
      const getAsignaturasSelect = async () => {
        try {
          const respuesta = await axios.get(url + '/Obtener');
          const asignaturasResponse = respuesta.data.response;
          return asignaturasResponse        
        } catch (err) {
          console.log(err);
        }
      };

      const getProfesores = async () => {
        try {
          const respuesta = await axios.get(urlP + '/Obtener');
          const asignaturasResponse = respuesta.data.response;
          return asignaturasResponse        
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
        }

        setIsEditing(op === 2);
        window.setTimeout(function(){
        },500);
      }

      const handleChange = value => {
        setSelectedValue(value);
        setId(value.idAsignatura); 
      }

      const handleProfesorChange = value => {
        setProfesorValue(value);
        setIdProfesor(value.profesors[0].idProfesor)
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

      const validarAsignar = () => {
        var parametros;
        var metodo;
        const alertas = [
          {condicion: idAsignatura === '', mensaje: 'Debe seleccionar la asignatura'},
          {condicion: idProfesor === '', mensaje: 'Debe seleccionar el profesor'}
      ];
  
      for (const alerta of alertas) {
          if (alerta.condicion) {
              show_alerta(alerta.mensaje, 'warning');
              return; 
          }
      }
                parametros = {idAsignatura,idProfesor};  
                metodo='POST';
                 axios({ method:metodo, url: url + '/Asignar', data:parametros}).then(function(){
                   show_alerta('Se ha asignado el profesor con éxito','success');
                   setSelectedValue(''); setProfesorValue(''); setIdProfesor(''); setId('');
                 })
                 .catch(function(error){
                     show_alerta(error.response.data.mensaje,'error')
                     console.log(error);
                 });
      }

      const validarDesasignar = () => {
        var parametros;
        var metodo;
        const alertas = [
          {condicion: idAsignatura === '', mensaje: 'Debe seleccionar la asignatura'},
          {condicion: idProfesor === '', mensaje: 'Debe seleccionar el profesor'}
      ];
  
      for (const alerta of alertas) {
          if (alerta.condicion) {
              show_alerta(alerta.mensaje, 'warning');
              return; 
          }
      }
      const MySwal = withReactContent(Swal);
      MySwal.fire({
          title:'¿Seguro que desea desasignar el profesor?',
          icon:'question',text:'No se podrá dar marcha atrás',
          showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
      }).then((result) =>{
          if (result.isConfirmed) {
            parametros = {idAsignatura,idProfesor}; 
            metodo='DELETE';
             axios({ method:metodo, url: url + '/EliminarAsignacion', data:parametros}).then(function(){
               show_alerta('Se ha desasignado el profesor de la asignatura con éxito','success');
               setSelectedValue(''); setProfesorValue(''); setIdProfesor(''); setId('');
             })
             .catch(function(error){
                 show_alerta(error.response.data.mensaje,'error')
                 console.log(error);
             });
          }
      })}

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
    const handleCreditoChange = (e) => {
      let value = parseInt(e.target.value);
      if (value > 5) {
        value = 5;
      }
      setCredito(value);
    };
      const header = (
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '26px', marginLeft:'-0.1%' }}>Gestión de asignaturas</span>
          </div>
          <Button type="button" className="bounce-icon-button"icon="fa-sharp fa-regular fa-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{marginRight:'41%', width:'35px',height:'35px',marginTop:'3px'}}/>
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
    
    const cardheader = (
      <img alt="Card" src="https://img.freepik.com/vector-premium/profesor-hombre-aula_118813-9611.jpg" style={{height: '250px', width:'350px', marginBottom:'-1%'}}/>
  );
  const cardfooter = (
      <div className="flex flex-wrap justify-content-end gap-2">
          <Button label="Asignar" icon="fa-solid fa-user-plus" onClick={validarAsignar} rounded severity="success" style={{ marginRight: '8%', paddingRight: '30px' }}/> 
          &nbsp;
          <Button label="Eliminar" icon="fa-solid fa-user-minus" onClick={validarDesasignar} rounded severity="danger" style={{paddingRight: '25px' }}/> 
      </div>
  );

  const actionTemplate = (asignaturas) => {
    return (
        <div className="flex flex-wrap gap-2">
            <Button type="button" icon="fa-solid fa-pencil-alt" onClick={() => openModal(2,asignaturas.idAsignatura,asignaturas.nombre,asignaturas.credito,asignaturas.codigo)} severity="info" outlined rounded data-bs-toggle='modal' data-bs-target='#modalAsignaturas'></Button>
            &nbsp;
            <Button icon="fa-solid fa-trash" onClick={() => deleteAsignatura(asignaturas.idAsignatura,asignaturas.nombre)} rounded outlined severity="danger"/>
        </div>
    );
  };

  const rowExpansionTemplate = (data) => {
    console.log(data); console.log(profesorimparte)
    const filteredData = profesorimparte.filter(
      (item) => item.idAsignatura === data.idAsignatura
    );
  
    return (
      <div className="p-3">
        <h5>Profesores de {data.nombre}</h5>
        <DataTable value={filteredData} removableSort>
          <Column
            field="idProfesorNavigation.codigo"
            header="Codigo"
            sortable
          ></Column>
          <Column
            field="idProfesorNavigation.idUsuarioNavigation.nombre"
            header="Nombre"
            sortable
          ></Column>
          <Column
            field="idProfesorNavigation.idUsuarioNavigation.correo"
            header="Correo"
            sortable
          ></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <div className='App' style={{overflow:'hidden'}}>
      <TabView className="tabview-header" style={{width:'100%'}} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Gestión" className='panel'>
      <div className='card' style={{ marginLeft: '-34%', marginTop: '0%', width: '84%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
        <div>
          <DataTable value={asignaturas} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort  filters={filters} 
              expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}>
              <Column expander={rowExpansionTemplate} header="Profesor" style={{ width: '1%'}} headerStyle={{textAlign:'left', width:'1%', paddingLeft:'0%'}}></Column>
              <Column field="codigo" header="Código" sortable style={{ width: '2%'}} headerStyle={{textAlign:'left', width:'2%', paddingLeft:'0%'}}></Column>
              <Column field="nombre" header="Nombre" sortable style={{ width: '50%' }} headerStyle={{textAlign:'left', width:'30%', paddingLeft:'0%'}}></Column>
              <Column field="credito" header="Crédito" sortable style={{ width: '2%'}} headerStyle={{textAlign:'left', width:'1%', paddingLeft:'0%'}}></Column>
              <Column field="idPrerequisitoNavigation.idAsignaturaNavigation.codigo" header="Prerequisito" sortable style={{ width: '5%'}} headerStyle={{textAlign:'left', width:'5%', paddingLeft:'0%'}}></Column>
              <Column body={(rowData) => actionTemplate(rowData)} header="Acción" style={{ width: '12%' }}></Column>
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
                      <div className='input-group mb-3'>
                          <input type='text' id='credito' className='form-control' placeholder='Créditos' value={credito} max={5} onChange={handleCreditoChange}
                          ></input>
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
      </TabPanel>
      <TabPanel header="Asignar/eliminar">
            <Card title="Asignar/eliminar profesor" subTitle="Asigna o elimina un profesor a una asignatura" footer={cardfooter} header={cardheader} className="md:w-25rem" style={{width:"450px", height:'550px', marginLeft:'-9%',marginTop:'0.5%', textAlign:'center', marginBottom:'5%'}}>
                           <div style={{marginTop:'1%', textAlign:'left', width:'85%',marginLeft:'7%'}}>
                        <AsyncSelect 
                        cacheOptions
                        defaultOptions
                        value={selectedValue ? [selectedValue] : null}
                        getOptionLabel={e => e.codigo + ' - ' + e.nombre}
                        getOptionValue={e => e.idAsignatura}
                        loadOptions={getAsignaturasSelect}
                        onChange={handleChange}
                        placeholder="Selecciona una asignatura"
                        isSearchable={false}/>      </div>                 
                      &nbsp;
                      <div style={{textAlign:'left',width:'85%',marginLeft:'7%'}}>
                        <AsyncSelect
                        cacheOptions
                        defaultOptions
                        value={profesorValue ? [profesorValue] : null}
                        getOptionLabel={e => e.profesors[0].codigo + ' - ' + e.nombre}
                        getOptionValue={e => e.profesors[0].idProfesor}
                        loadOptions={getProfesores}
                        onChange={handleProfesorChange}
                        placeholder="Selecciona un profesor"
                        isSearchable={false} 
                        />                       
                      </div>
            </Card>
        
      </TabPanel >
      </TabView>
    </div>
  );
};

export default Asignaturas