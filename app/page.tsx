"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  ChefHat,
  CircleDollarSign,
  ClipboardCheck,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dailySales, menuRows, stockRows, summary } from "@/lib/data";

type View = "overview" | "inventory" | "profitability" | "assistant";

const money = (value: number) => `UGX ${new Intl.NumberFormat("en-UG", { notation: value >= 1000000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value)}`;
const number = (value: number) => new Intl.NumberFormat("en-UG", { maximumFractionDigits: 1 }).format(value);

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [query, setQuery] = useState("");
  const [brief, setBrief] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredStock = useMemo(() => stockRows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase())), [query]);

  function prepareBrief() {
      const payload = {
        period: "13–19 July 2026",
        summary,
        lowStock: stockRows.filter((item) => item.status !== "Healthy").map(({ name, unit, balance, reorder, status }) => ({ name, unit, balance, reorder, status })),
        highestWaste: [...stockRows].sort((a, b) => b.wastageValue - a.wastageValue).slice(0, 3).map(({ name, wasted, unit, wastageValue }) => ({ name, wasted, unit, wastageValue })),
        menuPerformance: menuRows.map(({ name, sold, revenue, profit, margin }) => ({ name, sold, revenue, profit, margin: Number(margin.toFixed(1)) })),
      };
      setBrief(`You are StockWise AI, an operations analyst for small restaurants in Uganda.\n\nUse only the verified figures below. Never invent amounts, ingredients or causes. Give a concise management brief with exactly these headings: Priority actions, Profit opportunity, Waste control, Today's decision. Use UGX for money. Mention that stock figures are expected balances and should be verified with a physical count.\n\nVERIFIED DASHBOARD DATA:\n${JSON.stringify(payload, null, 2)}`);
      setCopied(false);
  }

  async function copyBrief() {
    await navigator.clipboard.writeText(brief);
    setCopied(true);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><ChefHat size={22} /></span><div><strong>StockWise</strong><small>AI</small></div></div>
        <nav>
          <NavButton active={view === "overview"} onClick={() => setView("overview")} icon={<BarChart3 size={19} />} label="Overview" />
          <NavButton active={view === "inventory"} onClick={() => setView("inventory")} icon={<Boxes size={19} />} label="Inventory" badge={summary.reorderCount} />
          <NavButton active={view === "profitability"} onClick={() => setView("profitability")} icon={<CircleDollarSign size={19} />} label="Menu profit" />
          <NavButton active={view === "assistant"} onClick={() => setView("assistant")} icon={<Bot size={19} />} label="AI brief" />
        </nav>
        <div className="side-note"><Sparkles size={18} /><p><strong>Built for action</strong><br />Calculations first. AI explanations second.</p></div>
        <div className="profile"><span>MM</span><div><strong>Demo Restaurant</strong><small>Kampala, Uganda</small></div></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><p className="eyebrow">13–19 July 2026</p><h1>{viewTitle(view)}</h1></div>
          <div className="top-actions"><span className="data-pill"><span /> Sample data loaded</span><button className="outline-button"><RefreshCw size={15} /> Refresh</button></div>
        </header>

        {view === "overview" && <Overview onOpenBrief={() => setView("assistant")} />}
        {view === "inventory" && <Inventory query={query} setQuery={setQuery} rows={filteredStock} />}
        {view === "profitability" && <Profitability />}
        {view === "assistant" && <Assistant brief={brief} copied={copied} onPrepare={prepareBrief} onCopy={copyBrief} />}
      </section>
    </main>
  );
}

