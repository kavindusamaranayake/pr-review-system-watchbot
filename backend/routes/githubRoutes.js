const express = require('express');
const router = express.Router();
const { getActivePRs, getAllRepos, getBranches, checkGitHubHealth } = require('../controllers/githubController');

/**
 * @route   GET /api/github/prs
 * @desc    Get all open Pull Requests from the organization
 * @access  Public
 */
router.get('/prs', getActivePRs);

/**
 * @route   GET /api/github/repos
 * @desc    Get all repositories from the organization
 * @access  Public
 */
router.get('/repos', getAllRepos);

/**
 * @route   GET /api/github/branches/:owner/:repo
 * @desc    Get all branches for a specific repository
 * @access  Public
 */
router.get('/branches/:owner/:repo', getBranches);

/**
 * @route   GET /api/github/health
 * @desc    Check GitHub API connection health
 * @access  Public
 */
router.get('/health', checkGitHubHealth);

module.exports = router;
