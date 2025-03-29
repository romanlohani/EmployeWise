import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login"
import AllUsers from "./pages/AllUsers";

function App() {
 
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/allUsers" element={<AllUsers />} />
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
