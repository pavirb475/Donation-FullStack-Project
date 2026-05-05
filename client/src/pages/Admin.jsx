import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating campaign
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', location: '', goalAmount: '', image: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'admin') return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [campRes, donRes] = await Promise.all([
          axios.get('http://localhost:5001/api/campaigns'),
          axios.get('http://localhost:5001/api/donations', config).catch(() => ({ data: [] }))
        ]);
        setCampaigns(campRes.data);
        setDonations(donRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:5001/api/campaigns', formData, config);
      setCampaigns([...campaigns, data]);
      setFormData({ title: '', description: '', category: '', location: '', goalAmount: '', image: '' });
      alert("Campaign created successfully!");
    } catch (err) {
      alert("Error creating campaign");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5001/api/campaigns/${id}`, config);
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (err) {
      alert("Error deleting campaign");
    }
  };

  if (!user || user.role !== 'admin') return <div className="text-center py-20 text-red-500 font-bold">Access Denied. Admins only.</div>;
  if (loading) return <div className="text-center py-20">Loading admin data...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Create Campaign Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 border-t-4 border-indigo-500">
          <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" required className="border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input type="text" placeholder="Category" required className="border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            <input type="number" placeholder="Goal Amount" required className="border p-2 rounded" value={formData.goalAmount} onChange={e => setFormData({...formData, goalAmount: e.target.value})} />
            <input type="text" placeholder="Location" className="border p-2 rounded" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <input type="url" placeholder="Image URL" className="border p-2 rounded" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            <textarea placeholder="Description" required className="border p-2 rounded md:col-span-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 md:col-span-2 font-bold">Publish Campaign</button>
          </form>
        </div>

        {/* Manage Campaigns */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Manage Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map(c => (
                  <tr key={c._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${c.goalAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${c.raisedAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
