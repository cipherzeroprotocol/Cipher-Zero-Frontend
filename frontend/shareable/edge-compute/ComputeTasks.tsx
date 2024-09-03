import React, { useState, useEffect } from 'react';
import EdgeComputeService from './EdgeComputeService';

interface Task {
  id: string;
  description: string;
}

const ComputeTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await EdgeComputeService.getTasks();
        setTasks(response);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleAcceptTask = async (taskId: string): Promise<void> => {
    try {
      const response = await EdgeComputeService.acceptTask(taskId);
      console.log('Task accepted:', response);
    } catch (error) {
      console.error('Error accepting task:', error);
    }
  };

  return (
    <div>
      <h1>Compute Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.description}
            <button onClick={() => handleAcceptTask(task.id)}>Accept Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComputeTasks;
