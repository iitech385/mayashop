export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`);
    return response.json();
  },
  // Add other methods as needed
}; 