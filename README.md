# DogShare 🐕

DogShare is a social network designed for dog owners to showcase their pets, share posts, and connect with other dog lovers.

> **Project Status:** Backend architecture is ~90% complete. Frontend development is currently in progress to deliver a clean, polished UI.

---

## 🛠️ Tech Stack

* **Backend:** C# / .NET
* **Database:** Entity Framework Core & SQL Server
* **Frontend:** HTML5, CSS3, JavaScript

---

## 🚀 Setup & Getting Started

### 1. Database Configuration
1. Open the solution in Visual Studio or your preferred IDE.
2. Create a local SQL Server database.
3. Open `appsettings.json` and update the connection string to match your local SQL Server instance:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=DogShareDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
2. Run Database Migrations
Open the Package Manager Console in Visual Studio (or use the .NET CLI) and run:

Bash
Add-Migration InitialCreate
Update-Database
3. Run the Application
Start the backend server so the API endpoints are active.

Navigate to the frontend/ folder.

Open index.html in your browser to start browsing the feed!
