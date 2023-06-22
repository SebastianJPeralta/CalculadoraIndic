import React from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";

export const SidebarData = [
    {
      title: 'Inicio',
      path: '/',
      icon: <AiIcons.AiFillHome />,
      cName:'nav-text'
    },
    {
      title: 'Calculadora',
      path: '/calculadora',
      icon: <IoIcons.IoMdCalculator />,
      cName:'nav-text'
    },
    {
      title: 'Estudiantes',
      path: '/estudiantes',
      icon: <FaIcons.FaUserFriends/>,
      cName:'nav-text'
    },
    {
        title: 'Profesores',
        path: '/profesores',
        icon: <GiIcons.GiTeacher/>,
        cName:'nav-text'
    },
    {
      title: 'Asignaturas',
      path: '/asignaturas',
      icon: <GiIcons.GiNotebook/>,
      cName:'nav-text'
    },
    {
      title: 'Calificaciones',
      path: '/calificaciones',
      icon: <GiIcons.GiStarMedal/>,
      cName:'nav-text'
    },
    {
        title: 'Ranking',
        path: '/ranking',
        icon: <GiIcons.GiPodium />,
        cName:'nav-text'
    }
];
