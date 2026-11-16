const NAV_LINKS = [
  { label: "Услуги", href: "#" },
  { label: "Мастера", href: "#" },
  { label: "Отзывы", href: "#" },
  { label: "Контакты", href: "#" },
];

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <a className="logo" href="#" aria-label="Салон красоты Лотос — на главную">
          <span className="logo__mark" aria-hidden="true">
            Л
          </span>
          <span className="logo__text">
            <span className="logo__name">Лотос</span>
            <span className="logo__caption">салон красоты</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <a key={link.label} className="site-nav__link" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="site-header__phone" href="tel:+74951204567">
            +7 (495) 120-45-67
          </a>
          <button className="button button--ghost site-header__login" type="button">
            Войти
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
