<div align="center">

![Metana Logo](./frontend/src/pp/logo.png)

# Automated Pull Request Reviewer

### AI-Powered Code Review System with Instructor Gatekeeping

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![GitHub Webhooks](https://img.shields.io/badge/GitHub-Webhooks-181717?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/en/webhooks)

**[📄 Download Technical Report](./frontend/src/pp/Metana_DevOps_Assessment_karindra_gimhan.pdf)**

</div>

---

## 🎯 Introduction

The **Automated Pull Request Reviewer** is a full-stack DevOps solution designed to streamline the code review process for educational institutions and development teams. By leveraging **GitHub Webhooks**, **AI-powered analysis**, **Automated Repository Setup**, and a **professional Instructor Dashboard**, this system provides end-to-end management from repository creation to pull request review.

This comprehensive tool bridges the gap between manual repository setup, automated CI/CD pipelines, and intelligent code review, offering:

- 🏗️ **Automated repository creation** with proper access controls and configurations
- ✅ **Real-time PR analysis** triggered by GitHub events
- 🧠 **Smart branch-based review logic** (feature/, hotfix/, main)
- 👨‍🏫 **Instructor gatekeeping** with approve/reject capabilities
- 🌐 **GitHub API integration** for automated status updates
- 📊 **Comprehensive audit logging** with review history
- 🚀 **PRWatchBot** for instant student repository provisioning

Perfect for **DevOps bootcamps**, **code academies**, and **development teams** seeking to enforce best practices while maintaining human oversight and streamlined repository management.

---

## ✨ Key Features

### 🚀 **PRWatchBot - Automated Repository Setup**

- **One-Click Repository Creation**: Instantly create student repositories with standardized naming
- **Smart Configuration**: Automatically configure CODEOWNERS, collaborators, and permissions
- **Bootcamp Integration**: Supports multiple bootcamp types (fullstack, solidity, seca)
- **Cohort Management**: Organize repositories by cohort with consistent naming patterns
- **Predefined Users**: Quick selection from instructor/mentor database
- **Custom Collaborators**: Flexible addition of any GitHub username
- **Automated Workflows**: PR monitoring workflows installed automatically
- **Form Validation**: Ensures all required fields are properly filled
- **Confirmation Modal**: Review all settings before submission
- **Cloudflare Worker Backend**: Serverless API for repository creation

### 🤖 **AI-Powered Review Analysis**

- Automatically analyzes code changes based on branch naming conventions
- Detects new functions, tests, documentation, and code patterns
- Provides detailed feedback with strengths, issues, and suggestions
- Supports feature/, hotfix/, bugfix/, and custom branch types

### 🌿 **Intelligent Branch-Based Logic**

- **Feature Branches**: Checks for tests, documentation, and proper implementation
- **Hotfix Branches**: Enforces minimal changes (<100 lines) and focused fixes
- **Main/Master Branches**: Blocks direct commits, enforces PR workflow
- Custom severity levels: CRITICAL, MAJOR, MINOR, INFO

### 👨‍🏫 **Instructor Dashboard & Gatekeeping**

- Clean, professional SaaS-style interface with dark/light themes
- Review queue with pending PRs awaiting approval
- One-click approve/reject actions with GitHub integration
- Real-time status updates and processed review counter
- History modal showing complete audit trail

### 🔗 **Seamless GitHub Integration**

- Webhook-based architecture for instant PR detection
- Automatic comment posting on GitHub PRs
- REQUEST_CHANGES event for rejected PRs (with fallback to COMMENT)
- Handles self-review restrictions gracefully
- Supports private repositories with token authentication

### 🎨 **Modern User Experience**

- Responsive design with Tailwind CSS
- Dark/light theme toggle with system preference detection
- Glassmorphism UI elements and smooth animations
- Professional color scheme (subtle grays, minimal neon accents)
- Optimized for desktop and mobile viewing

---

## 📸 Interface Showcase

### 🌙 Dark Mode Dashboard

The main instructor interface showing pending reviews, AI analysis, and action buttons.

![Dark Mode Dashboard](./frontend/src/pp/dark.png)

### ☀️ Light Mode & Landing Page

Theme adaptability demonstration with professional light theme and welcoming landing page.

<div align="center">
  <img src="./frontend/src/pp/light.png" alt="Light Mode Dashboard" width="49%" />
  <img src="./frontend/src/pp/light2.png" alt="Landing Page" width="49%" />
</div>

### ⛔ Rejection Workflow

Demonstrates the instructor reject action with GitHub API integration for blocking merges.

![Rejection Logic](./frontend/src/pp/reject.png)

### 📋 Audit History Modal

Complete history of all processed reviews with status badges and timestamps.

![History Modal](./frontend/src/pp/list.png)

---

## 🛠️ Tech Stack

### **Backend**

- **Node.js** (v18.x) - JavaScript runtime
- **Express.js** - RESTful API framework
- **Prisma ORM** - Database management with migrations
- **SQLite** - Lightweight relational database
- **Octokit** - GitHub REST API client
- **dotenv** - Environment variable management

### **Frontend**

- **React** (v18.x) - UI component library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### **DevOps & Tools**

- **Ngrok** - Secure tunneling for local webhook testing
- **GitHub Webhooks** - Real-time PR event notifications
- **Nodemon** - Auto-restart development server
- **ESLint** - Code quality and consistency

---

## 🚀 Installation & Setup

### **Prerequisites**

- Node.js v18.x or higher
- npm or yarn package manager
- GitHub account with a test repository
- Ngrok account (free tier works)

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/yourusername/metana-pr-reviewer.git
cd metana-pr-reviewer
```

### **2️⃣ Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your GitHub token
echo "GITHUB_TOKEN=your_github_personal_access_token" > .env
echo "DATABASE_URL=file:./dev.db" >> .env
echo "PORT=3000" >> .env

# Run Prisma migrations to create database
npx prisma migrate dev --name init

# Start the backend server
npm run dev
```

**Backend should now be running on:** `http://localhost:3000`

**Generate GitHub Token:**

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope (full control of private repositories)
3. Copy the token and paste it in your `.env` file

### **3️⃣ Frontend Setup**

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

**Frontend should now be running on:** `http://localhost:5173`

### **4️⃣ Ngrok Setup (For GitHub Webhooks)**

To receive GitHub webhook events on your local machine:

```bash
# Install Ngrok globally (if not installed)
npm install -g ngrok

# Start Ngrok tunnel to backend port
ngrok http 3000
```

**Copy the Forwarding URL** (e.g., `https://abc123.ngrok.io`)

### **5️⃣ Configure GitHub Webhook**

1. Go to your GitHub repository → **Settings** → **Webhooks** → **Add webhook**
2. Set **Payload URL**: `https://your-ngrok-url.ngrok.io/webhook/github`
3. Set **Content type**: `application/json`
4. Select events: **Pull requests** (check "Let me select individual events")
5. Ensure webhook is **Active**
6. Click **Add webhook**

**Test the webhook:**

- Open a new PR in your repository
- Check the backend terminal for `Processing PR #X: opened`
- Review should appear in the Dashboard at `http://localhost:5173/dashboard`

---

## 📖 Usage Guide

### **For Instructors (Repository Setup)**

#### 🚀 **PRWatchBot - Automated Repository Creation**

The PRWatchBot feature streamlines the process of creating and configuring student repositories with proper access controls and automated PR monitoring.

**Accessing PRWatchBot:**

1. Navigate to `/pr-watch-bot` route in the application
2. You'll see a clean form-based interface for repository setup

**Repository Creation Process:**

1. **Repository Details**
   - Select the **Bootcamp** type (fullstack, solidity, seca)
   - Enter the **Cohort** identifier (e.g., c01, c02, c03)
   - Provide the **Student Name/Username**
   - Preview: Repository will be created as `{bootcamp}-{cohort}-{username}`
   - Example: `fullstack-c01-johndoe`

2. **Configure Code Owners**
   - Select from predefined instructors/mentors dropdown
   - Available users include: Dhruvin Parikh, David Killen, Timothy Liu, Kavinesh, Nigel Jacob, Aaron, Prabashan
   - Or manually add GitHub usernames
   - Code owners will have review approval rights
   - At least one code owner is required

3. **Add Collaborators**
   - Add student GitHub usernames as collaborators
   - Collaborators will have push access to the repository
   - Multiple collaborators can be added
   - At least one collaborator is required

4. **Submit & Create**
   - Click "Create Repository" button
   - Review the summary in the confirmation modal
   - Confirm to trigger repository creation via Cloudflare Worker API
   - Success notification displays on completion

**Automated Features:**

- ✅ Repository is created in the organization/account
- ✅ CODEOWNERS file is automatically configured
- ✅ Collaborators are added with appropriate permissions
- ✅ PR monitoring workflow is automatically installed
- ✅ Branch protection rules can be configured (optional)

**API Integration:**

- Backend: Cloudflare Worker endpoint at `watch-bot-repo-creator.automations-3d6.workers.dev`
- Payload includes: repo name, codeowners array, collaborators array, workflow enablement flag
- Supports both predefined users (with real names) and custom GitHub usernames

**Use Case:**
Perfect for bootcamp administrators and instructors who need to:

- Quickly provision student repositories for each cohort
- Ensure consistent repository naming conventions
- Automatically configure access controls and code review requirements
- Enable PR monitoring workflows from day one

---

### **For Developers (Students)**

1. **Create a feature branch** following naming conventions:
   - `feature/add-login-page` - For new features
   - `hotfix/fix-critical-bug` - For urgent fixes
   - `bugfix/resolve-null-error` - For bug fixes

2. **Open a Pull Request** on GitHub

3. **AI Review is automatic** - The system analyzes your code and posts feedback as a comment

4. **Wait for instructor approval** - Your PR will be in "Pending" status

### **For Instructors (PR Review Dashboard)**

1. **Access the Dashboard** at `http://localhost:5173/dashboard`

2. **Review pending PRs** in the left panel

3. **Click on a review** to see AI analysis and branch details

4. **Take action:**
   - ✅ **Approve & Post** - Approves the PR and posts confirmation to GitHub
   - ❌ **Reject** - Requests changes on GitHub (blocks merge)

5. **View history** by clicking the "Total Processed" card

### **API Endpoints**

**PR Review System:**

```
GET  /api/reviews          - Fetch pending reviews (default) or all (?status=all)
POST /api/reviews/:id/approve - Approve a review and post to GitHub
POST /api/reviews/:id/reject  - Reject a review with GitHub REQUEST_CHANGES
POST /webhook/github      - GitHub webhook endpoint (receives PR events)
```

**PRWatchBot Repository Creation:**

```
POST https://watch-bot-repo-creator.automations-3d6.workers.dev
Content-Type: application/json

{
  "repo": "bootcamp-cohort-username",
  "codeowners": ["username1", "username2"],
  "collaborators": ["student1", "student2"],
  "enableWorkflow": true
}
```

**Response:**

- `200 OK`: Repository created successfully
- `400 Bad Request`: Invalid payload or missing required fields
- `500 Internal Server Error`: Repository creation failed

---

## 🏗️ Project Structure

```
metana-pr-reviewer/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── reviewController.js    # API logic for reviews
│   │   │   └── webhookController.js   # GitHub webhook handler
│   │   ├── routes/
│   │   │   ├── reviewRoutes.js        # Review API routes
│   │   │   └── webhook.js             # Webhook routes
│   │   ├── services/
│   │   │   └── reviewService.js       # AI analysis logic
│   │   └── config/
│   │       └── database.js            # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma              # Database schema
│   │   └── migrations/                # Database migrations
│   ├── server.js                      # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx          # Main instructor dashboard
│   │   │   ├── PRWatchBot.jsx         # Repository creation tool
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── HistoryModal.jsx       # Review history modal
│   │   │   ├── ThemeToggle.jsx        # Dark/light theme switcher
│   │   │   └── WaveBackground.jsx     # Animated background
│   │   ├── services/
│   │   │   └── api.js                 # Axios API client
│   │   └── App.jsx                    # React app entry
│   └── package.json
│
└── README.md
```

---

## 🔧 Environment Variables

### **Backend (.env)**

```env
GITHUB_TOKEN=your_github_personal_access_token
DATABASE_URL=file:./dev.db
PORT=3000
```

### **Frontend (No .env needed)**

API base URL is configured in `src/services/api.js` to `http://localhost:3000/api`

---

## 🎓 Educational Value

This project demonstrates mastery of:

- ✅ **Full-stack development** (Node.js + React)
- ✅ **RESTful API design** and implementation
- ✅ **Database modeling** with Prisma ORM
- ✅ **GitHub API integration** and webhook handling
- ✅ **Serverless architecture** (Cloudflare Workers for repository creation)
- ✅ **DevOps practices** (CI/CD simulation, code review automation, repository provisioning)
- ✅ **Modern frontend development** (React hooks, state management, form validation)
- ✅ **Professional UI/UX design** (responsive, themed, accessible)
- ✅ **Error handling** and graceful degradation
- ✅ **Security considerations** (token management, validation, access controls)

---

## � Deployment to Vercel

This project is **production-ready** and optimized for Vercel deployment!

### **📚 Deployment Guides**

Choose your preferred guide based on your experience level:

1. **[QUICK_START.md](./QUICK_START.md)** - ⚡ 3-step deployment (5 minutes)
2. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - ✅ Step-by-step checklist
3. **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)** - 📖 Comprehensive guide
4. **[DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)** - 🏗️ Architecture & diagrams

### **⚡ Quick Deploy**

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy to Vercel
# Visit: https://vercel.com/new
# Import your repository
# Click "Deploy"

# 3. Add environment variables in Vercel Dashboard
```

**That's it!** Your app will be live at `https://your-app-name.vercel.app` 🎉

---

## 📝 Future Enhancements

- [x] **Vercel Deployment** - Production-ready with comprehensive guides
- [x] **PostgreSQL Integration** - Supabase database via Vercel Storage
- [x] **AI-Powered Grading** - OpenAI GPT-4 integration
- [x] **Firebase Authentication** - Multi-instructor support
- [ ] **Custom Review Rules** - Configurable review criteria per repository
- [ ] **Slack/Discord Notifications** - Real-time alerts for new PRs
- [ ] **Analytics Dashboard** - Charts showing review trends, approval rates, etc.

---

## 👨‍💻 Author

**Karindra Gimhan**  
DevOps Intern | Full-Stack Developer

Submitted as part of the **Metana DevOps Internship Assessment**

---

## 📄 License

This project is developed for educational purposes as part of the Metana DevOps Internship program.

---

<div align="center">

**Built with ❤️ by Karindra Gimhan**

[⬆ Back to Top](#-automated-pull-request-reviewer)

</div>
