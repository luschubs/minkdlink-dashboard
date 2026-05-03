// MindLink Dashboard — interactive prototype
// All 5 screens, inline SVG charts, useState routing.

const { useState, useMemo, useEffect, useRef } = React;

// ---------- Tokens ----------
const C = {
  sidebar: '#1A3A36',
  sidebarHover: 'rgba(255,255,255,0.08)',
  sidebarActive: 'rgba(255,255,255,0.12)',
  sidebarMuted: 'rgba(255,255,255,0.7)',
  sidebarDim: 'rgba(255,255,255,0.4)',
  page: '#F5F5F5',
  white: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E5E5E5',
  scoreBg: '#E8E8E8',
  rowHover: '#F9F9F9',
  primary: '#1A8A7D',
  lime: '#4ADE80',
  brand: '#4ECDC4',
  crit: '#FF6B6B',
  warn: '#F59E0B',
  ok: '#4ECDC4',
  ink: '#1A1A1A',
  text: '#374151',
  muted: '#6B7280',
  dim: '#9CA3AF',
  outlineBorder: '#D1D5DB',
};

// ---------- Icons (inline SVG, lucide-style) ----------
const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.8, fill = 'none', filled = false }) => {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill, stroke: color,
    strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { display: 'block', flexShrink: 0 }
  };
  // Filled (solid) variants used in the sidebar nav
  if (filled) {
    const filledProps = {
      width: size, height: size, viewBox: '0 0 24 24',
      fill: color, stroke: 'none',
      style: { display: 'block', flexShrink: 0 }
    };
    switch (name) {
      case 'home': return <svg {...filledProps}><path d="M11.3 2.3a1 1 0 0 1 1.4 0l8.6 7.7a1 1 0 0 1 .3.7V20a1 1 0 0 1-1 1h-5v-6h-4v6H4a1 1 0 0 1-1-1v-9.3a1 1 0 0 1 .3-.7l8-7.7z"/></svg>;
      case 'building': return <svg {...filledProps}><path d="M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1h-5v-4h-4v4H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm3 4v2h2V6H8zm4 0v2h2V6h-2zm4 0v2h2V6h-2zM8 10v2h2v-2H8zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2zM8 14v2h2v-2H8zm8 0v2h2v-2h-2z"/></svg>;
      case 'check': return <svg {...filledProps}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5.3 7.7l-6 6a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L11 13.6l5.3-5.3a1 1 0 0 1 1.4 1.4z"/></svg>;
      case 'file': return <svg {...filledProps}><path d="M6 2h7l7 7v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5L13 3.5zM8 13a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H8zm0 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H8z"/></svg>;
      case 'bars': return <svg {...filledProps}><path d="M3 11h2v9H3v-9zm6-6h2v15H9V5zm6 8h2v7h-2v-7zm6-3h2v10h-2V10z"/></svg>;
      default: break;
    }
  }
  switch (name) {
    case 'home': return <svg {...props}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>;
    case 'building': return <svg {...props}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01"/></svg>;
    case 'check': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>;
    case 'file': return <svg {...props}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></svg>;
    case 'bars': return <svg {...props}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case 'settings': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.18l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.66.43.86.78a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 'bell': return <svg {...props}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>;
    case 'grid': return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case 'sun': return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case 'user': return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>;
    case 'arrowLeft': return <svg {...props}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
    case 'arrowRight': return <svg {...props}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
    case 'arrowUp': return <svg {...props}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case 'arrowDown': return <svg {...props}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>;
    case 'arrowEq': return <svg {...props}><path d="M5 12h14"/></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'download': return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>;
    case 'eye': return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'infinity': return <svg {...props} strokeWidth="2"><path d="M6 12c0-2.5 2-4.5 4.5-4.5S15 12 15 12s2 4.5 4.5 4.5S24 14.5 24 12s-2-4.5-4.5-4.5S15 12 15 12s-2 4.5-4.5 4.5S6 14.5 6 12z" transform="translate(-3 0)"/></svg>;
    default: return null;
  }
};

// ---------- MindLink wordmark ----------
const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '2px 0' }}>
    <img src="assets/mindlink-logo.png" alt="MindLink" style={{ height: 28, width: 'auto', display: 'block' }}/>
  </div>
);

// ---------- Sidebar ----------
const NAV = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'setores', label: 'Setores', icon: 'building' },
  { id: 'plano', label: 'Plano de Ação', icon: 'check', badge: 3 },
  { id: 'relatorios', label: 'Relatórios', icon: 'file' },
  { id: 'evolucao', label: 'Evolução', icon: 'bars' },
];

