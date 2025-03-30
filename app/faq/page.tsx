'use client';

import { useState } from 'react';
import Link from 'next/link';

type FaqItem = {
  question: string;
  answer: string;
  category: string;
};

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const faqItems: FaqItem[] = [
    {
      question: 'イラストマニュアルジェネレーターとは何ですか？',
      answer: 'イラストマニュアルジェネレーターは、テキスト説明から漫画形式のイラスト付きマニュアルを自動生成するAIツールです。製品マニュアル、サービス説明、トレーニング資料などを簡単に視覚化できます。',
      category: 'general',
    },
    {
      question: '無料で使えますか？',
      answer: '基本機能は無料でご利用いただけます。より高度な機能や生成数の制限緩和については有料プランをご用意しています。詳細は料金ページをご確認ください。',
      category: 'pricing',
    },
    {
      question: '生成されたイラストの著作権は誰に帰属しますか？',
      answer: '当サービスで生成されたイラストの著作権はユーザー様に帰属します。商用利用も可能です。ただし、生成されたコンテンツを再販売したり、他のAIモデルの訓練に使用することはできません。詳細は利用規約をご確認ください。',
      category: 'legal',
    },
    {
      question: '生成された漫画をカスタマイズできますか？',
      answer: 'はい、生成後の漫画は編集画面でパネルの追加・削除、テキストの変更、キャラクターの表情調整などができます。必要に応じてカスタマイズしてご利用ください。',
      category: 'usage',
    },
    {
      question: '何種類のスタイルから選べますか？',
      answer: '現在、「シンプル」「マンガ風」「リアル」「ビジネス」「ポップ」「アメコミ風」など10種類以上のスタイルをご用意しています。今後も定期的に新しいスタイルを追加していく予定です。',
      category: 'features',
    },
    {
      question: '生成に失敗することはありますか？',
      answer: '稀に、非常に複雑な説明や特殊な要求がある場合に生成に失敗することがあります。その場合は、より簡潔で具体的な説明を試みるか、複数のセクションに分けて生成することをお勧めします。',
      category: 'troubleshooting',
    },
    {
      question: '生成された漫画はどのような形式でダウンロードできますか？',
      answer: 'PNG、JPEG、PDFの3つの形式でダウンロード可能です。また、編集可能なプロジェクトファイルとして保存することもできます。',
      category: 'usage',
    },
    {
      question: '企業向けのプランはありますか？',
      answer: 'はい、複数ユーザーでの利用やカスタムスタイルの作成など、企業向けの特別プランをご用意しています。詳細はお問い合わせページからご連絡ください。',
      category: 'pricing',
    },
    {
      question: 'セキュリティ対策はどうなっていますか？',
      answer: '当サービスでは、ユーザーデータの暗号化、定期的なセキュリティ監査、アクセス制御など、複数層のセキュリティ対策を実施しています。企業情報や機密データも安全にご利用いただけます。',
      category: 'security',
    },
    {
      question: '生成に使用できる言語は何ですか？',
      answer: '現在、日本語と英語に対応しています。今後、他の言語サポートも順次追加する予定です。',
      category: 'features',
    },
    {
      question: 'アカウント登録は必要ですか？',
      answer: '基本的な機能を試すだけであれば登録不要です。ただし、生成した漫画を保存したり、プロジェクトを管理するにはアカウント登録が必要となります。',
      category: 'account',
    },
    {
      question: '技術的な問題が発生した場合はどうすればいいですか？',
      answer: 'お問い合わせページからサポートチームにご連絡いただくか、support@illust-manual-generator.example.comまでメールでお問い合わせください。通常2営業日以内にご返信いたします。',
      category: 'troubleshooting',
    },
  ];
  
  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'general', name: '一般' },
    { id: 'features', name: '機能' },
    { id: 'usage', name: '使い方' },
    { id: 'pricing', name: '料金' },
    { id: 'account', name: 'アカウント' },
    { id: 'troubleshooting', name: 'トラブルシューティング' },
    { id: 'security', name: 'セキュリティ' },
    { id: 'legal', name: '法的事項' },
  ];
  
  const filteredFaqs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div>
      {/* ヘッダーセクション */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">よくある質問</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            イラストマニュアルジェネレーターに関するよくあるご質問と回答をまとめています
          </p>
          
          {/* 検索バー */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="質問を検索..."
                className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-3">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQコンテンツ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* カテゴリーサイドバー */}
            <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
              <div className="sticky top-8">
                <h3 className="text-xl font-bold mb-4">カテゴリー</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`text-left w-full px-4 py-2 rounded-lg transition ${
                          activeCategory === category.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-bold mb-2">他にも質問がありますか？</h4>
                  <p className="text-gray-600 mb-4">
                    お探しの答えが見つからない場合は、お気軽にお問い合わせください。
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    お問い合わせ
                  </Link>
                </div>
              </div>
            </div>
            
            {/* FAQ一覧 */}
            <div className="w-full md:w-3/4 px-4">
              <div className="bg-white rounded-lg">
                {filteredFaqs.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredFaqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group py-4 marker:content-['']"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-2 text-lg font-medium">
                          {faq.question}
                          <div className="transition-transform duration-300 group-open:-rotate-180">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6 text-blue-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </div>
                        </summary>
                        <div className="mt-2 text-gray-600">
                          <p className="py-2">{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">検索結果が見つかりませんでした</h3>
                    <p className="mt-2 text-gray-500">
                      検索ワードを変更するか、別のカテゴリーを選択してみてください。
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                      className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
                    >
                      すべての質問を表示
                      <svg
                        className="ml-1 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">まだ質問がありますか？</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            より詳細なサポートが必要な場合は、お気軽にお問い合わせください。
            サポートチームがお手伝いいたします。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg">
              お問い合わせ
            </Link>
            <Link href="/guide" className="bg-blue-700 text-white hover:bg-blue-800 font-medium py-3 px-8 rounded-lg text-lg">
              使い方ガイドを見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 