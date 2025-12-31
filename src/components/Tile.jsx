import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { LETTER_SCORES } from '../data/player';

function TileVisual({
  tile,
  onClick,
  listeners = {},
  attributes = {},
  setNodeRef,
  transform,
  transition,
  isDragging,
  isOverlay,
  layoutEnabled = true,
  isActive = false,
  showGhostPlaceholder = false
}) {
  const score = LETTER_SCORES[tile.char] || 1;
  const isHidden = (isDragging || isActive) && !isOverlay;
  const isGhost = showGhostPlaceholder && isHidden;
  const enableLayoutAnimation = layoutEnabled && !isDragging && !isOverlay;
  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 50 : (isOverlay ? 100 : 'auto'),
    pointerEvents: isHidden ? 'none' : 'auto',
    cursor: isOverlay ? 'grabbing' : 'grab'
  };
  if (isHidden && !isGhost) {
    style.opacity = 0;
    style.visibility = 'hidden';
  }
  const className = `tile${isGhost ? ' empty' : ''}`;

  return (
    <motion.div
      // Keep framer layout animation for shuffles, but disable it while dragging to avoid flicker
      layout={enableLayoutAnimation ? "position" : false}
      ref={setNodeRef}
      className={className}
      onClick={() => !isDragging && !isOverlay && onClick && onClick(tile)}
      style={style}
      {...listeners}
      {...attributes}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileHover={!isOverlay && !isDragging ? { y: -4, scale: 1.05 } : undefined}
      whileTap={!isOverlay && !isDragging ? { scale: 0.95, y: 0 } : undefined}
    >
      {!isGhost && (
        <>
          {tile.char}
          <span className="tile-score">{score}</span>
        </>
      )}
    </motion.div>
  );
}

function SortableTile(props) {
  const { tile, isOverlay } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: tile.id,
    data: { tile }
  });

  return (
    <TileVisual
      {...props}
      listeners={listeners}
      attributes={attributes}
      setNodeRef={setNodeRef}
      transform={transform}
      transition={transition}
      layoutEnabled={false}
      isDragging={isDragging}
      isOverlay={isOverlay}
    />
  );
}

function DraggableTile(props) {
  const { tile, isOverlay } = props;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tile.id,
    data: { tile }
  });

  return (
    <TileVisual
      {...props}
      listeners={listeners}
      attributes={attributes}
      setNodeRef={setNodeRef}
      transform={transform}
      transition={undefined}
      layoutEnabled={!isOverlay}
      isDragging={isDragging}
      isOverlay={isOverlay}
    />
  );
}

export default function Tile({ tile, onClick, empty = false, isOverlay = false, sortable = false, isActive = false, showGhostPlaceholder = false }) {
  if (empty) {
    return <div className="tile empty"></div>;
  }

  if (isOverlay) {
    return <TileVisual tile={tile} onClick={onClick} isOverlay layoutEnabled={false} />;
  }

  return sortable
    ? <SortableTile tile={tile} onClick={onClick} isActive={isActive} showGhostPlaceholder={showGhostPlaceholder} />
    : <DraggableTile tile={tile} onClick={onClick} isActive={isActive} showGhostPlaceholder={showGhostPlaceholder} />;
}