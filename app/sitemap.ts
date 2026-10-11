import { MetadataRoute } from 'next';
import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || "https://aiprompts.mommentx.space";
  
  await dbConnect();
  const [prompts, allCategoriesRaw] = await Promise.all([
    Prompt.find({}, { slug: 1, updated_at: 1, created_at: 1 }).lean(),
    Prompt.distinct("category"),
  ]);

  const categoriesSet = new Set<string>();
  allCategoriesRaw.forEach((cat) => {
    if (Array.isArray(cat)) cat.forEach((c) => { if (c) categoriesSet.add(c); });
    else if (cat) categoriesSet.add(cat);
  });

  const categoryUrls = Array.from(categoriesSet).map((categoryName) => ({
    url: `${baseURL}/?category=${encodeURIComponent(categoryName)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));
  
  const promptUrls = prompts.map((prompt: any) => ({
    url: `${baseURL}/prompt/${prompt.slug}`,
    lastModified: prompt.updated_at || prompt.created_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  const staticPages = [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseURL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseURL}/instructions`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseURL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseURL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  return [
    ...staticPages,
    ...categoryUrls,
    ...promptUrls,
  ];
}
