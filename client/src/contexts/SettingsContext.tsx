import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';

interface Settings {
  site_name?: string;
  site_description?: string;
  contact_email?: string;
  contact_phone?: string;
  min_booking_days?: string;
  max_booking_days?: string;
  advance_booking_days?: string;
  auto_approve_bookings?: string;
  email_notifications?: string;
  sms_notifications?: string;
  booking_notifications?: string;
  payment_notifications?: string;
  require_email_verification?: string;
  require_phone_verification?: string;
  enable_two_factor?: string;
  session_timeout?: string;
  smtp_enabled?: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_secure?: string;
  smtp_user?: string;
  smtp_from_email?: string;
  smtp_from_name?: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const { settings: data } = await api.settings.get();
      setSettings(data);
      
      // Apply document title
      if (data.site_name) {
        document.title = data.site_name;
      }
      
      // Apply meta description
      if (data.site_description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', data.site_description);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Use defaults if settings fail to load
      setSettings({
        site_name: 'Car Rental',
        site_description: 'Dịch vụ cho thuê xe uy tín',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const refreshSettings = async () => {
    await loadSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
