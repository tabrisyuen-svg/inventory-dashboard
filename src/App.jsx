import React, { useState, useMemo, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Minus, Package, ShoppingBag, Search, X, Edit2, Check, AlertTriangle, Clock } from 'lucide-react';

const INITIAL_DATA = [
  { sku: 'HAPE-001', name: '木製小火車套裝',  updated: '14:32', central: 145, h24: -13, h48: -27, h72: -41, platforms: { hktv_hape: true,  hktv_ric: true,  eurekakids: true,  ricoutlet: true  } },
  { sku: 'HAPE-002', name: '彩虹疊疊樂',      updated: '13:15', central:  89, h24:  +5, h48:  -8, h72: -12, platforms: { hktv_hape: true,  hktv_ric: false, eurekakids: true,  ricoutlet: false } },
  { sku: 'HAPE-003', name: '木質牛油果玩具',  updated: '12:50', central: 210, h24:  -6, h48: -18, h72: -30, platforms: { hktv_hape: true,  hktv_ric: true,  eurekakids: false, ricoutlet: true  } },
  { sku: 'HAPE-004', name: '感統觸覺球組',    updated: '11:40', central:   1, h24: -20, h48: -35, h72: -50, platforms: { hktv_hape: true,  hktv_ric: true,  eurekakids: true,  ricoutlet: true  } },
  { sku: 'HAPE-005', name: '嬰兒木製搖搖馬', updated: '10:22', central:   0, h24:   0, h48:  -4, h72: -10, platforms: { hktv_hape: true,  hktv_ric: false, eurekakids: true,  ricoutlet: true  } },
  { sku: 'EUKA-001', name: '磁力拼圖組合',    updated: '09:55', central: 182, h24: +12, h48:  +8, h72: +20, platforms: { hktv_hape: false, hktv_ric: true,  eurekakids: true,  ricoutlet: true  } },
  { sku: 'EUKA-002', name: '科學實驗套裝',    updated: '09:10', central:  55, h24:  -3, h48:  -9, h72: -14, platforms: { hktv_hape: true,  hktv_ric: true,  eurekakids: true,  ricoutlet: false } },
  { sku: 'EUKA-003', name: '兒童畫板套裝',    updated: '08:40', central:   2, h24:  -1, h48:  -5, h72:  -9, platforms: { hktv_hape: true,  hktv_ric: true,  eurekakids: true,  ricoutlet: true  } },
];

const PLATFORMS = [
  { key: 'hktv_hape',  label: 'HKTV Hape',     color: '#d97706', icon: 'bag' },
  { key: 'hktv_ric',   label: 'HKTV Ricoutlet', color: '#ea580c', icon: 'bag' },
  { key: 'eurekakids', label: 'Eurekakids',     color: '#059669', icon: 'pkg' },
  { key: 'ricoutlet',  label: 'Ricoutlet',      color: '#0284c7', icon: 'pkg' },
];

// ── Scheduled sync helpers ──────────────────────────────────────────────────
const getNext0830HKT = () => {
  const now = Date.now();
  const hktOffset = 8 * 60 * 60 * 1000;
  const hktNow = new Date(now + hktOffset);
  // 08:30 HKT = 00:30 UTC same calendar date
  const todayTarget = Date.UTC(hktNow.getUTCFullYear(), hktNow.getUTCMonth(), hktNow.getUTCDate(), 0, 30, 0, 0);
  return todayTarget > now ? todayTarget : todayTarget + 86400000;
};

