import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Usuario } from './LogIn';

const Ranking = () => {
  const url = 'http://localhost:5093/api/Estudiante/Ranking';
  const [estudiantes, setEstudiantes] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      correo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      codigo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      fechaingreso: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() =>{
    getEstudiantes();
},[]);

const getEstudiantes = async () => {
  try {
    const respuesta = await axios.get(url);
    const Response = respuesta.data.response
    setEstudiantes(Response);      console.log(Response)
  } catch (err) {
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

const exportExcel = () => {
  import('xlsx').then((xlsx) => {
    const estudiantesFiltrados = estudiantes.map((estudiante) => ({
      Código: estudiante.codigo,
      Nombre: estudiante.idUsuarioNavigation.nombre,
      Índice: estudiante.indiceGeneral,
      Carrera: estudiante.idCarreraNavigation.nombre,
      Trimestres: estudiante.trimestreCursado,
      FechaIngreso: estudiante.idUsuarioNavigation.fechaingreso.substring(10,0),
    }));

    const worksheet = xlsx.utils.json_to_sheet(estudiantesFiltrados);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    saveAsExcelFile(excelBuffer, 'Ranking');
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
  <div className='header-container'>
  <div style={{ display: 'flex', alignItems: 'left' }}>
    <div style={{ flex: 1 }}>
      <span style={{ fontSize: '26px', marginLeft:'-0.01%' }}>Ranking período FEBRERO-ABRIL</span>
    </div>
    <Button type="button" icon="fa-sharp fa-regular fa-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" style={{marginRight:'39%', width:'35px',height:'35px',marginTop:'2px'}}/>
    <span className="p-input-icon-left">
      <i className="fa fa-search" style={{marginLeft: '10px', marginBottom: '3px'}}/>
      <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar estudiante" style={{marginLeft: '10px'}}/>
    </span>
  </div></div>
);

const footer = `En total existen ${estudiantes ? estudiantes.length : 0} estudiantes.`;
  return (
    <div className='App'>
      <div className='card' style={{ marginLeft: '15.5%', marginTop: '1%', width: '84%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor:'white' }}>
        <div >
          <DataTable value={estudiantes} header={header} footer={footer} tableStyle={{ minWidth: '60rem'}} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} removableSort filters={filters} style={{fontSize:'13.5px'}}>
            <Column field="codigo" header="Código" sortable style={{ textAlign:'left'}} headerStyle={{textAlign:'left', width:'1%', paddingLeft:'0%'}}></Column>
            <Column field="idUsuarioNavigation.nombre" header="Nombre" sortable style={{textAlign:'left' }} headerStyle={{textAlign:'left', width:'21%', paddingLeft:'0%'}}></Column>
            <Column body={(rowData) => rowData.indiceGeneral.toFixed(2)} header="Índice" sortable style={{textAlign:'left' }} headerStyle={{textAlign:'left', width:'21%', paddingLeft:'0%'}}></Column>
            <Column field="idCarreraNavigation.nombre" header="Carrera" sortable style={{textAlign:'left' }} headerStyle={{textAlign:'left', width:'21%', paddingLeft:'0%'}}></Column>
            <Column field="trimestreCursado" header="Trimestre Cursado" sortable style={{ textAlign:'left'}} headerStyle={{textAlign:'left', width:'19%', paddingLeft:'0%'}}></Column>
            <Column body={(rowData) => rowData.idUsuarioNavigation.fechaingreso.substring(0, 10)} header="FechaIngreso" sortable style={{ width: '10%', textAlign: 'center' }}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  )
}

export default Ranking;