import React, { useState } from "react";
import * as HiIcons from "react-icons/hi";
import * as IoIcons from "react-icons/io";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../App.css";
import { IconContext } from "react-icons";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Dropdown } from 'react-bootstrap';
import { getRolAdmin, getRolEstudiante, getRolProfesor, setRolAdmin, setRolEstudiante, setRolProfesor } from '../routes/LogIn';
import * as FaIcons from "react-icons/fa";

const Navbar = ({onLogout}) => {
  const [sidebar, setSidebar] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  
  const validarSalir = () =>{
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title:'¿Seguro que desea salir ?',
        icon:'question',text:'Se cerrará la sesión actual',
        showCancelButton:true,confirmButtonText:'Si, salir',cancelButtonText:'Cancelar'
    }).then((result) =>{
        if (result.isConfirmed) {
          setRolEstudiante(false);
          setRolAdmin(false);
          setRolProfesor(false);
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
          </Link>
          <div className="user-avatar">
              <img className="avatar-image" src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Foto de usuario" />
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
            {SidebarData.map((item, index) => {

if (getRolAdmin()) {

   return (
   <li key={index} className={item.cName}>
     <Link to={item.path}>
       {item.icon}
       <span>{item.title}</span>
     </Link>
   </li>
 )}


              else if (getRolEstudiante()) {
               if (item.title === 'Inicio' || item.title === 'Calculadora' || item.title === 'Ranking' || item.title === 'Ranking') {
                return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              )}}

              else if (getRolProfesor()){
                if (item.title === 'Inicio' || item.title === 'Calificaciones' || item.title === 'Ranking') {
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
            <h3 style={{color:'cornsilk', marginTop: '17%', marginLeft: '-147px', fontSize: '32px', fontFamily: 'cursive'}}>UNIX</h3>
          <FaIcons.FaUserGraduate style={{fontSize: '32px', marginLeft: '-200px', color: 'cornsilk', marginTop: '-77px'}}/>
          </div>
        </nav>
        
      </IconContext.Provider>
    </>
  );
}

export default Navbar;