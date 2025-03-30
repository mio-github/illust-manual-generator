import { openaiConfig, imageGenerationConfig } from './config';

// 言語オプション
export type SupportedLanguage = 'ja' | 'en' | 'zh' | 'ko';

export const languageNames = {
  ja: '日本語',
  en: '英語',
  zh: '中国語',
  ko: '韓国語'
};

// 言語ごとのシステムプロンプト接頭辞
const languagePromptPrefix = {
  ja: 'あなたは日本語のイラスト制作のプロです。以下のタスクを日本語で行ってください。',
  en: 'You are a professional illustration creator. Please complete the following task in English only.',
  zh: '您是专业的插图创作者。请用中文完成以下任务。',
  ko: '당신은 전문 일러스트 제작자입니다. 다음 작업을 한국어로만 수행해 주세요.'
};

// 言語ごとの指示強化文
const languageEnforcement = {
  ja: '必ず日本語だけで返答してください。出力は日本語以外の言語を含めないでください。',
  en: 'Please respond in English only. Do not include any other languages in your output.',
  zh: '请务必只用中文回答。输出中不要包含中文以外的语言。',
  ko: '반드시 한국어로만 답변해 주세요. 출력에 한국어 이외의 언어를 포함하지 마세요.'
};

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
    language?: SupportedLanguage;
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
    const language = options.language || 'ja';

    // 言語に応じたプロンプトの強化
    const enhancedPrompt = options.language 
      ? `${languagePromptPrefix[language]}\n\n${prompt}\n\n${languageEnforcement[language]}`
      : prompt;

    console.log('[テキスト生成開始]', { 
      model, 
      prompt: enhancedPrompt.substring(0, 50) + '...',
      maxTokens,
      temperature,
      language
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
        messages: [{ role: 'user', content: enhancedPrompt }],
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
 * @param language 生成する言語
 * @returns 生成されたセリフの配列
 */
export async function generateDialogues(
  prompt: string, 
  panelCount: number, 
  language: SupportedLanguage = 'ja'
): Promise<string[][]> {
  try {
    console.log('[セリフ生成開始]', { 
      prompt: prompt.substring(0, 50) + '...',
      panelCount,
      language
    });
    
    // 言語に応じたプロンプトの調整
    const languageText = language === 'ja' ? '日本語' : 
                         language === 'en' ? '英語' :
                         language === 'zh' ? '中国語' :
                         language === 'ko' ? '韓国語' : '日本語';
    
    const systemPrompt = `
      以下の説明に基づいて、${panelCount}コマのナビゲーションイラストのセリフを${languageText}で生成してください。
      各コマには1〜2人の登場人物のセリフを含めてください。
      セリフは${languageText}で、各コマの内容に合わせて連続性を持たせてください。
      最初のコマは導入、最後のコマは結論になるようにしてください。
      
      出力形式は必ず以下のJSON配列フォーマットのみを返してください。他の説明は一切不要です:
      [
        ["1コマ目の1人目のセリフ", "1コマ目の2人目のセリフ"],
        ["2コマ目の1人目のセリフ", "2コマ目の2人目のセリフ"],
        ...
      ]
      
      説明文: "${prompt}"
    `;
    
    console.log('[セリフ生成] テキスト生成API呼び出し準備完了');
    
    const result = await generateText(systemPrompt, { 
      temperature: 0.7, 
      maxTokens: 1000,
      language // 言語設定を渡す
    });
    
    console.log('[セリフ生成] APIレスポンス受信、解析開始', {
      responseLength: result.length,
      responsePreview: result.substring(0, 100) + '...'
    });
    
    // JSONとして解析を試みる
    try {
      // 結果から有効なJSONを抽出
      let jsonContent = result.trim();
      
      // JSONの先頭と末尾をチェック
      if (!jsonContent.startsWith('[')) {
        // JSONの開始を探す
        const startIdx = jsonContent.indexOf('[');
        if (startIdx >= 0) {
          jsonContent = jsonContent.substring(startIdx);
        } else {
          throw new Error('JSONの開始文字 "[" が見つかりません');
        }
      }
      
      if (!jsonContent.endsWith(']')) {
        // JSONの終了を探す
        const endIdx = jsonContent.lastIndexOf(']');
        if (endIdx >= 0) {
          jsonContent = jsonContent.substring(0, endIdx + 1);
        } else {
          throw new Error('JSONの終了文字 "]" が見つかりません');
        }
      }
      
      // パース試行
      console.log('[セリフ生成] 抽出されたJSON文字列:', jsonContent);
      const dialogues = JSON.parse(jsonContent);
      
      // バリデーション
      if (!Array.isArray(dialogues)) {
        throw new Error('JSONパースエラー: 結果が配列ではありません');
      }
      
      console.log('[セリフ生成完了]', { dialogues });
      return dialogues;
    } catch (parseError) {
      console.error('[セリフ解析エラー]', parseError, {
        responseText: result
      });
      
      // より強力なJSON抽出を試みる
      const jsonRegex = /\[\s*\[[\s\S]*?\]\s*\]/;
      const match = result.match(jsonRegex);
      
      if (match) {
        try {
          const extractedJson = match[0];
          console.log('[セリフ生成] 正規表現で抽出したJSON:', extractedJson);
          const dialogues = JSON.parse(extractedJson);
          return dialogues;
        } catch (e) {
          console.error('[セリフ生成] 正規表現で抽出したJSONのパースに失敗:', e);
        }
      }
      
      // 最終手段: テキストベースでの解析
      console.log('[セリフ生成] 代替解析方法を試行...');
      
      // 言語に応じたデフォルトセリフを生成
      const defaultDialogues = getDefaultDialogues(language, panelCount);
      console.log('[セリフ生成] デフォルトセリフを使用', { defaultDialogues });
      return defaultDialogues;
    }
  } catch (error) {
    console.error('[セリフ生成エラー]', error);
    // エラーの場合は言語に応じたデフォルトのセリフを返す
    const defaultDialogues = getDefaultDialogues(language, panelCount);
    console.log('[セリフ生成] デフォルトセリフを使用', { defaultDialogues });
    return defaultDialogues;
  }
}

/**
 * 言語に応じたデフォルトのセリフを返す
 */
function getDefaultDialogues(language: SupportedLanguage, panelCount: number): string[][] {
  if (language === 'en') {
    return Array.from({ length: panelCount }, (_, i) => {
      if (i === 0) return ['Hello', 'Let me tell you about this topic'];
      if (i === panelCount - 1) return ['That concludes our explanation', 'Thank you!'];
      return [`This is panel ${i+1}`, 'I see, that makes sense'];
    });
  } else if (language === 'zh') {
    return Array.from({ length: panelCount }, (_, i) => {
      if (i === 0) return ['你好', '让我告诉你这个话题'];
      if (i === panelCount - 1) return ['这就是我们的解释', '谢谢！'];
      return [`这是第${i+1}幅画`, '我明白了，有道理'];
    });
  } else if (language === 'ko') {
    return Array.from({ length: panelCount }, (_, i) => {
      if (i === 0) return ['안녕하세요', '이 주제에 대해 말씀드리겠습니다'];
      if (i === panelCount - 1) return ['설명이 끝났습니다', '감사합니다!'];
      return [`이것은 ${i+1}번째 패널입니다`, '이해했습니다, 말이 됩니다'];
    });
  } else {
    // デフォルトは日本語
    return Array.from({ length: panelCount }, (_, i) => {
      if (i === 0) return ['こんにちは', '今日はこの話をします'];
      if (i === panelCount - 1) return ['これで説明は終わりです', 'ありがとうございました'];
      return [`${i+1}コマ目のセリフです`, 'なるほど、わかりやすいです'];
    });
  }
}

/**
 * 吹き出しのみで画像を生成する関数（セリフなし）
 * @param prompt 画像生成のためのプロンプト
 * @param sceneDescription シーンの説明
 * @param options 画像生成オプション
 * @returns 生成された画像のURL
 */
export async function generateSceneWithoutText(
  prompt: string,
  sceneDescription: string,
  options: {
    model?: string;
    quality?: string;
    size?: string;
  } = {}
) {
  try {
    console.log('[シーン画像生成開始]', { 
      prompt: prompt.substring(0, 50) + '...',
      sceneDescription: sceneDescription.substring(0, 50) + '...'
    });
    
    // 特別なプロンプトを作成して、セリフなしで吹き出しのみを含む画像を生成
    const enhancedPrompt = `
      ${prompt}
      シーン説明: ${sceneDescription}
      
      重要: この画像には吹き出しを含めてください。ただし、吹き出しの中は空白にしてください。セリフは入れないでください。
      日本語漫画のスタイルで、単一のシーンとして描いてください。複数のコマは描かないでください。
      登場人物の表情から感情や状況が伝わるようにしてください。
    `.trim();
    
    return await generateImage(enhancedPrompt, options);
  } catch (error) {
    console.error('[シーン画像生成エラー]', error);
    // エラーの場合はプレースホルダー画像を返す
    return `https://placehold.co/600x400?text=${encodeURIComponent('シーン画像生成エラー')}`;
  }
}

/**
 * 複数の画像を合成して4コマ漫画レイアウトを作成する（実装予定）
 * @param imageUrls 画像URLの配列
 * @param dialogues セリフの配列
 * @param title タイトル
 * @returns 合成された画像のURL
 */
export async function composePanelsIntoComic(
  imageUrls: string[],
  dialogues: string[][],
  title: string = ''
): Promise<string> {
  // TODO: 実際にはCanvas APIやCloudinary等を使った画像合成処理を実装する
  console.log('[コマ合成] この機能は開発中です', {
    images: imageUrls.length,
    dialogues: dialogues.length,
    title
  });
  
  // 現在の実装では、ひとまず最初の画像を返す
  // 実際の実装では、ここで画像を取得して合成する処理を追加する
  return imageUrls[0] || `https://placehold.co/800x1000?text=${encodeURIComponent('コマ合成機能開発中')}`;
}

/**
 * 1枚の画像内に複数コマのレイアウトを持つイラストを生成する関数（セリフなし）
 * @param prompt ユーザーのプロンプト
 * @param panelCount コマ数
 * @param dialogues セリフの配列（セリフなしで吹き出しのみ生成するため参照のみ）
 * @param options 画像生成オプション
 * @returns 生成された画像のURL
 */
export async function generateMultiPanelComic(
  prompt: string,
  panelCount: number,
  dialogues: string[][],
  options: {
    model?: string;
    quality?: string;
    size?: string;
    style?: string;
  } = {}
) {
  try {
    console.log('[マルチパネルイラスト生成開始]', { 
      prompt: prompt.substring(0, 50) + '...',
      panelCount,
      dialoguesCount: dialogues.length
    });
    
    // 各コマの内容をまとめた説明を作成
    const panelDescriptions = dialogues.map((panelDialogues, index) => {
      const panelNum = index + 1;
      const dialogueContext = panelDialogues.join('、');
      return `コマ${panelNum}: 「${dialogueContext}」という会話`;
    }).join('\n');
    
    // 特別なプロンプトを作成
    const enhancedPrompt = `
      ${prompt} について、${panelCount}コマのナビゲーションイラストレイアウトを作成してください。
      
      【重要な指示 - 必ず守ってください】
      - 1枚の画像の中に${panelCount}コマのナビゲーションイラストレイアウトを作成してください
      - 各コマは明確に区切られ、順番がわかるようにしてください
      - 各コマには必ず空の吹き出しを含めてください（セリフは入れないでください）
      - 吹き出しは会話の流れが予想できる適切な位置に配置してください
      - 各コマには最低1つ、状況に応じて2〜3つの吹き出しを適切に配置してください
      - 吹き出しは中が空白で、後からテキストを入れられるように十分なスペースを確保してください
      - ${options.style || '日本のイラスト風'}のスタイルで、読みやすい構図にしてください
      - 各コマの内容は以下の通りです：
      ${panelDescriptions}
    `.trim();
    
    console.log('[マルチパネルイラスト] 生成プロンプト:', enhancedPrompt);
    
    // 画像サイズを調整（複数コマを含むためより大きく）
    const size = '1024x1024'; // 正方形で大きめのサイズを指定
    
    return await generateImage(enhancedPrompt, {
      ...options,
      size
    });
  } catch (error) {
    console.error('[マルチパネルイラスト生成エラー]', error);
    // エラーの場合はプレースホルダー画像を返す
    return `https://placehold.co/1024x1024?text=${encodeURIComponent('イラスト生成エラー')}`;
  }
}

/**
 * 1枚の画像内に複数コマのレイアウトを持つナビゲーションイラストを生成する関数（セリフ付き）
 */
export async function generateMultiPanelComicWithText(
  prompt: string,
  panelCount: number,
  dialogues: string[][],
  language: SupportedLanguage = 'ja',
  options: {
    model?: string;
    quality?: string;
    size?: string;
    style?: string;
  } = {}
) {
  try {
    console.log('[セリフ付きイラスト生成開始]', { 
      prompt: prompt.substring(0, 50) + '...',
      panelCount,
      dialoguesCount: dialogues.length,
      language
    });
    
    // 各コマの内容をまとめた説明を作成
    const panelDescriptions = dialogues.map((panelDialogues, index) => {
      const panelNum = index + 1;
      const dialogueTexts = panelDialogues.map((text, i) => 
        `${i === 0 ? '人物1' : '人物2'}: 「${text}」`
      ).join(' ');
      
      return `コマ${panelNum}: ${dialogueTexts}`;
    }).join('\n');
    
    // 言語に応じたスタイル指定
    const languageStyleText = 
      language === 'ja' ? '日本語イラスト' : 
      language === 'en' ? '英語のイラスト' :
      language === 'zh' ? '中国語のイラスト' :
      language === 'ko' ? '韓国語のイラスト' : 'イラスト';
    
    // セリフの言語を指定
    const languageName = 
      language === 'ja' ? '日本語' : 
      language === 'en' ? '英語' :
      language === 'zh' ? '中国語' :
      language === 'ko' ? '韓国語' : '日本語';
    
    // 特別なプロンプトを作成（セリフ付き）
    const enhancedPrompt = `
      ${languagePromptPrefix[language]}
      
      ${prompt} について、${panelCount}コマの${languageStyleText}を作成してください。
      
      【重要な指示 - 必ず守ってください】
      - 1枚の画像の中に${panelCount}コマのナビゲーションイラストレイアウトを作成してください
      - 各コマは明確に区切られ、順番がわかるようにしてください
      - 各コマには吹き出しを含め、その中に対応するセリフを${languageName}で明確に書き込んでください
      - 吹き出しの中のテキストは読みやすく、明確に表示してください
      - ${languageStyleText}のスタイルで、読みやすい構図にしてください
      - 絶対に${languageName}以外の言語は使用しないでください
      
      各コマの内容とセリフは以下の通りです：
      ${panelDescriptions}
      
      スタイル: ${options.style || 'シンプルで見やすいナビゲーションイラスト'}
      
      ${languageEnforcement[language]}
    `.trim();
    
    console.log('[セリフ付きイラスト] 生成プロンプト:', enhancedPrompt);
    
    // 画像サイズを調整（複数コマを含むためより大きく）
    const size = '1024x1024'; // 正方形で大きめのサイズを指定
    
    return await generateImage(enhancedPrompt, {
      ...options,
      size
    });
  } catch (error) {
    console.error('[セリフ付きイラスト生成エラー]', error);
    // エラーの場合はプレースホルダー画像を返す
    return `https://placehold.co/1024x1024?text=${encodeURIComponent('イラスト生成エラー')}`;
  }
}

