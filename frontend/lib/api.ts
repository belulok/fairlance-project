const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// API client configuration
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('fairlance_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fairlance_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fairlance_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
  }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Projects endpoints
  async getProjects(params: {
    category?: string;
    skills?: string;
    minBudget?: number;
    maxBudget?: number;
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/projects${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getFeaturedProjects() {
    return this.request('/projects/featured');
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: any) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async applyToProject(id: string, proposalData: any) {
    return this.request(`/projects/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
  }

  async getProjectProposals(id: string, status?: string) {
    const endpoint = `/projects/${id}/proposals${status ? `?status=${status}` : ''}`;
    return this.request(endpoint);
  }

  // User endpoints
  async getUserProfile(id: string) {
    return this.request(`/users/profile/${id}`);
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Proposals endpoints
  async getMyProposals(status?: string) {
    const endpoint = `/proposals/my${status ? `?status=${status}` : ''}`;
    return this.request(endpoint);
  }

  async updateProposal(id: string, proposalData: any) {
    return this.request(`/proposals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(proposalData),
    });
  }

  async withdrawProposal(id: string) {
    return this.request(`/proposals/${id}`, {
      method: 'DELETE',
    });
  }

  // KYC endpoints
  async initiateKYC() {
    return this.request('/kyc/initiate', {
      method: 'POST',
    });
  }

  async getKYCStatus() {
    return this.request('/kyc/status');
  }

  // Escrow endpoints
  async createEscrow(projectId: string, milestoneAmounts: number[]) {
    return this.request('/escrow/create', {
      method: 'POST',
      body: JSON.stringify({ projectId, milestoneAmounts }),
    });
  }

  async fundEscrow(projectId: string) {
    return this.request(`/escrow/${projectId}/fund`, {
      method: 'POST',
    });
  }

  async submitMilestone(projectId: string, milestoneId: number, deliverableHash: string, description?: string) {
    return this.request(`/escrow/${projectId}/submit-milestone`, {
      method: 'POST',
      body: JSON.stringify({ milestoneId, deliverableHash, description }),
    });
  }

  async approveMilestone(projectId: string, milestoneId: number) {
    return this.request(`/escrow/${projectId}/approve-milestone`, {
      method: 'POST',
      body: JSON.stringify({ milestoneId }),
    });
  }

  async getEscrowStatus(projectId: string) {
    return this.request(`/escrow/${projectId}/status`);
  }

  // Certificates endpoints
  async getMyNFTs() {
    return this.request('/certificates/my-nfts');
  }

  async getCertificate(id: string) {
    return this.request(`/certificates/${id}`);
  }

  async verifyCertificate(certificateId: string, walletAddress?: string) {
    return this.request('/certificates/verify', {
      method: 'POST',
      body: JSON.stringify({ certificateId, walletAddress }),
    });
  }

  // Skill tokens endpoints
  async getMySkillTokens() {
    return this.request('/tokens/my-skills');
  }

  async getSkillLeaderboard(skill: string, limit?: number) {
    const endpoint = `/tokens/skill-leaderboard/${skill}${limit ? `?limit=${limit}` : ''}`;
    return this.request(endpoint);
  }

  async getAvailableSkills() {
    return this.request('/tokens/available-skills');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export the API client instance
export const api = new ApiClient(API_BASE_URL);

// Export types for better TypeScript support
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  client: {
    name: string;
    rating: number;
    reviews: number;
    verified: boolean;
  };
  proposals: number;
  featured: boolean;
  status: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  userType: string;
  walletAddress?: string;
  kycStatus: string;
  trustScore: number;
  isVerified: boolean;
}

export default api;
