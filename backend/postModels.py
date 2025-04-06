from pydantic import BaseModel
from typing import List, Tuple

# model to store course information
class CourseInfo(BaseModel):
    code: str # e.g. 'CSCI-H211'
    name: str # e.g. 'Intro to Computer Science'
    credits: int # e.g. 3
    prerequisites: List[str] # e.g. ['Pre-Calculus']
    # TODO regenerate data to be am/pm instead of military time
    timing : str # e.g. '08:00-08:50'
    days : str  # e.g. 'MWF'
    requirements_satisfied: List[str] # e.g. ['Arts & Humanities', ...] or []   

# models to work with the /init_student endpoint
class StudentInfoRequest(BaseModel):
    major: str # e.g. 'Computer Science'
    courses_taken: str # raw user input

class StudentInfoResponse(BaseModel):
    init_response: List[Tuple[str]]

# models to work with the /fetch_courses endpoint
class CourseFilterRequest(BaseModel):
    criteria: List[str]
    interested_topics: str

class CourseFilterResponse(BaseModel):
    llm_indentified_courses : List[CourseInfo] 
    courses_to_display: List[CourseInfo] 
      