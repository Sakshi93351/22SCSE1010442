// Example custom logger (replace with your pre-test setup implementation)
const logStore = [];

export function logEvent(eventType, message, data = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    eventType,
    message,
    data,
  };
  logStore.push(entry);
  // Optionally, persist to localStorage or send to backend
}

export function getLogs() {
  return logStore;
}
