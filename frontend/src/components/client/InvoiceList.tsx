
import { Box, Heading, List, ListItem, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { fetchClientInvoices } from '../../services/invoiceApi';
import type { Invoice } from '../../services/invoiceApi';


export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientInvoices()
      .then(setInvoices)
      .catch(() => setError('Failed to load invoices.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading size="md" mb={2}>Invoices</Heading>
      <List spacing={2}>
        {invoices.map((inv) => (
          <ListItem key={inv.id}>
            <Text>Amount: ${inv.amount} | Status: {inv.status} | Issued: {new Date(inv.issued_at).toLocaleDateString()}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
