// 言語ごとのシステムプロンプト接頭辞
const languagePromptPrefix = {
  ja: 'あなたは日本語のイラスト制作のプロです。以下のタスクを日本語で行ってください。',
  en: 'You are a professional illustration creator. Please complete the following task in English only.',
  zh: '您是专业的插图创作者。请用中文完成以下任务。',
  ko: '당신은 전문 일러스트 제작자입니다. 다음 작업을 한국어로만 수행해 주세요.'
};

// 正規表現のsフラグを削除し、回避策として[\s\S]*を使用
const jsonRegex = /\[\s*\[[\s\S]*?\]\s*\]/;

以下の説明に基づいて、${panelCount}コマのイラストのセリフを${languageText}で生成してください。

// コンソールメッセージなどの変更
console.log('[マルチパネルイラスト生成開始]', {
// ...
console.log('[マルチパネルイラスト] 生成プロンプト:', enhancedPrompt);
// ...
console.error('[マルチパネルイラスト生成エラー]', error);
// ...
return `https://placehold.co/1024x1024?text=${encodeURIComponent('イラスト生成エラー')}`;

console.log('[セリフ付きイラスト生成開始]', {
// ...
console.log('[セリフ付きイラスト] 生成プロンプト:', enhancedPrompt);
// ...
console.error('[セリフ付きイラスト生成エラー]', error);
// ...
return `https://placehold.co/1024x1024?text=${encodeURIComponent('イラスト生成エラー')}`;

// 各関数のコメントなども置き換え
/**
 * 1枚の画像内に複数コマのレイアウトを持つイラストを生成する関数（セリフなし）
 */

/**
 * 1枚の画像内に複数コマのレイアウトを持つイラストを生成する関数（セリフ付き）
 */ 