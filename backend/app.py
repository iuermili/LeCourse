import json
import requests
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from typing import List, Tuple
from prompts import initial_context_prompt, init_student_prompt, fetch_classes_prompt
from postModels import CourseInfo, StudentInfoRequest, StudentInfoResponse, CourseFilterRequest, CourseFilterResponse
from typing import List
import sqlite3


app = FastAPI()

# configuration
OLLAMA_API_URL = "http://localhost:11434/api/chat"  # default Ollama API endpoint
MODEL_NAME = "phi3:mini"
CONTEXT = None

# sends prompt to ollama and 
async def call_ollama(prompt: str):
    payload = {
        "model": MODEL_NAME,
        "stream": False, # get full message at once
        "options": {
            "temperature": 0.1 # lower temperature for more deterministic output (good for JSON)
        },
    }
    # default message is simply the prompt
    messages = [{"role": "user", "content": prompt}]    
    if CONTEXT is None:
          # TODO fix context setup prompt
          messages.insert(0, {"role": "system", "content": initial_context_prompt},)
    else:
        payload["context"] = CONTEXT # use the context (course data)
    # add the messages to pass to ollama
    payload["messages"] = messages
    response = await requests.post(OLLAMA_API_URL, json=payload, timeout=120) # increase timeout if needed
    try:
        response.raise_for_status() # raise an exception for bad status codes
    except requests.exceptions.RequestException as e:
        print(f"Error calling Ollama chat: {e}")
        raise HTTPException(status_code=401, detail=f"Failed to communicate with Ollama service: {e}")
    else:
        response_data = response.json()
        # store the context after the prompt to remember the course data
        if "context" in response_data and CONTEXT is None:
            CONTEXT = response_data["context"]

        # extract the response message
        if "message" in response_data and "content" in response_data["message"]:
             return response_data["message"]["content"]
        else:
            return None
    

# fastapi deserializes json automatically
@app.post("/init_student", response_model=StudentInfoResponse)
# receive request.undergrad, request.major, request.courses_taken
async def init_student(request: StudentInfoRequest):
    try:
        courses_taken_str = await call_ollama(init_student_test_prompt + request.courses_taken)
        if not courses_taken_str:
            raise HTTPException(status_code=400, detail="Could not process courses taken.")
        # should return string class IDs separated by commas
        courses_taken = courses_taken_str.split(",")

        # TODO: verify each course

        con = sqlite3.connect("CourseScheduler.db")
        cur = con.cursor()

        cur.executemany("""
        SELECT CreditHours, GenEd
        FROM Courses
        WHERE CourseID = ?
        """, courses_taken)

        courses_taken_to_send = cur.fetchall()
        # (credit hours, GenEd)

        
        cur.executemany("""
        DELETE FROM Courses
        WHERE CourseID = ?
        """, courses_taken)

        con.commit()

        # TODO Send courses_taken_to_send AND total major credits taken/need AND available courses in one go
        cursor.execute(
        "SELECT * FROM Courses", fields)
        rows = cursor.fetchall()
        result = [CourseInfo(*row) for row in rows]

        # TODO make sure you send properly created list of CourseInfo
        return StudentInfoResponse(init_response=courses_taken_to_send)
    except HTTPException as e:
        print(f"Caught HTTPException: {e.detail}")
        raise e
    except sqlite3.DatabaseError as e:
        print(f"Database error occurred: {e}")
        # Optionally re-raise or return an error response depending on your needs
        raise HTTPException(status_code=500, detail="Database error occurred.")
    except OperationalError as e:
        print(f"Operational error occurred: {e}")
        raise HTTPException(status_code=500, detail="Database operational error occurred.")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
    finally:
        # Close the connection, even if there was an error
        if con:
            con.close()


@app.post("/fetch_classes", response_model=CourseFilterResponse)
async def fetch_classes(request: CourseFilterRequest):
    # have request.criteria, request.interested_topics
    # TODO fix prompt
    model_output = await call_ollama(fetch_classes_prompt).strip()

    # TODO get valid courses from database based on model_output and/or request.criteria
    return CourseFilterResponse(llm_indentified_criteria=model_output, courses_to_display=[])
    
courses_tested_ex = 'CS101,math233, Luffy21 eNg201, CS101, MATH202'

def filterData(fields: list[str]) -> list[CourseInfo]:

    conn = sqlite3.connect('CourseScheduler.db')
    cursor = conn.cursor()

    placeholders = ','.join('?' for _ in len(fields))

    cursor.execute(
        f"SELECT * FROM Courses WHERE Field IN ({placeholders})", fields)

    rows = cursor.fetchall()
    result = [CourseInfo(*row) for row in rows]

    conn.close()
    return result



# frontend js code for reference
'''
fetch("http://localhost:8000/init_student", {
  method: "POST",
  headers: { "Content-Type": "application/json" }, 
  body: JSON.stringify({
    major: "Computer Science"
    courses_taken: "CSCI-C311, maTh-m211"
  }),
})

need to have selected either one grad requiremnt 
or have inputted topics they are interested in to 
fetch the classes

fetch("http://localhost:8000/fetch_classes", {
  method: "POST",
  headers: { "Content-Type": "application/json" }, 
  body: JSON.stringify({
    criteria: ["A&H", ...]
    interested_topics: "CSCI-C335, maTH-m211"
  }),
})
'''