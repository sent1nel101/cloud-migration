import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SalaryResearchArticle from "./salary-research-article";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "The Complete Guide to Career Transitions in 2025",
      excerpt: "Everything you need to know about successfully changing careers in today's economy. From skills to timing to job search strategies.",
      author: "Darec McDaniel",
      date: "December 15, 2024",
      category: "Career Tips",
      readTime: "12 min",
    },
    {
      id: 2,
      title: "What Will I Earn? How to Research Salaries for Any Career",
      excerpt: "A simple, free process for finding realistic pay for any role, from nursing and the trades to teaching and finance, and building your own salary range before you make the switch.",
      author: "Darec McDaniel",
      date: "September 28, 2026",
      category: "Salary Data",
      readTime: "5 min",
      article: <SalaryResearchArticle />,
    },
    {
      id: 3,
      title: "5 Skills Every Career Changer Should Master First",
      excerpt: "The foundational skills that make career transitions faster and smoother. Plus resources to learn them (most free).",
      author: "Darec McDaniel",
      date: "November 30, 2024",
      category: "Skills",
      readTime: "6 min",
    },
    {
      id: 4,
      title: "Show, Don't Tell: Building Proof of Your Skills for a Career Change",
      excerpt: "Projects, volunteer work, job shadowing, work samples, and references: how to show hiring managers you can do the job in any field.",
      author: "Darec McDaniel",
      date: "November 22, 2024",
      category: "Portfolio",
      readTime: "10 min",
    },
    {
      id: 5,
      title: "Remote vs. Office: Which Career Path is Right for You?",
      excerpt: "Analyzing the pros and cons of remote-first and office roles. Plus data on which transitions are easier remote.",
      author: "Darec McDaniel",
      date: "November 15, 2024",
      category: "Work Culture",
      readTime: "7 min",
    },
    {
      id: 6,
      title: "The Age Question: Career Changes at 30, 40, 50+",
      excerpt: "Myths vs reality about changing careers later in life. Real stories of successful transitions at every age.",
      author: "Darec McDaniel",
      date: "November 8, 2024",
      category: "Life Stage",
      readTime: "9 min",
    },
  ];

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
      <div className="page-container">
      <h1>FutureMap Blog</h1>

      <section className="blog-intro">
        <p>
          Career insights, salary data, skill guides, and success stories to help you design your ideal career path.
        </p>
      </section>

      <section className="blog-featured">
        <h2>Featured Article</h2>
        <div className="featured-post">
          <div className="featured-content">
            <div className="featured-meta">
              <span className="category featured-category">Career Tips</span>
              <span className="date">December 15, 2024</span>
            </div>
            <h3>The Complete Guide to Career Transitions in 2025</h3>
            <p>
              Everything you need to know about successfully changing careers in today's economy. From skills to timing to job search strategies. Darec McDaniel shares insights from interviewing 100+ successful career changers to bring you the definitive guide.
            </p>
            <div className="featured-footer">
              <span>By Darec McDaniel</span>
              <span>12 min read</span>
            </div>
            <button className="cta-button">Read Article</button>
          </div>
        </div>
      </section>

      <section className="blog-grid">
        <h2>Latest Articles</h2>
        <div className="blog-posts">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-header">
                <span className="category">{post.category}</span>
                <span className="read-time">{post.readTime}</span>
              </div>
              <h3>{post.title}</h3>
              <p className="excerpt">{post.excerpt}</p>
              <div className="blog-footer">
                <div className="author-info">
                  <span className="author">{post.author}</span>
                  <span className="dot">•</span>
                  <span className="date">{post.date}</span>
                </div>
                {!post.article && <button className="read-more">Read →</button>}
              </div>
              {post.article && (
                <details className="blog-article">
                  <summary className="read-more">Read the article →</summary>
                  {post.article}
                </details>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="blog-categories">
        <h2>Browse by Category</h2>
        <div className="category-list">
          <button className="category-button">Career Tips</button>
          <button className="category-button">Salary Data</button>
          <button className="category-button">Skills</button>
          <button className="category-button">Portfolio</button>
          <button className="category-button">Work Culture</button>
          <button className="category-button">Life Stage</button>
          <button className="category-button">Success Stories</button>
          <button className="category-button">Industry Insights</button>
        </div>
      </section>

      <section className="blog-resources">
        <h2>Popular Resources</h2>
        <div className="resources-grid">
          <div className="resource-card">
            <h3>Free Learning Platforms</h3>
            <p>Discover Coursera, edX, Khan Academy, and community college programs for skill-building during career transitions. Thousands of free and low-cost courses across healthcare, business, the trades, tech, and more.</p>
            <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer" className="resource-button">Explore Courses</a>
          </div>
          <div className="resource-card">
            <h3>Salary Research Tools</h3>
            <p>Start with the free Bureau of Labor Statistics Occupational Outlook Handbook for pay and job outlook in almost any occupation, then cross-check with Glassdoor and Payscale for your location.</p>
            <a href="https://www.bls.gov/ooh/" target="_blank" rel="noopener noreferrer" className="resource-button">Check Salaries</a>
          </div>
          <div className="resource-card">
            <h3>Free Resume & LinkedIn Resources</h3>
            <p>Leverage Novoresume, Canva, LinkedIn's own tools, and Indeed's resume builder to create ATS-friendly resumes optimized for career transitions.</p>
            <a href="https://www.novoresume.com" target="_blank" rel="noopener noreferrer" className="resource-button">Build Resume</a>
          </div>
          <div className="resource-card">
            <h3>Skill Development Paths</h3>
            <p>Explore training programs, apprenticeships, certifications, and licenses for any occupation on CareerOneStop, or find free industry-specific learning paths on LinkedIn Learning and YouTube.</p>
            <a href="https://www.careeronestop.org" target="_blank" rel="noopener noreferrer" className="resource-button">Explore Careers</a>
          </div>
          <div className="resource-card">
            <h3>Networking & Community</h3>
            <p>Join career-focused communities on Reddit (r/careerchange), Discord servers, and local meetup groups. Network with professionals making similar transitions.</p>
            <a href="https://reddit.com/r/careerchange" target="_blank" rel="noopener noreferrer" className="resource-button">Join Community</a>
          </div>
          <div className="resource-card">
            <h3>Interview Preparation</h3>
            <p>Practice common behavioral interview questions with free videos and mock interviews. Preparing for a technical role? Add LeetCode or HackerRank.</p>
            <a href="https://www.youtube.com/results?search_query=behavioral+interview+practice" target="_blank" rel="noopener noreferrer" className="resource-button">Practice Interviews</a>
          </div>
        </div>
      </section>

      <section className="blog-newsletter">
        <h2>Stay Updated</h2>
        <p>
          Get our best career transition tips, salary data, and success stories delivered to your inbox weekly.
        </p>
        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="cta-button">Subscribe</button>
        </form>
        <p className="newsletter-note">No spam. Unsubscribe anytime. Privacy policy.</p>
      </section>
      </div>
      </main>
      <Footer />
    </div>
  );
}
