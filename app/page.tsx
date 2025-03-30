'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ComicGenerator from './components/ComicGenerator';
import { languageNames, SupportedLanguage } from '@/utils/openai';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [panels, setPanels] = useState(4);
  const [style, setStyle] = useState('日本のイラスト風');
  const [language, setLanguage] = useState<SupportedLanguage>('ja');
  const [withText, setWithText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('説明文を入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt, 
          panels, 
          style,
          language,
          withText
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '漫画の生成中にエラーが発生しました');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('エラー発生:', err);
      setError(err.message || '漫画の生成中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">ナビゲーションイラスト生成ツール</h1>
        <p className="text-lg text-gray-600">
          説明したい内容を入力するだけで、AIがイラスト形式のナビゲーションを生成します
        </p>
      </section>

      <section className="card mb-12">
        <h2 className="text-xl font-semibold mb-4">ナビゲーションイラストの生成</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              説明したい内容
            </label>
            <textarea
              id="prompt"
              className="input-field min-h-[120px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例: 洗濯機の使い方、朝食の作り方、スマートフォンのセットアップ方法など"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="panels" className="block text-sm font-medium mb-2">
                コマ数
              </label>
              <select
                id="panels"
                className="input-field"
                value={panels}
                onChange={(e) => setPanels(Number(e.target.value))}
              >
                <option value="2">2コマ</option>
                <option value="3">3コマ</option>
                <option value="4">4コマ</option>
                <option value="6">6コマ</option>
              </select>
            </div>

            <div>
              <label htmlFor="style" className="block text-sm font-medium mb-2">
                スタイル
              </label>
              <select
                id="style"
                className="input-field"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="日本のイラスト風">日本のイラスト風</option>
                <option value="リアル">リアル</option>
                <option value="アニメ">アニメ</option>
                <option value="水彩画">水彩画</option>
                <option value="漫画">漫画</option>
                <option value="ピクセルアート">ピクセルアート</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-2">
                言語
              </label>
              <select
                id="language"
                className="input-field"
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              >
                {Object.entries(languageNames).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                セリフオプション
              </label>
              <div className="flex items-center space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="withText"
                    checked={withText}
                    onChange={() => setWithText(true)}
                  />
                  <span className="ml-2">画像にセリフを含める</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="withText"
                    checked={!withText}
                    onChange={() => setWithText(false)}
                  />
                  <span className="ml-2">吹き出しのみ（UIで表示）</span>
                </label>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  生成中...
                </>
              ) : (
                'ナビゲーションイラストを生成'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
            <p>{error}</p>
          </div>
        )}
      </section>

      {result && (
        <section className="card mb-12">
          <ComicGenerator 
            content={result.content} 
            panelDialogues={result.panelDialogues}
          />
        </section>
      )}

      <section className="card mb-12">
        <h2 className="text-xl font-semibold mb-4">使い方</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>説明したい内容を入力します。できるだけ具体的に書くとより良い結果が得られます。</li>
          <li>コマ数（2〜6コマ）とスタイルを選択します。</li>
          <li>言語を選択します。日本語、英語、中国語、韓国語から選べます。</li>
          <li>セリフを画像に直接入れるか、UIで表示するかを選択できます。</li>
          <li>「ナビゲーションイラストを生成」ボタンをクリックして、AIにイラストを作成してもらいましょう。</li>
          <li>生成されたイラストは、ダウンロードしたり、共有したりすることができます。</li>
        </ol>
        
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            より詳しい使い方については、
            <a href="/guide" className="text-blue-600 hover:underline">
              ガイドページ
            </a>
            をご覧ください。
          </p>
        </div>
      </section>
    </main>
  );
}
