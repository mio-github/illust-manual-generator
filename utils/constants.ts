/**
 * アプリケーション全体の定数設定ファイル
 * 設定値、プロンプトテンプレート、スタイル定義などを一元管理します
 */

// 対応言語
export type SupportedLanguage = 'ja' | 'en' | 'zh' | 'ko';

// API設定
export const API_CONFIG = {
  // OpenAI基本設定（環境変数から取得）
  OPENAI: {
    DEFAULT_MODEL: 'gpt-4o',
    DEFAULT_MAX_TOKENS: 1000,
    DEFAULT_TEMPERATURE: 0.7,
    ENDPOINT: 'https://api.openai.com/v1/chat/completions',
    IMAGE_ENDPOINT: 'https://api.openai.com/v1/images/generations',
  },
  
  // 画像生成設定
  IMAGE: {
    DEFAULT_MODEL: 'dall-e-3',
    DEFAULT_QUALITY: 'hd',
    DEFAULT_SIZE: '1024x1024',
    ALTERNATIVE_SIZES: ['1024x1792', '1792x1024'],
  },
  
  // リクエスト制限
  REQUEST_LIMITS: {
    MAX_DURATION: 60, // Vercel Hobbyプランでの秒数制限
    MAX_RETRIES: 3,  // API呼び出し時の最大リトライ回数
    RETRY_DELAY: 1000, // リトライ間隔（ミリ秒）
  }
};

// アプリケーション設定
export const APP_CONFIG = {
  // コマ数設定
  PANEL: {
    DEFAULT: 4,
    MIN: 2,
    MAX: 6,
  },
  
  // イラストスタイル定義
  STYLE: {
    DEFAULT: 'シンプルで見やすいイラスト風',
    OPTIONS: [
      { id: 'default', name: '標準', description: 'バランスの取れた標準的なイラスト' },
      { id: 'manga', name: 'マンガ風', description: '日本の漫画テイストのイラスト' },
      { id: 'simple', name: 'シンプル', description: 'シンプルで見やすいイラスト' },
      { id: 'cute', name: 'かわいい', description: 'かわいらしいキャラクターのイラスト' },
      { id: 'business', name: 'ビジネス', description: 'ビジネスシーン向けのイラスト' },
      { id: 'technical', name: '技術的', description: '図解・テクニカルイラスト' },
    ],
    
    // スタイルごとの詳細プロンプト
    PROMPTS: {
      DEFAULT: 'モノトーンに近い落ち着いた色合い、クリーンでシンプルな線画、わかりやすい表情の人物。複雑な背景や余計な装飾は避け、説明内容に集中したミニマルなイラスト。全体的に視認性を重視し、情報が伝わりやすい構図。',
      MANGA: '日本の漫画スタイルで、はっきりとした線画、表情豊かなキャラクター、効果的な背景。感情が伝わりやすい誇張表現を使用。白黒のコマ割りが特徴的なデザイン。',
      SIMPLE: '最小限の線で描かれたシンプルなイラスト。不要な詳細は省略し、主要な情報のみを伝える。クリアな配色と単純な形状で視認性を最大化。',
      CUTE: '丸みのあるデザイン、明るいパステルカラー、大きな目と頭のキャラクター。愛らしさを重視した表現で、親しみやすく楽しい印象を与える。',
      BUSINESS: 'プロフェッショナルな印象のオフィスシーン。ビジネスカジュアルな服装のキャラクター、整理された環境。フォーマルながらも親しみやすいデザイン。',
      TECHNICAL: '図解的要素が強く、情報伝達を重視したイラスト。矢印や番号などを使った説明的な構成。正確性と明瞭さを優先したデザイン。',
    }
  },
  
  // 吹き出しスタイル定義
  BUBBLE: {
    DEFAULT: {
      fontFamily: "'Kosugi Maru', 'M PLUS Rounded 1c', sans-serif",
      fontSize: 16,
      fontWeight: 'bold',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1rem',
      borderColor: '#333',
      borderWidth: 2,
      padding: '0.5rem',
      color: '#333'
    },
    STYLES: [
      { id: 'normal', name: '標準', borderRadius: '1rem', borderWidth: 2 },
      { id: 'round', name: '丸型', borderRadius: '2rem', borderWidth: 2 },
      { id: 'square', name: '角型', borderRadius: '0.25rem', borderWidth: 2 },
      { id: 'cloud', name: '雲型', borderRadius: '1rem 1rem 1rem 0', borderWidth: 2 },
      { id: 'think', name: '思考', borderRadius: '1rem', borderStyle: 'dotted', borderWidth: 2 },
    ],
    FONTS: [
      { id: 'default', name: 'デフォルト', fontFamily: "'Kosugi Maru', 'M PLUS Rounded 1c', sans-serif" },
      { id: 'gothic', name: 'ゴシック', fontFamily: "'Noto Sans JP', sans-serif" },
      { id: 'mincho', name: '明朝体', fontFamily: "'Noto Serif JP', serif" },
      { id: 'rounded', name: '丸ゴシック', fontFamily: "'M PLUS Rounded 1c', sans-serif" },
      { id: 'handwriting', name: '手書き', fontFamily: "'Yusei Magic', sans-serif" },
    ],
    FONT_SIZES: [
      { id: 'small', name: '小', size: 14 },
      { id: 'medium', name: '中', size: 16 },
      { id: 'large', name: '大', size: 18 },
    ]
  }
};

