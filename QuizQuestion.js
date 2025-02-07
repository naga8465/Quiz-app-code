import React from 'react';

function QuizQuestion({ question, onSelectAnswer }) {
  return (
    <div>
      <h2>{question.text}</h2>
      <ul>
        {question.options.map((option, index) => (
          <li key={index} onClick={() => onSelectAnswer(option.isCorrect)}>
            {option.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizQuestion;