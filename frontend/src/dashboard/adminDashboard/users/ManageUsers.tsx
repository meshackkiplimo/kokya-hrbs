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

    // Mobile Card Component
    const UserCard = ({ user }: { user: TUser }) => (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                        {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <span className={`badge text-xs px-2 py-1 rounded-full ${
                        user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                        {user.role}
                    </span>
                    <span className={`badge text-xs px-2 py-1 rounded-full ${
                        user.is_verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {user.is_verified ? 'Verified' : 'Not Verified'}
                    </span>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    onClick={() => {
                        setSelectedUser(user);
                        (document.getElementById('role_modal') as HTMLDialogElement)?.showModal();
                    }}
                >
                    Change Role
                </button>
                <div className="flex-1">
                    <DeleteUser userId={user.user_id} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-3 md:p-6">
            <h2 className='text-xl md:text-2xl font-bold mb-4 md:mb-6'>User List</h2>

            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Loading users...</span>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    Error loading users
                </div>
            )}
            
            {usersData && usersData.users && usersData.users.length > 0 ? (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block">
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
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden">
                        {usersData.users.map((user: TUser) => (
                            <UserCard key={user.user_id} user={user} />
                        ))}
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="mt-6">
                        <PaginationControls
                            currentPage={usersData.pagination.currentPage}
                            totalPages={usersData.pagination.totalPages}
                            hasNextPage={usersData.pagination.hasNextPage}
                            hasPreviousPage={usersData.pagination.hasPreviousPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            ) : (
                !isLoading && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No users found.</p>
                    </div>
                )
            )}
            
            {/* Display pagination info */}
            {usersData && usersData.pagination && (
                <div className="mt-4 text-sm text-gray-600">
                    Showing {usersData.users.length} of {usersData.pagination.totalCount} users
                </div>
            )}

            {/* Change Role Modal Component */}
            <ChangeRole user={selectedUser} />
        </div>
    )
}

export default ManageUsers
