# Инструкция к приложению Orlikov Home

## Общая архитектура

Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + CSS Modules.

```
app/                    — страницы (маршруты)
components/             — UI-компоненты
config/                 — конфигурация сайта и страниц
context/                — глобальный React-контекст
backups/                — снимки для отката (цвета)
public/                 — статика (logo.svg, img/)
```

### Маршруты

| URL | Страница | Компонент |
|-----|----------|-----------|
| `/` | Главная | `Hero` (слоган + ссылка) |
| `/about` | О нас | `PageHero` |
| `/apartamenty` | Апартаменты | `PageHero` |

Каждая страница: `Header` + hero-блок + `RequestForm` (форма заявки справа внизу).

---

## Конфигурация

### `config/site.ts` — общие данные сайта

- Бренд, meta, контакты (телефон, email, соцсети)
- Тексты формы заявки
- Пути к ассетам (`logo.svg`, слоган)
- Hero-настройки (фоновое изображение, ссылка «Перейти к предложениям»)

### `config/pages.ts` — навигация и страницы

Единый источник правды для:

- **HeaderNav** (кружки в шапке)
- **HeroPagination** (точки справа)

```ts
pagesConfig = [
  { id: "home", label: "Главная", href: "/" },
  { id: "about", label: "О нас", href: "/about", meta, content },
  { id: "apartments", label: "Апартаменты", href: "/apartamenty", meta, content },
]
```

#### Как добавить новую страницу

1. Добавить запись в `pagesConfig` с `meta` и `content`
2. Создать файл `app/<slug>/page.tsx` по образцу `app/about/page.tsx`
3. Навигация и пагинация подхватят изменения автоматически

---

## Компоненты

### Layout

- **`app/layout.tsx`** — шрифты (Open Sans, Roboto), `MainProvider`, CSS-переменные высоты header
- **`MainProvider`** — контекст (контакты, слайдеры)

### Header

- **`HeaderTop`** — email, `HeaderNav`, кнопка телефона (client — контекст)
- **`HeaderLogo`** — логотип через `next/image` + `Link` на главную (server)
- **`HeaderNav`** — навигация из `pagesConfig`, активная страница по `usePathname()`

### Hero (только главная)

- Фоновое фото, слоган (`SvgLogo`), `HeroOffersLink`, пагинация, `SocialInfo`

### PageHero (внутренние страницы)

- Тот же каркас: фон, заголовок, текст из `pagesConfig`, пагинация, соцсети

### UI

- **`Button`** — единый компонент кнопок/ссылок
- **`Loader`** — оверлей при переходах между страницами
- **`next/image`** — все изображения (логотип, слоган, hero-фоны), SVG через `dangerouslyAllowSVG` в `next.config.ts`
- **`next/link`** — внутренняя навигация (логотип, `Button`, пагинация)

### Форма

- **`RequestForm`** — фиксированная карточка справа внизу, `id="request-form"`

---

## Стилевая модель

### Принцип: CSS-переменные + CSS Modules

Глобальные токены — в `app/globals.css`.  
Локальные стили компонентов — в `*.module.css` рядом с компонентом.

Tailwind используется точечно (layout: `mx-auto`, `flex`, `px-4`), основной визуал — через переменные и модули.

---

## CSS-переменные

### Базовые цвета

| Переменная | Значение | Назначение |
|------------|----------|------------|
| `--background` | `#16191c` | Фон сайта |
| `--foreground` | `#ffffff` | Основной текст |
| `--color-dark` | `#16191c` | Тёмные поверхности |
| `--color-primary` | `#ffac30` | Акцент (оранжево-золотой) |
| `--color-theme` | `#fdbb59` | Второй золотой оттенок |
| `--color-light-dark` | `#8e8b8b` | Приглушённый серый |

### Семантические токены

| Переменная | Назначение |
|------------|------------|
| `--color-surface-dark` | Тёмная подложка кружков/кнопок `rgba(22,25,28,0.82)` |
| `--color-gold-border` | Тонкая золотая рамка в покое |
| `--color-gold-border-active` | Яркая рамка при hover/active |
| `--color-cta` | Сплошные CTA-кнопки (`#fdbb59`) |
| `--color-cta-hover` | Hover CTA (`#ffac30`) |

