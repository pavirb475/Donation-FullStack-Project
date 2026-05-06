import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaChartPie, FaBullhorn, FaUsers, FaDonate, FaHandsHelping, FaUserCircle, FaSignOutAlt, FaEdit, FaTrash } from 'react-icons/fa';

const Admin = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState({ totalUsers: 0, totalCampaigns: 0, totalDonations: 0, totalVolunteers: 0, totalRevenue: 0 });
  const [campaigns, setCampaigns] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  // Form states
  const [formData, setFormData] = useState({ title: '', description: '', category: '', location: '', goalAmount: '', image: '', campaignType: 'combined' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const [statsRes, campRes, usersRes, donRes, volRes] = await Promise.all([
          axios.get('http://localhost:5001/api/admin/stats', config).catch(() => ({ data: {} })),
          axios.get('http://localhost:5001/api/campaigns').catch(() => ({ data: [] })),
          axios.get('http://localhost:5001/api/admin/users', config).catch(() => ({ data: [] })),
          axios.get('http://localhost:5001/api/donations', config).catch(() => ({ data: [] })),
          axios.get('http://localhost:5001/api/volunteer', config).catch(() => ({ data: [] }))
        ]);

        setStats(statsRes.data);
        setCampaigns(campRes.data);
        setUsersList(usersRes.data);
        setDonations(donRes.data);
        setVolunteers(volRes.data);
      } catch (err) {
        console.error("Error fetching admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user]);

  const handleSubmitCampaign = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (editingId) {
        // Edit Mode
        const { data } = await axios.put(`http://localhost:5001/api/campaigns/${editingId}`, formData, config);
        setCampaigns(campaigns.map(c => c._id === editingId ? data : c));
        alert("Campaign updated successfully!");
      } else {
        // Create Mode
        const { data } = await axios.post('http://localhost:5001/api/campaigns', formData, config);
        setCampaigns([data, ...campaigns]);
        alert("Campaign created successfully!");
      }
      
      setFormData({ title: '', description: '', category: '', location: '', goalAmount: '', image: '', campaignType: 'combined' });
      setEditingId(null);
    } catch (err) {
      alert(editingId ? "Error updating campaign" : "Error creating campaign");
    }
  };

  const handleEditClick = (campaign) => {
    setFormData({
      title: campaign.title,
      description: campaign.description,
      category: campaign.category,
      location: campaign.location || '',
      goalAmount: campaign.goalAmount,
      image: campaign.image || '',
      campaignType: campaign.campaignType || 'combined'
    });
    setEditingId(campaign._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ title: '', description: '', category: '', location: '', goalAmount: '', image: '', campaignType: 'combined' });
    setEditingId(null);
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5001/api/campaigns/${id}`, config);
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (err) {
      alert("Error deleting campaign");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full border-t-4 border-red-500">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be an administrator to view this control panel.</p>
          <button onClick={() => navigate('/login')} className="w-full bg-indigo-600 text-white font-bold py-2 rounded">Go to Login</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const SidebarItem = ({ icon: Icon, label, id }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center px-6 py-4 text-left transition-colors ${activeTab === id ? 'bg-indigo-700 border-l-4 border-white font-bold' : 'hover:bg-indigo-800 border-l-4 border-transparent'}`}
    >
      <Icon className="mr-3 text-lg" /> {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col shadow-2xl flex-shrink-0">
        <div className="p-6 bg-indigo-950 flex items-center justify-center">
          <span className="text-2xl font-extrabold tracking-widest text-indigo-100">ADMIN<span className="text-indigo-400">PANEL</span></span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarItem icon={FaChartPie} label="Dashboard" id="dashboard" />
          <SidebarItem icon={FaBullhorn} label="Manage Campaigns" id="campaigns" />
          <SidebarItem icon={FaUsers} label="Users" id="users" />
          <SidebarItem icon={FaDonate} label="Donations" id="donations" />
          <SidebarItem icon={FaHandsHelping} label="Volunteers" id="volunteers" />
        </div>
        <div className="p-4 border-t border-indigo-800">
          <SidebarItem icon={FaUserCircle} label="Profile" id="profile" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h1>
          <div className="flex items-center">
            <span className="mr-4 text-sm font-medium text-gray-600">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-md font-medium transition">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </header>

        <main className="p-8">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <div><p className="text-sm font-medium text-gray-500 uppercase">Total Users</p><p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p></div>
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><FaUsers size={24} /></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <div><p className="text-sm font-medium text-gray-500 uppercase">Total Revenue</p><p className="text-3xl font-bold text-gray-900">${stats.totalRevenue}</p></div>
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><FaDonate size={24} /></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                  <div className="flex justify-between items-center">
                    <div><p className="text-sm font-medium text-gray-500 uppercase">Volunteers</p><p className="text-3xl font-bold text-gray-900">{stats.totalVolunteers}</p></div>
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><FaHandsHelping size={24} /></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                  <div className="flex justify-between items-center">
                    <div><p className="text-sm font-medium text-gray-500 uppercase">Campaigns</p><p className="text-3xl font-bold text-gray-900">{stats.totalCampaigns}</p></div>
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><FaBullhorn size={24} /></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">System Overview</h3>
                <p className="text-gray-600 mb-4">Welcome to the central control panel. From here you can manage all entities within the platform.</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setActiveTab('campaigns')} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition">
                    <h4 className="font-bold text-indigo-700">Quick Action: Manage Campaigns</h4>
                    <p className="text-sm text-gray-500 mt-1">Publish a new donation or volunteer drive.</p>
                  </button>
                  <button onClick={() => setActiveTab('donations')} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition">
                    <h4 className="font-bold text-green-700">Quick Action: View Finances</h4>
                    <p className="text-sm text-gray-500 mt-1">Monitor recent donation transactions.</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CAMPAIGNS TAB */}
          {activeTab === 'campaigns' && (
            <div className="space-y-8">
              {/* Form (Create or Edit) */}
              <div className={`bg-white rounded-xl shadow-sm p-6 border-t-4 ${editingId ? 'border-yellow-500' : 'border-indigo-500'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingId ? 'Edit Campaign' : 'Publish New Campaign'}
                  </h2>
                  {editingId && (
                    <button onClick={handleCancelEdit} className="text-sm font-bold text-gray-500 hover:text-gray-800">Cancel Edit</button>
                  )}
                </div>
                <form onSubmit={handleSubmitCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" required className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input type="text" required className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount ($)</label><input type="number" required className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.goalAmount} onChange={e => setFormData({...formData, goalAmount: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Purpose</label>
                    <select 
                      className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      value={formData.campaignType} 
                      onChange={e => setFormData({...formData, campaignType: e.target.value})}
                    >
                      <option value="combined">Combined (Both Donations & Volunteers)</option>
                      <option value="donation">Donation Only</option>
                      <option value="volunteer">Volunteer Only</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input type="url" placeholder="https://..." className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} /></div>

                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea required rows="3" className="w-full border-gray-300 rounded-md border p-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className={`${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 px-6 rounded-md font-bold shadow-md transition`}>
                      {editingId ? 'Save Changes' : 'Create Campaign'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h2 className="text-xl font-bold text-gray-800">Active Campaigns</h2></div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type / Category</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.map(c => (
                        <tr key={c._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-gray-900">{c.title}</div>
                            <div className="text-sm text-gray-500">{c.location || 'Global'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 max-w-[150px]"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min((c.raisedAmount / c.goalAmount) * 100, 100)}%` }}></div></div>
                            <div className="text-xs text-gray-500">${c.raisedAmount} / ${c.goalAmount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex flex-col items-start gap-1">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">{c.category}</span>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">{c.campaignType || 'combined'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button onClick={() => handleEditClick(c)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded inline-flex items-center" title="Edit"><FaEdit /></button>
                            <button onClick={() => handleDeleteCampaign(c._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded inline-flex items-center" title="Delete"><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h2 className="text-xl font-bold text-gray-800">Registered Users</h2></div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Skills / Interests</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersList.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="truncate max-w-[200px]">{u.skills?.join(', ') || 'None'}</div>
                          <div className="truncate max-w-[200px] text-xs text-indigo-500">{u.interests?.join(', ') || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DONATIONS TAB */}
          {activeTab === 'donations' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h2 className="text-xl font-bold text-gray-800">Donation Transactions</h2></div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Donor</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map(d => (
                      <tr key={d._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.userId?.name || 'Unknown Donor'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{d.campaignId?.title || 'Unknown Campaign'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">${d.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{d.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VOLUNTEERS TAB */}
          {activeTab === 'volunteers' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h2 className="text-xl font-bold text-gray-800">Volunteer Applications</h2></div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date Applied</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {volunteers.map(v => (
                      <tr key={v._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.userId?.name || 'Unknown User'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{v.campaignId?.title || 'Unknown Campaign'}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 capitalize">{v.status}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(v.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <FaUserCircle size={48} />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <span className="mt-2 inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full uppercase">Administrator</span>
                </div>
              </div>
              <hr className="my-6" />
              <button onClick={handleLogout} className="bg-red-50 text-red-600 font-bold py-2 px-6 rounded-md hover:bg-red-100 transition border border-red-200">
                Log Out of Admin Panel
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Admin;
