import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FeedbackPage.css";
import { sanitizeString } from "../security/inputSanitizer"; // OWASP A03

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) {
      alert("Please write your feedback before submitting.");
      return;
    }
    // OWASP A03 – Sanitize feedback before using/storing it
    const safeFeedback = sanitizeString(feedback);
    if (!safeFeedback) {
      alert("Please write valid feedback.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => navigate("/vehicles"), 3000);
  };

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        {!submitted ? (
          <>
            <h2 className="feedback-title">We’d love your feedback!</h2>
            <textarea
              placeholder="Write your feedback here..."
              value={feedback}
              maxLength={1000}
              onChange={(e) => setFeedback(e.target.value)}
              aria-label="Feedback"
            ></textarea>
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Feedback
            </button>
          </>
        ) : (
          <div className="thankyou-section">
            <h2>✅ Thank you for your feedback!</h2>
            <p>Have a safe and enjoyable trip 🚗💨</p>
          </div>
        )}
      </div>
    </div>
  );
}
