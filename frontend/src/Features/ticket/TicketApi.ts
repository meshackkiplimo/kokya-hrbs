import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/utils";





export type TTicket ={
    ticket_id: number;
   
    subject: string;
    description: string;
    status: 'open' | 'closed' | 'in-progress';
  user:{
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
    }
    
  }



export const ticketApi = createApi ({
    reducerPath: 'ticketApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: APIDomain,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).user.token; // Adjust according to your state structure
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    
    }),
    endpoints: (builder) => ({
        getTickets: builder.query<TTicket[], void>({
            query: () => '/complains',
            transformResponse: (response: TTicket[]) => response,
            providesTags: ['Ticket'],

        }),
        createTicket: builder.mutation<TTicket, Partial<TTicket>>({
            query: (newTicket) => ({
                url: '/complains',
                method: 'POST',
                body: newTicket,
            }),
        }),
        updateTicket: builder.mutation<TTicket, Partial<TTicket> & { ticketId: string }>({
            query: ({ ticketId, ...patch }) => ({
                url: `/${ticketId}`,
                method: 'PUT',
                body: patch,
            }),
        }),
        deleteTicket: builder.mutation<{ success: boolean }, string>({
            query: (ticketId) => ({
                url: `/${ticketId}`,
                method: 'DELETE',
            }),
        }),
    }),
    tagTypes: ['Ticket'],
})