import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // Assuming this is the path to your ProtectedRoute component
import Layout from "./Layout"; // Your Layout component
import Home from "./Home"; // Your Home component
import NotesHome from "../homePages/NotesHome"; // Your NotesHome component
import StudyHome from "../homePages/StudyHome"; // Your StudyHome component
import ScheduleHome from "../homePages/ScheduleHome"; // Your ScheduleHome component
import Login from "./Login"; // Your Login component

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "notes", element: <NotesHome /> },
      { path: "study", element: <StudyHome /> },
      { path: "schedule", element: <ScheduleHome /> },
    ],
  },
  {
    path: "/login",
    element: <Login />, // Publicly accessible Login page
  },
]);

export default router;
