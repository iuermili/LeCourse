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

    try:
        response = await requests.post(OLLAMA_API_URL, json=payload, timeout=120) # increase timeout if needed
        response.raise_for_status() # raise an exception for bad status codes
        response_data = response.json()

        # store the context after the prompt to remember the course data
        if "context" in response_data and CONTEXT is None:
             CONTEXT = response_data["context"]

        # extract the response message
        if "message" in response_data and "content" in response_data["message"]:
             return response_data["message"]["content"]
        else:
             return "Error: Could not parse chat response."
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Ollama chat: {e}")
        raise HTTPException(status_code=503, detail=f"Failed to communicate with Ollama service: {e}")
    except Exception as e:
        print(f"Error processing Ollama chat response: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing response from Ollama chat: {e}")

# fastapi deserializes json automatically
@app.post("/init_student", response_model=StudentInfoResponse)
# receive request.undergrad, request.major, request.courses_taken
async def init_student(request: StudentInfoRequest):
    # parses a raw string of class listings into structured JSON.
    prompt = f"""You are an expert academic transcript parser. Analyze the following list of courses taken by a student. 
    Extract the course codes (e.g., CS101). Format the output strictly as a JSON string containing a list of objects, 
    where each object has a "code" key. If you cannot extract a code, you can omit the key or set it to null. Output ONLY
    the JSON string, without any introductory text, explanations, or markdown formatting.
    Input Text:
    {request.courses_taken}
    JSON Output:
    """
    model_output = await call_ollama(prompt)
    try:

    courses_taken = await call_ollama(init_student_test_prompt + request.courses_taken)
    try:
        # should return string class IDs separated by commas
        courses_taken = courses_taken.split(",")

        # TODO: verify each course

        con = sqlite3.connect("CourseScheduler.db")
        cur = con.cursor()

        cur.executemany("""
        SELECT CreditHours, GenEd
        FROM Courses
        WHERE CourseID = ?
        """, courses_data)

        courses_taken_to_send = cur.fetchall()
        # (credit hours, GenEd)

        
        cur.executemany("""
        DELETE FROM Courses
        WHERE CourseID = ?
        """, courses_data)

        cur.executemany("""
        DELETE FROM Requirements
        WHERE CourseID = ?
        """, courses_data)

        # TODO make sure you send properly created list of CourseInfo
        return StudentInfoResponse()
        return StudentInfoResponse(InitResponse=courses_taken_to_send)

    except json.JSONDecodeError:
        print(f"Failed to decode JSON from model output: {model_output}")
        raise HTTPException(status_code=500, detail="Model did not return valid JSON.")
    except ValueError as e:
         print(f"Validation Error: {e}. Model output: {model_output}")
         raise HTTPException(status_code=500, detail=f"Model output validation failed: {e}")

@app.post("/fetch_classes", response_model=CourseFilterResponse)
async def fetch_classes(request: CourseFilterRequest):
    # have request.criteria, request.interested_topics
    # TODO fix prompt
    model_output = await call_ollama(fetch_classes_prompt).strip()

    # TODO get valid courses from database based on model_output and/or request.criteria
    return CourseFilterResponse(llm_indentified_criteria=model_output, courses_to_display=[])
    
courses_tested_ex = 'CS101,math233, Luffy21 eNg201, CS101, MATH202'
init_student_test_prompt = f"""
    You are an expert academic transcript parser. Analyze the following list of courses taken by a student. 
    Extract the course ids (e.g., PHYS301). Format the output strictly as list of course ids separated by commas.
    If you cannot match a course with course data provided earlier, do not include it. If no courses are matched 
    return ''.Output ONLY the comma separated course ids in a string, without any introductory text, explanations, 
    or markdown formatting. 
    Input Text:
"""
interested_topics_ex = 'CS101,math233, Luffy21 eNg201, CS101, MATH202'
fetch_classes_test_prompt = f"""
    You are an academic advisor assistant. Based on the student's interests provided below, identify which of 
    the listed courses they have already taken might be relevant to those interests. List ONLY the course ids (e.g., CS 101) 
    of the relevant classes, separated by commas. Do not include explanations or any other text. If no courses seem relevant, 
    output 'None'.
    Student Interests:
    {interested_topics_ex}
    Relevant Course Codes:
"""
async def test(prompt):
    output = await call_ollama(prompt)
    print(output)

test(init_student_test_prompt)


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