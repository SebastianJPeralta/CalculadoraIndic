import React from 'react'
import { Usuario } from './LogIn';

function Inicio() {
  return (
    <div>
      <p>Dashboard {Usuario.nombre}</p>
    </div>
  )
}
  
export default Inicio