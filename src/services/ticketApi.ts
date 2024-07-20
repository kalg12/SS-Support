import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], void>({
      query: () => "tickets",
    }),
    createTicket: builder.mutation<any, Partial<Ticket>>({
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
  estudiante_id: number;
  descripcion: string;
  estado: string;
  becario_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  horario_agendado: string;
}
