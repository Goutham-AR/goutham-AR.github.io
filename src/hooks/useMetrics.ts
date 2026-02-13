import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  trackPageView,
  startSession,
  endSession,
  getSessionId,
  isNewSession,
} from "../utils/metrics";

/**
 * Hook to track site metrics including page views and sessions
 * Should be used once at the app level
 */
export function useMetrics() {
  const location = useLocation();
  const sessionIdRef = useRef<string | null>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionId = getSessionId();
        sessionIdRef.current = sessionId;

        // Start new session if needed and wait for completion
        if (isNewSession()) {
          await startSession(sessionId);
        }
        
        setIsSessionReady(true);
      } catch (error) {
        console.warn("Failed to initialize session:", error);
        // Still mark as ready to allow page view tracking to attempt
        setIsSessionReady(true);
      }
    };

    initSession();

    // End session on page unload
    const handleUnload = () => {
      if (sessionIdRef.current) {
        endSession(sessionIdRef.current).catch((error) => {
          console.warn("Failed to end session:", error);
        });
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // Track page view on route change (only after session is ready)
  useEffect(() => {
    if (!sessionIdRef.current || !isSessionReady) return;

    const path = location.pathname;
    
    trackPageView(path, sessionIdRef.current).catch((error) => {
      console.warn("Failed to track page view:", error);
    });
  }, [location.pathname, isSessionReady]);
}
