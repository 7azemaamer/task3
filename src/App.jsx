import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Home from "./components/Home/Home"
import Layout from "./components/Layout/Layout"
import CreateUser from "./components/CreateUser/CreateUser"

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", index: true, element: <Home /> },
        { path: "/edit-user/:id", element: <CreateUser /> },
        { path: "/create-user", element: <CreateUser /> },
      ],
    },
  ])
  return (
    <BrowserRouter
      basename="https://7azemaamer.github.io/jsb/"
      router={router}
    />
  )
}

export default App
