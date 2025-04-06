import json
import requests
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from typing import List

app = FastAPI()

# configuration
OLLAMA_API_URL = "http://localhost:11434/api/chat"  # Default Ollama API endpoint
MODEL_NAME = "phi3:mini" 
CONTEXT = None

# models to store course information
class CourseSection(BaseModel):
    ''' if we chose to handle course timing overlap
    days : str
    start_time: str
    end_time: str 
    '''
    timing : str # e.g. 'TuThu 10:00am-12:00pm'
    instructor: str # e.g. 'Carlo Angiuli'
    room: str # e.g. 'BH 201'

class CourseComponent(BaseModel):
    name: str # e.g. 'Lecture'
    sections: List[CourseSection] # hold the timing, instructor, and room for each section

class CourseInfo(BaseModel):
    code: str # e.g. 'CSCI-H211'
    name: str # e.g. 'Intro to Computer Science'
    credits: int # e.g. 3
    requirements_satisfied: List[str] # e.g. ['WC', 'A&H', 'INTENSIVE WRITING', ...] or []
    # represents each component (i.e. Lecture, Discussion, etc.) as a list of CourseSection
    components: List[CourseComponent]

# models to work with the /init_student endpoint
class StudentInfoRequest(BaseModel):
    ''' if we choose to handle undergrad vs grad differently
    undergrad: bool
    '''
    major: str
    ''' if we chose to handle minors
    minor: str
    '''
    courses_taken: str

class StudentInfoResponse(BaseModel):
    courses_taken: List[CourseInfo]

# models to work with the /fetch_courses endpoint
class CourseFilterRequest(BaseModel):
    criteria: List[str]
    interested_topics: str

class CourseFilterResponse(BaseModel):
    llm_indentified_criteria : str
    courses_to_display = List[CourseInfo] 
      
# sends prompt to ollama and 
async def call_ollama(prompt: str, use_context: bool=False):
    payload = {
        "model": MODEL_NAME,
        "stream": False, # get full message at once
        "options": {
            "temperature": 0.1 # lower temperature for more deterministic output (good for JSON)
        },
    }
    # default message; pass the prompt to ollama
    messages = [{"role": "user", "content": prompt}]
    # don't use the context unless that is specified
    if use_context:
        payload["context"] = CONTEXT # use the context (course data)
        # 
        if CONTEXT is None:
             # TODO fix context setup prompt
             messages.insert(0, {"role": "system", "content": f"You are an academic advisor. Here is context:\n{COURSE_CODE_MAPPING}"},)
    payload["messages"] = messages

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=120) # increase timeout if needed
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
        # Clean up context if call failed maybe? Depends on strategy.
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
    model_output = call_ollama(prompt)
    try:
      # the model should output *only* JSON. Sometimes they add markdown fences (```json ... ```)
        if model_output.startswith("```json"):
            model_output = model_output[7:]
        if model_output.endswith("```"):
            model_output = model_output[:-3]

        parsed_json = json.loads(model_output.strip())

        # basic validation - ensure it's a list
        if not isinstance(parsed_json, list):
             # maybe it returned {"courses": [...]}, try to extract
             if isinstance(parsed_json, dict) and "courses" in parsed_json and isinstance(parsed_json["courses"], list):
                 parsed_json = parsed_json["courses"]
             else:
                raise ValueError("Model did not return a JSON list as expected.")
             
        # TODO make sure you send properly created list of CourseInfo
        return StudentInfoResponse(courses=[])

    except json.JSONDecodeError:
        print(f"Failed to decode JSON from model output: {model_output}")
        raise HTTPException(status_code=500, detail="Model did not return valid JSON.")
    except ValueError as e:
         print(f"Validation Error: {e}. Model output: {model_output}")
         raise HTTPException(status_code=500, detail=f"Model output validation failed: {e}")

@app.post("/fetch_classes", response_model=CourseFilterResponse)
async def fetch_classes(request: CourseFilterRequest):
    # TODO fix prompt
    # have request.criteria, request.interested_topics
    prompt = f"""You are an academic advisor assistant. Based on the student's interests provided below, identify which of 
    the listed courses they have already taken might be relevant to those interests. List ONLY the course codes (e.g., CS 101) 
    of the relevant classes, separated by commas. Do not include explanations or any other text. If no courses seem relevant, 
    output 'None'.
    Student Interests:
    {request.interested_topics}

    Relevant Course Codes:
    """
    model_output = call_ollama(prompt).strip()

    if model_output.lower() == 'none' or not model_output:
        relevant_codes = []
    else:
        # Split by comma, strip whitespace from each code
        relevant_codes = [code.strip() for code in model_output.split(',') if code.strip()]

    # TODO get valid courses from database based on model_output and/or request.criteria
    return CourseFilterResponse(llm_indentified_criteria=model_output, courses_to_display=[])
    
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
