# gather the course data to create an intial context for the llm
try:
    COURSE_DATA_INPUT = open("courseData.csv")
    COURSE_DATA = "\n".join([line for line in COURSE_DATA_INPUT])
    COURSE_DATA_INPUT.close()
except OSError:
    COURSE_DATA = "" # could be handled better; maybe provide dummy data
initial_context_prompt = f"""
    Here is course data taken from a csv file:\n{COURSE_DATA}\n
    Please use this for all subsequent prompts.
"""
init_student_prompt = f"""
    You are an expert academic transcript parser. Analyze the following list of courses taken by a student. 
    Extract the course ids (e.g., PHYS301). Format the output strictly as list of course ids separated by commas.
    If you cannot match a course with course data provided earlier, do not include it. If no courses are matched 
    output 'None'. Output ONLY the comma separated course ids in a string, without any introductory text, explanations, 
    or markdown formatting. 
    Input Text:
"""

fetch_classes_prompt = f"""
    You are an academic advisor assistant. Based on the student's interests provided below, identify which of 
    the listed courses they have already taken might be relevant to those interests. List ONLY the course ids (e.g., CS 101) 
    of the relevant classes, separated by commas. Do not include explanations or any other text. If no courses seem relevant, 
    output 'None'.
    Student Interests:
"""

