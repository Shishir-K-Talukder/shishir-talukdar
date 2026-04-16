import { Helmet } from "react-helmet-async";

/**
 * Injects security-related meta tags to protect against XSS, clickjacking,
 * content-type sniffing, and referrer leaks.
 */
export function SecurityHeaders() {
  return (
    <Helmet>
      {/* Content Security Policy */}
      <meta
        httpEquiv="Content-Security-Policy"
        content={[
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: blob: https: http:",
          "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://pagead2.googlesyndication.com",
          "frame-src 'self' https://pagead2.googlesyndication.com",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
        ].join("; ")}
      />
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
