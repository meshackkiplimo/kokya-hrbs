import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { APIDomain } from "../../utils/utils";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/store";



export type THotel={
    hotel_id: number;
    name: string;
    location: string;
    address: string;
    contact_number: string;
    category: string;
    rating: number;
}

export type TPaginationInfo = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export type THotelResponse = {
    hotels: THotel[];
    pagination: TPaginationInfo;
}

export type TPaginationParams = {
    page?: number;
    limit?: number;
}

export const hotelApi = createApi({
    reducerPath: "hotelApi",
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
    tagTypes: ["Hotels"],
    endpoints: (builder) => ({
        createHotel: builder.mutation<THotel, Partial<THotel>>({
            query: (newHotel) => ({
                url: "/hotels",
                method: "POST",
                body: newHotel,
            }),
            invalidatesTags: ["Hotels"],
        }),
        getHotels: builder.query<THotelResponse, TPaginationParams>({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: "/hotels",
                params: { page, limit }
            }),
            providesTags: ["Hotels"],
        }),
    }),
});