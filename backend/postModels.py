from pydantic import BaseModel
from typing import List, Tuple

# model to store course information
class CourseInfo(BaseModel):
    code: str # e.g. 'CS101'
    name: str # e.g. 'Intro to Computer Science'
    field: str #  e.g. 'Computer Science'
    credits: int # e.g. 3
    prerequisites: str # e.g. 'Pre-Calculus' or '' (our data only has at most 1 prereq per class)
    # TODO regenerate data to be am/pm instead of military time
    time : str # e.g. '08:00-08:50'
    days : str  # e.g. 'MWF'
    gened: str # e.g. 'Arts & Humanities' or '' (our data only has at most 1 gened fulfilled per class)


# models to work with the /init_student endpoint
class StudentInfoRequest(BaseModel):
    major: str # e.g. 'Computer Science'
    courses_taken: str # raw user input

class StudentInfoResponse(BaseModel):
    init_response: List[Tuple[int, str]] # e.g. [(3, 'Arts & Humanities')...] or []
    major_credits: Tuple[int, int] # (taken, needed)
    all_courses_not_taken: List[CourseInfo] # all courses besides the ones already taken

# models to work with the /fetch_courses endpoint
class CourseFilterRequest(BaseModel):
    criteria: List[str] # e.g. ['Arts & Humanities', 'Major', ...] or []
    prompt: str # e.g. 'i love you LeCourse and i love math'

class CourseFilterResponse(BaseModel):
    filtered_courses: List[CourseInfo] 
      