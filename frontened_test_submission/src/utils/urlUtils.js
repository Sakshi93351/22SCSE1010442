export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidShortcode(shortcode) {
  return /^[a-zA-Z0-9]{4,10}$/.test(shortcode); // 4-10 alphanumeric
}

export function generateShortcode(existingShortcodes) {
  let code;
  do {
    code = Math.random().toString(36).substr(2, 6);
  } while (existingShortcodes.includes(code));
  return code;
}