function NavButton({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) {
  return <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span>{badge ? <b>{badge}</b> : null}</button>;
}

function viewTitle(view: View) {
  return { overview: "Good morning, Manager", inventory: "Inventory control", profitability: "Menu profitability", assistant: "AI management brief" }[view];
}

function Overview({ onOpenBrief }: { onOpenBrief: () => void }) {
  const margin = (summary.profit / summary.revenue) * 100;
  return <div className="page-content">
    <div className="hero-strip"><div><span className="hero-icon"><Sparkles size={19} /></span><p><strong>Three management actions need attention today.</strong><br />Reordering, waste control and a profit opportunity could affect this week’s result.</p></div><button onClick={onOpenBrief}>Review AI brief <ArrowRight size={16} /></button></div>
    <div className="metric-grid">
      <Metric label="Sales revenue" value={money(summary.revenue)} detail="+12.4% vs last week" tone="green" icon={<TrendingUp />} />
      <Metric label="Gross profit" value={money(summary.profit)} detail={`${margin.toFixed(1)}% gross margin`} tone="blue" icon={<CircleDollarSign />} />
      <Metric label="Waste cost" value={money(summary.wastage)} detail="2 ingredients need review" tone="amber" icon={<AlertTriangle />} />
      <Metric label="Reorder alerts" value={`${summary.reorderCount} items`} detail="Physical count recommended" tone="red" icon={<Boxes />} />
    </div>
    <div className="dashboard-grid">
      <section className="panel chart-panel"><PanelHeading title="Sales and food cost" subtitle="Daily performance, UGX" />
        <ResponsiveContainer width="100%" height={270}><AreaChart data={dailySales}><defs><linearGradient id="sales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#138a63" stopOpacity={0.28}/><stop offset="95%" stopColor="#138a63" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ece9"/><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000000}m`}/><Tooltip formatter={(v) => money(Number(v))}/><Area type="monotone" dataKey="sales" stroke="#138a63" strokeWidth={3} fill="url(#sales)"/><Area type="monotone" dataKey="cost" stroke="#e59b35" strokeWidth={2} fill="transparent"/></AreaChart></ResponsiveContainer>
      </section>
      <section className="panel alert-panel"><PanelHeading title="Stock attention" subtitle="Expected balance vs reorder level" /><div className="alert-list">{stockRows.filter((r) => r.status !== "Healthy").map((row) => <div className="alert-row" key={row.name}><span className={`status-dot ${row.status.toLowerCase()}`} /><div><strong>{row.name}</strong><small>{number(row.balance)} {row.unit} remaining</small></div><span className={`tag ${row.status.toLowerCase()}`}>{row.status}</span></div>)}</div><button className="text-button">View full inventory <ArrowRight size={15}/></button></section>
    </div>
    <section className="panel"><PanelHeading title="Menu profit leaders" subtitle="Ranked by gross profit contribution" /><div className="profit-leaders">{[...menuRows].sort((a,b)=>b.profit-a.profit).slice(0,4).map((item,index)=><div className="leader" key={item.name}><span className="rank">0{index+1}</span><div><strong>{item.name}</strong><small>{item.sold} portions sold</small></div><div className="leader-money"><strong>{money(item.profit)}</strong><small>{item.margin.toFixed(1)}% margin</small></div></div>)}</div></section>
  </div>;
}

function Inventory({ query, setQuery, rows }: { query: string; setQuery: (value: string) => void; rows: typeof stockRows }) {
  return <div className="page-content"><div className="section-intro"><div><h2>Expected stock position</h2><p>Opening stock + purchases − recipe consumption − recorded wastage.</p></div><label className="search"><Search size={17}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search ingredients"/></label></div><div className="callout"><ClipboardCheck size={19}/><p><strong>Control note:</strong> Expected balances guide decisions but do not replace a physical stock count.</p></div><section className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>Ingredient</th><th>Opening</th><th>Purchased</th><th>Consumed</th><th>Wasted</th><th>Expected balance</th><th>Status</th></tr></thead><tbody>{rows.map(row=><tr key={row.name}><td><strong>{row.name}</strong><small>{row.unit}</small></td><td>{number(row.opening)}</td><td>{number(row.purchased)}</td><td>{number(row.consumed)}</td><td className={row.wasted > 3 ? "danger-text" : ""}>{number(row.wasted)}</td><td><strong>{number(row.balance)} {row.unit}</strong></td><td><span className={`tag ${row.status.toLowerCase()}`}>{row.status}</span></td></tr>)}</tbody></table></div></section></div>;
}

function Profitability() {
  const chartData = menuRows.map(i=>({name:i.name.split(" ").slice(0,2).join(" "),profit:i.profit, cost:i.totalCost}));
  return <div className="page-content"><div className="section-intro"><div><h2>What earns—and what only sells</h2><p>Revenue is useful; contribution after food cost tells the fuller story.</p></div></div><div className="dashboard-grid profit-grid"><section className="panel chart-panel"><PanelHeading title="Profit contribution" subtitle="Gross profit and food cost by menu item"/><ResponsiveContainer width="100%" height={300}><BarChart data={chartData} layout="vertical" margin={{left:10}}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8ece9"/><XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(v)=>`${v/1000000}m`}/><YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false}/><Tooltip formatter={(v)=>money(Number(v))}/><Bar dataKey="profit" stackId="a" fill="#138a63" radius={[0,4,4,0]}/><Bar dataKey="cost" stackId="a" fill="#dfe6e1" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer></section><section className="panel insight-card"><span className="large-icon"><UtensilsCrossed/></span><p className="eyebrow">Best margin</p><h3>Vegetable Rice</h3><strong>{menuRows.find(i=>i.name==="Vegetable Rice")?.margin.toFixed(1)}%</strong><p>Strong contribution with a relatively low food cost. Test a lunch promotion without discounting the core price.</p></section></div><section className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>Menu item</th><th>Sold</th><th>Revenue</th><th>Food cost</th><th>Gross profit</th><th>Margin</th></tr></thead><tbody>{menuRows.map(row=><tr key={row.name}><td><strong>{row.name}</strong><small>{row.category}</small></td><td>{row.sold}</td><td>{money(row.revenue)}</td><td>{money(row.totalCost)}</td><td><strong>{money(row.profit)}</strong></td><td><span className="margin-pill">{row.margin.toFixed(1)}%</span></td></tr>)}</tbody></table></div></section></div>;
}

function Assistant({ brief, copied, onPrepare, onCopy }: { brief: string; copied: boolean; onPrepare: () => void; onCopy: () => void }) {
  return <div className="page-content assistant-page"><section className="assistant-hero"><span className="ai-orb"><Bot size={34}/></span><p className="eyebrow">Verified-data intelligence</p><h2>Turn this week’s numbers into today’s decisions.</h2><p>StockWise prepares a grounded request for GPT‑5.6. Use it in your existing ChatGPT account—no API key or additional billing required.</p><button className="primary-button" onClick={onPrepare}><Sparkles size={17}/> Prepare GPT‑5.6 brief</button></section>{brief && <section className="panel brief"><div className="brief-top"><div><span className="live-dot"/> Grounded prompt ready</div><span>Human-in-the-loop</span></div><div className="prompt-preview"><pre>{brief}</pre></div><div className="handoff-actions"><button className="outline-button" onClick={onCopy}><ClipboardCheck size={16}/>{copied ? "Copied to clipboard" : "Copy verified prompt"}</button><a className="primary-button" href="https://chatgpt.com/" target="_blank" rel="noreferrer"><Bot size={16}/> Open ChatGPT</a></div><div className="brief-foot"><ClipboardCheck size={16}/> Paste into ChatGPT and use GPT‑5.6. Figures remain visible for verification.</div></section>}<div className="trust-grid"><div><strong>01</strong><p><b>Calculate</b><br/>Deterministic stock and profit logic</p></div><div><strong>02</strong><p><b>Ground</b><br/>Prepare verified figures only</p></div><div><strong>03</strong><p><b>Explain</b><br/>GPT‑5.6 recommends clear actions</p></div></div></div>;
}

function Metric({ label, value, detail, tone, icon }: { label:string; value:string; detail:string; tone:string; icon:React.ReactNode }) { return <div className="metric-card"><span className={`metric-icon ${tone}`}>{icon}</span><p>{label}</p><h3>{value}</h3><small className={tone}>{detail}</small></div>; }
function PanelHeading({title,subtitle}:{title:string;subtitle:string}) { return <div className="panel-heading"><div><h3>{title}</h3><p>{subtitle}</p></div><button>•••</button></div>; }
