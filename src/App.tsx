import { useEffect } from "react";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import OrdersPage from "./pages/Tasks/TasksMain/TasksPage";
import ProjectsPage from "./pages/Projects/ProjectsMain/ProjectsPage"; 
import SellersPage from "./pages/Sellers/SellersPageMain/SellersPage";
import ErrorPages from "./pages/Error/ErrorPages";



import SellersCreate from "./pages/Sellers/SellersCreate/SellersCreate";
import SellersShowEdit from "./pages/Sellers/SellersShowEdit/SellersShowEdit";

import OrdersShowEdit from "./pages/Orders/OrdersShowEdit/OrdersShowEdit";


import ProductsShowEdit from "./pages/Products/ProductsShowEdit/ProductsShowEdit";
import ProductsCreate from "./pages/Products/ProductsCreate/ProductsCreate";



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

      <Route path="sellers" element={<RequireAuth><SellersPage /></RequireAuth>}></Route>

      <Route path="sellers/:id" element={<RequireAuth><SellersShowEdit edit={false} nameFunc="show" /></RequireAuth>}></Route>
      <Route path="sellers/create" element={<RequireAuth><SellersCreate edit={true} /></RequireAuth>}></Route>
      <Route path="sellers/edit/:id" element={<RequireAuth><SellersShowEdit edit={true} nameFunc="save" /></RequireAuth>}></Route>

      <Route path="projects" element={<RequireAuth><ProjectsPage /></RequireAuth>}></Route>
      <Route path="products/:id" element={<RequireAuth><ProductsShowEdit edit={false} nameFunc="show" /></RequireAuth>}></Route>
      <Route path="products/create" element={<RequireAuth><ProductsCreate edit={true} /></RequireAuth>}></Route>
      <Route path="products/edit/:id" element={<RequireAuth><ProductsShowEdit edit={true} nameFunc="save" /></RequireAuth>}></Route>


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

  // useEffect(() => {
  //   if (dataAuth) {
  //     dispatch(setUser({ access_token: token, user: dataAuth, isAuth: true }))
  //   }
  //   if (errorAuth) {
  //     localStorage.removeItem("token")
  //     dispatch(setToken(""))
  //     localStorage.removeItem("isAdmin")
  //     dispatch(setIsAdmin(false))
  //   }

  // })

  // const { data: dataAuth, isLoading, error: errorAuth } = davDamerAPI.useFetchAuthQuery();
  // if (isLoading) return <>Загрузка</>


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
