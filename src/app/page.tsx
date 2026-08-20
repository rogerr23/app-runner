"use client";

import {
  Activity, ArrowRight, CalendarDays, CheckCircle2, ChevronRight, Eye, EyeOff,
  Footprints, History, Home, LockKeyhole, LogOut, Mail, Menu, Plus, Route,
  Sparkles, Target, Trash2, UserRound, X,
} from "lucide-react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Tables } from "@/lib/supabase/database.types";

type Profile = Tables<"profiles">;
type Run = Tables<"runs">;
type Plan = Tables<"planned_runs">;
type Goal = Tables<"goals">;
type Tab = "home" | "plan" | "history" | "profile";
type Sheet = "run" | "plan" | "goal" | null;

const runLabels: Record<Run["run_type"], string> = {
  easy: "Leve", long: "Longão", interval: "Intervalado", tempo: "Ritmo",
  recovery: "Recuperação", walk_run: "Caminhada + corrida", race: "Prova", other: "Outro",
};
const tabs = [
  ["home", "Início", Home], ["plan", "Planejar", CalendarDays],
  ["history", "Histórico", History], ["profile", "Perfil", UserRound],
] as const;

async function api<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.error?.message ?? "Não foi possível concluir esta ação.");
  return body as T;
}
const json = (body: unknown): RequestInit => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const km = (value: number | null) => value == null ? "—" : `${Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} km`;
const duration = (seconds: number | null) => seconds == null ? "—" : seconds >= 3600 ? `${Math.floor(seconds / 3600)}h ${String(Math.floor(seconds % 3600 / 60)).padStart(2, "0")}min` : `${Math.floor(seconds / 60)} min`;
const pace = (seconds: number | null) => seconds == null ? "—" : `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")} /km`;
const dateLabel = (date: string, long = false) => new Intl.DateTimeFormat("pt-BR", long ? { weekday: "short", day: "2-digit", month: "short" } : { day: "2-digit", month: "short" }).format(new Date(`${date.slice(0, 10)}T12:00:00`));
function today() { const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); return now.toISOString().slice(0, 10); }

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const p = await api<{ data: Profile }>("/api/profile");
      const [r, pl, g] = await Promise.all([
        api<{ data: Run[] }>("/api/runs?limit=100"), api<{ data: Plan[] }>("/api/planned-runs"), api<{ data: Goal[] }>("/api/goals"),
      ]);
      setProfile(p.data); setRuns(r.data); setPlans(pl.data); setGoals(g.data);
    } catch { setProfile(null); } finally { setLoading(false); }
  }, []);
  // A busca inicial hidrata o estado do cliente a partir da sessão HTTP existente.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  if (loading) return <main className="loading-screen"><Brand /><div className="loading-track"><span /></div><p>Preparando sua pista...</p></main>;
  if (!profile) return <Auth onSuccess={load} />;
  return <Dashboard profile={profile} runs={runs} plans={plans} goals={goals} refresh={load} onLogout={() => setProfile(null)} />;
}

function Brand() { return <div className="brand"><span className="brand-mark"><Route size={20} /></span><span>PISTA</span></div>; }

