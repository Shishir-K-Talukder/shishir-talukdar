import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function getSessionId() {
  let sid = sessionStorage.getItem("_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("_sid", sid);
  }
  return sid;
}

export function PageViewTracker() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;

    // Don't track admin pages
    if (path.startsWith("/SKT-admin")) return;

    const session_id = getSessionId();
    const referrer = document.referrer || "";

    // Check if this is a blog post
    const blogMatch = path.match(/^\/blog\/(.+)$/);

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-pageview`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        page_path: path,
        referrer,
        session_id,
        // blog_post_id will be resolved server-side if needed, or we skip it
      }),
    }).catch(() => {
      // Silent fail — analytics should never break the site
    });
  }, [location.pathname]);

  return null;
}
