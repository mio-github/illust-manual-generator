'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import TextEditor from './TextEditor';
import { SupportedLanguage } from '@/utils/openai';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import JSZip from 'jszip';

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
  writing: 'horizontal' | 'vertical';
  fontFamily: string;
}

interface ComicProject {
  id: string;
  name: string;
  imageUrl: string;
  bubblePositions: BubblePosition[];
  panelDialogues?: string[][];
  createdAt: string;
  updatedAt: string;
}

interface ComicGeneratorProps {
  content: Panel[];
  panelDialogues?: string[][];
}

// ドラッガブルな吹き出しコンポーネント
function DraggableBubble({ 
  bubble, 
  index, 
  onUpdate, 
  onTextChange, 
  onResize,
  onDelete,
  onWritingModeChange,
  onFontChange 
}: { 
  bubble: BubblePosition; 
  index: number; 
  onUpdate: (index: number, x: number, y: number) => void;
  onTextChange: (index: number, text: string) => void;
  onResize: (index: number, width: number, height: number) => void;
  onDelete: (index: number) => void;
  onWritingModeChange: (index: number, mode: 'horizontal' | 'vertical') => void;
  onFontChange: (index: number, fontFamily: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `bubble-${index}`,
    data: {
      type: 'bubble',
      index
    }
  });
  
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: bubble.width, height: bubble.height });
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startPos.x;
      const deltaY = moveEvent.clientY - startPos.y;
      onResize(index, Math.max(50, startSize.width + deltaX), Math.max(30, startSize.height + deltaY));
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setIsResizing(false);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  const style = {
    left: `${bubble.x}px`,
    top: `${bubble.y}px`,
    width: `${bubble.width}px`,
    minHeight: `${bubble.height}px`,
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    writingMode: bubble.writing === 'vertical' ? 'vertical-rl' as const : 'horizontal-tb' as const,
    fontFamily: bubble.fontFamily || 'sans-serif'
  };
  
  // 実際のドラッグエンド時の処理はDndContextのイベントハンドラから呼び出される
  // ここではtransformの変更に基づいた更新は行わない
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="absolute border-2 border-blue-500 bg-white bg-opacity-70 rounded p-2 cursor-move pointer-events-auto"
      {...attributes}
      {...listeners}
    >
      <div 
        contentEditable 
        suppressContentEditableWarning
        className="focus:outline-none w-full"
        style={{
          fontFamily: bubble.fontFamily,
          fontSize: `${bubble.fontSize}px`,
          color: bubble.color,
          writingMode: bubble.writing === 'vertical' ? 'vertical-rl' : 'horizontal-tb'
        }}
        onBlur={(e) => onTextChange(index, e.currentTarget.textContent || '')}
      >
        {bubble.text}
      </div>
      
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
        onMouseDown={handleResizeStart}
      />
      
      <div className="absolute top-0 right-0 flex space-x-1">
        <button
          className="text-xs bg-blue-100 text-blue-600 rounded px-1"
          onClick={() => onWritingModeChange(index, bubble.writing === 'horizontal' ? 'vertical' : 'horizontal')}
        >
          {bubble.writing === 'horizontal' ? '縦' : '横'}
        </button>
        <button
          className="text-xs bg-red-100 text-red-600 rounded px-1"
          onClick={() => onDelete(index)}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ドロップエリアコンポーネント
