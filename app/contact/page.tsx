'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // 実際の実装では、ここでAPIを呼び出してフォームデータを送信します
      console.log('送信データ:', formData);
      
      // 送信成功のシミュレーション（実際の実装では削除します）
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('送信中にエラーが発生しました。後ほど再度お試しください。');
      console.error('提出エラー:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      {/* ヘッダーセクション */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">お問い合わせ</h1>
          <p className="text-xl text-gray-600 mb-0 max-w-3xl mx-auto">
            ご質問やご意見、サポートについてのお問い合わせはこちらからお願いします
          </p>
        </div>
      </section>
      
      {/* フォームセクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {isSubmitted ? (
              // 送信完了メッセージ
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 className="text-2xl font-bold text-green-800 mb-4">お問い合わせありがとうございます</h2>
                <p className="text-green-700 mb-6">
                  メッセージを受け付けました。通常2営業日以内にご返信いたします。
                </p>
                <Link href="/" className="btn-primary">
                  ホームに戻る
                </Link>
              </div>
            ) : (
              // 問い合わせフォーム
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6">お問い合わせフォーム</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      お名前 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input-field"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input-field"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      お問い合わせ種別 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="input-field"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">選択してください</option>
                      <option value="general">一般的なお問い合わせ</option>
                      <option value="technical">技術的な問題</option>
                      <option value="billing">料金・お支払いについて</option>
                      <option value="feature">機能リクエスト</option>
                      <option value="partnership">パートナーシップ・提携</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      メッセージ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="input-field"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="privacy"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="privacy" className="text-gray-600">
                          <Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>に同意します
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary w-full py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        送信中...
                      </span>
                    ) : '送信する'}
                  </button>
                </form>
              </div>
            )}
            
            <div className="mt-12 bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">その他のお問い合わせ方法</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium">Eメール</h4>
                    <p className="text-gray-600">support@illust-manual-generator.example.com</p>
                    <p className="text-gray-500 text-sm">営業時間: 平日 10:00-18:00</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium">よくある質問</h4>
                    <p className="text-gray-600">
                      一般的な質問への回答は<Link href="/faq" className="text-blue-600 hover:underline">FAQページ</Link>をご確認ください。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium">フィードバック</h4>
                    <p className="text-gray-600">
                      サービス改善のためのご意見・ご提案をお待ちしております。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">サービスを体験してみませんか？</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            説明文を入力するだけで、プロフェッショナルな漫画が簡単に作成できます。
          </p>
          <Link href="/" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg">
            無料で試してみる
          </Link>
        </div>
      </section>
    </div>
  );
} 