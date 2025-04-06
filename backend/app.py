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

load_dotenv()
API_KEY = os.getenv("API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)


app = FastAPI()


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
       
        courses_taken_str = generate_content(init_student_prompt + request.courses_taken)
        if not courses_taken_str:
            raise HTTPException(status_code=400, detail="Could not process courses taken.")
        # should return string class IDs separated by commas
        courses_taken = courses_taken_str.split(",")

        print("AI RESPONSE:")
        print(courses_taken)

        # TODO: verify each course

        con = sqlite3.connect("CourseScheduler.db")
        cur = con.cursor()

        # (credit hours, GenEd)
        courses_taken_to_send = []
        for course_id in courses_taken:
            print(f"Querying for CourseID: {course_id}")
            cur.execute("""
            SELECT CreditHours, GenEd
            FROM Courses
            WHERE CourseID = ?
            """, (course_id,))
            res = cur.fetchall()
            print(res)
            courses_taken_to_send.extend(res)
    

        placeholders = ','.join(['?'] * len(courses_taken))

        cur.execute(f"""
        SELECT SUM(CreditHours)
        FROM Courses
        WHERE Field = ? AND CourseID IN ({placeholders}) 
        """, (request.major, *courses_taken))

        taken = cur.fetchone()[0]

        cur.execute("""
            SELECT SUM(CreditHours)
            FROM Courses
            WHERE Field = ?
        """, (request.major,))

        total_needed = cur.fetchone()[0]

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

        # TODO make sure you send properly created list of CourseInfo
        print(courses_taken_to_send)
        return StudentInfoResponse(init_response=courses_taken_to_send, major_credits=(taken,total_needed), all_courses_not_taken=all_courses_not_taken)
        
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
    model_output = generate_content(fetch_classes_prompt + request.prompt).strip().split(", ")
    print(model_output)
     
    courseinfo = filterData(request.criteria, model_output)
    print(request.criteria)

    return CourseFilterResponse(filtered_courses=courseinfo)
    

def filterData(attributes: list[str], courses: list[str]) -> list[CourseInfo]:

    conn = sqlite3.connect('CourseScheduler.db')
    cursor = conn.cursor()

    # Fetch everything if no filter specified
    if not attributes and not courses: 
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

          

    attribute_placeholders = ','.join('?' for _ in range(len(attributes)))
    courses_placeholders = ','.join('?' for _ in range(len(courses)))

    if not attributes:
        cursor.execute(
            f"SELECT * FROM Courses WHERE CourseID IN ({courses_placeholders})", 
            tuple(courses)  
        )
    elif not courses:
        cursor.execute(
            f"SELECT * FROM Courses WHERE Field IN ({attribute_placeholders})", 
            tuple(attributes)  
        )
    else:
        cursor.execute(
        f"SELECT * FROM Courses WHERE GenEd IN ({attribute_placeholders}) AND CourseID IN ({courses_placeholders})", tuple(attributes + courses))
    
 
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

