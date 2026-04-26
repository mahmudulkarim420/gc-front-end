const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
const normalizedSocketUrl = socketUrl.endsWith('/') ? socketUrl.slice(0, -1) : socketUrl;

export const SOCKET_URL = normalizedSocketUrl;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${normalizedSocketUrl}/api`;
