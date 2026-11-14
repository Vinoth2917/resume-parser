// The top bar: the product name and one action.
export default function Header() {
  return (
    <header className="site-header">
      <span className="wordmark">Resume Match</span>
      <a href="#check" className="site-nav__link">
        Check my résumé
      </a>
    </header>
  );
}
