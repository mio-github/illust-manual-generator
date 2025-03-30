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
import { checkApiKey } from '@/utils/config';

// hobbyプランでは60秒が上限
export const maxDuration = 60; // 1 minute timeout

export async function POST(req: NextRequest) {
  // リクエストIDを生成（ログ追跡用）
  const requestId = Math.random().toString(36).substring(2, 10);
  
  // 処理開始時間を記録
  const startTime = Date.now();
  
  // APIキーのチェック
  const apiKey = checkApiKey();
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'OpenAI API Keyが設定されていません。「.env.local」ファイルにOPENAI_API_KEYを設定してください。' 
    }, { status: 400 });
  }
  
  try {
    console.log(`[${requestId}] イラスト生成API呼び出し開始`);
    
    // リクエストボディを取得
    const body = await req.json();
    const { 
      prompt, 
      dialogueOption,
      style = appConfig.defaultStyle,
      language = 'ja'  // 言語設定（デフォルトは日本語）
    } = body;
    
    // 言語の検証
    const validLang = ['ja', 'en', 'zh', 'ko'].includes(language) ? language as SupportedLanguage : 'ja';
    
    console.log(`[${requestId}] リクエスト解析完了`, { 
      prompt, 
      dialogueOption,
      style,
      language: validLang,
      timestamp: new Date().toISOString()
    });

    // バリデーション
    if (!prompt || prompt.trim() === '') {
      console.error(`[${requestId}] バリデーションエラー: プロンプトが空です`);
      return NextResponse.json(
        { error: 'プロンプトは必須です' },
        { status: 400 }
      );
    }
    
    // 対話生成
    console.log(`[${requestId}] セリフ生成開始: ${prompt.substring(0, 30) + '...'}`);
    
    // オプションに応じてセリフ生成
    let dialogues: string[][] = [];
    
    if (dialogueOption !== '吹き出しなし') {
      const generatedDialogues = await generateDialogues(prompt, validLang);
      
      if (!generatedDialogues || generatedDialogues.length === 0) {
        console.error(`[${requestId}] セリフ生成に失敗しました`);
        return NextResponse.json({ error: 'セリフ生成に失敗しました' }, { status: 500 });
      }
      
      dialogues = generatedDialogues;
    } else {
      // 吹き出しなしの場合は空のセリフを設定（コマ数は4固定）
      dialogues = [[''], [''], [''], ['']];
    }
    
    // セリフの生成が成功したら、画像を生成
    console.log(`[${requestId}] イラスト生成開始`, { dialogueCount: dialogues.length });
    
    let imageUrl;
    
    // dialogueOptionによって処理を分岐
    if (dialogueOption === 'セリフあり（画像に焼き付け）') {
      // セリフを焼き付けて画像生成
      imageUrl = await generateMultiPanelComicWithText(prompt, dialogues, validLang, { style });
    } else {
      // セリフなしまたはUIで表示するモードの場合（セリフを焼き付けない）
      imageUrl = await generateMultiPanelComic(prompt, dialogues, { 
        style,
        language: validLang
      });
    }
    
    // 結果をまとめる
    const generatedContent = [{
      imageUrl,
      dialogues: dialogues.flat(), // すべてのセリフをフラット化
      caption: prompt,
      isMultiPanel: true,
      panelCount: dialogues.length,
      withText: dialogueOption !== '吹き出しなし',
      language: validLang
    }];
    
    // 処理完了時間を計算
    const totalTime = Date.now() - startTime;
    console.log(`[${requestId}] イラスト生成完了: ${dialogues.length}コマ, 所要時間: ${totalTime}ms`);
    
    // レスポンスを返す
    const response = { 
      success: true,
      content: generatedContent,
      panelCount: dialogues.length,
      prompt,
      style,
      language: validLang,
      withText: dialogueOption !== '吹き出しなし',
      processingTime: totalTime,
      panelDialogues: dialogues, // 各コマごとのセリフも返す
      message: `${dialogues.length}コマのイラストが1枚の画像として生成されました。言語: ${validLang}, セリフ: ${dialogueOption !== '吹き出しなし' ? 'あり' : 'なし'}`
    };
    
    console.log(`[${requestId}] イラスト生成API呼び出し完了`);
    return NextResponse.json(response);
    
  } catch (error: any) {
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
