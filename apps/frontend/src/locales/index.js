import { vi } from "./vi";
import { en } from "./en";

// Available locales
export const locales = {
  vi,
  en,
};

// Default locale
export const defaultLocale = "vi";

// Current locale (can be managed by state management later)
let currentLocale = defaultLocale;

// Get current locale
export const getCurrentLocale = () => currentLocale;

// Set current locale
export const setCurrentLocale = (locale) => {
  if (locales[locale]) {
    currentLocale = locale;
  }
};

// Get translation by key path
export const t = (keyPath, params = {}) => {
  const keys = keyPath.split(".");
  let value = locales[currentLocale];

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) break;
  }

  // Fallback to English if not found in current locale
  if (value === undefined && currentLocale !== "en") {
    let fallbackValue = locales.en;
    for (const key of keys) {
      fallbackValue = fallbackValue?.[key];
      if (fallbackValue === undefined) break;
    }
    value = fallbackValue;
  }

  // Final fallback to key path if not found anywhere
  if (value === undefined) {
    console.warn(`Translation missing for key: ${keyPath}`);
    value = keyPath;
  }

  // Replace parameters in string
  if (typeof value === "string" && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  return value;
};

// Export locales for direct access if needed
export { vi, en };
