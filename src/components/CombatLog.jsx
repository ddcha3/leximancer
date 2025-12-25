import { useEffect, useRef } from "react";

export default function CombatLog({ logs }) {
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const formatText = (text) => {
    // Regex now matches *bold*, #red#, or ^purple^
    const parts = text.split(/(\*.*?\*|#.*?#|\^.*?\^)/g);

    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return <span key={index} className="log-damage">{part.slice(1, -1)}</span>;
      }
      if (part.startsWith("#") && part.endsWith("#")) {
        return <span key={index} className="log-enemy">{part.slice(1, -1)}</span>;
      }
      if (part.startsWith("^") && part.endsWith("^")) {
        return <span key={index} className="log-spell">{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  return (
    <div className="log" ref={logContainerRef}>
      {logs.map((l, i) => (
        <div key={i}>{formatText(l)}</div>
      ))}
    </div>
  );
}