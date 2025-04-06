# LeCourse

An AI-powered Course Selector centered around a "LeBron James" AI Agent that helps students seamlessly choose the most suitable courses for an upcoming semester.

Created by Dhruv Chavan, Christine Chen, Lincoln Firks, and Eric Li for the Spring 2025 Luddy Hackathon

## Overview and Tech Stack

We built a web application with a React frontend and a Python FastAPI backend utilizing a SQLite database. For our AI, we used Google's Gemini API. 

## User Guide

LeBron James will guide you through your course selection in this AI-powered course selection tool. Simply select your major and type in what classes you have already taken. At this point, classes unavailable due to insufficient prerequisites, and the classes that you have already taken will be filtered out. Then, you will be taken to the dashboard in which you can tell AI Lebron what classes you might be interested in. Based on your interests, AI Lebron will suggest courses to you. Finally, you have the option to hold onto the suggested courses, and even print out a schedule with all the classes you have selected in a pdf file.

## Usage

You will need to run both the frontend and backend for the full LeCourse experience. This can be done on the same machine, so feel free to try LeCourse out!

### Frontend Setup
Before running this project, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

```npm install```
> Run this command to install all required packages
```npm start```
> Run this command to compile the program

### Backend Setup

```
API_KEY=GRAB_THIS_FROM_GOOGLE_AI_STUDIO
GEMINI_MODEL=ALSO_GRAB_THIS_FROM_GOOGLE_AI_STUDIO
```
> In the `/backend` directory, create a `.env` file with the following format. As specified in `/backend/.gitignore`, this file will be ignored by git. Replace the dummy values with a proper Google AI api key and Gemini model.
```
pip install uvicorn pydantic fastapi typing sqlite3 dotenv google.generativeai
```
> Run this command to install all the libraries for the Python scripts. 
```
uvicorn app:app --reload
```
> Run this command to run the backend, the default is be on `http://localhost:8000`.

## Our process

Initially, we wanted to build a application that could work with Indiana University's real course schedule. We quickly learned that publicly available web pages with IU's courses are not very data friendly and would be a pain to clean up. We decided to generate some dummy course data for Hackathon purposes to allow us to spend our limited time on the app's functionality. 

Originally, we planned on incorporating locally-run LLM's into the project. After some testing, we discovered that small open-source models are often slower and much less useful than what we can access with API's on Google's free tier. 

In our initial meeting, we seemed to be happy with the plan we sketched out. The following day, we had to quickly iterate as things didn't go as planned. Hours got wasted on code that never ended up on the project. It was a valuable lesson for our young squad (all 4 of us are second-year students) that things won't always go according to plan but you have to be willing to adapt quickly. I believe we did that and I'm proud of the job we did. 


