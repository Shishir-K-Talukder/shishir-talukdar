import { useEffect } from "react";
import { useContentValue } from "@/hooks/useSiteContent";

/**
 * Loads the Google AdSense script dynamically when a publisher ID is set.
 * Only renders on blog pages — parent components control where this is mounted.
 */
export function AdSenseLoader() {
  const { value: pubId } = useContentValue("ads", "adsense_publisher_id", "");
  const { value: autoAds } = useContentValue("ads", "auto_ads_enabled", "false");

  useEffect(() => {
    if (!pubId) return;

    // Check if script already loaded
    const existing = document.querySelector(`script[src*="adsbygoogle"]`);
    if (existing) return;

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    if (autoAds === "true") {
      script.setAttribute("data-ad-client", pubId);
    }
    document.head.appendChild(script);

    return () => {
      // Don't remove — AdSense expects persistence
    };
  }, [pubId, autoAds]);

  return null;
}
