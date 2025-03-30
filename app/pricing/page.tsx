'use client';

import { useState } from 'react';
import Link from 'next/link';

type PricingOption = {
  id: string;
  name: string;
  description: string;
  price: string;
  pricePerYear: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  recommended?: boolean;
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const pricingOptions: PricingOption[] = [
    {
      id: 'free',
      name: '無料プラン',
      description: '個人利用や小規模な用途に最適',
      price: '¥0',
      pricePerYear: '¥0',
      features: [
        '月10枚の漫画生成',
        '基本的な編集機能',
        '3種類のスタイル',
        '最大4コマまで',
        'PNGでのダウンロード',
        'ウォーターマーク付き',
      ],
      buttonText: '無料で始める',
      buttonLink: '/register',
    },
    {
      id: 'standard',
      name: 'スタンダードプラン',
      description: 'フリーランスやビジネス用途に最適',
      price: '¥980',
      pricePerYear: '¥9,800',
      features: [
        '月50枚の漫画生成',
        '高度な編集機能',
        '8種類のスタイル',
        '最大8コマまで',
        'PNG・JPEGでのダウンロード',
        'ウォーターマークなし',
        'プロジェクト保存機能',
        'メールサポート',
      ],
      buttonText: '申し込む',
      buttonLink: '/register?plan=standard',
      recommended: true,
    },
    {
      id: 'premium',
      name: 'プレミアムプラン',
      description: '企業や大量利用に最適',
      price: '¥3,980',
      pricePerYear: '¥39,800',
      features: [
        '月200枚の漫画生成',
        'すべての編集機能',
        'すべてのスタイル (10種類以上)',
        'コマ数無制限',
        'PNG・JPEG・PDFでのダウンロード',
        'ウォーターマークなし',
        'プロジェクト無制限保存',
        '優先メールサポート',
        'カスタムテンプレート作成',
        'API連携機能',
      ],
      buttonText: '申し込む',
      buttonLink: '/register?plan=premium',
    },
  ];
  
  const faqs = [
    {
      question: '支払い方法は何がありますか？',
      answer: 'クレジットカード（Visa、Mastercard、American Express、JCB）、PayPal、銀行振込に対応しています。',
    },
    {
      question: 'プランはいつでも変更できますか？',
      answer: 'はい、いつでもプランのアップグレードやダウングレードが可能です。アップグレードは即時反映され、ダウングレードは現在の請求期間の終了時に適用されます。',
    },
    {
      question: '返金ポリシーはどうなっていますか？',
      answer: 'サブスクリプション開始から14日以内であれば、全額返金が可能です。返金をご希望の場合は、サポートチームにお問い合わせください。',
    },
    {
      question: '請求書は発行できますか？',
      answer: 'はい、企業向けの請求書発行に対応しています。管理画面の「請求設定」から請求先情報を設定いただくと、毎月自動的に請求書をメールでお送りします。',
    },
    {
      question: '生成枚数の上限を超えるとどうなりますか？',
      answer: '上限を超えた場合、次の請求サイクルまで新規生成ができなくなります。急ぎで追加生成が必要な場合は、一時的に上位プランにアップグレードするか、従量課金（1枚あたり100円）で追加購入が可能です。',
    },
  ];
  
  return (
    <div>
      {/* ヘッダーセクション */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">料金プラン</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            あなたのニーズに合わせた最適なプランをお選びください
          </p>
          
          {/* 請求サイクル切り替え */}
          <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg mb-8">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingCycle === 'monthly'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              月額
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingCycle === 'yearly'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              年額 (20%オフ)
            </button>
          </div>
        </div>
      </section>
      
      {/* 料金プラン一覧 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingOptions.map((option) => (
              <div
                key={option.id}
                className={`relative rounded-xl overflow-hidden border ${
                  option.recommended
                    ? 'border-blue-400 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                {option.recommended && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                    おすすめ
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{option.name}</h3>
                  <p className="text-gray-600 mb-6">{option.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {billingCycle === 'monthly' ? option.price : option.pricePerYear}
                    </span>
                    <span className="text-gray-500 ml-2">
                      /{billingCycle === 'monthly' ? '月' : '年'}
                    </span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={option.buttonLink}
                    className={`block w-full py-3 text-center rounded-lg font-medium ${
                      option.recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {option.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* エンタープライズプラン */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">エンタープライズプラン</h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              大規模なチーム利用、カスタムスタイル開発、プライベートクラウド環境など、
              企業特有のニーズに合わせたカスタマイズプランをご用意しています。
            </p>
            <Link
              href="/contact?subject=enterprise"
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>
      
      {/* 機能比較表 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">プラン機能比較</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-4 font-medium">機能</th>
                  <th className="text-center p-4 font-medium">無料プラン</th>
                  <th className="text-center p-4 font-medium bg-blue-50">スタンダードプラン</th>
                  <th className="text-center p-4 font-medium">プレミアムプラン</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="p-4">月間生成枚数</td>
                  <td className="text-center p-4">10枚</td>
                  <td className="text-center p-4 bg-blue-50">50枚</td>
                  <td className="text-center p-4">200枚</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">利用可能なスタイル</td>
                  <td className="text-center p-4">3種類</td>
                  <td className="text-center p-4 bg-blue-50">8種類</td>
                  <td className="text-center p-4">10種類以上</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">コマ数</td>
                  <td className="text-center p-4">最大4コマ</td>
                  <td className="text-center p-4 bg-blue-50">最大8コマ</td>
                  <td className="text-center p-4">無制限</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">高解像度出力</td>
                  <td className="text-center p-4">
                    <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-blue-50">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </td>
                  <td className="text-center p-4">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">複数形式でのエクスポート</td>
                  <td className="text-center p-4">PNG のみ</td>
                  <td className="text-center p-4 bg-blue-50">PNG, JPEG</td>
                  <td className="text-center p-4">PNG, JPEG, PDF</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">ウォーターマーク</td>
                  <td className="text-center p-4">あり</td>
                  <td className="text-center p-4 bg-blue-50">なし</td>
                  <td className="text-center p-4">なし</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">プロジェクト保存</td>
                  <td className="text-center p-4">
                    <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-blue-50">10件まで</td>
                  <td className="text-center p-4">無制限</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">カスタムテンプレート</td>
                  <td className="text-center p-4">
                    <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-blue-50">
                    <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="text-center p-4">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">API連携</td>
                  <td className="text-center p-4">
                    <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="text-center p-4 bg-blue-50">
                    <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="text-center p-4">
                    <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* よくある質問 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">料金に関するよくある質問</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <details key={index} className="group py-4 marker:content-['']">
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
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                さらに質問がありますか？お気軽にお問い合わせください。
              </p>
              <Link
                href="/contact?subject=pricing"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                お問い合わせフォームへ
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">今すぐ始めましょう</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            クレジットカード情報なしで無料プランからお試しいただけます。
            いつでもアップグレードやダウングレードが可能です。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg">
              無料で始める
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