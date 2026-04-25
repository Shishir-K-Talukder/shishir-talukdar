import { Helmet } from "react-helmet-async";
import { matchPath, useLocation } from "react-router-dom";

const SITE_URL = "https://shishir-talukdar.lovable.app";
const DEFAULT_OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/afbb8afb-37a5-4b10-a36d-9be4f853de0d";
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

type SeoConfig = {
  title: string;
  description: string;
  keywords: string;
  type?: "website" | "profile" | "article";
  path: string;
  noindex?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const routeSeo: Record<string, SeoConfig> = {
  "/": {
    title: "Shishir Kumar Talukder | Microbiologist",
    description:
      "Research microbiologist focused on antimicrobial resistance, bacterial pathogenesis, microbial ecology, publications, and global collaborations.",
    keywords:
      "Shishir Kumar Talukder, microbiologist, antimicrobial resistance, bacterial pathogenesis, microbial ecology, microbiology researcher, AMR",
    type: "profile",
    path: "/",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Shishir Kumar Talukder",
        jobTitle: "Research Microbiologist",
        description:
          "Research microbiologist specializing in antimicrobial resistance, bacterial pathogenesis, and microbial ecology.",
        url: SITE_URL,
        knowsAbout: ["Antimicrobial Resistance", "Bacterial Pathogenesis", "Microbial Ecology", "Microbiology"],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Shishir Kumar Talukder",
        url: SITE_URL,
      },
    ],
  },
  "/research": {
    title: "Research Projects | Shishir Kumar Talukder",
    description:
      "Explore microbiology research projects on antimicrobial resistance, bacterial pathogenesis, and microbial ecology.",
    keywords:
      "microbiology research projects, antimicrobial resistance research, bacterial pathogenesis, microbial ecology",
    path: "/research",
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Research Projects",
      description:
        "Research portfolio covering antimicrobial resistance, bacterial pathogenesis, and microbial ecology.",
      url: `${SITE_URL}/research`,
    },
  },
  "/publications": {
    title: "Publications | Shishir Kumar Talukder",
    description:
      "Browse peer-reviewed microbiology publications, abstracts, journal details, and DOI references by Shishir Kumar Talukder.",
    keywords:
      "microbiology publications, research papers, peer reviewed journals, DOI, Shishir Kumar Talukder publications",
    path: "/publications",
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Publications",
      description: "Peer-reviewed microbiology publications and research outputs.",
      url: `${SITE_URL}/publications`,
    },
  },
  "/collaborations": {
    title: "Collaborations | Shishir Kumar Talukder",
    description:
      "See academic and research collaborations with institutions working on microbial science and public health challenges.",
    keywords:
      "research collaborations, academic collaborations, microbiology partnerships, global institutions",
    path: "/collaborations",
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Collaborations",
      description: "Academic and institutional collaborations in microbial science.",
      url: `${SITE_URL}/collaborations`,
    },
  },
  "/blog": {
    title: "Microbiology Blog | Shishir Kumar Talukder",
    description:
      "Read microbiology articles, lab insights, and research updates on antimicrobial resistance and microbial science.",
    keywords:
      "microbiology blog, antimicrobial resistance blog, research updates, microbial science articles",
    path: "/blog",
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Microbiology Blog",
      description: "Research insights and articles on microbiology and antimicrobial resistance.",
      url: `${SITE_URL}/blog`,
    },
  },
  "/about": {
    title: "About Shishir Kumar Talukder | Microbiologist",
    description:
      "Learn about Shishir Kumar Talukder's background, research philosophy, technical skills, and experience in microbiology.",
    keywords:
      "about Shishir Kumar Talukder, microbiologist biography, research microbiologist, technical skills microbiology",
    path: "/about",
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Shishir Kumar Talukder",
      description: "Biography, education, technical skills, and microbiology research focus.",
      url: `${SITE_URL}/about`,
    },
  },
  "/contact": {
    title: "Contact Shishir Kumar Talukder | Collaboration Requests",
    description:
      "Contact Shishir Kumar Talukder for microbiology research collaboration, academic partnerships, and professional inquiries.",
    keywords:
      "contact microbiologist, research collaboration, academic partnership, microbiology inquiry",
    path: "/contact",
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Shishir Kumar Talukder",
      description: "Contact page for research collaboration and professional inquiries.",
      url: `${SITE_URL}/contact`,
    },
  },
  "/SKT-admin": {
    title: "Admin Login | Shishir Kumar Talukder",
    description: "Admin access for site management.",
    keywords: "admin login",
    path: "/SKT-admin",
    noindex: true,
  },
};

export function RouteSeo() {
  const location = useLocation();
  const { pathname } = location;

  if (matchPath("/blog/:slug", pathname)) {
    return null;
  }

  const fallbackConfig: SeoConfig = {
    title: "Page Not Found | Shishir Kumar Talukder",
    description: "The page you requested could not be found.",
    keywords: "404, page not found",
    path: pathname,
    noindex: true,
  };

  const config = routeSeo[pathname] ?? fallbackConfig;
  const canonicalUrl = `${SITE_URL}${config.path === "/" ? "/" : config.path}`;
  const robots = config.noindex ? "noindex, nofollow" : DEFAULT_ROBOTS;
  const schemaList = config.schema ? (Array.isArray(config.schema) ? config.schema : [config.schema]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      <meta name="keywords" content={config.keywords} />
      <meta name="robots" content={robots} />
      <meta property="og:type" content={config.type ?? "website"} />
      <meta property="og:site_name" content="Shishir Kumar Talukder" />
      <meta property="og:title" content={config.title} />
      <meta property="og:description" content={config.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:alt" content={`${config.title} preview image`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.title} />
      <meta name="twitter:description" content={config.description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <link rel="canonical" href={canonicalUrl} />
      {schemaList.map((schema, index) => (
        <script key={`${config.path}-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}