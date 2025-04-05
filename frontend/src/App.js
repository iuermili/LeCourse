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

function LeCourseIntro({ setShowStartAnis }) {
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

  // Update the Feather Icon when state changes
  useEffect(() => {
    // Ensure Feather Icons are replaced in DOM after render
    console.log("Feather icons being replaced");
    feather.replace();
  }, [isPlaying]);

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
          <i data-feather={isPlaying ? 'pause' : 'play'}></i>
        </button>

        <audio ref={audioRef} src="/audio.mp3" />
      </div>
    </motion.div>
  );
}

  function PastCoursesScreen() {
    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '2rem',
          textAlign: 'center'
      }}
    >
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Enter Your Past Courses</h2>
        <input
          type="text"
          placeholder="Enter your courses here"
          style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: 'none',
            outline: 'none',
            minWidth: '200px',
            backgroundColor: '#fff',
            color: '#000',
        }}
      />
        <button
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
        }}
      >
        Submit
      </button>
    </motion.div>
  );
}

function App() {
  const [moveBooks, setMoveBooks] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showStartAnis, setShowStartAnis] = useState(true);
  const [showPastCourses, setShowPastCourses] = useState(false);

  return (
    <div style={{ height: "100vh", background: "blue", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>

      {/* Starting Animations */}
      {showStartAnis && (
        <>
          {!showIntro && <LeBronEntrance setMoveBooks={setMoveBooks} moveBooks={moveBooks} />}
          {moveBooks && !showIntro && <BookAnimation setShowIntro={setShowIntro} />}
          {!showIntro && <ShoppingCart />}
          {showIntro && <LeCourseIntro setShowStartAnis={setShowStartAnis}/>}
        </>
      )}

      {/* Past Courses Screen*/}
      {showIntro && !showPastCourses && <PastCoursesScreen />}

    </div>
  );
}

export default App;
