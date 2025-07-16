import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/utils";
import type { RootState } from "../../app/store";




export type TRoom = {
    room_id: number;
    hotel_id: number;
    room_type: string;
    room_number: string;
    capacity: number;
    price_per_night: number;
    amenities: string;
    availability: string;
   

}
export type TPaginationInfo = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export type TRoomResponse = {
    rooms: TRoom[];
    pagination: TPaginationInfo;
}
export type TPaginationParams = {
    page?: number;
    limit?: number;
}
    

export const roomsApi = createApi({
    reducerPath: "roomsApi",
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
    tagTypes: ["Rooms"],
    endpoints: (builder) => ({
        createRoom: builder.mutation<TRoom, Partial<TRoom>>({
            query: (newRoom) => ({
                url: "/rooms",
                method: "POST",
                body: newRoom,
            }),
            invalidatesTags: ["Rooms"],
        }),
        getRooms: builder.query<TRoomResponse, TPaginationParams>({
            query: ({page=1,limit=10}={}) => ({
                url: "/rooms",
                params: { page, limit }
            }),
            providesTags: ["Rooms"],
           
          
        }),
    }),
});
        