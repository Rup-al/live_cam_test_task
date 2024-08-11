# Live Cam App

## Overview
This is a React application that allows users to view shared camera on Angelcam server and also view recorded video.

## Features
- **Register Page**: Users can register to access specific shared camera videos.
- **Login Page**: After successful registration, users can log in and be redirected to the shared camera list page.
- **Shared Camera List Page** : Users can view all live and snapshot videos from shared cameras linked to their Personal Access Token.
- **Shared Camera Recorded Video Page** : Users can click on any shared video to view recorded footage by entering the start and end date/time.



## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Rup-al/live_cam_test_task.git
   cd live_cam_test_task

## Frontend -------------------------

## Frontend Prerequisites
   - npm

## Frontend Technologies
- ReactJS
- Material UI 5   

## For Frontend Steup and Run

   - cd live_cam_test_task/frontend/livecam
   - and run "npm install"
   - and run "npm start"

## For access React (Frontend) server
   
   http://localhost:3000    

## For Frontend changes in .env file
   - cd live_cam_test_task/frontend/livecam
     edit .env file

   - REACT_APP_PERSONAL_ACCESS_TOKEN=angelcam personal access token
   - REACT_APP_API_URL=http://127.0.0.1:8000/api

## Backend -------------------------

## Backend Prerequisites
   - Python 3.x
   - Django 3.x or 4.x
   - Pip

## Backend Technologies
   - Python
   - Django
   - MongoDB

## For Backend Steup and Run

   - cd live_cam_test_task/backend/backend_api/api
   - and run "pip install -r requirements.txt"
   - and run "python3 manage.py migrate"
   - and run "python3 manage.py createsuperuser"
   - and run "python3 manage.py runserver"

## For access Django (Backend) server
   
   http://127.0.0.1:8000   

## For Backend changes in .env for
   - cd live_cam_test_task/backend_api/api
     edit .env file

   - DATABASE_NAME=mydatabase
   - APP_PERSONAL_ACCESS_TOKEN=angelcam personal access token
   - CLIENT_ID=client id
   - APP_GET_ALL_SHARED_CAMERAS_API=https://api.angelcam.com/v1/shared-cameras/
   - APP_GET_ANGELCAM_USER_AUTH_API=https://my.angelcam.com/oauth/token/
   - EMAIL_HOST_USER="email id"
   - EMAIL_HOST_PASSWORD="password"
   - DEFAULT_FROM_EMAIL="email id"


  
  