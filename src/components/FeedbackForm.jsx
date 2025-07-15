// src/components/FeedbackForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import getBaseUrl from '../utils/baseURL';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const [word, setWord] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim()) return;

    try {
      // Grab the JWT from wherever you store it (here: localStorage)
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${getBaseUrl()}/api/feedback`,
        { word },
        {
          headers: {
            // include the Bearer token so verifyToken can authorize
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        setFeedbackMsg('Word submitted successfully!');
        onFeedbackSubmitted(word.trim().toLowerCase());
        setWord('');
      }
    } catch (error) {
      // If status is 409, it means the word already exists.
      if (error.response && error.response.status === 409) {
        setFeedbackMsg('Word already exists.');
        onFeedbackSubmitted(word.trim().toLowerCase());
        setWord('');
      } else {
        setFeedbackMsg('Error submitting the word.');
      }
    }
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="text-lg mb-2">Suggest a Complex Word</h3>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          id="feedback-word"
          name="feedbackWord"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter word"
          className="border p-2 rounded mr-2 flex-grow"
          autoComplete="off"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
      {feedbackMsg && <p className="mt-2">{feedbackMsg}</p>}
    </div>
  );
};

export default FeedbackForm;