function Sidebar({ active, onNav, onSignOut, userEmail }) {
  return (
    <aside style={{
      width: 220, background: C.sidebar, color: '#fff',
      display: 'flex', flexDirection: 'column',
      padding: '20px 14px', flexShrink: 0,
    }}>
      <div style={{ padding: '4px 6px 28px' }}><Logo /></div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className={`ml-nav-btn ${isActive ? 'ml-nav-btn--active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 8, border: 'none',
                background: isActive ? C.sidebarActive : 'transparent',
                color: isActive ? '#fff' : C.sidebarMuted,
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left', width: '100%',
                transition: 'background .2s, color .2s, padding-left .25s',
                paddingLeft: isActive ? 18 : 12,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.sidebarHover; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon name={item.icon} size={18} color="currentColor" filled />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: C.brand, color: '#fff',
                  borderRadius: 999, minWidth: 20, height: 20,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 600, padding: '0 6px',
                }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 6px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="user" size={18} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cliente Demo</div>
            <div style={{ fontSize: 11, color: C.sidebarDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail || 'demo@mindlink.com.br'}</div>
          </div>
          {onSignOut && (
            <button onClick={onSignOut} title="Sair" style={{
              background: 'transparent', border: 'none', color: C.sidebarMuted,
              cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = C.sidebarMuted}
            >
              <Icon name="arrowRight" size={14} color="currentColor"/>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

// ---------- Top bar ----------
function TopBar() {
  const [q, setQ] = useState('');
  return (
    <div style={{
      height: 56, background: C.white, borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      padding: '0 24px', gap: 16, flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        border: `1px solid ${C.border}`, borderRadius: 8,
        padding: '6px 10px', width: 220, background: C.white,
      }}>
        <Icon name="search" size={14} color={C.dim} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Busca"
          style={{ border: 'none', outline: 'none', flex: 1, fontSize: 13, fontFamily: 'inherit', background: 'transparent', color: C.text }}
        />
        <kbd style={{
          fontSize: 11, color: C.muted, border: `1px solid ${C.border}`,
          borderRadius: 4, padding: '1px 6px', fontFamily: 'inherit',
        }}>/</kbd>
      </div>
      {['sun','bell','grid'].map(n => (
        <button key={n} title={n} style={{
          background: 'transparent', border: 'none', padding: 6, borderRadius: 6,
          color: C.muted, cursor: 'pointer', display: 'flex',
        }}
          onMouseEnter={e => e.currentTarget.style.color = C.ink}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}
        >
          <Icon name={n} size={18} color="currentColor" />
        </button>
      ))}
    </div>
  );
}

// ---------- Generic UI bits ----------
const Button = ({ kind = 'primary', children, onClick, icon, style }) => {
  const styles = {
    primary: { background: C.primary, color: '#fff', border: `1px solid ${C.primary}` },
    lime: { background: C.lime, color: '#0a3a14', border: `1px solid ${C.lime}` },
    outline: { background: '#fff', color: C.text, border: `1px solid ${C.outlineBorder}` },
    ghost: { background: 'transparent', color: C.primary, border: 'none' },
  }[kind];
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '9px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'inherit',
      transition: 'transform .08s, box-shadow .15s, opacity .15s',
      ...styles, ...style,
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}
    onMouseUp={e => e.currentTarget.style.transform = ''}
    onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      {icon && <Icon name={icon} size={14} color="currentColor" />}
      {children}
    </button>
  );
};

const Card = ({ children, style, ...rest }) => (
  <div {...rest} style={{
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: 24, ...style,
  }}>{children}</div>
);

const StatusBadge = ({ kind, children }) => {
  const map = {
    crit: { bg: '#FF6B6B15', fg: C.crit, label: 'Crítico' },
    warn: { bg: '#F59E0B15', fg: C.warn, label: 'Atenção' },
    ok: { bg: '#4ECDC415', fg: C.ok, label: 'Adequado' },
    ready: { bg: '#4ADE8020', fg: '#15803d', label: 'Pronto' },
  };
  const s = map[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '4px 10px',
      borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.fg,
    }}>{children || s.label}</span>
  );
};

const Chip = ({ active, onClick, children, color }) => (
  <button onClick={onClick} style={{
    padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 500,
    border: active ? `1px solid ${color || C.primary}` : `1px solid ${C.border}`,
    background: active ? (color || C.primary) : '#fff',
    color: active ? '#fff' : C.text,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s',
  }}>{children}</button>
);

// ---------- Page chrome ----------
const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: C.ink, margin: 0, letterSpacing: '-0.01em' }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 13, color: C.dim, marginTop: 6 }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10 }}>{actions}</div>}
    </div>
    <div style={{ height: 1, background: C.border, marginTop: 20 }} />
  </div>
);

// ---------- Score Card ----------
function useNumberTicker(value, dur = 700) {
  const [v, setV] = useState(typeof value === 'number' ? 0 : value);
  useEffect(() => {
    if (typeof value !== 'number') { setV(value); return; }
    const start = performance.now();
    const from = typeof v === 'number' ? v : 0;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(+(from + (value - from) * eased).toFixed(value % 1 ? 1 : 0));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [value]);
  return v;
}

const ScoreCard = ({ label, value, valueColor, trend, trendIcon, suffix, mini }) => {
  const animated = useNumberTicker(value);
  return (
  <div className="ml-lift"
    style={{
      background: C.scoreBg, borderRadius: 12, padding: 24,
      cursor: 'default',
    }}
  >
    <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{label}</div>
    <div style={{
      fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em',
      color: valueColor || C.ink, marginTop: 14, lineHeight: 1,
    }}>
      <span className="ml-num">{animated}</span>{suffix && <span style={{ fontSize: 28 }}>{suffix}</span>}
    </div>
    {mini}
    <div style={{ fontSize: 13, color: C.muted, marginTop: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
      {trendIcon && <span style={{ fontSize: 13 }}>{trendIcon}</span>}
      {trend}
    </div>
  </div>
);
};

// ============================================================
// SCREEN 01 — OVERVIEW
// ============================================================
function ScreenOverview({ go }) {
  const [filter, setFilter] = useState('Todos');
  const sectorBars = [
    { name: 'Operacional', val: 8.2, pct: 82, color: C.crit, kind: 'crit' },
    { name: 'Vendas', val: 6.1, pct: 61, color: C.warn, kind: 'warn' },
    { name: 'Administrativo', val: 5.7, pct: 57, color: C.warn, kind: 'warn' },
    { name: 'TI', val: 3.9, pct: 39, color: C.ok, kind: 'ok' },
    { name: 'RH', val: 2.8, pct: 28, color: C.ok, kind: 'ok' },
  ];
  const filtered = sectorBars.filter(b =>
    filter === 'Todos' ? true :
    filter === 'Crítico' ? b.kind === 'crit' :
    b.kind === 'warn'
  );

  const alerts = [
    { sev: C.crit, label: 'Severidade alta', when: 'recente', text: 'Setor Operacional: sobrecarga de trabalho acima do limite crítico' },
    { sev: C.crit, label: 'Severidade alta', when: 'recente', text: 'Setor Operacional: relatos de conflito com liderança direta' },
    { sev: C.warn, label: 'Severidade média', when: 'esta semana', text: 'Setor Vendas: insegurança sobre metas e cobrança' },
  ];

  return (
    <div>
      <PageHeader
        title="Diagnóstico Geral"
        subtitle="Nova Vita Saúde · 379 colaboradores · 5 setores"
        actions={<>
          <Button kind="primary" icon="download">Exportar relatórios</Button>
          <Button kind="lime" icon="file">Gerar relatórios</Button>
        </>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <ScoreCard label="Índice de risco" value="6.4" valueColor={C.warn} trend="0.3 vs anterior" trendIcon="↓" />
        <ScoreCard label="Taxa de Participação" value="87" suffix="%" valueColor={C.ok} trend="12% vs anterior" trendIcon="↑" />
        <ScoreCard label="Setores em Alerta" value="2" valueColor={C.ok} trend="sem mudança" trendIcon="→" />
        <ScoreCard label="Ações em Andamento" value="8" valueColor={C.ink} trend="3 novas" trendIcon="↑" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        {/* Risco por setor */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: 0 }}>Risco por Setor</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Todos','Crítico','Moderado'].map(f =>
                <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }} className="ml-stagger">
            {filtered.map(b => (
              <div key={b.name} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 50px', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{b.name}</span>
                <div style={{ height: 10, background: '#F1F1F1', borderRadius: 999, overflow: 'hidden' }}>
                  <div className="ml-bar-fill" style={{
                    width: `${b.pct}%`, height: '100%', background: b.color,
                    borderRadius: 999,
                  }}/>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: b.color, textAlign: 'right' }}>{b.val}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ fontSize: 13, color: C.muted, padding: '20px 0', textAlign: 'center' }}>Nenhum setor neste filtro.</div>
            )}
          </div>
          <div style={{ marginTop: 22, padding: '12px 14px', background: '#FAFAFA', borderRadius: 8, fontSize: 12, color: C.muted, display: 'flex', gap: 16 }}>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: C.crit, marginRight: 6 }}/>Crítico (≥7)</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: C.warn, marginRight: 6 }}/>Atenção (5-7)</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: C.ok, marginRight: 6 }}/>Adequado (&lt;5)</span>
          </div>
        </Card>

        {/* Alertas */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: 0 }}>Alertas Ativos</h3>
            <a style={{ fontSize: 13, color: C.primary, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>Ver todos →</a>
          </div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column' }}>
            {alerts.map((a, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, padding: '14px 0',
                borderTop: i ? '1px solid #F0F0F0' : 'none',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: a.sev,
                  marginTop: 6, flexShrink: 0,
                }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{a.label} · {a.when}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN 02 — SETORES
// ============================================================
const SECTORS = [
  { id: 'op', name: 'Operacional', emp: 124, part: 91, idx: 8.2, idxColor: C.crit, trend: 'up', trendLabel: 'piorou', trendColor: C.crit, status: 'crit' },
  { id: 'vd', name: 'Vendas', emp: 67, part: 85, idx: 6.1, idxColor: C.warn, trend: 'eq', trendLabel: 'estável', trendColor: C.muted, status: 'warn' },
  { id: 'ad', name: 'Administrativo', emp: 89, part: 88, idx: 5.7, idxColor: C.warn, trend: 'down', trendLabel: 'melhorou', trendColor: C.ok, status: 'warn' },
  { id: 'ti', name: 'TI', emp: 52, part: 82, idx: 3.9, idxColor: C.ok, trend: 'down', trendLabel: 'melhorou', trendColor: C.ok, status: 'ok' },
  { id: 'rh', name: 'RH', emp: 47, part: 93, idx: 2.8, idxColor: C.ok, trend: 'down', trendLabel: 'melhorou', trendColor: C.ok, status: 'ok' },
];

const DIMENSIONS = ['Sobrecarga', 'Autonomia', 'Suporte Social', 'Liderança', 'Conflitos', 'Insegurança'];
// values 0-10 indexed [dim][sector]
const HEAT = [
  [9.1, 6.8, 6.2, 3.4, 2.1], // Sobrecarga
  [3.4, 5.8, 4.2, 2.8, 2.4], // Autonomia (low value = problem)
  [3.4, 4.6, 5.2, 6.4, 7.2], // Suporte Social
  [8.4, 5.9, 5.6, 4.1, 2.9], // Liderança
  [8.4, 5.4, 4.8, 3.2, 2.6], // Conflitos
  [5.8, 7.2, 6.0, 3.8, 3.0], // Insegurança
];

function heatColor(v) {
  if (v >= 7) return C.crit;
  if (v >= 5) return C.warn;
  return C.ok;
}
function heatBg(v) {
  // tint version
  if (v >= 7) return `rgba(255,107,107,${0.15 + (v-7)/10})`;
  if (v >= 5) return `rgba(245,158,11,${0.12 + (v-5)/15})`;
  return `rgba(78,205,196,${0.10 + v/30})`;
}

function ScreenSetores({ go }) {
  const [sortDesc, setSortDesc] = useState(true);
  const sorted = useMemo(() => {
    const a = [...SECTORS];
    a.sort((x, y) => sortDesc ? y.idx - x.idx : x.idx - y.idx);
    return a;
  }, [sortDesc]);

  const trendIcon = t => t === 'up' ? '↑' : t === 'down' ? '↓' : '→';

  return (
    <div>
      <PageHeader
        title="Análise por Setor"
        subtitle="Comparativo de riscos entre os 5 setores"
        actions={<>
          <Button kind="outline">Filtrar período</Button>
          <Button kind="outline" onClick={() => setSortDesc(s => !s)}>Ordenar por risco {sortDesc ? '↓' : '↑'}</Button>
        </>}
      />

      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: '#F5F5F5' }}>
              {['Setor','Colaboradores','Participação','Índice de Risco','Tendência','Status',''].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '14px 20px', fontSize: 11, fontWeight: 600,
                  color: C.dim, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={s.id}
                style={{ borderTop: '1px solid #F0F0F0', cursor: 'pointer', transition: 'background .12s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.rowHover}
                onMouseLeave={e => e.currentTarget.style.background = ''}
                onClick={() => go('detalhe', s)}
              >
                <td style={{ padding: '16px 20px', fontWeight: 600, color: C.ink }}>{s.name}</td>
                <td style={{ padding: '16px 20px', color: C.text }}>{s.emp}</td>
                <td style={{ padding: '16px 20px', color: C.text }}>{s.part}%</td>
                <td style={{ padding: '16px 20px', color: s.idxColor, fontWeight: 700, fontSize: 15 }}>{s.idx}</td>
                <td style={{ padding: '16px 20px', color: s.trendColor, fontWeight: 500 }}>
                  {trendIcon(s.trend)} {s.trendLabel}
                </td>
                <td style={{ padding: '16px 20px' }}><StatusBadge kind={s.status} /></td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <span style={{ color: C.primary, fontSize: 13, fontWeight: 500 }}>Ver detalhe →</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Distribuição de Risco por Dimensão</h3>
        <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 18 }}>Cada célula mostra o índice (0–10) por dimensão psicossocial e setor.</div>

        <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(5, 1fr)', gap: 4 }}>
          <div/>
          {SECTORS.map(s => (
            <div key={s.id} style={{ fontSize: 11, fontWeight: 600, color: C.muted, textAlign: 'center', padding: '8px 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.name}</div>
          ))}
          {DIMENSIONS.map((dim, di) => (
            <React.Fragment key={dim}>
              <div style={{ fontSize: 12.5, color: C.text, fontWeight: 500, padding: '12px 8px', display: 'flex', alignItems: 'center' }}>{dim}</div>
              {HEAT[di].map((v, si) => (
                <div key={si} style={{
                  background: heatBg(v),
                  borderRadius: 6, padding: '14px 8px',
                  fontSize: 14, fontWeight: 700, color: heatColor(v),
                  textAlign: 'center', cursor: 'default',
                  transition: 'transform .12s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}
                >{v.toFixed(1)}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// SCREEN 03 — SETOR DETALHE
// ============================================================
function RadarChart({ data, max = 10, color = C.brand }) {
  const size = 320, cx = size / 2, cy = size / 2, r = 120;
  const n = data.length;
  const angle = i => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const point = (i, v) => {
    const rr = (v / max) * r;
    return [cx + Math.cos(angle(i)) * rr, cy + Math.sin(angle(i)) * rr];
  };
  const polygon = data.map((d, i) => point(i, d.value).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((rg, i) => (
        <polygon key={i}
          points={data.map((_, j) => {
            const rr = rg * r;
            return [cx + Math.cos(angle(j)) * rr, cy + Math.sin(angle(j)) * rr].join(',');
          }).join(' ')}
          fill="none" stroke="#EEE" strokeWidth="1"
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = point(i, max);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#EEE" strokeWidth="1"/>;
      })}
      <polygon points={polygon} fill={color} fillOpacity="0.22" stroke={color} strokeWidth="2"/>
      {data.map((d, i) => {
        const [x, y] = point(i, d.value);
        return <circle key={i} cx={x} cy={y} r="4" fill={color}/>;
      })}
      {data.map((d, i) => {
        const [x, y] = point(i, max);
        const lx = cx + (x - cx) * 1.18;
        const ly = cy + (y - cy) * 1.18;
        return (
          <g key={i}>
            <text x={lx} y={ly} fontSize="11" fill={C.muted} textAnchor="middle" dominantBaseline="middle">{d.label}</text>
            <text x={lx} y={ly + 13} fontSize="11" fontWeight="700" fill={heatColor(d.value)} textAnchor="middle">{d.value.toFixed(1)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ScreenDetalhe({ go, sector }) {
  const s = sector || SECTORS[0];
  const radarData = [
    { label: 'Sobrecarga', value: 9.1 },
    { label: 'Conflitos', value: 8.4 },
    { label: 'Autonomia', value: 6.2 },
    { label: 'Insegurança', value: 5.8 },
    { label: 'Liderança', value: 5.0 },
    { label: 'Suporte Social', value: 3.4 },
  ];
  const factors = [
    { name: 'Sobrecarga de trabalho', val: 9.1, kind: 'crit' },
    { name: 'Conflito com liderança', val: 8.4, kind: 'crit' },
    { name: 'Baixa autonomia', val: 6.2, kind: 'warn' },
    { name: 'Insegurança sobre futuro', val: 5.8, kind: 'warn' },
    { name: 'Suporte social', val: 3.4, kind: 'ok' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <a onClick={() => go('setores')} style={{
          color: C.primary, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>← Setores</a>
        <span style={{ color: C.dim }}>/</span>
        <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>Setor {s.name}</span>
        <StatusBadge kind={s.status} />
      </div>

      <PageHeader
        title={`Setor ${s.name}`}
        subtitle={`${s.emp} colaboradores · ${s.part}% participação`}
        actions={<Button kind="outline" icon="download">Baixar relatório</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Dimensões Avaliadas</h3>
          <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 8 }}>Mapa de calor das 6 dimensões psicossociais (0–10).</div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
            <RadarChart data={radarData} />
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Fatores de Risco — Priorização</h3>
          <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 18 }}>Ordenado pelo nível de risco identificado.</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {factors.map((f, i) => (
              <div key={f.name}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: '#F5F5F5', color: C.muted,
                      fontSize: 12, fontWeight: 600,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>{i + 1}</span>
                    <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 500 }}>{f.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: heatColor(f.val) }}>{f.val}</span>
                    <StatusBadge kind={f.kind} />
                  </div>
                </div>
                <div style={{ height: 6, background: '#F1F1F1', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${f.val * 10}%`, height: '100%', background: heatColor(f.val) }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: 0 }}>Recomendações de Ação</h3>
          <Button kind="primary" onClick={() => go('plano')}>Adicionar ao Plano de Ação →</Button>
        </div>
        <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 18 }}>Ações sugeridas com base no diagnóstico atual deste setor.</div>
        <ol style={{ paddingLeft: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { t: 'Redistribuir cargas e revisar metas operacionais', d: 'Mapear pontos de gargalo e renegociar prazos com liderança intermediária.' },
            { t: 'Programa de Comunicação Não-Violenta para gestores', d: 'Treinar lideranças diretas em escuta ativa e mediação de conflitos.' },
            { t: 'Canal confidencial de relatos via terceiro independente', d: 'Estabelecer fluxo seguro de denúncias com retorno em até 7 dias.' },
          ].map((r, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: '#FAFAFA', borderRadius: 8 }}>
              <span style={{
                width: 26, height: 26, borderRadius: 8, background: C.primary, color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}>{i + 1}</span>
              <div>
                <div style={{ fontSize: 13.5, color: C.ink, fontWeight: 600 }}>{r.t}</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{r.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

// ============================================================
// SCREEN 04 — PLANO DE AÇÃO
// ============================================================
const KANBAN = [
  {
    id: 'pendente', title: 'Pendente', dot: C.crit,
    cards: [
      { t: 'Criar canal confidencial de relatos', chip: 'Operacional', meta: 'Prioridade alta', edge: C.crit },
      { t: 'Reunião com gestores sobre carga de trabalho', chip: 'Operacional', meta: 'Prioridade alta', edge: C.crit },
      { t: 'Revisão do processo de metas', chip: 'Vendas', meta: 'Prioridade média', edge: C.warn },
    ],
  },
  {
    id: 'andamento', title: 'Em Andamento', dot: C.warn,
    cards: [
      { t: 'Programa de liderança: CNV', chip: 'Todos', meta: 'Início próximo', edge: C.crit },
      { t: 'Workshop gestão de tempo', chip: 'Operacional', meta: '50% concluído', progress: 50, edge: C.warn },
      { t: 'Pesquisa de clima complementar', chip: 'Adm.', meta: '30% concluído', progress: 30, edge: C.ok },
    ],
  },
  {
    id: 'validacao', title: 'Em Validação', dot: C.ok,
    cards: [
      { t: 'Flexibilidade de horário para vendas', chip: 'Vendas', meta: 'Aguarda RH', edge: C.warn },
      { t: 'Programa de mentoria entre setores', chip: 'Todos', meta: 'Aguarda diretoria', edge: C.ok },
    ],
  },
  {
    id: 'concluida', title: 'Concluída', dot: C.dim,
    cards: [
      { t: 'Treinamento primeiros socorros psicológicos', chip: 'Todos', meta: '✓ Concluído', edge: C.crit, done: true },
      { t: 'Adequação PGR para NR-01', chip: 'Compliance', meta: '✓ Concluído', edge: C.warn, done: true },
    ],
  },
];

function MiniProgress({ pct, color }) {
  return (
    <div style={{ height: 4, background: '#F0F0F0', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2 }}/>
    </div>
  );
}

// Edge color per column id
const EDGE_BY_COL = {
  pendente: C.crit,
  andamento: C.warn,
  validacao: C.ok,
  concluida: C.dim,
};
const BG_BY_COL = {
  pendente: '#FFF5F5',
  andamento: '#FFFBEB',
  validacao: '#F0FDFA',
  concluida: '#F8FAFC',
};

// Seed kanban with stable ids
const seedKanban = () => KANBAN.map(col => ({
  ...col,
  cards: col.cards.map((c, i) => ({ ...c, id: `${col.id}-${i}`, edge: EDGE_BY_COL[col.id] })),
}));

function ScreenPlano() {
  const [cols, setCols] = useState(seedKanban);
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const total = cols.reduce((n, c) => n + c.cards.length, 0);
  const counts = Object.fromEntries(cols.map(c => [c.id, c.cards.length]));
  const pct = id => total ? Math.round((counts[id] / total) * 100) : 0;

  const onDragStart = (e, cardId, fromColId) => {
    setDragId(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${fromColId}|${cardId}`);
    // slight transparency on the source
    requestAnimationFrame(() => {
      if (e.target && e.target.style) e.target.style.opacity = '0.4';
    });
  };
  const onDragEnd = (e) => {
    if (e.target && e.target.style) e.target.style.opacity = '';
    setDragId(null);
    setOverCol(null);
  };
  const onDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overCol !== colId) setOverCol(colId);
  };
  const onDragLeave = (e, colId) => {
    // only clear if leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      if (overCol === colId) setOverCol(null);
    }
  };
  const onDrop = (e, toColId) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    const [fromColId, cardId] = data.split('|');
    if (!fromColId || !cardId || fromColId === toColId) {
      setOverCol(null);
      return;
    }
    setCols(prev => {
      const next = prev.map(c => ({ ...c, cards: [...c.cards] }));
      const from = next.find(c => c.id === fromColId);
      const to = next.find(c => c.id === toColId);
      if (!from || !to) return prev;
      const idx = from.cards.findIndex(c => c.id === cardId);
      if (idx < 0) return prev;
      const [card] = from.cards.splice(idx, 1);
      const updated = {
        ...card,
        edge: EDGE_BY_COL[toColId],
        done: toColId === 'concluida',
        justMoved: Date.now(),
      };
      to.cards.push(updated);
      return next;
    });
    setOverCol(null);
  };

  return (
    <div>
      <PageHeader
        title="Plano de Ação"
        subtitle="Arraste os cards entre as colunas para atualizar o status"
        actions={<>
          <Button kind="outline">Filtrar por setor</Button>
          <Button kind="outline">Filtrar prioridade</Button>
          <Button kind="lime" icon="plus">Nova Ação</Button>
        </>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <ScoreCard label="Total de Ações" value={total} valueColor={C.ink} trend="atualizado agora" />
        <ScoreCard label="Em Andamento" value={counts.andamento} valueColor={C.ok} trend={`${pct('andamento')}% do total`} mini={<MiniProgress pct={pct('andamento')} color={C.ok} />} />
        <ScoreCard label="Concluídas" value={counts.concluida} valueColor={C.muted} trend={`${pct('concluida')}% do total`} mini={<MiniProgress pct={pct('concluida')} color={C.muted} />} />
        <ScoreCard label="Pendentes" value={counts.pendente} valueColor={C.crit} trend={`${pct('pendente')}% do total`} mini={<MiniProgress pct={pct('pendente')} color={C.crit} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {cols.map(col => {
          const isOver = overCol === col.id;
          return (
            <div key={col.id}
              onDragOver={e => onDragOver(e, col.id)}
              onDragLeave={e => onDragLeave(e, col.id)}
              onDrop={e => onDrop(e, col.id)}
              style={{
                background: isOver ? '#EAF6F4' : C.page,
                borderRadius: 12, padding: 14,
                border: `2px dashed ${isOver ? C.primary : 'transparent'}`,
                transition: 'background .15s, border-color .15s',
                minHeight: 200,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot }}/>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{col.title}</span>
                  <span style={{ fontSize: 12, color: C.muted, background: '#fff', padding: '2px 8px', borderRadius: 999 }}>{col.cards.length}</span>
                </div>
                <button style={{ background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', padding: 2 }}>
                  <Icon name="plus" size={14} color="currentColor" />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 80 }}>
                {col.cards.map(c => (
                  <div key={c.id}
                    className={c.justMoved && (Date.now() - c.justMoved) < 800 ? 'kanban-card kanban-card--moved' : 'kanban-card'}
                    draggable
                    onDragStart={e => onDragStart(e, c.id, col.id)}
                    onDragEnd={onDragEnd}
                    style={{
                      background: BG_BY_COL[col.id], borderRadius: 8, padding: '12px 14px',
                      borderLeft: `3px solid ${c.edge}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      cursor: 'grab',
                      transition: 'background .35s ease, border-color .35s ease, box-shadow .2s, transform .2s cubic-bezier(.34,1.56,.64,1)',
                      opacity: c.done ? 0.7 : 1,
                      userSelect: 'none',
                    }}
                    onMouseEnter={e => { if (dragId) return; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = ''; }}
                    onMouseDown={e => e.currentTarget.style.cursor = 'grabbing'}
                    onMouseUp={e => e.currentTarget.style.cursor = 'grab'}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, lineHeight: 1.4, marginBottom: 10, textDecoration: c.done ? 'line-through' : 'none' }}>{c.t}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{
                        fontSize: 11, color: C.muted, background: '#F5F5F5',
                        padding: '3px 8px', borderRadius: 4, fontWeight: 500,
                      }}>{c.chip}</span>
                      <span style={{ fontSize: 11, color: C.muted }}>{c.meta}</span>
                    </div>
                    {c.progress != null && <MiniProgress pct={c.progress} color={c.edge} />}
                  </div>
                ))}
                {col.cards.length === 0 && (
                  <div style={{
                    fontSize: 12, color: C.dim, textAlign: 'center',
                    padding: '24px 8px', border: `1px dashed ${C.border}`,
                    borderRadius: 8, background: 'rgba(255,255,255,0.5)',
                  }}>Solte um card aqui</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SCREEN 05 — RELATÓRIOS
// ============================================================
function ScreenRelatorios() {
  const [setor, setSetor] = useState('Todos');
  const [periodo, setPeriodo] = useState('Último trimestre');
  const [tipo, setTipo] = useState('Executivo');
  const [opts, setOpts] = useState({ graficos: true, recomendacoes: true, plano: false, historico: false });
  const toggle = k => setOpts(o => ({ ...o, [k]: !o[k] }));

  const Select = ({ label, value, onChange, options }) => (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', padding: '10px 12px', borderRadius: 8,
        border: `1px solid ${C.border}`, fontSize: 13.5, color: C.text,
        background: '#fff', fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
      }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  const history = [
    { name: 'Diagnóstico Geral — Q1', type: 'Técnico', date: '—', by: 'Ana Ribeiro' },
    { name: 'Resumo Executivo', type: 'Executivo', date: '—', by: 'Cliente Demo' },
    { name: 'Relatório de Compliance NR-01', type: 'Compliance', date: '—', by: 'Marcos Lima' },
  ];

  return (
    <div>
      <PageHeader title="Relatórios" subtitle="Gere relatórios técnicos e executivos a partir do diagnóstico" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {[
          { t: 'Relatório Técnico Consolidado', d: 'Análise completa por setor, dimensão e fator de risco. Inclui metodologia e tabelas brutas.', pages: '32 páginas' },
          { t: 'Relatório Executivo', d: 'Síntese visual para C-level: principais riscos, recomendações priorizadas e cronograma.', pages: '8 páginas' },
        ].map((r, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: 0 }}>{r.t}</h3>
              <StatusBadge kind="ready" />
            </div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{r.d}</div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 10 }}>{r.pages} · PDF</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <Button kind="outline" icon="eye">Preview</Button>
              <Button kind="primary" icon="download">Baixar PDF</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: '0 0 4px' }}>Gerar Relatório Personalizado</h3>
        <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 18 }}>Configure escopo, período e seções a incluir.</div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
          <Select label="Setor" value={setor} onChange={setSetor} options={['Todos','Operacional','Vendas','Administrativo','TI','RH']} />
          <Select label="Período" value={periodo} onChange={setPeriodo} options={['Último mês','Último trimestre','Último semestre','Último ano']} />
          <Select label="Tipo" value={tipo} onChange={setTipo} options={['Executivo','Técnico','Compliance']} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          {[
            ['graficos','Incluir gráficos'],
            ['recomendacoes','Incluir recomendações'],
            ['plano','Incluir plano de ação'],
            ['historico','Incluir histórico'],
          ].map(([k, label]) => (
            <Chip key={k} active={opts[k]} onClick={() => toggle(k)}>{label}</Chip>
          ))}
        </div>

        <Button kind="primary">Gerar Relatório →</Button>
      </Card>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: 0 }}>Histórico</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: '#F5F5F5' }}>
              {['Nome','Tipo','Data','Gerado por',''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 24px', fontSize: 11, fontWeight: 600, color: C.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} style={{ borderTop: '1px solid #F0F0F0', transition: 'background .12s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.rowHover}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <td style={{ padding: '14px 24px', color: C.ink, fontWeight: 500 }}>{h.name}</td>
                <td style={{ padding: '14px 24px', color: C.text }}>{h.type}</td>
                <td style={{ padding: '14px 24px', color: C.muted }}>{h.date}</td>
                <td style={{ padding: '14px 24px', color: C.muted }}>{h.by}</td>
                <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                  <button style={{ background: 'transparent', border: 'none', color: C.primary, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="download" size={14} color="currentColor"/> Baixar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============================================================
// SCREEN — EVOLUÇÃO (line chart)
// ============================================================
function LineChart({ series, labels, height = 240 }) {
  const w = 720, h = height, pad = { l: 36, r: 16, t: 16, b: 28 };
  const innerW = w - pad.l - pad.r, innerH = h - pad.t - pad.b;
  const allVals = series.flatMap(s => s.values);
  const max = Math.ceil(Math.max(...allVals));
  const min = 0;
  const x = i => pad.l + (i * innerW) / (labels.length - 1);
  const y = v => pad.t + innerH - ((v - min) / (max - min)) * innerH;
  const path = vals => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const yy = pad.t + innerH * (1 - t);
        const val = (min + (max - min) * t).toFixed(0);
        return (
          <g key={i}>
            <line x1={pad.l} y1={yy} x2={w - pad.r} y2={yy} stroke="#F0F0F0"/>
            <text x={pad.l - 8} y={yy + 4} fontSize="10" fill={C.muted} textAnchor="end">{val}</text>
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text key={i} x={x(i)} y={h - 8} fontSize="10" fill={C.muted} textAnchor="middle">{l}</text>
      ))}
      {series.map((s, si) => (
        <g key={si}>
          <path d={path(s.values)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#fff" stroke={s.color} strokeWidth="2"/>)}
        </g>
      ))}
    </svg>
  );
}

function ScreenEvolucao() {
  const labels = ['M-6', 'M-5', 'M-4', 'M-3', 'M-2', 'M-1', 'Atual'];
  const series = [
    { name: 'Operacional', color: C.crit, values: [7.4, 7.8, 8.0, 8.1, 7.9, 8.0, 8.2] },
    { name: 'Vendas', color: C.warn, values: [6.8, 6.6, 6.4, 6.3, 6.2, 6.1, 6.1] },
    { name: 'Administrativo', color: '#A78BFA', values: [6.2, 6.1, 6.0, 5.9, 5.8, 5.8, 5.7] },
    { name: 'TI', color: C.ok, values: [4.8, 4.6, 4.4, 4.2, 4.1, 4.0, 3.9] },
    { name: 'RH', color: '#34D399', values: [3.4, 3.2, 3.1, 3.0, 2.9, 2.9, 2.8] },
  ];

  return (
    <div>
      <PageHeader
        title="Evolução"
        subtitle="Variação do índice de risco ao longo dos últimos períodos"
        actions={<>
          <Button kind="outline">Período: 7 meses</Button>
          <Button kind="primary" icon="download">Exportar</Button>
        </>}
      />

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.ink, margin: 0 }}>Índice de risco por setor</h3>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {series.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.text }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }}/>{s.name}
              </div>
            ))}
          </div>
        </div>
        <LineChart series={series} labels={labels} />
      </Card>
    </div>
  );
}

