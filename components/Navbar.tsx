"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg bg-white fixed-top shadow-sm">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex flex-column text-decoration-none">
          <h1 className="h4 mb-0 fw-bold text-dark">
            <i className="bi bi-stars me-2 text-primary"></i>AI Prompt Gallery
          </h1>
          <p className="small text-muted mb-0 d-none d-sm-block">Professional AI Art Prompts</p>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)}
                className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              >
                <i className="bi bi-grid-3x3-gap me-1"></i>Browse
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/categories" 
                onClick={() => setIsOpen(false)}
                className={`nav-link ${pathname === '/categories' ? 'active' : ''}`}
              >
                <i className="bi bi-folder me-1"></i>Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/instructions" 
                onClick={() => setIsOpen(false)}
                className={`nav-link ${pathname === '/instructions' ? 'active' : ''}`}
              >
                <i className="bi bi-book me-1"></i>Instructions
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/about" 
                onClick={() => setIsOpen(false)}
                className={`nav-link ${pathname === '/about' ? 'active' : ''}`}
              >
                <i className="bi bi-info-circle me-1"></i>About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/contact" 
                onClick={() => setIsOpen(false)}
                className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}
              >
                <i className="bi bi-envelope me-1"></i>Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