function Auth({ onSuccess }: { onSuccess: () => Promise<void> }) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(null); const form = new FormData(event.currentTarget);
    try {
      await api(`/api/auth/${mode}`, json({ ...(mode === "signup" ? { displayName: form.get("displayName") } : {}), email: form.get("email"), password: form.get("password") }));
      await onSuccess();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Não foi possível continuar."); } finally { setSaving(false); }
  }
  return <main className="auth-page">
    <section className="auth-story"><Brand /><div className="story-copy"><span className="eyebrow">SEU TREINO COMEÇA AQUI</span><h1>Comece no seu ritmo.<br />Continue por você.</h1><p>Planeje o próximo passo, registre cada conquista e veja sua evolução acontecer.</p></div><div className="route-art" aria-hidden="true"><span className="route-dot route-dot-start" /><span className="route-line route-line-one" /><span className="route-line route-line-two" /><span className="route-dot route-dot-end" /><span className="distance-badge">5,0 km</span></div></section>
    <section className="auth-panel"><div className="auth-card"><div className="auth-tabs" role="tablist">{(["login", "signup"] as const).map((item) => <button key={item} className={mode === item ? "active" : ""} type="button" onClick={() => { setMode(item); setError(null); }}>{item === "login" ? "Entrar" : "Criar conta"}</button>)}</div>
      <div className="form-heading"><span>{mode === "signup" ? "PRIMEIRO PASSO" : "BOM TER VOCÊ DE VOLTA"}</span><h2>{mode === "signup" ? "Vamos correr?" : "Continue sua jornada"}</h2><p>{mode === "signup" ? "Crie sua conta gratuita em poucos segundos." : "Entre para ver seus treinos e sua evolução."}</p></div>
      <form onSubmit={submit}>{mode === "signup" && <label>Como podemos chamar você?<div className="input-wrap"><UserRound size={18} /><input name="displayName" placeholder="Seu nome" minLength={2} maxLength={80} required /></div></label>}<label>E-mail<div className="input-wrap"><Mail size={18} /><input name="email" type="email" autoComplete="email" placeholder="voce@email.com" required /></div></label><label>Senha<div className="input-wrap"><LockKeyhole size={18} /><input name="password" type={visible ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder={mode === "signup" ? "8+ caracteres, letras e números" : "Sua senha"} minLength={mode === "signup" ? 8 : 1} required /><button className="password-toggle" type="button" onClick={() => setVisible(!visible)} aria-label="Mostrar ou ocultar senha">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={saving}><span>{saving ? "Só um instante..." : mode === "signup" ? "Criar minha conta" : "Entrar"}</span>{!saving && <ArrowRight size={20} />}</button></form>
      <p className="privacy-note">Seus dados são privados e usados apenas para acompanhar os seus treinos.</p>
    </div></section>
  </main>;
}

