# Снимок цветов до унификации (2026-07-15)

Чтобы откатить — верни значения из этого файла в соответствующие CSS-файлы.

## globals.css

```css
--color-primary: #ffac30;
--color-theme: #fdbb59;
--color-light-dark: #8e8b8b;
--color-dark: #16191c;
```

## header.module.css

```css
/* headerNavLink — без изменений, эталон */
border: 1px solid rgba(253, 187, 89, 0.35);
background: rgba(22, 25, 28, 0.82);
border-color (hover/active): rgba(255, 172, 48, 0.75);

/* linkEmail:hover */
color: #ffac30;

/* phoneBtn */
border: 1px solid rgba(253, 187, 89, 0.65);
background: rgba(253, 187, 89, 0.2);

/* phoneBtn:hover */
background: #fdbb59;
border-color: #fdbb59;
box-shadow: 0 8px 24px rgba(253, 187, 89, 0.25);
```

## hero.module.css

```css
/* paginationLabel */
border: 1px solid rgba(253, 187, 89, 0.35);
background: rgba(22, 25, 28, 0.82);
border-color (hover): rgba(255, 172, 48, 0.75);

/* paginationBullet::after */
background-color: #8e8b8b;

/* paginationBulletActive */
border-color: #8e8b8b;

/* paginationBulletActive::after */
background-color: #ffac30;

/* offersLink */
color: #ffac30;

/* offersLink:hover */
color: #fdbb59;

/* btnPrimary */
background-color: #fdbb59;

/* btnPrimary:hover */
background: transparent;
outline: 1px solid #fdbb59;
```

## request-form.module.css

```css
/* input:focus */
border-color: #fdbb59;

/* submit */
background: #fdbb59;

/* submit:hover */
background: #ffac30;
```

## social-info.module.css

```css
/* listSocial a:hover .socialIcon */
background-color: #ffac30;
```
