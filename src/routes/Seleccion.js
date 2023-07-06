import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { show_alerta } from '../functions';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Usuario } from '../routes/LogIn'
import { TabView, TabPanel } from 'primereact/tabview';

const Seleccion = () => {
    const url = 'http://localhost:5093/api/Asignatura';
    const urlP = 'http://localhost:5093/api/Profesor'; 
    const urlH = 'http://localhost:5093/api/Seleccion/Obtener'; 
    const [asignaturas, setAsignaturas] = useState([]); 
    const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [profesorimparte, setProfesores] = useState([]); 
    const [activeIndex, setActiveIndex] = useState(0);
    const [idAsignatura, setId] = useState(''); 
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
        getHorarios();
    },[]);

    const onRowSelect = (event) => {
        // toast.current.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.name}`, life: 3000 });
    };

    const onRowUnselect = (event) => {
        // toast.current.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.name}`, life: 3000 });
    };

    const getAsignaturas = async () => {
        try {
          const respuesta = await axios.get(url + '/Obtener');
          const asignaturasResponse = respuesta.data.response;
          setAsignaturas(asignaturasResponse);            

          const profesores = [];

          asignaturasResponse.forEach((asignatura) => {
            const profesorimparte = asignatura.asignaturaProfesors;
            profesores.push(...profesorimparte);
          });

          setProfesores(profesores); 
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

      const getHorarios = async () => {
        try {
          const respuesta = await axios.get(urlH);
          const horariosResponse = respuesta.data.response;
          setHorarios(horariosResponse); 
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
            <span style={{ fontSize: '26px', marginLeft:'-0.1%' }}>Selección de asignaturas</span>
          </div>
          <span className="p-input-icon-left">
            <i className="fa fa-search" style={{marginLeft: '10px', marginBottom: '3px'}}/>
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar asignatura" style={{marginLeft: '10px'}}/>
          </span>
        </div>
      );
    
      const header2 = (
        <div style={{ display: 'flex', alignItems: 'left' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '26px', marginLeft:'-0.1%' }}>Mi Selección</span>
          </div>
          <span className="p-input-icon-left">
            <i className="fa fa-search" style={{marginLeft: '10px', marginBottom: '3px'}}/>
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar asignatura" style={{marginLeft: '10px'}}/>
          </span>
        </div>
      );

      const handleSeleccion = (event) => {
         const filaSeleccionada = event;
         setAsignaturasSeleccionadas([...asignaturasSeleccionadas, filaSeleccionada]);
         const filtered = horarios.filter((item) =>
         asignaturasSeleccionadas.map((asig) => asig.idAsignatura).includes(item.idAsignatura));
         console.log(asignaturasSeleccionadas)
      };

  const rowExpansionTemplate = (data) => {
    const filteredProfesorimparte = profesorimparte.filter(
      (item) => item.idAsignatura === data.idAsignatura
    );
      
    filteredProfesorimparte.forEach((item) => {
      if (item.seccion === null) {
        item.seccion = 1; 
      }
    });
    
    const filteredHorarios = horarios.filter((item) =>
   filteredProfesorimparte.map((profesor) => profesor.idProfesor).includes(item.idProfesor));
  
    return (
        <div>
      <div className="p-3">
        <h5 style={{textAlign:'center'}}>Profesores actuales de {data.nombre}</h5>
        <DataTable selectionMode="single" selection={asignaturasSeleccionadas} onSelectionChange={handleSeleccion} value={filteredHorarios.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (i) =>
          i.idProfesor === item.idProfesor &&
          i.idAsignatura === item.idAsignatura 
      )
  )} removableSort>
          <Column
            body={(rowData) => rowData.idProfesorNavigation.asignaturaProfesors[0].seccion}
            header="Sección" headerStyle={{textAlign:'left', width:'0%', paddingLeft:'0%'}}
            sortable
          ></Column>
          <Column
            field="idProfesorNavigation.idUsuarioNavigation.nombre"
            header="Nombre" headerStyle={{textAlign:'left', width:'1%', paddingLeft:'0%'}}
            sortable
          ></Column>
          <Column
    header="Lun"
    headerStyle={{ textAlign: 'left', width: '1%', paddingLeft: '0%' }}
    body={(rowData) => {
      const horario = filteredHorarios.find(
        (item) =>
          item.idDiaNavigation.nombre === 'Lunes' &&
          item.idProfesor === rowData.idProfesor &&
          item.idAsignatura === rowData.idAsignatura
      );
        
      return horario ? `${horario.horaDesde} - ${horario.horaHasta}` : '';
    }}
  ></Column>
          <Column
    header="Mar"
    headerStyle={{ textAlign: 'left', width: '1%', paddingLeft: '0%' }}
    body={(rowData) => {
      const horario = filteredHorarios.find(
        (item) =>
          item.idDiaNavigation.nombre === 'Martes' &&
          item.idProfesor === rowData.idProfesor &&
          item.idAsignatura === rowData.idAsignatura
      );
      return horario ? `${horario.horaDesde} - ${horario.horaHasta}` : '';
    }}
  ></Column>
          <Column
    header="Mie"
    headerStyle={{ textAlign: 'left', width: '1%', paddingLeft: '0%' }}
    body={(rowData) => {
      const horario = filteredHorarios.find(
        (item) =>
          item.idDiaNavigation.nombre === 'Miércoles' &&
          item.idProfesor === rowData.idProfesor &&
          item.idAsignatura === rowData.idAsignatura
      );

      return horario ? `${horario.horaDesde} - ${horario.horaHasta}` : '';
    }}
  ></Column>
          <Column
    header="Jue"
    headerStyle={{ textAlign: 'left', width: '1%', paddingLeft: '0%' }}
    body={(rowData) => {
      const horario = filteredHorarios.find(
        (item) =>
          item.idDiaNavigation.nombre === 'Jueves' &&
          item.idProfesor === rowData.idProfesor &&
          item.idAsignatura === rowData.idAsignatura
      );

      return horario ? `${horario.horaDesde} - ${horario.horaHasta}` : '';
    }}
  ></Column>
          <Column
    header="Vie"
    headerStyle={{ textAlign: 'left', width: '1%', paddingLeft: '0%' }}
    body={(rowData) => {
      const horario = filteredHorarios.find(
        (item) =>
          item.idDiaNavigation.nombre === 'Viernes' &&
          item.idProfesor === rowData.idProfesor &&
          item.idAsignatura === rowData.idAsignatura
      );

      return horario ? `${horario.horaDesde} - ${horario.horaHasta}` : '';
    }}
  ></Column>
          <Column
    header="Sab"
    headerStyle={{ textAlign: 'left', width: '1%', paddingLeft: '0%' }}
    body={(rowData) => {
      const horario = filteredHorarios.find(
        (item) =>
          item.idDiaNavigation.nombre === 'Sábado' &&
          item.idProfesor === rowData.idProfesor &&
          item.idAsignatura === rowData.idAsignatura
      );

      return horario ? `${horario.horaDesde} - ${horario.horaHasta}` : '';
    }}
  ></Column>
        </DataTable>
      </div>
      </div>
    );
  };

  return (
    Usuario.idRol != 2 ? (
        <div className='App' style={{overflow:'hidden'}}>
        <TabView className="tabview-header" style={{width:'100%'}} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          <TabPanel header="General" className='panel' style={{marginRight:'1%'}}>
        <div className='card' style={{ marginLeft: '-34%', marginTop: '0%', width: '84%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          <div>
            <DataTable value={asignaturas} header={header} tableStyle={{ minWidth: '60rem' }} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort  filters={filters} 
                expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}>
                <Column expander={rowExpansionTemplate} header="Profesor" style={{ width: '1%'}} headerStyle={{textAlign:'left', width:'1%', paddingLeft:'0%'}}></Column>
                <Column field="codigo" header="Código" sortable style={{ width: '2%'}} headerStyle={{textAlign:'left', width:'2%', paddingLeft:'0%'}}></Column>
                <Column field="nombre" header="Nombre" sortable style={{ width: '50%' }} headerStyle={{textAlign:'left', width:'30%', paddingLeft:'0%'}}></Column>
                <Column field="credito" header="Crédito" sortable style={{ width: '2%'}} headerStyle={{textAlign:'left', width:'1%', paddingLeft:'0%'}}></Column>
                <Column field="idPrerequisitoNavigation.idAsignaturaNavigation.codigo" header="Prerequisito" sortable style={{ width: '5%'}} headerStyle={{textAlign:'left', width:'5%', paddingLeft:'0%'}}></Column>
            </DataTable>
          </div>
        </div>
        
        </TabPanel>
        <TabPanel header="Mi Selección">
        <div className='card' style={{ marginLeft: '-34%', marginTop: '0%', width: '84%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          <div>
            
          <DataTable value={asignaturasSeleccionadas}>
          <Column
            body={(rowData) => rowData.value.idProfesorNavigation.asignaturaProfesors[0].seccion}
            header="Sección" headerStyle={{textAlign:'center', width:'0%', paddingLeft:'0%'}}
          ></Column>
          <Column field="value.idAsignaturaNavigation.codigo" header="Clave" headerStyle={{textAlign:'left', width:'0.1%', paddingLeft:'0%'}}></Column>
          <Column body={(rowData) => {
    const asignaturaDia = rowData.value.idProfesorNavigation?.asignaturaDia;
    const profesorHoras = asignaturaDia?.find(
      (dia) => dia && dia.idProfesor === rowData.value.idProfesor
    );

    if (profesorHoras && rowData.value.idProfesorNavigation) {
      const dias = profesorHoras.idDiaNavigation.nombre;
      const horasDesde = profesorHoras.horaDesde.substring(0, 2);
      const horasHasta = profesorHoras.horaHasta.substring(0, 2);
      const horasProfesor = rowData.idProfesorNavigation?.horaDesde.substring(
        0,
        2
      );

      return `${rowData.value.idDiaNavigation.nombre + "-" + dias}`;
    }

    return "";
  }} header="Asignatura" headerStyle={{textAlign:'left', width:'0.5%', paddingLeft:'0%'}}></Column>
          <Column field="value.idProfesorNavigation.idUsuarioNavigation.nombre" header="Docente" headerStyle={{textAlign:'left', width:'5%', paddingLeft:'0%'}}></Column>
          <Column
  body={(rowData) => {
    const asignaturaDia = rowData.value.idProfesorNavigation?.asignaturaDia;
    const profesorHoras = asignaturaDia?.find(
      (dia) => dia && dia.idProfesor === rowData.value.idProfesor
    );

    if (profesorHoras && rowData.value.idProfesorNavigation) {
      const dias = profesorHoras.idDiaNavigation.nombre;
      const horasDesde = profesorHoras.horaDesde.substring(0, 2);
      const horasHasta = profesorHoras.horaHasta.substring(0, 2);
      const horasProfesor = rowData.idProfesorNavigation?.horaDesde.substring(
        0,
        2
      );

      return `${rowData.value.idDiaNavigation.nombre + "-" + dias}`;
    }

    return "";
  }}
  header="Dias"
  headerStyle={{ textAlign: "left", width: "5%", paddingLeft: "0%" }}
></Column>


          <Column body={(rowData) => {
    const asignaturaDia = rowData.value.idProfesorNavigation?.asignaturaDia;
    const profesorHoras = asignaturaDia?.find(
      (dia) => dia && dia.idProfesor === rowData.value.idProfesor
    );

    if (profesorHoras && rowData.value.idProfesorNavigation) {
      const dias = profesorHoras.idDiaNavigation.nombre;
      const horasDesde = profesorHoras.horaDesde.substring(0, 2);
      const horasHasta = profesorHoras.horaHasta.substring(0, 2);
      const horasProfesor = rowData.idProfesorNavigation?.horaDesde.substring(
        0,
        2
      );

      return `${rowData.value.horaDesde.substring(0,2) + "-" + rowData.value.horaHasta.substring(0,2) + " / " +  horasDesde + "-" + horasHasta}`;
    }

    return "";
  }} header="Horas" headerStyle={{textAlign:'left', width:'5%', paddingLeft:'0%'}}></Column>
        </DataTable>
          </div>
        </div>
        </TabPanel >
        </TabView>
      </div>
    ) : (
      <div className="message-container">
        <p style={{fontWeight:'bold', marginTop:'5%', marginLeft:"8%"}}>No tienes permisos para ver esta pantalla.</p>
      </div>
    )
  );
};

export default Seleccion