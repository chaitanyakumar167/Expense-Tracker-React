import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DailyExpenses() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isPremium = localStorage.getItem('pro') === 'true'; // Check if premium

  const [dailyData, setDailyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDailyData();
  }, [token, navigate]);

  // Fetch the data for the table
  const fetchDailyData = async () => {
    try {
      // Replace with your actual backend endpoint for day-to-day data
      const response = await axios.get('http://localhost:4000/user/daily-expenses', {
        headers: { Authorization: token },
      });
      setDailyData(response.data.expenses || []);
    } catch (error) {
      console.error('Failed to fetch daily expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the download functionality
  const handleDownload = async () => {
    if (!isPremium) return; // Double check security
    
    try {
      const response = await axios.get('http://localhost:4000/premium/download', {
        headers: { Authorization: token },
      });
      if (response.status === 200) {
        let a = document.createElement('a');
        a.href = response.data.fileURL;
        a.download = 'myexpense.csv';
        a.click();
      }
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold leading-6 text-gray-900">Day to Day Expenses</h1>
            <p className="mt-2 text-sm text-gray-700">
              A detailed view of your daily income and expense transactions.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!isPremium}
              className={`block rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors ${
                isPremium 
                  ? 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={!isPremium ? "Premium feature only" : "Download CSV"}
            >
              {isPremium ? 'Download Report' : 'Download (Premium Only)'}
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg bg-white">
                
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Description</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Category</th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-white">Income</th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-white">Expense</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="py-4 text-center text-sm text-gray-500">Loading data...</td>
                      </tr>
                    ) : dailyData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-4 text-center text-sm text-gray-500">No transactions found.</td>
                      </tr>
                    ) : (
                      dailyData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{row.date}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{row.description}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                              {row.category}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-green-600 font-medium">
                            {row.income ? `₹${row.income}` : '-'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-red-600 font-medium">
                            {row.expense ? `₹${row.expense}` : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}