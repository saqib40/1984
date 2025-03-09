import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import BLE from './pages/ble.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}/> {/* the landing page */}
        <Route path="/login" element={<Login />}/> {/* for admin login*/}
        <Route path="/signup" element={<Signup />}/> {/*for decoy login*/}
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/bl-mc" element={<BLE />} />
        {/* <Route path='/Bl-mc' element={}/>
        <Route path='Ml-mc'element={}/> */}


      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
