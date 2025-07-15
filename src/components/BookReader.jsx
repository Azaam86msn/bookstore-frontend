import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";

// Monkey‑patch epubjs to swallow errors (unchanged)…
const RenditionProto = ePub.Rendition.prototype;
const _origInject = RenditionProto.injectIdentifier;
RenditionProto.injectIdentifier = function (...args) {
  try { return _origInject.apply(this, args); }
  catch (err) { console.warn("Ignored epubjs packaging error:", err.message); }
};
["start","render","destroy"].forEach(fn => {
  const orig = RenditionProto[fn];
  RenditionProto[fn] = function (...args) {
    try { return orig.apply(this, args); }
    catch (err) { console.warn(`Ignored epubjs ${fn} error:`, err.message); }
  };
});

const DEFAULT_COMPLEX_WORDS = ["abstruse", "arcane", "esoteric", "conundrum"];

// Helper to create a <span> for a matched word
function createSpecialSpan(word, linkedWordsMap) {
  const span = document.createElement("span");
  span.className = "special-word";
  span.setAttribute("data-word", word);
  span.style.cursor = "pointer";
  span.style.textDecoration = "underline";
  const lower = word.toLowerCase();
  if (linkedWordsMap.has(lower)) {
    span.style.color = "green";
    span.setAttribute("data-link", linkedWordsMap.get(lower));
  } else {
    span.style.color = "blue";
  }
  span.textContent = word;
  return span;
}

// Refactored to reduce nesting & complexity
function decorateTextNodes(node, complexWords, linkedWordsMap) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue;
    const words = Array.from(
      new Set([...complexWords, ...linkedWordsMap.keys()])
    ).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp("\\b(" + words.join("|") + ")\\b", "gi");
    let lastIndex = 0, match, replaced = false;
    const frag = document.createDocumentFragment();

    while ((match = regex.exec(text))) {
      replaced = true;
      if (match.index > lastIndex) {
        frag.appendChild(
          document.createTextNode(text.slice(lastIndex, match.index))
        );
      }
      frag.appendChild(createSpecialSpan(match[0], linkedWordsMap));
      lastIndex = regex.lastIndex;
    }

    if (replaced) {
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      node.parentNode.replaceChild(frag, node);
    }
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    node.tagName !== "A"
  ) {
    node.childNodes.forEach(child =>
      decorateTextNodes(child, complexWords, linkedWordsMap)
    );
  }
}

const BookReader = ({
  bookUrl,
  bookId,
  complexWords = DEFAULT_COMPLEX_WORDS,
  onWordClick,
}) => {
  const viewerRef = useRef(null);
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const bookRef = useRef(null);
  const [linkedWords, setLinkedWords] = useState([]);

  // Fetch linkedWords when bookId changes (unchanged)
  useEffect(() => {
    if (!bookId) return;
    axios
      .get(`${getBaseUrl()}/api/books/${bookId}/read`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(res => setLinkedWords(res.data.book.linkedWords || []))
      .catch(err => console.error("Failed to fetch linkedWords:", err));
  }, [bookId]);

  // Extracted helper for content registration
  const setupContentHandlers = (contents) => {
    const body = contents.document.body;
    const map = new Map(
      linkedWords.map(w => [w.phrase.toLowerCase(), w.url])
    );
    decorateTextNodes(body, complexWords, map);

    body.addEventListener("click", e => {
      const target = e.target.closest(".special-word");
      if (!target) return;
      e.preventDefault();
      const link = target.getAttribute("data-link");
      const word = target.getAttribute("data-word");
      if (link && window.confirm(`Visit product for "${word}"?`)) {
        window.open(link, "_blank");
      } else if (onWordClick) {
        onWordClick(word);
      }
    });

    const iframe = viewerRef.current.querySelector("iframe");
    if (iframe) iframe.removeAttribute("sandbox");
  };

  // Main EPUB setup, much flatter now
  useEffect(() => {
    if (!bookUrl || !viewerRef.current) return;

    let renditionInstance;
    const initRendition = () => {
      const book = ePub(bookUrl);
      bookRef.current = book;
      renditionInstance = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100vh",
        flow: "paginated",
        allowScriptedContent: true,
        allowPopups: true,
      });
      setRendition(renditionInstance);

      book.ready
        .then(() => book.locations.generate(1600))
        .then(() => {
          setTotalPages(book.locations.length());
          setCurrentPage("1");
        });

      renditionInstance.on("relocated", loc => {
        const page = book.locations.locationFromCfi(loc.start.cfi);
        setCurrentPage(String(page));
      });

      renditionInstance.hooks.content.register(setupContentHandlers);
    };

    initRendition();
    return () => {
      try {
        renditionInstance?.destroy();
      } catch (err) {
        console.warn("Error during rendition destroy:", err.message);
      }
    };
  }, [bookUrl, complexWords, linkedWords, onWordClick]);

  const handleNext = () => rendition?.next();
  const handlePrev = () => rendition?.prev();
  const handlePageChange = e => {
    const val = e.target.value;
    if (val === "" || /^\d*$/.test(val)) setCurrentPage(val);
  };
  const goToPage = () => {
    const page = parseInt(currentPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      const cfi = bookRef.current.locations.cfiFromLocation(page);
      if (cfi) rendition.display(cfi);
    }
  };

  const renderControls = () => (
    <div style={{ marginBottom: "1rem", textAlign: "center" }}>
      <button onClick={handlePrev} style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}>
        Previous
      </button>
      <span style={{ fontWeight: "bold" }}>
        Page {currentPage || 1} of {totalPages}
      </span>
      <button onClick={handleNext} style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
        Next
      </button>
      <input
        type="text"
        value={currentPage}
        onChange={handlePageChange}
        style={{ marginLeft: "1rem", padding: "0.5rem", width: "80px" }}
      />
      <button onClick={goToPage} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}>
        Go to Page
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem", position: "relative" }}>
      {renderControls()}
      <div
        ref={viewerRef}
        style={{ border: "1px solid #ccc", width: "100%", height: "calc(100vh - 120px)", overflowY: "auto" }}
      />
      {renderControls()}
    </div>
  );
};

export default BookReader;
