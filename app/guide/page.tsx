import Link from 'next/link';
import Image from 'next/image';

export default function GuidePage() {
  return (
    <div>
      {/* ヘッダーセクション */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">使い方ガイド</h1>
          <p className="text-xl text-gray-600 mb-0 max-w-3xl mx-auto">
            イラスト説明漫画ジェネレーターの使い方を詳しくご紹介します
          </p>
        </div>
      </section>
      
      {/* 基本的な使い方 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">基本的な使い方</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
              <div>
                <span className="inline-block bg-blue-600 text-white rounded-full w-8 h-8 text-center leading-8 font-bold mb-4">1</span>
                <h3 className="text-xl font-bold mb-4">説明文を入力する</h3>
                <p className="text-gray-600">
                  ホームページの入力フォームに、漫画にしたい説明文を入力します。
                  説明内容が具体的であるほど、より良い結果が得られます。
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">入力例：</p>
                  <p className="text-gray-600 text-sm italic">
                    「電子マネー決済の使い方。スマホアプリを開き、支払いボタンをタップすると表示されるQRコードを店員に見せる。店員がスキャンして金額を確認したら、指紋認証で決済完了。」
                  </p>
                </div>
              </div>
              <div className="bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
                <span className="text-gray-500">入力フォームのイメージ</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
              <div className="order-2 md:order-1 bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
                <span className="text-gray-500">コマ数・スタイル選択のイメージ</span>
              </div>
              <div className="order-1 md:order-2">
                <span className="inline-block bg-blue-600 text-white rounded-full w-8 h-8 text-center leading-8 font-bold mb-4">2</span>
                <h3 className="text-xl font-bold mb-4">コマ数とスタイルを選択する</h3>
                <p className="text-gray-600">
                  漫画のコマ数（1〜4コマ）を選択します。
                  また、イラストスタイル（標準、マンガ風、シンプル、かわいい）を選択できます。
                  サポータープランでは、より多くのスタイルから選べます。
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
              <div>
                <span className="inline-block bg-blue-600 text-white rounded-full w-8 h-8 text-center leading-8 font-bold mb-4">3</span>
                <h3 className="text-xl font-bold mb-4">生成ボタンをクリック</h3>
                <p className="text-gray-600">
                  「漫画を生成」ボタンをクリックすると、AIが説明文を元に漫画を生成します。
                  生成には数秒から数十秒かかります。
                  生成中はプログレスインジケーターが表示されます。
                </p>
              </div>
              <div className="bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
                <span className="text-gray-500">生成中のイメージ</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-gray-200 rounded-lg w-full h-64 flex items-center justify-center">
                <span className="text-gray-500">生成結果のイメージ</span>
              </div>
              <div className="order-1 md:order-2">
                <span className="inline-block bg-blue-600 text-white rounded-full w-8 h-8 text-center leading-8 font-bold mb-4">4</span>
                <h3 className="text-xl font-bold mb-4">漫画を編集・保存する</h3>
                <p className="text-gray-600">
                  生成された漫画が表示されます。
                  各コマをクリックすると、そのコマのテキストを編集できます。
                  満足のいく結果が得られたら、「画像として保存」ボタンをクリックして
                  漫画をダウンロードできます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 上級者向けのヒント */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">上級者向けのヒント</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">効果的な説明文の書き方</h3>
                <p className="text-gray-600 text-sm">
                  シーン、キャラクター、行動を具体的に書くとより良い結果が得られます。
                  「〜を説明する漫画」と最後に付け加えるのも効果的です。
                </p>
              </div>
              
              <div className="card p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">テキスト編集のコツ</h3>
                <p className="text-gray-600 text-sm">
                  吹き出し内のテキストは簡潔に。長文は避け、フォントサイズを適切に調整すると
                  読みやすい漫画になります。
                </p>
              </div>
              
              <div className="card p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">最適なスタイル選択</h3>
                <p className="text-gray-600 text-sm">
                  ビジネス向けならシンプルスタイル、子供向けならかわいいスタイルなど、
                  用途に合わせたスタイル選択がおすすめです。
                </p>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">プロが教える！効果的な説明漫画のポイント</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>シナリオの流れを明確に：</strong> 最初のコマから最後のコマまで、ストーリーの流れが明確になるように説明文を構成しましょう。</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>セリフは簡潔に：</strong> 長いセリフは読みにくくなります。要点を絞って簡潔に表現しましょう。</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>視覚的なシーン描写：</strong> 「オフィスで」「スマホを持ちながら」など、視覚的な情報を含めると、より具体的なイラストが生成されます。</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span><strong>ターゲットに合わせたスタイル：</strong> 説明対象によって最適なスタイルは異なります。堅い内容はシンプルに、親しみやすい内容はマンガ風やかわいいスタイルがおすすめです。</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* 活用例 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">活用例</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            様々なシーンで活用できるイラスト説明漫画ジェネレーター。以下のような用途におすすめです。
          </p>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card">
                <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">事例イメージ</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">商品マニュアル</h3>
                  <p className="text-gray-600 mb-4">
                    製品の使い方や特徴を視覚的に説明。文字だけでは伝わりにくい操作手順も、
                    漫画なら直感的に理解できます。
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    「スマートウォッチの心拍数測定機能の使い方を説明する漫画」
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">事例イメージ</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">サービス紹介</h3>
                  <p className="text-gray-600 mb-4">
                    Web サービスやアプリの機能を漫画で紹介。
                    複雑なサービスもストーリー形式で分かりやすく伝えられます。
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    「クラウドストレージサービスの共有機能の便利さを説明する漫画」
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">事例イメージ</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">社内教育</h3>
                  <p className="text-gray-600 mb-4">
                    業務マニュアルや社内ルールを漫画で説明。
                    読みやすく記憶に残るため、社員教育に最適です。
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    「社内のセキュリティポリシーを分かりやすく説明する漫画」
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">事例イメージ</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">マーケティング</h3>
                  <p className="text-gray-600 mb-4">
                    SNS投稿やメルマガ用の漫画コンテンツを簡単に作成。
                    視認性が高く、ユーザーの関心を引きます。
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    「新商品の特徴と従来品との違いを比較する漫画」
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">事例イメージ</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">教育コンテンツ</h3>
                  <p className="text-gray-600 mb-4">
                    学習教材や解説コンテンツを漫画で作成。
                    難しい概念も漫画なら楽しく学べます。
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    「光合成のプロセスを子供向けに説明する漫画」
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="bg-gray-200 h-48 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">事例イメージ</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">プレゼン資料</h3>
                  <p className="text-gray-600 mb-4">
                    ビジネスプレゼンにユニークな漫画スライドを。
                    インパクトがあり、聴衆の記憶に残ります。
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    「新しいビジネスモデルの提案を漫画で表現」
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
            説明文を入力するだけで、プロフェッショナルな漫画が簡単に作成できます。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg">
              無料で試してみる
            </Link>
            <Link href="/pricing" className="bg-blue-700 text-white hover:bg-blue-800 font-medium py-3 px-8 rounded-lg text-lg">
              料金プランを見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 