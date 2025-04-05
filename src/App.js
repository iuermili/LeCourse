import React, { useState } from "react";
import { motion } from "framer-motion";  

function App() {
  const [moveBooks, setmoveBooks] = useState(false);
  const [showText, setShowText] = useState(false);

  return (
    <div style={{ height: "100vh", background: "blue", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <motion.img
        src="/lebron.png"
        alt="LeBron"
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ height: "200px" }}
        onAnimationComplete={() => setShowText(true)} 
      />

      {showText && (
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ marginTop: "20px" }}
        >
          LeCourse
        </motion.h1>
      )}

    </div>
  );
}

export default App;
