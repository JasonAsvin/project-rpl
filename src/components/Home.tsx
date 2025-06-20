'use client'

import Link from 'next/link'
import Navbar from './Navbar'
import Footer from './Footer'
import Image from 'next/image'
import CategoryBar from './CategoryBar'
import { ArticleCard } from './ArticleCard'
import { Newsletter } from './ui/Newsletter'
import { Pagination } from './ui/Pagination'
import { ErrorMessage } from './ui/ErrorMessage'
import { LoadingArticles } from './ui/LoadingArticles'
import { Article, getAllArticles, API_URL } from '@/lib/api'
import React, { useEffect, useState, useCallback } from 'react'

const categoryImageMap: { [key: string]: string } = {
  'Digital Marketing': 'keyboard.svg',
  'Machine Learning': 'ddos.svg',
  'UI/UX Design': 'browser.svg',
  'Melamar Kerja': 'notes.svg',
  'Lintas Minat': 'hacking.svg',
  'Jenjang Karir': 'wordle.svg'
};

interface Category {
  id: string;
  name: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentArticlePage, setCurrentArticlePage] = useState(1);
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showCopyFeedback, setShowCopyFeedback] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 6;

  // Sample courses data
  const courses = [
    {
      title: "Bangun Brand dan Tingkatkan Penjualan",
      category: "Digital Marketing",
      description: "Pelajari SEO, strategi media sosial, dan iklan digital untuk pemasaran yang efektif.",
      image: "/keyboard.svg"
    },
    {
      title: "Menciptakan Produk Digital yang Menarik",
      category: "UI/UX Design",
      description: "Pelajari prinsip desain antarmuka dan pengalaman pengguna untuk produk yang lebih baik.",
      image: "/browser.svg"
    },
    {
      title: "Mulai dari Nol! Kuasai Machine Learning",
      category: "Machine Learning",
      description: "Pelajari konsep, algoritma, dan implementasi Machine Learning untuk karier di bidang AI.",
      image: "/nlp.svg"
    }
  ];

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await getAllArticles();
        setArticles(data);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadArticles();
  }, []);

  // Get unique categories from articles and format them for CategoryBar
  const uniqueCategories = Array.from(new Set(articles.map(article => article.category)));
  const formattedCategories: Category[] = [
    { id: 'all', name: 'Show All' },
    ...uniqueCategories.map(category => ({
      id: category.toLowerCase(),
      name: category
    }))
  ];
  
  // Filter articles based on selected category
  const filteredArticles = selectedBlogCategory === 'all' 
    ? articles 
    : articles.filter((article) => article.category.toLowerCase() === selectedBlogCategory);

  // Articles pagination calculation
  const totalArticlePages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const articleStartIndex = (currentArticlePage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(articleStartIndex, articleStartIndex + ITEMS_PER_PAGE);

  // Courses pagination calculation
  const totalCoursePages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const courseStartIndex = (currentCoursePage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = courses.slice(courseStartIndex, courseStartIndex + ITEMS_PER_PAGE);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentArticlePage(1);
  }, [selectedBlogCategory]);

  // Get the main featured article (first article)
  const mainArticle = articles[0];

  // Modified copy link function with popup feedback
  const handleCopyLink = useCallback((slug: string) => {
    const url = `https://chayon.com/blog/${slug}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowCopyFeedback(slug);
        setTimeout(() => setShowCopyFeedback(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  }, []);

  if (isLoading) {
    return <LoadingArticles />;
  }

  return (
    <>
      <Navbar />
      {/* Search Section */}
      <div className="flex flex-col items-center mt-16 space-y-12">
        <div className="flex items-center bg-white rounded-full px-6 py-3 w-[554px]">
          <Image src="/search.svg" width={24} height={24} alt="Search Icon" className="mr-3" />
          <input 
            type="text" 
            placeholder="Pencarian" 
            className="outline-none text-gray-500 text-lg font-light w-full"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-white-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-black-500 mb-2 block">Chayon Online Course
              <Image src="/sparkle.svg" width={24} height={24} alt="Sparkle Icon" className="inline-block ml-2" />
            </p>
            <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-4">Explore Knowledge & Insights</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Temukan berbagai wawasan seputar dunia teknologi, kursus online, dan perkembangan terbaru.
              Dapatkan informasi eksklusif, serta kisah inspiratif dari narasumber kami.
            </p>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-0">
        {/* Latest Articles Section */}
        <section className="mb-16">
          <CategoryBar
            categories={formattedCategories}
            selectedCategory={selectedBlogCategory}
            onCategoryChange={setSelectedBlogCategory}
          />
          
          {/* Main Featured Article Card */}
          {mainArticle && (
            <div className="mb-8 mt-8">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-[400px]">
                    <Image
                      src={`${API_URL}/storage/artikel-thumbnails/${mainArticle.image.split('/').pop()}`}
                      alt={mainArticle.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="inline-block bg-gray-100 text-sm font-medium px-3 py-1 rounded-full">{mainArticle.category}</span>
                        <span className="text-sm text-gray-500">{mainArticle.date}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{mainArticle.title}</h3>
                      <p className="text-gray-600 mb-6 line-clamp-3">{mainArticle.description}</p>
                    </div>
                    
                    <div>
                      {/* Share Feature */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-gray-500">Bagikan:</span>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://chayon.com/blog/' + mainArticle.slug)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="hover:text-blue-700">
                          <Image src="/facebook.svg" width={20} height={20} alt="Facebook" />
                        </a>
                        <a href={`https://wa.me/?text=${encodeURIComponent(mainArticle.title + ' https://chayon.com/blog/' + mainArticle.slug)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="hover:text-green-600">
                          <Image src="/whatsapp.svg" width={20} height={20} alt="WhatsApp" />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://chayon.com/blog/' + mainArticle.slug)}&text=${encodeURIComponent(mainArticle.title)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="hover:text-blue-500">
                          <Image src="/twitter.svg" width={20} height={20} alt="Twitter" />
                        </a>
                        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://chayon.com/blog/' + mainArticle.slug)}&title=${encodeURIComponent(mainArticle.title)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="hover:text-blue-800">
                          <Image src="/linkedin.svg" width={20} height={20} alt="LinkedIn" />
                        </a>
                        <div className="relative">
                          <button onClick={() => handleCopyLink(mainArticle.slug)}
                            className="hover:text-gray-600 transition-colors">
                            <Image src="/link.svg" width={20} height={20} alt="Copy Link" />
                          </button>
                          {showCopyFeedback === mainArticle.slug && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              Link Copied
                            </div>
                          )}
                        </div>
                      </div>
                      <Link href={`/blog/${mainArticle.slug}`} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        Baca Selengkapnya
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-8">
            <Pagination 
              currentPage={currentArticlePage}
              totalPages={totalArticlePages}
              onPageChange={setCurrentArticlePage}
            />
          </div>
        </section>

        {/* Join Our Learning Journey Section */}
        <div className="w-full py-16 bg-gray-50 -mx-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-6xl font-bold text-gray-900 leading-tight mb-4">Join Our Learning Journey</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Mulai perjalanan belajarmu bersama Chayon! Pilih kursus yang sesuai, tingkatkan skill, dan wujudkan potensimu. Daftar sekarang dan jadilah bagian dari komunitas pembelajar!
              </p>
            </div>

            <div className="mb-8">
              <CategoryBar 
                categories={formattedCategories}
                selectedCategory={selectedBlogCategory}
                onCategoryChange={setSelectedBlogCategory}
              />
            </div>

            {/* Course Cards - Using same grid layout as articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCourses.map((course, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                  <div className="relative h-[200px]">
                    <Image
                      src={course.image}
                      alt={course.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="inline-block bg-gray-100 text-xs font-medium px-3 py-1 rounded-full">{course.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{course.title}</h3>
                    <p className="text-gray-600 mb-5 line-clamp-3">{course.description}</p>
                    <Link href={`/kursus/${course.category.toLowerCase().replace(/[\s/]+/g, '-')}`} 
                          className="block w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">
                      Daftar Sekarang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Pagination 
                currentPage={currentCoursePage}
                totalPages={totalCoursePages}
                onPageChange={setCurrentCoursePage}
              />
            </div>
          </div>
        </div>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}