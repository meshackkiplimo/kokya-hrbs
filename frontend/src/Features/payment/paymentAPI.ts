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
        getUserPayments: builder.query<TPayment[], number>({
            query: (userId) => ({
                url: `/payments/without-pagination?user_id=${userId}`,
                method: "GET"
            }),
            providesTags: ["Payments"],
            transformResponse: (response: any) => {
                // Handle different response formats
                if (Array.isArray(response)) {
                    return response;
                }
                
                // If response has payments array (like paginated format)
                if (response?.payments && Array.isArray(response.payments)) {
                    return response.payments;
                }
                
                // If response has data array
                if (response?.data && Array.isArray(response.data)) {
                    return response.data;
                }
                
                return [];
            },
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

        // Paystack payment initialization
        initializePaystackPayment: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                authorization_url: string;
                access_code: string;
                reference: string;
            };
        }, {
            email: string;
            amount: number;
            bookingId?: number;
            metadata?: any;
        }>({
            query: (paymentData) => ({
                url: "/api/v1/paystack/initialize",
                method: "POST",
                body: paymentData,
            }),
            invalidatesTags: ["Payments"],
        }),

        // Verify Paystack payment
        verifyPaystackPayment: builder.query<{
            success: boolean;
            message: string;
            data: {
                reference: string;
                amount: number;
                status: string;
                gateway_response: string;
                paid_at: string;
                channel: string;
                customer: any;
                authorization: any;
            };
        }, string>({
            query: (reference) => ({
                url: `/api/v1/paystack/verify/${reference}`,
                method: "GET",
            }),
        }),

        // Get supported banks for Paystack
        getPaystackBanks: builder.query<{
            success: boolean;
            message: string;
            data: Array<{
                name: string;
                slug: string;
                code: string;
                longcode: string;
                gateway: string;
                pay_with_bank: boolean;
                active: boolean;
                country: string;
                currency: string;
                type: string;
                is_deleted: boolean;
            }>;
        }, void>({
            query: () => ({
                url: "/api/v1/paystack/banks",
                method: "GET",
            }),
        }),

        // Validate bank account for Paystack
        validatePaystackAccount: builder.mutation<{
            success: boolean;
            message: string;
            data: {
                account_number: string;
                account_name: string;
                bank_id: number;
            };
        }, {
            account_number: string;
            bank_code: string;
        }>({
            query: (accountData) => ({
                url: "/api/v1/paystack/validate-account",
                method: "POST",
                body: accountData,
            }),
        }),

        // Test Paystack service
        testPaystackService: builder.query<{
            success: boolean;
            message: string;
            data: {
                public_key: string;
                secret_key: string;
                callback_url: string;
                webhook_url: string;
            };
        }, void>({
            query: () => ({
                url: "/api/v1/paystack/test",
                method: "GET",
            }),
        }),
        
    }),
        
    
})

export const {
    useCreatePaymentMutation,
    useGetPaymentsQuery,
    useGetAllPaymentsQuery,
    useGetUserPaymentsQuery,
    useUpdatePaymentStatusMutation,
    useDeletePaymentMutation,
    useInitiateMpesaPaymentMutation,
    useCheckMpesaPaymentStatusQuery,
    useTestMpesaServiceQuery,
    useInitializePaystackPaymentMutation,
    useVerifyPaystackPaymentQuery,
    useGetPaystackBanksQuery,
    useValidatePaystackAccountMutation,
    useTestPaystackServiceQuery,
} = paymentApi;