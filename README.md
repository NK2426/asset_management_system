# 🏢 Asset Management System

This is a web-based Asset Management System built using **Node.js**, **Express**, **PostgreSQL**, **Sequelize ORM**, **Jade (Pug)** templating, **Bootstrap**, and **DataTables.net**. The system helps manage the lifecycle of company assets—from purchase to scrapping—and track their financial utilization over time.

---

## 🚀 Features

- 📋 **Asset Management** – Add, update, and list company assets.
- ♻️ **Scrap Asset** – Mark an asset as obsolete and exclude it from all active views except reports.
- 📜 **Asset History** – View the full lifecycle of an asset: purchase → allocation → transfer → maintenance → scrap.
- 📊 **Reports** – Searchable, sortable, and paginated data tables using DataTables.net.
- ✅ Follows **MVC Architecture**.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Templating Engine:** Jade (Pug)
- **Styling:** Bootstrap 5, CSS
- **Table UI:** DataTables.net

---
## how to run
# 1. Clone the repository
git clone https://github.com/NK2426/asset_management_system.git
cd asset-management-system

# 2. Install dependencies
npm install

# 3. Configure your database in .env or directly in config
# Example .env values:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=yourpassword
# DB_NAME=asset_management

# 4. Start the application
npm start

# hit url

http://localhost:3090/login

#  Login Credentials
Username: admin@ams.com

Password: test123