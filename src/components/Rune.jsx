import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { LETTER_SCORES } from '../data/player';

function RuneVisual({
  rune,
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
  const score = LETTER_SCORES[rune.char] || 1;
  const isHidden = (isDragging || isActive) && !isOverlay;
  const isGhost = showGhostPlaceholder && isHidden;
  const enableLayoutAnimation = layoutEnabled && !isDragging && !isOverlay;
  const interactive = !isOverlay && !isDragging && !isHidden && !isActive;
  const hoverMotion = interactive ? { y: -4, scale: 1.05 } : undefined;
  const tapMotion = interactive ? { scale: 0.95, y: 0 } : undefined;
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
  const className = `rune${isGhost ? ' empty' : ''}`;

  return (
    <motion.div
      // Keep framer layout animation for shuffles, but disable it while dragging to avoid flicker
      layout={enableLayoutAnimation ? "position" : false}
      ref={setNodeRef}
      className={className}
      onClick={() => !isDragging && !isOverlay && onClick && onClick(rune)}
      style={style}
      {...listeners}
      {...attributes}
      animate={{ y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileHover={hoverMotion}
      whileTap={tapMotion}
    >
      {!isGhost && (
        <>
          {rune.char}
          <span className="rune-score">{score}</span>
        </>
      )}
    </motion.div>
  );
}

function SortableRune(props) {
  const { rune, isOverlay } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: rune.id,
    data: { rune }
  });

  return (
    <RuneVisual
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

function DraggableRune(props) {
  const { rune, isOverlay } = props;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: rune.id,
    data: { rune }
  });

  return (
    <RuneVisual
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

export default function Rune({ rune, onClick, empty = false, isOverlay = false, sortable = false, isActive = false, showGhostPlaceholder = false }) {
  if (empty) {
    return <div className="rune empty"></div>;
  }

  if (isOverlay) {
    return <RuneVisual rune={rune} onClick={onClick} isOverlay layoutEnabled={false} />;
  }

  return sortable
    ? <SortableRune rune={rune} onClick={onClick} isActive={isActive} showGhostPlaceholder={showGhostPlaceholder} />
    : <DraggableRune rune={rune} onClick={onClick} isActive={isActive} showGhostPlaceholder={showGhostPlaceholder} />;
}
