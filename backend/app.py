import json
import requests
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from typing import List

app = FastAPI()

# configuration
OLLAMA_API_URL = "http://localhost:11434/api/generate"  # Default Ollama API endpoint
MODEL_NAME = "phi3:mini" 

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

class CourseInfo(BaseModel):
    code: str # e.g. 'CSCI-H211'
    name: str # e.g. 'Intro to Computer Science'
    credits: int # e.g. 3
    requirements_satisfied: List[str] # e.g. ['WC', 'A&H', 'INTENSIVE WRITING', ...] or []
    # represents each component (i.e. Lecture, Discussion, etc.) as a list of CourseSection
    components: List[List[CourseSection]]

# models to work with the /init_student endpoint
class StudentInfoRequest(BaseModel):
    '''
    undergrad: bool
    '''
    major: str
    ''' if we chose to handle minors
    minor: str
    '''
    courses_taken: str

class StudentInfoResponse(BaseModel):
    # mapping from requirement to completed/required credits tuple
    courses_taken: List[CourseInfo]

# models to work with the /fetch_courses endpoint
class CourseFilterRequest(BaseModel):
    criteria: List[str]
    interested_topics: str

class CourseFilterRespone(BaseModel):
    courses = List[CourseInfo] 
      
# helper function to call Ollama
def call_ollama(prompt: str) -> str:
    """Sends a prompt to the Ollama API and returns the model's response text."""
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False, # get the full response at once
        "options": {
            "temperature": 0.1 # Lower temperature for more deterministic output (good for JSON)
        }
    }
    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=120) # Increase timeout if needed
        response.raise_for_status() # Raise an exception for bad status codes
        # Assuming the response JSON structure from Ollama is like: {"response": "...", ...}
        # Adjust key ('response') if your Ollama version differs
        response_data = response.json()
        if "response" in response_data:
             # Clean up potential leading/trailing whitespace or markdown code fences
            return response_data["response"].strip().strip('`').strip()
        else:
             # Handle cases where the expected key is missing
             print(f"Warning: 'response' key not found in Ollama output: {response_data}")
             # Attempt to find the most likely text field or return raw JSON string for debugging
             # This part might need adjustment based on actual Ollama error structures
             possible_texts = [v for v in response_data.values() if isinstance(v, str)]
             if possible_texts:
                 return possible_texts[0].strip().strip('`').strip() # Return the first string found
             else:
                 return json.dumps(response_data) # Return raw JSON if no obvious text

    except requests.exceptions.RequestException as e:
        print(f"Error calling Ollama: {e}")
        raise HTTPException(status_code=503, detail=f"Failed to communicate with Ollama service: {e}")
    except Exception as e:
        print(f"Error processing Ollama response: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing response from Ollama: {e}")
    
# fastapi deserializes json automatically
@app.post("/init_student", response_model=StudentInfoResponse)
# receive request.undergrad, request.major, request.courses_taken
async def init_student(request: StudentInfoRequest):
    # Parses a raw string of class listings into structured JSON.
    prompt = f"""You are an expert academic transcript parser. Analyze the following list of courses taken by a student. 
    Extract the course codes (e.g., CSCI-C101). Format the output strictly as a JSON string containing a list of objects, 
    where each object has a "code" key. If you cannot extract a code, you can omit the key or set it to null. Output ONLY
    the JSON string, without any introductory text, explanations, or markdown formatting.
    Input Text:
    {request.raw_classes}

    JSON Output:
    """
    model_output = call_ollama(prompt)

    try:
        # The model should output *only* JSON. Sometimes they add markdown fences (```json ... ```)
        if model_output.startswith("```json"):
            model_output = model_output[7:]
        if model_output.endswith("```"):
            model_output = model_output[:-3]

        parsed_json = json.loads(model_output.strip())

        # Basic validation - ensure it's a list
        if not isinstance(parsed_json, list):
             # Maybe it returned {"courses": [...]}, try to extract
             if isinstance(parsed_json, dict) and "courses" in parsed_json and isinstance(parsed_json["courses"], list):
                 parsed_json = parsed_json["courses"]
             else:
                raise ValueError("Model did not return a JSON list as expected.")

        # Further validate structure if needed (Pydantic handles response model validation)
        return StudentInfoResponse(courses=parsed_json)

    except json.JSONDecodeError:
        print(f"Failed to decode JSON from model output: {model_output}")
        raise HTTPException(status_code=500, detail="Model did not return valid JSON.")
    except ValueError as e:
         print(f"Validation Error: {e}. Model output: {model_output}")
         raise HTTPException(status_code=500, detail=f"Model output validation failed: {e}")
    
@app.post("/fetch_clases", response_model=CourseFilterRespone)
async def fetch_classes(request: CourseFilterRequest):
    # have request.criteria, request.interested_topics
    """
    Matches student interests to a list of taken classes.
    """
    if request.raw_classes:
        class_list_str = request.raw_classes
    elif request.parsed_classes:
        # Format the parsed classes back into a simple string list for the prompt
        class_list_str = "\n".join([f"{c.code or '?'} - {c.name or '?'}" for c in request.parsed_classes])
    else:
        raise HTTPException(status_code=400, detail="Either raw_classes or parsed_classes must be provided.")

    prompt = f"""You are an academic advisor assistant. Based on the student's interests provided below, identify which of 
    the listed courses they have already taken might be relevant to those interests. List ONLY the course codes (e.g., CS 101) 
    of the relevant classes, separated by commas. Do not include explanations or any other text. If no courses seem relevant, 
    output 'None'.
    Student Interests:
    {request.interests}

    Courses Taken:
    {class_list_str}

    Relevant Course Codes:
    """
    model_output = call_ollama(prompt).strip()

    if model_output.lower() == 'none' or not model_output:
        relevant_codes = []
    else:
        # Split by comma, strip whitespace from each code
        relevant_codes = [code.strip() for code in model_output.split(',') if code.strip()]

    return CourseFilterRespone(relevant_courses=relevant_codes)
    
'''
fetch("http://localhost:8000/init_student", {
  method: "POST",
  headers: { "Content-Type": "application/json" }, 
  body: JSON.stringify({
    undergrad: False,
    major: "Gender Studies",
    classes_taken: "CSCI-C335, maTH-m211"
  }),
})
'''

'''
need to have selected either one grad requiremnt 
or have inputted topics they are interested in to 
fetch the classes

fetch("http://localhost:8000/fetch_classes", {
  method: "POST",
  headers: { "Content-Type": "application/json" }, 
  body: JSON.stringify({
    criteria: "A&H"
    interested_topics: "CSCI-C335, maTH-m211"
  }),
})
'''
