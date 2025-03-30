'use client';

import { useState } from 'react';
import Image from 'next/image';
import TextEditor from './TextEditor';

interface Panel {
  imageUrl: string;
  dialogues: string[];
  caption: string;
  isMultiPanel?: boolean;
  panelCount?: number;
}

interface ComicGeneratorProps {
  content: Panel[];
  panelDialogues?: string[][];
}

export default function ComicGenerator({ content, panelDialogues }: ComicGeneratorProps) {
  const firstPanel = content[0];
  const isMultiPanelComic = firstPanel?.isMultiPanel;
  const panelCount = firstPanel?.panelCount || content.length;
  
  // マルチパネルの場合は、panelDialoguesを使用
  // 個別パネルの場合は、各パネルからdialogudesを抽出
  const dialogues = isMultiPanelComic 
    ? (panelDialogues || [])
    : content.map(panel => panel.dialogues);
  
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [panelTexts, setPanelTexts] = useState<string[]>(
    dialogues.map(d => d.join('\n'))
  );
  const [showCaptions, setShowCaptions] = useState(true);
  
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
    console.log('ダウンロードリクエスト:', { 
      content, 
      editedTexts: panelTexts,
      isMultiPanelComic
    });
    alert('ダウンロード機能は近日実装予定です。');
  };
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">漫画プレビュー ({panelCount}コマ)</h2>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={showCaptions}
              onChange={() => setShowCaptions(!showCaptions)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-2 text-sm font-medium text-gray-700">キャプション表示</span>
          </label>
        </div>
      </div>
      
      {isMultiPanelComic ? (
        // マルチパネル漫画の表示（1枚の画像にすべてのコマが含まれる）
        <div className="mb-6">
          <div className="relative border-2 rounded-lg overflow-hidden">
            <div className="relative w-full h-96 md:h-[600px]">
              <Image 
                src={firstPanel.imageUrl} 
                alt="マルチパネル漫画"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            
            {/* キャプション表示 */}
            {showCaptions && firstPanel.caption && (
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 p-2 text-white text-sm">
                {firstPanel.caption}
              </div>
            )}
          </div>
        </div>
      ) : (
        // 個別パネルの表示（従来の表示方法）
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {content.map((panel, index) => (
            <div 
              key={index}
              className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${
                selectedPanel === index ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => handlePanelClick(index)}
            >
              <div className="relative w-full h-64">
                <Image 
                  src={panel.imageUrl} 
                  alt={`漫画コマ ${index + 1}`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              
              {/* セリフ表示エリア */}
              {panelTexts[index] && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                  <div className="bg-white bg-opacity-80 p-2 rounded text-center max-w-[80%] shadow-md">
                    {panelTexts[index].split('\n').map((line, i) => (
                      <div key={i} className={i > 0 ? 'mt-2' : ''}>{line}</div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* コマ番号表示 */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              {/* キャプション表示 */}
              {showCaptions && panel.caption && (
                <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 p-2 text-white text-sm">
                  {panel.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* セリフ編集エリア */}
      <div className="card p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">セリフ編集</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dialogues.map((panelDialogues, index) => (
            <div key={index} className="border rounded p-3">
              <h4 className="font-medium mb-2">コマ {index + 1}</h4>
              <TextEditor 
                value={panelTexts[index]}
                onChange={(text) => handleTextChange(index, text)}
                className="min-h-[100px]"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="btn-secondary"
          onClick={() => {
            // 元のセリフに戻す
            const originalTexts = dialogues.map(d => d.join('\n'));
            setPanelTexts(originalTexts);
            console.log('セリフをリセットしました');
          }}
        >
          セリフをリセット
        </button>
        <button 
          className="btn-primary" 
          onClick={handleDownload}
        >
          画像として保存
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        ※ 画像の編集や保存は開発中の機能です。現在のバージョンでは制限があります。
      </p>
    </div>
  );
}
