final themeColors = {
  'light': {
    'primary': '#08ba9f',
    'secondary': '#8ee6d9',
    'accent': '#55ecd5',
    'neutral': '#1b322e',
    'base-100': '#f2f8f7',
    'info': '#0081ff',
    'success': '#00c49d',
    'warning': '#f5a000',
    'error': '#ff8993',
  },
  'dark': {
    'primary': '#45f7dd',
    'secondary': '#197164',
    'accent': '#13aa93',
    'neutral': '#1b322e',
    'base-100': '#070d0c',
    'info': '#0081ff',
    'success': '#00c49d',
    'warning': '#f5a000',
    'error': '#ff8993',
  }
};

// Add this bool variable to track theme state
bool isDarkMode = false;

// Add a function to toggle theme
void toggleTheme() {
  isDarkMode = !isDarkMode;
}

// Add a function to get current theme mode
String getCurrentTheme() {
  return isDarkMode ? 'dark' : 'light';
}

// Add a function to get colors for current theme
Map<String, String> getCurrentThemeColors() {
  return themeColors[getCurrentTheme()]!;
}