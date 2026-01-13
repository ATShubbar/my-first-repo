'use client';

import Link from 'next/link';
import { HiSparkles, HiPhotograph, HiDownload } from 'react-icons/hi';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';

const features = [
  {
    icon: HiSparkles,
    title: 'AI-Powered Styles',
    description: 'Browse our curated collection of artistic styles powered by advanced AI.',
  },
  {
    icon: HiPhotograph,
    title: 'Easy Upload',
    description: 'Simply upload your photo and watch it transform into stunning artwork.',
  },
  {
    icon: HiDownload,
    title: 'Download & Share',
    description: 'Download your creations in high quality or share them directly.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-gray-900 to-pink-900 py-20 lg:py-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_50%)]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Transform Photos into
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Stunning Artwork
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                Use AI-powered style transfer to convert your photos into beautiful artistic
                masterpieces. Choose from dozens of curated styles and create unique art in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/styles">
                  <Button size="lg" className="px-8">
                    Explore Styles
                  </Button>
                </Link>
                <Link href="/generate">
                  <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-gray-900">
                    Start Creating
                  </Button>
                </Link>
              </div>
            </div>

            {/* Preview Cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <HiSparkles className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                      <p className="text-white/60 text-sm">Style {i}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Creating AI art has never been easier. Just three simple steps to transform your photos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="relative p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group hover:border-purple-500/50 transition-colors"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  <div className="pt-4">
                    <feature.icon className="w-10 h-10 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Styles Preview Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Popular Styles
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore our most-loved artistic styles. From classic impressionism to modern digital art.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Impressionist', 'Cyberpunk', 'Watercolor', 'Pop Art', 'Anime', 'Oil Painting', 'Sketch', 'Abstract'].map((style) => (
                <div
                  key={style}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-gray-200 dark:border-gray-800 group cursor-pointer hover:border-purple-500/50 transition-all"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      {style}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/styles">
                <Button size="lg">
                  View All Styles
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Create Amazing Art?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of creators who are transforming their photos into stunning artwork
              with StyleAI.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
