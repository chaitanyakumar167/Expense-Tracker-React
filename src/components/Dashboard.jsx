import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isPremium, setIsPremium] = useState(localStorage.getItem('pro') === 'true');

  // Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Grocery');

  // Expense List & Pagination State
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('rows') || 10);
  const [tempRowsInput, setTempRowsInput] = useState('');

  // Premium Feature States
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    checkPremiumStatus();
    fetchExpenses(currentPage, rowsPerPage);
  }, [token, navigate, currentPage, rowsPerPage]);

  // --- 2. CORE EXPENSE FUNCTIONS ---
  const fetchExpenses = async (page, rows) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/user/expenses?page=${page}`,
        { numberOfRows: rows },
        { headers: { Authorization: token } }
      );
      setExpenses(response.data.Expenses);
      setPaginationData({
        currentPage: response.data.currentPage,
        hasNextPage: response.data.hasNextPage,
        hasPreviousPage: response.data.hasPreviousPage,
        nextPage: response.data.nextPage,
        previousPage: response.data.previousPage,
        lastPage: response.data.lastPage,
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const newExpense = { amount, description, category };

    try {
      await axios.post('http://localhost:4000/user/add-expense', newExpense, {
        headers: { Authorization: token },
      });
      setAmount('');
      setDescription('');
      // Refresh the current page
      fetchExpenses(currentPage, rowsPerPage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/user/delete-expense/${id}`, {
        headers: { Authorization: token },
      });
      // Refresh list
      fetchExpenses(currentPage, rowsPerPage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRowsPerPageSubmit = (e) => {
    e.preventDefault();
    if (tempRowsInput > 0) {
      localStorage.setItem('rows', tempRowsInput);
      setRowsPerPage(tempRowsInput);
      setCurrentPage(1); // Reset to page 1 on row change
      setTempRowsInput('');
    }
  };

  // --- 3. PREMIUM & RAZORPAY FUNCTIONS ---
  const checkPremiumStatus = async () => {
    try {
      const response = await axios.get('http://localhost:4000/user/is-premium-user', {
        headers: { Authorization: token },
      });
      const isPro = response.data;
      localStorage.setItem('pro', isPro);
      setIsPremium(isPro);
    } catch (err) {
      console.error('Error checking premium status', err);
    }
  };

  const handleBuyPremium = async () => {
    try {
      const response = await axios.get('http://localhost:4000/purchase/premiummembership', {
        headers: { Authorization: token },
      });

      const options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: async function (paymentResponse) {
          await axios.post(
            'http://localhost:4000/purchase/updatetransactionstatus',
            {
              order_id: options.order_id,
              payment_id: paymentResponse.razorpay_payment_id,
            },
            { headers: { Authorization: token } }
          );
          checkPremiumStatus();
        },
      };
      // eslint-disable-next-line no-undef
      const rzp1 = new Razorpay(options);
      rzp1.open();
      
      rzp1.on('payment.failed', function () {
        alert('Something went wrong with the payment.');
      });
    } catch (error) {
      console.error('Payment initialization failed', error);
    }
  };

  // --- 4. PREMIUM DATA FUNCTIONS ---
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:4000/premium/showleaderboard', {
        headers: { Authorization: token },
      });
      setLeaderboard(response.data);
      setShowLeaderboard(true);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadExpenses = async () => {
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

  const fetchDownloadHistory = async () => {
    try {
      const response = await axios.get('http://localhost:4000/premium/alldownloadhistory', {
        headers: { Authorization: token },
      });
      setDownloadHistory(response.data.downloadHistory);
      setShowHistory(true);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

 

  return (
    <div className="min-h-screen bg-gray-100">
      

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* ADD EXPENSE CARD */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Add New Expense</h3>
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                  <option value="Grocery">Grocery</option>
                  <option value="Health">Health Care</option>
                  <option value="Food">Food</option>
                  <option value="Education">Education</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* EXPENSES LIST CARD */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Your Expenses</h3>
              
              <form onSubmit={handleRowsPerPageSubmit} className="flex gap-2 items-center">
                <label className="text-sm text-gray-600">Rows per page:</label>
                <input type="number" min="1" value={tempRowsInput} onChange={(e) => setTempRowsInput(e.target.value)} placeholder={rowsPerPage} className="w-16 rounded border p-1 text-sm" />
                <button type="submit" className="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300">Set</button>
              </form>
            </div>

            <ul className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                <li key={expense.id} className="py-4 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">₹{expense.amount}</span>
                    <span className="mx-2 text-gray-500">-</span>
                    <span className="text-gray-700">{expense.description}</span>
                    <span className="mx-2 text-gray-500">-</span>
                    <span className="text-sm text-gray-500 italic">{expense.category}</span>
                  </div>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                </li>
              ))}
              {expenses.length === 0 && <p className="text-sm text-gray-500 py-4">No expenses found.</p>}
            </ul>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {paginationData.hasPreviousPage && (
                <button onClick={() => setCurrentPage(paginationData.previousPage)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">{paginationData.previousPage}</button>
              )}
              
              <span className="px-3 py-1 rounded bg-indigo-600 text-white text-sm font-bold">{paginationData.currentPage}</span>
              
              {paginationData.hasNextPage && (
                <button onClick={() => setCurrentPage(paginationData.nextPage)} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">{paginationData.nextPage}</button>
              )}
            </div>
          </div>
        </div>

        {/* PREMIUM FEATURES SECTION */}
        {isPremium && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            
            {/* Leaderboard Card */}
            <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
              <button onClick={fetchLeaderboard} className="w-full bg-yellow-100 text-yellow-800 py-2 rounded-md font-medium hover:bg-yellow-200 transition-colors">
                Load Leaderboard
              </button>
              {showLeaderboard && (
                <ul className="mt-4 divide-y divide-gray-200">
                  {leaderboard.map((user, index) => (
                    <li key={index} className="py-2 flex justify-between text-sm">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-gray-600">Total: ₹{user.totalExpenses}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Downloads Card */}
            <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
              <div className="flex gap-4 mb-4">
                <button onClick={downloadExpenses} className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-md font-medium hover:bg-indigo-100">
                  Download CSV
                </button>
                <button onClick={fetchDownloadHistory} className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-100">
                  History
                </button>
              </div>
              
              {showHistory && (
                <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-500">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {downloadHistory.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 text-right">
                            <a href={item.url} className="text-indigo-600 hover:text-indigo-900">Download</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}