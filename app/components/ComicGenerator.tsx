'use client';

import { useState } from 'react';
import Image from 'next/image';
import TextEditor from './TextEditor';

interface ComicGeneratorProps {
  images: string[];
}

export default function ComicGenerator({ images }: ComicGeneratorProps) {
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [panelTexts, setPanelTexts] = useState<string[]>(Array(images.length).fill(''));
  
  const handleTextChange = (index: number, text: string) => {
    const newTexts = [...panelTexts];
    newTexts[index] = text;
    setPanelTexts(newTexts);
  };
  
  const handlePanelClick = (index: number) => {
    setSelectedPanel(index === selectedPanel ? null : index);
  };
  
  const handleDownload = () => {
    // 実際の実装では、ここで最終的な画像をダウンロードします
    alert('ダウンロード機能は近日実装予定です。');
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {images.map((imageUrl, index) => (
          <div 
            key={index}
            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${
              selectedPanel === index ? 'border-blue-500' : 'border-gray-200'
            }`}
            onClick={() => handlePanelClick(index)}
          >
            <div className="relative w-full h-64">
              <Image 
                src={imageUrl} 
                alt={`漫画コマ ${index + 1}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            {panelTexts[index] && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="bg-white bg-opacity-80 p-2 rounded text-center max-w-[80%]">
                  {panelTexts[index]}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedPanel !== null && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-2">テキスト編集 (コマ {selectedPanel + 1})</h3>
          <TextEditor 
            value={panelTexts[selectedPanel]} 
            onChange={(text) => handleTextChange(selectedPanel, text)} 
          />
        </div>
      )}
      
      <div className="flex justify-between">
        <button className="btn-secondary">
          やり直す
        </button>
        <button 
          className="btn-primary" 
          onClick={handleDownload}
        >
          画像として保存
        </button>
      </div>
    </div>
  );
}
