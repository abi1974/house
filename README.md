# Kallada Resorts – Real Estate Website

## 📌 Project Overview

Kallada Resorts is a modern real estate platform designed for showcasing houses and enabling customers to explore, book visits, and connect with customer support. The project uses **React** as the frontend framework and **Django** as the backend for authentication and data handling.

The entire frontend is designed as a **single-page website** with smooth navigation across multiple sections.

---

## 🚀 Technologies Used

### Frontend (React)

* **React.js** → For building the user interface.
* **Tailwind CSS** → For modern and responsive styling.
* **React Hooks** → For managing state.
* **Axios** → For making API calls to the backend.

### Backend (Django)

* **Django** → For handling business logic and authentication.
* **Django REST Framework (DRF)** → For building REST APIs.
* **SQLite/PostgreSQL** → Database for storing users, houses, and reviews.
* **JWT Authentication** → For secure login and signup functionality.

---

## ✨ Features

### 🔹 Homepage

* Displays **company name**: `Kallada Resorts`.
* Short description with **Mission & Vision**.
* Attractive **background image** for branding.

### 🔹 Houses Section

* Showcases different houses with:

  * 📍 Location
  * 🖼️ Images
  * 💰 Prices
  * 🏡 Features
* Houses displayed inside styled **cards/boxes**.

### 🔹 Booking Section

* Customers can **book a visit** to view houses.
* Booking form includes **date, time, and house selection**.

### 🔹 About Page

* Company details:

  * Vision, values, and services.
  * Information about **founders**.
* Professional design with structured layout.

### 🔹 Customer Service

* Rating system (**1 to 10**).
* Review writing box.
* Emergency contact number prominently displayed.

### 🔹 Authentication

* **Login / Signup pages** powered by Django backend.
* Secure user data storage.
* JWT-based authentication system.

---

## ⚙️ Installation & Setup

### Prerequisites

* **Node.js & npm** installed.
* **Python 3 & Django** installed.

### Frontend Setup (React)

```bash
# Clone repository
git clone <repo-link>
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

### Backend Setup (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python manage.py runserver
```

---

## 📷 Preview

* **Homepage** → Background with mission & vision.
* **Houses** → Grid of houses with images & details.
* **Booking Form** → Date/time picker for visit booking.
* **About Page** → Company details & founders.
* **Customer Service** → Rating & review system.
* **Authentication** → Secure login/signup forms.

---
<img width="1259" height="792" alt="Screenshot 2025-09-01 152336" src="https://github.com/user-attachments/assets/d836edcc-9afb-44e2-a926-59cd5f3942b0" />

## 🔮 Future Enhancements

* Integration with **payment gateway** for booking fees.
* Adding **Google Maps API** for house locations.
* Push notifications for booking reminders.
* Admin dashboard for managing houses & reviews.

---

## 👨‍💻 Authors

* **Kallada Resorts Dev Team**
* Frontend: React Developers
* Backend: Django Developers
