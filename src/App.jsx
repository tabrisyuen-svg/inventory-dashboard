import React, { useState, useMemo } from 'react';
import { RefreshCw, Edit2, Check, X, TrendingUp, TrendingDown, Minus, Package, ShoppingBag, Search } from 'lucide-react';

const MOCK = [
  { sku: 'HAPE-001', name: '木製小火車套裝',  updated: '14:32', central: 145, h24: -13, h48: -27, h72: -41, hktvA: 42, hktvB: 38, shopA: 35, shopB: 30 },
  { sku: 'HAPE-002', name: '彩虹疊疊樂',      updated: '13:15', central:  89, h24:  +5, h48:  -8, h72: -12, hktvA: 20, hktvB: 22, shopA: 25, shopB: 22 },
  { sku: 'HAPE-003', name: '木質牛油果玩具',  updated: '12:50', central: 210, h24:  -6, h48: -18, h72: -30, hktvA: 55, hktvB: 60, shopA: 50, shopB: 45 },
  { sku: 'HAPE-004', name: '感統觸覺球組',    updated: '11:40', central:  34, h24: -20, h48: -35, h72: -50, hktvA:  8, hktvB:  6, shopA: 10, shopB: 10 },
  { sku: 'HAPE-005', name: '嬰兒木製搖搖馬', updated: '10:22', central:  67, h24:   0, h48:  -4, h72: -10, hktvA: 15, hktvB: 18, shopA: 17, shopB: 17 },
  { sku: 'EUKA-001', name: '磁力拼圖組合',    updated: '09:55', central: 182, h24: +12, h48:  +8, h72: +20, hktvA: 48, hktvB: 45, shopA: 46, shopB: 43 },
  { sku: 'EUKA-002', name: '科學實驗套裝',    updated: '09:10', central:  55, h24:  -3, h48:  -9, h72: -14, hktvA: 12, hktvB: 14, shopA: 15, shopB: 14 },
  { sku: 'EUKA-003', name: '兒童畫板套裝',    updated: '08:40', central:  98, h24:  -1, h48:  -5, h72:  -9, hktvA: 24, hktvB: 26, shopA: 25, shopB: 23 },
];

const Delta = ({ val }) => {
  if (val === 0) return <span style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 2, fontSize: 12 }}><Minus size={11} />0</span>;
  if (val > 0)  return <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600 }}><TrendingUp size={11} />+{val}</span>;
  return <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600 }}><TrendingDown size={11} />{val}</span>;
};

const EditableCell = ({ value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const commit = () => { onSave(Number(val)); setEditing(false); };
  const cancel = () => { setVal(value); setEditing(false); };
  if (editing) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
      <input autoFocus type="number" value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
        style={{ width: 56, background: '#fff', border: '1.5px solid #3b82f6', borderRadius: 6, color: '#1e293b', padding: '2px 6px', fontSize: 13, textAlign: 'center', outline: 'none' }} />
      <button onClick={commit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', padding: 2 }}><Check size={13} /></button>
      <button onClick={cancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 2 }}><X size={13} /></button>
    </div>
  );
  return (
    <div onClick={() => setEditing(true)}
      style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', padding: '3px 8px', borderRadius: 6, transition: 'background 0.15s', justifyContent: 'center' }}
      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{value}</span>
      <Edit2 size={11} color="#94a3b8" />
    </div>
  );
};

