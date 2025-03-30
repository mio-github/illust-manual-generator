'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PromptForm from './components/PromptForm';
import ComicGenerator from './components/ComicGenerator';

interface PanelContent {
  imageUrl: string;
  dialogues: string[];
  caption: string;
}

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<PanelContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateComic = async (data: { prompt: string; panels: number; style: string }) => {
    try {
      setIsGenerating(true);
      setError(null);
      console.log('生成開始:', data);
      
      // APIを呼び出す
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成中にエラーが発生しました');
      }
      
      const result = await response.json();
      console.log('生成結果:', result);
      
      if (result.success && result.content) {
        setGeneratedContent(result.content);
      } else {
        throw new Error('生成結果が不正な形式です');
      }
    } catch (err) {
      console.error('生成エラー:', err);
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            説明文から<span className="text-blue-600">イラスト漫画</span>を<br />
            ワンクリックで生成
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            GPT-4oの高度な画像生成能力を活用し、商品やサービスの説明を漫画形式で簡単に作成できます。説明文を書くだけで、プロフェッショナルな漫画が完成します。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#generator" className="btn-primary text-lg py-3 px-8">
              今すぐ試してみる
            </Link>
            <Link href="/guide" className="btn-secondary text-lg py-3 px-8">
              使い方を見る
            </Link>
          </div>
        </div>
      </section>
      
      {/* 特徴セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            イラスト説明漫画ジェネレーターの特徴
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">簡単操作</h3>
              <p className="text-gray-600">
                説明文を入力するだけで、AIが自動的に内容を理解し、適切な漫画を生成します。
                専門的な知識や画像編集スキルは必要ありません。
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">多様なスタイル</h3>
              <p className="text-gray-600">
                標準、マンガ風、シンプル、かわいいなど、目的に応じた複数のイラストスタイルから選択可能。
                企業の説明資料からSNS投稿まで幅広く活用できます。
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">編集機能</h3>
              <p className="text-gray-600">
                生成された漫画のセリフや説明文を自由に編集できます。
                必要に応じて微調整し、完璧な説明漫画に仕上げることが可能です。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 生成ツールセクション */}
      <section id="generator" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">漫画生成ツール</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">プロンプト入力</h2>
                <PromptForm 
                  onSubmit={handleGenerateComic} 
                  isGenerating={isGenerating}
                />
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">サポート</h2>
                <p className="text-gray-600 mb-4">
                  このツールの開発と維持をサポートしてください。月額980円のご寄付で、より多くの機能開発が可能になります。
                </p>
                <Link href="/pricing#support" className="btn-primary w-full block text-center">
                  サポートする (月額980円)
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">生成結果</h2>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    <p className="font-bold">エラーが発生しました</p>
                    <p>{error}</p>
                  </div>
                )}
                {isGenerating ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p>漫画を生成中...</p>
                      <p className="text-sm text-gray-500 mt-2">数秒から数十秒かかる場合があります</p>
                    </div>
                  </div>
                ) : generatedContent.length > 0 ? (
                  <ComicGenerator content={generatedContent} />
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-3">左側のフォームに説明文を入力して「生成」ボタンをクリックしてください。</p>
                    <p className="text-xs text-gray-400">例: 「電子マネーでのお支払い方法を4コマ漫画で説明」</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 使用例セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            活用シーン
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">ビジネス活用</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>製品やサービスの使い方マニュアル</li>
                <li>社内研修資料のビジュアル化</li>
                <li>業務フローやプロセスの説明</li>
                <li>マーケティング資料やプレゼンテーション</li>
                <li>ウェブサイトやSNSでの情報発信</li>
              </ul>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">個人活用</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>ブログやSNS投稿用のイラスト作成</li>
                <li>趣味の解説や説明資料</li>
                <li>家族や友人向けの説明資料</li>
                <li>学習ノートやメモの視覚化</li>
                <li>イベントや手順の説明書作成</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/guide" className="btn-secondary">
              もっと詳しく見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
