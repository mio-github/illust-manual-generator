import React, { useDraggable } from 'react-dnd';

const DraggableBubble = ({ bubble, index }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `bubble-${index}`,
    data: {
      type: 'bubble',
      index,
      position: { x: bubble.x, y: bubble.y }
    }
  });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    position: 'absolute',
    left: `${bubble.x}px`,
    top: `${bubble.y}px`,
    width: `${bubble.width}px`,
    minHeight: `${bubble.height}px`,
    backgroundColor: `rgba(255, 255, 255, ${bubble.opacity || 0.95})`,
    borderRadius: getBubbleRadius(),
    borderWidth: '2px',
    borderStyle: getBubbleStyle(),
    borderColor: '#333',
    padding: '8px',
    zIndex: 10,
    cursor: 'move',
    userSelect: 'none',
    fontFamily: bubble.fontFamily || 'sans-serif',
    fontSize: `${bubble.fontSize}px`,
    fontWeight: bubble.fontWeight || 'normal',
    color: bubble.color || '#000',
    writingMode: bubble.writing === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
    maxWidth: '300px', // 最大幅を設定して無限に広がるのを防止
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      {/* Bubble content */}
    </div>
  );
};

export default DraggableBubble; 