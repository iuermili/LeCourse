from pydantic import BaseModel
from typing import List, Tuple

# model to store course information
class CourseInfo(BaseModel):
    code: str # e.g. 'CS101'
    name: str # e.g. 'Intro to Computer Science'
    credits: int # e.g. 3
    prerequisites: str # e.g. 'Pre-Calculus' or '' (our data only has at most 1 prereq per class)
    # TODO regenerate data to be am/pm instead of military time
    timing : str # e.g. '08:00-08:50'
    days : str  # e.g. 'MWF'
    gened_satisfied: str # e.g. 'Arts & Humanities' or '' (our data only has at most 1 gened fulfilled per class)
    major_satisfied: str # e.g. 'Computer Science'

# models to work with the /init_student endpoint
class StudentInfoRequest(BaseModel):
    major: str # e.g. 'Computer Science'
    courses_taken: str # raw user input

class StudentInfoResponse(BaseModel):
    init_response: List[Tuple[List[str], int]] # e.g. [(['Arts & Humanities', ...], 3)] or []
    major_credits_required: int # e.g 20 needed (this is the only non-hard-coded requirement limit) 
    all_courses_not_taken: List[CourseInfo] # all courses besides the ones already taken

# models to work with the /fetch_courses endpoint
class CourseFilterRequest(BaseModel):
    criteria: List[str] # e.g. ['Arts & Humanities', 'Major', ...] or []
    interested_topics: str # e.g. 'i love you LeCourse and i love math'

class CourseFilterResponse(BaseModel):
    # differentiated the two; may want to add a note onto each
    # llm recommended course to say that LeCourse recommends it
    llm_recommended_courses : List[CourseInfo] 
    filtered_courses: List[CourseInfo] 
      