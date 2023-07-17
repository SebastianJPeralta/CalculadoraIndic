import React, { useState } from "react";
import * as HiIcons from "react-icons/hi";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../App.css";
import { IconContext } from "react-icons";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Dropdown } from 'react-bootstrap';
import { Usuario } from '../routes/LogIn';
import * as FaIcons from "react-icons/fa";

const Navbar = ({onLogout}) => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  
  const validarSalir = () =>{
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title:'¿Seguro que desea salir?',
        icon:'question',text:'Se cerrará la sesión actual y se perderán los cambios no guardados',
        showCancelButton:true,confirmButtonText:'Si, salir',cancelButtonText:'Cancelar'
    }).then((result) =>{
        if (result.isConfirmed) {
          onLogout();
        }
    })
}

  return (
    <>
      <IconContext.Provider value={{ color: "#f5f5f5" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <HiIcons.HiMenu onClick={showSidebar} className="menu-bars-p"/>
          </Link><h3 style={{color:'white', fontSize: '12px', fontFamily: 'system-ui', marginRight:'-78%', marginTop:'1%'}}>{Usuario.nombre}</h3>
          <div className="user-avatar" style={{marginRight:'15%'}}>
              <img className="avatar-image" src="https://img.freepik.com/foto-gratis/hombre-joven-guapo-nuevo-corte-pelo-estilo_176420-19636.jpg?w=2000" alt="Foto de usuario" />
            </div>
        <Dropdown className="flecha">
          <Dropdown.Toggle variant="link" style={{color: 'white'}}>
          </Dropdown.Toggle>
          <Dropdown.Menu className="aparecer">
            <Dropdown.Item as={Link} to="/perfil">Ir a perfil</Dropdown.Item>
            <Dropdown.Item onClick={validarSalir}>Cerrar sesión</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
              </Link>
            </li>
            &nbsp;
            {SidebarData.map((item, index) => {

if (Usuario.idRol != 1 && Usuario.idRol != 2) {
  if(item.title === 'Inicio' || item.title === 'Estudiantes' || item.title === 'Profesores' || item.title === 'Asignaturas' || item.title === 'Carreras') {
          return (
          <li key={index} className={item.cName}>
            <Link to={item.path}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        )}}
              else if (Usuario.idRol == 1) {
               if (item.title === 'Inicio' || item.title === 'Selección' || item.title === 'Ranking') {
                return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              )}}
              else if (Usuario.idRol == 2){
                if (item.title === 'Inicio' || item.title === 'Calificar' || item.title === 'Ranking') {
                return (
                  <li key={index} className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )}}
            })}
          </ul>
          <div style={{marginTop: '10%'}}>
            <h3 style={{color:'cornsilk', marginTop: '17%', marginLeft: '-140px', fontSize: '32px', fontFamily: 'system-ui'}}>UNI-X</h3>
          <FaIcons.FaUserGraduate style={{fontSize: '45px', marginLeft: '-200px', color: 'cornsilk', marginTop: '-55px'}}/>
          </div>
          <div style={{marginTop: '27%'}}> 
            <h3 style={{color:'white', marginLeft: '-137px', fontSize: '12px', fontFamily: 'system-ui'}}>Para {Usuario.idRolNavigation.nombre}</h3>
          </div>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;