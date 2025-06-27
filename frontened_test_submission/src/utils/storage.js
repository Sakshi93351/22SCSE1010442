const STORAGE_KEY = "shortUrls";

export function getAllShortUrls() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveShortUrl(urlObj) {
  const urls = getAllShortUrls();
  urls.push(urlObj);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}

export function updateShortUrl(shortcode, updateFn) {
  const urls = getAllShortUrls();
  const idx = urls.findIndex(u => u.shortcode === shortcode);
  if (idx !== -1) {
    urls[idx] = updateFn(urls[idx]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  }
}

export function getShortUrl(shortcode) {
  return getAllShortUrls().find(u => u.shortcode === shortcode);
}
