import React from 'react';

interface UserTicketsProps {
  createdTicket: {
    ticket_id: number;
    user_id: number;
    subject: string;
    description: string;
    status: 'open' | 'closed' | 'in-progress';
    created_at: string;
    updated_at: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UserTickets: React.FC<UserTicketsProps> = ({
  createdTicket,
  isOpen,
  onClose,
  onSuccess,
}) => {
  return (
    <div>
      {/* Example use of props */}
      <h2>{createdTicket.subject}</h2>
      <p>{createdTicket.description}</p>
      <p>Status: {createdTicket.status}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UserTickets;
