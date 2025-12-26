# Project Overview

This project is a Full Stack Learning Management System (LMS) developed using Django (Backend) and React (Frontend).
The system supports role-based authentication and allows Admins, Instructors, and Students to interact with courses according to their permissions.

The LMS provides secure authentication using JWT, course management features, student enrollment, dashboards, and profile management.

This project is built as part of an academic assignment to demonstrate understanding of:

REST APIs

JWT Authentication

Role-based access control

Frontend–Backend integration

## Features
Authentication & Authorization

User Registration

User Login using JWT

Secure token-based authentication

Logout functionality

Role-based access control (Admin, Instructor, Student)
# User & Profile Management

View user profile

Update profile information

Change password

Role-specific profile data

Student → enrolled courses

Instructor → created courses

Admin → total users

# LMS Core Features

Course Management (Create, Update, Delete)

Course Category Management

Instructor–Course relationship

Student Enrollment System

Prevent duplicate enrollments

Role-based course visibility

# Dashboards

Admin Dashboard

User list

Role management

Instructor Dashboard

Manage own courses

Edit and delete courses

Student Dashboard

View enrolled courses

# Password Management

Forgot password

Reset password using email token

Secure password hashing

## Tech Stack
Backend

Python

Django

Django REST Framework (DRF)

SimpleJWT (JWT Authentication)

SQLite (Development Database)

Frontend

React (Vite)

React Router

Axios

Tailwind CSS

Other Tools

Django Admin Panel

REST APIs

JWT (JSON Web Tokens)

## Setup Instructions
Backend Setup (Django)

Clone the repository:

git clone <#>
cd backend


Create and activate virtual environment:

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Run migrations:

python manage.py makemigrations
python manage.py migrate


Create superuser:

python manage.py createsuperuser


Run the server:

python manage.py runserver


Backend will run at:

http://127.0.0.1:8000/

🔹 Frontend Setup (React)

Go to frontend directory:

cd frontend


Install dependencies:

npm install


Run development server:

npm run dev


Frontend will run at:

http://localhost:5173/

## API Integration

Frontend communicates with backend via REST APIs

JWT tokens are stored securely in localStorage

Axios interceptors are used to attach tokens automatically

## Roles & Permissions Summary
Role, Permissions, Admin, Manage users, view all courses, Instructor Create, edit, delete own courses, Student View courses, enroll, view enrolled courses