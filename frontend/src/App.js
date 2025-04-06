import React, { useState, useRef, useEffect } from "react"; // Fundamental Library for React
import { motion, useAnimation } from "framer-motion";                     // Animation Library
import feather from "feather-icons";                        // Library for Open-Source SVG Icons
import './App.css';                                         // File that simplifies CSS
import { make_request, init_student_endpoint_path, fetch_classes_endpoint_path } from './requestMaker.js';
import jsPDF from 'jspdf';

// Starting Animation Functions (3 Parts)
// Part 1.
function LeEntrance({ setShowIntro }) {
  const [dunked, setDunked] = useState(false);
  const bookControls = useAnimation();

  useEffect(() => {
    if (dunked) {
      bookControls.start({
        x: [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 325, 325],
        y: [0, -20, -40, -60, -80, -100, -120, -140, -160, -140, -120, -100, -80, -60, -60, -60],
        opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        transition: { duration: 1.5, ease: "easeInOut"},
      });
    }
  }, [dunked, bookControls]);
  
  return (
    <motion.div
      initial={{ x: -1200, y: 0, opacity: 0 }}
      animate={{ x: 100, opacity: 1 }}
      transition={{ duration: 4.5 }}
      style={{ position: "relative", overflow: "visible", display: "flex", flexDirection: "row", alignItems: "flex-end", gap: "100px"}}
      onAnimationComplete={() => setDunked(true)}
    >
      
      <div style={{display: "flex", flexDirection: "column"}}>
        <h1>Introducing LeCourse</h1>
        <p>An AI Course Scheduling Assistant</p>
      </div>
      <motion.img
        src="/books.png"
        alt="Books"
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        animate={bookControls}
        onAnimationComplete={() => setShowIntro(true)}
        style={{
          position: "absolute",
          top: "50px",
          right: "275px",
          height: "50px",
        }}
      />
      <img src="/lebron_dunk.png" alt="LeBron" style={{ height: "400px" }} />
    </motion.div>
  );
}

// Part 2.
function LeShoppingCart() {
  return (
    <motion.img
      src="/cart.png"
      alt="Shopping cart"
      initial={{ x: 600, y: -150, opacity: 0 }}
      animate={{ x: 75, opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ height: "100px" }}
    />
  );
}

// Introduction Screen Function
function LeCourseIntro({ setStartAnimation }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);  // Track if audio is playing

  // Play/Pause button handler
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {audio.pause();} 
      else {audio.play();}
      setIsPlaying(!isPlaying);  
    }
  };

  // Replace feather icons in the component when it renders
  useEffect(() => {
    feather.replace(); 
  }, []);

  // Toggle the startAnimations state
  const toggleStartAnimation = () => {
    setStartAnimation(prevState => !prevState); 
  };

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "600px" }}
      transition={{ duration: 2 }}
      style={{ position: "relative", textAlign: "center"}}
    >
      {/* LeBron Image */}
      <img src="/lebron_intro.jpg" alt="LeBron Smiling" style={{ width: "600px" }} />

      {/* Subtitles + Play/Pause Button */}
      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", width: "600px"}}>
        
        <button onClick={handlePlayPause} style={{borderRadius: "50%", width: "50px", height: "50px", padding: "0px"}}>
          <i data-feather="volume-2"></i>
        </button>

        <p className="subtitles">This is LeCourse. I'm here to help you schedule your classes. Let's do this!</p>

        <div className="next">
          <button onClick={toggleStartAnimation}>NEXT</button>
        </div>

        <audio ref={audioRef} src="/LeCourse Introduction.mp3" />
      </div>

    </motion.div>
  );
}

// Select Major Screen Function
function SelectMajor({ onMajorChange }) {
  const majors = ["Biology", "Chemistry", "Computer Science", "Economics", "History", "Mathematics", "Physics", "Psychology"];
  const [selectedMajor, setSelectedMajor] = useState("");

  const handleMajorChange = (event) => {
    const major = event.target.value;
    setSelectedMajor(major);
    onMajorChange(major); // Pass the selected major to the App component
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Select your Major</h2>
      <select
        id="major"
        value={selectedMajor}
        onChange={handleMajorChange}
      >
        <option value="">Select one...</option>
        {majors.map((major) => (
          <option key={major} value={major}>
            {major}
          </option>
        ))}
      </select>
    </div>
  );
}

const major_credits = [];