function Dashboard({ profile, runs, plans, goals, refresh, onLogout }: { profile: Profile; runs: Run[]; plans: Plan[]; goals: Goal[]; refresh: () => Promise<void>; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("home");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  async function logout() { await api("/api/auth/logout", { method: "POST" }); onLogout(); }
  async function mutate(action: () => Promise<unknown>, message: string) {
    try { await action(); await refresh(); setSheet(null); setToast(message); window.setTimeout(() => setToast(null), 2400); }
    catch (caught) { setToast(caught instanceof Error ? caught.message : "Algo deu errado."); }
  }
  const navigate = (next: Tab) => { setTab(next); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <main className="dashboard-shell">
    <aside className={`sidebar ${menu ? "sidebar-open" : ""}`}><div className="sidebar-top"><Brand /><button className="sidebar-close" onClick={() => setMenu(false)}><X /></button></div><nav>{tabs.map(([id, label, Icon]) => <button key={id} className={`nav-button ${tab === id ? "active" : ""}`} onClick={() => navigate(id)}><Icon size={20} />{label}{tab === id && <span />}</button>)}</nav><div className="sidebar-quote"><Sparkles /><p>Consistência vence pressa.</p><small>Um passo por vez.</small></div><button className="logout-button" onClick={logout}><LogOut />Sair</button></aside>
    {menu && <button className="menu-scrim" onClick={() => setMenu(false)} aria-label="Fechar menu" />}
    <section className="app-area"><header className="mobile-header"><button onClick={() => setMenu(true)}><Menu /></button><Brand /><span className="avatar-small">{profile.display_name[0]}</span></header>
      {tab === "home" && <HomeView profile={profile} runs={runs} plans={plans} onNew={setSheet} navigate={navigate} />}
      {tab === "plan" && <PlanView plans={plans} onNew={() => setSheet("plan")} onDelete={(id) => mutate(() => api(`/api/planned-runs/${id}`, { method: "DELETE" }), "Treino removido.")} />}
      {tab === "history" && <HistoryView runs={runs} onNew={() => setSheet("run")} onDelete={(id) => mutate(() => api(`/api/runs/${id}`, { method: "DELETE" }), "Corrida removida.")} />}
      {tab === "profile" && <ProfileView profile={profile} goals={goals} onNew={() => setSheet("goal")} mutate={mutate} logout={logout} />}
    </section>
    <nav className="bottom-nav">{tabs.map(([id, label, Icon]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => navigate(id)}><Icon />{label}</button>)}</nav>
    <button className="quick-add" onClick={() => setSheet("run")} aria-label="Registrar corrida"><Plus /></button>
    {toast && <div className="toast" role="status">{toast}</div>}{sheet && <SheetForm kind={sheet} plans={plans} close={() => setSheet(null)} mutate={mutate} />}
  </main>;
}

function HomeView({ profile, runs, plans, onNew, navigate }: { profile: Profile; runs: Run[]; plans: Plan[]; onNew: (sheet: Sheet) => void; navigate: (tab: Tab) => void }) {
  const monday = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; }, []);
  const weekly = runs.filter((run) => new Date(run.performed_at) >= monday);
  const total = weekly.reduce((sum, run) => sum + Number(run.distance_km), 0);
  const target = Number(profile.weekly_goal_km ?? 10);
  const progress = Math.min(100, Math.round(total / target * 100));
  const next = plans.find((plan) => plan.status === "planned" && plan.scheduled_for >= today());
  return <div className="view"><header className="welcome-row"><div><span className="section-kicker">VISÃO GERAL</span><h1>Olá, {profile.display_name.split(" ")[0]}.</h1><p>Pronto para o próximo passo?</p></div><div className="desktop-profile"><span>{profile.display_name[0]}</span><div><strong>{profile.display_name}</strong><small>{profile.experience_level === "beginner" ? "Começando agora" : profile.experience_level === "intermediate" ? "Intermediário" : "Avançado"}</small></div></div></header>
    <div className="hero-grid"><article className="weekly-card"><div className="weekly-card-head"><div><span>ESTA SEMANA</span><h2>{km(total)}</h2><p>de {km(target)} planejados</p></div><div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as CSSProperties}><span>{progress}%</span></div></div><div className="mini-stats"><div><Footprints /><span><strong>{weekly.length}</strong> corridas</span></div><div><Activity /><span><strong>{duration(weekly.reduce((sum, run) => sum + run.duration_seconds, 0))}</strong> em movimento</span></div></div></article>
      <article className="next-card"><div><span className="card-label">PRÓXIMO TREINO</span>{next ? <><span className="type-pill">{runLabels[next.run_type]}</span><h2>{dateLabel(next.scheduled_for, true)}</h2><p>{next.notes || "Treino planejado para continuar evoluindo."}</p></> : <><span className="empty-icon"><CalendarDays /></span><h2>Sua semana está aberta</h2><p>Planeje um treino e transforme intenção em compromisso.</p></>}</div><button onClick={() => onNew("plan")}>{next ? "Planejar outro" : "Planejar treino"}<ArrowRight /></button></article></div>
    <section className="quick-section"><Title kicker="ATALHOS" title="O que vamos fazer?" /><div className="action-grid"><Action icon={<Plus />} title="Registrar corrida" copy="Salve distância, tempo e esforço" className="action-run" onClick={() => onNew("run")} /><Action icon={<CalendarDays />} title="Planejar treino" copy="Organize a sua próxima saída" className="action-plan" onClick={() => onNew("plan")} /><Action icon={<Target />} title="Criar meta" copy="Escolha um objetivo possível" className="action-goal" onClick={() => onNew("goal")} /></div></section>
    <section className="recent-section"><div className="section-title"><Title kicker="ÚLTIMAS ATIVIDADES" title="Seu caminho até aqui" /><button onClick={() => navigate("history")}>Ver histórico <ArrowRight /></button></div>{runs.length ? <div className="run-list">{runs.slice(0, 3).map((run) => <RunRow key={run.id} run={run} />)}</div> : <Empty icon={<Footprints />} title="A primeira ainda está por vir" copy="Registre uma corrida e veja sua evolução ganhar forma." />}</section>
  </div>;
}

