// Define a constant for the token key used in local storage
const TOKEN_KEY = 'authToken';

export interface User {
  id: string;
  username: string;
  // Add other necessary user properties here
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
}

export const isValidToken = (token: string): boolean => {
  try {
    const [header, payload, signature] = token.split('.');
    
    // Ensure token has 3 parts (header, payload, signature)
    if (!header || !payload || !signature) {
      return false;
    }

    // Decode payload
    const decodedPayload = JSON.parse(atob(payload));
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired
    if (decodedPayload.exp && decodedPayload.exp < currentTime) {
      return false;
    }

    // Additional validation logic can be implemented here, such as signature verification

    return true; // Token is considered valid if it passes all checks
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}

export const currentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch('/api/current-user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (response.ok) {
      const user: User = await response.json();
      return user;
    }

    return null;
  } catch (err) {
    console.error('Failed to fetch current user:', err instanceof Error ? err.message : String(err));
    return null;
  }
};

export const login = async (username: string, password: string): Promise<{ user: User, token: string }> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const { user, token } = await response.json();
    return { user, token };
  } catch (err) {
    console.error('Login failed:', err instanceof Error ? err.message : String(err));
    throw err;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  } catch (err) {
    console.error('Logout failed:', err instanceof Error ? err.message : String(err));
    throw err;
  }
};
