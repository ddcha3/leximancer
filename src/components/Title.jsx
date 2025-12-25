export default function Title({ text }) {
  if (!text) return null;
  
  const first = text.charAt(0);
  const middle = text.slice(1, -1);
  const last = text.slice(-1);

  return (
    <h1 className="game-title">
      <span className="big-cap">{first}</span>
      {middle}
      <span className="big-cap">{last}</span>
    </h1>
  );
}