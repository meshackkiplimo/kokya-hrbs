import React from 'react'
import { UserApi } from '../../../Features/users/userAPI';


interface DeleteUserProps {
    userId: number;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ userId }) => {
    const [deleteUser] = UserApi.useDeleteUserMutation();
  
    const handleDelete = async (userId: number) => {
        try {
            await deleteUser(userId).unwrap();
          

            // Optionally, you can show a success message or update the UI
            console.log("User deleted successfully");
        } catch (error) {
            console.error("Failed to delete user:", error);
            // Optionally, show an error message
        }
    };
  return (
    <div>
        {/* Mobile responsive dialog */}
        <dialog id="delete_user_modal" className="modal modal-bottom sm:modal-middle z-[60]">
            <div className="modal-box bg-red-50 border border-red-200 w-11/12 max-w-md mx-auto my-8">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-red-800">Delete User</h3>
                        <p className="text-sm text-red-600">This action cannot be undone</p>
                    </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                    Are you sure you want to permanently delete this user? All associated data will be removed.
                </p>
                
                <div className="modal-action flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                        className="btn bg-red-600 hover:bg-red-700 text-white border-none w-full sm:w-auto order-2 sm:order-1"
                        onClick={() => {
                            handleDelete(userId);
                            (document.getElementById('delete_user_modal') as HTMLDialogElement)?.close();
                        }}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete User
                    </button>
                    <button
                        className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 w-full sm:w-auto order-1 sm:order-2"
                        onClick={() => (document.getElementById('delete_user_modal') as HTMLDialogElement)?.close()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
            
            {/* Modal backdrop */}
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
        
        <button
            className="btn bg-red-600 hover:bg-red-700 text-white border-none rounded-lg w-full sm:w-auto"
            onClick={() => (document.getElementById('delete_user_modal') as HTMLDialogElement)?.showModal()}
        >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Delete User
        </button>
    </div>
  )
}

export default DeleteUser
