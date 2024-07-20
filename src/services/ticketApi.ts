import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], void>({
      query: () => "tickets",
    }),
    createTicket: builder.mutation({
      query: (ticket) => ({
        url: "tickets/create",
        method: "POST",
        body: ticket,
      }),
    }),
  }),
});

export const { useGetTicketsQuery, useCreateTicketMutation } = ticketApi;

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
}
