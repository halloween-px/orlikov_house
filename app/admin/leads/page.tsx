"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import {
  LEAD_ORIGINS,
  LEAD_STATUSES,
  leadOriginLabel,
  type AdminLead,
  type LeadOrigin,
  type LeadStatus,
} from "@/lib/lead-crm";
import styles from "../admin.module.css";

type LeadsResponse = {
  leads: AdminLead[];
  total: number;
  demo?: boolean;
};

type OriginFilter = "all" | LeadOrigin;
type StatusFilter = "all" | LeadStatus;

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

function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `tel:+${digits}` : "";
}

function detailLines(lead: AdminLead) {
  const lines = [...lead.answers];
  if (lead.lot && !lines.some((item) => item.label === "Лот")) {
    lines.push({ label: "Лот", value: lead.lot });
  }
  if (
    lead.comment &&
    !lines.some((item) => item.value === lead.comment)
  ) {
    lines.push({ label: "Комментарий клиента", value: lead.comment });
  }
  return lines;
}

function attributionLines(lead: AdminLead) {
  const utm = [lead.utmSource, lead.utmMedium].filter(Boolean).join(" / ");
  return [
    lead.source,
    utm ? `utm: ${utm}` : "",
    lead.utmTerm ? `фраза: ${lead.utmTerm}` : "",
    lead.yclid ? `yclid: ${lead.yclid}` : "",
  ].filter(Boolean);
}

function statusClass(status: LeadStatus) {
  switch (status) {
    case "new":
      return styles.status_new;
    case "in_progress":
      return styles.status_in_progress;
    case "no_answer":
      return styles.status_no_answer;
    case "viewing_scheduled":
      return styles.status_viewing_scheduled;
    case "viewing_done":
      return styles.status_viewing_done;
    case "no_show":
      return styles.status_no_show;
    case "not_fit":
      return styles.status_not_fit;
    case "reserved":
      return styles.status_reserved;
    case "deal":
      return styles.status_deal;
  }
}

