import Link from "next/link";
import dbConnect from "@/lib/db";
import { Prompt } from "@/lib/models";

export default async function Footer() {
  await dbConnect();
  
  // Get top 5 categories
  const categoriesRaw = await Prompt.distinct("category");
  const categoriesSet = new Set<string>();
  categoriesRaw.forEach((cat) => {
    if (Array.isArray(cat)) cat.forEach((c) => categoriesSet.add(c));
    else categoriesSet.add(cat);
  });
  const displayCategories = Array.from(categoriesSet).sort().slice(0, 5);

  return (
    <footer className="bg-dark text-light py-5 mt-auto" id="contact">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4">
            <h3 className="h5 mb-3">AI Prompt Gallery</h3>
            <p className="text-muted">Your trusted source for high-quality AI art prompts.</p>
          </div>
          <div className="col-lg-4">
            <h4 className="h6 mb-3">Popular Categories</h4>
            <ul className="list-unstyled">
              {displayCategories.map((cat) => (
                <li key={cat} className="mb-2">
                  <Link href={`/?category=${encodeURIComponent(cat)}`} className="text-decoration-none text-secondary">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4">
            <h4 className="h6 mb-3">AI Tools</h4>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="https://www.midjourney.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">Midjourney</a>
              </li>
              <li className="mb-2">
                <a href="https://openai.com/dall-e-3" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">DALL-E 3</a>
              </li>
              <li className="mb-2">
                <a href="https://stability.ai" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">Stable Diffusion</a>
              </li>
              <li className="mb-2">
                <a href="https://leonardo.ai" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">Leonardo AI</a>
              </li>
              <li className="mb-2">
                <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">Google AI Studio</a>
              </li>
              <li className="mb-2">
                <a href="https://deepmind.google/technologies/gemini/nano/" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-secondary">Google Gemini Nano</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-top border-secondary pt-4 mt-4 text-center">
          <p className="text-light small mb-0">&copy; 2025 AI Prompt Gallery.</p>
          <p className="text-light small mb-0">MommentX</p>
          <p className="text-light small mb-0">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
