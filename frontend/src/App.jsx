import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import TicketsList from "./pages/TicketsList";
import TicketNew from "./pages/TicketNew";
import TicketDetails from "./pages/TicketDetails";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  const setToken = (token) => {
    localStorage.setItem("token", token);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome setToken={setToken} />} />
        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <TicketsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <PrivateRoute>
              <TicketNew />
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <PrivateRoute>
              <TicketDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
