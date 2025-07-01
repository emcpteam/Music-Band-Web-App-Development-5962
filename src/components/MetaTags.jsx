import React from 'react';
import { useBandData } from '../contexts/AdminContext';

const MetaTags = () => {
  const bandData = useBandData();
  const seo = bandData?.band?.seo || {};
  
  // Use SEO settings with fallbacks
  const title = seo.title || `${bandData.band.name} - Official Website`;
  const description = seo.description || `Experience ${bandData.band.name}'s cosmic soundscapes. Listen to our latest albums, explore multimedia content, and join our stellar community.`;
  const keywords = seo.keywords || `${bandData.band.name}, music, electronic, ambient, cosmic, soundscape, album`;
  const ogImage = seo.ogImage || bandData.band.logo;
  const canonicalUrl = seo.canonicalUrl || window.location.origin;
  const author = seo.author || bandData.band.name;
  const language = seo.language || 'en';
  const robots = seo.robots || 'index, follow';
  const twitterCard = seo.twitterCard || 'summary_large_image';

  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', robots);

    // Language
    document.documentElement.setAttribute('lang', language);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', bandData.band.name, true);

    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Structured Data (Schema.org)
    if (seo.structuredData !== false) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "MusicGroup",
        "name": bandData.band.name,
        "description": description,
        "url": canonicalUrl,
        "image": ogImage,
        "sameAs": Object.values(bandData.band.socialLinks).filter(url => url),
        "genre": bandData.albums?.[0]?.genre || "Music",
        "email": bandData.band.email
      };

      let structuredDataScript = document.querySelector('#structured-data');
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.id = 'structured-data';
        structuredDataScript.type = 'application/ld+json';
        document.head.appendChild(structuredDataScript);
      }
      
      structuredDataScript.textContent = JSON.stringify(structuredData);
    }

  }, [title, description, keywords, ogImage, canonicalUrl, author, language, robots, twitterCard, bandData, seo.structuredData]);

  return null; // This component doesn't render anything
};

export default MetaTags;