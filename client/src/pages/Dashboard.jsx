import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [data, setData] = useState({
    donations: [],
    applications: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const [donationsRes, appsRes, recsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/donations/me', config).catch(() => ({ data: [] })),
          axios.get('http://localhost:5001/api/volunteer/me', config).catch(() => ({ data: [] })),
          axios.get('http://localhost:5001/api/recommendations', config).catch(() => ({ data: [] }))
        ]);

        setData({
          donations: donationsRes.data,
          applications: appsRes.data,
          recommendations: recsRes.data
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return <div className="text-center py-20">Please log in to view dashboard</div>;
  if (loading) return <div className="text-center py-20">Loading your dashboard...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-6">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 space-x-8">
          {['recommendations', 'donations', 'volunteering'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-lg font-medium capitalize ${
                activeTab === tab 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'recommendations' ? '✨ AI Recommendations' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'recommendations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.recommendations.length > 0 ? data.recommendations.map((campaign, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow p-6 border-t-4 border-yellow-400">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{campaign.title}</h3>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                      Match Score: {campaign.matchScore || 'Top'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Category: {campaign.category}</span>
                </motion.div>
              )) : (
                <p className="text-gray-500 col-span-3">No personalized recommendations yet. Try updating your skills and interests!</p>
              )}
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {data.donations.length > 0 ? data.donations.map((d, i) => (
                  <li key={i} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 truncate">{d.campaignId?.title || 'Unknown Campaign'}</p>
                      <p className="text-sm text-gray-500 mt-1">Status: <span className="capitalize">{d.status}</span></p>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ${d.amount}
                    </div>
                  </li>
                )) : <li className="px-6 py-4 text-gray-500">No donations made yet.</li>}
              </ul>
            </div>
          )}

          {activeTab === 'volunteering' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {data.applications.length > 0 ? data.applications.map((app, i) => (
                  <li key={i} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-green-600">{app.campaignId?.title || 'Unknown Campaign'}</p>
                      <p className="text-xs text-gray-500 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </li>
                )) : <li className="px-6 py-4 text-gray-500">No volunteer applications found.</li>}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
