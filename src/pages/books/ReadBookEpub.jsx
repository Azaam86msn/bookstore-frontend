// src/pages/books/ReadBookEpub.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import getBaseUrl from '../../utils/baseURL';
import BookReader from '../../components/BookReader';
import WordDefinition from '../../components/WordDefinition';
import ClickableText from '../../components/ClickableText';

const ReadBookEpub = () => {
  const { id } = useParams();
  const [selectedWord, setSelectedWord] = useState(null);

  // Define the EPUB download URL from your API
  const epubUrl = `${getBaseUrl()}/api/books/${id}/download`;

  // A sample text for demonstration if needed.
  const sampleText = "Here is some example text that might include words like paradigm or juxtaposition.";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Read Book (EPUB Reader)</h1>
      {/* Render clickable sample text */}
      <ClickableText text={sampleText} onWordClick={(word) => setSelectedWord(word)} />
      
      {/* Render the BookReader with the EPUB url */}
      <BookReader bookUrl={epubUrl} />
      
      {/* Display the word definition modal */}
      {selectedWord && (
        <WordDefinition word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}
    </div>
  );
};

export default ReadBookEpub;
