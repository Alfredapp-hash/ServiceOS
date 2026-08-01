"use client";

import { useMemo, useState } from "react";
import { tradeIds, trades, type TradeId } from "@serviceos/trades";

const navigation = ["Command center", "Dispatch", "Customers", "Properties", "Quotes", "Jobs", "Inventory", "Fleet", "Reports", "Settings"];

export default function HomePage() {
  const [selectedTrades, setSelectedTrades] = useState<TradeId[]>(tradeIds.slice());
  const [labor, setLabor] = useState(850);
  const [materials, setMaterials] = useState(1250);
  const [overhead, setOverhead] = useState(250);
  const [margin, setMargin] = useState(40);

  const quote = useMemo(() => {
    const cost = labor + materials + overhead;
    const total = margin >= 100 ? cost : cost / (1 - margin / 100);
    return { cost, total, grossProfit: total - cost };
  }, [labor, materials, overhead, margin]);

  function toggleTrade(id: TradeId) {
    setSelectedTrades((current) =>
      current.includes(id) ? current.filter((trade) => trade !== id) : [...current, id]
    );
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">Service<span>OS</span></div>
        <p>Property service command system</p>
        <nav>{navigation.map((item, index) => <a className={index === 0 ? "active" : ""} href="#" key={item}>{item}</a>)}</nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <div className="eyebrow">Launch foundation</div>
            <h1>Run every property, technician, truck, and dollar.</h1>
            <p>Seven launch trades share one operational core while retaining trade-specific records and workflows.</p>
          </div>
          <button>New service call</button>
        </header>

        <section className="metrics">
          <article><span>Revenue today</span><strong>$42,860</strong><small>+14.2% versus target</small></article>
          <article><span>Technicians active</span><strong>18</strong><small>14 traveling or working</small></article>
          <article><span>Capacity</span><strong>87%</strong><small>Three open arrival windows</small></article>
          <article><span>Open proposals</span><strong>$186K</strong><small>12 need follow-up</small></article>
        </section>

        <section className="workspace">
          <article className="panel trades-panel">
            <div className="panel-heading">
              <div><div className="eyebrow">Settings preview</div><h2>Enabled industries</h2></div>
              <span>{selectedTrades.length} active</span>
            </div>
            <div className="trade-grid">
              {tradeIds.map((id) => {
                const trade = trades[id];
                const enabled = selectedTrades.includes(id);
                return (
                  <button className={`trade ${enabled ? "enabled" : ""}`} onClick={() => toggleTrade(id)} key={id}>
                    <strong>{trade.name}</strong>
                    <span>{trade.description}</span>
                    <small>{trade.assets.slice(0, 3).join(" • ")}</small>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="panel quote-panel">
            <div className="eyebrow">Integrated quote builder</div>
            <h2>Margin-aware proposal</h2>
            <label>Labor cost<input type="number" value={labor} onChange={(event) => setLabor(Number(event.target.value))} /></label>
            <label>Material cost<input type="number" value={materials} onChange={(event) => setMaterials(Number(event.target.value))} /></label>
            <label>Overhead allocation<input type="number" value={overhead} onChange={(event) => setOverhead(Number(event.target.value))} /></label>
            <label>Target gross margin<input type="number" value={margin} onChange={(event) => setMargin(Number(event.target.value))} /></label>
            <div className="quote-summary">
              <div><span>True cost</span><strong>${quote.cost.toLocaleString()}</strong></div>
              <div><span>Customer price</span><strong>${Math.round(quote.total).toLocaleString()}</strong></div>
              <div><span>Gross profit</span><strong>${Math.round(quote.grossProfit).toLocaleString()}</strong></div>
            </div>
            <button className="proposal">Build good / better / best</button>
          </article>
        </section>

        <section className="panel dispatch">
          <div className="panel-heading"><div><div className="eyebrow">Live operations</div><h2>Dispatch intelligence</h2></div><span>GPS enabled</span></div>
          <div className="dispatch-grid">
            <div className="map-placeholder">Live technician map<br/><small>Mapbox/Google Maps adapter boundary</small></div>
            <div className="recommendation"><strong>Recommended assignment</strong><p>Send Marcus to the no-cooling call. He is 14 minutes away, carries the required capacitor, and has a 93% first-visit resolution rate for this equipment family.</p><button>Assign and notify customer</button></div>
          </div>
        </section>
      </section>
    </main>
  );
}
