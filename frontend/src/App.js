import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import feather from "feather-icons";

// Starting Animation Functions

function LeBronEntrance({ setMoveBooks, moveBooks }) {
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
          style={{
            position: "absolute",
            top: "50px",
            left: "0px",
            height: "50px"
          }}
        />
      )}
    </motion.div>
  );
}

function BookAnimation({ setShowIntro }) {
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

function ShoppingCart() {
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
      transition={{ duration: 3 }}
      style={{ position: "relative", textAlign: "center" }}
    >
      {/* LeBron Image */}
      <img src="/lebron_intro.jpg" alt="LeBron Smiling" style={{ height: "400px" }} />

      {/* Subtitles + Play/Pause Button */}
      <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <p style={{ fontSize: "1.25rem", background: "rgba(255,255,255,0.2)", padding: "0.5rem 1rem", borderRadius: "8px" }}>
          I am LeCourse, and I'll be helping you schedule your classes. I've had coaches, mentors, and teammates. Now you got me. Let's do this.
        </p>

        {/* Play/Pause button */}
        <button
          onClick={handlePlayPause}
          style={{padding: "0.5rem 1rem", background: "#fff", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold"}}
        >
          {/* Use Feather Icon for Play/Pause */}
          <i data-feather="message-circle"></i>
        </button>

        {/* Button to toggle startAnimations */}
      <button
        onClick={toggleStartAnimation}
        style={{
          padding: "0.5rem 1rem",
          background: "#fff",
          color: "#000",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Start
      </button>

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
        <h2 style={{ fontSize: "2.5rem" }}>Enter your past courses</h2>
        <span style={{ fontSize: "1.2rem", color: "white", display: "block", marginTop: "5px" }}>
          Ex. CSCI-C211, CSCI-C212, CSCI-C241
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "40px", marginTop: "40px" }}>
        <input
          type="text"
          value={courseInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter course name"
          style={{
            padding: "8px",
            width: "300px",
            marginRight: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: 'none',
          }}
        />
        <button
          onClick={handleAddCourse}
          style={{
            padding: "8px 16px",
            background: "#D4A000",
            color: "black", // Changed text color to black
            border: "none",
            cursor: "pointer",
            borderRadius: "20px",
          }}
        >
          Add Course
        </button>
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
  const majors = ["Computer Science", "Mathematics", "Physics", "Engineering", "Biology"]; // Example majors

  const [selectedMajor, setSelectedMajor] = useState("");

  const handleMajorChange = (event) => {
    const major = event.target.value;
    setSelectedMajor(major);
    onMajorChange(major); // Notify parent component
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{ textAlign: "center" }}
    >
      <h2>Select your Major</h2>
      <div>
        <label htmlFor="major">Select your major:</label>
        <select id="major" value={selectedMajor} onChange={handleMajorChange}>
          <option value="">Select a major</option>
          {majors.map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}


// Function to display a single course
const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <h3>{course.code}: {course.name}</h3>
      <p>Credits: {course.credits}</p>
      
      {course.requirements_satisfied.length > 0 && (
        <div>
          <strong>Requirements Satisfied:</strong>
          <ul>
            {course.requirements_satisfied.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {course.components.length > 0 && (
        <div>
          <strong>Course Components:</strong>
          {course.components.map((componentList, idx) => (
            <div key={idx}>
              <h4>Component {idx + 1}</h4>
              <ul>
                {componentList.map((component, cIdx) => (
                  <li key={cIdx}>
                    <strong>{component.type}</strong> - Instructor: {component.instructor} at {component.time}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Function to render the list of courses
const CourseList = ({ courseInfoList }) => {
  return (
    <div>
      {courseInfoList.map((course, index) => (
        <CourseCard key={index} course={course} />
      ))}
    </div>
  );
};

function ChooseClasses() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    console.log('Button clicked with input:', inputValue);
    setInputValue(''); // Clear the input after clicking
  };

  // Test data
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
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '600px'}}>
      {/* Top row with two boxes */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, height: '100px', backgroundColor: 'lightblue' }}>
          {/* Content for the first box */}
        </div>
        <div style={{ flex: 1, height: '100px', backgroundColor: 'lightgreen' }}>
          {/* Content for the second box */}
        </div>
      </div>

      {/* Show Suggested Courses */}
      <div style={{ height: '200px', backgroundColor: 'lightcoral', overflow: 'scroll' }}>
        <CourseList courseInfoList={courseInfoList} />
      </div>

      {/* Input bar with button */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          style={{ flex: 1, padding: '10px' }}
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

  // Array of functions to be shown
  const functions = [
    () => <PastCoursesScreen />,
    () => <SelectMajor />,
    () => <ChooseClasses />,
  ];

  // State to track the current function index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle next button click
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1));
  };

  return (
    <div style={{ height: "100vh", background: "#552583", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>

      {/* Starting Animations */}
      {startAnimations && (
        <>
          {!showIntro && <LeBronEntrance setMoveBooks={setMoveBooks} moveBooks={moveBooks} />}
          {moveBooks && !showIntro && <BookAnimation setShowIntro={setShowIntro} />}
          {!showIntro && <ShoppingCart />}
          {showIntro && <LeCourseIntro setStartAnimation={setStartAnimation} />}
        </>
      )}

      {/* Show Main Interface */}
      {!startAnimations && 
        <div>
          <div>
            {/* Render the current function/content */}
            {functions[currentIndex]()}
          </div>
          {currentIndex < functions.length - 1 && (
            <button onClick={handleNext}>Next</button>
          )}
        </div>
      } 


    </div>
  );
}

export default App;
