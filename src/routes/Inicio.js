import React,{useEffect, useState} from 'react'
import { Chart } from 'primereact/chart';
import axios from 'axios';
import { responsivePropType } from 'react-bootstrap/esm/createUtilityClasses';

function Inicio() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [chartOptions2, setChartOptions2] = useState({});
  const [estudiantes, setEstudiantes] = useState("");
  const [profesores, setProfesores] = useState("");
  const [asignaturas, setAsignaturas] = useState("");
  const [activos, setActivos] = useState("");
  const [inactivos, setInactivos] = useState("");
  const [suspendidos, setSuspendidos] = useState("");
  const [usuarios, setUsuarios] = useState("");
  const [usuarios2022, setUsuarios2022] = useState("");
  const [usuarios2023, setUsuarios2023] = useState("");
  const url = 'http://localhost:5093/api/Dashboard/Obtener'  

  useEffect(() => {
    const fetchData = async () => {
      await getDatos();
      
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
        labels: ['Activos', 'Inactivos', 'Suspendidos'],
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

  return (
    <div class="container">
      <p style={{fontSize: '33px',fontStyle:'italic', marginLeft: '15%', marginTop:'3%'}}>Dashboard</p>
      <div class="row" style={{marginLeft: '12%', marginTop: '4%'}}>
    
    <div class="col-md-3">
      <div class="card-counter primary" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'}}>
        <i class="fa fa-list"></i>
        <h3 style={{marginTop: '-11%', marginLeft: '42%', fontStyle: 'italic'}}>Usuarios</h3>
        <span class="count-numbers" style={{fontSize: '36px', marginRight: '1022px', marginTop: '13.7%'}}>{usuarios}</span>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-counter info" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'}}>
        <i class="fa fa-users"></i>
        <h3 style={{marginTop: '-11%', marginLeft: '45%', fontStyle: 'italic'}}>Estudiantes</h3>
        <span class="count-numbers" style={{fontSize: '36px', marginRight: '47.5%', marginTop: '13.7%'}}>{estudiantes}</span>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-counter success" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'}}>
      <i class="fa fa-person-chalkboard"></i>
      <h3 style={{marginTop: '-11%', marginLeft: '49%', fontStyle: 'italic'}}>Profesores</h3>
      <span class="count-numbers" style={{fontSize: '36px', marginRight: '28%', marginTop: '13.7%'}}>{profesores}</span>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-counter danger" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'}}>
        <i class="fa fa-graduation-cap"></i>
        <h3 style={{marginTop: '-11%', marginLeft: '45%', fontStyle: 'italic'}}>Asignaturas</h3>
        <span class="count-numbers" style={{fontSize: '36px', marginRight: '10%', marginTop: '13.7%'}}>{asignaturas}</span>
      </div>
    </div>
    
    <div className="card" style={{width:'550px', marginTop:'6%', marginLeft: '1.5%', height: '300px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
        <div className="card flex justify-content-center" style={{width: '550px', height:'300px', marginTop: '6%' ,marginLeft: '2.5%', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'}}>
            <Chart type="pie" data={chartData2} options={chartOptions2} className="md:w-20rem" style={{width: '280px', height:'280px', marginTop: '4%', marginLeft:'23%', marginBottom:'3%'}}/>
        </div>
  </div>
</div>

  );
}

export default Inicio;
