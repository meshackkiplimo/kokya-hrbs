import React, { useState } from 'react'
import { type TUser, UserApi } from '../../../Features/users/userAPI';
import DeleteUser from './DeleteUser';

const ManageUsers = () => {
    const {data:usersData, isLoading, error} = UserApi.useGetUsersQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
        }
    );
    const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  return (
    <div className="p-4">
        <h2 className='text-xl font-bold mb-4'>user list</h2>

        {isLoading && <p>Loading users...</p>}
        {error && <p className='text-red-500' >Error loading users</p>}
          {usersData && usersData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr className="bg-gray-600 text-white text-md lg:text-lg">
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Verified</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user: TUser) => (
                <tr key={user.user_id} className="hover:bg-gray-300 border-b border-gray-400">
                  <td className="px-4 py-2 border-r border-gray-400">{user.first_name}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{user.last_name}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{user.email}</td>
                  <td className="px-4 py-2 border-r border-gray-400">{user.role}</td>
                  <td className="px-4 py-2 border-r border-gray-400">
                    <span className={`badge ${user.is_verified ? "badge-success" : "badge-warning"}`}>
                      {user.is_verified ? (
                        <span className="text-green-700">Verified</span>
                      ) : (
                        <span className="text-yellow-700">Not Verified</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      
                      <DeleteUser userId={user.user_id} />
                    </div>
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && <p>No users found.</p>
      )}
      
    </div>
  )
}

export default ManageUsers
