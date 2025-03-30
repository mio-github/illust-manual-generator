'use client';

import { useState } from 'react';
import Image from 'next/image';
import PromptForm from './components/PromptForm';
import ComicGenerator from './components/ComicGenerator';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">イラスト説明漫画ジェネレーター</h1>
        <p className="text-gray-600">GPT-4oの力で、説明文からイラスト漫画を簡単に生成</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">プロンプト入力</h2>
            <PromptForm 
              onSubmit={(data) => {
                setIsGenerating(true);
                // 実際の実装では、ここでAPIを呼び出します
                console.log('生成開始:', data);
                
                // モックの応答（実際の実装では削除します）
                setTimeout(() => {
                  setGeneratedImages(['https://placehold.co/600x400?text=漫画コマ1', 'https://placehold.co/600x400?text=漫画コマ2']);
                  setIsGenerating(false);
                }, 2000);
              }} 
              isGenerating={isGenerating}
            />
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">サポート</h2>
            <p className="text-gray-600 mb-4">
              このツールの開発と維持をサポートしてください。月額980円のご寄付で、より多くの機能開発が可能になります。
            </p>
            <button className="btn-primary w-full">
              サポートする (月額980円)
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">生成結果</h2>
            {isGenerating ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>漫画を生成中...</p>
                </div>
              </div>
            ) : generatedImages.length > 0 ? (
              <ComicGenerator images={generatedImages} />
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">左側のフォームに説明文を入力して「生成」ボタンをクリックしてください。</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2024 イラスト説明漫画ジェネレーター | Powered by GPT-4o</p>
      </footer>
    </main>
  );
}
