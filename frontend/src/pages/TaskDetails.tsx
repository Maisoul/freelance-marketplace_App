import React from 'react';
import { useParams } from 'react-router-dom';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Task Details</h2>
      <p>Viewing details for task ID: {id}</p>
    </div>
  );
};

export default TaskDetails;
