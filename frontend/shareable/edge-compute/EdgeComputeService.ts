import { ethers } from 'ethers';

const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = [
  // Contract ABI goes here
];

class EdgeComputeService {
  private provider: ethers.BrowserProvider;
  private contract: ethers.Contract;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.provider = new ethers.BrowserProvider((window as any).ethereum);
    this.initializeContract();
  }

  private async initializeContract() {
    this.signer = await this.provider.getSigner();
    this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
  }

  async submitTask(task: string) {
    try {
      await this.ensureContract();
      const tx = await this.contract.submitTask(task);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error submitting task:', error);
      throw error;
    }
  }

  async submitSolution(solution: string) {
    try {
      await this.ensureContract();
      const tx = await this.contract.submitSolution(solution);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw error;
    }
  }

  async getTasks() {
    try {
      await this.ensureContract();
      const tasks = await this.contract.getTasks();
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  async acceptTask(taskId: string) {
    try {
      await this.ensureContract();
      const tx = await this.contract.acceptTask(taskId);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error accepting task:', error);
      throw error;
    }
  }

  private async ensureContract() {
    if (!this.signer) {
      await this.initializeContract();
    }
  }
}

export default new EdgeComputeService();