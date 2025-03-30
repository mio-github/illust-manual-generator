'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import TextEditor from './TextEditor';
import { SupportedLanguage } from '@/utils/openai';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import JSZip from 'jszip';
import * as ContextMenu from '@radix-ui/react-context-menu';
import * as Popover from '@radix-ui/react-popover';
import { appConfig } from '@/utils/config';

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
  fontWeight?: string;
  opacity?: number;
  bubbleStyle?: 'anime' | 'round' | 'cloud' | 'think' | 'shout';
  bubbleColor?: string;
  borderWidth?: number;
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
  content: {
    imageUrl: string;
    dialogues: string[][];
    panelCount: number;
    language: string;
    generatedAt: string;
    elapsedTime: number;
    caption?: string;
    bubblePositions?: BubblePosition[];
    editable?: boolean;
  };
  panelDialogues?: string[][];
}

// 保存方法の選択肢を定義
type SaveMethod = 'html2canvas' | 'direct';

// 右クリックメニューコンポーネント
function BubbleContextMenu({ 
  children, 
  bubble, 
  index, 
  onUpdate,
  onDelete,
  onStyleChange,
  onFontChange,
  onOpacityChange
}: { 
  children: React.ReactNode;
  bubble: BubblePosition;
  index: number;
  onUpdate: (index: number, updates: Partial<BubblePosition>) => void;
  onDelete: (index: number) => void;
  onStyleChange: (index: number, style: string) => void;
  onFontChange: (index: number, font: string) => void;
  onOpacityChange: (index: number, opacity: number) => void;
}) {
  // フォントサイズの変更
  const changeFontSize = (size: number) => {
    const newSize = Math.max(10, Math.min(36, bubble.fontSize + size));
    onUpdate(index, { fontSize: newSize });
  };
  
  // 書き方の変更（縦書き/横書き）
  const toggleWritingMode = () => {
    const newMode = bubble.writing === 'horizontal' ? 'vertical' : 'horizontal';
    onUpdate(index, { writing: newMode });
  };
  
  // 太さの変更
  const toggleFontWeight = () => {
    const newWeight = bubble.fontWeight === 'bold' ? 'normal' : 'bold';
    onUpdate(index, { fontWeight: newWeight });
  };
  
  // 透明度の変更
  const handleOpacityChange = (opacity: number) => {
    onOpacityChange(index, opacity);
  };

  // 吹き出しスタイルの変更
  const bubbleStyles = [
    { id: 'anime', label: 'アニメ風' },
    { id: 'round', label: '丸型' },
    { id: 'cloud', label: 'もくもく' },
    { id: 'think', label: '考え事' },
    { id: 'shout', label: '叫び' }
  ];
  
  // フォントの変更
  const fontOptions = [
    { value: "'Kosugi Maru', sans-serif", label: '丸ゴシック' },
    { value: "'M PLUS Rounded 1c', sans-serif", label: '丸フォント' },
    { value: "sans-serif", label: '標準' },
    { value: "serif", label: '明朝' },
    { value: "cursive", label: '手書き' },
    { value: "fantasy", label: 'ポップ' }
  ];
  
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        {children}
      </ContextMenu.Trigger>
      
      <ContextMenu.Portal>
        <ContextMenu.Content 
          className="min-w-[220px] bg-white rounded-md p-1 shadow-lg border border-gray-200 z-50"
        >
          <ContextMenu.Label className="pl-2 py-1.5 text-xs text-gray-500 font-semibold">吹き出し設定</ContextMenu.Label>
          
          <ContextMenu.Separator className="h-px bg-gray-200 my-1" />
          
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="flex items-center justify-between px-2 py-1.5 text-sm outline-none hover:bg-blue-50 rounded cursor-default">
              <span>吹き出しスタイル</span>
              <span className="ml-auto">→</span>
            </ContextMenu.SubTrigger>
            
            <ContextMenu.Portal>
              <ContextMenu.SubContent 
                className="min-w-[180px] bg-white rounded-md p-1 shadow-lg border border-gray-200"
              >
                {bubbleStyles.map(style => (
                  <ContextMenu.Item 
                    key={style.id}
                    className={`flex px-2 py-1.5 text-sm outline-none hover:bg-blue-50 rounded cursor-default ${bubble.bubbleStyle === style.id ? 'font-semibold text-blue-600' : ''}`}
                    onClick={() => onStyleChange(index, style.id)}
                  >
                    {style.label}
                  </ContextMenu.Item>
                ))}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
          
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="flex items-center justify-between px-2 py-1.5 text-sm outline-none hover:bg-blue-50 rounded cursor-default">
              <span>フォント</span>
              <span className="ml-auto">→</span>
            </ContextMenu.SubTrigger>
            
            <ContextMenu.Portal>
              <ContextMenu.SubContent 
                className="min-w-[180px] bg-white rounded-md p-1 shadow-lg border border-gray-200"
                alignOffset={-5}
                sideOffset={2}
              >
                {fontOptions.map(font => (
                  <ContextMenu.Item 
                    key={font.value}
                    className={`flex px-2 py-1.5 text-sm outline-none hover:bg-blue-50 rounded cursor-default ${bubble.fontFamily === font.value ? 'font-semibold text-blue-600' : ''}`}
                    onClick={() => onFontChange(index, font.value)}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </ContextMenu.Item>
                ))}
              </ContextMenu.SubContent>
            </ContextMenu.Portal>
          </ContextMenu.Sub>
          
          <ContextMenu.Item 
            className="flex items-center px-2 py-1.5 text-sm outline-none hover:bg-blue-50 rounded cursor-default"
            onClick={toggleWritingMode}
          >
            {bubble.writing === 'horizontal' ? '縦書きに変更' : '横書きに変更'}
          </ContextMenu.Item>
          
          <ContextMenu.Item 
            className="flex items-center px-2 py-1.5 text-sm outline-none hover:bg-blue-50 rounded cursor-default"
            onClick={toggleFontWeight}
          >
            {bubble.fontWeight === 'bold' ? '太字解除' : '太字にする'}
          </ContextMenu.Item>
          
          <ContextMenu.Separator className="h-px bg-gray-200 my-1" />
          
          <div className="px-2 py-1.5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">フォントサイズ: {bubble.fontSize}px</span>
              <div className="flex">
                <button 
                  className="px-2 py-0.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  onClick={() => changeFontSize(-1)}
                >-</button>
                <button 
                  className="px-2 py-0.5 text-sm bg-gray-100 hover:bg-gray-200 rounded ml-1"
                  onClick={() => changeFontSize(1)}
                >+</button>
              </div>
            </div>
            <input 
              type="range" 
              className="w-full" 
              min="10" 
              max="36" 
              value={bubble.fontSize} 
              onChange={(e) => onUpdate(index, { fontSize: Number(e.target.value) })}
            />
          </div>
          
          <div className="px-2 py-1.5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">背景の透明度: {Math.round((bubble.opacity || 0.85) * 100)}%</span>
            </div>
            <input 
              type="range" 
              className="w-full" 
              min="0.3" 
              max="1" 
              step="0.05"
              value={bubble.opacity || 0.85} 
              onChange={(e) => handleOpacityChange(Number(e.target.value))}
            />
          </div>
          
          <ContextMenu.Separator className="h-px bg-gray-200 my-1" />
          
          <ContextMenu.Item 
            className="flex items-center px-2 py-1.5 text-sm outline-none hover:bg-red-50 text-red-600 rounded cursor-default"
            onClick={() => onDelete(index)}
          >
            この吹き出しを削除
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

// ドラッガブルな吹き出しコンポーネント
function DraggableBubble({ 
  bubble, 
  index, 
  onUpdate, 
  onTextChange, 
  onResize,
  onDelete,
  onStyleChange,
  onFontChange,
  onOpacityChange
}: { 
  bubble: BubblePosition; 
  index: number; 
  onUpdate: (index: number, updates: Partial<BubblePosition>) => void;
  onTextChange: (index: number, text: string) => void;
  onResize: (index: number, width: number, height: number) => void;
  onDelete: (index: number) => void;
  onStyleChange: (index: number, style: string) => void;
  onFontChange: (index: number, font: string) => void;
  onOpacityChange: (index: number, opacity: number) => void;
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
      // 移動が小さすぎる場合は無視（微細な動きによる不要なリサイズを防ぐ）
      const deltaX = moveEvent.clientX - startPos.x;
      const deltaY = moveEvent.clientY - startPos.y;
      
      // 小さな移動は無視（5px未満の移動は処理しない）
      if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return;
      
      // サイズ制限を適用
      const newWidth = Math.max(80, startSize.width + deltaX);
      const newHeight = Math.max(30, startSize.height + deltaY);
      
      // サイズの最大値も設定
      const limitedWidth = Math.min(newWidth, 300);
      const limitedHeight = Math.min(newHeight, 200);
      
      onResize(index, limitedWidth, limitedHeight);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setIsResizing(false);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  // 吹き出しスタイルに応じたクラスを生成
  const getBubbleStyle = () => {
    const style = bubble.bubbleStyle || 'anime';
    const opacity = bubble.opacity || 0.85;
    let className = `absolute border-2 bg-white rounded p-2 cursor-move pointer-events-auto bubble-editor `;
    
    // 基本スタイルをクラスに変換
    switch (style) {
      case 'anime':
        className += 'bubble-anime';
        break;
      case 'round':
        className += 'bubble-round';
        break;
      case 'cloud':
        className += 'bubble-cloud';
        break;
      case 'think':
        className += 'bubble-think';
        break;
      case 'shout':
        className += 'bubble-shout';
        break;
      default:
        className += 'bubble-anime';
    }
    
    return className;
  };
  
  // transform値をそのまま適用するのではなく、スタイルとして管理
  const styleObj: React.CSSProperties = {
    position: 'absolute',
    left: `${bubble.x}px`,
    top: `${bubble.y}px`,
    width: `${bubble.width}px`,
    minHeight: `${bubble.height}px`,
    fontFamily: bubble.fontFamily || appConfig.defaultBubbleStyle.fontFamily,
    fontSize: `${bubble.fontSize || appConfig.defaultBubbleStyle.fontSize}px`,
    fontWeight: bubble.fontWeight || appConfig.defaultBubbleStyle.fontWeight,
    color: bubble.color || appConfig.defaultBubbleStyle.color,
    backgroundColor: `rgba(255, 255, 255, ${bubble.opacity || 0.85})`,
    borderColor: bubble.bubbleColor || appConfig.defaultBubbleStyle.borderColor,
    borderWidth: bubble.borderWidth || appConfig.defaultBubbleStyle.borderWidth,
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    writingMode: bubble.writing === 'vertical' ? 'vertical-rl' as const : 'horizontal-tb' as const,
  };
  
  useEffect(() => {
    // transformがセットされたときに位置を更新（サイズは変更しない）
    if (transform) {
      const dx = transform.x;
      const dy = transform.y;
      
      // 位置の更新だけで、サイズは変更しない
      const updatedStyle = {
        x: bubble.x + dx,
        y: bubble.y + dy
      };
      
      // onUpdateを呼び出して位置を反映（直接DOMを操作しない）
      // 注: このuseEffectは位置変更時に頻繁に呼ばれるため、パフォーマンスに注意
      onUpdate(index, updatedStyle);
    }
  }, [transform, index, onUpdate]); // 注意: 依存配列からbubble.x, bubble.yを除外して無限ループを防止
  
  return (
    <BubbleContextMenu
      bubble={bubble}
      index={index}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onStyleChange={onStyleChange}
      onFontChange={onFontChange}
      onOpacityChange={onOpacityChange}
    >
      <div
        ref={setNodeRef}
        style={styleObj}
        className={getBubbleStyle()}
        {...attributes}
        {...listeners}
      >
        <div 
          contentEditable 
          suppressContentEditableWarning
          className="focus:outline-none w-full bubble-text-editor"
          style={{
            fontFamily: bubble.fontFamily || appConfig.defaultBubbleStyle.fontFamily,
            fontSize: `${bubble.fontSize || appConfig.defaultBubbleStyle.fontSize}px`,
            fontWeight: bubble.fontWeight || appConfig.defaultBubbleStyle.fontWeight,
            color: bubble.color || appConfig.defaultBubbleStyle.color,
            writingMode: bubble.writing === 'vertical' ? 'vertical-rl' : 'horizontal-tb'
          }}
          onInput={(e) => onTextChange(index, e.currentTarget.textContent || '')}
          onBlur={(e) => onTextChange(index, e.currentTarget.textContent || '')}
          dangerouslySetInnerHTML={{ __html: bubble.text }}
        />
        
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize bubble-control"
          onMouseDown={handleResizeStart}
        />
      </div>
    </BubbleContextMenu>
  );
}

// ドロップエリアコンポーネント
function BubbleDropArea({ children }: { 
  children: React.ReactNode; 
}) {
  const { setNodeRef } = useDroppable({
    id: 'bubble-drop-area'
  });
  
  return (
    <div ref={setNodeRef} className="absolute inset-0 w-full h-full pointer-events-none">
      {children}
    </div>
  );
}

// まず、roundRectパスを描画するためのヘルパー関数を追加します
function drawRoundedRect(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius: number | number[]
) {
  if (typeof radius === 'number') {
    radius = [radius, radius, radius, radius];
  } else if (radius.length === 1) {
    radius = [radius[0], radius[0], radius[0], radius[0]];
  } else if (radius.length === 2) {
    radius = [radius[0], radius[1], radius[0], radius[1]];
  } else if (radius.length === 3) {
    radius = [radius[0], radius[1], radius[2], radius[0]];
  }

  // 左上
  ctx.moveTo(x + radius[0], y);
  // 上辺
  ctx.lineTo(x + width - radius[1], y);
  // 右上の角
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius[1]);
  // 右辺
  ctx.lineTo(x + width, y + height - radius[2]);
  // 右下の角
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius[2], y + height);
  // 下辺
  ctx.lineTo(x + radius[3], y + height);
  // 左下の角
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius[3]);
  // 左辺
  ctx.lineTo(x, y + radius[0]);
  // 左上の角
  ctx.quadraticCurveTo(x, y, x + radius[0], y);
  ctx.closePath();
}

