/**
 * Repository Cloner Module
 * Handles downloading of student GitHub repositories as ZIP archives and cleanup operations
 * Vercel-compatible: Uses ZIP download instead of git clone (git not available in serverless)
 */

const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// Use system temp directory for Vercel compatibility
// Vercel's serverless environment has read-only filesystem except /tmp
const TEMP_DIR = path.join(os.tmpdir(), 'metana-submissions');

/**
 * Parses a GitHub URL to extract owner and repository name
 * @param {string} repoUrl - The GitHub repository URL
 * @returns {{ owner: string, repo: string }} - Parsed owner and repo
 * @throws {Error} - If URL format is invalid
 */
function parseGitHubUrl(repoUrl) {
  // Match patterns like:
  // https://github.com/owner/repo
  // https://github.com/owner/repo.git
  // http://github.com/owner/repo
  const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
  
  if (!match) {
    throw new Error(`Invalid GitHub URL format: ${repoUrl}`);
  }
  
  const owner = match[1];
  const repo = match[2];
  
  return { owner, repo };
}

/**
 * Downloads a GitHub repository as a ZIP archive (Vercel-compatible)
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} studentName - Student identifier for folder naming
 * @param {string} branchName - Optional branch name to download (defaults to 'main')
 * @returns {Promise<string>} - Path to the extracted repository
 * @throws {Error} - If download or extraction fails
 */
async function cloneRepo(repoUrl, studentName, branchName = 'main') {
  let zipPath = null;
  let extractPath = null;
  
  try {
    // Parse GitHub URL
    const { owner, repo } = parseGitHubUrl(repoUrl);
    
    // Create timestamp for unique folder naming
    const timestamp = Date.now();
    const folderName = `${studentName}-${timestamp}`;
    
    // Define paths
    const tempPath = path.join(TEMP_DIR, folderName);
    zipPath = path.join(TEMP_DIR, `${folderName}.zip`);
    
    // Ensure temp directory exists
    await fs.ensureDir(TEMP_DIR);
    
    console.log(`[Cloner] Using temp directory: ${TEMP_DIR}`);
    console.log(`[Cloner] Downloading repository: ${owner}/${repo}`);
    console.log(`[Cloner] Branch: ${branchName}`);
    console.log(`[Cloner] Target path: ${tempPath}`);
    
    // Construct GitHub API URL for downloading ZIP archive
    // Format: https://api.github.com/repos/{owner}/{repo}/zipball/{branch}
    const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${branchName}`;
    
    console.log(`[Cloner] Downloading from: ${zipUrl}`);
    
    // Download ZIP with authentication (supports private repos)
    const response = await axios.get(zipUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Authorization': process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : undefined,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Metana-PR-Reviewer'
      },
      maxContentLength: 100 * 1024 * 1024, // 100MB limit
      timeout: 30000 // 30 second timeout
    });
    
    console.log(`[Cloner] Download complete. Size: ${(response.data.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Save ZIP to temporary file
    await fs.writeFile(zipPath, response.data);
    console.log(`[Cloner] ZIP saved to: ${zipPath}`);
    
    // Extract ZIP using adm-zip
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(tempPath, true);
    console.log(`[Cloner] ZIP extracted to: ${tempPath}`);
    
    // GitHub wraps the content in a folder like "owner-repo-commitsha/"
    // We need to find and return the path to that inner folder
    const extractedContents = await fs.readdir(tempPath);
    
    if (extractedContents.length === 0) {
      throw new Error('Extracted ZIP is empty');
    }
    
    // GitHub always creates a single root folder
    const innerFolderName = extractedContents[0];
    const innerFolderPath = path.join(tempPath, innerFolderName);
    
    // Verify it's a directory
    const stats = await fs.stat(innerFolderPath);
    if (!stats.isDirectory()) {
      throw new Error('Expected extracted content to be in a directory');
    }
    
    console.log(`[Cloner] Repository content located at: ${innerFolderPath}`);
    
    // Clean up the ZIP file
    await fs.remove(zipPath);
    console.log(`[Cloner] Cleaned up ZIP file`);
    
    console.log(`[Cloner] Successfully downloaded and extracted repository`);
    
    // Return path to the inner folder (where actual code is)
    return innerFolderPath;
    
  } catch (error) {
    console.error(`[Cloner] Failed to download repository: ${error.message}`);
    
    // Clean up on error
    if (zipPath) {
      try {
        await fs.remove(zipPath);
      } catch (cleanupError) {
        console.error(`[Cloner] Failed to cleanup ZIP: ${cleanupError.message}`);
      }
    }
    if (extractPath) {
      try {
        await fs.remove(extractPath);
      } catch (cleanupError) {
        console.error(`[Cloner] Failed to cleanup extraction: ${cleanupError.message}`);
      }
    }
    
    throw new Error(`Repository download failed: ${error.message}`);
  }
}

/**
 * Removes the cloned repository directory
 * @param {string} repoPath - Path to the repository to be deleted
 * @returns {Promise<void>}
 * @throws {Error} - If cleanup fails
 */
async function cleanupRepo(repoPath) {
  try {
    // Check if the path exists before attempting to remove
    const exists = await fs.pathExists(repoPath);
    
    if (!exists) {
      console.log(`[Cloner] Path does not exist, skipping cleanup: ${repoPath}`);
      return;
    }
    
    console.log(`[Cloner] Cleaning up repository at: ${repoPath}`);
    
    // Remove the directory and all its contents
    await fs.remove(repoPath);
    
    console.log(`[Cloner] Successfully cleaned up: ${repoPath}`);
  } catch (error) {
    console.error(`[Cloner] Cleanup failed: ${error.message}`);
    throw new Error(`Repository cleanup failed: ${error.message}`);
  }
}

/**
 * Validates if a GitHub URL is properly formatted
 * @param {string} url - The URL to validate
 * @returns {boolean}
 */
function isValidGitHubUrl(url) {
  const githubPattern = /^https?:\/\/(www\.)?github\.com\/.+\/.+/;
  return githubPattern.test(url);
}

module.exports = {
  cloneRepo,
  cleanupRepo,
  isValidGitHubUrl,
  parseGitHubUrl
};
