import React, { useState, useMemo } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Minus, Package, ShoppingBag, Search, X, Edit2, Check, AlertTriangle } from 'lucide-react';

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

const Delta = ({ val }) => {
  if (val === 0) return <span style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, justifyContent: 'center' }}><Minus size={11} />0</span>;
  if (val > 0)   return <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600, justifyContent: 'center' }}><TrendingUp size={11} />+{val}</span>;
  return <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600, justifyContent: 'center' }}><TrendingDown size={11} />{val}</span>;
};

const CentralCell = ({ value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const commit = () => { onSave(Math.max(0, Number(val))); setEditing(false); };
  const cancel = () => { setVal(value); setEditing(false); };
  const isLow = value < 2;

  if (editing) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
      <input autoFocus type="number" value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
        style={{ width: 64, background: '#fff', border: '1.5px solid #3b82f6', borderRadius: 6, color: '#1e293b', padding: '3px 6px', fontSize: 14, fontWeight: 700, textAlign: 'center', outline: 'none' }} />
      <button onClick={commit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', padding: 2 }}><Check size={14} /></button>
      <button onClick={cancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 2 }}><X size={14} /></button>
    </div>
  );

  return (
    <div onClick={() => { setVal(value); setEditing(true); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '4px 10px', borderRadius: 8, transition: 'background 0.15s', justifyContent: 'center' }}
      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <span style={{ fontSize: 16, fontWeight: 800, color: isLow ? '#dc2626' : '#0f172a' }}>{value}</span>
      <Edit2 size={11} color={isLow ? '#dc2626' : '#94a3b8'} />
    </div>
  );
};

const PlatformCell = ({ value, enabled, onToggle }) => {
  const isLow = enabled && value < 2;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {enabled ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: isLow ? '#dc2626' : '#334155' }}>{value}</span>
          {isLow && (
            <span style={{ fontSize: 9, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>
              低庫存
            </span>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#cbd5e1' }}>—</span>
          <span style={{ fontSize: 9, background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>
            已推 0
          </span>
        </div>
      )}
      <button
        onClick={onToggle}
        style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
          border: `1px solid ${enabled ? '#bbf7d0' : '#fecdd3'}`,
          background: enabled ? '#f0fdf4' : '#fff1f2',
          color: enabled ? '#059669' : '#dc2626',
        }}>
        {enabled ? '啟用中' : '已停用'}
      </button>
    </div>
  );
};

