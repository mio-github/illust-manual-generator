'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'ホーム', href: '/' },
    { name: 'サービス説明', href: '/about' },
    { name: '料金・サポート', href: '/pricing' },
    { name: '使い方ガイド', href: '/guide' },
    { name: 'お問い合わせ', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="navbar">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-pink-500 font-bold text-xl">ナビゲーションイラスト</span>
              </Link>
            </div>
            
            {/* デスクトップナビゲーション */}
            <div className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-1 py-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/pricing#support"
                className="ml-2 btn-primary text-sm py-1.5 px-3"
              >
                サポートする
              </Link>
            </div>
            
            {/* モバイルメニューボタン */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <span className="sr-only">メニューを開く</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* モバイルメニュー */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-2`}>
            <div className="flex flex-col space-y-2 py-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/pricing#support"
                className="mt-2 btn-primary text-sm py-2 px-3 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                サポートする
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
} 