import axios from './axios';

export interface Invoice {
  id: number;
  task: number;
  amount: number;
  status: string;
  issued_at: string;
  paid_at?: string;
  payment_method?: string;
}

// Fetch all invoices for the current client
export async function fetchClientInvoices(): Promise<Invoice[]> {
  const response = await axios.get('/api/client/invoices/');
  return response.data;
}