function BubbleDropArea({ children, onDragEnd }: { children: React.ReactNode; onDragEnd: (id: string, x: number, y: number) => void }) {
  const { setNodeRef } = useDroppable({
    id: 'bubble-drop-area'
  });
  
  return (
    <div ref={setNodeRef} className="absolute inset-0 w-full h-full pointer-events-none">
      {children}
    </div>
  );
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
  const imageRef = useRef<HTMLImageElement>(null);
  const [bubblePositions, setBubblePositions] = useState<BubblePosition[]>([]);
  
  // フォントファミリーオプション
  const fontFamilies = [
    { value: 'sans-serif', label: '標準' },
    { value: 'serif', label: '明朝' },
    { value: 'cursive', label: '手書き' },
    { value: 'fantasy', label: 'ポップ' },
    { value: 'monospace', label: '等幅' }
  ];
  
  // プロジェクト関連
  const [projectName, setProjectName] = useState(`NavIllust-${new Date().toISOString().slice(0, 10)}`);
  const [savedProjects, setSavedProjects] = useState<ComicProject[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  // 編集モードの初期化を改善
  useEffect(() => {
    if (isMultiPanelComic) {
      // 画像のロードを待ってからバブル位置を計算
      const calculateBubblePositions = async () => {
        if (imageRef.current) {
          try {
            // 画像サイズを取得
            const imgWidth = imageRef.current.width || 1024;
            const imgHeight = imageRef.current.height || 1024;
            
            // コマのおおよその配置を推測
            // 4コマなら2x2、6コマなら3x2などの配置を想定
            const cols = panelCount <= 4 ? 2 : 3;
            const rows = Math.ceil(panelCount / cols);
            
            // 各コマのサイズを計算
            const panelWidth = imgWidth / cols;
            const panelHeight = imgHeight / rows;
            
            // 初期吹き出し位置をデフォルト設定
            const initialBubbles: BubblePosition[] = [];
            dialogues.forEach((panelDialogues, panelIndex) => {
              // コマの行と列を計算
              const col = panelIndex % cols;
              const row = Math.floor(panelIndex / cols);
              
              // コマの左上座標
              const panelLeft = col * panelWidth;
              const panelTop = row * panelHeight;
              
              // コマの中央付近
              const panelCenterX = panelLeft + panelWidth / 2;
              const panelCenterY = panelTop + panelHeight / 2;
              
              // 吹き出しを配置
              panelDialogues.forEach((text, bubbleIndex) => {
                // 複数の吹き出しがある場合は少しずらして配置
                const offsetX = bubbleIndex % 2 === 0 ? -80 : 80;
                const offsetY = bubbleIndex > 1 ? 80 : 0;
                
                initialBubbles.push({
                  x: panelCenterX + offsetX - 60, // 吹き出しの幅の半分を引いて中央に
                  y: panelCenterY + offsetY - 20, // 吹き出しの高さの半分を引いて中央に
                  width: 120,
                  height: text.length > 20 ? 60 : 40, // テキスト長に応じてサイズ調整
                  text,
                  fontSize: 14,
                  color: '#000000',
                  writing: 'horizontal',
                  fontFamily: 'sans-serif'
                });
              });
            });
            
            setBubblePositions(initialBubbles);
          } catch (error) {
            console.error('吹き出し位置の初期化に失敗しました', error);
            // エラー時はデフォルトの位置設定をフォールバックとして使用
            const defaultBubbles: BubblePosition[] = [];
            dialogues.flat().forEach((text, i) => {
              defaultBubbles.push({
                x: 100 + (i % 2) * 150,
                y: 100 + Math.floor(i / 2) * 100,
                width: 120,
                height: 40,
                text,
                fontSize: 14,
                color: '#000000',
                writing: 'horizontal',
                fontFamily: 'sans-serif'
              });
            });
            setBubblePositions(defaultBubbles);
          }
        }
      };
      
      // 画像ロード後に吹き出し位置を計算
      const img = imageRef.current;
      if (img) {
        if (img.complete) {
          calculateBubblePositions();
        } else {
          img.onload = calculateBubblePositions;
        }
      } else {
        // イメージ要素がない場合はデフォルト位置を使用
        const defaultBubbles: BubblePosition[] = [];
        dialogues.flat().forEach((text, i) => {
          defaultBubbles.push({
            x: 100 + (i % 2) * 150,
            y: 100 + Math.floor(i / 2) * 100,
            width: 120,
            height: 40,
            text,
            fontSize: 14,
            color: '#000000',
            writing: 'horizontal',
            fontFamily: 'sans-serif'
          });
        });
        setBubblePositions(defaultBubbles);
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
    }
  }, [isMultiPanelComic, dialogues, panelCount]);
  
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
      color: '#000000',
      writing: 'horizontal',
      fontFamily: 'sans-serif'
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
  
  const handleBubbleDelete = (index: number) => {
    const newBubbles = bubblePositions.filter((_, i) => i !== index);
    setBubblePositions(newBubbles);
  };
  
  const handleBubbleWritingChange = (index: number, mode: 'horizontal' | 'vertical') => {
    const newBubbles = [...bubblePositions];
    newBubbles[index].writing = mode;
    setBubblePositions(newBubbles);
  };
  
  const handleBubbleFontChange = (index: number, fontFamily: string) => {
    const newBubbles = [...bubblePositions];
    newBubbles[index].fontFamily = fontFamily;
    setBubblePositions(newBubbles);
  };
  
  const handleDragEnd = (id: string, x: number, y: number) => {
    if (id.startsWith('bubble-')) {
      const index = parseInt(id.replace('bubble-', ''));
      handleBubbleDrag(index, x, y);
    }
  };
  
  const handleDownload = async () => {
    if (!comicRef.current) return;
    
    try {
      // 編集モードをオフにして枠線が出ないようにする
      const prevEditMode = editMode;
      setEditMode(false);
      
      // 少し待ってからキャプチャ（ステート更新後にレンダリングされるのを待つ）
      setTimeout(async () => {
        // 画像が完全に読み込まれていることを確認
        if (imageRef.current && !imageRef.current.complete) {
          await new Promise(resolve => {
            if (imageRef.current) {
              imageRef.current.onload = resolve;
            }
          });
        }
        
        // HTMLを画像としてキャプチャ
        const canvas = await html2canvas(comicRef.current!, {
          allowTaint: true,
          useCORS: true,
          scale: 2, // 高品質化
          backgroundColor: '#FFFFFF',
          // UI要素は除外
          ignoreElements: (element) => {
            return element.classList.contains('ui-control') || 
                  element.classList.contains('bubble-controls');
          },
          // 全体を確実に含めるための設定
          width: comicRef.current!.scrollWidth,
          height: comicRef.current!.scrollHeight,
          windowWidth: comicRef.current!.scrollWidth,
          windowHeight: comicRef.current!.scrollHeight
        });
        
        // Canvas to Blob
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            saveAs(blob, `${projectName || 'navigation-illust'}.png`);
          }
          // 編集モードを元に戻す
          setEditMode(prevEditMode);
        });
      }, 100);
    } catch (error) {
      console.error('画像のダウンロードに失敗しました', error);
      alert('画像のダウンロードに失敗しました。もう一度お試しください。');
    }
  };
  
  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      alert('プロジェクト名を入力してください');
      return;
    }
    
    const projectData: ComicProject = {
      id: `proj-${Date.now()}`,
      name: projectName,
      imageUrl: firstPanel.imageUrl,
      bubblePositions,
      panelDialogues: dialogues,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 既存プロジェクトに追加
    const updatedProjects = [...savedProjects, projectData];
    setSavedProjects(updatedProjects);
    
    // ローカルストレージに保存
    try {
      localStorage.setItem('comicProjects', JSON.stringify(updatedProjects));
      
      // ZIP形式で保存
      await exportProjectAsZip(projectData);
      
      alert('プロジェクトを保存しました');
    } catch (e) {
      console.error('プロジェクトの保存に失敗しました', e);
      alert('プロジェクトの保存に失敗しました');
    }
  };
  
  const exportProjectAsZip = async (project: ComicProject) => {
    const zip = new JSZip();
    
    // プロジェクトデータをJSONとして保存
    zip.file("project.json", JSON.stringify(project, null, 2));
    
    // 画像をZIPに追加
    try {
      // 画像を取得
      const imageResponse = await fetch(project.imageUrl);
      const imageBlob = await imageResponse.blob();
      zip.file("image.png", imageBlob);
      
      // プレビュー画像を生成して追加
      if (comicRef.current) {
        const canvas = await html2canvas(comicRef.current, {
          allowTaint: true,
          useCORS: true,
          scale: 1
        });
        
        const previewBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve);
        });
        
        if (previewBlob) {
          zip.file("preview.png", previewBlob);
        }
      }
      
      // ZIPを生成してダウンロード
      const zipBlob = await zip.generateAsync({type: "blob"});
      saveAs(zipBlob, `${project.name}.zip`);
    } catch (error) {
      console.error('ZIPの作成に失敗しました', error);
      throw error;
    }
  };
  
  const handleLoadProject = (project: ComicProject) => {
    setBubblePositions(project.bubblePositions);
    setProjectName(project.name);
    setShowProjectModal(false);
  };
  
  const handleImportProject = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const zip = new JSZip();
      const zipContents = await zip.loadAsync(file);
      
      // プロジェクトJSONを読み込む
      const projectJson = await zipContents.file('project.json')?.async('text');
      if (!projectJson) {
        throw new Error('プロジェクトデータが見つかりません');
      }
      
      const projectData = JSON.parse(projectJson) as ComicProject;
      
      // 画像を読み込む（必要に応じて）
      // ここでは外部URLの画像を使用するので、画像の再読み込みは不要
      
      // プロジェクトデータを適用
      setBubblePositions(projectData.bubblePositions);
      setProjectName(projectData.name);
      
      alert('プロジェクトを読み込みました');
    } catch (error) {
      console.error('プロジェクトの読み込みに失敗しました', error);
      alert('プロジェクトの読み込みに失敗しました。ファイル形式を確認してください。');
    }
  };
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">ナビゲーションイラストプレビュー ({panelCount}コマ)</h2>
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
          <label className="btn-secondary whitespace-nowrap cursor-pointer">
            ZIPからインポート
            <input
              type="file"
              accept=".zip"
              className="hidden"
              onChange={handleImportProject}
            />
          </label>
        </div>
      </div>
      
      <div 
        ref={comicRef}
        className="relative border-2 rounded-lg overflow-hidden mb-6 bg-white"
      >
        {isMultiPanelComic ? (
          // マルチパネルイラストの表示（1枚の画像にすべてのコマが含まれる）
          <div className="relative">
            <div className="relative w-full h-96 md:h-[600px]">
              <Image 
                ref={imageRef}
                src={firstPanel.imageUrl} 
                alt="ナビゲーションイラスト"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            
            <DndContext onDragEnd={({ active, delta }) => {
              if (active && delta) {
                const id = active.id.toString();
                if (id.startsWith('bubble-')) {
                  const index = parseInt(id.replace('bubble-', ''));
                  const bubble = bubblePositions[index];
                  handleBubbleDrag(index, bubble.x + delta.x, bubble.y + delta.y);
                }
              }
            }}>
              <BubbleDropArea onDragEnd={handleDragEnd}>
                {/* 吹き出し編集モード */}
                {editMode && (
                  <>
                    {bubblePositions.map((bubble, index) => (
                      <DraggableBubble
                        key={index}
                        bubble={bubble}
                        index={index}
                        onUpdate={handleBubbleDrag}
                        onTextChange={handleBubbleTextChange}
                        onResize={handleBubbleResize}
                        onDelete={handleBubbleDelete}
                        onWritingModeChange={handleBubbleWritingChange}
                        onFontChange={handleBubbleFontChange}
                      />
                    ))}
                  </>
                )}
              </BubbleDropArea>
            </DndContext>
            
            {/* セリフ表示 - 編集モードでない場合 */}
            {!editMode && (
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
                      writingMode: bubble.writing === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
                      fontFamily: bubble.fontFamily || 'sans-serif',
                      fontSize: `${bubble.fontSize}px`,
                      color: bubble.color
                    }}
                  >
                    {bubble.text}
                  </div>
                ))}
              </div>
            )}
            
            {/* キャプション表示 */}
            {showCaptions && firstPanel.caption && (
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 p-2 text-white text-sm ui-control">
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
                    alt={`イラストコマ ${index + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
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
                <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold ui-control">
                  {index + 1}
                </div>
                
                {/* キャプション表示 */}
                {showCaptions && panel.caption && (
                  <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 p-2 text-white text-sm ui-control">
                    {panel.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 編集ツールバー */}
      {editMode && (
        <div className="card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">吹き出し編集</h3>
            <button 
              className="btn-secondary"
              onClick={handleAddBubble}
            >
              吹き出しを追加
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-sm">書字方向</label>
                    <select
                      className="input-field"
                      value={bubble.writing}
                      onChange={(e) => handleBubbleWritingChange(index, e.target.value as 'horizontal' | 'vertical')}
                    >
                      <option value="horizontal">横書き</option>
                      <option value="vertical">縦書き</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm">フォント</label>
                    <select
                      className="input-field"
                      value={bubble.fontFamily}
                      onChange={(e) => handleBubbleFontChange(index, e.target.value)}
                    >
                      {fontFamilies.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm">フォントサイズ</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="30" 
                    className="w-full" 
                    value={bubble.fontSize}
                    onChange={(e) => {
                      const newBubbles = [...bubblePositions];
                      newBubbles[index].fontSize = Number(e.target.value);
                      setBubblePositions(newBubbles);
                    }}
                  />
                  <div className="text-center text-xs">{bubble.fontSize}px</div>
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
                <div className="mt-2 flex justify-end">
                  <button 
                    className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm"
                    onClick={() => handleBubbleDelete(index)}
                  >
                    削除
                  </button>
                </div>
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
                  color: '#000000',
                  writing: 'horizontal',
                  fontFamily: 'sans-serif'
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
                    <div className="flex gap-2">
                      <button 
                        className="btn-primary text-sm py-1"
                        onClick={() => handleLoadProject(project)}
                      >
                        読込
                      </button>
                      <button 
                        className="btn-secondary text-sm py-1"
                        onClick={() => exportProjectAsZip(project)}
                      >
                        ZIP
                      </button>
                    </div>
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
