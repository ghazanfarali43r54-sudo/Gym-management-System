"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { API_URL } from "@/lib/api";

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type TimeSession = {
  enabled: boolean;
  open: string;
  close: string;
};

export type Day = {
  isOpen: boolean;
  morning: TimeSession;
  evening: TimeSession;
};

export type SiteSettings = {
  general: {
    gymName: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    currency: string;
    timezone: string;
  };

  businessHours: Record<DayKey, Day>;

  payment: {
    methods: string[];
  };
};

const defaults: SiteSettings = {
  general: {
    gymName: "GymMaster Pro",
    tagline: "Your partner in fitness management",
    email: "",
    phone: "",
    address: "",
    city: "",
    currency: "PKR",
    timezone: "Asia/Karachi",
  },

  businessHours: {
    monday: {
      isOpen: true,
      morning: {
        enabled: true,
        open: "06:00",
        close: "08:30",
      },
      evening: {
        enabled: true,
        open: "14:00",
        close: "23:00",
      },
    },

    tuesday: {
      isOpen: true,
      morning: {
        enabled: true,
        open: "06:00",
        close: "08:30",
      },
      evening: {
        enabled: true,
        open: "14:00",
        close: "23:00",
      },
    },

    wednesday: {
      isOpen: true,
      morning: {
        enabled: true,
        open: "06:00",
        close: "08:30",
      },
      evening: {
        enabled: true,
        open: "14:00",
        close: "23:00",
      },
    },

    thursday: {
      isOpen: true,
      morning: {
        enabled: true,
        open: "06:00",
        close: "08:30",
      },
      evening: {
        enabled: true,
        open: "14:00",
        close: "23:00",
      },
    },

    friday: {
      isOpen: true,
      morning: {
        enabled: true,
        open: "06:00",
        close: "08:30",
      },
      evening: {
        enabled: true,
        open: "14:00",
        close: "23:00",
      },
    },

    saturday: {
      isOpen: true,
      morning: {
        enabled: true,
        open: "07:00",
        close: "10:00",
      },
      evening: {
        enabled: true,
        open: "16:00",
        close: "21:00",
      },
    },

    sunday: {
      isOpen: false,
      morning: {
        enabled: true,
        open: "09:00",
        close: "12:00",
      },
      evening: {
        enabled: true,
        open: "14:00",
        close: "18:00",
      },
    },
  },

  payment: {
    methods: ["cash"],
  },
};

const CACHE_KEY = "site_settings";
const TRIGGER_KEY = "settings-updated";

type SettingsContextValue = {
  settings: SiteSettings;
  refresh: () => Promise<void>;
};

const Ctx = createContext<SettingsContextValue>({
  settings: defaults,
  refresh: async () => {},
});

function mergeSettings(
  data: Partial<SiteSettings> | null | undefined
): SiteSettings {
  const serverData = data ?? {};

  const days: DayKey[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const businessHours = {} as Record<DayKey, Day>;

  for (const day of days) {
    const defaultDay = defaults.businessHours[day];
    const serverDay = serverData.businessHours?.[day];

    businessHours[day] = {
      ...defaultDay,
      ...(serverDay ?? {}),

      morning: {
        ...defaultDay.morning,
        ...(serverDay?.morning ?? {}),
      },

      evening: {
        ...defaultDay.evening,
        ...(serverDay?.evening ?? {}),
      },
    };
  }

  return {
    ...defaults,
    ...serverData,

    general: {
      ...defaults.general,
      ...(serverData.general ?? {}),
    },

    businessHours,

    payment: {
      ...defaults.payment,
      ...(serverData.payment ?? {}),
      methods: Array.isArray(serverData.payment?.methods)
        ? serverData.payment.methods
        : defaults.payment.methods,
    },
  };
}

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  // IMPORTANT:
  // Initial render server aur browser dono par defaults se hoga.
  // Isse hydration mismatch nahi hoga.
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  const calledByStorageRef = useRef(false);

  /**
   * Local cached settings load karta hai.
   * Ye sirf browser mein effect ke baad chalega.
   */
  const loadCachedSettings = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);

      if (!cached) {
        return;
      }

      const parsed = JSON.parse(cached);
      const merged = mergeSettings(parsed);

      setSettings(merged);
    } catch {
      // Invalid cache ignore karein
    }
  }, []);

  /**
   * Backend se latest settings load karta hai.
   */
  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/public/settings`, {
        cache: "no-store",
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      const merged = mergeSettings(data);

      setSettings(merged);

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch {
        // Ignore localStorage errors
      }

      // Agar refresh storage event ki wajah se nahi hua
      // to doosre tabs ko notify karein.
      if (!calledByStorageRef.current) {
        try {
          localStorage.setItem(
            TRIGGER_KEY,
            Date.now().toString()
          );
        } catch {
          // Ignore storage errors
        }
      }
    } catch {
      // Backend unavailable.
      // Existing settings ko preserve karein.
    }
  }, []);

  /**
   * Browser mount ke baad:
   *
   * 1. Local cache load
   * 2. Backend se latest settings load
   *
   * Server render ke waqt ye dono nahi chalte.
   */
  useEffect(() => {
    let cancelled = false;

    const initializeSettings = async () => {
      // Pehle cached setting dikhao
      try {
        const cached = localStorage.getItem(CACHE_KEY);

        if (cached && !cancelled) {
          const parsed = JSON.parse(cached);
          const merged = mergeSettings(parsed);

          setSettings(merged);
        }
      } catch {
        // Invalid cache ignore
      }

      // Phir backend se latest setting lao
      if (!cancelled) {
        await refresh();
      }
    };

    void initializeSettings();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  /**
   * Cross-tab synchronization.
   *
   * Agar Admin Settings ek tab mein save kare,
   * doosre tab ka Trainer Dashboard bhi update ho jayega.
   */
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== TRIGGER_KEY) {
        return;
      }

      calledByStorageRef.current = true;

      void refresh().finally(() => {
        calledByStorageRef.current = false;
      });
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  return (
    <Ctx.Provider value={{ settings, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSettings = () => useContext(Ctx);