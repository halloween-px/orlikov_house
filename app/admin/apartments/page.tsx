"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { availabilityMeta } from "@/config/apartments";
import type { ApartmentAvailability } from "@/config/apartments";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import styles from "../admin.module.css";

type AdminApartmentRow = {
  id: string;
  unit: number;
  floor: number;
  area: string;
  title: string;
  description: string;
  price: number;
  priceOld?: number;
  promo?: boolean;
  availability: ApartmentAvailability;
  highlights: string[];
  hidden: boolean;
  hasOverride: boolean;
  preview: string;
};

type EditDraft = {
  title: string;
  description: string;
  price: string;
  priceOld: string;
  promo: boolean;
  availability: ApartmentAvailability;
  highlights: string;
  hidden: boolean;
};

function toDraft(apartment: AdminApartmentRow): EditDraft {
  return {
    title: apartment.title,
    description: apartment.description,
    price: String(apartment.price),
    priceOld: apartment.priceOld != null ? String(apartment.priceOld) : "",
    promo: Boolean(apartment.promo),
    availability: apartment.availability,
    highlights: apartment.highlights.join(", "),
    hidden: apartment.hidden,
  };
}

function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export default function AdminApartmentsPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [apartments, setApartments] = useState<AdminApartmentRow[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");

  const loadApartments = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/admin/apartments", {
        cache: "no-store",
      });
      if (response.status === 401) {
        setAuthed(false);
        setApartments([]);
        return;
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setLoadError(data?.error || "Не удалось загрузить студии");
        setAuthed(true);
        return;
      }
      const data = (await response.json()) as { apartments: AdminApartmentRow[] };
      setApartments(data.apartments);
      setAuthed(true);
    } catch {
      setLoadError("Не удалось загрузить студии");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApartments();
  }, [loadApartments]);

  const visibleRows = useMemo(() => {
    if (filter === "visible") return apartments.filter((item) => !item.hidden);
    if (filter === "hidden") return apartments.filter((item) => item.hidden);
    return apartments;
  }, [apartments, filter]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        setAuthError(data?.error || "Ошибка входа");
        return;
      }
      setPassword("");
      await loadApartments();
    } catch {
      setAuthError("Ошибка входа");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setApartments([]);
    setEditingId(null);
    setDraft(null);
  };

  const startEdit = (apartment: AdminApartmentRow) => {
    setEditingId(apartment.id);
    setDraft(toDraft(apartment));
    setSaveError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
    setSaveError("");
  };

  const saveEdit = async () => {
    if (!editingId || !draft) return;

    const price = Number(draft.price.replace(/\s/g, ""));
    const priceOldRaw = draft.priceOld.replace(/\s/g, "");
    const priceOld =
      priceOldRaw === "" ? null : Number(priceOldRaw.replace(/\s/g, ""));

    if (!Number.isFinite(price) || price < 0) {
      setSaveError("Укажите корректную цену");
      return;
    }
    if (priceOld != null && (!Number.isFinite(priceOld) || priceOld < 0)) {
      setSaveError("Укажите корректную старую цену или оставьте пустым");
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      const response = await fetch(`/api/admin/apartments/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          price,
          priceOld,
          promo: draft.promo,
          availability: draft.availability,
          highlights: draft.highlights
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          hidden: draft.hidden,
        }),
      });

      if (response.status === 401) {
        setAuthed(false);
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        apartment?: AdminApartmentRow;
      } | null;

      if (!response.ok || !data?.apartment) {
        setSaveError(data?.error || "Не удалось сохранить");
        return;
      }

      setApartments((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...data.apartment } : item,
        ),
      );
      setEditingId(null);
      setDraft(null);
    } catch {
      setSaveError("Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  if (authed === null) {
    return (
      <main className={styles.page}>
        <p className={styles.muted}>Проверяем сессию…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className={styles.page}>
        <form className={styles.loginCard} onSubmit={handleLogin}>
          <h1 className={styles.title}>Админка</h1>
          <p className={styles.muted}>Вход только для администратора</p>
          <label className={styles.field}>
            <span>Логин</span>
            <TextField
              mode="safe"
              value={login}
              onChange={setLogin}
              autoComplete="username"
              required
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span>Пароль</span>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {authError ? <p className={styles.error}>{authError}</p> : null}
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            fullWidth
            rounded="md"
            disabled={authLoading}
          >
            {authLoading ? "Входим…" : "Войти"}
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Студии</h1>
          <p className={styles.muted}>
            Статус, цена, текст и видимость лотов на сайте
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin" className={styles.navLink}>
            Аналитика
          </Link>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => void loadApartments()}
            disabled={loading}
          >
            Обновить
          </Button>
          <Button type="button" variant="outline" size="md" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </header>

      <div className={styles.filterRow}>
        <button
          type="button"
          className={filter === "all" ? styles.filterActive : styles.filterBtn}
          onClick={() => setFilter("all")}
        >
          Все ({apartments.length})
        </button>
        <button
          type="button"
          className={
            filter === "visible" ? styles.filterActive : styles.filterBtn
          }
          onClick={() => setFilter("visible")}
        >
          На сайте ({apartments.filter((item) => !item.hidden).length})
        </button>
        <button
          type="button"
          className={
            filter === "hidden" ? styles.filterActive : styles.filterBtn
          }
          onClick={() => setFilter("hidden")}
        >
          Скрытые ({apartments.filter((item) => item.hidden).length})
        </button>
      </div>

      {loadError ? <p className={styles.error}>{loadError}</p> : null}
      {saveError ? <p className={styles.error}>{saveError}</p> : null}

      <section className={styles.panel}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Лот</th>
                <th>Статус</th>
                <th>Цена</th>
                <th>Текст</th>
                <th>Видимость</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.muted}>
                    {loading ? "Загружаем…" : "Нет лотов"}
                  </td>
                </tr>
              ) : (
                visibleRows.map((apartment) => {
                  const isEditing = editingId === apartment.id;
                  return (
                    <tr
                      key={apartment.id}
                      className={apartment.hidden ? styles.rowHidden : undefined}
                    >
                      <td>
                        <div className={styles.lotCell}>
                          <strong>№ {apartment.unit}</strong>
                          <span className={styles.muted}>
                            {apartment.area} · {apartment.floor} эт.
                          </span>
                        </div>
                      </td>
                      <td>
                        {isEditing && draft ? (
                          <select
                            className={styles.select}
                            value={draft.availability}
                            onChange={(event) =>
                              setDraft({
                                ...draft,
                                availability: event.target
                                  .value as ApartmentAvailability,
                              })
                            }
                          >
                            {(
                              Object.keys(availabilityMeta) as ApartmentAvailability[]
                            ).map((key) => (
                              <option key={key} value={key}>
                                {availabilityMeta[key].label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          availabilityMeta[apartment.availability].label
                        )}
                      </td>
                      <td>
                        {isEditing && draft ? (
                          <div className={styles.editStack}>
                            <input
                              className={styles.input}
                              value={draft.price}
                              onChange={(event) =>
                                setDraft({ ...draft, price: event.target.value })
                              }
                              inputMode="numeric"
                              aria-label="Цена"
                            />
                            <input
                              className={styles.input}
                              value={draft.priceOld}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  priceOld: event.target.value,
                                })
                              }
                              inputMode="numeric"
                              placeholder="Старая цена"
                              aria-label="Старая цена"
                            />
                            <label className={styles.checkLabel}>
                              <input
                                type="checkbox"
                                checked={draft.promo}
                                onChange={(event) =>
                                  setDraft({
                                    ...draft,
                                    promo: event.target.checked,
                                  })
                                }
                              />
                              Акция
                            </label>
                          </div>
                        ) : (
                          <div className={styles.editStack}>
                            <strong>{formatPrice(apartment.price)}</strong>
                            {apartment.priceOld != null ? (
                              <span className={styles.muted}>
                                было {formatPrice(apartment.priceOld)}
                              </span>
                            ) : null}
                            {apartment.promo ? (
                              <span className={styles.badge}>Акция</span>
                            ) : null}
                          </div>
                        )}
                      </td>
                      <td>
                        {isEditing && draft ? (
                          <div className={styles.editStack}>
                            <input
                              className={styles.input}
                              value={draft.title}
                              onChange={(event) =>
                                setDraft({ ...draft, title: event.target.value })
                              }
                              aria-label="Заголовок"
                            />
                            <textarea
                              className={styles.textarea}
                              value={draft.description}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  description: event.target.value,
                                })
                              }
                              rows={2}
                              aria-label="Описание"
                            />
                            <input
                              className={styles.input}
                              value={draft.highlights}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  highlights: event.target.value,
                                })
                              }
                              placeholder="Теги через запятую"
                              aria-label="Теги"
                            />
                          </div>
                        ) : (
                          <div className={styles.editStack}>
                            <strong>{apartment.title}</strong>
                            <span className={styles.muted}>
                              {apartment.description}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        {isEditing && draft ? (
                          <label className={styles.checkLabel}>
                            <input
                              type="checkbox"
                              checked={draft.hidden}
                              onChange={(event) =>
                                setDraft({
                                  ...draft,
                                  hidden: event.target.checked,
                                })
                              }
                            />
                            Скрыть
                          </label>
                        ) : apartment.hidden ? (
                          <span className={styles.badgeMuted}>Скрыт</span>
                        ) : (
                          <span className={styles.badgeOk}>На сайте</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <div className={styles.rowActions}>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => void saveEdit()}
                              disabled={saving}
                            >
                              {saving ? "…" : "Сохранить"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              Отмена
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(apartment)}
                          >
                            Изменить
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
