import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { vi } from 'vitest';
import Login from './Login';

// 1. Tell Vitest to mock the entire axios module
vi.mock('axios');

describe('Login Component', () => {
  
  // Clear any previous mock data before each test
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('shows an error message on API failure', async () => {
    // 2. Define the fake failed response
    axios.post.mockRejectedValueOnce({
      response: {
        status: 404,
        data: { message: 'User not found' }
      }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Simulate user typing
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    // Simulate clicking submit
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // 3. Wait for the error message to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText(/User not found/i)).toBeInTheDocument();
    });
  });

  it('saves token and redirects on successful login', async () => {
    // Define the fake success response matching your component's expected 202 status
    axios.post.mockResolvedValueOnce({
      status: 202,
      data: { token: 'fake-jwt-token-123' }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'success@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for the button text to change back, meaning the async operation finished
    await waitFor(() => {
      // Check if the fake token was saved to localStorage
      expect(localStorage.getItem('token')).toBe('fake-jwt-token-123');
    });
  });
});