function Title({ kicker, title }: { kicker: string; title: string }) { return <div><span className="section-kicker">{kicker}</span><h2>{title}</h2></div>; }
function Action({ icon, title, copy, className, onClick }: { icon: ReactNode; title: string; copy: string; className: string; onClick: () => void }) { return <button className={`action-card ${className}`} onClick={onClick}><span>{icon}</span><div><strong>{title}</strong><small>{copy}</small></div><ChevronRight /></button>; }
function RunRow({ run, onDelete }: { run: Run; onDelete?: (id: string) => void }) { return <article className="run-item"><div className="run-type-icon"><Footprints /></div><div className="run-name"><span>{dateLabel(run.performed_at, true)}</span><strong>{runLabels[run.run_type]}</strong></div><div className="run-metric"><strong>{km(run.distance_km)}</strong><small>distância</small></div><div className="run-metric"><strong>{duration(run.duration_seconds)}</strong><small>tempo</small></div><div className="run-metric"><strong>{pace(run.pace_seconds_per_km)}</strong><small>ritmo médio</small></div>{onDelete && <button className="icon-button danger" onClick={() => onDelete(run.id)}><Trash2 /></button>}</article>; }

function ViewHeader({ kicker, title, copy, action, onAction }: { kicker: string; title: string; copy: string; action?: string; onAction?: () => void }) { return <header className="view-header"><div><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{copy}</p></div>{action && <button className="header-action" onClick={onAction}><Plus />{action}</button>}</header>; }
function Empty({ icon, title, copy, action, onAction }: { icon: ReactNode; title: string; copy: string; action?: string; onAction?: () => void }) { return <div className="empty-state"><span>{icon}</span><h3>{title}</h3><p>{copy}</p>{action && <button onClick={onAction}>{action}<ArrowRight /></button>}</div>; }

function PlanView({ plans, onNew, onDelete }: { plans: Plan[]; onNew: () => void; onDelete: (id: string) => void }) {
  const upcoming = plans.filter((plan) => plan.status === "planned");
  return <div className="view"><ViewHeader kicker="SUA ROTINA" title="Planejamento" copy="Deixe a próxima decisão pronta antes de calçar o tênis." action="Novo treino" onAction={onNew} />{upcoming.length ? <div className="plan-grid">{upcoming.map((plan) => <article className="plan-card" key={plan.id}><div className="plan-date"><strong>{new Date(`${plan.scheduled_for}T12:00`).getDate()}</strong><span>{new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(new Date(`${plan.scheduled_for}T12:00`))}</span></div><div className="plan-main"><span className="type-pill">{runLabels[plan.run_type]}</span><h2>{km(plan.target_distance_km)}</h2><p>{plan.target_duration_seconds ? `${duration(plan.target_duration_seconds)} · ` : ""}{plan.notes || "Sem observações"}</p></div><button className="icon-button danger" onClick={() => onDelete(plan.id)}><Trash2 /></button></article>)}</div> : <Empty icon={<CalendarDays />} title="Nenhum treino planejado" copy="Escolha um dia e dê forma à sua semana." action="Planejar agora" onAction={onNew} />}</div>;
}
function HistoryView({ runs, onNew, onDelete }: { runs: Run[]; onNew: () => void; onDelete: (id: string) => void }) {
  const total = runs.reduce((sum, run) => sum + Number(run.distance_km), 0);
  return <div className="view"><ViewHeader kicker="SUA EVOLUÇÃO" title="Histórico" copy="Cada registro é uma prova de que você apareceu." action="Registrar corrida" onAction={onNew} /><div className="history-summary"><div><Route /><span><strong>{km(total)}</strong> percorridos</span></div><div><History /><span><strong>{runs.length}</strong> atividades</span></div><div><Activity /><span><strong>{duration(runs.reduce((sum, run) => sum + run.duration_seconds, 0))}</strong> em movimento</span></div></div>{runs.length ? <div className="run-list full-list">{runs.map((run) => <RunRow key={run.id} run={run} onDelete={onDelete} />)}</div> : <Empty icon={<History />} title="Seu histórico começa aqui" copy="Depois da próxima corrida, volte para guardar o resultado." action="Registrar primeira corrida" onAction={onNew} />}</div>;
}

