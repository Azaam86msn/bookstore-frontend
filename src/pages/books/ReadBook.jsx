// src/pages/books/ReadBook.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import getBaseUrl from "../../utils/baseURL";
import Loading from "../../components/Loading";
import BookReader from "../../components/BookReader";
import WordDefinition from "../../components/WordDefinition";
import FeedbackForm from "../../components/FeedbackForm";
import { corpusWords as defaultCorpus } from "../../utils/corpus";

const ReadBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [localCorpus, setLocalCorpus] = useState(defaultCorpus);

  useEffect(() => {
    const fetchBookForReading = async () => {
      try {
        const res = await axios.get(`${getBaseUrl()}/api/books/${id}/read`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data && res.data.book) {
          setBook(res.data.book);
        } else {
          setError("Book details not found.");
        }
      } catch (err) {
        console.error("Error fetching book for reading:", err);
        setError(
          err.response?.data?.message || "Error fetching book for reading"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookForReading();
  }, [id]);

  useEffect(() => {
    const fetchFeedbackCorpus = async () => {
      try {
        const res = await axios.get(`${getBaseUrl()}/api/feedback`);
        if (res.data && res.data.words) {
          const merged = Array.from(
            new Set([...defaultCorpus, ...res.data.words])
          );
          setLocalCorpus(merged);
        }
      } catch (err) {
        console.error("Error fetching feedback words:", err);
      }
    };

    fetchFeedbackCorpus();
  }, []);

  const handleFeedbackSubmitted = (newWord) => {
    if (!localCorpus.includes(newWord)) {
      setLocalCorpus((prev) => Array.from(new Set([...prev, newWord])));
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!book) return null;

  return (
    <div className="w-full h-full p-4 overflow-x-hidden">
      <h1 style={{ textAlign: "center" }} className="text-2xl font-bold mb-4">
        {book.title}
      </h1>

      <BookReader
        bookUrl={book.epubUrl}
        bookId={book._id}
        onWordClick={(word) => setSelectedWord(word)}
        complexWords={localCorpus}
      />

      {selectedWord && (
        <WordDefinition
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
        />
      )}

      <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
    </div>
  );
};

export default ReadBook;
