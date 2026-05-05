import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Volunteer = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/campaigns');
        setCampaigns(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  const handleApply = async (campaignId) => {
    if (!user) {
      alert("Please login first to volunteer!");
      return;
    }
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post('http://localhost:5001/api/volunteer', { campaignId }, config);
      alert('Successfully applied to volunteer!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Loading opportunities...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Volunteer Opportunities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Give your time and skills. Browse active campaigns that need volunteers.
          </p>
        </div>

        <div className="space-y-6">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between border-l-4 border-green-500"
            >
              <div className="mb-4 md:mb-0 md:w-2/3">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{campaign.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                    {campaign.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-medium flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {campaign.location || 'Global'}
                  </span>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-end">
                <button 
                  onClick={() => handleApply(campaign._id)}
                  className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition"
                >
                  Apply to Volunteer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
