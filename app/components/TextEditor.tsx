'use client';

import { useState, useEffect } from 'react';

interface TextEditorProps {
  value: string;
  onChange: (text: string) => void;
}

export default function TextEditor({ value, onChange }: TextEditorProps) {
  const [text, setText] = useState(value);
  
  useEffect(() => {
    setText(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange(newText);
  };
  
  return (
    <div>
      <textarea
        className="input-field mb-4"
        rows={3}
        value={text}
        onChange={handleChange}
        placeholder="ここにセリフやテキストを入力してください"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">フォントサイズ</label>
          <select className="input-field">
            <option value="small">小</option>
            <option value="medium" selected>中</option>
            <option value="large">大</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">フォントスタイル</label>
          <select className="input-field">
            <option value="normal" selected>標準</option>
            <option value="bold">太字</option>
            <option value="italic">斜体</option>
          </select>
        </div>
      </div>
    </div>
  );
}
