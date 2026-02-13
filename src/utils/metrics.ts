import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  increment,
  serverTimestamp,
  Timestamp,
  getDoc,
  setDoc
} from "firebase/firestore";

// Types for metrics data
export interface PageViewMetric {
  path: string;
  timestamp: Timestamp;
  userAgent: string;
  referrer: string;
  sessionId: string;
}

export interface SessionMetric {
  sessionId: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration?: number;
  pageViews: number;
  userAgent: string;
}

export interface SiteMetrics {
  totalPageViews: number;
  totalSessions: number;
  lastUpdated: Timestamp;
  popularPages: Record<string, number>;
}

// Collection references
const METRICS_COLLECTION = "metrics";
const PAGE_VIEWS_COLLECTION = "pageViews";
const SESSIONS_COLLECTION = "sessions";
const SITE_STATS_DOC = "siteStats";

/**
 * Track a page view event
 */
export async function trackPageView(
  path: string,
  sessionId: string
): Promise<void> {
  try {
    const pageViewData: Partial<PageViewMetric> = {
      path,
      timestamp: serverTimestamp() as Timestamp,
      userAgent: navigator.userAgent,
      referrer: document.referrer || "direct",
      sessionId,
    };

    // Add page view document
    await addDoc(collection(db, PAGE_VIEWS_COLLECTION), pageViewData);

    // Update site statistics (non-blocking, silent failures)
    updateSiteStats(path).catch(() => {
      // Silent - configure Firestore rules to enable
    });

    // Update session page view count (non-blocking, use setDoc with merge to handle race conditions)
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    setDoc(sessionRef, {
      pageViews: increment(1),
      lastActivity: serverTimestamp(),
    }, { merge: true }).catch(() => {
      // Silent - configure Firestore rules to enable
    });
  } catch (error) {
    // Silent - metrics should not break the app
  }
}

/**
 * Start a new session
 */
export async function startSession(sessionId: string): Promise<void> {
  try {
    const sessionData: Partial<SessionMetric> = {
      sessionId,
      startTime: serverTimestamp() as Timestamp,
      pageViews: 0,
      userAgent: navigator.userAgent,
    };

    await setDoc(doc(db, SESSIONS_COLLECTION, sessionId), sessionData);

    // Increment total sessions count
    const statsRef = doc(db, METRICS_COLLECTION, SITE_STATS_DOC);
    const statsDoc = await getDoc(statsRef);

    if (statsDoc.exists()) {
      await updateDoc(statsRef, {
        totalSessions: increment(1),
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(statsRef, {
        totalPageViews: 0,
        totalSessions: 1,
        lastUpdated: serverTimestamp(),
        popularPages: {},
      });
    }
  } catch (error) {
    // Silent - metrics should not break the app
  }
}

/**
 * End a session
 */
export async function endSession(sessionId: string): Promise<void> {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists()) {
      const sessionData = sessionDoc.data() as SessionMetric;
      const endTime = new Date();
      const startTime = sessionData.startTime.toDate();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      await updateDoc(sessionRef, {
        endTime: serverTimestamp(),
        duration,
      });
    }
  } catch (error) {
    // Silent - metrics should not break the app
  }
}

/**
 * Update site-wide statistics
 */
async function updateSiteStats(path: string): Promise<void> {
  try {
    const statsRef = doc(db, METRICS_COLLECTION, SITE_STATS_DOC);
    const statsDoc = await getDoc(statsRef);

    // Sanitize path for use as field name (replace / with _)
    const sanitizedPath = path.replace(/\//g, "_") || "_root";

    if (statsDoc.exists()) {
      await updateDoc(statsRef, {
        totalPageViews: increment(1),
        [`popularPages.${sanitizedPath}`]: increment(1),
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(statsRef, {
        totalPageViews: 1,
        totalSessions: 0,
        lastUpdated: serverTimestamp(),
        popularPages: {
          [sanitizedPath]: 1,
        },
      });
    }
  } catch (error) {
    // Silent - metrics should not break the app
  }
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create session ID from sessionStorage
 */
export function getSessionId(): string {
  const SESSION_KEY = "portfolio_session_id";
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Check if this is a new session
 */
export function isNewSession(): boolean {
  const SESSION_KEY = "portfolio_session_id";
  return !sessionStorage.getItem(SESSION_KEY);
}
