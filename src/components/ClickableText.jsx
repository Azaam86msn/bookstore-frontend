// src/components/ClickableText.jsx
import React from 'react';
import { corpusWords } from '../utils/corpus';

const ClickableText = ({ text, onWordClick }) => {
  // Split text preserving spaces
  const words = text.split(/(\s+)/);

  return (
    <p>
      {words.map((word, index) => {
        const cleanedWord = word
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
          .toLowerCase();

        const keyBase = `${cleanedWord || 'text'}-${index}`;

        if (corpusWords.includes(cleanedWord)) {
          return (
            <span
              key={keyBase}
              onClick={() => onWordClick(cleanedWord)}
              className="cursor-pointer text-blue-500 hover:underline"
            >
              {word}
            </span>
          );
        }

        return <span key={keyBase}>{word}</span>;
      })}
    </p>
  );
};

export default ClickableText;
