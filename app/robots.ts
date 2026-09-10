import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || "https://aipromptgallery.com";
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