### Layout и шрифты

| Переменная | Назначение |
|------------|------------|
| `--header-height-top` | Высота шапки (90px, из `siteConfig` в `layout.tsx`) |
| `--header-height` | Общая высота header |
| `--font-open-sans` | Основной шрифт (body, кнопки) |
| `--font-roboto` | Заголовки (форма, вертикальный текст) |

### Как применять в CSS Modules

```css
.myElement {
  border: 1px solid var(--color-gold-border);
  background: var(--color-surface-dark);
}

.myElement:hover {
  border-color: var(--color-gold-border-active);
}
```

**Правило:** outline-элементы (навигация, телефон, «Перейти к предложениям») — через `--color-gold-border` + `--color-surface-dark`. Сплошная заливка — только CTA (`--color-cta`).

---

## Компонент `Button`

Путь: `components/ui/Button`

### Варианты (`variant`)

- **`outline`** — тёмный фон + золотой ободок (эталон дизайна)
- **`solid`** — сплошная кнопка (форма «Отправить»)

### Размеры (`size`)

- `sm` — компактный
- `md` — навигация в header
- `lg` — «Перейти к предложениям»

### Дополнительные пропсы

- `active` — активная рамка (текущая страница)
- `stacked` — колонка (телефон: подпись + номер)
- `fullWidth` — на всю ширину
- `rounded="md"` — скругление 8px (форма)
- `href` — автоматически рендерит `Link`, `<a>` или `tel:` / `mailto:`

### Примеры

```tsx
// Навигация
<Button href="/about" variant="outline" size="md" active={isActive}>
  О нас
</Button>

// Телефон
<Button href="tel:+7..." variant="outline" stacked>
  <span className={styles.phoneBtnLabel}>Позвоните нам</span>
  <span className={styles.phoneBtnNumber}>+7 (999) ...</span>
</Button>

// CTA форма
<Button type="submit" variant="solid" fullWidth rounded="md">
  Отправить
</Button>
```

---

## Навигация и пагинация

Обе берут данные из `pagesConfig`:

```
HeaderNav (шапка)          HeroPagination (точки справа)
        ↓                            ↓
              pagesConfig
        ↓                            ↓
   Button outline md          точка + кружок с подписью при hover
```

**Активное состояние:** `pathname === page.href`  
На `/` активна «Главная».

При hover на точку пагинации слева появляется кружок с названием страницы.

---

## Loader между страницами

Используется стандартный механизм Next.js — [`app/loading.tsx`](app/loading.tsx).

- Next.js сам показывает лоадер, пока грузится новый маршрут
- Если страница уже в кэше или была prefetch — переход мгновенный, лоадер не появляется
- Никаких ручных обработчиков кликов и списков посещённых страниц не нужно

---

## Структура стилей по файлам

| Файл | Что стилизует |
|------|---------------|
| `app/globals.css` | Переменные, body |
| `components/ui/Button/styles/button.module.css` | Все outline/solid кнопки |
| `components/Header/styles/header.module.css` | Шапка, email, подписи телефона |
| `components/Hero/styles/hero.module.css` | Hero, пагинация, offersLink-анимации |
| `components/RequestForm/styles/request-form.module.css` | Белая форма |
| `components/SocialInfo/styles/social-info.module.css` | Вертикальная панель слева |
| `components/Loader/styles/loader.module.css` | Оверлей загрузки |

Компонент-специфичные стили (стрелка offers, подписи телефона) остаются в своих модулях и дополняют `Button` через `className`.

---

## Как менять дизайн безопасно

1. **Цвета глобально** — править переменные в `globals.css`
2. **Кнопки** — в основном `Button` + `button.module.css`
3. **Тексты страниц** — `config/pages.ts` и `config/site.ts`
4. **Откат цветов** — `backups/colors-before-unify.md`

---

## Запуск

```bash
npm run dev    # разработка
npm run build  # сборка
npm run lint   # проверка
```
