import { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaToolbox, FaGlobe, FaTimes } from 'react-icons/fa';

const Volunteer = () => {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isProfileComplete = user?.skills?.length > 0 || user?.interests?.length > 0 || user?.bloodGroup || user?.experience;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const [selectedOpp, setSelectedOpp] = useState(null); // For Detail Modal

  // Mock data generator for volunteer specific fields
  const addMockVolunteerData = (camp) => {
    const skills = {
      'Education': ['Teaching', 'Mentoring', 'Communication'],
      'Health': ['Medical', 'First Aid', 'Caregiving'],
      'Disaster Relief': ['Logistics', 'Physical Work', 'Coordination']
    };
    const types = ['On-site', 'Remote', 'Hybrid'];
    
    return {
      ...camp,
      requiredSkills: skills[camp.category] || ['General Help', 'Teamwork'],
      duration: `${Math.floor(Math.random() * 4) + 1} weeks`,
      type: types[Math.floor(Math.random() * types.length)],
      matchScore: Math.floor(Math.random() * 20) + 80 // 80-99%
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campRes = await axios.get('http://localhost:5001/api/campaigns');
        // Only show volunteer or combined campaigns
        const volCampaigns = campRes.data.filter(c => c.campaignType !== 'donation');
        const formattedCampaigns = volCampaigns.map(addMockVolunteerData);
        setCampaigns(formattedCampaigns);

        if (user) {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const recRes = await axios.get('http://localhost:5001/api/recommendations', config).catch(() => ({ data: [] }));
          setRecommendations(recRes.data.filter(c => c.campaignType !== 'donation').map(addMockVolunteerData));
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleApply = async (campaignId) => {
    if (!user) {
      alert("Please login first to volunteer!");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5001/api/volunteer', { campaignId }, config);
      alert('Successfully applied to volunteer!');
      setSelectedOpp(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const allSkills = useMemo(() => [...new Set(campaigns.flatMap(c => c.requiredSkills))], [campaigns]);
  const locations = useMemo(() => [...new Set(campaigns.map(c => c.location).filter(Boolean))], [campaigns]);
  const types = useMemo(() => [...new Set(campaigns.map(c => c.type))], [campaigns]);

  const filteredCampaigns = campaigns.filter(c => {
    return (
      (c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSkill ? c.requiredSkills.includes(selectedSkill) : true) &&
      (selectedLocation ? c.location === selectedLocation : true) &&
      (selectedType ? c.type === selectedType : true)
    );
  });

  if (loading) return <div className="text-center py-20 text-xl">Loading opportunities...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-stone-50 min-h-screen pb-12">
      
      {/* Hero Header */}
      <section className="bg-orange-500 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Be the Change You Want to See</h1>
          <p className="text-lg md:text-xl text-orange-50 max-w-2xl mx-auto">
            Find volunteer opportunities that match your skills. Join hands with NGOs and make a real impact in your community.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Search & Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by keyword (e.g. teaching, medical)" 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-48 relative">
            <FaToolbox className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md appearance-none bg-white"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="">All Skills</option>
              {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="md:w-48 relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md appearance-none bg-white"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="md:w-48 relative">
            <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md appearance-none bg-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* AI Recommendations */}
        {user && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Opportunities For You
            </h2>

            {!isProfileComplete ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <p>We'd love to suggest volunteer roles tailored to your skills! Please complete your profile in the Dashboard to unlock AI recommendations.</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <p>We couldn't find any perfect matches for your unique profile right now. Feel free to scroll down and explore all of our wonderful volunteer opportunities!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.slice(0, 3).map((opp, index) => {
                  
                  // Calculate the true reason for the match to display
                  const matchingSkills = user.skills?.filter(skill => 
                    opp.requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                  );
                  
                  let matchReason = '';
                  if (matchingSkills && matchingSkills.length > 0) {
                    matchReason = `Because you have "${matchingSkills[0]}" skill`;
                  } else if (user.interests && user.interests.includes(opp.category)) {
                    matchReason = `Because you like ${opp.category}`;
                  } else if (user.location && user.location.toLowerCase() === (opp.location || '').toLowerCase()) {
                    matchReason = `Because it is in your location`;
                  } else {
                    matchReason = `Recommended Opportunity`;
                  }

                  return (
                    <div key={index} className="bg-white rounded-xl shadow border-t-4 border-yellow-400 p-5 relative">
                      <div className="text-xs font-bold text-yellow-600 uppercase mb-2">{matchReason}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{opp.title}</h3>
                      <div className="text-sm text-gray-500 mb-4 flex items-center">
                        <FaMapMarkerAlt className="mr-1" /> {opp.location || 'Global'}
                      </div>
                      <button 
                        onClick={() => setSelectedOpp(opp)}
                        className="w-full bg-yellow-50 text-yellow-700 font-bold py-2 rounded border border-yellow-200 hover:bg-yellow-100 transition"
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* All Opportunities List */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((opp, index) => (
            <motion.div
              key={opp._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{opp.title}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded ${opp.type === 'Remote' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-gray-700'}`}>
                  {opp.type}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{opp.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2 text-orange-600" />
                  {opp.location || 'Global'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaToolbox className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="truncate">Skills: {opp.requiredSkills.join(', ')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Duration: {opp.duration}
                </div>
              </div>

              <button 
                onClick={() => setSelectedOpp(opp)}
                className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-md hover:bg-orange-700 transition"
              >
                View Details & Apply
              </button>
            </motion.div>
          ))}
          {filteredCampaigns.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No opportunities found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-orange-700 p-6 text-white flex justify-between items-start">
              <div>
                <span className="bg-orange-600 px-2 py-1 rounded text-xs font-bold mb-3 inline-block">{selectedOpp.category}</span>
                <h3 className="text-2xl font-bold leading-tight">{selectedOpp.title}</h3>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="text-orange-200 hover:text-white p-1">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-2">About this Role</h4>
              <p className="text-gray-600 mb-6 whitespace-pre-line">{selectedOpp.description}</p>
              
              <div className="bg-stone-50 rounded-lg p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Organizer Info</p>
                  <p className="text-sm font-medium text-gray-900">Hope Foundation NGO</p>
                  <p className="text-xs text-teal-600">Verified Partner ✓</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Location / Type</p>
                  <p className="text-sm font-medium text-gray-900">{selectedOpp.location || 'Global'} • {selectedOpp.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Time Commitment</p>
                  <p className="text-sm font-medium text-gray-900">{selectedOpp.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Required Skills</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedOpp.requiredSkills.map(s => (
                      <span key={s} className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-stone-50 flex justify-end">
              <button onClick={() => setSelectedOpp(null)} className="px-6 py-2 text-gray-600 font-bold mr-4 hover:text-gray-900">Cancel</button>
              <button 
                onClick={() => handleApply(selectedOpp._id)}
                className="bg-orange-600 text-white px-8 py-3 rounded-md font-bold shadow-md hover:bg-orange-700 hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Volunteer;
