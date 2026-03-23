👥 Team Members & Folder Structure

This repository is organized so each team member has their own dedicated folder for development and responsibility ownership.

GearUP-Vehicle-Rental-App/

│
├── arya/ → Arya’s lead components (Security architecture, CI/CD pipeline, Infrastructure stability)
├── tanveer/ → Tanveer’s development (Authentication, Firebase integration, Testing)
├── shared/ → Shared configs, constants, and reusable modules
🧭 Collaboration Rules
Each member works only in their assigned folder to avoid merge conflicts
Shared files go into the shared/ folder
Inform the team before editing shared files
Regular git pull to stay updated
Use pull requests for major updates
🚗 Project Overview

GearUP is a secure, scalable web-based vehicle rental application designed to streamline booking and vehicle management.

In Studio 4, the focus is on security, deployment, testing, and system stability rather than just building features.

🎯 Project Goals
Build a secure and scalable system
Implement strong authentication and data protection
Apply OWASP Top 10 security practices
Automate deployment using CI/CD pipelines
Ensure smooth and responsive UI/UX
Maintain reliable real-time data using Firebase
🧩 Technologies Used
React.js
Firebase
HTML5, CSS3, JavaScript (ES6)
GitHub Actions (CI/CD)
Docker
VirtualBox (Linux environment)
VS Code
🔐 Studio 4 Enhancements (Key Contribution – Arya)
🔒 Security Implementation
I designed the system using a security-first approach
I mapped and mitigated OWASP Top 10 vulnerabilities
I secured frontend logic using Firebase rules and validation
Reduced risks like injection, broken authentication, and data exposure
⚙️ CI/CD Pipeline
I built a GitHub Actions automated pipeline
Removed manual deployment issues
Added:
Build validation
Security checks
Controlled deployment
🖥️ Environment Stability
I used VirtualBox with Linux for environment isolation
I implemented Docker containers for consistency
Solved “works on my machine” problems
🧪 Testing (Tanveer)
Responsible for testing all modules
Performs functional and API testing
Ensures system reliability before deployment
🏗️ Current Progress (Studio 4)
✅ Secure architecture implemented
✅ CI/CD pipeline working
✅ Firebase integration completed
✅ UI and booking system functional
🔄 Security testing in progress
🔄 Deployment optimization ongoing
🌱 Sustainability & SDG Alignment
Environmental: Promotes shared mobility → reduces emissions
Social: Improves accessibility
Economic: Supports small rental businesses
🌍 SDGs
SDG 11: Sustainable Cities
SDG 13: Climate Action
SDG 8: Economic Growth
⚙️ How to Run Locally
git clone https://github.com/arya4100/GearUP-Vehicle-Rental-App-master.git
cd GearUP-Vehicle-Rental-App/
npm install
npm start
🧑‍💻 Contribution Guidelines
Work in your own folder
Use clear commit messages
Use pull requests
Maintain security and code quality
Do not modify others’ work without discussion
📅 Project Details
Project: GearUP Vehicle Rental App
Course: Studio 4 — Application Development & Integration
Institution: Otago Polytechnic (Future Skills, Auckland)
👨‍💻 Team Members
Arya — Lead (Security, CI/CD, Infrastructure)
Tanveer — Dev (Auth, Firebase, Testing)


📌 Future Improvements
Payment gateway integration
Admin dashboard
Vehicle owner panel
Push notifications
Monitoring & logging system
