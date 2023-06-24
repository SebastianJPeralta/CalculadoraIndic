import React from 'react';
import { DashEstudent } from './LogIn';

function Inicio() {
  return (
    <div class="container">
      <p style={{fontSize: '33px',fontStyle:'italic', marginLeft: '15%', marginTop:'3%'}}>Dashboard</p>
      <div class="row" style={{marginLeft: '12%', marginTop: '4%'}}>

    <div class="col-md-3">
      <div class="card-counter info">
        <i class="fa fa-users"></i>
        <h3 style={{marginTop: '-11%', marginLeft: '45%', fontStyle: 'italic'}}>Estudiantes</h3>
        <span class="count-numbers" style={{fontSize: '36px', marginRight: '67%', marginTop: '14%'}}>{DashEstudent}</span>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-counter success">
      <i class="fa fa-person-chalkboard"></i>
      <h3 style={{marginTop: '-11%', marginLeft: '49%', fontStyle: 'italic'}}>Profesores</h3>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-counter danger">
        <i class="fa fa-graduation-cap"></i>
        <h3 style={{marginTop: '-11%', marginLeft: '45%', fontStyle: 'italic'}}>Asignaturas</h3>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card-counter primary">
        <i class="fa fa-code-fork"></i>
        <h3 style={{marginTop: '-11%', marginLeft: '49%', fontStyle: 'italic'}}>test</h3>
      </div>
    </div>
  </div>
</div>

  );
}

export default Inicio;
