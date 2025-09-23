import React from 'react';
import PaymentStatus from './PaymentStatus';

export default function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Client Dashboard</h2>
      <p>Track your tasks and payments here.</p>
      <PaymentStatus status="Pending" />
    </div>
  );
}
