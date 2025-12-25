import Title from "../components/Title"; // Import it

export default function StartScreen({ onStart, avatar, isLoading }) {
  return (
    <div className="start-screen">
      <Title text="LEXIMANCER" />
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{avatar}</div>
      <p>Letters are your mana. Words are your spells.</p>
      {isLoading ? (
        <button disabled style={{ opacity: 0.7 }}>Loading Dictionary...</button>
      ) : (
        <button className="cast-btn" onClick={onStart}>Enter the Archives</button>
      )}
    </div>
  );
}