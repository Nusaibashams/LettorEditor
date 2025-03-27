import axios from "axios";
import React, { useEffect, useState } from "react";

const MyLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await axios.get("/api/letters"); // Fetch data from backend

        console.log("Received data:", response.data); // Debugging log

        if (Array.isArray(response.data)) {
          setLetters(response.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("❌ Error fetching letters:", err);
        setError("Failed to fetch letters.");
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>My Letters</h1>
      <ul>
        {letters.map((letter) => (
          <li key={letter.id}>
            {/* Clicking on this will open the document */}
            <h2>
              <a
                href={`https://drive.google.com/file/d/${letter.id}/view`} // Change URL format if needed
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
              >
                {letter.name ? letter.name : "Untitled Letter"}
              </a>
            </h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyLetters;
