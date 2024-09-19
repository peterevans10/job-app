import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const stripePromise = loadStripe('pk_live_51Q0B3nP7SZA2M75arqadCrNsSNwI00WDrPyI1kdXvKzE6c7v3FrejEE7SlyCYcI8C8wSsVyXBeE4a7INkWevOIZy00T2p503nU');
const stripePromise = loadStripe('pk_test_51Q0B3nP7SZA2M75a8BgkMwHNJNx1winRVA3Ksjw5uAk9kTEX8Rv3WNlJiRUyYkWehV5lOxikTazxlJAHqD9i9yTA00xQkz2Adg');

function CheckoutPage() {
  const navigate = useNavigate(); // Use navigate to redirect after checkout

  const handleCheckout = async (priceId) => {
    const stripe = await stripePromise;

    try {
      // Create a checkout session
      const response = await axios.post('http://localhost:5001/create-checkout-session', { priceId });

      // Redirect to Stripe Checkout
      const { url } = response.data;
      window.location.href = url;

      // Optionally, you could listen for successful payment here
      // If successful, you can redirect to the results page after payment (implement this with webhooks later)
      // For now, we assume success and navigate back to the results page after checkout
      // Example: After returning from the Stripe checkout, handle success with webhook or in-app flow
      navigate('/results');
      
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      <h1>Select a Plan</h1>
      <button onClick={() => handleCheckout('price_1Q0X5WP7SZA2M75aTpNyRuPu')}>
        Basic Plan - $29.99/month
      </button>
      {/* <button onClick={() => handleCheckout('price_1Q0CETP7SZA2M75aL3z6tewR')}>
        Basic Plan - $29.99/month
      </button>
      <button onClick={() => handleCheckout('price_1Q0CGOP7SZA2M75aOPtZwqg6')}>
        Premium Plan - $49.99/month
      </button>
      <button onClick={() => handleCheckout('price_1Q0CJTP7SZA2M75ahWQ4J88L')}>
        One-time Payment - $9.99
      </button> */}
    </div>
  );
}

export default CheckoutPage;