function PastCoursesScreen({ setPastCourses, major, onCoursesSubmit }) { // Add major as prop
  const [coursesInput, setCoursesInput] = useState('');

  const handleInputChange = (event) => {
    setCoursesInput(event.target.value.replace(/[\r\n\t]/g, ''));
    setPastCourses(event.target.value)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <div style={{ marginBottom: '40px' }}>
        <h2>Enter your past courses</h2>
        <span style={{ fontSize: '1.2rem', color: 'white', display: 'block', marginTop: '5px' }}>
          Ex. CS101, MATH101, PHYS101
        </span>
      </div>

      <div className="input">
        <textarea
          value={coursesInput}
          onChange={handleInputChange}
          placeholder="Enter courses separated by commas"
          style={{
            width: '500px',
            height: '400px',
            padding: '20px',
            fontSize: '1.2rem',
            borderRadius: '20px',
            resize: 'none',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        />
      </div>
    </motion.div>
  );
}

// Function to display a single course with a checkbox
const CourseCard = ({ course, selectedCourses, setSelectedCourses }) => {
  const isSelected = selectedCourses.includes(course.code);

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setSelectedCourses([...selectedCourses, course.code]);
    } else {
      setSelectedCourses(selectedCourses.filter(code => code !== course.code));
    }
  };

  return (
    <div className={`course-card ${isSelected ? 'selected' : ''}`} style={{ position: 'relative' }}>
      <label style={{ position: 'absolute', top: '5px', right: '5px' }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          style={{ width: '15px', height: '15px' }}
        />
      </label>
      <div style={{ paddingLeft: '25px' }}>
        <h3>{course.code}: {course.name}</h3>
        <p>{course.time}, {course.days}</p>
        <p>Credits: {course.credits}</p>
        {course.field || course.gened && (
          <div>
            {course.field && <p><strong>Major Satisfied: </strong>{course.field}</p>}
            {course.gened && <p><strong>GenEd Satisfied: </strong>{course.gened}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

// Function to render the list of courses with checkboxes
const CourseList = ({ courseInfoList, selectedCourses, setSelectedCourses }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
      {courseInfoList && courseInfoList.map((course, index) => ( // Check if courseInfoList exists
        <CourseCard
          key={index}
          course={course}
          selectedCourses={selectedCourses}
          setSelectedCourses={setSelectedCourses}
        />
      ))}
    </div>
  );
};

function ChooseClasses({ fetchFilteredCourses, courseInfoList, setCourseInfoList}) {
  const [inputValue, setInputValue] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    fetchFilteredCourses(inputValue);
    setInputValue("");
  };

  const requirementsData = ['Arts & Humanities', 'Natural Science', 'World Culture', 'Required', 'Total'];


  // Function to handle export for JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(selectedCourses, null, 2); // format JSON with indentation
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'selectedCourses.json'; // name of the downloaded file
    link.click();
};

// Function to handle export
const generatePDF = () => {
  const pdf = new jsPDF();
  
  // Constants for positioning and sizing
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 10;
  const dayWidth = (pageWidth - 2 * margin) / 5; // 5 days (Mon-Fri)
  const hourHeight = 12;
  const startHour = 8; // 8 AM
  const endHour = 18; // 6 PM
  const totalHours = endHour - startHour;
  
  // Add title
  pdf.setFontSize(16);
  pdf.text("Weekly Class Schedule", margin, margin);
  
  // Starting Y position for the calendar
  let calendarStartY = margin + 20;
  
  // Draw calendar header (days)
  pdf.setFillColor(220, 220, 220);
  pdf.rect(margin, calendarStartY, pageWidth - 2 * margin, 10, 'F');
  
  pdf.setFontSize(10);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  days.forEach((day, index) => {
    pdf.text(day, margin + index * dayWidth + dayWidth / 2 - 10, calendarStartY + 7);
  });
  
  // Draw time slots
  pdf.setFontSize(8);
  for (let hour = startHour; hour <= endHour; hour++) {
    const y = calendarStartY + 10 + (hour - startHour) * hourHeight;
    
    // Draw horizontal line for each hour
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageWidth - margin, y);
    
    // Add hour label
    const hourLabel = hour <= 12 ? `${hour}:00 AM` : `${hour-12}:00 PM`;
    pdf.text(hourLabel, margin - 5, y + 3, { align: 'right' });
  }
  
  // Draw vertical lines to separate days
  for (let i = 0; i <= 5; i++) {
    const x = margin + i * dayWidth;
    pdf.line(x, calendarStartY + 10, x, calendarStartY + 10 + totalHours * hourHeight);
  }
  
  // Add courses to the calendar
  pdf.setFontSize(8);
  
  // Map of days to column indices
  const dayMapping = {
    'M': 0, 'Monday': 0,
    'T': 1, 'Tu': 1, 'Tuesday': 1,
    'W': 2, 'Wednesday': 2,
    'Th': 3, 'R': 3, 'Thursday': 3,
    'F': 4, 'Friday': 4
  };
  
  // Function to parse time string and return hour as a decimal (e.g., "2:30 PM" -> 14.5)
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    
    // Handle various time formats
    let match = timeStr.match(/(\d+):?(\d*)?\s*(am|pm|AM|PM)?/i);
    if (!match) return null;
    
    let hours = parseInt(match[1]);
    let minutes = match[2] ? parseInt(match[2]) : 0;
    let period = match[3] ? match[3].toLowerCase() : null;
    
    // Convert to 24-hour format
    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    return hours + (minutes / 60);
  };
  
  // Get the selected course details
  const selectedCourseDetails = courseInfoList.filter(course => selectedCourses.includes(course.code));
  
  // Plot each course on the calendar
  selectedCourseDetails.forEach(course => {
    // Parse course days and times
    if (!course.days || !course.time) return;
    
    const timeMatch = course.time.match(/(\d+:?\d*\s*(?:am|pm|AM|PM)?)\s*-\s*(\d+:?\d*\s*(?:am|pm|AM|PM)?)/i);
    if (!timeMatch) return;
    
    const startTimeStr = timeMatch[1];
    const endTimeStr = timeMatch[2];
    
    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);
    
    if (startTime === null || endTime === null) return;
    
    // Calculate position on calendar
    const startY = calendarStartY + 10 + (startTime - startHour) * hourHeight;
    const duration = endTime - startTime;
    const blockHeight = duration * hourHeight;
    
    // Handle different day formats
    const dayChars = course.days.split(/[,\s]+/).filter(Boolean);
    
    dayChars.forEach(dayChar => {
      const dayIndex = dayMapping[dayChar];
      if (dayIndex === undefined) return;
      
      const blockX = margin + dayIndex * dayWidth;
      
      // Draw course block
      pdf.setFillColor(230, 240, 255);
      pdf.rect(blockX + 1, startY, dayWidth - 1, blockHeight, 'F');
      
      // Draw course details
      pdf.setTextColor(0, 0, 0);
      pdf.text(course.code, blockX + 2, startY + 4);
      pdf.text(course.name.substring(0, 15) + (course.name.length > 15 ? '...' : ''), blockX + 2, startY + 8);
      pdf.text(course.time, blockX + 2, startY + 12);
    });
  });
  
  // Add legend at the bottom
  const legendY = calendarStartY + 10 + totalHours * hourHeight + 15;
  pdf.setFontSize(10);
  pdf.text("Selected Courses:", margin, legendY);
  
  pdf.setFontSize(8);
  selectedCourseDetails.forEach((course, index) => {
    const y = legendY + 5 + (index * 4);
    pdf.text(`${course.code}: ${course.name} (${course.credits} credits)`, margin + 5, y);
  });
  
  // Calculate total credits
  const totalCredits = selectedCourseDetails.reduce((sum, course) => sum + (parseInt(course.credits) || 0), 0);
  pdf.text(`Total Credits: ${totalCredits}`, margin + 5, legendY + 5 + (selectedCourseDetails.length * 4));
  
  pdf.save("weekly_class_schedule.pdf");
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div className="container">
        <div className="columns" style={{ position: 'relative'}}>
          {/* <div className="subColumns"> */}
            <h3>Selected Courses</h3>
            {selectedCourses.map((courseCode, index) => {
              // Find the full course information based on the course code
              const selectedCourse = courseInfoList.find(course => course.code === courseCode);
              if (!selectedCourse) return null;

              return (
                <CourseCard
                  key={index}
                  course={selectedCourse}
                  selectedCourses={selectedCourses}
                  setSelectedCourses={setSelectedCourses}
                />
              );
            })}
            {/* <ul className="course-list">
              {selectedCourses.map((course, index) => (
                <li key={index} className="course-item">{course}</li>
              ))}
            </ul> */}
            <div style={{position: "absolute", bottom: "0px", left: "0px", display: "flex", gap: "10px"}}>
              <button onClick={generatePDF} style={{borderRadius: "50%", width: "50px", height: "50px", padding: "0px"}}>
                <i data-feather="file-text"></i>
              </button>
            </div>
            
          {/* </div>
          <div className="subColumns">
            <h3>Requirements</h3>
            {createRequirementTable({fetchFilteredCourses, requirementsData, filters, setFilters, selectedCourses, courseInfoList, setCourseInfoList})}
          </div> */}
        </div>
        <div className="columns">
          <h3>Suggested Courses</h3>
          <CourseList
            courseInfoList={courseInfoList}
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
          />
        </div>
      </div>
      <div className="input">
        <input
          type="text"
          value={inputValue}
          placeholder = "Enter your interests"
          onChange={handleInputChange}
          className="filter-input large-input"
        />
        <button onClick={handleButtonClick} style={{ padding: '10px', marginLeft: '10px' }}>
          Enter
        </button>
      </div>
      
    </div>
  );
}

