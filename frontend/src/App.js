import React, { useState, useRef, useEffect } from "react"; // Fundamental Library for React
import { motion } from "framer-motion";                     // Animation Library
import feather from "feather-icons";                        // Library for Open-Source SVG Icons
import './App.css'; 

// Starting Animation Functions (3 Parts)
// Part 1.
function LeEntrance({ setMoveBooks, moveBooks }) {
  return (
    <motion.div
      initial={{ x: -1200, y: 0, opacity: 0 }}
      animate={{ x: -300, opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ position: "relative", overflow: "visible" }}
      onAnimationComplete={() => setMoveBooks(true)}
    >
      <img src="/lebron.png" alt="LeBron" style={{ height: "400px" }} />
      {!moveBooks && (
        <img
          src="/books.png"
          alt="Books"
          style={{ position: "absolute", top: "50px", left: "0px", height: "50px" }}
        />
      )}
    </motion.div>
  );
}

// Part 2.
function LeBook({ setShowIntro }) {
  return (
    <motion.img
      src="/books.png"
      alt="Flying Books"
      initial={{ opacity: 1 }}
      animate={{
        x: [0, 300, 600, 800, 800],
        y: [0, -100, -120, 100, 100],
        opacity: [1, 1, 1, 1, 1, 0]
      }}
      transition={{ duration: 2 }}
      style={{ position: "absolute", top: 80, left: 60, height: "60px", zIndex: 1 }}
      onAnimationComplete={() => setShowIntro(true)}
    />
  );
}

// Part 3.
function LeShoppingCart() {
  return (
    <motion.img
      src="/cart.png"
      alt="Shopping cart"
      initial={{ x: 1200, y: 100, opacity: 0 }}
      animate={{ x: 300, opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ height: "200px" }}
    />
  );
}

// Introduction Screen Functions
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
    feather.replace();  // Static icon rendering
  }, []);

  // Toggle the startAnimations state
  const toggleStartAnimation = () => {
    setStartAnimation(prevState => !prevState);  // Toggle between true and false
  };

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "400px" }}
      transition={{ duration: 2 }}
      style={{ position: "relative", textAlign: "center" }}
    >
      {/* LeBron Image */}
      <img src="/lebron_intro.jpg" alt="LeBron Smiling" style={{ height: "300px" }} />

      {/* Subtitles + Play/Pause Button */}
      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        
        <button
          onClick={handlePlayPause}
          style={{padding: "0.5rem 1rem", background: "#fff", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer"}}
        >
          <i data-feather="message-circle"></i>
        </button>

        <p style={{ fontSize: "1.25rem", background: "rgba(255,255,255,0.2)", padding: "0.5rem 1rem", borderRadius: "8px" }}>
          I am LeCourse, and I'll be helping you schedule your classes. I've had coaches, mentors, and teammates. Now you got me. Let's do this.
        </p>

        <div className="next">
          <button onClick={toggleStartAnimation}>Next</button>
        </div>

        <audio ref={audioRef} src="/audio.mp3" />
      </div>

    </motion.div>
  );
}

