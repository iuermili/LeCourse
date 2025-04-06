context = "CS101:Computer Science, CS102:Computer Science, CS201:Computer Science, CS301:Computer Science, CS401:Computer Science, MATH101:Mathematics, MATH102:Mathematics, MATH201:Mathematics, MATH301:Mathematics, MATH401:Mathematics, PHYS101:Physics, PHYS102:Physics, PHYS201:Physics, PHYS301:Physics, PHYS401:Physics, ENG101:English, ENG102:English, ENG201:English, ENG301:English, ENG401:English, BIOL101:Biology, BIOL102:Biology, BIOL201:Biology, BIOL301:Biology, BIOL401:Biology, CHEM101:Chemistry, CHEM102:Chemistry, CHEM201:Chemistry, CHEM301:Chemistry, CHEM401:Chemistry, ECON101:Economics, ECON102:Economics, ECON201:Economics, ECON301:Economics, ECON401:Economics, PSYC101:Psychology, PSYC102:Psychology, PSYC201:Psychology, PSYC301:Psychology, PSYC401:Psychology, HIST101:History, HIST102:History, HIST201:History, HIST301:History, HIST401:History, ART101:Art, ART102:Art, ART201:Art, ART301:Art, ART401:Art, ENV101:Environmental Science, ENV102:Environmental Science, ENV201:Environmental Science, ENV301:Environmental Science, ENV401:Environmental Science"

init_student_prompt = f"""
    The following context will be a list of courses and the topics they cover, separated by commas. An example of this would be: "BIOL101:Biology".
    They will all be exactly in that form: ({context})
    Now you are going to receive a list of classes from users. It may not be perfectly formatted, but should be close. You need to match the classes that the user inputs the the classes in the previous context supplied. All the classes you are able to match ONLY RETURN THE CLASS ID's separated by COMMAS. For example, it should be in the form: "CS101,CS102,CS202". WITH NO SPACES. If you cannot find a reasonable match, DO NOT return a course id for that course. DO NOT return any courses without a close match from the user input to the context previously supplied. DO NOT have anything else besides the output in you response. Here is the user input:
"""


fetch_classes_prompt = f"""
    The following context will be a list of courses and the topics they cover, separated by commas. An example of this would be: "BIOL101:Biology".
    They will all be exactly in that form: ({context})
    Based on the student's interests provided below, identify which of the listed courses might be relevant to those interests. List ONLY the course ID of the relevant classes, separated by commas. Do not include explanations or any other text. If no courses seem relevant, output 'None'
    Student Interests:
"""