export default function ComicGenerator({ content, panelDialogues }: ComicGeneratorProps) {
  // デバッグ用にcontentの内容をログ出力
  console.log('受け取ったcontent:', content);

  // 必要に応じてデフォルト値を設定
  const fallbackImageUrl = '/placeholder-image.jpg'; // プレースホルダー画像のパス
  
  // APIレスポンスの新しい形式に対応
  const isMultiPanelComic = true; // 常にマルチパネルとして扱う
  const panelCount = content?.panelCount || 4;
  const withText = true;
  const language = content?.language || 'ja';
  
  // マルチパネルの場合は、dialoguesを使用
  const dialogues = content?.dialogues || panelDialogues || [];
  
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [panelTexts, setPanelTexts] = useState<string[]>(
    dialogues.map((d: string[]) => d.join('\n'))
  );
  const [showCaptions, setShowCaptions] = useState(true);
  
  // 吹き出し位置の編集用
  const [editMode, setEditMode] = useState(true);
  const comicRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [bubblePositions, setBubblePositions] = useState<BubblePosition[]>([]);
  const [saveMethod, setSaveMethod] = useState<SaveMethod>('direct'); // 追加：保存方法の状態
  
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
            // 画像の自然サイズを取得（clientWidth/clientHeightではなくnaturalWidth/naturalHeightを使用）
            const imgWidth = imageRef.current.naturalWidth || 1024;
            const imgHeight = imageRef.current.naturalHeight || 1024;
            
            console.log('画像サイズ取得:', { imgWidth, imgHeight });
            
            // コマのおおよその配置を推測
            // 4コマなら2x2、6コマなら3x2などの配置を想定
            const cols = panelCount <= 4 ? 2 : 3;
            const rows = Math.ceil(panelCount / cols);
            
            // 各コマのサイズを計算
            const panelWidth = imgWidth / cols;
            const panelHeight = imgHeight / rows;
            
            console.log('コマサイズ計算:', { cols, rows, panelWidth, panelHeight, panelCount });
            
            // 初期吹き出し位置をデフォルト設定
            const initialBubbles: BubblePosition[] = [];
            
            // API から bubblePositions が提供されている場合はそれを使用
            if (content?.bubblePositions && content.bubblePositions.length > 0) {
              console.log('APIから提供された吹き出し位置を使用');
              setBubblePositions(content.bubblePositions);
              return;
            }
            
            // APIから提供されていない場合は計算する
            console.log('吹き出し位置を新規計算');
            
            dialogues.forEach((panelDialogues, panelIndex) => {
              // コマの行と列を計算
              const col = panelIndex % cols;
              const row = Math.floor(panelIndex / cols);
              
              // コマの左上座標
              const panelLeft = col * panelWidth;
              const panelTop = row * panelHeight;
              
              // コマの中央付近（実際の画像サイズに基づく）
              const panelCenterX = panelLeft + panelWidth / 2;
              const panelCenterY = panelTop + panelHeight / 2;
              
              // スケール係数を計算（表示領域と実際の画像サイズの比率）
              let scaleX = 1;
              let scaleY = 1;
              
              if (imageRef.current) {
                const displayRect = imageRef.current.getBoundingClientRect();
                scaleX = displayRect.width / imgWidth;
                scaleY = displayRect.height / imgHeight;
              }
              
              // 吹き出しを配置
              panelDialogues.forEach((text, bubbleIndex) => {
                if (!text || text.trim() === '') return; // 空テキストの場合はスキップ
                
                // 複数の吹き出しがある場合は少しずらして配置
                const offsetX = bubbleIndex % 2 === 0 ? -80 : 80;
                const offsetY = bubbleIndex > 1 ? 80 : 0;
                
                // テキストの長さに基づいて適切なサイズを計算
                const textLength = text.length;
                // 最小サイズと最大サイズの間で適切なサイズを決定
                const bubbleWidth = Math.min(Math.max(100, textLength * 8), 200);
                const bubbleHeight = Math.min(Math.max(40, Math.ceil(textLength / 10) * 20), 100);
                
                // 位置を計算（表示スケールに合わせる）
                const x = panelCenterX * scaleX + offsetX * scaleX - (bubbleWidth * scaleX) / 2;
                const y = panelCenterY * scaleY + offsetY * scaleY - (bubbleHeight * scaleY) / 2;
                
                initialBubbles.push({
                  x,
                  y,
                  width: bubbleWidth,
                  height: bubbleHeight,
                  text,
                  fontSize: 14,
                  color: '#000000',
                  writing: 'horizontal',
                  fontFamily: 'sans-serif',
                  bubbleStyle: 'anime',
                  opacity: 0.95
                });
              });
            });
            
            console.log('計算された吹き出し位置:', initialBubbles);
            setBubblePositions(initialBubbles);
          } catch (error) {
            console.error('吹き出し位置の初期化に失敗しました', error);
            // エラー時はデフォルトの位置設定をフォールバックとして使用
            const defaultBubbles: BubblePosition[] = [];
            dialogues.flat().forEach((text, i) => {
              if (!text || text.trim() === '') return; // 空テキストの場合はスキップ
              
              defaultBubbles.push({
                x: 100 + (i % 2) * 150,
                y: 100 + Math.floor(i / 2) * 100,
                width: Math.min(Math.max(100, text.length * 8), 200),
                height: Math.min(Math.max(40, Math.ceil(text.length / 10) * 20), 100),
                text,
                fontSize: 14,
                color: '#000000',
                writing: 'horizontal',
                fontFamily: 'sans-serif',
                bubbleStyle: 'anime',
                opacity: 0.95
              });
            });
            console.log('フォールバック吹き出し位置:', defaultBubbles);
            setBubblePositions(defaultBubbles);
          }
        }
      };
      
      // 画像ロード後に吹き出し位置を確実に計算
      const img = imageRef.current;
      if (img) {
        // イベントリスナーを設定（既存のリスナーがある場合はクリア）
        const handleImageLoad = () => {
          console.log('画像ロード完了、吹き出し位置を計算');
          // イメージの完全な読み込みを確保するため少し遅延
          setTimeout(calculateBubblePositions, 100);
        };
        
        if (img.complete) {
          console.log('画像既にロード済み');
          handleImageLoad();
        } else {
          console.log('画像読み込み待機中...');
          img.onload = handleImageLoad;
        }
      } else {
        console.log('画像要素が見つかりません、デフォルト位置を使用');
        // イメージ要素がない場合はデフォルト位置を使用
        const defaultBubbles: BubblePosition[] = [];
        dialogues.flat().forEach((text, i) => {
          if (!text || text.trim() === '') return; // 空テキストの場合はスキップ
          
          defaultBubbles.push({
            x: 100 + (i % 2) * 150,
            y: 100 + Math.floor(i / 2) * 100,
            width: Math.min(Math.max(100, text.length * 8), 200),
            height: Math.min(Math.max(40, Math.ceil(text.length / 10) * 20), 100),
            text,
            fontSize: 14,
            color: '#000000',
            writing: 'horizontal',
            fontFamily: 'sans-serif',
            bubbleStyle: 'anime',
            opacity: 0.95
          });
        });
        console.log('デフォルト吹き出し位置:', defaultBubbles);
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
  }, [isMultiPanelComic, dialogues, panelCount, content]);
  
  const handleTextChange = (index: number, text: string) => {
    console.log('テキスト変更:', index, text);
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
      width: 150,
      height: 60,
      text: '新しいセリフ',
      fontSize: 14,
      color: '#000000',
      writing: 'horizontal',
      fontFamily: 'sans-serif'
    };
    setBubblePositions([...bubblePositions, newBubble]);
  };
  
  const handleBubbleDrag = (index: number, updates: Partial<BubblePosition>) => {
    const newBubbles = [...bubblePositions];
    
    // 更新前の元の位置をログに出力
    console.log(`バブル ${index} 位置更新:`, {
      before: { x: newBubbles[index].x, y: newBubbles[index].y },
      updates
    });
    
    // 位置を更新
    newBubbles[index] = { 
      ...newBubbles[index], 
      ...updates,
      // 負の値を防止（画面外に出ないように）
      x: Math.max(0, updates.x !== undefined ? updates.x : newBubbles[index].x),
      y: Math.max(0, updates.y !== undefined ? updates.y : newBubbles[index].y)
    };
    
    // 更新後の位置をログに出力
    console.log(`バブル ${index} 位置更新後:`, { 
      after: { x: newBubbles[index].x, y: newBubbles[index].y }
    });
    
    setBubblePositions(newBubbles);
    
    // 状態更新のバッチ処理を確保するため、タイムアウトを設定
    // これによりレンダリングの過剰な発生を防止
    clearTimeout((window as any).bubbleUpdateTimeout);
    (window as any).bubbleUpdateTimeout = setTimeout(() => {
      console.log('バブル位置更新完了', newBubbles);
    }, 100);
  };
  
  const handleBubbleResize = (index: number, width: number, height: number) => {
    const newBubbles = [...bubblePositions];
    // サイズの制限を設ける（最小値と最大値）
    newBubbles[index].width = Math.min(Math.max(80, width), 300);
    newBubbles[index].height = Math.min(Math.max(30, height), 200);
    setBubblePositions(newBubbles);
  };
  
  const handleBubbleTextChange = (index: number, text: string) => {
    console.log('テキスト変更:', index, text);
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
  
  const handleBubbleOpacityChange = (index: number, opacity: number) => {
    const newBubbles = [...bubblePositions];
    newBubbles[index].opacity = opacity;
    setBubblePositions(newBubbles);
  };
  
  const handleBubbleStyleChange = (index: number, style: string) => {
    const newBubbles = [...bubblePositions];
    newBubbles[index].bubbleStyle = style as 'anime' | 'round' | 'cloud' | 'think' | 'shout';
    setBubblePositions(newBubbles);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag ended', event);
  };
  
  // 保存方法切り替えハンドラを追加
  const handleSaveMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSaveMethod(e.target.value as SaveMethod);
  };

  // 直接画像を保存する関数を追加
  const saveImageDirectly = async () => {
    try {
      // 元の画像URLを取得
      const imageUrl = content?.imageUrl || '';
      if (!imageUrl) {
        alert('保存する画像がありません');
        return;
      }

      // 画像URLがBlobURLの場合は直接使用、そうでない場合はfetchして変換
      let blob: Blob;
      if (imageUrl.startsWith('blob:')) {
        // BlobURLから元のBlobを取得
        const response = await fetch(imageUrl);
        blob = await response.blob();
      } else {
        // 外部URLの場合はCORSをバイパスするためサーバーサイドで処理
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`);
        blob = await response.blob();
      }

      // ファイル名を設定して保存
      const fileName = projectName || `illustrated-guide-${new Date().toISOString().slice(0, 10)}`;
      saveAs(blob, `${fileName}.png`);
      
      console.log('画像を直接保存しました: ', imageUrl);
    } catch (error) {
      console.error('画像の直接保存に失敗しました', error);
      alert('画像の保存に失敗しました。もう一度お試しください。');
    }
  };

  // 新しいsaveWithCanvas関数を追加
  const saveWithCanvas = async () => {
    try {
      // 元の画像を取得
      const imageUrl = content?.imageUrl || '';
      if (!imageUrl) {
        alert('保存する画像がありません');
        return;
      }

      // 画像を読み込む
      const img = new Image();
      img.crossOrigin = 'anonymous'; // CORS対応
      
      // 画像ロード後の処理をPromiseでラップ
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
        
        // 画像URLがBlobURLの場合は直接使用、そうでない場合はプロキシを経由
        if (imageUrl.startsWith('blob:')) {
          img.src = imageUrl;
        } else {
          img.src = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        }
      });
      
      // Canvasを作成
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D contextの取得に失敗しました');
      }
      
      // 元画像のサイズでCanvasを初期化
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // 背景画像を描画
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // 吹き出しを描画
      for (const bubble of bubblePositions) {
        // 吹き出しの背景
        ctx.save();
        
        // 吹き出しスタイルを適用
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity || 0.85})`;
        
        // 吹き出しの形状に応じて描画方法を変える
        const bubbleStyle = bubble.bubbleStyle || 'anime';
        const x = bubble.x;
        const y = bubble.y;
        const width = bubble.width;
        const height = bubble.height;
        
        // 吹き出しの描画（スタイルによって分岐）
        switch (bubbleStyle) {
          case 'round':
            // 丸型吹き出し
            ctx.beginPath();
            drawRoundedRect(ctx, x, y, width, height, 20);
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
            
          case 'cloud':
            // もくもく吹き出し
            ctx.beginPath();
            drawRoundedRect(ctx, x, y, width, height, [20, 20, 20, 5]);
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
            
          case 'think':
            // 考え事吹き出し
            ctx.beginPath();
            drawRoundedRect(ctx, x, y, width, height, 15);
            ctx.fill();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 考え事の丸（小）
            ctx.beginPath();
            ctx.arc(x + 10, y + height + 10, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // 考え事の丸（極小）
            ctx.beginPath();
            ctx.arc(x + 5, y + height + 20, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
            
          case 'shout':
            // 叫び吹き出し
            ctx.save();
            ctx.translate(x, y);
            ctx.transform(1, 0, -0.1, 1, 0, 0); // 少し傾ける
            ctx.fillRect(0, 0, width, height);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, width, height);
            ctx.restore();
            break;
            
          case 'anime':
          default:
            // 標準吹き出し
            ctx.beginPath();
            drawRoundedRect(ctx, x, y, width, height, 8);
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 吹き出しの尻尾
            ctx.beginPath();
            ctx.moveTo(x + 17, y + height);
            ctx.lineTo(x + 30, y + height + 13);
            ctx.lineTo(x + 43, y + height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        }
        
        // テキストを描画
        ctx.restore();
        ctx.save();
        
        // テキストスタイルを設定
        ctx.fillStyle = bubble.color || '#000';
        ctx.font = `${bubble.fontWeight || ''} ${bubble.fontSize}px ${bubble.fontFamily || 'sans-serif'}`;
        ctx.textBaseline = 'top';
        
        // テキストの配置を調整
        const paddingX = 10; // 左右の余白
        const paddingY = 10; // 上下の余白
        const textX = x + paddingX;
        const textY = y + paddingY;
        const textWidth = width - (paddingX * 2);
        
        // 縦書き/横書きの処理
        if (bubble.writing === 'vertical') {
          // 縦書き処理は複雑なので、ここではシンプルに実装
          // （より高度な縦書き処理が必要な場合は追加実装が必要）
          ctx.save();
          ctx.translate(textX + textWidth, textY);
          ctx.rotate(Math.PI/2);
          
          const lines = bubble.text.split('\n');
          const lineHeight = bubble.fontSize * 1.2;
          
          lines.forEach((line, i) => {
            ctx.fillText(line, 0, i * lineHeight * -1);
          });
          
          ctx.restore();
        } else {
          // 横書き（標準的なテキスト描画）
          const lines = bubble.text.split('\n');
          const lineHeight = bubble.fontSize * 1.2;
          
          lines.forEach((line, i) => {
            ctx.fillText(line, textX, textY + (i * lineHeight));
          });
        }
        
        ctx.restore();
      }
      
      // Canvasから画像を生成してダウンロード
      const fileName = projectName || `illustrated-guide-${new Date().toISOString().slice(0, 10)}`;
      canvas.toBlob(blob => {
        if (blob) {
          saveAs(blob, `${fileName}.png`);
          console.log('Canvasから画像を保存しました');
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Canvas画像の保存に失敗しました', error);
      alert('画像の保存に失敗しました。もう一度お試しください。');
    }
  };
  
  // handleDownload関数を更新して、選択された方法で保存
  const handleDownload = async () => {
    if (saveMethod === 'direct') {
      await saveImageDirectly();
    } else {
      await saveWithCanvas();
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
      imageUrl: content?.imageUrl || fallbackImageUrl,
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
        style={{ maxWidth: '100%', minHeight: '500px' }}
      >
        {isMultiPanelComic ? (
          // マルチパネルイラストの表示（1枚の画像にすべてのコマが含まれる）
          <div className="relative overflow-hidden" style={{ width: '100%', aspectRatio: '16/9' }}>
            <div className="absolute inset-0" ref={contentContainerRef}>
              <Image 
                ref={imageRef}
                src={content?.imageUrl || fallbackImageUrl} 
                alt="ナビゲーションイラスト"
                fill
                style={{ objectFit: 'contain' }}
                priority
                className="comic-image"
              />
              
              {/* 吹き出し編集エリア */}
              <DndContext onDragEnd={handleDragEnd}>
                <BubbleDropArea>
                  {bubblePositions.map((bubble, idx) => (
                    <DraggableBubble 
                      key={idx}
                      bubble={bubble}
                      index={idx}
                      onUpdate={handleBubbleDrag}
                      onTextChange={handleBubbleTextChange}
                      onResize={handleBubbleResize}
                      onDelete={handleBubbleDelete}
                      onStyleChange={handleBubbleStyleChange}
                      onFontChange={handleBubbleFontChange}
                      onOpacityChange={handleBubbleOpacityChange}
                    />
                  ))}
                </BubbleDropArea>
              </DndContext>
            </div>
            
            {/* キャプション表示 */}
            {showCaptions && content?.caption && (
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 p-2 text-white text-sm ui-control">
                {content?.caption}
              </div>
            )}
          </div>
        ) : (
          // 個別パネルの表示（複数の画像がある場合）
          <div className="grid grid-cols-2 gap-4">
            {/* 個別パネルモードは新しいAPIでは非対応のため削除または修正 */}
            <div className="text-center p-4">
              <p className="text-gray-600">個別パネルモードは現在対応していません。</p>
            </div>
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
                      onChange={(e) => handleBubbleDrag(index, { x: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Y位置</label>
                    <input 
                      type="number" 
                      className="input-field" 
                      value={bubble.y}
                      onChange={(e) => handleBubbleDrag(index, { y: Number(e.target.value) })}
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
                    onChange={(e) => handleBubbleDrag(index, { fontSize: Number(e.target.value) })}
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
                  width: Math.min(Math.max(100, text.length * 8), 200),
                  height: Math.min(Math.max(40, Math.ceil(text.length / 10) * 20), 100),
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
        <div className="flex items-center space-x-2">
          <select 
            value={saveMethod}
            onChange={handleSaveMethodChange}
            className="p-2 border rounded"
          >
            <option value="direct">原画像を保存</option>
            <option value="html2canvas">吹き出し込みで保存</option>
          </select>
          
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleDownload}
          >
            画像を保存
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