const formatCountdown = (ms) => {
  if (ms <= 0) return '同步中…';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m 後` : `${m}m 後`;
};

const getSyncLabel = (nextUTC) => {
  const hktNow = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const hktNext = new Date(nextUTC + 8 * 60 * 60 * 1000);
  return hktNow.getUTCDate() === hktNext.getUTCDate() && hktNow.getUTCMonth() === hktNext.getUTCMonth()
    ? '今天 08:30' : '明天 08:30';
};

const getCurrentHKTTime = () => {
  const d = new Date(Date.now() + 8 * 60 * 60 * 1000);
  return `${d.getUTCHours().toString().padStart(2,'0')}:${d.getUTCMinutes().toString().padStart(2,'0')}`;
};

// ── Sub-components ──────────────────────────────────────────────────────────
const Delta = ({ val }) => {
  if (val === 0) return <span style={{ color:'#9ca3af', display:'flex', alignItems:'center', gap:2, fontSize:12, justifyContent:'center' }}><Minus size={11}/>0</span>;
  if (val > 0)   return <span style={{ color:'#059669', display:'flex', alignItems:'center', gap:2, fontSize:12, fontWeight:600, justifyContent:'center' }}><TrendingUp size={11}/>+{val}</span>;
  return <span style={{ color:'#dc2626', display:'flex', alignItems:'center', gap:2, fontSize:12, fontWeight:600, justifyContent:'center' }}><TrendingDown size={11}/>{val}</span>;
};

const CentralCell = ({ value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const commit = () => { onSave(Math.max(0, Number(val))); setEditing(false); };
  const cancel = () => { setVal(value); setEditing(false); };
  const isLow = value < 2;
  if (editing) return (
    <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'center' }}>
      <input autoFocus type="number" value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key==='Enter') commit(); if (e.key==='Escape') cancel(); }}
        style={{ width:64, background:'#fff', border:'1.5px solid #3b82f6', borderRadius:6, color:'#1e293b', padding:'3px 6px', fontSize:14, fontWeight:700, textAlign:'center', outline:'none' }}/>
      <button onClick={commit} style={{ background:'none', border:'none', cursor:'pointer', color:'#059669', padding:2 }}><Check size={14}/></button>
      <button onClick={cancel} style={{ background:'none', border:'none', cursor:'pointer', color:'#dc2626', padding:2 }}><X size={14}/></button>
    </div>
  );
  return (
    <div onClick={() => { setVal(value); setEditing(true); }}
      style={{ display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', padding:'4px 10px', borderRadius:8, justifyContent:'center' }}
      onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
      <span style={{ fontSize:16, fontWeight:800, color: isLow?'#dc2626':'#0f172a' }}>{value}</span>
      <Edit2 size={11} color={isLow?'#dc2626':'#94a3b8'}/>
    </div>
  );
};

const PlatformCell = ({ value, enabled, onToggle }) => {
  const isLow = enabled && value < 2;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      {enabled ? (
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <span style={{ fontSize:14, fontWeight:700, color: isLow?'#dc2626':'#334155' }}>{value}</span>
          {isLow && <span style={{ fontSize:9, background:'#fef2f2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:4, padding:'1px 5px', fontWeight:700 }}>低庫存</span>}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <span style={{ fontSize:16, fontWeight:700, color:'#cbd5e1' }}>—</span>
          <span style={{ fontSize:9, background:'#f1f5f9', color:'#94a3b8', border:'1px solid #e2e8f0', borderRadius:4, padding:'1px 5px', fontWeight:700 }}>已推 0</span>
        </div>
      )}
      <button onClick={onToggle} style={{ padding:'2px 8px', borderRadius:4, fontSize:9, fontWeight:700, cursor:'pointer', transition:'all 0.15s', border:`1px solid ${enabled?'#bbf7d0':'#fecdd3'}`, background: enabled?'#f0fdf4':'#fff1f2', color: enabled?'#059669':'#dc2626' }}>
        {enabled ? '啟用中' : '已停用'}
      </button>
    </div>
  );
};

// ── Low Stock Modal ──────────────────────────────────────────────────────────
const LowStockModal = ({ items, onClose }) => (
  <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center' }}>
    <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(3px)' }}/>
    <div style={{ position:'relative', background:'#fff', borderRadius:16, boxShadow:'0 24px 64px rgba(0,0,0,0.2)', width:'100%', maxWidth:520, margin:'0 16px', overflow:'hidden' }}>

      {/* Modal Header */}
      <div style={{ background:'#fef2f2', borderBottom:'1px solid #fecaca', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <AlertTriangle size={18} color="#dc2626"/>
          <span style={{ fontSize:15, fontWeight:700, color:'#dc2626' }}>庫存不足警示</span>
          <span style={{ fontSize:11, background:'#dc2626', color:'#fff', borderRadius:99, padding:'1px 9px', fontWeight:800 }}>{items.length}</span>
        </div>
        <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b', padding:4, borderRadius:6 }}
          onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <X size={16}/>
        </button>
      </div>

      {/* Modal Body */}
      <div style={{ maxHeight:360, overflowY:'auto' }}>
        {items.map((item, idx) => (
          <div key={item.sku} style={{ padding:'14px 20px', borderBottom: idx < items.length - 1 ? '1px solid #f1f5f9' : 'none', display:'flex', alignItems:'center', justifyContent:'space-between', background: idx % 2 === 0 ? '#fff' : '#fafbfc' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontFamily:'monospace', fontSize:11, color:'#2563eb', background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:5, padding:'2px 8px' }}>{item.sku}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{item.name}</div>
                <div style={{ fontSize:10, color:'#94a3b8', marginTop:2 }}>
                  啟用平台：{PLATFORMS.filter(p => item.platforms[p.key]).map(p => p.label).join(' · ') || '全部停用'}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              <span style={{ fontSize:11, color:'#94a3b8' }}>中央倉</span>
              <span style={{ fontSize:22, fontWeight:800, color: item.central === 0 ? '#ef4444' : '#f97316', minWidth:28, textAlign:'right', lineHeight:1 }}>{item.central}</span>
              <span style={{ fontSize:10, background: item.central === 0 ? '#fef2f2' : '#fff7ed', color: item.central === 0 ? '#dc2626' : '#ea580c', border:`1px solid ${item.central === 0 ? '#fecaca' : '#fed7aa'}`, borderRadius:5, padding:'2px 7px', fontWeight:700 }}>
                {item.central === 0 ? '缺貨' : '極低'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Footer */}
      <div style={{ padding:'12px 20px', borderTop:'1px solid #f1f5f9', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:11, color:'#94a3b8' }}>建議盡快補貨或停用相關平台以避免超賣</span>
        <button onClick={onClose} style={{ fontSize:12, fontWeight:700, color:'#fff', background:'#dc2626', border:'none', borderRadius:7, padding:'6px 16px', cursor:'pointer' }}>
          關閉
        </button>
      </div>
    </div>
  </div>
);

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function InventoryDashboard() {
  const [data, setData]               = useState(INITIAL_DATA);
  const [timeFilter, setTimeFilter]   = useState('h24');
  const [search, setSearch]           = useState('');
  const [syncPulse, setSyncPulse]     = useState(false);
  const [lowStockOpen, setLowStockOpen] = useState(false);

  // Scheduled sync state
  const [nextSync, setNextSync]           = useState(() => getNext0830HKT());
  const [countdown, setCountdown]         = useState(() => formatCountdown(getNext0830HKT() - Date.now()));
  const [lastSyncedTime, setLastSyncedTime] = useState('08:30');
  const [syncFlash, setSyncFlash]         = useState(false);

  // Countdown ticker — re-runs whenever nextSync changes
  useEffect(() => {
    const tick = () => {
      const ms = nextSync - Date.now();
      if (ms <= 0) {
        // Fire scheduled sync
        setLastSyncedTime(getCurrentHKTTime());
        setSyncFlash(true);
        setTimeout(() => setSyncFlash(false), 4000);
        setNextSync(getNext0830HKT()); // triggers new effect cycle
      } else {
        setCountdown(formatCountdown(ms));
      }
    };
    tick();
    const id = setInterval(tick, 30000); // refresh every 30 s
    return () => clearInterval(id);
  }, [nextSync]);

  const filtered = useMemo(() =>
    data.filter(r =>
      r.sku.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase())
    ), [data, search]);

  const lowStockItems = useMemo(() => data.filter(r => r.central < 2), [data]);
  const disabledCount = data.reduce((t, r) => t + PLATFORMS.filter(p => !r.platforms[p.key]).length, 0);

  const updateCentral  = (sku, v) => setData(prev => prev.map(r => r.sku === sku ? { ...r, central: v } : r));
  const togglePlatform = (sku, k) => setData(prev => prev.map(r => r.sku === sku ? { ...r, platforms: { ...r.platforms, [k]: !r.platforms[k] } } : r));
  const handleSync     = () => {
    setSyncPulse(true);
    setTimeout(() => setSyncPulse(false), 800);
    setLastSyncedTime(getCurrentHKTTime());
  };

  const th  = (x={}) => ({ padding:'11px 14px', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em', background:'#f8fafc', borderBottom:'2px solid #e2e8f0', whiteSpace:'nowrap', ...x });
  const td  = (x={}) => ({ padding:'10px 12px', borderBottom:'1px solid #f1f5f9', verticalAlign:'middle', ...x });
  const div = { borderLeft:'2px solid #e2e8f0' };
  const tBtn = (a) => ({ padding:'5px 14px', borderRadius:7, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, background: a?'#2563eb':'#f1f5f9', color: a?'#fff':'#64748b', transition:'all 0.15s' });

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#f8fafc', fontFamily:'system-ui, sans-serif', color:'#1e293b' }}>

      {/* Low Stock Modal */}
      {lowStockOpen && lowStockItems.length > 0 && (
        <LowStockModal items={lowStockItems} onClose={() => setLowStockOpen(false)}/>
      )}

      {/* ── Header ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontSize:16, fontWeight:800, color:'#0f172a', letterSpacing:'-0.4px' }}>📦 庫存管理系統</span>
          <span style={{ fontSize:11, color:'#94a3b8', background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:6, padding:'2px 9px' }}>上次同步 {lastSyncedTime}</span>

          {/* Scheduled sync indicator */}
          <span style={{ fontSize:11, color: syncFlash?'#fff':'#0369a1', background: syncFlash?'#2563eb':'#f0f9ff', border:`1px solid ${syncFlash?'#2563eb':'#bae6fd'}`, borderRadius:6, padding:'2px 9px', display:'flex', alignItems:'center', gap:4, transition:'all 0.4s' }}>
            <Clock size={10}/>
            {syncFlash ? '✅ 定時同步完成' : `定時同步 ${getSyncLabel(nextSync)} · ${countdown}`}
          </span>

          {/* ← Clickable low-stock badge */}
          {lowStockItems.length > 0 && (
            <button
              onClick={() => setLowStockOpen(true)}
              style={{ fontSize:11, color:'#dc2626', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:6, padding:'2px 9px', display:'flex', alignItems:'center', gap:4, cursor:'pointer', fontWeight:700, transition:'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#dc2626'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#dc2626'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#fef2f2'; e.currentTarget.style.color='#dc2626'; e.currentTarget.style.borderColor='#fecaca'; }}>
              <AlertTriangle size={11}/> {lowStockItems.length} 項庫存不足
            </button>
          )}

          {disabledCount > 0 && (
            <span style={{ fontSize:11, color:'#64748b', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'2px 9px' }}>
              ⛔ {disabledCount} 個平台已停用
            </span>
          )}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, color:'#94a3b8' }}>變化區間</span>
          {['h24','h48','h72'].map(t => (
            <button key={t} style={tBtn(timeFilter===t)} onClick={() => setTimeFilter(t)}>
              {t==='h24'?'24h':t==='h48'?'48h':'72h'}
            </button>
          ))}
          <button onClick={handleSync} style={{ ...tBtn(false), display:'flex', alignItems:'center', gap:5, marginLeft:6, color:'#2563eb', background:'#eff6ff', border:'1px solid #bfdbfe' }}>
            <RefreshCw size={12} style={{ transition:'transform 0.7s', transform: syncPulse?'rotate(360deg)':'rotate(0deg)' }}/>
            立即同步
          </button>
        </div>
      </div>

      {/* ── Notice bar ── */}
      <div style={{ background:'#fffbeb', borderBottom:'1px solid #fde68a', padding:'7px 24px', flexShrink:0 }}>
        <span style={{ fontSize:12, color:'#92400e' }}>
          ⚡ 中央倉為唯一數量來源 — <strong>啟用中</strong>的平台每 5–15 分鐘自動同步；<strong>已停用</strong>的平台已推 0，停止接收同步
          　·　<strong>每天 08:30 (GMT+8)</strong> 自動更新中央倉數量
        </span>
      </div>

      {/* ── Search ── */}
      <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'10px 24px', flexShrink:0 }}>
        <div style={{ position:'relative', maxWidth:340 }}>
          <Search size={15} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}/>
          <input type="text" placeholder="搜尋 SKU 或產品名稱…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:'100%', paddingLeft:34, paddingRight: search?34:12, paddingTop:8, paddingBottom:8, border:'1.5px solid #e2e8f0', borderRadius:9, fontSize:13, color:'#1e293b', background:'#f8fafc', outline:'none', boxSizing:'border-box' }}
            onFocus={e => e.target.style.borderColor='#3b82f6'}
            onBlur={e => e.target.style.borderColor='#e2e8f0'}/>
          {search && (
            <button onClick={() => setSearch('')} style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:2 }}>
              <X size={13}/>
            </button>
          )}
        </div>
        {search && (
          <div style={{ marginTop:6, fontSize:12, color:'#64748b' }}>
            找到 <strong style={{ color:'#2563eb' }}>{filtered.length}</strong> 筆結果
            {filtered.length === 0 && <span style={{ color:'#ef4444', marginLeft:6 }}>— 找不到「{search}」</span>}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div style={{ flex:1, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:920 }}>
          <thead>
            <tr>
              <th style={th({ textAlign:'left', width:110 })}>SKU</th>
              <th style={th({ textAlign:'left', width:170 })}>產品名稱</th>
              <th style={th({ textAlign:'center', width:80 })}>更新時間</th>
              <th style={th({ textAlign:'center', width:130, ...div })}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                  <span style={{ color:'#2563eb', fontSize:9 }}>✏️ 可編輯</span>
                  <span>中央倉數量</span>
                </div>
              </th>
              <th style={th({ textAlign:'center', width:65 })}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                  <span style={{ color:'#94a3b8', fontSize:9 }}>變化</span>
                  <span>{timeFilter==='h24'?'24h':timeFilter==='h48'?'48h':'72h'}</span>
                </div>
              </th>
              {PLATFORMS.map((p,i) => (
                <th key={p.key} style={th({ textAlign:'center', ...(i===0?div:{}) })}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, color:p.color }}>
                    {p.icon==='bag'?<ShoppingBag size={11}/>:<Package size={11}/>}
                    <span style={{ fontSize:10 }}>{p.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign:'center', padding:'48px 0', color:'#94a3b8', fontSize:14 }}>找不到符合「{search}」的結果</td></tr>
            ) : filtered.map((row, i) => {
              const isLow = row.central < 2;
              const rowBg = isLow ? '#fff9f9' : i%2===0 ? '#fff' : '#fafbfc';
              const hovBg = isLow ? '#fff0f0' : '#eff6ff';
              return (
                <tr key={row.sku} style={{ background:rowBg, transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background=hovBg}
                  onMouseLeave={e => e.currentTarget.style.background=rowBg}>
                  <td style={{ ...td(), borderLeft:`3px solid ${isLow?'#fca5a5':'transparent'}` }}>
                    <span style={{ fontFamily:'monospace', fontSize:12, color:'#2563eb', background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:5, padding:'2px 8px' }}>{row.sku}</span>
                  </td>
                  <td style={td()}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ fontSize:13, color:'#1e293b' }}>{row.name}</span>
                      {isLow && (
                        <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, color:'#dc2626', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:5, padding:'1px 6px', fontWeight:700, whiteSpace:'nowrap' }}>
                          <AlertTriangle size={9}/> 庫存不足
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={td({ textAlign:'center' })}><span style={{ fontSize:12, color:'#94a3b8' }}>{row.updated}</span></td>
                  <td style={td({ textAlign:'center', ...div, background: isLow?'#fff0f0':'#f8faff' })}>
                    <CentralCell value={row.central} onSave={v => updateCentral(row.sku, v)}/>
                  </td>
                  <td style={td({ textAlign:'center' })}><Delta val={row[timeFilter]}/></td>
                  {PLATFORMS.map((p, pi) => (
                    <td key={p.key} style={td({ textAlign:'center', ...(pi===0?div:{}), background: !row.platforms[p.key]?'#f8fafc':'transparent' })}>
                      <PlatformCell value={row.central} enabled={row.platforms[p.key]} onToggle={() => togglePlatform(row.sku, p.key)}/>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background:'#f1f5f9', borderTop:'2px solid #e2e8f0' }}>
              <td colSpan={3} style={{ ...td(), fontSize:12, fontWeight:700, color:'#64748b' }}>合計</td>
              <td style={td({ textAlign:'center', fontWeight:800, fontSize:15, color:'#0f172a', ...div })}>
                {filtered.reduce((s,r) => s+r.central, 0)}
              </td>
              <td style={td()}/>
              {PLATFORMS.map((p,pi) => (
                <td key={p.key} style={td({ textAlign:'center', fontWeight:700, color:'#1e293b', ...(pi===0?div:{}) })}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                    <span>{filtered.reduce((s,r) => s+(r.platforms[p.key]?r.central:0), 0)}</span>
                    {filtered.filter(r=>!r.platforms[p.key]).length > 0 && (
                      <span style={{ fontSize:9, color:'#94a3b8' }}>{filtered.filter(r=>!r.platforms[p.key]).length} 項停用</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div style={{ background:'#fff', borderTop:'1px solid #e2e8f0', padding:'8px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ fontSize:11, color:'#94a3b8' }}>共 {filtered.length} 個 SKU　·　低庫存警示：數量 &lt; 2　·　點擊「X 項庫存不足」可查看詳情</span>
        <span style={{ fontSize:11, color:'#94a3b8' }}>created by Tabris Yuen @2026</span>
      </div>
    </div>
  );
}
