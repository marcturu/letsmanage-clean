# <img src="screenshots/LetsManage.png" alt="LetsManage" width="150"/> — Management App for Football Coaches

<sub>🗓️ Final Thesis developed in January 2025</sub>

This project is a **full-stack web application** that allows football coaches to **organize teams, players, trainings, and matches**.  
Coaches can track player needs, plan training sessions, and design match strategies for improved performance.

---

## ✅ Features

- **User registration & login** system.
- **Team & Player Management**: Create, edit, and manage teams and players.  
- **Training Planning**: Schedule training sessions and select from a wide range of exercises.  
- **Match Preparation**: Build lineups, review pre-game insights, and record post-match data for team and player analysis.     
- **Modern Web Stack**:  
  - **Frontend**: React (deployed on **Vercel**)  
  - **Backend**: Node.js/Express (deployed on **Heroku**). The service is available only while the dynos are running, which typically incurs a cost of roughly $0.010 per hour.
- **Cloud Database**: Uses **[Firebase](https://console.firebase.google.com/u/0/project/letsmanage-e2725/overview)** for real-time data storage (Google Cloud). A billing account with available credit is required for the service to operate.  
- **Responsive Design** for desktop and tablet use.
- Scrum format tracked through [Taiga](https://tree.taiga.io/project/marcturu-letsmanage/timeline) (last images in the README).

> **ℹ️ Project status:**  
> This project was originally developed in **late 2024** and **throughout 2025**, with a strong focus on functionality, software architecture, and project management. As my design and UX/UI skills have evolved since then, some aspects of the current UI and visual design could be further refined. The screenshots and demo therefore reflect the state of the application at the time of its development rather than my current design standards. Improving the UI/UX would be one of the main areas I would address in a future iteration.


---

## 🛠 Installation & Setup

### a0. Prerequisites
Make sure you have installed:
- **Node.js 18** or higher
- **npm** (comes with Node)

Check versions:
```bash
node -v
npm -v
```

### a1. Clone the repository
```bash
git clone https://github.com/marcturu/letsmanage-clean.git
cd letsmanage-clean
```

### a2. Firebase configuration
1. Copy the example file to create your real `.env`:
```bash
cd backend
cp .env.example .env
```
3. Access [Google Cloud Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) of the LetsManage project.
4. Create a **Service Account Key (JSON)** if you don't already have one. 
5. Add the credentials to the `.env` file.

### a3. Run locally
Open two terminals and start **frontend** and **backend**:

```bash
# In /backend
npm install
npm start

# In /frontend
npm install
npm start
```

The app will be available at **http://localhost:3000** (frontend) and **http://localhost:5000** (backend).  

### b1. Try the web application
You can try the application using either the Vercel deployment (for visual testing in the browser) or the Heroku deployment (to test API routes).

- **Vercel (browser testing):**  
  WebApp: [https://lets-manage-lake.vercel.app/](https://lets-manage-lake.vercel.app/)  
  Project on Vercel: [https://vercel.com/marcs-projects-4add0205/lets-manage](https://vercel.com/marcs-projects-4add0205/lets-manage)

- **Heroku (API testing):**  
  [https://lets-manage-7d2ea4f309ff.herokuapp.com/](https://lets-manage-7d2ea4f309ff.herokuapp.com/) 

> ℹ️ **Note:** For the Heroku deployment to work, the dynos must be active.  
> 1. Go to [Heroku Dashboard](https://dashboard.heroku.com/apps/lets-manage/)  
> 2. Navigate to **Resources** and activate the dynos.

> ℹ️ **Checking for errors:**  
> 1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)  
> 2. Run `$ heroku login`  
> 3. Run `$ heroku logs --tail -a lets-manage`

### c1. Watch the Demo
🎥 **A [Recorded Demo](https://www.dropbox.com/scl/fi/1v3ebhhl6el0m06dv9ois/Demo-TFG.mkv?rlkey=lrag32bxkw3mcgj7y3qejwunz&e=1&st=5mnw1007&dl=0) is also available**.

--- 

#### The **[Original repo](https://github.com/marcturu/LetsManage)** is private due to privacy and confidentiality reasons,  
#### as well as the deployed source code for the **[Frontend repo](https://github.com/marcturu/deploy-frontend)** and the **[Backend repo](https://github.com/marcturu/deploy-backend)**.

---

## 📂 Documentation

All additional documentation is in the `/DOCS` directory:
- **Context & Scope**  
- **Methodology & Architecture**  
- **Specification & Design**  
- **Implementation Details**  
- **Testing Strategy**  
- **Project management**  
- **Public Defense & Extras**  

Thesis grade: **8.3** (details in `/GRADES`).

---
## 📷 Screenshots 

### Main Page:
![Main](screenshots/main.png)

### Register:
![Register](screenshots/register.png)

### Log in:
![Login](screenshots/login.png)

### Home:
![Home](screenshots/home.png)

### Profile:
![MainPage](screenshots/profile.png)

### Clubs:
![MainPage](screenshots/clubs.png)

### Exercise(s):
![Exercise0](screenshots/exercise0.jpg)
![Exercise1](screenshots/exercise1.png)

### Team(s):
![Team0](screenshots/team0.png)
![Team1](screenshots/team1.jpg)
![Team2](screenshots/team2.png)
![Team3](screenshots/team3.png)
![Team4](screenshots/team4.jpg)

### Player(s):
![Player0](screenshots/player0.png)
![Player1](screenshots/player1.png)
![Player2](screenshots/player2.jpg)

### Match(es):
![Match0](screenshots/match0.jpg)
![Match1](screenshots/match1.jpg)
![Match2](screenshots/match2.jpg)
![Match3](screenshots/match3.jpg)
![Match4](screenshots/match4.jpg)

### Training(s):
![Training0](screenshots/training0.png)
![Training1](screenshots/training1.png)
![Training2](screenshots/training2.jpg)

### Select file:
![SelectFile](screenshots/select_file.jpg)

### Select club:
![SelectClub](screenshots/select_club.jpg)

### Select formation:
![SelectFormation](screenshots/select_formation.jpg)

---
### Use Cases Diagram:
![UseCasesDiagram](screenshots/use_cases_diagram.png)

### Conceptual Data Model:
![ConceptualDataModel](screenshots/conceptual_data_model.png)

### Class Dessign Model:
![ClassDesignModel](screenshots/class_design_model.png)

### Physical Architecture Model:
![PhysicalArchitectureModel](screenshots/physical_architecture_model.png)

### Database Interaction Example:
![DatabaseInteractionExample](screenshots/database_interaction_example.png)

### 201 Created Code Example:
![201CreatedCodeExample](screenshots/201_created_code_example.png)

### Gantt Chart:
![GanttChart](screenshots/gantt_chart.png)

---
### Taiga:
![Taiga0](screenshots/taiga0.jpg)
![Taiga1](screenshots/taiga1.jpg)
![Taiga2](screenshots/taiga2.jpg)

---

## ⚖️ Copyright & License

© 2025 Marc Turu Roca. All rights reserved.

This project and its contents are the exclusive intellectual property of Marc Turu Roca.  
All rights reserved. No part of this project may be copied, modified, distributed, or used without prior written permission from the author.
