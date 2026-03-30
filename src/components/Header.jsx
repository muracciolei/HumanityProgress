function Header({ title, subtitle, theme, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="title-wrap">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <button className="theme-button" type="button" onClick={onToggleTheme}>
          {theme === "light" ? "Switch to Dark" : "Switch to Light"}
        </button>
      </div>
    </header>
  );
}

export default Header;
