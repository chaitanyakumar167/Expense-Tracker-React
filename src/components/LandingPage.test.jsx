import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

// We wrap the component in BrowserRouter because LandingPage contains <Link> tags
describe('LandingPage Component', () => {
  it('renders the main heading', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    
    const headingElement = screen.getByText(/Take control of your personal finances today/i);
    expect(headingElement).toBeInTheDocument();
  });

  it('renders the login link', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );
    
    // Looks for an element with the role of 'link' and text matching 'Log in'
    const loginLink = screen.getByRole('link', { name: /Already have an account\? Log in/i });
    expect(loginLink).toBeInTheDocument();
  });
});