// ============================================================
// LOGIN
// ============================================================
function Login({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => onSignIn(email || 'demo@mindlink.com.br'), 700);
  };

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      background: 'linear-gradient(135deg, #0F2925 0%, #1A3A36 55%, #1A8A7D 140%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      {/* Animated orbs */}
      <div className="ml-orb" style={{ width: 480, height: 480, background: '#4ECDC4', top: '-120px', left: '-120px', animation: 'ml-orb-1 9s ease-in-out infinite' }}/>
      <div className="ml-orb" style={{ width: 420, height: 420, background: '#1A8A7D', bottom: '-140px', right: '-100px', animation: 'ml-orb-2 11s ease-in-out infinite' }}/>
      <div className="ml-orb" style={{ width: 320, height: 320, background: '#4ADE80', opacity: 0.25, top: '40%', right: '20%', animation: 'ml-orb-3 13s ease-in-out infinite' }}/>

      {/* Card */}
      <div className="ml-page-enter" style={{
        position: 'relative', zIndex: 2,
        width: 420, padding: '44px 40px',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 20,
        boxShadow: '0 30px 80px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.4) inset',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="ml-logo-enter" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            background: C.sidebar, padding: '12px 18px', borderRadius: 12,
            boxShadow: '0 8px 20px rgba(26,58,54,0.25)',
          }}>
            <img src="assets/mindlink-logo.png" alt="MindLink" style={{ height: 30, display: 'block' }}/>
          </div>
        </div>

        <h1 style={{
          fontSize: 24, fontWeight: 700, color: C.ink, textAlign: 'center',
          margin: '0 0 6px', letterSpacing: '-0.01em',
        }}>Bem-vindo de volta</h1>
        <p style={{ fontSize: 13.5, color: C.muted, textAlign: 'center', margin: '0 0 28px' }}>
          Acesse seu painel de diagnóstico psicossocial
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>E-mail</span>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              className="ml-input"
              style={{
                padding: '12px 14px', borderRadius: 10,
                border: `1px solid ${C.border}`, fontSize: 14,
                fontFamily: 'inherit', color: C.ink, background: '#fff',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Senha</span>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                value={pw} onChange={e => setPw(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="ml-input"
                style={{
                  width: '100%', padding: '12px 44px 12px 14px', borderRadius: 10,
                  border: `1px solid ${C.border}`, fontSize: 14,
                  fontFamily: 'inherit', color: C.ink, background: '#fff',
                }}
              />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{
                  position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', padding: 8, cursor: 'pointer',
                  color: C.muted, display: 'flex', borderRadius: 6,
                }}
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <Icon name="eye" size={16} color="currentColor" />
              </button>
            </div>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5, marginTop: 2 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, color: C.text, cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: C.primary }}/>
              Lembrar de mim
            </label>
            <a style={{ color: C.primary, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>Esqueci a senha</a>
          </div>

          <button type="submit" disabled={loading}
            className="ml-btn-primary"
            style={{
              marginTop: 8, padding: '13px 16px', borderRadius: 10,
              background: loading ? '#0f6f64' : C.primary, color: '#fff',
              border: 'none', fontSize: 14.5, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
            {loading ? (
              <>
                <span className="ml-spin" style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
                  display: 'inline-block',
                }}/>
                Entrando…
              </>
            ) : 'Entrar'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 14px', color: C.dim, fontSize: 12 }}>
          <span style={{ flex: 1, height: 1, background: C.border }}/>
          ou
          <span style={{ flex: 1, height: 1, background: C.border }}/>
        </div>

        <div style={{ fontSize: 12.5, color: C.muted, textAlign: 'center' }}>
          Não tem uma conta? <a style={{ color: C.primary, fontWeight: 600, cursor: 'pointer' }}>Solicite acesso</a>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 18, width: '100%', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.55)', zIndex: 2 }}>
        © MindLink · Diagnóstico psicossocial · Demonstração
      </div>
    </div>
  );
}

// ============================================================
// APP
// ============================================================
function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState({ id: 'overview', sector: null });
  const go = (id, sector = null) => {
    setRoute({ id, sector });
    window.scrollTo(0, 0);
  };

  if (!user) return <Login onSignIn={(email) => setUser({ email })} />;

  const screen = (() => {
    switch (route.id) {
      case 'overview': return <ScreenOverview go={go}/>;
      case 'setores': return <ScreenSetores go={go}/>;
      case 'detalhe': return <ScreenDetalhe go={go} sector={route.sector}/>;
      case 'plano': return <ScreenPlano/>;
      case 'relatorios': return <ScreenRelatorios/>;
      case 'evolucao': return <ScreenEvolucao/>;
      default: return <ScreenOverview go={go}/>;
    }
  })();

  // Keep sidebar active for the parent of detalhe
  const sidebarActive = route.id === 'detalhe' ? 'setores' : route.id;

  return (
    <div className="ml-page-enter" key={route.id + (route.sector?.id || '')} style={{
      display: 'flex', height: '100vh', background: C.page,
      fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif',
      color: C.text,
    }}
    data-screen-label={`MindLink — ${route.id}`}
    >
      <Sidebar active={sidebarActive} onNav={id => go(id)} onSignOut={() => setUser(null)} userEmail={user.email}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />
        <main key={route.id + (route.sector?.id || '')} className="ml-page-enter" style={{ flex: 1, overflow: 'auto', padding: 32, background: C.page }}>
          {screen}
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
