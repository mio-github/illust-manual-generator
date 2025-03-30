import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('画像生成APIが呼び出されました');
    
    // リクエストボディを取得
    const body = await req.json();
    const { prompt, panels = 4, style } = body;
    
    console.log('リクエスト内容:', { prompt, panels, style });

    // バリデーション
    if (!prompt) {
      console.error('バリデーションエラー: プロンプトが空です');
      return NextResponse.json(
        { error: 'プロンプトは必須です' },
        { status: 400 }
      );
    }
    
    // コマ数を6コマまでに制限
    const actualPanels = Math.min(Math.max(1, panels), 6);
    if (panels !== actualPanels) {
      console.log(`指定されたコマ数(${panels})が範囲外のため、${actualPanels}コマに調整されました`);
    }

    // 実際の実装では、ここでAI画像生成サービスを呼び出します
    // このサンプルでは、ダミーの応答を返します
    console.log('画像生成処理を開始します...');
    
    // 生成処理を模擬的に遅延させる（実際のAPIでは必要ありません）
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // セリフの自動生成（実際はAIモデルを使用して生成）
    const generateDialogue = (panelIndex: number, promptText: string) => {
      const dialogueBank = [
        ['なるほど、これが問題なんですね', 'そうなんです！どうすればいいでしょう？'],
        ['まず最初にこの部分を確認しましょう', 'なるほど、理解できました'],
        ['次に重要なのはこのステップです', 'これが解決の鍵ですね！'],
        ['この部分が特に注意が必要です', '気をつけます！'],
        ['最後に確認しておきましょう', 'これで完璧ですね！ありがとう'],
        ['実際にやってみると簡単ですよ', 'わかりました、試してみます']
      ];
      
      // プロンプトの内容に基づいた擬似的なセリフ生成
      // 実際の実装ではもっと洗練された生成ロジックを使用すべき
      return dialogueBank[panelIndex % dialogueBank.length];
    };
    
    // ダミーのURL配列とセリフを生成
    const generatedContent = Array.from({ length: actualPanels }, (_, i) => {
      const dialogues = generateDialogue(i, prompt);
      return {
        imageUrl: `https://placehold.co/600x400?text=漫画コマ${i + 1}`,
        dialogues,
        caption: `${prompt}の説明 - パート${i + 1}`
      };
    });
    
    console.log(`${actualPanels}コマの漫画とセリフを生成しました:`, generatedContent);
    
    return NextResponse.json({ 
      success: true,
      content: generatedContent,
      panelCount: actualPanels,
      message: `${actualPanels}コマのイラストとセリフが正常に生成されました`
    });
    
  } catch (error) {
    console.error('イラスト生成エラー:', error);
    return NextResponse.json(
      { error: 'イラスト生成中にエラーが発生しました', details: error instanceof Error ? error.message : '未知のエラー' },
      { status: 500 }
    );
  }
}
