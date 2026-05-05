import { useState, useEffect } from 'react';
import { usersApi } from '../api/users';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (confirm(`Change user to ${newRole}?`)) {
      try {
        await usersApi.changeRole(userId, newRole);
        fetchUsers();
      } catch (err) {
        alert('Failed to change role');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield size={24} className="text-primary-600" />
          User Management
        </h1>
        <p className="text-gray-500 mt-1">Manage global system access roles.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Global Role
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'ADMIN' ? <ShieldAlert size={12} className="mr-1" /> : <ShieldCheck size={12} className="mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {currentUser.id !== user.id && (
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="ml-4 text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white px-2 py-1 border"
                      >
                        <option value="MEMBER">Make Member</option>
                        <option value="ADMIN">Make Admin</option>
                      </select>
                    )}
                    {currentUser.id === user.id && (
                      <span className="text-gray-400 italic text-xs mr-2">(You)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
