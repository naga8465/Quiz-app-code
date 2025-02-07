import React, { useState, useEffect } from "react";

// ProgressBar Component
const ProgressBar = ({ currentQuestionIndex, totalQuestions }) => {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  return (
    <div style={{ width: "100%", background: "#e0e0e0", borderRadius: "5px", margin: "10px 0" }}>
      <div
        style={{
          width: `${progressPercentage}%`,
          height: "10px",
          background: "#4caf50",
          borderRadius: "5px",
        }}
      ></div>
    </div>
  );
};

// Timer Component
const Timer = ({ duration, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout(); // Call the onTimeout function when time runs out
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [timeLeft, onTimeout]);

  return <p>Time Left: {timeLeft} seconds</p>;
};

// AnswerOption Component with Visual Feedback
const AnswerOption = ({ option, onSelect }) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(true);
    onSelect(option.is_correct);
  };

  return (
    <li
      style={{
        padding: "10px",
        margin: "5px",
        border: "1px solid #ccc",
        background: selected ? (option.is_correct ? "#d4edda" : "#f8d7da") : "#fff",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      {option.description}
    </li>
  );
};

// App Component
function App() {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const staticQuizData = {
    "title": "Genetics and Evolution",
    "topic": "The Molecular Basis of Inheritance",
    "questions": [
      {
        "id": 3342,
        "description": "If the base sequence in DNA is 5' AAAT 3' then the base sequence in mRNA is :",
        "options": [
          { "id": 13379, "description": "5'UUUU3'", "is_correct": false },
          { "id": 13380, "description": "3'UUUU5'", "is_correct": false },
          { "id": 13381, "description": "5'AAAU3'", "is_correct": true },
          { "id": 13382, "description": "3'AAAU5'", "is_correct": false }
        ]
      },
      {
        "id": 3315,
        "description": "Avery, MacLeod and Mc Carty used the S(virulent) and R (avirulent) strains of streptococcus pneumoniae. They isolated and purified protein, DNA, RNA from the bacteria and treated them with related enzymes. They concluded that :",
        "options": [
          { "id": 13271, "description": "DNA was transforming agent", "is_correct": true },
          { "id": 13272, "description": "RNA was transforming agent", "is_correct": false },
          { "id": 13273, "description": "Protein was transforming agent", "is_correct": false },
          { "id": 13274, "description": "All are correct", "is_correct": false }
        ]
      },
      {
        "id": 3381,
        "description": "Identify the characteristic which is not applicable to the genetic code:",
        "options": [
          { "id": 13538, "description": "Universal", "is_correct": false },
          { "id": 13539, "description": "Non-polarity", "is_correct": true },
          { "id": 13540, "description": "Degenerate", "is_correct": false },
          { "id": 13541, "description": "Non-overlapping", "is_correct": false }
        ]
      }
    ],
    "reading_materials": [
      {
        "id": 3159,
        "title": "The Genetic Code",
        "keywords": ["Genetic Code", "DNA", "RNA", "Transcription", "Translation"],
        "content_sections": [
          "<h1>The Genetic Code</h1>",
          "<h2>Introduction to the Genetic Code</h2>",
          "<p>This chapter explains how our genes (made of DNA) create proteins. The \"genetic code\" is the set of rules that translates the DNA's language (<span class=\"important\">nucleotides</span>) into the language of proteins (<span class=\"important\">amino acids</span>).</p>",
          "<h2>Key Characteristics of the Genetic Code</h2>",
          "<ul>",
          "<li><strong>Non-overlapping:</strong> Each part of the code is read only once. There's no re-using parts.</li>",
          "<li><strong>Commaless:</strong> There are no breaks or separators between the code's parts. It's one continuous sequence.</li>",
          "<li><strong>Universal:</strong> The code is the same in nearly all living things, from tiny bacteria to humans.</li>",
          "</ul>",
          "<h2>Characteristic NOT Applying to the Genetic Code: <span class=\"highlight\">Polarity</span></h2>",
          "<p>The concept of \"polarity\" (<span class=\"important\">having positive and negative charges</span>) is not relevant to how the genetic code works. The genetic code is about the sequence of molecules, not their electrical charge.</p>"
        ]
      },
      {
        "id": 3134,
        "title": "DNA Replication and Protein Synthesis",
        "keywords": ["DNA replication", "Transcription", "Translation", "Genetic code", "Central dogma"],
        "content_sections": [
          "<h1>Chapter Overview: DNA and Genetic Information</h1>",
          "<p>This chapter explores how DNA functions to transmit genetic information. It covers the following key processes:</p>",
          "<h2>DNA Replication</h2>",
          "<p>DNA replicates itself to create copies, a process known as <span class=\"important\">replication</span>.</p>",
          "<h2>Transcription</h2>",
          "<p>To use these instructions, the cell first makes a copy of the relevant <span class=\"important\">DNA</span> section into a similar molecule called <span class=\"important\">RNA</span> (<span class=\"important\">transcription</span>). Think of this as photocopying a page from the manual.</p>",
          "<h2>Translation</h2>",
          "<p>Then, the <span class=\"important\">RNA</span> copy is used to build <span class=\"important\">proteins</span> (<span class=\"important\">translation</span>). <span class=\"important\">Proteins</span> are the tiny machines that actually do the work in the cell – they build structures, carry out chemical reactions, and so on.</p>"
        ]
      }
    ]
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.jsonserve.com/Uw5CrX");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Quiz Data:", data); // Log the fetched data

        // Validate the structure of the fetched data
        if (!data || !Array.isArray(data.questions)) {
          throw new Error("Invalid quiz data structure.");
        }
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error.message);
        // Fallback to static data if API fails
        console.warn("Falling back to static quiz data...");
        setQuizData(staticQuizData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!quizData) {
    return <div>Error loading quiz data. Please try again later.</div>;
  }

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore((prevScore) => prevScore + 4);
    else setScore((prevScore) => prevScore - 1);

    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      alert(`Quiz completed! Your score: ${score}`);
    }
  };

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>{quizData.title}</h1>
      <p>Topic: {quizData.topic}</p>

      {/* Progress Bar */}
      <ProgressBar
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={quizData.questions.length}
      />

      {/* Timer */}
      <Timer
        duration={30}
        onTimeout={() => handleAnswer(false)} // Handle timeout as an incorrect answer
      />

      {/* Current Question */}
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p>{currentQuestion.description}</p>

      {/* Answer Options */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {currentQuestion.options.map((option) => (
          <AnswerOption key={option.id} option={option} onSelect={handleAnswer} />
        ))}
      </ul>
    </div>
  );
}

export default App;