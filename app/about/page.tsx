'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div>
      {/* ヘッダーセクション */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">イラストマニュアルジェネレーターについて</h1>
          <p className="text-xl text-gray-600 mb-0 max-w-3xl mx-auto">
            テキスト説明から美しい漫画形式のマニュアルを自動生成する革新的なAIツール
          </p>
        </div>
      </section>
      
      {/* ミッションセクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">私たちのミッション</h2>
            <div className="prose prose-lg max-w-none">
              <p>
                イラストマニュアルジェネレーターは、複雑な説明や手順を誰もが理解しやすい漫画形式に変換することで、
                コミュニケーションの障壁を取り除くというミッションのもとに開発されました。
              </p>
              <p>
                文字だけの説明は理解が難しく、時に誤解を生みます。また、プロのイラストレーターに依頼するには
                コストと時間がかかります。このギャップを埋めるために、当サービスでは最新のAI技術を活用し、
                誰でも簡単に分かりやすいビジュアルコンテンツを作成できる環境を提供しています。
              </p>
              <p>
                文化や言語の壁を超え、世界中の人々がより効果的にコミュニケーションを取れる未来を目指しています。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 特徴セクション */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">主な特徴</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">AI技術の活用</h3>
              <p className="text-gray-600">
                最新の自然言語処理と画像生成AIを組み合わせ、テキスト説明から自然でリアルな漫画スタイルのイラストを生成します。
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">カスタマイズ性</h3>
              <p className="text-gray-600">
                複数のスタイルからお選びいただけるほか、キャラクターの外見や背景などを詳細に調整可能。あなたのブランドや用途に合わせたカスタマイズが可能です。
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">スピードと効率</h3>
              <p className="text-gray-600">
                数分で完成するスピード生成。従来のイラスト制作と比較して、時間とコストを大幅に削減しながら、高品質なビジュアルコンテンツを作成できます。
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">高品質アウトプット</h3>
              <p className="text-gray-600">
                商用利用にも適した高解像度イラストを出力。PNG、JPEG、PDF形式での保存に対応し、印刷物からデジタルコンテンツまで様々な用途に活用できます。
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">セキュリティ</h3>
              <p className="text-gray-600">
                ユーザーデータのセキュリティを最優先。企業の機密情報や個人情報を含むコンテンツも安心して作成いただけるよう、厳格なセキュリティ対策を実施しています。
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">使いやすさ</h3>
              <p className="text-gray-600">
                専門知識は一切不要。直感的なインターフェースで、誰でも簡単にプロ品質の漫画マニュアルを作成できます。細かな調整も簡単操作で行えます。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 活用事例セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">活用事例</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">製品マニュアル</h3>
              <p className="text-gray-600 mb-6">
                テキストだけでは伝わりにくい製品の使い方や機能説明を、漫画形式で分かりやすく視覚化。
                ユーザーの理解度向上とサポート問い合わせの削減につながります。
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  電子機器のセットアップガイド
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  アプリケーションの機能説明
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  組み立て家具の組立手順書
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">社内教育・トレーニング</h3>
              <p className="text-gray-600 mb-6">
                複雑な業務プロセスや手順を漫画で表現することで、従業員の理解度と記憶の定着率が向上。
                効率的な社内トレーニングを実現します。
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  新入社員オンボーディング資料
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  安全マニュアル・手順書
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  システム操作マニュアル
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">マーケティング・広告</h3>
              <p className="text-gray-600 mb-6">
                商品やサービスの特徴を漫画形式で紹介することで、ユーザーの注目を集め、
                情報の伝達効率を高めます。SNSでの拡散にも効果的です。
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  製品・サービスの紹介資料
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  SNS広告コンテンツ
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  ブランドストーリーの説明
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">教育コンテンツ</h3>
              <p className="text-gray-600 mb-6">
                難しい概念や理論を漫画形式で表現することで、学習者の理解を促進。
                教育機関や学習サイトでの活用に最適です。
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  教科書・学習補助資料
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  プログラミング教材
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  オンライン講座のサポート資料
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* 技術紹介セクション */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">技術について</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <p>
                  イラストマニュアルジェネレーターは、最先端のAI技術を活用して開発されています。
                  特に以下の技術を組み合わせることで、高品質な漫画形式のマニュアル生成を実現しています：
                </p>
                
                <h3>自然言語処理（NLP）</h3>
                <p>
                  ユーザーが入力した説明文を解析し、シーンの状況、登場人物の行動、背景などの要素を
                  正確に理解するための自然言語処理技術を採用しています。
                </p>
                
                <h3>画像生成AI</h3>
                <p>
                  解析されたテキスト情報をもとに、適切なキャラクター、表情、動作、背景などを含む
                  イラストを生成するための画像生成AIを実装。異なるスタイルでの出力に対応しています。
                </p>
                
                <h3>レイアウトエンジン</h3>
                <p>
                  生成されたイラストとテキストを漫画形式に配置するための独自のレイアウトエンジンを開発。
                  読みやすさとビジュアルの美しさを両立させる最適なレイアウトを自動生成します。
                </p>
                
                <h3>カスタマイズフレームワーク</h3>
                <p>
                  ユーザーがキャラクターの外見、背景、テキストスタイルなどを簡単にカスタマイズできる
                  フレームワークを構築。直感的なUIで高度なカスタマイズを実現しています。
                </p>
                
                <p>
                  これらの技術を継続的に改良し、より高品質で多様なニーズに対応できるサービスを目指して
                  開発を続けています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* チーム紹介セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">開発チーム</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-center mb-8">
                イラストマニュアルジェネレーターは、AIとデザインの専門家チームによって開発されています。
                私たちは、技術の力でコミュニケーションの壁を取り払い、情報をより分かりやすく伝えることに情熱を持って取り組んでいます。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                    <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">山田 太郎</h3>
                  <p className="text-blue-600 font-medium mb-2">創業者 & AIエンジニア</p>
                  <p className="text-gray-600 text-base">
                    10年以上のAI開発経験を持ち、画像生成AIと自然言語処理の専門家。
                    イラストマニュアルジェネレーターのコアエンジンを設計・開発。
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                    <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">佐藤 花子</h3>
                  <p className="text-blue-600 font-medium mb-2">UIデザイナー</p>
                  <p className="text-gray-600 text-base">
                    直感的なユーザーインターフェースの設計を担当。
                    複雑な技術を誰でも簡単に使えるよう、ユーザー中心のデザインアプローチを実践。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">今すぐ始めましょう</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            テキスト入力だけで、プロフェッショナルな漫画形式のイラストを自動生成。
            マニュアル作成の常識を変えるツールを無料でお試しいただけます。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg">
              無料で試してみる
            </Link>
            <Link href="/guide" className="bg-blue-700 text-white hover:bg-blue-800 font-medium py-3 px-8 rounded-lg text-lg border border-white">
              使い方を見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 