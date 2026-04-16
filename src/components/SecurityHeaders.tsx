import { Helmet } from "react-helmet-async";

/**
 * Injects security-related meta tags to protect against clickjacking,
 * content-type sniffing, and referrer leaks.
 * Note: CSP is best set via HTTP headers, not meta tags.
 */
export function SecurityHeaders() {
  return (
    <Helmet>
      {/* Prevent MIME type sniffing */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      {/* Clickjacking protection */}
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      {/* Referrer policy */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      {/* Permissions policy — disable unused browser features */}
      <meta
        httpEquiv="Permissions-Policy"
        content="camera=(), microphone=(), geolocation=(), payment=()"
      />
    </Helmet>
  );
}
