import api from './api';

// ─── Offline Auth Helpers (localStorage fallback) ───

const USERS_KEY = 'kt_offline_users';

function getOfflineUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveOfflineUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Simple hash for offline mode (NOT cryptographic – demo/prototype use only)
async function simpleHash(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateOfflineToken(userId) {
  // Create a simple JWT-like token for offline mode
  const payload = { id: userId, offline: true, exp: Date.now() + 86400000 }; // 24h
  return btoa(JSON.stringify(payload));
}

// ─── Auth Service ───

export const authService = {
  register: async ({ name, email, password, business_name }) => {
    // Try server first
    try {
      const response = await api.post('/auth/register', { name, email, password, business_name });
      return response.data;
    } catch (serverError) {
      console.warn('Server register failed, using offline mode:', serverError.message);

      // Offline fallback
      const users = getOfflineUsers();

      // Check if email already registered offline
      if (users.find(u => u.email === email)) {
        throw { response: { data: { message: 'Email sudah terdaftar.' } } };
      }

      const hashedPassword = await simpleHash(password);
      const newUser = {
        id: Date.now(),
        name,
        email,
        business_name: business_name || '',
        password: hashedPassword,
        created_at: new Date().toISOString(),
      };

      users.push(newUser);
      saveOfflineUsers(users);

      const { password: _, ...userWithoutPassword } = newUser;
      const token = generateOfflineToken(newUser.id);

      return { data: { user: userWithoutPassword, token } };
    }
  },

  login: async ({ email, password }) => {
    // Try server first
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (serverError) {
      console.warn('Server login failed, using offline mode:', serverError.message);

      // Offline fallback
      const users = getOfflineUsers();
      const hashedPassword = await simpleHash(password);
      const user = users.find(u => u.email === email && u.password === hashedPassword);

      if (!user) {
        throw { response: { data: { message: 'Email atau password salah.' } } };
      }

      const { password: _, ...userWithoutPassword } = user;
      const token = generateOfflineToken(user.id);

      return { data: { user: userWithoutPassword, token } };
    }
  },

  getMe: async () => {
    // Try server first
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (serverError) {
      console.warn('Server getMe failed, using offline mode:', serverError.message);

      // Offline fallback: decode token from localStorage
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      try {
        const payload = JSON.parse(atob(token));
        if (payload.exp < Date.now()) {
          localStorage.removeItem('token');
          throw new Error('Token expired');
        }

        const users = getOfflineUsers();
        const user = users.find(u => u.id === payload.id);
        if (!user) throw new Error('User not found');

        const { password: _, ...userWithoutPassword } = user;
        return { data: userWithoutPassword };
      } catch {
        localStorage.removeItem('token');
        throw new Error('Invalid token');
      }
    }
  },
};

export default authService;
