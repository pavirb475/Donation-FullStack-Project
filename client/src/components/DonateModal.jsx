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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#4b3b8c] p-5 text-white flex justify-between items-center">
          <div>
            <p className="text-sm text-indigo-200">You can help us for our</p>
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
                className="bg-[#4b3b8c] h-2 rounded-full" 
                style={{ width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-gray-500">Raised<br/><span className="text-lg font-bold text-gray-900">${campaign.raisedAmount}</span></div>
              <div className="text-gray-500 text-right">Goal<br/><span className="text-lg font-bold text-gray-900">${campaign.goalAmount}</span></div>
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleDonate}>
              <div className="mb-6 flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
                <div className="bg-[#4b3b8c] text-white px-6 py-3 font-bold text-xl">$</div>
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
                    className={`py-2 border rounded-md font-bold transition-all ${amount == preset && !customAmount ? 'border-[#4b3b8c] bg-indigo-50 text-[#4b3b8c]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    ${preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCustomAmount(true)}
                  className={`py-2 border rounded-md font-bold transition-all ${customAmount ? 'border-[#4b3b8c] bg-indigo-50 text-[#4b3b8c]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  Custom
                </button>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#4b3b8c] text-white py-4 px-4 rounded-md font-bold text-lg hover:bg-indigo-900 transition shadow-lg"
              >
                Donate Now
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b3b8c] mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Processing your secure payment...</p>
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
