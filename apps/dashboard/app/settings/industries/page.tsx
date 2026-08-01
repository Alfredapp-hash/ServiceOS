"use client";

import { useMemo, useState } from "react";
import { industryProfiles, tradeIds, type TradeKey } from "@serviceos/trades";

export default function IndustrySettingsPage() {
  const [activeTrade, setActiveTrade] = useState<TradeKey>("hvac");
  const [enabled, setEnabled] = useState<TradeKey[]>([...tradeIds]);
  const profile = industryProfiles[activeTrade];

  const counts = useMemo(() => ({
    intake: profile.intakeFields.length,
    assets: profile.assetFields.length,
    inspections: profile.inspectionSections.reduce((sum, section) => sum + section.fields.length, 0),
    automations: profile.automations.length
  }), [profile]);

  const toggleTrade = (trade: TradeKey) => {
    setEnabled((current) => current.includes(trade) ? current.filter((item) => item !== trade) : [...current, trade]);
  };

  return (
    <main style={{ padding: 32, maxWidth: 1440, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
        <div>
          <div style={{ color: "#2563eb", fontSize: 12, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>Settings / Industries</div>
          <h1 style={{ margin: "6px 0", fontSize: 38, letterSpacing: "-.04em" }}>Customize ServiceOS by trade</h1>
          <p style={{ margin: 0, color: "#64748b", maxWidth: 780 }}>Enable one or more industries. Each module changes terminology, intake, asset records, inspections, quote calculations, compliance, memberships, automations, and KPIs while preserving one shared operating system.</p>
        </div>
        <button style={{ border: 0, borderRadius: 10, padding: "12px 18px", background: "#0f172a", color: "white", fontWeight: 800 }}>Save configuration</button>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12, marginBottom: 24 }}>
        {tradeIds.map((trade) => {
          const item = industryProfiles[trade];
          const selected = activeTrade === trade;
          const isEnabled = enabled.includes(trade);
          return (
            <article key={trade} onClick={() => setActiveTrade(trade)} style={{ cursor: "pointer", background: "white", border: selected ? `2px solid ${item.accent}` : "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <strong>{item.label}</strong>
                <input aria-label={`Enable ${item.label}`} type="checkbox" checked={isEnabled} onClick={(event) => event.stopPropagation()} onChange={() => toggleTrade(trade)} />
              </div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>{item.primaryJobLabel} · {item.pluralAssetLabel}</div>
            </article>
          );
        })}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(320px, .7fr)", gap: 20 }}>
        <div style={{ display: "grid", gap: 18 }}>
          <article style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 12, height: 38, borderRadius: 999, background: profile.accent }} />
              <div>
                <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", fontWeight: 800, letterSpacing: ".1em" }}>Active module</div>
                <h2 style={{ margin: 0 }}>{profile.label}</h2>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginTop: 18 }}>
              {Object.entries(counts).map(([label, value]) => <div key={label} style={{ background: "#f8fafc", borderRadius: 12, padding: 14 }}><div style={{ fontSize: 24, fontWeight: 850 }}>{value}</div><div style={{ fontSize: 12, color: "#64748b", textTransform: "capitalize" }}>{label}</div></div>)}
            </div>
          </article>

          <ConfigSection title="Customer intake" items={profile.intakeFields.map((field) => `${field.label}${field.required ? " • required" : ""}`)} />
          <ConfigSection title={`${profile.singularAssetLabel} record`} items={profile.assetFields.map((field) => `${field.label}${field.unit ? ` (${field.unit})` : ""}`)} />
          <article style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22 }}>
            <h3 style={{ marginTop: 0 }}>Inspection templates</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {profile.inspectionSections.map((section) => <div key={section.title} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 }}><strong>{section.title}</strong><div style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>{section.fields.map((field) => field.label).join(" · ")}</div></div>)}
            </div>
          </article>
          <article style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22 }}>
            <h3 style={{ marginTop: 0 }}>Quote-builder templates</h3>
            {profile.quoteFormulas.map((formula) => <div key={formula.key} style={{ borderLeft: `4px solid ${profile.accent}`, paddingLeft: 14, marginTop: 14 }}><strong>{formula.label}</strong><p style={{ color: "#64748b", margin: "5px 0" }}>{formula.description}</p><div style={{ fontSize: 13 }}>{formula.fields.map((field) => field.label).join(" · ")}</div></div>)}
          </article>
        </div>

        <aside style={{ display: "grid", gap: 18, alignContent: "start" }}>
          <ConfigSection title="Compliance gates" items={profile.complianceChecks} />
          <ConfigSection title="Default memberships" items={profile.defaultMemberships} />
          <ConfigSection title="Dashboard KPIs" items={profile.dashboardKpis} />
          <ConfigSection title="Automations" items={profile.automations} />
          <ConfigSection title="Arkhe template modules to reuse" items={profile.recommendedTemplateModules} />
        </aside>
      </section>
    </main>
  );
}

function ConfigSection({ title, items }: { title: string; items: string[] }) {
  return <article style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22 }}><h3 style={{ marginTop: 0 }}>{title}</h3><div style={{ display: "grid", gap: 9 }}>{items.map((item) => <label key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14 }}><input type="checkbox" defaultChecked /><span>{item}</span></label>)}</div></article>;
}
