import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShortUrl, updateShortUrl } from "../utils/storage";
import { logEvent } from "../utils/logger";

function RedirectHandler() {
  const { shortcode } = useParams();
  const history = useNavigate();

  useEffect(() => {
    const urlObj = getShortUrl(shortcode);
    if (!urlObj) {
      logEvent("RedirectError", "Shortcode not found", { shortcode });
      alert("Shortcode not found");
      history.push("/");
      return;
    }
    const now = new Date();
    if (new Date(urlObj.expiresAt) < now) {
      logEvent("RedirectError", "Shortcode expired", { shortcode });
      alert("This link has expired.");
      history.push("/");
      return;
    }
    // Log click
    const click = {
      timestamp: now.toISOString(),
      source: document.referrer || "direct",
      geo: "Unknown", // Optionally use a geo API
    };
    updateShortUrl(shortcode, (u) => ({
      ...u,
      clicks: [...(u.clicks || []), click],
    }));
    logEvent("ShortUrlRedirect", "Redirected to original URL", { shortcode, click });
    window.location.href = urlObj.originalUrl;
  }, [shortcode, history]);

  return <div>Redirecting...</div>;
}

export default RedirectHandler;
