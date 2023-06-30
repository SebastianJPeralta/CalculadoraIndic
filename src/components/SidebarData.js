import React from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";

export const SidebarData = [
    {
      title: 'Inicio',
      path: '/',
      icon: <AiIcons.AiFillHome style={{color: 'cornsilk'}}/>,
      cName:'nav-text'
    },
    {
      title: 'Estudiantes',
      path: '/estudiantes',
      icon: <FaIcons.FaUserFriends style={{color: 'cornsilk'}}/>,
      cName:'nav-text'
    },
    {
        title: 'Profesores',
        path: '/profesores',
        icon: <GiIcons.GiTeacher style={{color: 'cornsilk'}}/>,
        cName:'nav-text'
    },
    {
      title: 'Asignaturas',
      path: '/asignaturas',
      icon: <GiIcons.GiNotebook style={{color: 'cornsilk'}}/>,
      cName:'nav-text'
    },
    {
      title: 'Calificar',
      path: '/calificaciones',
      icon: <GiIcons.GiStarMedal style={{color: 'cornsilk'}}/>,
      cName:'nav-text'
    },
    {
        title: 'Ranking',
        path: '/ranking',
        icon: <GiIcons.GiPodium style={{color: 'cornsilk'}}/>,
        cName:'nav-text'
    }
];
