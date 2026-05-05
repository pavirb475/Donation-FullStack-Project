import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import DonateModal from '../components/DonateModal';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/campaigns');
        setCampaigns(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl">Loading campaigns...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Active Campaigns
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover causes that need your help. Every donation brings us one step closer to our goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {campaign.image ? (
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                  {campaign.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{campaign.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Raised: ${campaign.raisedAmount}</span>
                    <span className="text-gray-500">Goal: ${campaign.goalAmount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {campaign.location || 'Global'}
                  </span>
                  <button 
                    onClick={() => setSelectedCampaign(campaign)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                  >
                    Donate
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {selectedCampaign && (
        <DonateModal 
          campaign={selectedCampaign} 
          onClose={() => setSelectedCampaign(null)} 
        />
      )}
    </div>
  );
};

export default Campaigns;
