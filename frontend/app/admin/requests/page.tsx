
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import AdminShell, { Icon } from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/api";

/* ================= TYPES ================= */

type Status = "pending" | "active" | "rejected";

type RequestItem = {
  id: string;
  role: "member" | "trainer";
  name: string;
  email: string;
  phone: string;
  message: string;
  photo: string;
  status: Status;
  createdAt: string;
  reviewedAt: string | null;
  rejectReason: string;
};

type Counts = {
  pending: number;
  active: number;
  rejected: number;
};

const tabs: { key: Status; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "active", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

const PAGE_SIZE = 10;

const avatarTones = [
  "#800020",
  "#c0405a",
  "#d4881f",
  "#2f9e6a",
  "#8a6d75",
];

/* ================= HELPERS ================= */

function timeAgo(iso: string) {
  const mins = Math.floor(
    (Date.now() - new Date(iso).getTime()) / 60000
  );

  if (mins < 1) return "just now";

  if (mins < 60) {
    return `${mins} min ago`;
  }

  const hours = Math.floor(mins / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return new Date(iso).toLocaleDateString("en-GB");
}

function Ico({
  children,
  className = "h-4 w-4",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const PhoneIco = () => (
  <Ico>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </Ico>
);

const MailIco = () => (
  <Ico>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
  </Ico>
);

const PinIco = () => (
  <Ico>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Ico>
);

const TagIco = () => (
  <Ico>
    <path d="M3 12V4h8l10 10-8 8L3 12Z" />
    <circle cx="7.5" cy="8.5" r="1" />
  </Ico>
);

/* ================= ACCEPT / REJECT POPUP ================= */

function ActionModal({
  mode,
  target,
  busy,
  onCancel,
  onConfirm,
}: {
  mode: "accept" | "reject";
  target: RequestItem;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => !busy && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
      >
        <h3 className="text-lg font-extrabold text-[#800020]">
          {mode === "accept"
            ? "Accept this request?"
            : "Reject this request?"}
        </h3>

        <p className="mt-2 text-sm text-[#800020]/70">
          {mode === "accept" ? (
            <>
              <b>{target.name}</b> 
             login request accepted ,first ensure that you communicate with.
            </>
          ) : (
            <>
              <b>{target.name}</b>
              Request rejected,try again.
            </>
          )}
        </p>

        {mode === "reject" && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-bold text-[#800020]">
              Reason{" "}
              <span className="text-xs font-medium text-[#800020]/50">
                (optional, Show to user )
              </span>
            </label>

            <textarea
              rows={3}
              maxLength={200}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm text-[#800020] ring-1 ring-[#800020]/15 outline-none focus:ring-2 focus:ring-[#800020]"
              placeholder="Jaise: details poori nahi thin"
            />
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-[#800020] ring-1 ring-[#800020]/20 hover:bg-[#800020]/5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(reason)}
            disabled={busy}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60 ${
              mode === "accept"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-[#800020] hover:bg-[#5e0018]"
            }`}
          >
            {busy
              ? "Please wait..."
              : mode === "accept"
                ? "Accept"
                : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function RequestsPage() {
  const [tab, setTab] = useState<Status>("pending");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<"all" | "member" | "trainer">("all");

  const [items, setItems] = useState<RequestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  // const [roleFilter, setRoleFilter] = useState<"all" | "member" | "trainer">("all");

  const [counts, setCounts] = useState<Counts>({
    pending: 0,
    active: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [action, setAction] = useState<{
    mode: "accept" | "reject";
    target: RequestItem;
  } | null>(null);

  const [busy, setBusy] = useState(false);

  // Har request ka unique number.
  // Purani API response ko ignore karne ke kaam aata hai.
  const latest = useRef(0);

  /* ================= SEARCH DEBOUNCE ================= */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  /* ================= LOAD COUNTS ================= */

  const loadCounts = useCallback(async () => {
    try {
      const { ok, data } = await apiFetch(
        `/api/admin/requests/counts?role=${roleFilter}`
      );

      if (ok) {
        setCounts(data);
      }
    } catch {
      // Counts fail hon to bhi main requests list chalti rahegi.
    }
  }, [roleFilter]);

  /* ================= LOAD REQUESTS ================= */

  const loadList = useCallback(async () => {
    const id = ++latest.current;

    try {
      const { ok, data } = await apiFetch(
        `/api/admin/requests?status=${tab}&q=${encodeURIComponent(
          query
        )}&page=${page}&limit=${PAGE_SIZE}&role=${roleFilter}`
      );

      // Agar koi newer request start ho chuki hai
      // to old response ko state mein mat lagao.
      if (id !== latest.current) {
        return;
      }

      if (!ok) {
        setError(
          data.message || "Requests load nahi ho sakin"
        );
        return;
      }

      setError("");
      setItems(data.requests);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      if (id === latest.current) {
        setError("Server se connect nahi ho paya.");
      }
    } finally {
      if (id === latest.current) {
        setLoading(false);
      }
    }
  }, [tab, query, page,roleFilter]);

  /* ================= INITIAL / FILTER LOAD ================= */

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    void loadCounts();
  }, [loadCounts]);

  /* ================= NOTIFICATION ================= */

  function notify(
    type: "success" | "error",
    text: string
  ) {
    setNotice({
      type,
      text,
    });

    window.setTimeout(() => {
      setNotice(null);
    }, 3500);
  }

  /* ================= ACCEPT / REJECT ================= */

  async function confirmAction(reason: string) {
    if (!action) return;

    setBusy(true);

    try {
      const { ok, data } = await apiFetch(
        `/api/admin/requests/${action.target.id}/${action.mode}`,
        {
          method: "PATCH",
          body: JSON.stringify(
            action.mode === "reject"
              ? { reason }
              : {}
          ),
        }
      );

      if (!ok) {
        notify(
          "error",
          data.message || "Kaam nahi ho saka"
        );
        return;
      }

      notify(
        "success",
        action.mode === "accept"
          ? `${action.target.name} accepted`
          : `${action.target.name} rejected`
      );

      setAction(null);

      // Action complete hone ke baad list aur counters refresh.
      await Promise.all([
        loadList(),
        loadCounts(),
      ]);
    } catch {
      notify(
        "error",
        "Server se connect nahi ho paya."
      );
    } finally {
      setBusy(false);
    }
  }

  /* ================= UI ================= */

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* ================= HEADER ================= */}

        <section className="rounded-3xl bg-gradient-to-br from-white to-[#f8ece8] p-5 shadow-[0_2px_16px_rgba(128,0,32,0.06)] ring-1 ring-[#800020]/5 sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#800020] text-white shadow-lg shadow-[#800020]/25">
              <Icon
                name="members"
                className="h-6 w-6"
              />
            </span>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#800020]/60">
                Members
              </p>

              <h1 className="text-2xl font-extrabold text-[#800020] sm:text-3xl">
                Join Requests
              </h1>

              <p className="text-sm text-[#800020]/65">
                Check new request,contect with user,then accept or reject request.
              </p>
            </div>
          </div>
        </section>

        {/* ================= TABS + SEARCH ================= */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-[#800020]/10">
            {tabs.map((t) => {
              const on = t.key === tab;

              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setTab(t.key);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    on
                      ? "bg-[#800020] text-white shadow"
                      : "text-[#800020]/75 hover:text-[#800020]"
                  }`}
                >
                  {t.label}

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      on
                        ? "bg-white/20 text-white"
                        : "bg-[#800020]/10 text-[#800020]"
                    }`}
                  >
                    {counts[t.key]}
                  </span>
                </button>
              );
            })}
          </div>
          
                    <div className="flex rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-[#800020]/10">
            {(["all", "member", "trainer"] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRoleFilter(r);
                  setPage(1);
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  roleFilter === r ? "bg-[#800020] text-white shadow" : "text-[#800020]/75 hover:text-[#800020]"
                }`}
              >
                {r === "all" ? "All" : r === "member" ? "Members" : "Trainers"}
              </button>
            ))}
          </div>

          <label className="flex w-full max-w-xs items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-[#800020]/10 focus-within:ring-2 focus-within:ring-[#800020]">
            <Icon
              name="search"
              className="h-4 w-4 text-[#800020]/60"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Name, email or phone..."
              className="w-full bg-transparent text-sm text-[#800020] outline-none placeholder:text-[#800020]/40"
            />
          </label>
        </div>

        {/* ================= NOTICE ================= */}

        {notice && (
          <div
            className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold ${
              notice.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            <Icon
              name={
                notice.type === "success"
                  ? "check"
                  : "alert"
              }
              className="h-[18px] w-[18px]"
            />

            {notice.text}
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading && items.length === 0 && (
          <div className="flex items-center justify-center gap-3 rounded-3xl bg-white p-12 text-[#800020] ring-1 ring-[#800020]/5">
            <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#800020]/20 border-t-[#800020]" />

            <span className="text-sm font-semibold">
              Loading requests...
            </span>
          </div>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-[#800020]/5">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#800020]/10 text-[#800020]">
              <Icon name="alert" />
            </span>

            <p className="font-bold text-[#800020]">
              {error}
            </p>

            <button
              onClick={() => {
                setLoading(true);
                void loadList();
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#800020] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5e0018]"
            >
              <Icon
                name="refresh"
                className="h-4 w-4"
              />

              Try again
            </button>
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!error &&
          !loading &&
          items.length === 0 && (
            <div className="rounded-3xl bg-white p-12 text-center ring-1 ring-[#800020]/5">
              <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#800020]/10 text-[#800020]">
                <Icon name="members" />
              </span>

              <p className="font-bold text-[#800020]">
                {query
                  ? "No result founded"
                  : ` There are no ${tabs
                      .find(
                        (t) => t.key === tab
                      )
                      ?.label.toLowerCase()}  requests`}
              </p>
            </div>
          )}

        {/* ================= REQUEST LIST ================= */}

        {!error && items.length > 0 && (
          <ul
            className={`space-y-4 transition ${
              loading ? "opacity-60" : ""
            }`}
          >
            {items.map((r, i) => (
              <li
                key={r.id}
                className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(128,0,32,0.06)] ring-1 ring-[#800020]/5 sm:p-6 lg:flex-row lg:items-center"
              >
                {/* AVATAR */}

                {r.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.photo}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                    style={{
                      backgroundColor:
                        avatarTones[
                          i % avatarTones.length
                        ],
                    }}
                  >
                    {r.name
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}

                {/* DETAILS */}

                <div className="min-w-0 flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-bold text-[#800020]">
                      {r.name}
                    </h3>
                     <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        r.role === "trainer" ? "bg-[#800020] text-white" : "bg-[#800020]/10 text-[#800020]"
                      }`}
                    >
                      {r.role === "trainer" ? "Trainer" : "Member"}
                    </span>

                    <span className="text-xs text-[#800020]/55">
                      Requested{" "}
                      {timeAgo(r.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#800020]/80">
                    <a
                      href={`tel:${r.phone}`}
                      className="flex items-center gap-1.5 font-semibold hover:underline"
                    >
                      <PhoneIco />
                      {r.phone}
                    </a>

                    <a
                      href={`mailto:${r.email}`}
                      className="flex items-center gap-1.5 hover:underline"
                    >
                      <MailIco />
                      {r.email}
                    </a>
                  </div>

                  

                  {r.message && (
                    <p className="rounded-2xl bg-[#faf7f2] px-4 py-2.5 text-sm italic text-[#800020]/80">
                      &ldquo;{r.message}&rdquo;
                    </p>
                  )}

                  {r.status === "rejected" &&
                    r.rejectReason && (
                      <p className="text-sm text-rose-700">
                        <b>Reason:</b>{" "}
                        {r.rejectReason}
                      </p>
                    )}
                </div>

                {/* ================= ACTIONS ================= */}

                <div className="flex shrink-0 flex-wrap items-center gap-3 lg:flex-col lg:items-stretch">
                  {r.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          setAction({
                            mode: "accept",
                            target: r,
                          })
                        }
                        className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          setAction({
                            mode: "reject",
                            target: r,
                          })
                        }
                        className="rounded-xl px-6 py-2.5 text-sm font-bold text-[#800020] ring-1 ring-[#800020]/25 transition hover:bg-[#800020] hover:text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {r.status === "active" && (
                    <div className="text-center">
                      <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                        Accepted
                      </span>

                      {r.reviewedAt && (
                        <p className="mt-1.5 text-xs text-[#800020]/55">
                          {timeAgo(
                            r.reviewedAt
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  {r.status === "rejected" && (
                    <>
                      <span className="rounded-full bg-rose-50 px-4 py-2 text-center text-xs font-bold text-rose-700">
                        Rejected
                      </span>

                      <button
                        onClick={() =>
                          setAction({
                            mode: "accept",
                            target: r,
                          })
                        }
                        className="rounded-xl px-5 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
                      >
                        Accept instead
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ================= PAGINATION ================= */}

        {!error && pages > 1 && (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3 text-sm text-[#800020] shadow-sm ring-1 ring-[#800020]/5">
            <span className="text-[#800020]/65">
              Page {page} of {pages} ·{" "}
              {total} total
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLoading(true);

                  setPage((p) =>
                    Math.max(p - 1, 1)
                  );
                }}
                disabled={
                  page <= 1 || loading
                }
                className="rounded-xl px-4 py-2 font-semibold ring-1 ring-[#800020]/20 transition hover:bg-[#800020]/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={() => {
                  setLoading(true);

                  setPage((p) =>
                    Math.min(
                      p + 1,
                      pages
                    )
                  );
                }}
                disabled={
                  page >= pages || loading
                }
                className="rounded-xl bg-[#800020] px-4 py-2 font-semibold text-white transition hover:bg-[#5e0018] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}

      {action && (
        <ActionModal
          key={
            action.target.id +
            action.mode
          }
          mode={action.mode}
          target={action.target}
          busy={busy}
          onCancel={() =>
            setAction(null)
          }
          onConfirm={confirmAction}
        />
      )}
    </AdminShell>
  );
}
