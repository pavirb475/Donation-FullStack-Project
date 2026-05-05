import { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import DonateModal from '../components/DonateModal';
import { AuthContext } from '../context/AuthContext';
import { FaSearch, FaMapMarkerAlt, FaTags } from 'react-icons/fa';

const Campaigns = () => {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [pastDonations, setPastDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campRes = await axios.get('http://localhost:5001/api/campaigns');
        setCampaigns(campRes.data);

        if (user) {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const [recRes, donRes] = await Promise.all([
            axios.get('http://localhost:5001/api/recommendations', config).catch(() => ({ data: [] })),
            axios.get('http://localhost:5001/api/donations/me', config).catch(() => ({ data: [] }))
          ]);
          setRecommendations(recRes.data);
          setPastDonations(donRes.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const categories = useMemo(() => [...new Set(campaigns.map(c => c.category))], [campaigns]);
  const locations = useMemo(() => [...new Set(campaigns.map(c => c.location).filter(Boolean))], [campaigns]);

  const filteredCampaigns = campaigns.filter(c => {
    return (
      (c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory ? c.category === selectedCategory : true) &&
      (selectedLocation ? c.location === selectedLocation : true)
    );
  });

  const featuredCampaign = campaigns.length > 0 ? campaigns[0] : null;

  if (loading) return <div className="text-center py-20 text-xl">Loading campaigns...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      
      {/* Hero Section matching the uploaded aesthetic */}
      <section className="relative bg-[#4b3b8c] text-white py-16 lg:py-24 overflow-hidden">
        {/* World map background overlay (using a generic transparent world map pattern) */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Donations<br/>that change<br/>the world
            </h1>
            <p className="text-lg text-indigo-200 max-w-lg mb-8">
              We've spent the last 5 years helping over 25,000 teams just like yourself create and sustain successful online support.
            </p>
            <button className="border-2 border-white text-white px-8 py-3 font-bold hover:bg-white hover:text-[#4b3b8c] transition rounded-sm">
              Learn More
            </button>
          </div>

          {featuredCampaign && (
            <div className="lg:w-5/12 w-full">
              <div className="bg-white text-gray-900 rounded-lg p-8 shadow-2xl">
                <p className="text-sm text-gray-500 font-medium">You can help us for our</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Campaign</h3>
                <p className="text-sm text-gray-600 mb-6 line-clamp-2">{featuredCampaign.title} - {featuredCampaign.description}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div className="bg-[#4b3b8c] h-3 rounded-full" style={{ width: `${Math.min((featuredCampaign.raisedAmount / featuredCampaign.goalAmount) * 100, 100)}%` }}></div>
                </div>
                <div className="flex justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Raised</p>
                    <p className="font-bold text-lg">${featuredCampaign.raisedAmount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase">Goal</p>
                    <p className="font-bold text-lg">${featuredCampaign.goalAmount}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedCampaign(featuredCampaign)}
                  className="w-full bg-[#4b3b8c] text-white py-4 rounded font-bold hover:bg-indigo-900 transition"
                >
                  Donate Now
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Past Donations (If any) */}
        {user && pastDonations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-green-100 text-green-600 p-2 rounded-full mr-3">🔄</span> 
              Your Past Donations
            </h2>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3">Campaign</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pastDonations.map((d, i) => (
                    <tr key={i}>
                      <td className="py-3 font-medium text-gray-900">{d.campaignId?.title || 'Unknown'}</td>
                      <td className="py-3 font-bold text-green-600">${d.amount}</td>
                      <td className="py-3"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{d.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {user && recommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full mr-3">✨</span> 
              Recommended For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((campaign, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-yellow-400 p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-yellow-600 uppercase mb-1">Because you like {campaign.category}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedCampaign(campaign)}
                    className="text-[#4b3b8c] font-bold text-sm hover:underline text-left"
                  >
                    Donate &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-10 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:ring-[#4b3b8c] focus:border-[#4b3b8c]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-64 relative">
            <FaTags className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md appearance-none focus:ring-[#4b3b8c] focus:border-[#4b3b8c]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:w-64 relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md appearance-none focus:ring-[#4b3b8c] focus:border-[#4b3b8c]"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* All Campaigns Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {campaign.image ? (
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#4b3b8c] shadow-sm">
                  {campaign.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{campaign.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{campaign.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-[#4b3b8c]">${campaign.raisedAmount} <span className="font-normal text-gray-500 text-xs">raised</span></span>
                    <span className="text-gray-500 font-medium text-xs">Goal: ${campaign.goalAmount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#4b3b8c] h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500 flex items-center bg-gray-50 px-2 py-1 rounded">
                    <FaMapMarkerAlt className="mr-1 text-gray-400" />
                    {campaign.location || 'Global'}
                  </span>
                  <button 
                    onClick={() => setSelectedCampaign(campaign)}
                    className="bg-[#4b3b8c] text-white px-5 py-2 rounded-md font-bold hover:bg-indigo-900 transition shadow-sm text-sm"
                  >
                    Donate
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredCampaigns.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No campaigns found matching your filters.
            </div>
          )}
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
