import React, { useState } from 'react'
import { type TUser, UserApi } from '../../../Features/users/userAPI';
import DeleteUser from './DeleteUser';
import ChangeRole from './ChangeRole';
import PaginationControls from '../../../components/PaginationControls';

const ManageUsers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10); // Fixed page size for now
    const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

    const {data:usersData, isLoading, error} = UserApi.useGetUsersQuery(
        { page: currentPage, limit: pageSize },
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
        }
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
  return (
    <div className="p-4">
        <h2 className='text-xl font-bold mb-4'>User List</h2>

        {isLoading && <p>Loading users...</p>}
        {error && <p className='text-red-500' >Error loading users</p>}
        
        {usersData && usersData.users && usersData.users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table table-xs w-full">
                <thead>
                  <tr className="bg-gray-600 text-white text-md lg:text-lg">
                    <th className="px-4 py-2">First Name</th>
                    <th className="px-4 py-2">Last Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Delete User</th>
                    <th className="px-4 py-2">Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.users.map((user: TUser) => (
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
                      <td className="px-4 py-2">
                        <button
                          className="btn btn-primary bg-gray-600 text-white rounded-2xl"
                          onClick={() => {
                            setSelectedUser(user);
                            (document.getElementById('role_modal') as HTMLDialogElement)?.showModal();
                          }}
                        >
                          Change Role
                        </button>
                        <ChangeRole user={selectedUser} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <PaginationControls
              currentPage={usersData.pagination.currentPage}
              totalPages={usersData.pagination.totalPages}
              hasNextPage={usersData.pagination.hasNextPage}
              hasPreviousPage={usersData.pagination.hasPreviousPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          !isLoading && <p>No users found.</p>
        )}
        
        {/* Display pagination info */}
        {usersData && usersData.pagination && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {usersData.users.length} of {usersData.pagination.totalCount} users
          </div>
        )}
    </div>
  )
}

export default ManageUsers
