/**
 * Header Component
 * Editorial masthead with serif question headline and concise research proposition.
 */
export default function Header() {
  return (
    <header className="masthead">
      <h1 className="masthead-title">
        Does your <span className="accent-word">startup idea</span> actually hold up?
      </h1>
      <p className="masthead-sub">
        Validate your concept with real-time empirical market research. Discover live competitor voids,
        unaddressed customer demand, and defensible white-space opportunities before allocating capital or engineering time.
      </p>
    </header>
  );
}
