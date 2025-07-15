// src/components/WordDefinition.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WordDefinition = ({ word, onClose }) => {
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (response.data && Array.isArray(response.data)) {
          const meanings = response.data[0].meanings;
          if (meanings && meanings.length > 0) {
            setDefinition(meanings[0].definitions[0].definition);
          } else {
            setError('No definition found.');
          }
        } else {
          setError('No definition found.');
        }
      } catch (err) {
        setError('Error fetching definition.');
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Definition: {word}</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {definition && <p>{definition}</p>}
      </div>
    </div>
  );
};

export default WordDefinition;