function ProfileView({ profile, goals, onNew, mutate, logout }: { profile: Profile; goals: Goal[]; onNew: () => void; mutate: (action: () => Promise<unknown>, message: string) => Promise<void>; logout: () => void }) {
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); await mutate(() => api("/api/profile", { ...json({ displayName: form.get("displayName"), experienceLevel: form.get("experienceLevel"), primaryGoal: form.get("primaryGoal"), weeklyGoalKm: Number(form.get("weeklyGoalKm")) }), method: "PATCH" }), "Perfil atualizado."); }
  const active = goals.filter((goal) => goal.status === "active");
  return <div className="view"><ViewHeader kicker="SUA CONTA" title="Perfil e metas" copy="Ajuste o plano para refletir onde você está agora." /><div className="profile-grid"><form className="profile-card" onSubmit={save}><div className="profile-avatar">{profile.display_name[0]}</div><div className="field-grid"><label>Nome<input name="displayName" defaultValue={profile.display_name} minLength={2} required /></label><label>Nível<select name="experienceLevel" defaultValue={profile.experience_level}><option value="beginner">Começando agora</option><option value="intermediate">Intermediário</option><option value="advanced">Avançado</option></select></label><label className="field-wide">Objetivo principal<select name="primaryGoal" defaultValue={profile.primary_goal}><option value="start_running">Começar a correr</option><option value="run_5k">Correr 5 km</option><option value="run_10k">Correr 10 km</option><option value="run_half_marathon">Meia maratona</option><option value="run_marathon">Maratona</option><option value="improve_pace">Melhorar ritmo</option><option value="stay_active">Manter atividade</option></select></label><label>Meta semanal (km)<input name="weeklyGoalKm" type="number" min="1" max="500" step="0.5" defaultValue={profile.weekly_goal_km ?? 10} required /></label></div><button className="compact-button"><CheckCircle2 />Salvar alterações</button></form><section className="goals-card"><div className="section-title"><Title kicker="OBJETIVOS" title="Metas ativas" /><button className="round-add" onClick={onNew}><Plus /></button></div>{active.length ? active.map((goal) => <div className="goal-row" key={goal.id}><span><Target /></span><div><strong>{goal.title}</strong><small>{Number(goal.target_value).toLocaleString("pt-BR")} {goal.unit === "runs" ? "corridas" : goal.unit}</small></div><button className="icon-button danger" onClick={() => mutate(() => api(`/api/goals/${goal.id}`, { method: "DELETE" }), "Meta removida.")}><Trash2 /></button></div>) : <p className="muted-copy">Crie uma meta simples para manter seu foco visível.</p>}</section></div><button className="mobile-logout" onClick={logout}><LogOut />Sair da conta</button></div>;
}