export default function InventoryDashboard() {
  const [data, setData] = useState(INITIAL_DATA);
  const [timeFilter, setTimeFilter] = useState('h24');
  const [search, setSearch] = useState('');
  const [syncPulse, setSyncPulse] = useState(false);

  const filtered = useMemo(() =>
    data.filter(r =>
      r.sku.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase())
    ), [data, search]);

  const updateCentral = (sku, newVal) =>
    setData(prev => prev.map(r => r.sku === sku ? { ...r, central: newVal } : r));

  const togglePlatform = (sku, platformKey) =>
    setData(prev => prev.map(r =>
      r.sku === sku ? { ...r, platforms: { ...r.platforms, [platformKey]: !r.platforms[platformKey] } } : r
    ));

  const handleSync = () => { setSyncPulse(true); setTimeout(() => setSyncPulse(false), 800); };

  const lowStockCount  = data.filter(r => r.central < 2).length;
  const disabledCount  = data.reduce((t, r) => t + PLATFORMS.filter(p => !r.platforms[p.key]).length, 0);

  const th = (extra = {}) => ({ padding: '11px 14px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap', ...extra });
  const td = (extra = {}) => ({ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle', ...extra });
  const divider = { borderLeft: '2px solid #e2e8f0' };
  const timeBtn = (active) => ({ padding: '5px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: active ? '#2563eb' : '#f1f5f9', color: active ? '#fff' : '#64748b', transition: 'all 0.15s' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>📦 庫存管理系統</span>
          <span style={{ fontSize: 11, color: '#94a3b8', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 9px' }}>上次同步 14:45</span>
          <span style={{ fontSize: 11, color: '#0369a1', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 6, padding: '2px 9px' }}>🔄 5–15 分鐘同步</span>
          {lowStockCount > 0 && (
            <span style={{ fontSize: 11, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '2px 9px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={11} /> {lowStockCount} 項庫存不足
            </span>
          )}
          {disabledCount > 0 && (
            <span style={{ fontSize: 11, color: '#64748b', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 9px' }}>
              ⛔ {disabledCount} 個平台已停用
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>變化區間</span>
          {['h24', 'h48', 'h72'].map(t => (
            <button key={t} style={timeBtn(timeFilter === t)} onClick={() => setTimeFilter(t)}>
              {t === 'h24' ? '24h' : t === 'h48' ? '48h' : '72h'}
            </button>
          ))}
          <button onClick={handleSync} style={{ ...timeBtn(false), display: 'flex', alignItems: 'center', gap: 5, marginLeft: 6, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <RefreshCw size={12} style={{ transition: 'transform 0.7s', transform: syncPulse ? 'rotate(360deg)' : 'rotate(0deg)' }} />
            立即同步
          </button>
        </div>
      </div>

      {/* Notice */}
      <div style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a', padding: '7px 24px', flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: '#92400e' }}>
          ⚡ 中央倉為唯一數量來源 — <strong>啟用中</strong>的平台每 5–15 分鐘自動同步；<strong>已停用</strong>的平台已推 0，停止接收同步
        </span>
      </div>

      {/* Search */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '10px 24px', flexShrink: 0 }}>
        <div style={{ position: 'relative', maxWidth: 340 }}>
          <Search size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input type="text" placeholder="搜尋 SKU 或產品名稱…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 34, paddingRight: search ? 34 : 12, paddingTop: 8, paddingBottom: 8, border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 13, color: '#1e293b', background: '#f8fafc', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#3b82f6'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}>
              <X size={13} />
            </button>
          )}
        </div>
        {search && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#64748b' }}>
            找到 <strong style={{ color: '#2563eb' }}>{filtered.length}</strong> 筆結果
            {filtered.length === 0 && <span style={{ color: '#ef4444', marginLeft: 6 }}>— 找不到「{search}」</span>}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
          <thead>
            <tr>
              <th style={th({ textAlign: 'left', width: 110 })}>SKU</th>
              <th style={th({ textAlign: 'left', width: 170 })}>產品名稱</th>
              <th style={th({ textAlign: 'center', width: 80 })}>更新時間</th>
              <th style={th({ textAlign: 'center', width: 130, ...divider })}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <span style={{ color: '#2563eb', fontSize: 9, fontWeight: 600 }}>✏️ 可編輯</span>
                  <span>中央倉數量</span>
                </div>
              </th>
              <th style={th({ textAlign: 'center', width: 65 })}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <span style={{ color: '#94a3b8', fontSize: 9 }}>變化</span>
                  <span>{timeFilter === 'h24' ? '24h' : timeFilter === 'h48' ? '48h' : '72h'}</span>
                </div>
              </th>
              {PLATFORMS.map((p, i) => (
                <th key={p.key} style={th({ textAlign: 'center', ...(i === 0 ? divider : {}) })}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: p.color }}>
                    {p.icon === 'bag' ? <ShoppingBag size={11} /> : <Package size={11} />}
                    <span style={{ fontSize: 10 }}>{p.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8', fontSize: 14 }}>找不到符合「{search}」的結果</td></tr>
            ) : filtered.map((row, i) => {
              const isLow = row.central < 2;
              const rowBg = isLow ? '#fff9f9' : i % 2 === 0 ? '#fff' : '#fafbfc';
              const hoverBg = isLow ? '#fff0f0' : '#eff6ff';
              return (
                <tr key={row.sku} style={{ background: rowBg, transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = rowBg}>
                  <td style={{ ...td(), borderLeft: `3px solid ${isLow ? '#fca5a5' : 'transparent'}` }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 5, padding: '2px 8px' }}>{row.sku}</span>
                  </td>
                  <td style={td()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13, color: '#1e293b' }}>{row.name}</span>
                      {isLow && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 5, padding: '1px 6px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          <AlertTriangle size={9} /> 庫存不足
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={td({ textAlign: 'center' })}><span style={{ fontSize: 12, color: '#94a3b8' }}>{row.updated}</span></td>
                  <td style={td({ textAlign: 'center', ...divider, background: isLow ? '#fff0f0' : '#f8faff' })}>
                    <CentralCell value={row.central} onSave={v => updateCentral(row.sku, v)} />
                  </td>
                  <td style={td({ textAlign: 'center' })}><Delta val={row[timeFilter]} /></td>
                  {PLATFORMS.map((p, pi) => (
                    <td key={p.key} style={td({ textAlign: 'center', ...(pi === 0 ? divider : {}), background: !row.platforms[p.key] ? '#f8fafc' : 'transparent' })}>
                      <PlatformCell
                        value={row.central}
                        enabled={row.platforms[p.key]}
                        onToggle={() => togglePlatform(row.sku, p.key)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f1f5f9', borderTop: '2px solid #e2e8f0' }}>
              <td colSpan={3} style={{ ...td(), fontSize: 12, fontWeight: 700, color: '#64748b' }}>合計</td>
              <td style={td({ textAlign: 'center', fontWeight: 800, fontSize: 15, color: '#0f172a', ...divider })}>
                {filtered.reduce((s, r) => s + r.central, 0)}
              </td>
              <td style={td()} />
              {PLATFORMS.map((p, pi) => (
                <td key={p.key} style={td({ textAlign: 'center', fontWeight: 700, color: '#1e293b', ...(pi === 0 ? divider : {}) })}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <span>{filtered.reduce((s, r) => s + (r.platforms[p.key] ? r.central : 0), 0)}</span>
                    <span style={{ fontSize: 9, color: '#94a3b8' }}>
                      {filtered.filter(r => !r.platforms[p.key]).length > 0 &&
                        `${filtered.filter(r => !r.platforms[p.key]).length} 項停用`}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>共 {filtered.length} 個 SKU　·　低庫存警示：數量 &lt; 2　·　點擊平台按鈕可啟用 / 停用同步</span>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>created by Tabris Yuen @2026</span>
      </div>
    </div>
  );
}
