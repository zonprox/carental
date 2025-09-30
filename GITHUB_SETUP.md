# GitHub Repository Setup Guide

## 🎯 Quick Setup Instructions

### Step 1: Create GitHub Repository

1. **Go to GitHub:**
   - Visit [https://github.com/new](https://github.com/new)
   - Sign in to your GitHub account

2. **Create Repository:**
   - Repository name: `car-rental-system` (or your preferred name)
   - Description: `Modern car rental management system with React frontend and Node.js backend`
   - Set to **Public** or **Private** (your choice)
   - **DO NOT** check "Add a README file" (we already have one)
   - **DO NOT** check "Add .gitignore" (we already have one)
   - **DO NOT** choose a license (you can add one later)

3. **Click "Create repository"**

### Step 2: Connect Local Repository to GitHub

```bash
# Navigate to your project directory
cd d:\Windows\Documents\carental

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/car-rental-system.git

# Rename main branch to 'main' (GitHub default)
git branch -M main

# Push code to GitHub
git push -u origin main
```

### Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. Check that the README.md displays properly

## 🔧 Alternative Setup Methods

### Method 1: Using GitHub CLI (if installed)

```bash
# Install GitHub CLI first: https://cli.github.com/
gh repo create car-rental-system --public --source=. --remote=origin --push
```

### Method 2: Using SSH (if SSH keys configured)

```bash
# Add SSH remote instead of HTTPS
git remote add origin git@github.com:YOUR_USERNAME/car-rental-system.git
git branch -M main
git push -u origin main
```

## 🚀 Enable GitHub Actions (CI/CD)

Your repository already includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`). To enable it:

1. **Go to your repository on GitHub**
2. **Click on "Actions" tab**
3. **Enable Actions** if prompted
4. **The workflow will run automatically** on every push to main branch

### What the CI/CD Pipeline Does:

- ✅ **Tests Backend:** Runs all backend tests
- ✅ **Tests Frontend:** Runs all frontend tests  
- ✅ **Builds Docker Image:** Creates production-ready container
- ✅ **Pushes to GHCR:** Uploads to GitHub Container Registry
- ✅ **Ready for Deployment:** Image available for production use

## 🔐 Setup GitHub Container Registry (GHCR)

### Step 1: Create Personal Access Token

1. **Go to GitHub Settings:**
   - Click your profile picture → Settings
   - Scroll down to "Developer settings"
   - Click "Personal access tokens" → "Tokens (classic)"

2. **Generate New Token:**
   - Click "Generate new token (classic)"
   - Note: `GHCR Access for car-rental-system`
   - Expiration: Choose appropriate duration
   - Scopes: Check `write:packages` and `read:packages`
   - Click "Generate token"
   - **SAVE THE TOKEN** (you won't see it again)

### Step 2: Configure Repository Secrets

1. **Go to Repository Settings:**
   - Navigate to your repository
   - Click "Settings" tab
   - Click "Secrets and variables" → "Actions"

2. **Add Repository Secrets:**
   ```
   Name: GHCR_TOKEN
   Value: [paste your personal access token]
   ```

### Step 3: Test the Workflow

```bash
# Make a small change and push to trigger the workflow
echo "# Car Rental System" >> README.md
git add README.md
git commit -m "docs: update README"
git push origin main
```

## 📦 Using the Built Docker Image

After successful CI/CD run, your Docker image will be available at:
```
ghcr.io/YOUR_USERNAME/car-rental-system:latest
```

### Pull and Run the Image:

```bash
# Login to GHCR
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/YOUR_USERNAME/car-rental-system:latest

# Run the container
docker run -p 3000:3000 ghcr.io/YOUR_USERNAME/car-rental-system:latest
```

## 🔄 Regular Workflow

### Daily Development:

```bash
# Make your changes
git add .
git commit -m "feat: your feature description"
git push origin main
```

### Feature Development:

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: implement new feature"

# Push feature branch
git push origin feature/new-feature

# Create Pull Request on GitHub
# Merge after review
```

## 🛠️ Troubleshooting

### Issue: "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH or setup SSH keys:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/car-rental-system.git
```

### Issue: "Authentication failed"

**Solution:** Use Personal Access Token:
1. Generate token with `repo` scope
2. Use token as password when prompted
3. Or use: `git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/car-rental-system.git`

### Issue: "Repository not found"

**Solution:** Check repository name and username:
```bash
git remote -v  # Check current remote
git remote set-url origin https://github.com/CORRECT_USERNAME/CORRECT_REPO_NAME.git
```

### Issue: GitHub Actions failing

**Common fixes:**
1. Check if GHCR_TOKEN secret is set correctly
2. Verify token has `write:packages` permission
3. Check workflow file syntax
4. Review Actions logs for specific errors

## 📋 Repository Settings Recommendations

### Branch Protection (Optional but Recommended):

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

### Security Settings:

1. Go to Settings → Security & analysis
2. Enable:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates

## 🎉 Success Checklist

- [ ] Repository created on GitHub
- [ ] Local code pushed to GitHub
- [ ] README.md displays correctly
- [ ] GitHub Actions workflow enabled
- [ ] GHCR token configured
- [ ] First workflow run successful
- [ ] Docker image available in GHCR
- [ ] Repository settings configured

## 📞 Next Steps

1. **Review the DEPLOYMENT.md** for production deployment
2. **Customize the README.md** with your specific details
3. **Add collaborators** if working in a team
4. **Setup branch protection** for production safety
5. **Configure deployment** to your production server

Your car rental system is now ready for collaborative development and automated deployment! 🚀