function App() {
  const [moveBooks, setMoveBooks] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [startAnimations, setStartAnimation] = useState(true);
  const [dunkComplete, setDunkComplete] = useState(false); // New state

  const [showTitle, setShowTitle] = useState(false); // New state
  const [pastCourses, setPastCourses] = useState('');
  const [major, setSelectedMajor] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSendingData, setIsSendingData] = useState(false);
  const [courseInfoList, setCourseInfoList] = useState([]);
  const [filters, setFilters] = useState([]);
  const [interests, setInterests] = useState('');
  // For printing schedule
  const [selectedCourses, setSelectedCourses] = useState([]); // Add selectedCourses state
  const courseListRef = useRef(null);

  useEffect(() => {
    if (dunkComplete) {
      setTimeout(() => {
        setShowTitle(true);
      }, 1000); // Delay title appearance
    }
  }, [dunkComplete]);

  // Array of functions to be shown
  const functions = [
    () => <SelectMajor onMajorChange={setSelectedMajor} />,
    () => <PastCoursesScreen setPastCourses={setPastCourses} major={major} onCoursesSubmit={setPastCourses} />, // Pass major and onCoursesSubmit
    () => <ChooseClasses fetchFilteredCourses={fetchFilteredCourses} courseInfoList={courseInfoList} />,
  ];

  const sendDataToBackend = async () => {
    const userData = {
      major: major,
      courses_taken: pastCourses, // Join courses into a comma-separated string
    };

    try {
      const responseData = await make_request(userData, init_student_endpoint_path);
      // TODO: CREDITS CALCULATOR
      setCourseInfoList(responseData.all_courses_not_taken)
      // Handle the response data (e.g., store it in state)
    } catch (error) {
      console.error('Failed to send data:', error);
      // Handle errors (e.g., show an error message)
    }
  };

  const handleNext = async () => { // Make handleNext async
    if (currentIndex === 1) { // Only make a request when the user is ready to move on to course-selection
      setIsSendingData(true); // Disable the button
      try {
        await sendDataToBackend(); // Await the backend request
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } catch (error) {
        console.error("Error sending data:", error);
        // Handle the error (e.g., show an error message to the user)
      }
    } else if (currentIndex === 0 && major !== '') {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      // major has not been selected, so don't do anything
    }
  };

  const fetchFilteredCourses = async (interests) => {
    try {
      const requestData = {
        prompt: interests,
      };
      const fetchedCourses = await make_request(requestData, fetch_classes_endpoint_path);
      setCourseInfoList(fetchedCourses.filtered_courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <div id='root'>
      {/* Starting Animations */}
      {startAnimations && (
        <>
          {!showIntro && <LeEntrance setShowIntro={setShowIntro}/>}
          {!showIntro && <LeShoppingCart />}
          {showIntro && <LeCourseIntro setStartAnimation={setStartAnimation} />}
        </>
      )}

      {/* Show Main Interface */}
      {!startAnimations && (
        <>
        <motion.div
         key={currentIndex}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Render the current function/content */}
          {functions[currentIndex]()}
        </motion.div>
        {/* {currentIndex === functions.length - 1 && (
          <button onClick={generatePDF}>Download Calendar (PDF)</button>
        )} */}
        {currentIndex < functions.length - 1 && (
            <div className="next">
              <button onClick={isSendingData ? () => { } : handleNext}>NEXT</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
