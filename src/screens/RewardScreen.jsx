export default function RewardScreen({ enemy, onNext }) {
  return (
    <div className="reward-screen">
      <h2>VICTORY!</h2>
      <p>The {enemy?.name} is vanquished.</p>
      <div className="controls">
        {/* Placeholder for future upgrades */}
        <button className="cast-btn" onClick={onNext}>
          Next Encounter ➡
        </button>
      </div>
    </div>
  );
}