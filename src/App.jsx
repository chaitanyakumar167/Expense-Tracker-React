import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import DailyExpenses from './components/DailyExpenses'; // Import the new component
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          
          {/* Secure Routes */}
          <Route 
            path="/expenses" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          
          <Route 
            path="/daily-expenses" 
            element={<ProtectedRoute><DailyExpenses /></ProtectedRoute>} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;