import React, { useState } from 'react';
import EdgeComputeService from './EdgeComputeService';

const AICompute: React.FC = () => {
  const [task, setTask] = useState('');
  const [solution, setSolution] = useState('');

  const handleTaskSubmit = async () => {
    try {
      const response = await EdgeComputeService.submitTask(task);
      console.log('Task submitted:', response);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleSolutionSubmit = async () => {
    try {
      const response = await EdgeComputeService.submitSolution(solution);
      console.log('Solution submitted:', response);
    } catch (error) {
      console.error('Error submitting solution:', error);
    }
  };

  return (
    <div>
      <h1>AI Compute</h1>
      <div>
        <h2>Submit Task</h2>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleTaskSubmit}>Submit Task</button>
      </div>
      <div>
        <h2>Submit Solution</h2>
        <input
          type="text"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
        <button onClick={handleSolutionSubmit}>Submit Solution</button>
      </div>
    </div>
  );
};

export default AICompute;
