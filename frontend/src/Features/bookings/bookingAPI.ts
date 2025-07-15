import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/utils";
import type { RootState } from "../../app/store";







export type TBooking = {
    booking_id: number;
    user_id: number;
    hotel_id: number;
    room_id: number;
    check_in_date: string;
    check_out_date: string;
    total_amount: number;
    status: string;
    
}

export const bookingApi = createApi({
    reducerPath: "bookingApi",
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
    tagTypes: ["Bookings"],
    endpoints: (builder) => ({
        createBooking: builder.mutation<TBooking, Partial<TBooking>>({
            query: (newBooking) => ({
                url: "/bookings",
                method: "POST",
                body: newBooking,
            }),
            invalidatesTags: ["Bookings"],
        }),
        getBookings: builder.query<TBooking[], void>({
            query: () => "/bookings",
            transformResponse: (response: { data: TBooking[] }) => response.data,
            providesTags: ["Bookings"],
        }),
        updateBookingStatus: builder.mutation<TBooking, { booking_id: number; status: string }>({
            query: ({ booking_id, status }) => ({
                url: `/bookings/${booking_id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Bookings"],
        }),
        deleteBooking: builder.mutation<{ success: boolean }, number>({
            query: (booking_id) => ({
                url: `/bookings/${booking_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Bookings"],
        }),
    }),
    
})
