import React from 'react';
import { useParams } from 'react-router-dom';

export default function TaskDetails() {
  const { id } = useParams();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Task Details</h2>
      <p>Viewing details for task ID: {id}</p>
    </div>
  );
}
