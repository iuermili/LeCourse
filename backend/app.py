import json
import requests
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from typing import List, Tuple
from prompts import init_student_prompt, fetch_classes_prompt
from postModels import CourseInfo, StudentInfoRequest, StudentInfoResponse, CourseFilterRequest, CourseFilterResponse
import sqlite3
import google.generativeai as genai
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
API_KEY = os.getenv("API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],            # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],              # allow all HTTP methods
    allow_headers=["*"],              # allow all headers
)


# sends prompt to gemini
def generate_content(prompt: str):
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(status_code=401, detail=f"{e}")

    

# fastapi deserializes json automatically
@app.post("/init_student", response_model=StudentInfoResponse)
# receive request.undergrad, request.major, request.courses_taken
def init_student(request: StudentInfoRequest):
    con = None
    try:
        if request.courses_taken:

            courses_taken_str = generate_content(init_student_prompt + request.courses_taken)
        else:
            courses_taken_str = ""

        # should return string class IDs separated by commas
        courses_taken = courses_taken_str.split(",")

        # TODO: verify each course

        con = sqlite3.connect("CourseScheduler.db")
        cur = con.cursor()

        fstring = ", ".join(['?'] * len(courses_taken))

        cur.execute(f"""
            DELETE FROM Courses
            WHERE Prerequisites != "" AND Prerequisites NOT IN ({fstring})
        """, courses_taken)

        
        course_ids_to_delete = [(course_id,) for course_id in courses_taken]

        # Execute the DELETE statement for all course IDs in one go
        cur.executemany("""
            DELETE FROM Courses
            WHERE CourseID = ?
        """, course_ids_to_delete)

        con.commit()
        
        cur.execute(
        "SELECT * FROM Courses")
        rows = cur.fetchall()
        all_courses_not_taken = [
            CourseInfo(
                code=row[0], 
                name=row[1], 
                field=row[2], 
                credits=row[3], 
                prerequisites=row[4], 
                time=row[5], 
                days=row[6], 
                gened=row[7]
            ) 
            for row in rows
]
        return StudentInfoResponse(all_courses_not_taken=all_courses_not_taken)
        
    except HTTPException as e:
        print(f"Caught HTTPException: {e.detail}")
        raise e
    except sqlite3.DatabaseError as e:
        print(f"Database error occurred: {e}")
        # Optionally re-raise or return an error response depending on your needs
        raise HTTPException(status_code=500, detail="Database error occurred.")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
    finally:
        # Close the connection, even if there was an error
        if con:
            con.close()


@app.post("/fetch_classes", response_model=CourseFilterResponse)
def fetch_classes(request: CourseFilterRequest):
    print(request)
    if request.prompt: 
        model_output = generate_content(fetch_classes_prompt + request.prompt).strip().split(", ")
    else:
        model_output = ""
    courseinfo = filterData(model_output)
    return CourseFilterResponse(filtered_courses=courseinfo)

    

def filterData(courses: list[str]) -> list[CourseInfo]:

    conn = sqlite3.connect('CourseScheduler.db')
    cursor = conn.cursor()

    # Fetch everything if no filter specified
    if not courses: 
        cursor.execute(
        "SELECT * FROM Courses")
        rows = cursor.fetchall()
        all_courses = [
            CourseInfo(
                code=row[0], 
                name=row[1], 
                field=row[2], 
                credits=row[3], 
                prerequisites=row[4], 
                time=row[5], 
                days=row[6], 
                gened=row[7]
            ) 
            for row in rows
        ]
        return all_courses

          

    courses_placeholders = ','.join('?' for _ in range(len(courses)))

    cursor.execute(
    f"SELECT * FROM Courses WHERE CourseID IN ({courses_placeholders})", tuple(courses))
    
 
    rows = cursor.fetchall()
    result = [
        CourseInfo(
            code=row[0], 
            name=row[1], 
            field=row[2], 
            credits=row[3], 
            prerequisites=row[4], 
            time=row[5], 
            days=row[6], 
            gened=row[7]
        ) 
        for row in rows
    ]


    conn.close()
    return result

