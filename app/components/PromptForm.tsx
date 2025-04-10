'use client';

import { useState } from 'react';

interface PromptFormProps {
  onSubmit: (data: { prompt: string; panels: number; style: string }) => void;
  isGenerating: boolean;
}

export default function PromptForm({ onSubmit, isGenerating }: PromptFormProps) {
  const [prompt, setPrompt] = useState('');
  const [panels, setPanels] = useState(4);
  const [style, setStyle] = useState('default');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    onSubmit({
      prompt,
      panels,
      style
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium mb-1">
          説明文
        </label>
        <textarea
          id="prompt"
          rows={5}
          className="input-field"
          placeholder="例: 電子マネー決済サービスの使い方を説明する漫画"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          具体的な説明を書くほど、より適切な漫画が生成されます
        </p>
      </div>
      
      <div className="mb-4">
        <label htmlFor="panels" className="block text-sm font-medium mb-1">
          コマ数 (最大6コマ)
        </label>
        <select
          id="panels"
          className="input-field"
          value={panels}
          onChange={(e) => setPanels(Number(e.target.value))}
          disabled={isGenerating}
        >
          <option value={1}>1コマ</option>
          <option value={2}>2コマ</option>
          <option value={3}>3コマ</option>
          <option value={4}>4コマ (デフォルト)</option>
          <option value={5}>5コマ</option>
          <option value={6}>6コマ</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label htmlFor="style" className="block text-sm font-medium mb-1">
          イラストスタイル
        </label>
        <select
          id="style"
          className="input-field"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          disabled={isGenerating}
        >
          <option value="default">標準</option>
          <option value="manga">マンガ風</option>
          <option value="simple">シンプル</option>
          <option value="cute">かわいい</option>
          <option value="business">ビジネス</option>
          <option value="technical">技術的</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? '生成中...' : '漫画を生成'}
      </button>
      
      {isGenerating && (
        <p className="text-sm text-center text-gray-600 mt-2">
          データを処理中です。しばらくお待ちください...
        </p>
      )}
    </form>
  );
}
