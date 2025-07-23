import React from 'react'


interface UserTicketsProps {
   createdTicket:{
     ticket_id: number;
    user_id: number;
    subject: string;
    description: string;
    status: 'open' | 'closed' | 'in-progress';
    created_at: string;
    updated_at: string;
   }
   isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;

}




const UserTickets :React.FC<UserTicketsProps>= (createdTicket,isOpen,onClose,onSuccess) => {
  return (
    <div>

      
    </div>
  )
}

export default UserTickets
