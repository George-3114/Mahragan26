// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'festival_token',
  USER: 'festival_user',
  THEME: 'festival_theme',
} as const;

// Token management
export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// User data management
export const setStoredUser = (user: string): void => {
  localStorage.setItem(STORAGE_KEYS.USER, user);
};

export const getStoredUser = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER);
};

export const removeStoredUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Theme management
export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

export const getTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
};

// Clear all storage
export const clearStorage = (): void => {
  removeToken();
  removeStoredUser();
};
