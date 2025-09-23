import React from 'react';

export default function PaymentStatus({ status }) {
  const color = status === 'Completed' ? 'green' : 'orange';
  return (
    <div style={{ marginTop: '1rem' }}>
      <strong>Payment Status: </strong>
      <span style={{ color }}>{status}</span>
    </div>
  );
}
