# ⚡ PulseVibe — Gamified Anonymous Employee Sentiment & Real-Time Analytics

[![Live Application](https://img.shields.io/badge/Live_App-Open_PulseVibe-0ea5e9?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ais-pre-kcimjdjmbrwrbeop3kxgza-750302056093.asia-southeast1.run.app)
[![Status](https://img.shields.io/badge/Status-Live_&_Deployed-10b981?style=for-the-badge)](https://ais-pre-kcimjdjmbrwrbeop3kxgza-750302056093.asia-southeast1.run.app)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Anonymous-6366f1?style=for-the-badge)](https://ais-pre-kcimjdjmbrwrbeop3kxgza-750302056093.asia-southeast1.run.app)
[![License](https://img.shields.io/badge/License-Apache_2.0-slate?style=for-the-badge)](LICENSE)

> 🔗 **Direct Live Link**: [https://ais-pre-kcimjdjmbrwrbeop3kxgza-750302056093.asia-southeast1.run.app](https://ais-pre-kcimjdjmbrwrbeop3kxgza-750302056093.asia-southeast1.run.app)  
> *Click the link above to test the live application directly in your browser on desktop or mobile!*

---

## 📌 Executive Summary

Traditional workplace surveys suffer from two fatal flaws: **fear of retaliation** and **abysmal completion rates**. 

**PulseVibe** transforms employee feedback into a frictionless, 60-second weekly habit by pairing **strict mathematical anonymity** with an **addictive gamification engine** (streaks, experience points, milestone badges, and mystery rewards). Simultaneously, team leaders and HR executives receive **real-time trend intelligence**, cross-departmental benchmark matrices, and **one-click exportable PDF briefings** for executive leadership meetings.

---

## 🚀 Key Features

### 1. 🛡️ 100% True Anonymity & Psychological Safety
* **Zero PII Collection**: No email addresses, user IDs, IP addresses, or device fingerprints are attached to survey responses.
* **Aggregated Differential Reporting**: Feedback and metrics are only reported for cohorts with $n \ge 3$ respondents, preventing individual deduplication.
* **Immutable Submissions**: Responses cannot be edited or retroactively linked.

### 2. 🎮 Gamification Engine (High Participation Rates)
* **Weekly Streak Counter**: Visual streak tracker with animated flame multipliers to encourage weekly habit formation.
* **XP & Level Progression**: 
  * Earn **+150 XP** for timely completion and **+50 XP** bonus for constructive written thoughts.
  * 5 Progression Tiers: *Pulse Observer* $\rightarrow$ *Squad Voice* $\rightarrow$ *Culture Advocate* $\rightarrow$ *Streak Sentinel* $\rightarrow$ *Culture Legend*.
* **Milestone Badges**: Unlockable achievements (*First Voice*, *Streak Sentinel*, *Pulse Champion*, *Truth Teller*, *Culture Catalyst*, *Loyalty Beacon*).
* **Interactive Celebrations**: Confetti particle explosions on submission via `canvas-confetti` and synthesized harmonic Web Audio chimes.
* **Mystery Reward Spin**: Spin wheel awarding lucky bonus XP for consecutive check-ins.
* **Department Camaraderie**: Department participation leaderboard celebrating high-engagement squads.

### 3. ⏱️ 60-Second Micro-Pulse Survey
* **Visual Mood Spectrum**: Interactive 5-point sentiment selector (*Drained*, *Low*, *Steady*, *Good*, *Thriving*).
* **eNPS Slider**: Employee Net Promoter Score tracking (0–10 scale: Promoters, Passives, Detractors).
* **Stress & Burnout Diagnostics**: Early detection of team burnout vs. sustainable workload.
* **Psychological Safety Scale**: Measuring comfort with risk-taking and candid discussion.
* **Quick-Tap Tags**: Categorize feedback by `#MeetingFatigue`, `#WorkLifeBalance`, `#LeadershipClarity`, `#Recognition`, etc.
* **Anonymous Open-Ended Box**: Safe space for qualitative suggestions.

### 4. 📊 Real-Time Manager Dashboard & Historical Trends
* **Executive Metric Cards**: Sentiment Index (1–5), eNPS (+42), squad participation rates, and psychological safety score.
* **Interactive 8-Week Trend Trajectory**: SVG vector line & area chart tracking weeks 34 to 41 with metric switching, department filtering, and hover tooltips.
* **Department Performance Matrix**: Side-by-side comparison across Engineering, Product, Design, Sales, Marketing, and Operations.
* **Closed-Loop Action Tracker**: Managers can publicly post "Action Taken" notes directly beneath anonymous feedback, proving to employees that their input drives change.
* **Simulate Check-In Tool**: Instant test data injector to preview real-time charts updating live.

### 5. 🔔 Push Notification Reminder Engine
* **Web Push API**: Native browser push notifications (`Notification.requestPermission()`).
* **Custom Scheduling**: Select preferred reminder day (e.g. Friday) and time (e.g. 14:00).
* **Instant Test Reminder**: Send an on-demand system notification banner and audio chime to verify delivery.

### 6. 📄 Exportable Executive PDF Reports
* Built-in vector PDF generator powered by `jspdf`.
* Generates a 2-page executive report complete with:
  * Executive Overview & Company Health Assessment
  * KPI blocks (Sentiment, eNPS, Participation, Safety)
  * Department breakdown table with headcount and week-over-week deltas
  * 8-Week trend trajectory table
  * Curated thematic anonymous employee quotes
  * Concrete leadership action recommendations

---

## 📐 Architecture & Tech Stack
