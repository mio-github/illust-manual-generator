'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PromptForm from './components/PromptForm';
import ComicGenerator from './components/ComicGenerator';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  
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
          <h2 className="text-3xl font-bold text-center mb-12">主な機能</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">簡単に漫画作成</h3>
              <p className="text-gray-600">テキスト説明を入力するだけで、自動的にコマ割り漫画が生成されます。イラスト制作の知識は不要です。</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">日本語テキスト配置</h3>
              <p className="text-gray-600">生成された漫画のセリフを日本語で自由に編集。吹き出し内に適切に配置されます。</p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">画像修正機能</h3>
              <p className="text-gray-600">生成された漫画の細部を調整可能。イラストスタイルの変更やコマの追加も簡単に行えます。</p>
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
                <Link href="/pricing#support" className="btn-primary w-full block text-center">
                  サポートする (月額980円)
                </Link>
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
        </div>
      </section>
      
      {/* 使用例セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">活用事例</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            さまざまなシーンで活用できるイラスト説明漫画ジェネレーター。以下のような用途に最適です。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-500">商品説明事例</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">商品マニュアル</h3>
                <p className="text-gray-600 text-sm">製品の使い方や特徴を漫画で説明。視覚的で分かりやすい説明書に。</p>
              </div>
            </div>
            
            <div className="card">
              <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-500">サービス紹介事例</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">サービス紹介</h3>
                <p className="text-gray-600 text-sm">抽象的なサービスも漫画でわかりやすく。ユーザーの理解を促進。</p>
              </div>
            </div>
            
            <div className="card">
              <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-500">教育コンテンツ事例</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">教育コンテンツ</h3>
                <p className="text-gray-600 text-sm">複雑な概念も漫画で簡単に。学習効率を高める教材作成に。</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/guide" className="btn-secondary">
              さらに活用例を見る
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">今すぐ始めましょう</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            説明文を入力するだけで、プロフェッショナルな漫画が簡単に作成できます。
          </p>
          <Link href="#generator" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg">
            無料で試してみる
          </Link>
        </div>
      </section>
    </div>
  );
}
