import React,{useEffect, useState} from 'react'
import { Chart } from 'primereact/chart';
import axios from 'axios';
import { responsivePropType } from 'react-bootstrap/esm/createUtilityClasses';
import { Usuario } from '../routes/LogIn'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function Inicio() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [chartData3, setChartData3] = useState({});
  const [chartOptions2, setChartOptions2] = useState({});
  const [chartOptions3, setChartOptions3] = useState({});
  const [estudiantes, setEstudiantes] = useState("");
  const [profesores, setProfesores] = useState("");
  const [asignaturas, setAsignaturas] = useState("");
  const [activos, setActivos] = useState("");
  const [inactivos, setInactivos] = useState("");
  const [suspendidos, setSuspendidos] = useState("");
  const [usuarios, setUsuarios] = useState("");
  const [clases, setClases] = useState([]);
  const [datoestud, setDatoEst] = useState("")
  const [usuarios2022, setUsuarios2022] = useState("");
  const [usuarios2023, setUsuarios2023] = useState("");
  const url = 'http://localhost:5093/api/Dashboard/Obtener'  
const urlC = 'http://localhost:5093/api/Dashboard/ObtenerEstudiante/'  

  useEffect(() => {
    const fetchData = async () => {
      await getDatos();
      await getClases();
      console.log(Usuario)
      if (estudiantes && profesores) {
        const data = {
          labels: ['Usuarios 2022', 'Usuarios 2023'],
          datasets: [
            {
              data: [usuarios2022, usuarios2023],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)'
              ],
              borderWidth: 1
            }
          ]
        };
    
        const options = {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        };
    
        setChartData(data);
        setChartOptions(options);
      }
  
      const documentStyle = getComputedStyle(document.documentElement);
      const data2 = {
        labels: ['Usuarios activos', 'Usuarios inactivos', ' Usuarios suspendidos'],
        datasets: [
          {
            data: [activos, inactivos, suspendidos],
            backgroundColor: [
              'rgba(60, 179, 113, 0.3)',
              'rgba(255, 0, 0, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(60, 179, 113, 0.3)',
              'rgba(255, 0, 0, 0.3)',
              'rgba(255, 159, 64, 0.3)'
            ],
          }
        ]
      };
  
      const options2 = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true
            }
          }
        }
      };
  
      setChartData2(data2);
      setChartOptions2(options2);
    };
  
    const documentStyle3 = getComputedStyle(document.documentElement);
        const data3 = {
            labels: ['A', 'B'],
            datasets: [
                {
                  data: [activos, inactivos],
                  backgroundColor: [
                    'rgba(60, 179, 113, 0.3)',
                    'rgba(255, 0, 0, 0.2)',
                  ],
                  borderColor: [
                    'rgba(60, 179, 113, 0.3)',
                    'rgba(255, 0, 0, 0.3)',
                  ],
                }
            ]
        };
        const options3 = {
            cutout: '60%',plugins: {
              legend: {
                display: false
              }
            }
        };

        setChartData3(data3);
        setChartOptions3(options3);

    fetchData();
  }, [estudiantes, profesores]);

  const getDatos = async () => {
    try 
    {
      const respuesta = await axios.get(url);
      const estudiantesResponse = respuesta.data.response;
      setEstudiantes(estudiantesResponse);
      const profesorResponse = respuesta.data.cantProfesores;
      setProfesores(profesorResponse);
      const asignaturasResponse = respuesta.data.cantAsignaturas; 
      setAsignaturas(asignaturasResponse);

      const activos = respuesta.data.cantActivos;
      setActivos(activos); 
      const inactivos = respuesta.data.cantInactivos;
      setInactivos(inactivos);
      const suspendidos = respuesta.data.cantSuspendidos;
      setSuspendidos(suspendidos);
      const usuariosResponse = respuesta.data.cantUsuarios;
      setUsuarios(usuariosResponse);

      const usuariosa2022 = respuesta.data.cantUsuarios2022;
      setUsuarios2022(usuariosa2022);
      
      const usuariosa2023 = respuesta.data.cantUsuarios2023;
      setUsuarios2023(usuariosa2023);
    } 
    catch (err) 
    {
      console.log(err);
    }
  };

  const getClases = async () => {
    try {
      const respuesta = await axios.get(urlC + Usuario.idUsuario);
      const usuariosResponse = respuesta.data.response; const datoss = respuesta.data.estudiante
      setClases(usuariosResponse);  setDatoEst(datoss); 
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {Usuario.idRol !== 1 && Usuario.idRol !== 2 && (
        <div className="container">
          <p style={{ fontSize: '33px', fontStyle: 'italic', marginLeft: '15%', marginTop: '3%',fontWeight:'bold' }}>Dashboard</p>
          <div className="row" style={{ marginLeft: '12%', marginTop: '4%' }}>
            <div className="col-md-3">
              <div className="card-counter primary" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)' }}>
                <i className="fa fa-list"></i>
                <h3 style={{ marginTop: '-11%', marginLeft: '46%', fontStyle: 'italic' }}>Usuarios</h3>
                <span className="count-numbers" style={{ fontSize: '36px', marginRight: '1000px', marginTop: '14.3%' }}>{usuarios}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card-counter info" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)' }}>
                <i className="fa fa-users"></i>
                <h3 style={{ marginTop: '-11%', marginLeft: '45%', fontStyle: 'italic',fontSize:'22px' }}>Estudiantes</h3>
                <span className="count-numbers" style={{ fontSize: '36px', marginRight: '47.5%', marginTop: '14.3%' }}>{estudiantes}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card-counter success" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)' }}>
                <i className="fa fa-person-chalkboard"></i>
                <h3 style={{ marginTop: '-11%', marginLeft: '49%', fontStyle: 'italic',fontSize:'22px', }}>Profesores</h3>
                <span className="count-numbers" style={{ fontSize: '36px', marginRight: '28%', marginTop: '14.3%' }}>{profesores}</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card-counter danger" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)' }}>
                <i className="fa fa-graduation-cap"></i>
                <h3 style={{ marginTop: '-11%', marginLeft: '45%', fontStyle: 'italic',fontSize:'21px' }}>Asignaturas</h3>
                <span className="count-numbers" style={{ fontSize: '36px', marginRight: '8.5%', marginTop: '14.3%' }}>{asignaturas}</span>
              </div>
            </div>
            <div className="card" style={{ width: '550px', marginTop: '6%', marginLeft: '1.5%', height: '300px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
              <Chart type="bar" data={chartData} options={chartOptions} />
            </div>
            <div className="card flex justify-content-center" style={{ width: '550px', height: '300px', marginTop: '6%', marginLeft: '2.5%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', zIndex: '1' }}>
              <Chart type="pie" data={chartData2} options={chartOptions2} className="md:w-20rem" style={{ width: '280px', height: '280px', marginTop: '4%', marginLeft: '23%', marginBottom: '3%' }} />
            </div>
          </div>
        </div>
      )}
      {Usuario.idRol === 1 && (
      <div>
        <div className="main-skills" style={{marginTop:'0.5%'}}>
            <div className="card" style={{marginLeft:'20%', height:'300px', width:'630px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
              <h3 style={{fontWeight:'lighter'}}>¡Bienvenido/a de nuevo, {Usuario.nombre}!👀</h3> <br/>
              <span style={{fontWeight:'bold'}}>Asignaturas actuales: 0</span>&nbsp;
              <span style={{fontWeight:'bold'}}>Índice trimestral: {datoestud.indiceTrimestral}</span>
              &nbsp;
              <span style={{fontWeight:'bold'}}>Créditos aprobados: {datoestud.creditoAprobado}</span>
              &nbsp;
              <span style={{fontWeight:'bold'}}>Trimestres cursados: {datoestud.trimestreCursado}</span>
            </div>

          <div className='main-skills' style={{marginLeft:'8%', height:'350px',marginTop:'2.5%' }} >
            <div className="card" style={{ width: '280px', marginTop: '-7%', marginLeft: '1.5%', height: '290px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
              <p style={{fontWeight:'bold', fontStyle:'italic', fontSize:'20px'}}>Índice</p><Chart type="doughnut" data={chartData3} options={chartOptions3} className="w-full md:w-30rem" style={{width:'200px', marginLeft:'11%', marginTop:'3%'}}/>
            </div>
          </div>
        </div>
        
        <div style={{marginTop:'-3%'}}>
          <DataTable value={clases}  tableStyle={{width:'70%',marginLeft:'20%',fontSize:'11px'}} removableSort>
              <Column field="idAsignaturaNavigation.codigo" header="Código" sortable style={{ width: '2%'}} headerStyle={{textAlign:'left', width:'2%', paddingLeft:'0%'}}></Column>
              <Column field="idAsignaturaNavigation.nombre" header="Nombre" sortable style={{ width: '50%' }} headerStyle={{textAlign:'left', width:'30%', paddingLeft:'0%'}}></Column>
              <Column field="seccion" header="Sección" sortable style={{ width: '20%' }} headerStyle={{textAlign:'left', width:'20%', paddingLeft:'0%'}}></Column>
              <Column field="idAsignaturaNavigation.credito" header="Crédito" sortable style={{ width: '10%'}} headerStyle={{textAlign:'left', width:'5%', paddingLeft:'0%'}}></Column>
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
    } else if (calificacion >= 75 && calificacion <= 79) {
      letraCalificacion = 'C+';
    } else if (calificacion >= 70 && calificacion <= 74) {
      letraCalificacion = 'C'
    }

    return <span>{letraCalificacion}</span>;
  }}
/>
          </DataTable>
      </div>
      </div>
      )}
    </>
  );
  
}

export default Inicio;
