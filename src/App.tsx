import { useEffect } from "react";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import OrdersPage from "./pages/Tasks/TasksMain/TasksPage";
import ProjectsPage from "./pages/Projects/ProjectsMain/ProjectsPage"; 

import ErrorPages from "./pages/Error/ErrorPages";



import OrdersShowEdit from "./pages/Orders/OrdersShowEdit/OrdersShowEdit";


import ProjectShowEdit from "./pages/Projects/ProjectShowEdit/ProjectShowEdit";
import ProjectsCreate from "./pages/Projects/ProjectsCreate/ProjectsCreate";



import WorkersMain from "./pages/Workers/WorkersMain/WorkersMain";
import WorkerCreate from "./pages/Workers/WorkerCreate/WorkerCreate";
import WorkerEdit from "./pages/Workers/WorkerEdit/WorkerEdit";

import DirectoryMain from "./pages/Directory/DirectoryMain/DirectoryMain";
import DirectoryCreate from "./pages/Directory/DirectoryCreate/DirectoryCreate";
import DirectoryEdit from "./pages/Directory/DirectoryEdit/DirectoryEdit";

import { LoginPage } from "./pages/Login/LoginPage";
import { RequireAuth } from "./hoc/RequireAuth";

import LayoutMenu from "./components/Layout/Layout";
import 'overlayscrollbars/overlayscrollbars.css';
import './App.css'


import { useAppDispatch } from "./store/store";
import {setUser } from "./store/reducer/userReducer";



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<LayoutMenu />}>
      <Route index element={<RequireAuth><HomePage /></RequireAuth>}></Route>

      <Route path="workers" element={<RequireAuth><WorkersMain /></RequireAuth>}></Route>
      <Route path="workers/create" element={<RequireAuth><WorkerCreate /></RequireAuth>}></Route>
      <Route path="workers/:id" element={<RequireAuth><WorkerEdit /></RequireAuth>}></Route>


      <Route path="projects" element={<RequireAuth><ProjectsPage /></RequireAuth>}></Route>
      <Route path="projects/:id" element={<RequireAuth><ProjectShowEdit edit={false} nameFunc="show" /></RequireAuth>}></Route>
      <Route path="projects/create" element={<RequireAuth><ProjectsCreate edit={true} /></RequireAuth>}></Route>
      <Route path="projects/edit/:id" element={<RequireAuth><ProjectShowEdit edit={true} nameFunc="save" /></RequireAuth>}></Route>


      <Route path="orders" element={<RequireAuth><OrdersPage /></RequireAuth>}></Route>
      <Route path="orders/:id" element={<RequireAuth><OrdersShowEdit edit={false} nameFunc="show" /></RequireAuth>}></Route>
      <Route path="orders/edit/:id" element={<RequireAuth><OrdersShowEdit edit={true} nameFunc="save" /></RequireAuth>}></Route>

      <Route path="attributes" element={<RequireAuth><DirectoryMain /></RequireAuth>}></Route>
      <Route path="attributes/create" element={<RequireAuth><DirectoryCreate /></RequireAuth>}></Route>
      <Route path="attributes/edit/:id" element={<RequireAuth><DirectoryEdit /></RequireAuth>}></Route>

      <Route path="login" element={<LoginPage />}></Route>

      <Route path="*" element={<RequireAuth><ErrorPages /></RequireAuth>}></Route>
    </Route>
  )
)

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const localUser = localStorage.getItem("user")
    const user = localUser ? JSON.parse(localUser) : null;
    dispatch(setUser(user))
  }, [])



  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
