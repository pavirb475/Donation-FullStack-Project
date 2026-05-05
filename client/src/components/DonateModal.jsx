import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DonateModal = ({ campaign, onClose }) => {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Amount, 2: Processing, 3: Success, 4: Error
  const [errorMsg, setErrorMsg] = useState('');

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to donate.");
      return;
    }
    if (!amount || amount <= 0) return;

    setLoading(true);
    setStep(2);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // 1. Create order
      const { data } = await axios.post('http://localhost:5001/api/donations/create-order', {
        campaignId: campaign._id,
        amount: Number(amount)
      }, config);

      // Simulate payment gateway delay
      setTimeout(async () => {
        try {
          // 2. Verify donation
          await axios.post('http://localhost:5001/api/donations/verify', {
            paymentIntentId: data.orderId,
            campaignId: campaign._id,
            amount: Number(amount)
          }, config);
          
          setStep(3);
        } catch (err) {
          setErrorMsg("Verification failed.");
          setStep(4);
        }
      }, 1500);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to initiate payment");
      setStep(4);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Donate to Campaign</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 truncate">{campaign.title}</h4>
            <p className="text-sm text-gray-500">You are making a difference today.</p>
          </div>

          {step === 1 && (
            <form onSubmit={handleDonate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount (USD)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3 border"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-bold hover:bg-blue-700 transition"
              >
                Proceed to Payment
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Processing your secure payment...</p>
              <p className="text-xs text-gray-400 mt-2">Mocking Payment Gateway</p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your donation of ${amount} was successful.</p>
              <button onClick={() => { onClose(); window.location.reload(); }} className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md font-bold hover:bg-green-700 transition">
                Close
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600">{errorMsg}</p>
              <button onClick={() => setStep(1)} className="mt-6 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-bold hover:bg-gray-50 transition">
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DonateModal;
