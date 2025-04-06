# LeCourse

An AI-powered Course Selector centered around a "LeBron James" AI Agent that helps students seamlessly choose the most suitable courses for an upcoming semester.

Created by Dhruv Chavan, Christine Chen, Lincoln Firks, and Eric Li for the Spring 2025 Luddy Hackathon

## Overview and Tech Stack

We built a web application with a React frontend and a Python FastAPI backend utilizing a SQLite database. For our AI, we used Google's Gemini API. 

## User Guide

LeBron James will guide you through your course selection in this AI-powered course selection tool. Simply select your major and type in what classes you have already been taken. At this point, classes unavailable due to insufficient prerequisites will be filtered out. Then, you will be taken to the dashboard in which you can choose to filter data by category you want to fill (GenEd, major), or even tell AI Lebron what classes you might be interested in. The tool is most powerful when combining filtering functionality with AI functionality, allowing you to narrow down exactly the courses you want.

## Usage

## Our process

Initially, we wanted to build a application that could work with Indiana University's real course schedule. We quickly learned that publicly available web pages with IU's courses are not very data friendly and would be a pain to clean up. We decided to generate some dummy course data for Hackathon purposes to allow us to spend our limited time on the app's functionality. 

Originally, we planned on incorporating locally-run LLM's into the project. After some testing, we discovered that small open-source models are often slower and much less useful than what we can access with API's on Google's free tier. 

In our initial meeting, we seemed to be happy with the plan we sketched out. The following day, we had to quickly iterate as things didn't go as planned. Hours got wasted on code that never ended up on the project. It was a valuable lesson for our young squad (all 4 of us are second-year students) that things won't always go according to plan but you have to be willing to adapt quickly. I believe we did that and I'm proud of the job we did. 


