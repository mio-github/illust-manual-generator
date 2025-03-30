import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/utils/config';
import { 
  generateDialogues, 
  generateSceneWithoutText, 
  composePanelsIntoComic,
  generateMultiPanelComic
} from '@/utils/openai';

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
    
    // 1. 全体構成を考える - これは現在の実装では省略
    console.log(`[${requestId}] 1. 全体構成を検討中...`);
    
    // 2. コマ数分のシーンとセリフを生成
    console.log(`[${requestId}] 2. セリフとシーン構成の生成を開始...`);
    let dialogues;
    try {
      dialogues = await generateDialogues(prompt, actualPanels);
      console.log(`[${requestId}] セリフ生成完了: ${JSON.stringify(dialogues)}`);
    } catch (dialogueError) {
      console.error(`[${requestId}] セリフ生成中にエラーが発生しました`, dialogueError);
      throw new Error(`セリフ生成エラー: ${dialogueError instanceof Error ? dialogueError.message : '不明なエラー'}`);
    }
    
    // 3. 1枚の画像内に複数コマの漫画を生成
    console.log(`[${requestId}] 3. コマ割り漫画の生成を開始...`);
    let comicImageUrl;
    try {
      comicImageUrl = await generateMultiPanelComic(prompt, actualPanels, dialogues, {
        quality: style === 'simple' ? 'standard' : 'hd',
        style
      });
      console.log(`[${requestId}] コマ割り漫画の生成完了:`, comicImageUrl.substring(0, 100) + '...');
    } catch (imageError) {
      console.error(`[${requestId}] コマ割り漫画の生成中にエラーが発生しました`, imageError);
      throw new Error(`漫画生成エラー: ${imageError instanceof Error ? imageError.message : '不明なエラー'}`);
    }
    
    // 結果をまとめる
    // 注: 現在は1枚の画像にすべてのコマが含まれるため、contentには1つの要素だけ含まれる
    const generatedContent = [{
      imageUrl: comicImageUrl,
      dialogues: dialogues.flat(), // すべてのセリフをフラット化
      caption: prompt,
      isMultiPanel: true,
      panelCount: actualPanels
    }];
    
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
      panelDialogues: dialogues, // 各コマごとのセリフも返す
      message: `${actualPanels}コマの漫画が1枚の画像として生成されました。各コマには吹き出しが含まれています。`
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
