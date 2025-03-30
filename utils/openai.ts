import { openaiConfig, imageGenerationConfig } from './config';

/**
 * OpenAI APIを使用してテキスト生成を行う関数
 * @param prompt ユーザーのプロンプト
 * @param options 追加オプション (maxTokens, temperature等)
 * @returns 生成されたテキスト
 */
export async function generateText(
  prompt: string, 
  options: { 
    maxTokens?: number; 
    temperature?: number;
    model?: string;
  } = {}
) {
  try {
    // 環境変数からAPIキーを取得
    const apiKey = openaiConfig.apiKey;
    if (!apiKey) {
      throw new Error('OpenAI APIキーが設定されていません');
    }

    // オプションの設定 (デフォルト値はconfigから)
    const model = options.model || openaiConfig.model;
    const maxTokens = options.maxTokens || openaiConfig.maxTokens;
    const temperature = options.temperature || openaiConfig.temperature;

    console.log('OpenAI API呼び出し: テキスト生成', { model, prompt: prompt.substring(0, 50) + '...' });

    // OpenAI APIを呼び出す
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API エラー: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('テキスト生成エラー:', error);
    throw error;
  }
}

/**
 * OpenAI APIを使用して画像生成を行う関数
 * @param prompt 画像生成のためのプロンプト
 * @param options 画像生成オプション
 * @returns 生成された画像のURL
 */
export async function generateImage(
  prompt: string,
  options: {
    model?: string;
    quality?: string;
    size?: string;
  } = {}
) {
  try {
    // 環境変数からAPIキーを取得
    const apiKey = openaiConfig.apiKey;
    if (!apiKey) {
      throw new Error('OpenAI APIキーが設定されていません');
    }

    // オプションの設定
    const model = options.model || imageGenerationConfig.model;
    const quality = options.quality || imageGenerationConfig.quality;
    const size = options.size || imageGenerationConfig.size;

    console.log('OpenAI API呼び出し: 画像生成', { 
      model, 
      prompt: prompt.substring(0, 50) + '...',
      quality,
      size
    });

    // 実際のAPI呼び出し
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        quality,
        size
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API エラー: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('画像生成エラー:', error);
    // エラーの場合はプレースホルダー画像を返す
    return `https://placehold.co/600x400?text=${encodeURIComponent('画像生成エラー')}`;
  }
}

/**
 * プロンプトに基づいてセリフを生成する関数
 * @param prompt プロンプト
 * @param panelCount コマ数
 * @returns 生成されたセリフの配列
 */
export async function generateDialogues(prompt: string, panelCount: number): Promise<string[][]> {
  try {
    console.log('セリフ生成の開始...', { prompt: prompt.substring(0, 50) + '...', panelCount });
    
    const systemPrompt = `
      以下の説明に基づいて、${panelCount}コマの日本語の漫画のセリフを生成してください。
      各コマには1〜2人の登場人物のセリフを含めてください。
      セリフは日本語で、各コマの内容に合わせて連続性を持たせてください。
      最初のコマは導入、最後のコマは結論になるようにしてください。
      出力形式はJSON配列で、各コマのセリフを配列として返してください。
      例: [["こんにちは", "どうも"], ["説明します", "なるほど"], ...]
      
      説明文: "${prompt}"
    `;
    
    const result = await generateText(systemPrompt, { 
      temperature: 0.7, 
      maxTokens: 1000 
    });
    
    try {
      // JSONとして解析を試みる
      let parsedResult = result;
      // 結果が直接JSONでない場合、JSON部分を抽出
      if (!result.trim().startsWith('[')) {
        const jsonMatch = result.match(/\[\s*\[.*\]\s*\]/);
        if (jsonMatch) {
          parsedResult = jsonMatch[0];
        } else {
          throw new Error('JSON形式のレスポンスが見つかりません');
        }
      }
      
      const dialogues = JSON.parse(parsedResult);
      console.log('セリフ生成完了:', dialogues);
      return dialogues;
    } catch (parseError) {
      console.error('セリフ解析エラー:', parseError, '原文:', result);
      // 解析できない場合は、簡易的な処理でセリフを抽出
      const fallbackDialogues = [];
      const lines = result.split('\n').filter((line: string) => line.trim().length > 0);
      
      for (let i = 0; i < panelCount; i++) {
        if (i < lines.length) {
          // 行からセリフっぽい部分を抽出
          const lineDialogues = lines[i].replace(/^[^「」]*/, '')
            .match(/「([^」]*)」/g)
            ?.map((d: string) => d.replace(/「|」/g, '')) || ['セリフ抽出エラー'];
          
          fallbackDialogues.push(lineDialogues);
        } else {
          fallbackDialogues.push(['...']);
        }
      }
      
      return fallbackDialogues;
    }
  } catch (error) {
    console.error('セリフ生成エラー:', error);
    // エラーの場合はデフォルトのセリフを返す
    return Array.from({ length: panelCount }, (_, i) => {
      if (i === 0) return ['こんにちは', '今日はこの話をします'];
      if (i === panelCount - 1) return ['これで説明は終わりです', 'ありがとうございました'];
      return [`${i+1}コマ目のセリフです`, 'なるほど、わかりやすいです'];
    });
  }
}
