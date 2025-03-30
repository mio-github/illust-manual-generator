import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/utils/config';
import { generateDialogues, generateImage } from '@/utils/openai';

export async function POST(req: NextRequest) {
  // リクエストIDを生成（ログ追跡用）
  const requestId = Math.random().toString(36).substring(2, 10);
  
  try {
    console.log(`[${requestId}] 漫画生成API呼び出し開始`);
    
    // リクエストボディを取得
    const body = await req.json();
    const { prompt, panels = appConfig.defaultPanels, style = appConfig.defaultStyle } = body;
    
    console.log(`[${requestId}] リクエスト解析完了`, { 
      prompt, 
      panels, 
      style,
      timestamp: new Date().toISOString()
    });

    // バリデーション
    if (!prompt) {
      console.error(`[${requestId}] バリデーションエラー: プロンプトが空です`);
      return NextResponse.json(
        { error: 'プロンプトは必須です' },
        { status: 400 }
      );
    }
    
    // コマ数をMAX_PANELSまでに制限
    const maxPanels = appConfig.maxPanels;
    const actualPanels = Math.min(Math.max(1, panels), maxPanels);
    if (panels !== actualPanels) {
      console.log(`[${requestId}] 指定されたコマ数(${panels})が範囲外のため、${actualPanels}コマに調整されました`);
    }

    console.log(`[${requestId}] 漫画生成処理を開始します`);
    console.log(`[${requestId}] プロンプト: ${prompt}`);
    console.log(`[${requestId}] コマ数: ${actualPanels}`);
    console.log(`[${requestId}] スタイル: ${style}`);
    
    // 処理開始時間を記録
    const startTime = Date.now();
    
    // まずセリフを生成
    console.log(`[${requestId}] 1. セリフ生成を開始...`);
    let dialogues;
    try {
      dialogues = await generateDialogues(prompt, actualPanels);
      console.log(`[${requestId}] セリフ生成完了: ${JSON.stringify(dialogues)}`);
    } catch (dialogueError) {
      console.error(`[${requestId}] セリフ生成中にエラーが発生しました`, dialogueError);
      throw new Error(`セリフ生成エラー: ${dialogueError instanceof Error ? dialogueError.message : '不明なエラー'}`);
    }
    
    // 各コマの画像生成プロンプトを作成
    const generatePanelPrompt = (index: number, basePrompt: string) => {
      const panelNum = index + 1;
      const totalPanels = actualPanels;
      let storyProgress = '';
      
      if (index === 0) {
        storyProgress = '導入部分、問題提起';
      } else if (index === totalPanels - 1) {
        storyProgress = '結論部分、まとめ';
      } else {
        const progress = Math.floor((index / (totalPanels - 1)) * 100);
        storyProgress = `説明の${progress}%の部分`;
      }
      
      // セリフの内容を画像生成に活用
      const dialogueContext = dialogues[index]?.join('、') || '';
      
      return `
        4コマ漫画の${panelNum}コマ目（${storyProgress}）：${basePrompt}
        コマの内容: ${dialogueContext}
        スタイル: ${style}、日本語の漫画、シンプルで見やすい構図、2人の登場人物
      `.trim();
    };
    
    // 画像生成
    console.log(`[${requestId}] 2. 画像生成を開始...`);
    const imagePromises = Array.from({ length: actualPanels }, async (_, i) => {
      const panelPrompt = generatePanelPrompt(i, prompt);
      console.log(`[${requestId}] コマ${i+1}の画像生成プロンプト:`, panelPrompt);
      
      try {
        const imageUrl = await generateImage(panelPrompt, { 
          quality: style === 'simple' ? 'standard' : 'hd',
        });
        console.log(`[${requestId}] コマ${i+1}の画像生成完了:`, imageUrl.substring(0, 100) + '...');
        return imageUrl;
      } catch (error) {
        console.error(`[${requestId}] コマ${i+1}の画像生成エラー:`, error);
        return `https://placehold.co/600x400?text=コマ${i+1}生成エラー`;
      }
    });
    
    // すべての画像生成が完了するまで待機
    console.log(`[${requestId}] すべての画像生成を待機中...`);
    let imageUrls;
    try {
      imageUrls = await Promise.all(imagePromises);
      console.log(`[${requestId}] 全ての画像生成が完了しました`);
    } catch (imageError) {
      console.error(`[${requestId}] 画像生成中に予期せぬエラーが発生しました`, imageError);
      throw new Error(`画像生成エラー: ${imageError instanceof Error ? imageError.message : '不明なエラー'}`);
    }
    
    // 結果をまとめる
    const generatedContent = Array.from({ length: actualPanels }, (_, i) => {
      return {
        imageUrl: imageUrls[i],
        dialogues: dialogues[i] || [],
        caption: `${prompt} - パート${i + 1}`,
      };
    });
    
    // 処理完了時間を計算
    const totalTime = Date.now() - startTime;
    console.log(`[${requestId}] 漫画生成完了: ${actualPanels}コマ, 所要時間: ${totalTime}ms`);
    
    // レスポンスを返す
    const response = { 
      success: true,
      content: generatedContent,
      panelCount: actualPanels,
      prompt,
      style,
      processingTime: totalTime,
      message: `${actualPanels}コマのイラストとセリフが正常に生成されました`
    };
    
    console.log(`[${requestId}] 漫画生成API呼び出し完了`);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`[${requestId}] 漫画生成中に致命的なエラーが発生しました:`, error);
    
    // エラーメッセージの詳細を取得
    let errorMessage = '漫画生成中にエラーが発生しました';
    let errorDetails = '未知のエラー';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '詳細なスタック情報がありません';
    }
    
    // エラーレスポンスを返す
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        requestId
      },
      { status: 500 }
    );
  }
}
