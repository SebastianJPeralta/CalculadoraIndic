import React,{useEffect, useState} from 'react'
import { DashEstudent } from './LogIn';
import { Chart } from 'primereact/chart';

function Inicio() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [chartOptions2, setChartOptions2] = useState({});


  useEffect(() => {
      const data = {
          labels: ['Activos','Inactivos'],
          datasets: [
              {
                  data: [540, 325],
                  backgroundColor: [
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                      'rgb(255, 159, 64)',
                      'rgb(75, 192, 192)'
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
          }
      };

      setChartData(data);
      setChartOptions(options);

      const documentStyle = getComputedStyle(document.documentElement);
        const data2 = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'), 
                        documentStyle.getPropertyValue('--yellow-500'), 
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'), 
                        documentStyle.getPropertyValue('--yellow-400'), 
                        documentStyle.getPropertyValue('--green-400')
                    ]
                }
            ]
        }
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

  }, []);


  return (
    <div class="container">
      <p style={{fontSize: '33px',fontStyle:'italic', marginLeft: '15%', marginTop:'3%'}}>Dashboard</p>
      <div class="row" style={{marginLeft: '12%', marginTop: '4%'}}>

    <div class="col-md-3">
      <div class="card-counter info" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'}}>
        <i class="fa fa-users"></i>
        <h3 style={{marginTop: '-11%', marginLeft: '45%', fontStyle: 'italic'}}>Estudiantes</h3>
        <span class="count-numbers" style={{fontSize: '36px', marginRight: '67%', marginTop: '14%'}}>{DashEstudent}</span>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-counter success" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'}}>
      <i class="fa fa-person-chalkboard"></i>
      <h3 style={{marginTop: '-11%', marginLeft: '49%', fontStyle: 'italic'}}>Profesores</h3>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-counter danger" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'}}>
        <i class="fa fa-graduation-cap"></i>
        <h3 style={{marginTop: '-11%', marginLeft: '45%', fontStyle: 'italic'}}>Asignaturas</h3>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-counter primary" style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'}}>
        <i class="fa fa-code-fork"></i>
        <h3 style={{marginTop: '-11%', marginLeft: '49%', fontStyle: 'italic'}}>test</h3>
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
