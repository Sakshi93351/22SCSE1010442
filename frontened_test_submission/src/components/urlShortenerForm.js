import React, { useState } from "react";
import { logEvent } from "../utils/logger";
import { isValidUrl, generateShortcode, isValidShortcode } from "../utils/urlUtils";
import { saveShortUrl, getAllShortUrls } from "../utils/storage";
import { useNavigate } from "react-router-dom";

const MAX_URLS = 5;

function UrlShortenerForm() {
  const [inputs, setInputs] = useState([{ url: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);
  const history = useNavigate();

  const handleInputChange = (idx, field, value) => {
    const updated = [...inputs];
    updated[idx][field] = value;
    setInputs(updated);
  };

  const addInput = () => {
    if (inputs.length < MAX_URLS) setInputs([...inputs, { url: "", validity: "", shortcode: "" }]);
  };

  const removeInput = (idx) => {
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let newResults = [];
    let allShortcodes = getAllShortUrls().map(u => u.shortcode);

    inputs.forEach((input, idx) => {
      // Validate URL
      if (!isValidUrl(input.url)) {
        logEvent("ValidationError", "Invalid URL format", { idx, url: input.url });
        valid = false;
        alert(`Invalid URL at row ${idx + 1}`);
        return;
      }
      // Validate validity
      let validity = input.validity ? parseInt(input.validity, 10) : 30;
      if (isNaN(validity) || validity <= 0) {
        logEvent("ValidationError", "Invalid validity", { idx, validity: input.validity });
        valid = false;
        alert(`Invalid validity at row ${idx + 1}`);
        return;
      }
      // Validate shortcode
      let shortcode = input.shortcode.trim();
      if (shortcode) {
        if (!isValidShortcode(shortcode) || allShortcodes.includes(shortcode)) {
          logEvent("ValidationError", "Invalid or duplicate shortcode", { idx, shortcode });
          valid = false;
          alert(`Invalid or duplicate shortcode at row ${idx + 1}`);
          return;
        }
      } else {
        shortcode = generateShortcode(allShortcodes);
      }
      allShortcodes.push(shortcode);

      // Save mapping
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + validity * 60000);
      const newUrl = {
        originalUrl: input.url,
        shortcode,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        clicks: [],
      };
      saveShortUrl(newUrl);
      logEvent("ShortUrlCreated", "Short URL generated", { ...newUrl });
      newResults.push({ ...newUrl });
    });

    if (valid) setResults(newResults);
  };

  return (
    <div>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        {inputs.map((input, idx) => (
          <div key={idx} style={{ marginBottom: "1em" }}>
            <input
              type="text"
              placeholder="Long URL"
              value={input.url}
              onChange={e => handleInputChange(idx, "url", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Validity (minutes, default 30)"
              value={input.validity}
              onChange={e => handleInputChange(idx, "validity", e.target.value)}
              min="1"
            />
            <input
              type="text"
              placeholder="Custom shortcode (optional)"
              value={input.shortcode}
              onChange={e => handleInputChange(idx, "shortcode", e.target.value)}
            />
            {inputs.length > 1 && (
              <button type="button" onClick={() => removeInput(idx)}>Remove</button>
            )}
          </div>
        ))}
        {inputs.length < MAX_URLS && (
          <button type="button" onClick={addInput}>Add another URL</button>
        )}
        <br />
        <button type="submit">Shorten URLs</button>
      </form>
      <div>
        <h3>Results</h3>
        {results.map((r, idx) => (
          <div key={idx}>
            <div>Original: {r.originalUrl}</div>
            <div>
              Shortened: <a href={`/${r.shortcode}`}>{window.location.origin}/{r.shortcode}</a>
            </div>
            <div>Expires at: {new Date(r.expiresAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <button onClick={() => history.push('/stats')}>View Statistics</button>
    </div>
  );
}

export default UrlShortenerForm;
