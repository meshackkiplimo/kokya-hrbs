import React from 'react'
import { ticketApi } from '../../../Features/ticket/TicketApi';

const TicketManagement = () => {
    const { data: ticketsResponse, isLoading, error } = ticketApi.useGetTicketsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 30000, // Poll every 30 seconds
        }
    );
      const [selectedTicket, setSelectedTicket] = React.useState(null);
        const ticketsData = ticketsResponse || [];
    const handleTicketClick = (ticket:any) => {
        setSelectedTicket(ticket);
    }
      
  return (
    <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="table table-xs w-full">
                <thead>
                  <tr className="bg-gray-600 text-white text-md lg:text-lg">
                    <th className="px-4 py-2 border-r border-gray-400">User ID</th>
                    <th className="px-4 py-2 border-r border-gray-400">Description</th>
                    <th className="px-4 py-2 border-r border-gray-400">Subject</th>
                    <th className="px-4 py-2 border-r border-gray-400">Ticket ID</th>
                    <th className="px-4 py-2 border-r border-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsData.map((tickets) => (
                    <tr key={tickets.ticketId} className="hover:bg-gray-300 border-b border-gray-400">
                      <td className="px-4 py-2 border-r border-gray-400">{tickets.userId}</td>
                      <td className="px-4 py-2 border-r border-gray-400">{tickets.description}</td>
                      <td className="px-4 py-2 border-r border-gray-400">{tickets.subject}</td>
                      <td className="px-4 py-2 border-r border-gray-400">${tickets.ticketId}</td>
                      
                      <td className="px-4 py-2 border-r border-gray-400">
                        <span className={`badge ${tickets.status === 'open' ? 'badge-success' : 'badge-warning'}`}>
                          {tickets.status.charAt(0).toUpperCase() + tickets.status.slice(1)}
                        </span>
                      </td>
                     
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        )}
      



export default TicketManagement
