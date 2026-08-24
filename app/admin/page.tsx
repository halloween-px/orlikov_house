"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import styles from "./admin.module.css";

type AdminStats = {
  kpi: {
    visitsToday: number;
    visits7d: number;
    visitsTotal: number;
    leadsToday: number;
    leadsTotal: number;
  };
  visitsByDay: Array<{ date: string; count: number }>;
  recentVisits: Array<{
    id: string;
    path: string;
    referrer: string;
    userAgent: string;
    visitor: string;
    createdAt: string;
  }>;
  recentLeads: Array<{
    id: string;
    name: string;
    phone: string;
    comment: string;
    source: string;
    visitor: string;
    createdAt: string;
  }>;
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDayLabel(date: string) {
  const [, month, day] = date.split("-");
  return `${day}.${month}`;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState("");
  const [statsLoading, setStatsLoading] = useState(false);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");
    try {
      const response = await fetch("/api/admin/stats", { cache: "no-store" });
      if (response.status === 401) {
        setAuthed(false);
        setStats(null);
        return;
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setStatsError(data?.error || "Не удалось загрузить статистику");
        setAuthed(true);
        return;
      }
      const data = (await response.json()) as AdminStats;
      setStats(data);
      setAuthed(true);
    } catch {
      setStatsError("Не удалось загрузить статистику");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const chartData = useMemo(
    () =>
      (stats?.visitsByDay || []).map((item) => ({
        ...item,
        label: formatDayLabel(item.date),
      })),
    [stats],
  );

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
      await loadStats();
    } catch {
      setAuthError("Ошибка входа");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setStats(null);
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
          <h1 className={styles.title}>Админка Орликов дом</h1>
          <p className={styles.muted}>Визиты и заявки с сайта</p>
        </div>
        <div className={styles.headerActions}>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => void loadStats()}
            disabled={statsLoading}
          >
            Обновить
          </Button>
          <Button type="button" variant="outline" size="md" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </header>

      {statsError ? <p className={styles.error}>{statsError}</p> : null}

      {stats ? (
        <>
          <section className={styles.kpiGrid}>
            <article className={styles.kpiCard}>
              <p className={styles.kpiLabel}>Визиты сегодня</p>
              <p className={styles.kpiValue}>{stats.kpi.visitsToday}</p>
            </article>
            <article className={styles.kpiCard}>
              <p className={styles.kpiLabel}>Визиты 7 дней</p>
              <p className={styles.kpiValue}>{stats.kpi.visits7d}</p>
            </article>
            <article className={styles.kpiCard}>
              <p className={styles.kpiLabel}>Визиты всего</p>
              <p className={styles.kpiValue}>{stats.kpi.visitsTotal}</p>
            </article>
            <article className={styles.kpiCard}>
              <p className={styles.kpiLabel}>Заявки сегодня</p>
              <p className={styles.kpiValue}>{stats.kpi.leadsToday}</p>
            </article>
            <article className={styles.kpiCard}>
              <p className={styles.kpiLabel}>Заявки всего</p>
              <p className={styles.kpiValue}>{stats.kpi.leadsTotal}</p>
            </article>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Посещения за 30 дней</h2>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e3aa50" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#e3aa50" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1612",
                      border: "1px solid rgba(227,170,80,0.35)",
                      borderRadius: 12,
                    }}
                    labelStyle={{ color: "#f5f0e8" }}
                    itemStyle={{ color: "#e3aa50" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Визиты"
                    stroke="#e3aa50"
                    fill="url(#visitsFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Заявки</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Имя</th>
                    <th>Телефон</th>
                    <th>Источник</th>
                    <th>Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.muted}>
                        Пока нет заявок
                      </td>
                    </tr>
                  ) : (
                    stats.recentLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{formatDateTime(lead.createdAt)}</td>
                        <td>{lead.name}</td>
                        <td>{lead.phone}</td>
                        <td>{lead.source}</td>
                        <td>{lead.comment || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Последние визиты</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Страница</th>
                    <th>Источник</th>
                    <th>Посетитель</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentVisits.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={styles.muted}>
                        Пока нет визитов
                      </td>
                    </tr>
                  ) : (
                    stats.recentVisits.map((visit) => (
                      <tr key={visit.id}>
                        <td>{formatDateTime(visit.createdAt)}</td>
                        <td>{visit.path}</td>
                        <td className={styles.ellipsis}>
                          {visit.referrer || "прямой / неизвестно"}
                        </td>
                        <td>{visit.visitor}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p className={styles.muted}>
          {statsLoading ? "Загружаем данные…" : "Нет данных"}
        </p>
      )}
    </main>
  );
}
