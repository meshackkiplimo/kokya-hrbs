import jsPDF from 'jspdf';

export interface ReceiptData {
  transactionId: string;
  paymentMethod: string;
  amount: number;
  paymentDate: string;
  bookingId?: number;
  customerName?: string;
  customerEmail?: string;
  hotelName?: string;
  roomType?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export const generatePDFReceipt = (receiptData: ReceiptData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', pageWidth / 2, 30, { align: 'center' });
  
  // Hotel branding
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Kokya Hotel Booking System', pageWidth / 2, 45, { align: 'center' });
  
  // Divider line
  doc.setLineWidth(0.5);
  doc.line(20, 55, pageWidth - 20, 55);
  
  // Receipt details
  let yPosition = 70;
  const leftMargin = 25;
  const rightMargin = pageWidth - 25;
  
  // Transaction info section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION DETAILS', leftMargin, yPosition);
  yPosition += 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Transaction ID
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction ID:', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(receiptData.transactionId, leftMargin + 50, yPosition);
  yPosition += 10;
  
  // Payment Method
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Method:', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(receiptData.paymentMethod.toUpperCase(), leftMargin + 50, yPosition);
  yPosition += 10;
  
  // Amount
  doc.setFont('helvetica', 'bold');
  doc.text('Amount Paid:', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(`KSH ${receiptData.amount.toLocaleString()}`, leftMargin + 50, yPosition);
  yPosition += 10;
  
  // Payment Date
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Date:', leftMargin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(receiptData.paymentDate).toLocaleString(), leftMargin + 50, yPosition);
  yPosition += 20;
  
  // Booking details section (if available)
  if (receiptData.bookingId) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BOOKING DETAILS', leftMargin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Booking ID
    doc.setFont('helvetica', 'bold');
    doc.text('Booking ID:', leftMargin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${receiptData.bookingId}`, leftMargin + 50, yPosition);
    yPosition += 10;
    
    if (receiptData.hotelName) {
      doc.setFont('helvetica', 'bold');
      doc.text('Hotel:', leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(receiptData.hotelName, leftMargin + 50, yPosition);
      yPosition += 10;
    }
    
    if (receiptData.roomType) {
      doc.setFont('helvetica', 'bold');
      doc.text('Room Type:', leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(receiptData.roomType, leftMargin + 50, yPosition);
      yPosition += 10;
    }
    
    if (receiptData.checkInDate && receiptData.checkOutDate) {
      doc.setFont('helvetica', 'bold');
      doc.text('Check-in:', leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date(receiptData.checkInDate).toLocaleDateString(), leftMargin + 50, yPosition);
      yPosition += 10;
      
      doc.setFont('helvetica', 'bold');
      doc.text('Check-out:', leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date(receiptData.checkOutDate).toLocaleDateString(), leftMargin + 50, yPosition);
      yPosition += 10;
    }
    
    yPosition += 10;
  }
  
  // Customer details section (if available)
  if (receiptData.customerName || receiptData.customerEmail) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', leftMargin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (receiptData.customerName) {
      doc.setFont('helvetica', 'bold');
      doc.text('Name:', leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(receiptData.customerName, leftMargin + 50, yPosition);
      yPosition += 10;
    }
    
    if (receiptData.customerEmail) {
      doc.setFont('helvetica', 'bold');
      doc.text('Email:', leftMargin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(receiptData.customerEmail, leftMargin + 50, yPosition);
      yPosition += 10;
    }
    
    yPosition += 10;
  }
  
  // Payment status
  yPosition += 10;
  doc.setFillColor(34, 197, 94); // Green background
  doc.rect(leftMargin, yPosition - 5, rightMargin - leftMargin, 20, 'F');
  doc.setTextColor(255, 255, 255); // White text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT COMPLETED SUCCESSFULLY', pageWidth / 2, yPosition + 7, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPosition += 30;
  
  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing Kokya Hotel Booking System!', pageWidth / 2, yPosition + 20, { align: 'center' });
  doc.text('For any inquiries, please contact our support team.', pageWidth / 2, yPosition + 30, { align: 'center' });
  
  // Generate unique filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `receipt-${receiptData.transactionId}-${timestamp}.pdf`;
  
  // Download the PDF
  doc.save(filename);
};

export const formatReceiptData = (payment: any, booking?: any, user?: any): ReceiptData => {
  return {
    transactionId: payment.transaction_id || payment.reference || 'N/A',
    paymentMethod: payment.payment_method || 'Unknown',
    amount: payment.amount || 0,
    paymentDate: payment.payment_date || new Date().toISOString(),
    bookingId: payment.booking_id || booking?.booking_id,
    customerName: user ? `${user.first_name} ${user.last_name}` : undefined,
    customerEmail: user?.email || payment.customer_email,
    hotelName: booking?.hotel_name,
    roomType: booking?.room_type,
    checkInDate: booking?.check_in_date,
    checkOutDate: booking?.check_out_date,
  };
};