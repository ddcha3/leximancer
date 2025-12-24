import { useEffect, useRef } from "react";

export default function CombatLog({ logs }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="log">
      {logs.map((l, i) => <div key={i}>{l}</div>)}
      <div ref={logEndRef} />
    </div>
  );
}