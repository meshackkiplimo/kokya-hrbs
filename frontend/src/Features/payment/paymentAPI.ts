import { createApi } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/utils";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { RootState } from "../../app/store";





export type TPayment = {
    payment_id: number ;
    booking_id: number;
    user_id: number;
    amount: number;
    payment_method: string;
    payment_status: string;
    transaction_id: string;
    payment_date: string;


}


export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: APIDomain,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token; // ✅ get token from Redux
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Payments"],
    endpoints: (builder) => ({
        createPayment: builder.mutation<TPayment, Partial<TPayment>>({
            query: (newPayment) => ({
                url: "/payments",
                method: "POST",
                body: newPayment,
            }),
            invalidatesTags: ["Payments"],
        }),
        getPayments: builder.query<TPayment[], void>({
            query: () => "/payments",
            transformResponse: (response: { data: TPayment[] }) => response.data,
            
            providesTags: ["Payments"],
        }),
        updatePaymentStatus: builder.mutation<TPayment, { payment_id: number; status: string }>({
            query: ({ payment_id, status }) => ({
                url: `/payments/${payment_id}`,
                method: "PATCH",
                body: { payment_status: status },
            }),
            invalidatesTags: ["Payments"],
        }),
    }),
        
    
})