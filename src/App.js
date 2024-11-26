import logo from "./logo.svg";
import "./App.css";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Users from "./components/Users";
import Roles from "./components/Roles";
import Permissions from "./components/Permissions";
import Layout from "./layout/Layout";

// Define routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className=" ">
        <Layout>
          <div className=" flex justify-center items-center">
            <div class="block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <h5 class="mb-2 text-md sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome to Admin Dashboard!
              </h5>
            </div>
          </div>
        </Layout>
      </div>
    ),
  },
  {
    path: "users",
    element: (
      <Layout>
        <Users />
      </Layout>
    ),
  },
  {
    path: "roles",
    element: (
      <Layout>
        <Roles />
      </Layout>
    ),
  },
  {
    path: "permissions",
    element: (
      <Layout>
        <Permissions />
      </Layout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
