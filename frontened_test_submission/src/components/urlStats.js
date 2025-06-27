import React, { useEffect, useState } from "react";
import { getAllShortUrls } from "../utils/storage";
import { logEvent } from "../utils/logger";

function UrlStats() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    setUrls(getAllShortUrls());
    logEvent("StatsViewed", "User viewed statistics page");
  }, []);

  return (
    <div>
      <h2>Shortened URLs Statistics</h2>
      {urls.length === 0 ? (
        <div>No URLs shortened yet.</div>
      ) : (
        urls.map((u, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", margin: "1em 0", padding: "1em" }}>
            <div>
              <b>Short URL:</b> <a href={`/${u.shortcode}`}>{window.location.origin}/{u.shortcode}</a>
            </div>
            <div><b>Original URL:</b> {u.originalUrl}</div>
            <div><b>Created:</b> {new Date(u.createdAt).toLocaleString()}</div>
            <div><b>Expires:</b> {new Date(u.expiresAt).toLocaleString()}</div>
            <div><b>Total Clicks:</b> {(u.clicks || []).length}</div>
            <div>
              <b>Click Details:</b>
              <ul>
                {(u.clicks || []).map((c, i) => (
                  <li key={i}>
                    {new Date(c.timestamp).toLocaleString()} | Source: {c.source} | Geo: {c.geo}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UrlStats;
