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
        {/* use dialog */}
        <dialog id="delete_user_modal" className="modal">
            <form method="dialog" className="modal-box bg-amber-700">
                <h3 className="font-bold text-lg">Delete User</h3>
                <p>Are you sure you want to delete this user?</p>
                <div className="modal-action">
                    <button
                        className="btn btn-error bg-amber-700"
                        onClick={() => handleDelete(userId)}
                    >
                        Delete
                    </button>
                    <button className="btn">Cancel</button>
                </div>
            </form>
        </dialog>
        <button
            className="btn btn-error bg-amber-700 rounded-2xl"
            onClick={() => (document.getElementById('delete_user_modal') as HTMLDialogElement)?.showModal()}
        >
            Delete User
        </button>
      
    </div>
  )
}

export default DeleteUser
