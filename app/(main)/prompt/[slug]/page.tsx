import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { PromptDetailClient } from "./PromptDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const prompt = await Prompt.findOne({ slug }).lean();

  if (!prompt) {
    return { title: "Not Found" };
  }

  const title = `${prompt.title} - AI Prompt | AI Prompt Gallery`;
  const description = prompt.prompt.substring(0, 155) + "...";
  const image = prompt.image ? `/${prompt.image}` : "/og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PromptPage({ params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;
  const prompt = await Prompt.findOne({ slug }).lean();

  if (!prompt) {
    notFound();
  }

  // Get related prompts
  const promptCategories = Array.isArray(prompt.category)
    ? prompt.category
    : prompt.category
    ? [prompt.category]
    : [];
  
  let relatedPrompts: any[] = [];
  if (promptCategories.length > 0) {
    relatedPrompts = await Prompt.find({
      category: promptCategories[0],
      _id: { $ne: prompt._id },
    })
      .limit(3)
      .lean();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: prompt.title,
    image: prompt.image ? [prompt.image] : [],
    datePublished: prompt.created_at,
    dateModified: prompt.updated_at,
    description: prompt.prompt.substring(0, 155) + "...",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PromptDetailClient prompt={JSON.parse(JSON.stringify(prompt))} relatedPrompts={JSON.parse(JSON.stringify(relatedPrompts))} />
    </>
  );
}
