import React, { useState, useRef, useEffect } from "react"; // Fundamental Library for React
import { motion } from "framer-motion";                     // Animation Library
import feather from "feather-icons";                        // Library for Open-Source SVG Icons
import './App.css';                                         // File that simplifies CSS
import { make_request, init_student_endpoint_path, fetch_classes_endpoint_path } from './requestMaker.js';

// Starting Animation Functions (3 Parts)
// Part 1.
function LeEntrance({ setDunk }) {
  return (
    <motion.div
      initial={{ x: -1200, y: 0, opacity: 0 }}
      animate={{ x: 100, opacity: 1 }}
      transition={{ duration: 6 }}
      style={{ position: "relative", overflow: "visible", display: "flex", flexDirection: "row", alignItems: "flex-end", gap: "100px"}}
      onAnimationComplete={() => setDunk(true)}
    >
      
      <h1>Introducing LeCourse</h1>
      <img src="/lebron_dunk.png" alt="LeBron" style={{ height: "400px" }} />
      {!setDunk && (<img src="/books.png" alt="Books" style={{ position: "absolute", top: "50px", left: "0px",height: "50px"}}/>)}
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
      animate={{ x: 100, opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ height: "100px" }}
    />
  );
}

// Part 3.
function LeDunk(setShowIntro) {
  return (
    <motion.img src="/books.png" alt="Flying Books"
      initial={{ opacity: 1 }}
      animate={{
        x: [100, 300],
        y: [-50, -50],
        opacity: [1, 1]
      }}
      transition={{ duration: 2 }}
      style={{ position: "absolute", top: 80, left: 60, height: "60px", zIndex: 1 }}
      onAnimationComplete={() => setShowIntro(true)}
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
        <option value="">Select your major</option>
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
        {course.field || course.genEdSatisfied && (
          <div>
            {course.field && <p><strong>Major Satisfied: </strong>{course.field}</p>}
            {course.genEdSatisfied && <p><strong>Gen-Ed Satisfied: </strong>{course.genEdSatisfied}</p>}
          </div>
        )}
        {course.requirements_satisfied && course.requirements_satisfied.length > 0 && (
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

function createRequirementTable({fetchFilteredCourses, filters, setFilters, selectedCourses, courseInfoList, setCourseInfoList}) {


    const requirements = ["Arts & Humanities", "World Cultures", "Natural Science", "Major"]

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
      fetchFilteredCourses();
    } else {
      setFilters(filters.filter((filter) => filter !== requirement));
      fetchFilteredCourses();
    }
  };

  const requirementCounts = {};
  selectedCourses.forEach((courseCode) => {
    const course = courseInfoList.find((c) => c.code === courseCode);
    if (course && course.requirements_satisfied) {
      course.requirements_satisfied.forEach((req) => {
        requirementCounts[req] = (requirementCounts[req] || 0) + course.credits;
      });
    }
  });

  let totalCredits = 0;
  selectedCourses.forEach((courseCode) => {
    const course = courseInfoList.find((c) => c.code === courseCode);
    if (course) {
      totalCredits += course.credits;
    }
  });

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
      {requirements.map((requirement, index) => {
        let count = requirementCounts[requirement] || 0;
        let displayCount = requirement === 'Required' ? '' : `${count}/6`;
        if (requirement === 'Total') {
          displayCount = `${totalCredits}/120`;
        }

        return (
          <React.Fragment key={`row-${index}`}>
            <div style={cellStyle}>{requirement}</div>
            <div style={cellStyle}>{displayCount}</div>
            <div style={cellStyle}>
              {requirement !== 'Total' && (
                <input
                  type="checkbox"
                  checked={filters.includes(requirement)}
                  onChange={handleFilterChange(requirement)}
                />
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ChooseClasses({ fetchFilteredCourses, courseInfoList, setCourseInfoList, filters, setFilters, interests, setInterests }) {
  // const [inputValue, setInputValue] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    setFilters(inputValue);
    fetchFilteredCourses();
    setInputValue("");
  };

  const requirementsData = ['Arts & Humanities', 'Natural Science', 'World Culture', 'Required', 'Total'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div className="container">
        <div className="columns" style={{ padding: "0px", background: "none" }}>
          <div className="subColumns">
            <h3>Selected Courses</h3>
            <ul className="course-list">
              {selectedCourses.map((course, index) => (
                <li key={index} className="course-item">{course}</li>
              ))}
            </ul>
          </div>
          <div className="subColumns">
            <h3>Requirements</h3>
            {createRequirementTable({fetchFilteredCourses, requirementsData, filters, setFilters, selectedCourses, courseInfoList, setCourseInfoList})}
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
  const [dunkComplete, setDunkComplete] = useState(false); // New state
  const [dunk, setDunk] = useState(false);

  const [showTitle, setShowTitle] = useState(false); // New state
  const [pastCourses, setPastCourses] = useState('');
  const [major, setSelectedMajor] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSendingData, setIsSendingData] = useState(false);
  const [courseInfoList, setCourseInfoList] = useState([]);
  const [filters, setFilters] = useState([]);
  const [interests, setInterests] = useState('');

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
    () => <ChooseClasses fetchFilteredCourses={fetchFilteredCourses} courseInfoList={courseInfoList} filters={filters} setFilters={setFilters} interests={interests} setInterests={setInterests}/>,
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

  const fetchFilteredCourses = async () => {
    try {
      const requestData = {
        criteria: filters,
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
          {!showIntro && <LeEntrance setDunk={setDunk}/>}
          {!showIntro && <LeShoppingCart />}
          {!showIntro && <LeDunk setShowIntro={setShowIntro}/>}
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
        {currentIndex < functions.length - 1 && (    // Disable next button when on last page or communicating with back-end
          <div className="next">
            <button onClick={isSendingData ? () => {} : handleNext}>NEXT</button>
          </div>
        )}
        </>
      )}
    </div>
  );
}

export default App;
