import React, { useState } from 'react'
import { show_alerta } from '../functions';
import axios from 'axios';
import * as FaIcons from "react-icons/fa";


const CambiarContra = () => {
    const [actual, setActual] = useState('');
    const [NuevaContraseña, setNueva] = useState('');
    const [ConfirmContraseña, setConfirm] = useState('');

  return (
    <div style={{width:'50%'}}>
          <div class="form-group" >
                <label>Contraseña Actual:</label>
                <input class="form-control" type="text" name="fullname" required placeholder="Ingrese su contraseña actual"/>
                <span class="Success"></span>
            </div>
            <div class="form-group">
                <label>Nueva Contraseña:</label>
                <input class="form-control" type="email" name="email" required placeholder="Ingrese su nueva contraseña"/>
                <span class="Success"></span>
            </div>
            <div class="form-group">
                <label>Confirmar Contraseña:</label>
                <input class="form-control" type="password" name="password" required placeholder="Ingrese su nueva contraseña"/>
                <span class="Success"></span>
            </div>
</div>
  )
}

export default CambiarContra