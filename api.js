const host = window.location.hostname;
const esLocal =
  !host ||
  host === 'localhost' ||
  host === '127.0.0.1' ||
  window.location.protocol === 'file:';

export const API_URL = esLocal ? 'http://localhost:3000/api' : '/api';
