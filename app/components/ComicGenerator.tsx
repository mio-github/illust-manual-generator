'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import TextEditor from './TextEditor';
import { SupportedLanguage } from '@/utils/openai';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

interface Panel {
  imageUrl: string;
  dialogues: string[];
  caption: string;
  isMultiPanel?: boolean;
  panelCount?: number;
  withText?: boolean;
  language?: SupportedLanguage;
}

interface BubblePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  color: string;
}

interface ComicProject {
  id: string;
  name: string;
  imageUrl: string;
  bubblePositions: BubblePosition[];
  createdAt: string;
  updatedAt: string;
}

interface ComicGeneratorProps {
  content: Panel[];
  panelDialogues?: string[][];
}

export default function ComicGenerator({ content, panelDialogues }: ComicGeneratorProps) {
  const firstPanel = content[0];
  const isMultiPanelComic = firstPanel?.isMultiPanel;
  const panelCount = firstPanel?.panelCount || content.length;
  const withText = firstPanel?.withText ?? true;
  const language = firstPanel?.language || 'ja';
  
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
  
  // 吹き出し位置の編集用
  const [editMode, setEditMode] = useState(true);
  const comicRef = useRef<HTMLDivElement>(null);
  const [bubblePositions, setBubblePositions] = useState<BubblePosition[]>([]);
  
  // プロジェクト関連
  const [projectName, setProjectName] = useState(`Comic-${new Date().toISOString().slice(0, 10)}`);
  const [savedProjects, setSavedProjects] = useState<ComicProject[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  // 編集モードの初期化
  useEffect(() => {
    if (isMultiPanelComic && !withText) {
      // セリフなしのマルチパネル漫画の場合、初期吹き出し位置をデフォルト設定
      const initialBubbles: BubblePosition[] = [];
      dialogues.flat().forEach((text, i) => {
        initialBubbles.push({
          x: 100 + (i % 2) * 150,
          y: 100 + Math.floor(i / 2) * 100,
          width: 120,
          height: 40,
          text,
          fontSize: 14,
          color: '#000000'
        });
      });
      setBubblePositions(initialBubbles);
    }
    
    // 保存済みプロジェクトを読み込む
    const loadSavedProjects = () => {
      try {
        const savedData = localStorage.getItem('comicProjects');
        if (savedData) {
          setSavedProjects(JSON.parse(savedData));
        }
      } catch (e) {
        console.error('プロジェクトの読み込みに失敗しました', e);
      }
    };
    
    loadSavedProjects();
  }, [isMultiPanelComic, withText, dialogues]);
  
  const handleTextChange = (index: number, text: string) => {
    const newTexts = [...panelTexts];
    newTexts[index] = text;
    setPanelTexts(newTexts);
    
    // 吹き出し編集モードの場合、該当の吹き出しテキストも更新
    if (editMode && bubblePositions[index]) {
      const newBubbles = [...bubblePositions];
      newBubbles[index].text = text;
      setBubblePositions(newBubbles);
    }
  };
  
  const handlePanelClick = (index: number) => {
    setSelectedPanel(index === selectedPanel ? null : index);
  };
  
  const handleAddBubble = () => {
    const newBubble: BubblePosition = {
      x: 100,
      y: 100,
      width: 120,
      height: 40,
      text: '新しいセリフ',
      fontSize: 14,
      color: '#000000'
    };
    setBubblePositions([...bubblePositions, newBubble]);
  };
  
  const handleBubbleDrag = (index: number, x: number, y: number) => {
    const newBubbles = [...bubblePositions];
    newBubbles[index].x = x;
    newBubbles[index].y = y;
    setBubblePositions(newBubbles);
  };
  
  const handleBubbleResize = (index: number, width: number, height: number) => {
    const newBubbles = [...bubblePositions];
    newBubbles[index].width = width;
    newBubbles[index].height = height;
    setBubblePositions(newBubbles);
  };
  
  const handleBubbleTextChange = (index: number, text: string) => {
    const newBubbles = [...bubblePositions];
    newBubbles[index].text = text;
    setBubblePositions(newBubbles);
    
    // パネルテキストも更新
    if (index < panelTexts.length) {
      const newTexts = [...panelTexts];
      newTexts[index] = text;
      setPanelTexts(newTexts);
    }
  };
  
  const handleDownload = async () => {
    if (!comicRef.current) return;
    
    try {
      // HTMLを画像としてキャプチャ
      const canvas = await html2canvas(comicRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2 // 高品質化
      });
      
      // Canvas to Blob
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          saveAs(blob, `${projectName || 'comic'}.png`);
        }
      });
    } catch (error) {
      console.error('画像のダウンロードに失敗しました', error);
      alert('画像のダウンロードに失敗しました。もう一度お試しください。');
    }
  };
  
  const handleSaveProject = () => {
    if (!projectName.trim()) {
      alert('プロジェクト名を入力してください');
      return;
    }
    
    const projectData: ComicProject = {
      id: `proj-${Date.now()}`,
      name: projectName,
      imageUrl: firstPanel.imageUrl,
      bubblePositions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 既存プロジェクトに追加
    const updatedProjects = [...savedProjects, projectData];
    setSavedProjects(updatedProjects);
    
    // ローカルストレージに保存
    try {
      localStorage.setItem('comicProjects', JSON.stringify(updatedProjects));
      alert('プロジェクトを保存しました');
    } catch (e) {
      console.error('プロジェクトの保存に失敗しました', e);
      alert('プロジェクトの保存に失敗しました');
    }
  };
  
  const handleLoadProject = (project: ComicProject) => {
    setBubblePositions(project.bubblePositions);
    setProjectName(project.name);
    setShowProjectModal(false);
  };
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">漫画プレビュー ({panelCount}コマ)</h2>
        <div className="flex items-center gap-3">
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
          
          {isMultiPanelComic && (
            <button
              className={`px-3 py-1 rounded text-sm ${editMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? '編集モード終了' : 'セリフ位置編集'}
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="input-field flex-grow"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="プロジェクト名"
          />
          <button className="btn-secondary whitespace-nowrap" onClick={handleSaveProject}>
            保存
          </button>
          <button className="btn-secondary whitespace-nowrap" onClick={() => setShowProjectModal(true)}>
            読込
          </button>
        </div>
      </div>
      
      <div 
        ref={comicRef}
        className="relative border-2 rounded-lg overflow-hidden mb-6 bg-white"
      >
        {isMultiPanelComic ? (
          // マルチパネル漫画の表示（1枚の画像にすべてのコマが含まれる）
          <div className="relative">
            <div className="relative w-full h-96 md:h-[600px]">
              <Image 
                src={firstPanel.imageUrl} 
                alt="マルチパネル漫画"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            
            {/* 吹き出し編集モード */}
            {editMode && isMultiPanelComic && (
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {bubblePositions.map((bubble, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-blue-500 bg-white bg-opacity-70 rounded p-2 cursor-move pointer-events-auto"
                    style={{
                      left: `${bubble.x}px`,
                      top: `${bubble.y}px`,
                      width: `${bubble.width}px`,
                      minHeight: `${bubble.height}px`,
                    }}
                    // ドラッグ処理をここに追加
                  >
                    <div 
                      contentEditable 
                      suppressContentEditableWarning
                      className="focus:outline-none w-full"
                      onBlur={(e) => handleBubbleTextChange(index, e.currentTarget.textContent || '')}
                    >
                      {bubble.text}
                    </div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"></div>
                  </div>
                ))}
              </div>
            )}
            
            {/* セリフ表示 - 編集モードでない場合 */}
            {!editMode && isMultiPanelComic && (
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {bubblePositions.map((bubble, index) => (
                  <div
                    key={index}
                    className="absolute bg-white bg-opacity-80 rounded p-2"
                    style={{
                      left: `${bubble.x}px`,
                      top: `${bubble.y}px`,
                      width: `${bubble.width}px`,
                      minHeight: `${bubble.height}px`,
                    }}
                  >
                    {bubble.text}
                  </div>
                ))}
              </div>
            )}
            
            {/* キャプション表示 */}
            {showCaptions && firstPanel.caption && (
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 p-2 text-white text-sm">
                {firstPanel.caption}
              </div>
            )}
          </div>
        ) : (
          // 個別パネルの表示（従来の表示方法）
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
      
      {/* セリフ編集エリア */}
      {!editMode && (
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
      )}
      
      {/* 吹き出し編集モード時のコントロール */}
      {editMode && (
        <div className="card p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">吹き出し編集</h3>
          <p className="text-sm text-gray-500 mb-3">吹き出しをドラッグして位置を調整したり、サイズを変更したりできます。</p>
          <button 
            className="btn-secondary mb-4"
            onClick={handleAddBubble}
          >
            吹き出しを追加
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bubblePositions.map((bubble, index) => (
              <div key={index} className="border rounded p-3">
                <h4 className="font-medium mb-2">吹き出し {index + 1}</h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-sm">X位置</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={bubble.x}
                      onChange={(e) => handleBubbleDrag(index, Number(e.target.value), bubble.y)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Y位置</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={bubble.y}
                      onChange={(e) => handleBubbleDrag(index, bubble.x, Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-sm">幅</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={bubble.width}
                      onChange={(e) => handleBubbleResize(index, Number(e.target.value), bubble.height)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm">高さ</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={bubble.height}
                      onChange={(e) => handleBubbleResize(index, bubble.width, Number(e.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm">テキスト</label>
                  <textarea
                    className="input-field"
                    value={bubble.text}
                    onChange={(e) => handleBubbleTextChange(index, e.target.value)}
                    rows={2}
                  />
                </div>
                <button 
                  className="mt-2 px-2 py-1 bg-red-100 text-red-600 rounded text-sm"
                  onClick={() => {
                    const newBubbles = bubblePositions.filter((_, i) => i !== index);
                    setBubblePositions(newBubbles);
                  }}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <button 
          className="btn-secondary"
          onClick={() => {
            // 元のセリフに戻す
            const originalTexts = dialogues.map(d => d.join('\n'));
            setPanelTexts(originalTexts);
            
            // 吹き出し位置もリセット
            if (editMode) {
              const initialBubbles: BubblePosition[] = [];
              dialogues.flat().forEach((text, i) => {
                initialBubbles.push({
                  x: 100 + (i % 2) * 150,
                  y: 100 + Math.floor(i / 2) * 100,
                  width: 120,
                  height: 40,
                  text,
                  fontSize: 14,
                  color: '#000000'
                });
              });
              setBubblePositions(initialBubbles);
            }
            
            console.log('セリフをリセットしました');
          }}
        >
          セリフをリセット
        </button>
        <div className="flex gap-2">
          <button 
            className="btn-primary" 
            onClick={handleDownload}
          >
            画像として保存
          </button>
        </div>
      </div>
      
      {/* プロジェクト読み込みモーダル */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">プロジェクトを読み込む</h3>
            
            {savedProjects.length === 0 ? (
              <p className="text-gray-500">保存されたプロジェクトはありません</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {savedProjects.map(project => (
                  <div key={project.id} className="border rounded p-3 flex items-center gap-3">
                    <div className="w-16 h-16 relative">
                      <Image 
                        src={project.imageUrl} 
                        alt={project.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-xs text-gray-500">
                        作成: {new Date(project.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button 
                      className="btn-primary text-sm py-1"
                      onClick={() => handleLoadProject(project)}
                    >
                      読込
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button 
                className="btn-secondary"
                onClick={() => setShowProjectModal(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
