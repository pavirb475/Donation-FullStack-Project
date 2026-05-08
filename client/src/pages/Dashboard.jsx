import { useState, useEffect, useContext } from 'react';
import axios from 'axios';// API requests to backend
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';// animations 

const Dashboard = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('recommendations');//default tab 
  const [data, setData] = useState({
    donations: [],
    applications: [],
    recommendations: []
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    bloodGroup: '',
    skills: '',
    interests: '',
    experience: '',
    resume: '',
  });

  // Sync profile form when user object is available
  useEffect(() => {//automatically fill using logged-in userdata
    if (user) {
      setProfileForm({
        name: user.name || '',//Use user name or empty string if undefined
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        location: user.location || '',
        bloodGroup: user.bloodGroup || '',
        skills: user.skills?.join(', ') || '',
        interests: user.interests?.join(', ') || '',// Convert interests array into comma-separated string
        experience: user.experience || '',
        resume: user.resume || '',
      });
    }
  }, [user]);

  const [profileMsg, setProfileMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const isProfileComplete = user?.skills?.length > 0 || user?.interests?.length > 0 || user?.bloodGroup || user?.experience;//enable AI recommendations

  useEffect(() => {//fetch data from backend
    const fetchDashboardData = async () => {
      if (!user) return;//stop if no logged in user
      
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const [donationsRes, appsRes, recsRes] = await Promise.all([//fetch all api
          axios.get('http://localhost:5001/api/donations/me', config).catch(() => ({ data: [] })),
          axios.get('http://localhost:5001/api/volunteer/me', config).catch(() => ({ data: [] })),
          axios.get('http://localhost:5001/api/recommendations', config).catch(() => ({ data: [] }))
        ]);

        setData({//save
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
  }, [user]);//user changes

  const handleProfileUpdate = async (e) => {//fn trigger when pf is sub
    e.preventDefault();
    setProfileMsg('Updating...');
    const formattedData = {
      ...profileForm,
      skills: profileForm.skills.split(',').map(s => s.trim()).filter(s => s),//conv str>>arry
      interests: profileForm.interests.split(',').map(s => s.trim()).filter(s => s),
    };
    const result = await updateProfile(formattedData);
    if (result.success) {
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } else {
      setProfileMsg(result.message);//error msg back
    }
  };

  if (!user) return <div className="text-center py-20">Please log in to view dashboard</div>;
  if (loading) return <div className="text-center py-20">Loading your dashboard...</div>;

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-2xl font-bold mr-6">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 space-x-8">
          {['recommendations', 'donations', 'volunteering', 'profile'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-lg font-medium capitalize ${
                activeTab === tab 
                  ? 'border-b-2 border-amber-600 text-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'recommendations' ? 'AI Recommendations' : tab === 'profile' ? 'Edit Profile' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'recommendations' && (
            <div>
              {!isProfileComplete ? (
                <div className="bg-white rounded-xl shadow p-10 text-center border-t-4 border-amber-500">
                  <div className="text-6xl mb-4">.</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock AI Recommendations</h2>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    To provide you with the most personalized campaign and volunteering recommendations, our AI needs to know a little bit more about you.
                  </p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition shadow-lg"
                  >
                    Complete Your Profile Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.recommendations.length > 0 ? data.recommendations.map((campaign, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow p-6 border-t-4 border-yellow-400">
                      <div className="text-xs font-bold text-yellow-600 uppercase mb-2">{campaign.matchReason}</div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{campaign.title}</h3>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                          Match Score: {campaign.matchScore || 'Top'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                      <span className="text-xs text-gray-500 bg-stone-100 px-2 py-1 rounded">Category: {campaign.category}</span>
                    </motion.div>
                  )) : (
                    <p className="text-gray-500 col-span-3">No personalized recommendations yet. Try updating your skills and interests!</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {data.donations.length > 0 ? data.donations.map((d, i) => (
                  <li key={i} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600 truncate">{d.campaignId?.title || 'Unknown Campaign'}</p>
                      <p className="text-sm text-gray-500 mt-1">Status: <span className="capitalize">{d.status}</span></p>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ₹{d.amount}
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
                      <p className="text-sm font-medium text-emerald-600">{app.campaignId?.title || 'Unknown Campaign'}</p>
                      <p className="text-xs text-gray-500 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </li>
                )) : <li className="px-6 py-4 text-gray-500">No volunteer applications found.</li>}
              </ul>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>
              {profileMsg && (
                <div className={`mb-4 p-3 rounded ${profileMsg.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-gray-700'}`}>
                  {profileMsg}
                </div>
              )}
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-amber-500 focus:ring-amber-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Cannot be changed)</label>
                    <input type="email" value={profileForm.email} disabled className="w-full border-gray-200 bg-gray-50 rounded-md shadow-sm p-2 border text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="text" value={profileForm.phoneNumber} onChange={e => setProfileForm({...profileForm, phoneNumber: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-amber-500 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-amber-500 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <select value={profileForm.bloodGroup} onChange={e => setProfileForm({...profileForm, bloodGroup: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-amber-500 focus:ring-amber-500 bg-white">
                      <option value="">Select Blood Group...</option>
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <input type="text" placeholder="e.g. 2 years medical camp volunteer" value={profileForm.experience} onChange={e => setProfileForm({...profileForm, experience: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-amber-500 focus:ring-amber-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                    <input type="text" value={profileForm.skills} onChange={e => setProfileForm({...profileForm, skills: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-amber-500 focus:ring-amber-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interests (comma separated)</label>
                    <input type="text" value={profileForm.interests} onChange={e => setProfileForm({...profileForm, interests: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-amber-500 focus:ring-amber-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link (Optional)</label>
                    <input type="url" placeholder="https://linkedin.com/in/you or Google Drive Link" value={profileForm.resume} onChange={e => setProfileForm({...profileForm, resume: e.target.value})} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-amber-500 focus:ring-amber-500" />
                  </div>
                </div>
                <div>
                  <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-md font-bold hover:bg-amber-700 transition">Save Profile Data</button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
