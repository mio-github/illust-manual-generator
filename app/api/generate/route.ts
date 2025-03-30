import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/utils/config';
import { 
  generateDialogues, 
  generateSceneWithoutText, 
  composePanelsIntoComic,
  generateMultiPanelComic,
  generateMultiPanelComicWithText,
  SupportedLanguage
} from '@/utils/openai';

export async function POST(req: NextRequest) {
  // リクエストIDを生成（ログ追跡用）
  const requestId = Math.random().toString(36).substring(2, 10);
  
  try {
    console.log(`[${requestId}] イラスト生成API呼び出し開始`);
    
    // リクエストボディを取得
    const body = await req.json();
    const { 
      prompt, 
      panelCount = appConfig.defaultPanelCount, 
      style = appConfig.defaultStyle,
      language = 'ja',  // 言語設定（デフォルトは日本語）
      withText = false   // セリフを画像に含めるかどうか
    } = body;
    
    // 言語の検証
    const validLang = ['ja', 'en', 'zh', 'ko'].includes(language) ? language as SupportedLanguage : 'ja';
    
    console.log(`[${requestId}] リクエスト解析完了`, { 
      prompt, 
      panelCount, 
      style,
      language: validLang,
      withText,
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
    
    // リクエスト検証
    const panels = Number(panelCount) || appConfig.defaultPanelCount;

    // パネル数を有効な範囲に調整
    let actualPanels = panels;
    if (panels < appConfig.minPanelCount || panels > appConfig.maxPanelCount) {
      actualPanels = Math.min(Math.max(panels, appConfig.minPanelCount), appConfig.maxPanelCount);
      console.log(`[${requestId}] 指定されたコマ数(${panels})が範囲外のため、${actualPanels}コマに調整されました`);
    }

    console.log(`[${requestId}] イラスト生成処理を開始します`);
    console.log(`[${requestId}] プロンプト: ${prompt}`);
    console.log(`[${requestId}] コマ数: ${actualPanels}`);
    console.log(`[${requestId}] スタイル: ${style}`);
    console.log(`[${requestId}] 言語: ${validLang}`);
    console.log(`[${requestId}] セリフ表示: ${withText ? 'あり' : 'なし'}`);
    
    // 処理開始時間を記録
    const startTime = Date.now();
    
    // 1. 全体構成を考える - これは現在の実装では省略
    console.log(`[${requestId}] 1. 全体構成を検討中...`);
    
    // 2. コマ数分のシーンとセリフを生成
    console.log(`[${requestId}] 2. セリフとシーン構成の生成を開始...`);
    let dialogues;
    try {
      dialogues = await generateDialogues(prompt, actualPanels, validLang);
      console.log(`[${requestId}] セリフ生成完了: ${JSON.stringify(dialogues)}`);
    } catch (dialogueError) {
      console.error(`[${requestId}] セリフ生成中にエラーが発生しました`, dialogueError);
      throw new Error(`セリフ生成エラー: ${dialogueError instanceof Error ? dialogueError.message : '不明なエラー'}`);
    }
    
    // 3. イラスト画像の生成（セリフあり/なし）
    console.log(`[${requestId}] 3. イラスト画像の生成を開始...`);
    let comicImageUrl: string;

    try {
      if (withText) {
        // セリフ付きのイラストを生成
        console.log(`[${requestId}] セリフ付きイラスト生成を開始...`);
        comicImageUrl = await generateMultiPanelComicWithText(
          prompt,
          actualPanels,
          dialogues,
          validLang,
          { style }
        );
        console.log(`[${requestId}] セリフ付きイラスト生成完了:`, comicImageUrl.substring(0, 100) + '...');
      } else {
        // セリフなしのイラストを生成（吹き出しのみ）
        console.log(`[${requestId}] 吹き出し付きイラスト生成を開始...`);
        comicImageUrl = await generateMultiPanelComic(
          prompt,
          actualPanels,
          dialogues,
          { style }
        );
        console.log(`[${requestId}] 吹き出し付きイラスト生成完了:`, comicImageUrl.substring(0, 100) + '...');
      }
    } catch (imageError) {
      console.error(`[${requestId}] イラスト生成中にエラーが発生しました`, imageError);
      throw new Error(`イラスト生成エラー: ${imageError instanceof Error ? imageError.message : '不明なエラー'}`);
    }
    
    // 結果をまとめる
    const generatedContent = [{
      imageUrl: comicImageUrl,
      dialogues: dialogues.flat(), // すべてのセリフをフラット化
      caption: prompt,
      isMultiPanel: true,
      panelCount: actualPanels,
      withText: withText,
      language: validLang
    }];
    
    // 処理完了時間を計算
    const totalTime = Date.now() - startTime;
    console.log(`[${requestId}] イラスト生成完了: ${actualPanels}コマ, 所要時間: ${totalTime}ms`);
    
    // レスポンスを返す
    const response = { 
      success: true,
      content: generatedContent,
      panelCount: actualPanels,
      prompt,
      style,
      language: validLang,
      withText,
      processingTime: totalTime,
      panelDialogues: dialogues, // 各コマごとのセリフも返す
      message: `${actualPanels}コマのイラストが1枚の画像として生成されました。言語: ${validLang}, セリフ: ${withText ? 'あり' : 'なし'}`
    };
    
    console.log(`[${requestId}] イラスト生成API呼び出し完了`);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`[${requestId}] イラスト生成中に致命的なエラーが発生しました:`, error);
    
    // エラーメッセージの詳細を取得
    let errorMessage = 'イラスト生成中にエラーが発生しました';
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
