DevTinder Backend
Backend REST API for DevTinder — manage developer profiles, connections, match logic, and notifications. Built with Node.js, Express, and MongoDB. Hosted on Render.

Table of Contents
Features

Tech Stack

API Overview

Getting Started

Project Structure

Environment Variables

Deployment

Contributing

License

Features
Secure JWT-based authentication

Profile creation, update, and retrieval

Sending and managing connection requests

Real-time notifications (via polling/webhooks)

Feed with suggested matches

MongoDB data persistence

Tech Stack
Backend Framework: Node.js, Express.js, socket.io

Database: MongoDB, Mongoose

Authentication: JWT

Deployment: Render

API Overview
API exposes endpoints for:

User registration and login

Profile CRUD operations

Sending, accepting, and rejecting connection requests

Fetching feed 



Getting Started
Prerequisites
Node.js (v18+)

MongoDB instance (local or remote)

Installation
bash
git clone https://github.com/shubhamkhatik/devtinder_backend.git
cd devtinder_backend
npm install
Running API Server
text
npm run dev
API will be available at http://localhost:8080.

Environment Variables
Create a .env in the root of the project:

DB_CONNECTION_SECRET=
PORT=5452
JWT_SECRET=
BCRYPT_SALT_ROUNDS=10
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

Deployment
Render Setup:

Push your backend repo to GitHub

Connect Render service to repo

Set environment variables in Render dashboard





## 🙏  Acknowledgments

Inspired by Akshay Saini’s DevTinder tutorial series