import PixelEmoji from '../components/PixelEmoji';

export default function RewardScreen({ enemy, onNext }) {
  return (
    <div className="reward-screen">
      <h2>VICTORY!</h2>
      <p>{enemy?.name} dispelled.</p>
      <div className="controls">
        {/* Placeholder for future upgrades */}
        <button className="cast-btn" 
          style={{marginTop: '30px', fontSize: '1rem', fontFamily: 'FFFFORWA', background: 'var(--accent-red)'}}
          onClick={onNext}>
          NEXT ENCOUNTER <PixelEmoji icon="➡"/>
        </button>
      </div>
    </div>
  );
}