// 言語関連設定
export const LANGUAGE_CONFIG = {
  // 言語ごとのシステムプロンプト接頭辞
  PROMPT_PREFIX: {
    ja: 'あなたは日本語のイラスト制作のプロです。以下のタスクを日本語で行ってください。',
    en: 'You are a professional illustration creator. Please complete the following task in English only.',
    zh: '您是专业的插图创作者。请用中文完成以下任务。',
    ko: '당신은 전문 일러스트 제작자입니다. 다음 작업을 한국어로만 수행해 주세요.'
  },

  // 言語ごとの指示強化文
  ENFORCEMENT: {
    ja: '必ず日本語だけで返答してください。出力は画像も含めて日本語以外の言語を含めないでください。',
    en: 'Please respond in English only. Do not include any other languages in your output.',
    zh: '请务必只用中文回答。输出中不要包含中文以外的语言。',
    ko: '반드시 한국어로만 답변해 주세요. 출력에 한국어 이외의 언어를 포함하지 마세요.'
  },
  
  // 言語ごとの表示名
  DISPLAY_NAMES: {
    ja: '日本語',
    en: '英語',
    zh: '中国語',
    ko: '韓国語'
  }
};

// プロンプトテンプレート
export const PROMPT_TEMPLATES = {
  // セリフ生成用テンプレート
  GENERATE_DIALOGUES: (prompt: string, panelCount: number, language: SupportedLanguage) => {
    const languageText = LANGUAGE_CONFIG.DISPLAY_NAMES[language];
    
    return `
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
  },
  
  // マルチパネル漫画生成用テンプレート
  GENERATE_MULTI_PANEL_COMIC: (
    prompt: string,
    panelCount: number, 
    panelDescriptions: string, 
    style: string,
    stylePrompt: string,
    language: SupportedLanguage
  ) => {
    const languagePrefix = LANGUAGE_CONFIG.PROMPT_PREFIX[language];
    const languageEnforcement = LANGUAGE_CONFIG.ENFORCEMENT[language];
    const languageName = LANGUAGE_CONFIG.DISPLAY_NAMES[language];
    const languageStyleText = `${languageName}イラスト`;
    
    return `
      ${languagePrefix}
      
      ${prompt} について、最適な数のコマで表現する${languageStyleText}レイアウトを作成してください。
      
      【重要な指示 - 必ず守ってください】
      - 1枚の画像の中に${panelCount}コマのナビゲーションイラストレイアウトを作成してください
      - 各コマは明確に区切られ、順番がわかるようにしてください
      - 吹き出しは一切含めないでください
      - 後から吹き出しとセリフを別途追加するため、会話ができるスペースを各コマに確保してください
      - 各コマの人物は会話しているように、表情豊かに描いてください
      - すべてのテキストは${languageName}で表示してください
      - ${languageStyleText}のスタイルで、読みやすい構図にしてください
      - スタイル: ${style}
      - スタイル詳細: ${stylePrompt}
      - 各コマの内容は以下の通りです：
      ${panelDescriptions}
      
      ${languageEnforcement}
    `;
  },
  
  // シーン画像生成用テンプレート（セリフなし）
  GENERATE_SCENE_WITHOUT_TEXT: (prompt: string, sceneDescription: string) => {
    return `
      ${prompt}
      シーン説明: ${sceneDescription}
      
      重要: この画像には吹き出しを含めてください。ただし、吹き出しの中は空白にしてください。セリフは入れないでください。
      日本語漫画のスタイルで、単一のシーンとして描いてください。複数のコマは描かないでください。
      登場人物の表情から感情や状況が伝わるようにしてください。
    `;
  }
};

// エラーメッセージ
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'OpenAI API Keyが設定されていません。Vercel環境変数または「.env.local」ファイルにOPENAI_API_KEYを設定してください。',
  PROMPT_REQUIRED: 'プロンプトは必須です',
  GENERATION_FAILED: '生成処理中にエラーが発生しました。もう一度お試しください。',
  IMAGE_GENERATION_FAILED: 'イラスト生成に失敗しました。しばらく待ってから再試行してください。',
  DIALOGUE_GENERATION_FAILED: 'セリフ生成に失敗しました。プロンプトを変更して再試行してください。',
  INVALID_FORMAT: '不正なフォーマットです。正しい形式で入力してください。',
  SESSION_EXPIRED: 'セッションの有効期限が切れました。再度ログインしてください。',
}; 