import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import Calculadora from "./routes/Calculadorass";
import Ranking from "./routes/Ranking";
import Inicio from './routes/Inicio';
import Navbar from "./components/Navbar";
import Perfil from "./routes/Perfil";
import LogIn, { RolEstudiante } from "./routes/LogIn";
import Asignaturas from "./routes/Asignaturas";
import Calificaciones from "./routes/Calificaciones";
import "./App.css"
import Estudiante from "./routes/Estudiante";
import Profesores from "./routes/Profesores";
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useState } from 'react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {!isLoggedIn && <LogIn onSuccess={handleLoginSuccess} />}
      {isLoggedIn && (
        <>
          <Navbar onLogout={handleLogout} />
          <Outlet />
        </>
      )}
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Inicio />
      },
      {
        path: "estudiantes",
        element: <Estudiante />
      },
      {
        path: "profesores",
        element: <Profesores />
      },
      {
        path: "calculadora",
        element: <Calculadora />,
      },
      {
        path: "ranking",
        element: <Ranking />,
      },
      {
        path: "calificaciones",
        element: <Calificaciones />
      },
      {
        path: "asignaturas",
        element: <Asignaturas />
      },
      {
        path: "perfil",
        element: <Perfil />
      },
      {
        path: "login",
        element: <LogIn />
      }
    ]
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)