function RunTypeSelect() { return <select name="runType" defaultValue="easy">{Object.entries(runLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select>; }
function SheetForm({ kind, plans, close, mutate }: { kind: Exclude<Sheet, null>; plans: Plan[]; close: () => void; mutate: (action: () => Promise<unknown>, message: string) => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget);
    if (kind === "run") await mutate(() => api("/api/runs", json({ performedAt: new Date(String(form.get("performedAt"))).toISOString(), runType: form.get("runType"), distanceKm: Number(form.get("distanceKm")), durationSeconds: Number(form.get("durationMinutes")) * 60, perceivedEffort: Number(form.get("perceivedEffort")), notes: form.get("notes") || null, plannedRunId: form.get("plannedRunId") || null })), "Corrida registrada. Boa!");
    if (kind === "plan") await mutate(() => api("/api/planned-runs", json({ scheduledFor: form.get("scheduledFor"), runType: form.get("runType"), targetDistanceKm: Number(form.get("targetDistanceKm")), targetDurationSeconds: form.get("targetDurationMinutes") ? Number(form.get("targetDurationMinutes")) * 60 : null, notes: form.get("notes") || null })), "Treino planejado.");
    if (kind === "goal") await mutate(() => api("/api/goals", json({ kind: form.get("kind"), title: form.get("title"), targetValue: Number(form.get("targetValue")), unit: form.get("unit"), startsOn: today(), deadline: form.get("deadline") || null })), "Meta criada.");
    setSaving(false);
  }
  const titles = { run: ["REGISTRAR", "Como foi a corrida?"], plan: ["PLANEJAR", "Prepare o próximo passo"], goal: ["NOVA META", "Escolha um norte"] } as const;
  return <div className="sheet-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}><section className="action-sheet" role="dialog" aria-modal="true"><div className="sheet-handle" /><button className="sheet-close" onClick={close}><X /></button><span className="section-kicker">{titles[kind][0]}</span><h2>{titles[kind][1]}</h2><form onSubmit={submit}>
    {kind === "run" && <><div className="form-row"><label>Quando<input name="performedAt" type="datetime-local" defaultValue={`${today()}T07:00`} required /></label><label>Tipo<RunTypeSelect /></label></div><div className="form-row"><label>Distância (km)<input name="distanceKm" type="number" min="0.1" max="500" step="0.01" placeholder="5,0" required /></label><label>Tempo (min)<input name="durationMinutes" type="number" min="1" max="1440" placeholder="35" required /></label></div><div className="form-row"><label>Esforço<select name="perceivedEffort" defaultValue="3"><option value="1">1 · Muito leve</option><option value="2">2 · Leve</option><option value="3">3 · Moderado</option><option value="4">4 · Difícil</option><option value="5">5 · Máximo</option></select></label><label>Planejamento<select name="plannedRunId"><option value="">Nenhum</option>{plans.filter((plan) => plan.status === "planned").map((plan) => <option key={plan.id} value={plan.id}>{dateLabel(plan.scheduled_for)} · {runLabels[plan.run_type]}</option>)}</select></label></div></>}
    {kind === "plan" && <><div className="form-row"><label>Dia<input name="scheduledFor" type="date" min={today()} defaultValue={today()} required /></label><label>Tipo<RunTypeSelect /></label></div><div className="form-row"><label>Distância alvo (km)<input name="targetDistanceKm" type="number" min="0.1" max="500" step="0.1" required /></label><label>Tempo alvo (min)<input name="targetDurationMinutes" type="number" min="1" max="1440" /></label></div></>}
    {kind === "goal" && <><label>Título<input name="title" placeholder="Ex.: Correr 10 km em outubro" minLength={2} required /></label><div className="form-row"><label>Tipo<select name="kind"><option value="weekly_distance">Distância semanal</option><option value="weekly_frequency">Frequência semanal</option><option value="event_distance">Distância de evento</option></select></label><label>Unidade<select name="unit"><option value="km">Quilômetros</option><option value="runs">Corridas</option></select></label></div><div className="form-row"><label>Valor alvo<input name="targetValue" type="number" min="1" step="0.1" required /></label><label>Data limite<input name="deadline" type="date" min={today()} /></label></div></>}
    {kind !== "goal" && <label>Observações<textarea name="notes" rows={3} placeholder="Algo importante para lembrar?" maxLength={1000} /></label>}<button className="primary-button" disabled={saving}><span>{saving ? "Salvando..." : kind === "run" ? "Salvar corrida" : kind === "plan" ? "Planejar treino" : "Criar meta"}</span><ArrowRight /></button>
  </form></section></div>;
}
