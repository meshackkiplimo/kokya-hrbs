import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useEffect } from "react";
import { UserApi,  type TUser } from "../../../Features/users/userAPI";

type ChangeRoleProps = {
    user: TUser | null;
};

type ChangeRoleInputs = {
    role: "user" | "admin";
};

const schema = yup.object({
    role: yup.string().oneOf(["user", "admin"]).required("Role is required"),
});

const ChangeRole = ({ user }: ChangeRoleProps) => {
    const [updateUser, { isLoading }] = UserApi.useUpdateUserRoleMutation(
        { fixedCacheKey: "updateUser" }
    );
  

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ChangeRoleInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            role: user ? (user.role as "user" | "admin") : "user", // Default to user's current role or "user"
        },
    });

    // Update form value when user changes
    // (so the modal always shows the correct role)
    useEffect(() => {
        if (user) {
            setValue("role", user.role as "user" | "admin"); // Set the role based on the user object
        } else {
            reset();
        }
    }, [user, setValue, reset]);

    const onSubmit: SubmitHandler<ChangeRoleInputs> = async (data) => {
        try {
            if (!user) {
              
                return;
            }
            await updateUser({ id: user.user_id, role: data.role })
           
          
            reset();
            (document.getElementById('role_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error updating role:", error);
           
        }
    };

    return (
        <dialog id="role_modal" className="modal modal-bottom sm:modal-middle z-[60]">
            <div className="modal-box bg-gray-600 text-white w-11/12 max-w-xs sm:max-w-lg mx-auto my-8 rounded-lg">
                <h3 className="font-bold text-lg mb-4">
                    Change Role for {user?.first_name} {user?.last_name}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <label className="text-white font-semibold">Select Role:</label>
                    <select
                        {...register("role")}
                        className="select select-bordered w-full bg-white text-black dark:bg-gray-200 dark:text-black"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && (
                        <span className="text-sm text-red-700">{errors.role.message}</span>
                    )}

                    <div className="modal-action flex flex-col sm:flex-row gap-2">
                        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner text-primary" /> Updating...
                                </>
                            ) : "Update Role"}
                        </button>
                        <button
                            className="btn w-full sm:w-auto"
                            type="button"
                            onClick={() => {
                                (document.getElementById('role_modal') as HTMLDialogElement)?.close();
                                reset();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ChangeRole;