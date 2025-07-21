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
export type TPaginationInfo = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export type TPaymentResponse = {
    payments: TPayment[];
    pagination: TPaginationInfo;
}
export type TPaginationParams = {
    page?: number;
    limit?: number;
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
        getPayments: builder.query<TPaymentResponse, TPaginationParams>({
            query: ({page=1,limit=10}) => ({
                url: "/payments",
                params: { page, limit }
            }),
            providesTags: ["Payments"],
        }),
        getAllPayments: builder.query<TPayment[], void>({
            query: () => "/payments/without-pagination",
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
        deletePayment: builder.mutation<void, number>({
            query: (paymentId) => ({
                url: `/payments/${paymentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Payments"],
        }),

        // MPESA STK Push initiation
        initiateMpesaPayment: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                MerchantRequestID: string;
                CheckoutRequestID: string;
                ResponseCode: string;
                ResponseDescription: string;
            };
        }, {
            phone: string;
            amount: number;
            bookingId?: number;
            accountReference?: string;
            transactionDesc?: string;
        }>({
            query: (paymentData) => ({
                url: "/mpesa/stk-push",
                method: "POST",
                body: paymentData,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Check MPESA payment status
        checkMpesaPaymentStatus: builder.query<{
            success: boolean;
            data: any;
        }, string>({
            query: (checkoutRequestId) => ({
                url: `/mpesa/status/${checkoutRequestId}`,
                method: "GET",
            }),
        }),

        // Test MPESA service
        testMpesaService: builder.query<{
            success: boolean;
            message: string;
            environment: string;
            shortcode: string;
        }, void>({
            query: () => ({
                url: "/mpesa/test",
                method: "GET",
            }),
        }),
        
    }),
        
    
})

export const {
    useCreatePaymentMutation,
    useGetPaymentsQuery,
    useGetAllPaymentsQuery,
    useUpdatePaymentStatusMutation,
    useDeletePaymentMutation,
    useInitiateMpesaPaymentMutation,
    useCheckMpesaPaymentStatusQuery,
    useTestMpesaServiceQuery,
} = paymentApi;