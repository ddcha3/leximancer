export default function EnemyDisplay({ enemy }) {
  if (!enemy) return null;

  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const wpPercent = Math.max(0, (enemy.wp / enemy.maxWp) * 100);

  return (
    <div className="battle-area">
      <div className="enemy-emoji">{enemy.emoji}</div>
      <h3>{enemy.name}</h3>
      
      <div className="bars">
        <div className="bar">
          <div className="bar-fill hp-fill" style={{ width: `${hpPercent}%` }}></div>
          <span className="bar-text">HP: {enemy.hp}</span>
        </div>
        <div className="bar">
          <div className="bar-fill wp-fill" style={{ width: `${wpPercent}%` }}></div>
          <span className="bar-text">WP: {enemy.wp}</span>
        </div>
      </div>
      
      <p style={{ fontSize: '0.8em', color: '#888', marginTop: '10px' }}>
        {enemy.desc}
      </p>
    </div>
  );
}