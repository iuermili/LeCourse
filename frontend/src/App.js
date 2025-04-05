import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import feather from "feather-icons";

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

function LeCourseIntro({ setShowStartAnis, setShowPastCourses }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);  // Track if audio is playing

  // Play/Pause button handler
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();  // Pause the audio if it's currently playing
      } else {
        audio.play();   // Play the audio if it's paused
      }
      setIsPlaying(!isPlaying);  // Toggle the playing state
    }
  };

  // Replace feather icons in the component when it renders
  useEffect(() => {
    feather.replace();  // Static icon rendering
  }, []);

  // Handle the button click to transition to the past courses screen
  const handleTransitionToPastCourses = () => {
    setShowPastCourses(true); // Transition to the next screen
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
          style={{
            padding: "0.5rem 1rem",
            background: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {/* Use Feather Icon for Play/Pause */}
          <i data-feather="message-circle"></i>
        </button>

        <audio ref={audioRef} src="/audio.mp3" />
      </div>

      {/* Add a button to transition to the past courses screen */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleTransitionToPastCourses}
          style={{
            padding: "0.5rem 1rem",
            background: "#4CAF50",  // Green background for the button
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Enter Your Past Courses
        </button>
      </div>
    </motion.div>
  );
}

function PastCoursesScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{ textAlign: "center" }}
    >
      <h2>Enter your past courses</h2>
      {/* Add your form or input fields for past courses */}
    </motion.div>
  );
}

function App() {
  const [moveBooks, setMoveBooks] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showStartAnis, setShowStartAnis] = useState(true);
  const [showPastCourses, setShowPastCourses] = useState(false);

  const handleIntroComplete = () => {
    setShowPastCourses(true); // Transition to past courses screen after intro is complete
  };

  return (
    <div style={{ height: "100vh", background: "blue", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>

      {/* Starting Animations */}
      {showStartAnis && (
        <>
          {!showIntro && <LeBronEntrance setMoveBooks={setMoveBooks} moveBooks={moveBooks} />}
          {moveBooks && !showIntro && <BookAnimation setShowIntro={setShowIntro} />}
          {!showIntro && <ShoppingCart />}
          {showIntro && <LeCourseIntro setShowStartAnis={setShowStartAnis} setShowPastCourses={setShowPastCourses} />}
        </>
      )}

      {/* Show Past Courses Screen */}
      {showPastCourses && <PastCoursesScreen />}  {/* Render the past courses screen once intro is done */}
    </div>
  );
}

export default App;