export default function InventoryDashboard() {
  const [data, setData] = useState(MOCK);
  const [timeFilter, setTimeFilter] = useState('h24');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    data.filter(r =>
      r.sku.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase())
    ), [data, search]);

  const updatePlatform = (sku, field, newVal) => {
    setData(prev => prev.map(r => r.sku === sku ? { ...r, [field]: newVal } : r));
  };

  const th = (extra = {}) => ({ padding: '11px 14px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap', ...extra });
  const td = (extra = {}) => ({ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle', ...extra });
  const divider = { borderLeft: '2px solid #e2e8f0' };
  const timeBtn = (active) => ({ padding: '5px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: active ? '#2563eb' : '#f1f5f9', color: active ? '#fff' : '#64748b', transition: 'all 0.15s' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>📦 庫存管理系統</span>
          <span style={{ fontSize: 11, color: '#94a3b8', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '2px 9px' }}>上次同步 14:45</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>變化區間</span>
          {['h24', 'h48', 'h72'].map(t => (
            <button key={t} style={timeBtn(timeFilter === t)} onClick={() => setTimeFilter(t)}>
              {t === 'h24' ? '24h' : t === 'h48' ? '48h' : '72h'}
            </button>
          ))}
          <button style={{ ...timeBtn(false), display: 'flex', alignItems: 'center', gap: 5, marginLeft: 6, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <RefreshCw size={12} /> 同步
          </button>
        </div>
      </div>

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
            {filtered.length === 0 && <span style={{ color: '#ef4444', marginLeft: 6 }}>— 找不到符合「{search}」的結果</span>}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
          <thead>
            <tr>
              <th style={th({ textAlign: 'left', width: 110 })}>SKU</th>
              <th style={th({ textAlign: 'left', width: 160 })}>產品名稱</th>
              <th style={th({ textAlign: 'center', width: 80 })}>更新時間</th>
              <th style={th({ textAlign: 'center', width: 80 })}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <span style={{ color: '#94a3b8', fontSize: 9, fontWeight: 600 }}>中央庫存</span>
                  <span>總數量</span>
                </div>
              </th>
              <th style={th({ textAlign: 'center', width: 70 })}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <span style={{ color: '#94a3b8', fontSize: 9, fontWeight: 600 }}>變化</span>
                  <span>{timeFilter === 'h24' ? '24h' : timeFilter === 'h48' ? '48h' : '72h'}</span>
                </div>
              </th>
              <th style={th({ textAlign: 'center', ...divider })}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#d97706' }}><ShoppingBag size={12} /> HKTV A</div></th>
              <th style={th({ textAlign: 'center' })}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#d97706' }}><ShoppingBag size={12} /> HKTV B</div></th>
              <th style={th({ textAlign: 'center', ...divider })}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#059669' }}><Package size={12} /> Shopify A</div></th>
              <th style={th({ textAlign: 'center' })}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#059669' }}><Package size={12} /> Shopify B</div></th>
              <th style={th({ textAlign: 'center', ...divider })}>平台合計</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8', fontSize: 14 }}>找不到符合「{search}」的結果</td></tr>
            ) : filtered.map((row, i) => {
              const platformTotal = row.hktvA + row.hktvB + row.shopA + row.shopB;
              const diff = row.central - platformTotal;
              const rowBg = i % 2 === 0 ? '#fff' : '#fafbfc';
              return (
                <tr key={row.sku} style={{ background: rowBg, transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                  onMouseLeave={e => e.currentTarget.style.background = rowBg}>
                  <td style={td()}><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 5, padding: '2px 8px' }}>{row.sku}</span></td>
                  <td style={td()}><span style={{ fontSize: 13, color: '#1e293b' }}>{row.name}</span></td>
                  <td style={td({ textAlign: 'center' })}><span style={{ fontSize: 12, color: '#94a3b8' }}>{row.updated}</span></td>
                  <td style={td({ textAlign: 'center' })}><span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{row.central}</span></td>
                  <td style={td({ textAlign: 'center' })}><Delta val={row[timeFilter]} /></td>
                  <td style={td({ textAlign: 'center', ...divider })}><EditableCell value={row.hktvA} onSave={v => updatePlatform(row.sku, 'hktvA', v)} /></td>
                  <td style={td({ textAlign: 'center' })}><EditableCell value={row.hktvB} onSave={v => updatePlatform(row.sku, 'hktvB', v)} /></td>
                  <td style={td({ textAlign: 'center', ...divider })}><EditableCell value={row.shopA} onSave={v => updatePlatform(row.sku, 'shopA', v)} /></td>
                  <td style={td({ textAlign: 'center' })}><EditableCell value={row.shopB} onSave={v => updatePlatform(row.sku, 'shopB', v)} /></td>
                  <td style={td({ textAlign: 'center', ...divider })}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: diff === 0 ? '#059669' : diff > 0 ? '#2563eb' : '#dc2626' }}>{platformTotal}</span>
                      {diff !== 0 && <span style={{ fontSize: 10, color: diff > 0 ? '#2563eb' : '#dc2626', fontWeight: 600 }}>{diff > 0 ? `+${diff}` : diff} vs 中央</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f1f5f9', borderTop: '2px solid #e2e8f0' }}>
              <td colSpan={3} style={{ ...td(), fontSize: 12, fontWeight: 700, color: '#64748b' }}>合計</td>
              <td style={td({ textAlign: 'center', fontWeight: 800, fontSize: 15, color: '#0f172a' })}>{filtered.reduce((s, r) => s + r.central, 0)}</td>
              <td style={td()} />
              {[['hktvA', divider], ['hktvB', {}], ['shopA', divider], ['shopB', {}]].map(([k, extra]) => (
                <td key={k} style={td({ textAlign: 'center', fontWeight: 700, color: '#1e293b', ...extra })}>{filtered.reduce((s, r) => s + r[k], 0)}</td>
              ))}
              <td style={td({ textAlign: 'center', ...divider, fontWeight: 800, color: '#059669', fontSize: 15 })}>{filtered.reduce((s, r) => s + r.hktvA + r.hktvB + r.shopA + r.shopB, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
