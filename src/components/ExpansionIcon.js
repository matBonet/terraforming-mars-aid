const EXPANSION_STYLES = {
  turmoil:  { bg: '#f5a623', border: 'black', triangle: 'black', direction: 'down' },
  colonies: { bg: '#888888', border: 'black', triangle: 'black', direction: 'up'   },
  venus:    { bg: '#4a90c4', border: 'black', triangle: 'white', direction: 'down' },
};

function ExpansionIcon({ source }) {
  const style = EXPANSION_STYLES[source];
  if (!style) return null;

  const points = style.direction === 'down'
    ? '2,3 8,3 5,7.5'
    : '2,7 8,7 5,2.5';

  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 10 10"
      style={{ marginLeft: '5px', flexShrink: 0, width: '1.4em', height: '1.4em' }}
      aria-label={source}
    >
      <circle cx="5" cy="5" r="4.5" fill={style.bg} stroke={style.border} strokeWidth="1" />
      <polygon points={points} fill={style.triangle} />
    </svg>
  );
}

export default ExpansionIcon;
