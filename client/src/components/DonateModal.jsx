import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DonateModal = ({ campaign, onClose }) => {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); 
  const [errorMsg, setErrorMsg] = useState('');

  const presetAmounts = [10, 50, 100, 200, 500];

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to donate.");
      return;
    }
    if (!amount || amount <= 0) return;
    setStep(2);
  };

  const processPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStep(3); // Processing step

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const { data } = await axios.post('http://localhost:5001/api/donations/create-order', {
        campaignId: campaign._id,
        amount: Number(amount)
      }, config);

      setTimeout(async () => {
        try {
          await axios.post('http://localhost:5001/api/donations/verify', {
            paymentIntentId: data.orderId,
            campaignId: campaign._id,
            amount: Number(amount)
          }, config);
          
          setStep(4); // Success step
        } catch (err) {
          setErrorMsg("Verification failed.");
          setStep(5); // Failure step
        }
      }, 1500);

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to initiate payment");
      setStep(5); // Failure step
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-orange-600 p-5 text-white flex justify-between items-center">
          <div>
            <p className="text-sm text-orange-200">You can help us for our</p>
            <h3 className="text-2xl font-bold">Campaign</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-300 text-3xl font-bold">&times;</button>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h4>
            <p className="text-sm text-gray-500 line-clamp-2">{campaign.description}</p>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-orange-600 h-2 rounded-full" 
                style={{ width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-gray-500">Raised<br/><span className="text-lg font-bold text-gray-900">₹{campaign.raisedAmount}</span></div>
              <div className="text-gray-500 text-right">Goal<br/><span className="text-lg font-bold text-gray-900">₹{campaign.goalAmount}</span></div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleAmountSubmit}>
              <div className="mb-6 flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
                <div className="bg-orange-600 text-white px-6 py-3 font-bold text-xl">₹</div>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full py-3 px-4 focus:outline-none text-xl font-bold text-gray-900"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setCustomAmount(true);
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {presetAmounts.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => { setAmount(preset); setCustomAmount(false); }}
                    className={`py-2 border rounded-md font-bold transition-all ${amount == preset && !customAmount ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    ₹{preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCustomAmount(true)}
                  className={`py-2 border rounded-md font-bold transition-all ${customAmount ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  Custom
                </button>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-600 text-white py-4 px-4 rounded-md font-bold text-lg hover:bg-orange-700 transition shadow-lg"
              >
                Proceed to Checkout
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={processPayment} className="animate-fade-in">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Payment Details</h4>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input type="text" pattern="[0-9\s]{16,19}" title="Must be a 16-digit card number" placeholder="0000 0000 0000 0000" maxLength="19" required className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest text-gray-900" />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input type="text" pattern="(0[1-9]|1[0-2])\/[0-9]{2}" title="Format: MM/YY" placeholder="MM/YY" maxLength="5" required className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-gray-900" />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input type="password" pattern="[0-9]{3}" title="Must be exactly 3 digits" placeholder="•••" maxLength="3" required className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input type="text" pattern="[a-zA-Z\s]+" title="Only letters and spaces allowed" placeholder="John Doe" required className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900" />
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-gray-300 text-gray-700 py-3 rounded-md font-bold hover:bg-stone-50 transition"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="w-2/3 bg-orange-600 text-white py-3 rounded-md font-bold hover:bg-orange-700 transition shadow-lg flex items-center justify-center"
                >
                  Pay ₹{amount} Securely
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Processing your secure payment...</p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your donation of ₹{amount} was successful.</p>
              <button onClick={() => { onClose(); window.location.reload(); }} className="mt-6 w-full bg-emerald-600 text-white py-2 px-4 rounded-md font-bold hover:bg-emerald-700 transition">
                Close
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600">{errorMsg}</p>
              <button onClick={() => setStep(1)} className="mt-6 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-bold hover:bg-stone-50 transition">
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
