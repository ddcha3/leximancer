export default function StartScreen({ onStart, avatar }) {
  return (
    <div className="start-screen">
      <h1>LEXIMANCER</h1>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{avatar}</div>
      <p>Letters are your mana. Words are your spells.</p>
      <button className="cast-btn" onClick={onStart}>Enter Dungeon</button>
    </div>
  );
}