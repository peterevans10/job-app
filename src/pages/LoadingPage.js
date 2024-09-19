import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // 1 second delay to check visually
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

        // Here we simulate checking payment status
        const isPaid = await axios.get('http://localhost:5001/check-payment-status'); // Mock API call for payment status
        
        if (isPaid.data) {
          // If paid, redirect to the results page
          navigate('/results');
        } else {
          // If not paid, redirect to the checkout page
          navigate('/checkout');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        navigate('/checkout'); // Redirect to checkout if error
      }
    };

    checkPaymentStatus();
  }, [navigate]);

  return (
    <div>
      <h1>Processing...</h1>
      <p>We are checking your payment status, please wait...</p>
    </div>
  );
}

export default LoadingPage;