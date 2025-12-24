export default function Tile({ tile, onClick, empty = false }) {
  if (empty) {
    return <div className="tile empty">?</div>;
  }
  
  return (
    <div className="tile" onClick={() => onClick(tile)}>
      {tile.char}
    </div>
  );
}