// Main Interface Functions
function PastCoursesScreen() {
  const [courseInput, setCourseInput] = useState("");
  const [courses, setCourses] = useState([]);

  const handleInputChange = (event) => {
    setCourseInput(event.target.value);
  };

  const handleAddCourse = () => {
    if (courseInput.trim() !== "") {
      setCourses([...courses, courseInput.trim()]);
      setCourseInput(""); // Clear input after adding
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddCourse();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h2>Enter your past courses</h2>
        <span style={{ fontSize: "1.2rem", color: "white", display: "block", marginTop: "5px" }}>
          Ex. CS101, MATH101, PHYS101
        </span>
      </div>

      <div className="input">
        <input
          type="text"
          value={courseInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter course name"
        />
        <button onClick={handleAddCourse}> Add Course</button>
      </div>

      {courses.length > 0 && (
        <div style={{ marginTop: "100px", width: "80%", border: '6px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          <h3>Entered Courses:</h3>
          <p style={{ whiteSpace: "pre-wrap", wordBreak: 'break-word' }}>
            {courses.join(", ")}
          </p>
        </div>
      )}
    </motion.div>
  );
}

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
        <option value="">Select a major</option>
        {majors.map((major) => (
          <option key={major} value={major}>
            {major}
          </option>
        ))}
      </select>
    </div>
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
        <p>Credits: {course.credits}</p>
        {course.requirements_satisfied.length > 0 && (
          <div>
            <p><strong>Requirements Satisfied: </strong>{course.requirements_satisfied.join(', ')}</p>
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
      {courseInfoList.map((course, index) => (
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

function createRequirementTable(requirements, filters, setFilters) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  };

  const headerStyle = {
    fontWeight: 'bold',
    borderRight: '1px solid #ccc',
    padding: '5px',
  };

  const cellStyle = {
    padding: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const headers = ['Requirement', 'Taken/Required', 'Filter'];

  const handleFilterChange = (requirement) => (event) => {
    if (event.target.checked) {
      setFilters([...filters, requirement]);
    } else {
      setFilters(filters.filter((filter) => filter !== requirement));
    }
  };

  return (
    <div style={gridStyle}>
      {headers.map((headerText, index) => (
        <div
          key={`header-${index}`}
          style={{
            ...headerStyle,
            borderRight: index < headers.length - 1 ? '1px solid #ccc' : 'none',
          }}
        >
          {headerText}
        </div>
      ))}
      {requirements.map((requirement, index) => (
        <React.Fragment key={`row-${index}`}>
          <div style={cellStyle}>{requirement}</div>
          <div style={cellStyle}>{requirement === 'Required' ? '' : '/6'}</div> {/* Display "/6" except for "Required" */}
          <div style={cellStyle}>
            <input
              type="checkbox"
              checked={filters.includes(requirement)}
              onChange={handleFilterChange(requirement)}
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function ChooseClasses() {
  const [inputValue, setInputValue] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [filters, setFilters] = useState([]); // State to store selected filters

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    console.log('Button clicked with input:', inputValue);
    console.log('Selected filters:', filters); // Log the selected filters
    // Here you would send the filters to the backend
    // fetch('/api/filters', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ filters }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log('Filters sent:', data))
    //   .catch((error) => console.error('Error:', error));
    setInputValue('');
  };

  const requirementsData = ['A&H', 'Natural Science', 'World Culture', 'Required'];

  const courseInfoList = [
    {
      code: 'CSCI-H211',
      name: 'Intro to Computer Science',
      credits: 3,
      requirements_satisfied: ['WC', 'A&H', 'INTENSIVE WRITING'],
      components: [
        [{ type: 'Lecture', instructor: 'Dr. Smith', time: '10:00 AM' }],
        [{ type: 'Discussion', instructor: 'TA Brown', time: '2:00 PM' }],
      ],
    },
    {
      code: 'MATH-M118',
      name: 'Calculus I',
      credits: 4,
      requirements_satisfied: ['QUANTITATIVE REASONING'],
      components: [
        [{ type: 'Lecture', instructor: 'Prof. Lee', time: '9:00 AM' }],
      ],
    },
    {
      code: 'CSCI-H212',
      name: 'Discrete Structures',
      credits: 3,
      requirements_satisfied: ['CSCI'],
      components: [
        [{ type: 'Lecture', instructor: 'Dr. Jones', time: '1:00 PM' }],
      ],
    },
  ];

  const totalCredits = selectedCourses.reduce((total, courseCode) => {
    const course = courseInfoList.find((c) => c.code === courseCode);
    return total + (course ? course.credits : 0);
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      <div className="container">
        <div className="columns" style={{ padding: "0px", background: "none", overflow: "hidden" }}>
          <div className="subColumns">
            <h3>Selected Courses</h3>
            <ul>
              {selectedCourses.map((course, index) => (
                <li key={index}>{course}</li>
              ))}
            </ul>
            <p><strong>Total Credits: {totalCredits}</strong></p>
          </div>

          <div className="subColumns">
            <h3>Requirements</h3>
            {createRequirementTable(requirementsData, filters, setFilters)}
          </div>
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
          onChange={handleInputChange}
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
  const [pastCourses, setPastCourses] = useState([]);
  const [major, setSelectedMajor] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of functions to be shown
  const functions = [
    () => <PastCoursesScreen onCoursesSubmit={setPastCourses} />,
    () => <SelectMajor onMajorChange={setSelectedMajor} />,
    () => <ChooseClasses />,
  ];

  const sendDataToBackend = () => {
    const userData = {
      major: major,
      courses: pastCourses,
    };

    fetch('/api/user-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => console.log('Data sent:', data))
      .catch((error) => console.error('Error:', error));
  };

  const handleNext = () => {
    sendDataToBackend(); // Send data before transitioning
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    if (currentIndex === 1 && pastCourses.length > 0) {
      sendDataToBackend(pastCourses);
    } else if (currentIndex === 2 && major) {
      sendDataToBackend(pastCourses);
    }
  }, [currentIndex, pastCourses, major]);

  return (
    <div id='root'>
      {/* Starting Animations */}
      {startAnimations && (
        <>
          {!showIntro && <LeEntrance setMoveBooks={setMoveBooks} moveBooks={moveBooks} />}
          {moveBooks && !showIntro && <LeBook setShowIntro={setShowIntro} />}
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
        {currentIndex < functions.length - 1 && (
          <div className="next">
            <button onClick={handleNext}>Next</button>
          </div>
        )}
        </>
      )}
    </div>
  );
}

export default App;
