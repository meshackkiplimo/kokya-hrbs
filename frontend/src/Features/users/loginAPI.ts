import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/utils";


export type TLoginResponse = {
    token: string;
    user: {
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    };
}

type LoginInputs = {
    email: string;
    password: string;
}

export const loginAPI = createApi({
    reducerPath: 'loginAPI',
    baseQuery: fetchBaseQuery({ baseUrl: APIDomain }),
    tagTypes: ['Login'],
    endpoints: (builder) => ({
        loginUser: builder.mutation<TLoginResponse, LoginInputs>({
            query: (loginData) => ({
                url: '/auth/login',
                method: 'POST',
                body: loginData
            }),
            invalidatesTags: ['Login']
        }),
        logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Login'],
    }),
    })

     
});


