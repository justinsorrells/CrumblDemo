import React from 'react'
import ReactDOM from 'react-dom/client'
import Leaderboard from './Leaderboard';
import Friends from './Friends';
import Cookie from './Cookie';
// Bootstrap CSS
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./output.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App'
import Login from './Login'
import Register from './Register';
import UserProfile from './UserProfile';
import './index.css'
import { userProfile } from './Who';

const router = createBrowserRouter([
  {
    path:"/",
    element: <App />,
    loader: userProfile,
  },
  {
    path:"cookies/:cookieId",
    element: <Cookie />,
    loader: userProfile,
  },
  {
    path:"/friends",
    element: <Friends />,
    loader: userProfile,
  },
  {
    path:"/leaderboard",
    element: <Leaderboard />,
  },
  {
    path:"/login",
    element: <Login />,
  },
  {
    path:"/register",
    element: <Register />,
  },
  {
    path:"user/:userId",
    element: <UserProfile />,
    loader: userProfile,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
      <RouterProvider router = {router} />
)
