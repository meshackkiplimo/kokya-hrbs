import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { APIDomain } from "../../utils";
import type { RootState } from "../../app/store";








export type TUser = {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_verified: boolean;
}

export type Tverify={
    email: string;
    code: string;

    
}


export const userApi= createApi({
    reducerPath: 'userApi',
    baseQuery:fetchBaseQuery({
        baseUrl:APIDomain,
        prepareHeaders: (headers,{getState}) => {
            const token = (getState() as RootState).user.token
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },

    }),
    tagTypes: ['User'],
    endpoints:(builder) => ({
        createUsers: builder.mutation<TUser, Partial<TUser>>({
            query: (newUser) => ({
                url: '/auth/register',
                method: 'POST',
                body: newUser
            }),
            invalidatesTags: ['User']
        }),
        getUsers: builder.query<TUser[], void>({
            query: () => ({
                url: '/auth/users',
                method: 'GET',
            }),
           transformResponse: (response: { data: TUser[] }) => response.data,
            providesTags: ['User']
            
    }),
        verifyUser: builder.mutation<TUser, Tverify>({
            query: (verifyData) => ({
                url: '/auth/verify',
                method: 'POST',
                body: verifyData
            }),
            invalidatesTags: ['User']
        }),
        updateUser: builder.mutation<TUser, Partial<TUser>>({
            query: (userData) => ({
                url: `/auth/users/${userData.user_id}`,
                method: 'PUT',
                body: userData
            }),
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation<void, number>({
            query: (userId) => ({
                url: `/auth/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User']
        }),
    }),




})