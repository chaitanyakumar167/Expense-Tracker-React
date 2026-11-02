import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if the user is authenticated by looking for the token
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token; // Converts the token to a true/false boolean

  const handleLogout = () => {
    // Clear all user data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('pro');
    localStorage.removeItem('rows');
    
    // Redirect to the landing page or login page
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-extrabold text-indigo-600 tracking-tight">ExpenseTracker</span>
          </Link>
        </div>
        
        <div className="flex flex-1 justify-end gap-x-4 items-center">
          
          {/* --- IF USER IS LOGGED IN --- */}
          {isAuthenticated ? (
            <>
              {/* Show navigation to internal pages */}
              {location.pathname !== '/expenses' && (
                <Link to="/expenses" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
              )}
              {location.pathname !== '/daily-expenses' && (
                <Link to="/daily-expenses" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
                  Daily View
                </Link>
              )}
              
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="ml-4 rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            
            /* --- IF USER IS NOT LOGGED IN --- */
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
                  Log in
                </Link>
              )}
              
              {location.pathname !== '/signup' && (
                <Link 
                  to="/signup" 
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  Sign up
                </Link>
              )}
            </>
          )}
          
        </div>
      </nav>
    </header>
  );
}