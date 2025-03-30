import { openaiConfig, imageGenerationConfig, appConfig } from './config';
import { 
  API_CONFIG, 
  APP_CONFIG, 
  LANGUAGE_CONFIG, 
  PROMPT_TEMPLATES, 
  ERROR_MESSAGES,
  SupportedLanguage 
} from './constants';

// 言語オプション
export type { SupportedLanguage };

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
  ja: '必ず日本語だけで返答してください。出力は画像も含めて日本語以外の言語を含めないでください。',
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
      throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
    }

    // オプションの設定 (デフォルト値はconfigから)
    const model = options.model || openaiConfig.model;
    const maxTokens = options.maxTokens || openaiConfig.maxTokens;
    const temperature = options.temperature || openaiConfig.temperature;
    const language = options.language || 'ja';

    // 言語に応じたプロンプトの強化
    const enhancedPrompt = options.language 
      ? `${LANGUAGE_CONFIG.PROMPT_PREFIX[language]}\n\n${prompt}\n\n${LANGUAGE_CONFIG.ENFORCEMENT[language]}`
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
    const response = await fetch(API_CONFIG.OPENAI.ENDPOINT, {
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
      throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
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
    const response = await fetch(API_CONFIG.OPENAI.IMAGE_ENDPOINT, {
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
 * @param language 生成する言語
 * @returns 生成されたセリフの配列
 */
export async function generateDialogues(
  prompt: string, 
  language: SupportedLanguage = 'ja'
): Promise<string[][]> {
  try {
    // デフォルトのコマ数を設定
    const panelCount = APP_CONFIG.PANEL.DEFAULT;
    
    console.log('[セリフ生成開始]', { 
      prompt: prompt.substring(0, 50) + '...',
      panelCount,
      language
    });
    
    // プロンプトテンプレートを使用
    const systemPrompt = PROMPT_TEMPLATES.GENERATE_DIALOGUES(prompt, panelCount, language);
    
    console.log('[セリフ生成] テキスト生成API呼び出し準備完了');
    
    const result = await generateText(systemPrompt, { 
      temperature: 0.7, 
      maxTokens: 1000,
      language // 言語設定を渡す
    });
    
    console.log('[セリフ生成] APIレスポンス受信、解析開始', {
      responseLength: result.length,
      responsePreview: result.substring(0, 200) + '...'
    });
    
    // JSONの抽出を試みる
    try {
      // JSONを抽出するための正規表現
      const jsonPattern = /```json\n([\s\S]*?)\n```|```([\s\S]*?)```|\[([\s\S]*?)\]/m;
      const match = result.match(jsonPattern);
      
      let jsonStr = '';
      if (match) {
        // マッチしたグループの中で、nullでないものを見つける
        for (let i = 1; i < match.length; i++) {
          if (match[i]) {
            jsonStr = match[i].trim();
            break;
          }
        }
      } else {
        // JSONパターンにマッチしない場合、結果全体をJSON文字列として扱う
        jsonStr = result.trim();
      }
      
      // 先頭が [ で始まらない場合、先頭に [ を追加
      if (!jsonStr.startsWith('[')) {
        jsonStr = '[' + jsonStr;
      }
      
      // 末尾が ] で終わらない場合、末尾に ] を追加
      if (!jsonStr.endsWith(']')) {
        jsonStr = jsonStr + ']';
      }
      
      console.log('[セリフ生成] 抽出されたJSON文字列:', jsonStr);
      
      // JSON文字列をパースしてオブジェクトに変換
      const dialogues = JSON.parse(jsonStr);
      
      // dialoguesが配列でない場合はエラー
      if (!Array.isArray(dialogues)) {
        throw new Error('生成されたレスポンスが配列ではありません');
      }
      
      // 各要素も配列であることを確認
      for (const dialogue of dialogues) {
        if (!Array.isArray(dialogue)) {
          throw new Error('生成されたセリフのフォーマットが不正です');
        }
      }
      
      // パネル数を調整（最小と最大の範囲内に収める）
      const adjustedDialogues = dialogues.slice(0, Math.min(dialogues.length, APP_CONFIG.PANEL.MAX));
      
      console.log('[セリフ生成完了]', { dialogues: adjustedDialogues });
      
      return adjustedDialogues;
    } catch (parseError) {
      console.error('[セリフ生成] JSONパース失敗:', parseError);
      throw new Error(ERROR_MESSAGES.DIALOGUE_GENERATION_FAILED);
    }
  } catch (error) {
    console.error('[セリフ生成エラー]', error);
    throw error;
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
    
    // プロンプトテンプレートを使用
    const enhancedPrompt = PROMPT_TEMPLATES.GENERATE_SCENE_WITHOUT_TEXT(prompt, sceneDescription);
    
    return await generateImage(enhancedPrompt, options);
  } catch (error) {
    console.error('[シーン画像生成エラー]', error);
    // エラーの場合はプレースホルダー画像を返す
    return `https://placehold.co/600x400?text=${encodeURIComponent('シーン画像生成エラー')}`;
  }
}

/**
 * 複数の画像を合成して1つのコミックにする関数（実装例）
 * @param imageUrls 画像URLの配列
 * @param options 合成オプション
 * @returns 合成された画像のURL
 */
export async function composePanelsIntoComic(
  imageUrls: string[],
  options: {
    layout?: 'grid' | 'vertical' | 'horizontal';
    panelsPerRow?: number;
  } = {}
) {
  // この例ではクライアント側でHTMLを使って画像を合成すると仮定
  // 実際の実装は環境によって異なります
  console.log('[コミック合成] 実装が必要です');
  
  // 仮の実装として、最初の画像を返す
  return imageUrls[0] || `https://placehold.co/600x800?text=${encodeURIComponent('コミック合成')}`;
}

/**
 * 1枚の画像内に複数コマのレイアウトを持つイラストを生成する関数（セリフなし）
 * @param prompt ユーザーのプロンプト
 * @param dialogues セリフの配列（セリフなしで吹き出しのみ生成するため参照のみ）
 * @param options 画像生成オプション
 * @returns 生成された画像のURL
 */
export async function generateMultiPanelComic(
  prompt: string,
  dialogues: string[][],
  options: {
    model?: string;
    quality?: string;
    size?: string;
    style?: string;
    language?: SupportedLanguage;
  } = {}
) {
  try {
    // 対話の数に基づいて適切なコマ数を決定
    const panelCount = dialogues.length;
    // 言語設定（デフォルトは日本語）
    const language = options.language || 'ja';
    
    console.log('[マルチパネルイラスト生成開始]', { 
      prompt: prompt.substring(0, 50) + '...',
      panelCount,
      dialoguesCount: dialogues.length,
      language
    });
    
    // 各コマの内容をまとめた説明を作成
    const panelDescriptions = dialogues.map((panelDialogues, index) => {
      const panelNum = index + 1;
      const dialogueContext = panelDialogues.join('、');
      return `コマ${panelNum}: 「${dialogueContext}」という会話`;
    }).join('\n');
    
    // スタイル設定
    const style = options.style || APP_CONFIG.STYLE.DEFAULT;
    const stylePrompt = APP_CONFIG.STYLE.PROMPTS.DEFAULT;
    
    // プロンプトテンプレートを使用
    const enhancedPrompt = PROMPT_TEMPLATES.GENERATE_MULTI_PANEL_COMIC(
      prompt,
      panelCount,
      panelDescriptions,
      style,
      stylePrompt,
      language
    );
    
    console.log('[マルチパネルイラスト] 生成プロンプト:', enhancedPrompt);
    
    // 画像サイズを調整（複数コマを含むためより大きく）
    const size = API_CONFIG.IMAGE.DEFAULT_SIZE;
    
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
 * セリフも含めて生成する関数（イラスト生成→セリフ生成を一括して行う）
 * @param prompt ユーザーのプロンプト
 * @param options 生成オプション
 * @returns 生成された画像URLとセリフのペア
 */
export async function generateMultiPanelComicWithText(
  prompt: string,
  options: {
    panelCount?: number;
    model?: string;
    quality?: string;
    size?: string;
    style?: string;
    language?: SupportedLanguage;
  } = {}
) {
  try {
    // 言語設定（デフォルトは日本語）
    const language = options.language || 'ja';
    // パネル数を設定
    const requestedPanelCount = options.panelCount || APP_CONFIG.PANEL.DEFAULT;
    // 有効な範囲に調整
    const panelCount = Math.max(
      APP_CONFIG.PANEL.MIN, 
      Math.min(requestedPanelCount, APP_CONFIG.PANEL.MAX)
    );
    
    // まずセリフを生成
    console.log('[セリフ生成開始]', { prompt: prompt.substring(0, 50) + '...' });
    const dialogues = await generateDialogues(prompt, language);
    
    // イラスト生成（セリフなしでコマ割り画像を生成）
    console.log('[イラスト生成開始]', { dialogueCount: dialogues.length });
    const imageUrl = await generateMultiPanelComic(prompt, dialogues, {
      ...options,
      language,
    });
    
    // 結果を返す
    return {
      imageUrl,
      dialogues,
      language,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('[イラスト生成エラー]', error);
    throw new Error(ERROR_MESSAGES.GENERATION_FAILED);
  }
}