function matchesQuery(lead: AdminLead, query: string) {
  if (!query) return true;
  const haystack = [
    lead.name,
    lead.phone,
    lead.channel,
    lead.source,
    lead.comment,
    lead.managerComment,
    lead.utmSource,
    lead.utmMedium,
    lead.utmCampaign,
    lead.utmContent,
    lead.utmTerm,
    ...lead.answers.flatMap((item) => [item.label, item.value]),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function LeadRow({
  lead,
  onSaved,
  onUnauthorized,
}: {
  lead: AdminLead;
  onSaved: (lead: AdminLead) => void;
  onUnauthorized: () => void;
}) {
  const [status, setStatus] = useState(lead.status);
  const [comment, setComment] = useState(lead.managerComment);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setStatus(lead.status);
  }, [lead.status]);

  useEffect(() => {
    setComment(lead.managerComment);
  }, [lead.managerComment]);

  const save = useCallback(
    async (patch: {
      status?: LeadStatus;
      managerComment?: string;
    }) => {
      setPending(true);
      setError("");
      setSaved(false);
      try {
        const response = await fetch(`/api/admin/leads/${lead.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (response.status === 401) {
          onUnauthorized();
          return false;
        }
        const data = (await response.json().catch(() => null)) as {
          lead?: AdminLead;
          error?: string;
        } | null;
        if (!response.ok || !data?.lead) {
          setError(data?.error || "Не удалось сохранить");
          return false;
        }
        onSaved(data.lead);
        setSaved(true);
        return true;
      } catch {
        setError("Не удалось сохранить");
        return false;
      } finally {
        setPending(false);
      }
    },
    [lead.id, onSaved, onUnauthorized],
  );

  const answers = detailLines(lead);
  const sourceLines = attributionLines(lead);

  return (
    <tr>
      <td className={styles.nowrap}>{formatDateTime(lead.createdAt)}</td>
      <td>
        <span
          className={
            lead.origin === "quiz" ? styles.badgeQuiz : styles.badgeSite
          }
        >
          {leadOriginLabel(lead.origin)}
        </span>
      </td>
      <td>
        <div className={styles.stack}>
          {lead.name ? <strong>{lead.name}</strong> : null}
          {phoneHref(lead.phone) ? (
            <a className={styles.phoneLink} href={phoneHref(lead.phone)}>
              {lead.phone}
            </a>
          ) : (
            <span>{lead.phone || "—"}</span>
          )}
          {lead.channel ? (
            <span className={styles.muted}>{lead.channel}</span>
          ) : null}
        </div>
      </td>
      <td>
        {answers.length === 0 ? (
          <span className={styles.muted}>—</span>
        ) : (
          <ul className={styles.answerList}>
            {answers.map((item) => (
              <li key={`${item.label}:${item.value}`}>
                <span className={styles.answerLabel}>{item.label}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        )}
      </td>
      <td>
        {sourceLines.length === 0 ? (
          <span className={styles.muted}>—</span>
        ) : (
          <div className={styles.stack}>
            {sourceLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        )}
      </td>
      <td>
        <div className={styles.stack}>
          <span>{lead.utmCampaign || "—"}</span>
          {lead.utmContent ? (
            <span className={styles.muted}>{lead.utmContent}</span>
          ) : null}
        </div>
      </td>
      <td>
        <select
          className={`${styles.select} ${styles.statusSelect} ${statusClass(status)}`}
          aria-label="Статус заявки"
          value={status}
          disabled={pending}
          onChange={(event) => {
            const next = event.target.value as LeadStatus;
            const previous = status;
            setStatus(next);
            void save({ status: next }).then((ok) => {
              if (!ok) setStatus(previous);
            });
          }}
        >
          {LEAD_STATUSES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </td>
      <td>
        <textarea
          className={styles.textarea}
          aria-label="Комментарий"
          rows={2}
          value={comment}
          maxLength={2000}
          placeholder="Комментарий"
          onChange={(event) => {
            setComment(event.target.value);
            setSaved(false);
          }}
          onBlur={() => {
            if (comment.trim() === lead.managerComment) return;
            void save({ managerComment: comment });
          }}
        />
        {saved ? <p className={styles.saveHint}>Сохранено</p> : null}
        {error ? <p className={styles.rowError}>{error}</p> : null}
      </td>
    </tr>
  );
}

export default function AdminLeadsPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [total, setTotal] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originFilter, setOriginFilter] = useState<OriginFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/admin/leads", { cache: "no-store" });
      if (response.status === 401) {
        setAuthed(false);
        setLeads([]);
        return;
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setLoadError(data?.error || "Не удалось загрузить заявки");
        setAuthed(true);
        return;
      }
      const data = (await response.json()) as LeadsResponse;
      setLeads(data.leads);
      setTotal(data.total);
      setDemo(Boolean(data.demo));
      setAuthed(true);
    } catch {
      setLoadError("Не удалось загрузить заявки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const normalizedQuery = query.trim().toLowerCase();

  const scopedLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (originFilter !== "all" && lead.origin !== originFilter) return false;
      return matchesQuery(lead, normalizedQuery);
    });
  }, [leads, normalizedQuery, originFilter]);

  const visibleLeads = useMemo(() => {
    if (statusFilter === "all") return scopedLeads;
    return scopedLeads.filter((lead) => lead.status === statusFilter);
  }, [scopedLeads, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = new Map<LeadStatus, number>();
    for (const status of LEAD_STATUSES) counts.set(status.id, 0);
    for (const lead of scopedLeads) {
      counts.set(lead.status, (counts.get(lead.status) || 0) + 1);
    }
    return counts;
  }, [scopedLeads]);

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
      await loadLeads();
    } catch {
      setAuthError("Ошибка входа");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setLeads([]);
  };

  const handleSaved = useCallback((next: AdminLead) => {
    setLeads((current) =>
      current.map((item) => (item.id === next.id ? next : item)),
    );
  }, []);

  const handleUnauthorized = useCallback(() => {
    setAuthed(false);
    setLeads([]);
  }, []);

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
          {process.env.NODE_ENV === "development" ? (
            <p className={styles.muted}>
              Если свой пароль не задан, локально подойдёт admin / admin
            </p>
          ) : null}
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
    <main className={`${styles.page} ${styles.leadsPage}`}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Заявки</h1>
          <p className={styles.muted}>
            Сайт и квиз. Статус и комментарий меняются в таблице.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin" className={styles.navLink}>
            Аналитика
          </Link>
          <Link href="/admin/apartments" className={styles.navLink}>
            Студии
          </Link>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => void loadLeads()}
            disabled={loading}
          >
            Обновить
          </Button>
          <Button type="button" variant="outline" size="md" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </header>

      {loadError ? <p className={styles.error}>{loadError}</p> : null}
      {demo ? (
        <p className={`${styles.muted} ${styles.demoNote}`}>
          Показаны 5 демо-заявок из конфига. База не подключена, изменения
          сохраняются только до перезапуска сервера.
        </p>
      ) : null}

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <input
            className={`${styles.input} ${styles.search}`}
            value={query}
            placeholder="Имя, телефон, кампания"
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className={styles.muted}>
            Показано {visibleLeads.length}
            {total > leads.length ? ` · в базе ${total}` : ""}
          </p>
        </div>

        <div className={styles.filterRow}>
          <button
            type="button"
            className={originFilter === "all" ? styles.filterActive : styles.filterBtn}
            onClick={() => setOriginFilter("all")}
          >
            Все источники ({leads.length})
          </button>
          {LEAD_ORIGINS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                originFilter === item.id ? styles.filterActive : styles.filterBtn
              }
              onClick={() => setOriginFilter(item.id)}
            >
              {item.label} ({leads.filter((lead) => lead.origin === item.id).length})
            </button>
          ))}
        </div>

        <div className={styles.filterRow}>
          <button
            type="button"
            className={statusFilter === "all" ? styles.filterActive : styles.filterBtn}
            onClick={() => setStatusFilter("all")}
          >
            Все статусы ({scopedLeads.length})
          </button>
          {LEAD_STATUSES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                statusFilter === item.id ? styles.filterActive : styles.filterBtn
              }
              onClick={() => setStatusFilter(item.id)}
            >
              {item.label} ({statusCounts.get(item.id) || 0})
            </button>
          ))}
        </div>

        <div className={styles.tableWrap}>
          <table className={`${styles.table} ${styles.leadsTable}`}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Откуда</th>
                <th>Контакт</th>
                <th>Ответы</th>
                <th>Источник</th>
                <th>Кампания</th>
                <th>Статус</th>
                <th>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.muted}>
                    {loading ? "Загружаем заявки…" : "Заявок нет"}
                  </td>
                </tr>
              ) : (
                visibleLeads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onSaved={handleSaved}
                    onUnauthorized={handleUnauthorized}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
