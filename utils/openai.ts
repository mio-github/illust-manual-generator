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
      console.error('[テキスト生成エラー] APIキーが設定されていません');
      throw new Error('OpenAI APIキーが設定されていません');
    }

    // オプションの設定 (デフォルト値はconfigから)
    const model = options.model || openaiConfig.model;
    const maxTokens = options.maxTokens || openaiConfig.maxTokens;
    const temperature = options.temperature || openaiConfig.temperature;

    console.log('[テキスト生成開始]', { 
      model, 
      prompt: prompt.substring(0, 50) + '...',
      maxTokens,
      temperature
    });

    console.log('[テキスト生成API呼び出し] リクエスト送信中...');
    const startTime = Date.now();
    
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

    const elapsedTime = Date.now() - startTime;
    console.log(`[テキスト生成API呼び出し] レスポンス受信 (${elapsedTime}ms)`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[テキスト生成API呼び出しエラー]', errorData);
      throw new Error(`OpenAI API エラー: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('[テキスト生成完了]', { 
      model: data.model,
      usage: data.usage,
      responseLength: data.choices[0].message.content.length
    });
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('[テキスト生成エラー]', error);
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
      console.error('[画像生成エラー] APIキーが設定されていません');
      throw new Error('OpenAI APIキーが設定されていません');
    }

    // オプションの設定
    const model = options.model || imageGenerationConfig.model;
    const quality = options.quality || imageGenerationConfig.quality;
    const size = options.size || imageGenerationConfig.size;

    console.log('[画像生成開始]', { 
      model, 
      prompt: prompt.substring(0, 50) + '...',
      quality,
      size
    });

    console.log('[画像生成API呼び出し] リクエスト送信中...');
    const startTime = Date.now();
    
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

    const elapsedTime = Date.now() - startTime;
    console.log(`[画像生成API呼び出し] レスポンス受信 (${elapsedTime}ms)`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[画像生成API呼び出しエラー]', errorData);
      throw new Error(`OpenAI API エラー: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    console.log('[画像生成完了]', { 
      imageUrl: imageUrl.substring(0, 100) + '...',
      revised_prompt: data.data[0].revised_prompt?.substring(0, 100) + '...'
    });
    
    return imageUrl;
  } catch (error) {
    console.error('[画像生成エラー]', error);
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
    console.log('[セリフ生成開始]', { 
      prompt: prompt.substring(0, 50) + '...',
      panelCount
    });
    
    const systemPrompt = `
      以下の説明に基づいて、${panelCount}コマの日本語の漫画のセリフを生成してください。
      各コマには1〜2人の登場人物のセリフを含めてください。
      セリフは日本語で、各コマの内容に合わせて連続性を持たせてください。
      最初のコマは導入、最後のコマは結論になるようにしてください。
      出力形式はJSON配列で、各コマのセリフを配列として返してください。
      例: [["こんにちは", "どうも"], ["説明します", "なるほど"], ...]
      
      説明文: "${prompt}"
    `;
    
    console.log('[セリフ生成] テキスト生成API呼び出し準備完了');
    
    const result = await generateText(systemPrompt, { 
      temperature: 0.7, 
      maxTokens: 1000 
    });
    
    console.log('[セリフ生成] APIレスポンス受信、解析開始', {
      responseLength: result.length,
      responsePreview: result.substring(0, 100) + '...'
    });
    
    try {
      // JSONとして解析を試みる
      let parsedResult = result;
      // 結果が直接JSONでない場合、JSON部分を抽出
      if (!result.trim().startsWith('[')) {
        const jsonMatch = result.match(/\[\s*\[.*\]\s*\]/);
        if (jsonMatch) {
          parsedResult = jsonMatch[0];
          console.log('[セリフ生成] JSON部分を抽出しました', {
            extractedJson: parsedResult.substring(0, 100) + '...'
          });
        } else {
          console.error('[セリフ生成] JSON形式のレスポンスが見つかりませんでした', {
            response: result
          });
          throw new Error('JSON形式のレスポンスが見つかりません');
        }
      }
      
      const dialogues = JSON.parse(parsedResult);
      console.log('[セリフ生成完了]', { dialogues });
      return dialogues;
    } catch (parseError) {
      console.error('[セリフ解析エラー]', parseError, {
        responseText: result
      });
      
      // 解析できない場合は、簡易的な処理でセリフを抽出
      console.log('[セリフ生成] 代替解析方法を試行...');
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
      
      console.log('[セリフ生成] 代替解析完了', { fallbackDialogues });
      return fallbackDialogues;
    }
  } catch (error) {
    console.error('[セリフ生成エラー]', error);
    // エラーの場合はデフォルトのセリフを返す
    const defaultDialogues = Array.from({ length: panelCount }, (_, i) => {
      if (i === 0) return ['こんにちは', '今日はこの話をします'];
      if (i === panelCount - 1) return ['これで説明は終わりです', 'ありがとうございました'];
      return [`${i+1}コマ目のセリフです`, 'なるほど、わかりやすいです'];
    });
    
    console.log('[セリフ生成] デフォルトセリフを使用', { defaultDialogues });
    return defaultDialogues;
  }
}
