import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";
import Home from "./Home";
import { Classes } from "../homePages/Classes";
import Schedule from "../homePages/Schedule";
import Login from "./Login";
import { UserProvider } from "../contexts/UserProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      </UserProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "notes", element: <Classes /> },
      { path: "schedule", element: <Schedule /> },
    ],
  },
  {
    path: "/login",
    element: <Login />, // Publicly accessible Login page
  },
]);

export default router;
