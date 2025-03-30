/**
 * アプリケーション設定を管理するためのコンフィグユーティリティ
 * 環境変数から値を読み込み、デフォルト値を提供します
 */

// 環境変数から設定を読み込む
const checkApiKey = () => {
  // クライアント側では環境変数にアクセスできないため、サーバー側でのみ実行
  if (typeof window !== 'undefined') {
    return undefined; // クライアント側では空値を返す
  }
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('警告: OPENAI_API_KEYが設定されていません。');
    return undefined;
  }
  
  if (apiKey.startsWith('sk-') && apiKey.length > 20) {
    console.log('OPENAI_API_KEY: 有効なフォーマットで設定されています');
    return apiKey;
  } else {
    console.error('警告: OPENAI_API_KEYが無効な形式です。「sk-」で始まるAPIキーを設定してください。');
    return apiKey; // 一応返します
  }
};

// OpenAI関連設定
export const openaiConfig = {
  apiKey: checkApiKey(),
  model: process.env.OPENAI_MODEL || 'gpt-4o', // デフォルトはGPT-4o
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
};

// 環境変数の設定状況をログ出力（サーバー側でのみ実行）
if (typeof window === 'undefined') {
  console.log('OpenAI設定情報:', {
    model: openaiConfig.model,
    maxTokens: openaiConfig.maxTokens,
    temperature: openaiConfig.temperature,
    apiKeyConfigured: openaiConfig.apiKey ? '設定済み' : '未設定'
  });
}

// 画像生成関連設定
export const imageGenerationConfig = {
  model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
  quality: process.env.OPENAI_IMAGE_QUALITY || 'standard', // standard or hd
  size: process.env.OPENAI_IMAGE_SIZE || '1024x1024', // 1024x1024, 1024x1792, or 1792x1024
};

// アプリケーション全般設定
export const appConfig = {
  defaultPanelCount: 4, // デフォルトのコマ数
  maxPanelCount: 6,     // 最大コマ数
  minPanelCount: 2,     // 最小コマ数
  defaultStyle: '日本のイラスト風', // デフォルトの画像スタイル
  allowedLanguages: ['ja', 'en', 'zh', 'ko'] as const, // 対応言語
  
  // デフォルトのイラストプロンプト詳細設定
  defaultStylePrompt: `明るく親しみやすい色合い、クリーンな線画、表情豊かで少しデフォルメされた「かわいい」キャラクター。ミニキャラ風のアニメタッチ。吹き出しは空白で、後からセリフを入れられる構成。背景はシンプルで、場面の雰囲気がわかる程度。全体的にポップで温かみのある雰囲気。`
};

// 環境変数のバリデーション
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 重要な環境変数が設定されているか確認
  if (!openaiConfig.apiKey) {
    errors.push('OPENAI_API_KEY が設定されていません');
  }

  // バリデーションの結果を返す
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 現在の設定をすべて返す
export const getAllConfig = () => ({
  openai: openaiConfig,
  imageGeneration: imageGenerationConfig,
  app: appConfig,
}); 