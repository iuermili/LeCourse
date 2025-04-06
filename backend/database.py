import sqlite3
import csv

con = sqlite3.connect("CourseScheduler.db")

cur = con.cursor()
cur.execute("""
CREATE TABLE IF NOT EXISTS Courses (
    CourseID TEXT PRIMARY KEY, 
    CourseName TEXT, 
    Field TEXT, 
    CreditHours INTEGER, 
    Prerequisites TEXT, 
    Time TEXT, 
    Days TEXT, 
    GenEd TEXT
)
""")

courses_data = []
with open('courseData.csv', newline='') as csvfile:
    courseReader = csv.DictReader(csvfile)
    for row in courseReader:
        courses_data.append((
            row["CourseID"], 
            row["CourseName"], 
            row["Field"], 
            int(row["CreditHours"]) if row["CreditHours"] else 0,
            row["Prerequisites"] if row["Prerequisites"] else "", 
            row["Time"], 
            row["Days"], 
            row["GenEd"] if row["GenEd"] else "",
        ))

cur.executemany("""
INSERT OR REPLACE INTO Courses
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", courses_data)

con.commit()
con.close()