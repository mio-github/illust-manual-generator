/**
 * アプリケーション設定を管理するためのコンフィグユーティリティ
 * 環境変数から値を読み込み、デフォルト値を提供します
 */

// OpenAI LLM設定
export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  model: process.env.OPENAI_MODEL || 'gpt-4o',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
};

// 画像生成設定
export const imageGenerationConfig = {
  api: process.env.IMAGE_GENERATION_API || 'openai',
  model: process.env.IMAGE_GENERATION_MODEL || 'dall-e-3',
  quality: process.env.IMAGE_QUALITY || 'standard',
  size: process.env.IMAGE_SIZE || '1024x1024',
};

// アプリケーション全般設定
export const appConfig = {
  maxPanels: parseInt(process.env.MAX_PANELS || '6', 10),
  defaultPanels: parseInt(process.env.DEFAULT_PANELS || '4', 10),
  defaultStyle: process.env.DEFAULT_STYLE || 'default',
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