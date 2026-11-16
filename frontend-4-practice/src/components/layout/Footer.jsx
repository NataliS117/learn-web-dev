const SOCIAL_LINKS = [
  { label: "Telegram", href: "#" },
  { label: "WhatsApp", href: "#" },
  { label: "VK", href: "#" },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <a className="logo logo--footer" href="#" aria-label="Салон красоты Лотос — на главную">
            <span className="logo__mark logo__mark--footer" aria-hidden="true">
              Л
            </span>
            <span className="logo__text">
              <span className="logo__name logo__name--footer">Лотос</span>
              <span className="logo__caption logo__caption--footer">салон красоты</span>
            </span>
          </a>
          <p className="site-footer__description">
            Место, где забота о себе становится спокойным ритуалом. Мастера с медицинским
            образованием, премиальные материалы и время только для вас.
          </p>
        </div>

        <div className="site-footer__column">
          <h3 className="site-footer__title">Контакты</h3>
          <address className="site-footer__address">
            <p className="site-footer__text">Москва, ул. Большая Дмитровка, 12</p>
            <a className="site-footer__link" href="tel:+74951204567">
              +7 (495) 120-45-67
            </a>
            <a className="site-footer__link" href="mailto:hello@lotos-salon.ru">
              hello@lotos-salon.ru
            </a>
          </address>
        </div>

        <div className="site-footer__column">
          <h3 className="site-footer__title">Часы работы</h3>
          <p className="site-footer__text">Пн–Вс: 10:00–21:00</p>
          <p className="site-footer__text">Онлайн-запись — круглосуточно</p>
          <nav className="site-footer__socials" aria-label="Социальные сети">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.label} className="site-footer__social" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p className="site-footer__copyright">© 2026 Салон красоты «Лотос». Все права защищены.</p>
        <a className="site-footer__policy" href="#">
          Политика конфиденциальности
        </a>
      </div>
    </footer>
  );
}

export default Footer;
