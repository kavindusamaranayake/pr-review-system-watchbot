import axios from 'axios';

// API Base URL Configuration for Vercel Deployment
// In production (Vercel), use relative path with /api prefix (handled by vercel.json rewrites)
// In development, use localhost backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:3000/api');

console.log('API Base URL:', API_BASE_URL, 'Mode:', import.meta.env.MODE);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Get all pending reviews
 * @returns {Promise} Array of pending reviews
 */
export const getPendingReviews = async () => {
  try {
    const response = await api.get('/reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    throw error;
  }
};

/**
 * Get all reviews (for history)
 * @returns {Promise} Array of all reviews
 */
export const getAllReviews = async () => {
  try {
    const response = await api.get('/reviews?status=all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

/**
 * Approve a review and post to GitHub
 * @param {number} reviewId - The ID of the review to approve
 * @returns {Promise} Updated review data
 */
export const approveReview = async (reviewId) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
};

/**
 * Reject a review
 * @param {number} reviewId - The ID of the review to reject
 * @returns {Promise} Updated review data
 */
export const rejectReview = async (reviewId) => {
  try {
    const response = await api.post(`/reviews/${reviewId}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting review:', error);
    throw error;
  }
};

/**
 * Get active Pull Requests from GitHub
 * @returns {Promise} Array of active PRs
 */
export const getActivePRs = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/github/prs');
    return response.data;
  } catch (error) {
    console.error('Error fetching active PRs:', error);
    throw error;
  }
};

/**
 * Get all repositories from GitHub
 * @returns {Promise} Array of repositories
 */
export const getAllRepos = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/github/repos');
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

export default api;
