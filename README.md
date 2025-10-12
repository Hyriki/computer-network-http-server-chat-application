# Project Git & GitHub Workflow Guide

Welcome to the team!

To ensure our project stays stable, organized, and easy to collaborate on, all team members must follow this standard workflow. This guide will walk you through the process step-by-step.

> **The Golden Rule: NEVER push your code directly to the `main` branch. All changes must be submitted through a Pull Request.**

The `main` branch is our source of truth. It should always contain stable, working code. All development will happen on separate feature branches.

---

## Standard Workflow (Mandatory)

### Step 1: Sync Your Local Code with `main`

Before starting any new task, make sure you have the latest version of the project's code.

```bash
git checkout main
git pull origin main
Step 2: Create Your Personal Working Branch
From the main branch, create a new branch for the feature or bug you are working on. Name your branch after yourself or the feature you are building (e.g., john-doe or feature/login-page).

Bash

# Replace <your-branch-name> with your chosen name
git checkout -b <your-branch-name>
You are now on your own branch and can code safely without affecting anyone else's work.

Step 3: Code and Commit Your Changes
After you have completed a part of your task, save your progress by committing your changes.

Bash

# 1. Add all the files you have modified
git add .

# 2. Commit your changes with a clear, descriptive message
git commit -m "Feat: Implement the user login interface"
Step 4: Push Your Branch to GitHub
When you are ready to share your work, push your branch to the remote repository on GitHub.

Bash

# Replace <your-branch-name> with the actual name of your branch
git push -u origin <your-branch-name>
(Note: The -u flag is only needed the first time you push a new branch. For subsequent pushes on the same branch, you can just use git push.)

Step 5: Create a Pull Request (PR)
Go to the project's repository page on GitHub.

You will see a yellow notification bar with a button to "Compare & pull request". Click it.

Give your Pull Request a clear title and a brief description of the changes you made.

Finally, click "Create pull request".

Your team lead will then review your code and merge it into the main branch once it's approved.

TL;DR - Command Summary
Here is the entire workflow summarized in commands. Copy and run them in order.

Bash

# 1. Go to the main branch and get the latest updates
git checkout main
git pull origin main

# 2. Create and switch to your new branch (replace <your-branch-name>)
git checkout -b <your-branch-name>

# --- Start coding your feature here ---

# 3. When done, save your changes
git add .
git commit -m "A short description of what you did"

# 4. Push your branch to the remote repository
git push -u origin <your-branch-name>

# 5. Go to the GitHub website to open a Pull Request.
