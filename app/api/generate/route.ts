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
import { 
  API_CONFIG, 
  APP_CONFIG, 
  ERROR_MESSAGES 
} from '@/utils/constants';

// hobbyプランでは60秒が上限
export const maxDuration = API_CONFIG.REQUEST_LIMITS.MAX_DURATION;

export async function POST(req: NextRequest) {
  // リクエストIDを生成（ログ追跡用）
  const requestId = Math.random().toString(36).substring(2, 10);
  
  // 処理開始時間を記録
  const startTime = Date.now();
  
  // APIキーのチェック - Vercel環境変数を優先する
  const apiKey = process.env.VERCEL_ENV 
    ? process.env.OPENAI_API_KEY // Vercel環境でのAPIキー
    : checkApiKey(); // ローカル環境でのAPIキー

  if (!apiKey) {
    console.error(`[${requestId}] APIキーが設定されていません (環境: ${process.env.VERCEL_ENV || 'local'})`);
    return NextResponse.json({ 
      error: ERROR_MESSAGES.API_KEY_MISSING
    }, { status: 400 });
  } else {
    // APIキーの末尾を表示してデバッグに役立てる
    const lastSixChars = apiKey.slice(-6);
    console.log(`[${requestId}] 使用するAPIキー末尾6文字: ${lastSixChars} (環境: ${process.env.VERCEL_ENV || 'local'})`);
  }
  
  try {
    console.log(`[${requestId}] イラスト生成API呼び出し開始`);
    
    // リクエストボディを取得
    const body = await req.json();
    const { 
      prompt, 
      dialogueOption,
      style = APP_CONFIG.STYLE.DEFAULT,
      language = 'ja'  // 言語設定（デフォルトは日本語）
    } = body;
    
    // 言語の検証
    const validLang = APP_CONFIG.PANEL.DEFAULT ? language as SupportedLanguage : 'ja';
    
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
        { error: ERROR_MESSAGES.PROMPT_REQUIRED },
        { status: 400 }
      );
    }
    
    // 対話生成
    console.log(`[${requestId}] セリフ生成開始: ${prompt.substring(0, 30) + '...'}`);
    
    // オプションに応じてセリフ生成
    let dialogues: string[][] = [];
    
    if (dialogueOption === 'auto') {
      // 自動セリフ生成
      const generatedDialogues = await generateDialogues(prompt, validLang);
      dialogues = generatedDialogues;
    } else if (dialogueOption === 'none') {
      // セリフなし（空の配列）
      dialogues = Array.from({ length: APP_CONFIG.PANEL.DEFAULT }, () => ['', '']);
    }
    
    // イラスト生成
    console.log(`[${requestId}] イラスト生成開始`, { dialogueCount: dialogues.length });
    
    // 処理時間計測開始
    const genStartTime = Date.now();
    
    // セリフなしで複数コマのイラストを生成
    const imageUrl = await generateMultiPanelComic(prompt, dialogues, {
      quality: 'hd',
      style: style,
      language: validLang
    });
    
    // 処理時間計測終了
    const genElapsedTime = Date.now() - genStartTime;
    console.log(`[${requestId}] イラスト生成完了: ${dialogues.length}コマ, 所要時間: ${genElapsedTime}ms`);
    
    // 全体の処理時間
    const totalElapsedTime = Date.now() - startTime;
    console.log(`[${requestId}] イラスト生成API呼び出し完了`, { totalTime: totalElapsedTime });
    
    // レスポンスを返す
    return NextResponse.json({
      imageUrl,
      dialogues,
      panelCount: dialogues.length,
      language: validLang,
      generatedAt: new Date().toISOString(),
      elapsedTime: totalElapsedTime
    });
  } catch (error) {
    console.error('イラスト生成エラー:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
