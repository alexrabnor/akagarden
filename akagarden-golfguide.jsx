import React, { useState, useMemo } from 'react';

// ÅKAGÅRDENS GOLFKLUBB — Premium Spelguide
// Data: Caddee (hål 1-6 verifierat), uppskattningar för hål 7-18 baserat på 
// totalbanan (gul tee 5549m, par 71) och Alexanders klubbval.

const COURSE = {
  name: 'Åkagårdens Golfklubb',
  designer: 'Jan Sederholm',
  tee: 'Gul tee',
  totalMeters: 5549,
  par: 71,
  location: 'Bjärehalvön, Båstad',
};

const HOLES = [
  {
    n: 1, par: 4, meters: 269, index: 5,
    title: 'Öppningen',
    desc: 'Relativt lätt par fyra. Vid inspel — tänk på nivåskillnaden och ta en klubba till. Greenen lutar kraftigt.',
    risks: ['Lutande green', 'Nivåskillnad till green'],
    clubs: ['D', '9'],
    strategy: 'safe',
    note: 'Kort par 4 — driver är aggressivt men du har klubban. Klubban över på inspel är guldkornet här.',
  },
  {
    n: 2, par: 3, meters: 150, index: 7,
    title: 'Utsikten',
    desc: 'Passa på att njuta av utsikten. Greenen är endast 13 meter djup. Rätt klubba är allt — annars hamnar du i bunkrarna eller över green i högruff.',
    risks: ['Smal green (13m djup)', 'Bunkrar framför', 'Högruff bakom'],
    clubs: ['6'],
    strategy: 'balanced',
    note: 'Järn 6 på 150m är pricksäkert. Med smal green: sikta mitt på och acceptera 10m putt.',
  },
  {
    n: 3, par: 4, meters: 290, index: 15,
    title: 'Mellan kullarna',
    desc: 'Kort par fyra som kräver bra utslag mellan kullarna. Blint inspel — sikta på högra greenhalvan för att undvika greenbunker framför.',
    risks: ['Blint inspel', 'Greenbunker framför', 'Trångt landningsområde'],
    clubs: ['D', '9'],
    strategy: 'aggressive',
    note: 'Driver är rätt val här om utslaget sitter. Sikta höger på inspelet — bunkern äter bollar mitt på.',
  },
  {
    n: 4, par: 4, meters: 342, index: 13,
    title: 'Riktpinnen',
    desc: 'Vackert par fyra. Utslag mot riktpinnen hamnar mitt på fairway. Spela gärna in kort om flaggan — greenen lutar mycket.',
    risks: ['Kraftigt lutande green'],
    clubs: ['D', '9'],
    strategy: 'balanced',
    note: 'Klassiskt par 4. Sikta på riktpinnen från tee, järn 9 in. Lämna bollen under flaggan!',
  },
  {
    n: 5, par: 5, meters: 504, index: 11,
    title: 'Passagen',
    desc: 'Sikta i passagen med drivern. Håll andra slaget på höger fairwayhalva — vattnet lurar till vänster. Greenen är smalare än den ser ut — sikta mitt på.',
    risks: ['Vatten vänster på andra slaget', 'Smal green'],
    clubs: ['D', 'H', 'PW'],
    strategy: 'balanced',
    note: 'Tre-slags-plan: D → Hybrid (höger sida!) → PW. Banans enda riktiga par 5 hittills — använd det.',
  },
  {
    n: 6, par: 3, meters: 149, index: 3,
    title: 'Över vattnet',
    desc: 'Ett svårt hål. Se till att ta en klubba som räcker över vattnet — men se upp för bunkern på högersidan.',
    risks: ['Vatten framför green', 'Bunker höger'],
    clubs: ['T9'],
    strategy: 'safe',
    note: '9-wood är klokt val — extra bärlängd över vattnet. Hellre lång än kort. Index 3 = inget skämt.',
  },
  {
    n: 7, par: 4, meters: 355, index: 1,
    title: 'Det svåraste',
    desc: 'Banans svåraste hål. Lång par 4 som kräver både längd och precision från tee, och en exakt inspelsstrategi.',
    risks: ['Långt hål', 'Trång fairway', 'Skyddad green'],
    clubs: ['D', 'H', '56'],
    strategy: 'aggressive',
    note: 'Driver + Hybrid är full attack — om utslaget missar, lägg fram med 56:an och spela för bogey. Index 1 betyder: bogey är en bra score här.',
  },
  {
    n: 8, par: 4, meters: 340, index: 9,
    title: 'Tvåvägs-hålet',
    desc: 'Måttligt långt par 4. Tee-skottet är nyckeln — bra position öppnar upp för enkelt inspel.',
    risks: ['Smal fairway', 'Greenkomplex'],
    clubs: ['D', 'T9'],
    strategy: 'balanced',
    note: 'Driver + 9-wood är ovanligt lång kombination för 340m — gissningsvis spelar du för att maxa fairwaypositionen. Smart om hålet doglegar.',
  },
  {
    n: 9, par: 4, meters: 365, index: 17,
    title: 'Hem-niorna',
    desc: 'Avslutar första niohålsslingan. Långt par 4 men relativt öppet — bonushål om utslaget träffar.',
    risks: ['Längd', 'Greenposition'],
    clubs: ['D', 'H'],
    strategy: 'balanced',
    note: 'Driver + Hybrid — en ärlig kombo för 365m. Index 17: ska vara enklare än det ser ut. Skippa heroiska inspel.',
  },
  {
    n: 10, par: 4, meters: 285, index: 10,
    title: 'Vänster-linjen',
    desc: 'Kort par 4 där en vänsterlinje från tee öppnar upp greenen. Anteckning: "D mer till vänster" — du har läst hålet rätt.',
    risks: ['Höger sida = svårt inspel', 'OB eller ruff höger'],
    clubs: ['D (vänster)', 'T9', '56'],
    strategy: 'aggressive',
    note: 'Din egen note säger allt: vänster med drivern. 9-wood som approach är ovanligt långt för 285m hål — kanske du la fram bollen? 56:an in är pricksäker.',
  },
  {
    n: 11, par: 3, meters: 175, index: 2,
    title: 'Den långa par-3:an',
    desc: 'Banans näst svåraste hål, och en par-3 på det. Lång och välförsvarad green som kräver hög och mjuk landning.',
    risks: ['Långt', 'Bunkrar', 'Index 2'],
    clubs: ['H', '56'],
    strategy: 'aggressive',
    note: 'OBS: D + H + 56 på par-3?! Det är 3 slag på en par-3 = bogey är planen. Kanske du planerar för worst case? Egentligen: en hybrid räcker hit, sedan close-out med wedge om miss.',
  },
  {
    n: 12, par: 4, meters: 320, index: 14,
    title: 'Beslutshålet',
    desc: 'Medellångt par 4 där tee-klubban är ett strategiskt val. Driver tar dig fram till wedge-avstånd, men risk finns i landningszonen.',
    risks: ['Trångt landningsområde', 'Greenkomplex'],
    clubs: ['D', 'T9 eller 6'],
    strategy: 'balanced',
    note: 'Din "T9 eller 6" säger det: avståndet in beror på hur driven sätter sig. 6:an om långt, 9-wood om kort. Bra adaptiv plan.',
  },
  {
    n: 13, par: 4, meters: 325, index: 6,
    title: 'Precisionshålet',
    desc: 'Index 6 — ett av banans tuffare hål. Kräver kontrollerad driver och säkert järninspel.',
    risks: ['Svår green', 'Sidohinder'],
    clubs: ['D', '6'],
    strategy: 'balanced',
    note: 'D + 6 är en lugn kombination. Inget hjältekamp — säkra par här.',
  },
  {
    n: 14, par: 4, meters: 335, index: 18,
    title: 'Andningspaus',
    desc: 'Banans lättaste hål enligt index. Öppet och relativt rakt — perfekt tillfälle att hämta tillbaka en bogey.',
    risks: ['Falsk säkerhet — index 18 lurar'],
    clubs: ['D', '6'],
    strategy: 'aggressive',
    note: 'Index 18 = här ska du göra par eller birdie. D + 6 är solid. Tänk: "jag ska sänka putten" — det är birdie-hålet på back nine.',
  },
  {
    n: 15, par: 3, meters: 145, index: 4,
    title: 'Kort men tuff',
    desc: 'Kort par 3 men index 4 — det finns en anledning. Greenposition och hinder gör klubbvalet kritiskt.',
    risks: ['Bunkrar runt green', 'Greenlutning'],
    clubs: ['6'],
    strategy: 'safe',
    note: 'Järn 6 på 145m är mycket klubba — du planerar för en kontrollerad knockdown eller spelar bara säkert. Sikta mitt på green.',
  },
  {
    n: 16, par: 4, meters: 360, index: 8,
    title: 'Hemma-stretchen',
    desc: 'Långt par 4 nära klubbhuset. Stadig konditionering här — finishen börjar närma sig.',
    risks: ['Längd', 'Trötthet'],
    clubs: ['D', 'H'],
    strategy: 'balanced',
    note: 'D + Hybrid är full längd. Spela för par — finishen kräver fokus.',
  },
  {
    n: 17, par: 3, meters: 140, index: 12,
    title: 'Sista par-3:an',
    desc: 'Banans avslutande par 3. Kort men taktiskt — vinden kan spela in här.',
    risks: ['Vind', 'Greenkomplex'],
    clubs: ['9'],
    strategy: 'safe',
    note: 'Järn 9 är rätt klubba. Sikta mitt — du behöver inte vara hjälte på 17:e.',
  },
  {
    n: 18, par: 4, meters: 275, index: 16,
    title: 'Klubbhushålet',
    desc: 'Kort avslutande par 4. Hybrid från tee ger placering, järn 9 in. Klubbhuset väntar — avsluta starkt.',
    risks: ['Bunkrar runt green', 'Klubbhus-press'],
    clubs: ['H', '9'],
    strategy: 'safe',
    note: 'Klokt val — hybrid istället för driver på kort par 4. Säkerhet > aggression på 18:e. Birdie här lyfter hela rundan.',
  },
];

// ============ HJÄLPFUNKTIONER ============

const CLUB_META = {
  'D': { label: 'Driver', icon: '⛳', color: '#ff3b30', cat: 'driver' },
  'H': { label: 'Hybrid', icon: '◆', color: '#ff9500', cat: 'hybrid' },
  'T9': { label: '9-Wood', icon: '◆', color: '#ff9500', cat: 'wood' },
  'W': { label: 'Wood', icon: '◆', color: '#ff9500', cat: 'wood' },
  '5': { label: 'Järn 5', icon: '5', color: '#34c759', cat: 'iron' },
  '6': { label: 'Järn 6', icon: '6', color: '#34c759', cat: 'iron' },
  '7': { label: 'Järn 7', icon: '7', color: '#34c759', cat: 'iron' },
  '8': { label: 'Järn 8', icon: '8', color: '#34c759', cat: 'iron' },
  '9': { label: 'Järn 9', icon: '9', color: '#34c759', cat: 'iron' },
  'PW': { label: 'PW', icon: 'P', color: '#5ac8fa', cat: 'wedge' },
  '52': { label: '52° Wedge', icon: '52', color: '#5ac8fa', cat: 'wedge' },
  '56': { label: '56° Wedge', icon: '56', color: '#5ac8fa', cat: 'wedge' },
};

function parseClub(raw) {
  const trimmed = raw.trim();
  // Handle "D (vänster)" or "T9 eller 6"
  const cleaned = trimmed.replace(/\s*\(.+?\)/g, '').trim();
  if (cleaned.includes('eller')) {
    const parts = cleaned.split('eller').map(s => s.trim());
    return { ...(CLUB_META[parts[0]] || CLUB_META[parts[1]] || { label: cleaned, icon: '?', color: '#999', cat: 'other' }), alt: parts[1], label: `${CLUB_META[parts[0]]?.label || parts[0]} / ${CLUB_META[parts[1]]?.label || parts[1]}`, note: trimmed.replace(cleaned, '').trim() };
  }
  return CLUB_META[cleaned] || { label: cleaned, icon: '?', color: '#999', cat: 'other' };
}

// ============ DESIGN TOKENS ============

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

* { box-sizing: border-box; }

body, html, #root {
  margin: 0; padding: 0;
  font-family: 'DM Sans', system-ui, sans-serif;
  background: #0a0e0d;
  color: #e8ebe8;
  -webkit-font-smoothing: antialiased;
}

.guide {
  min-height: 100vh;
  background: 
    radial-gradient(ellipse 1200px 600px at 20% 0%, rgba(52, 199, 89, 0.08), transparent),
    radial-gradient(ellipse 800px 400px at 90% 30%, rgba(255, 149, 0, 0.04), transparent),
    linear-gradient(180deg, #0a0e0d 0%, #0d1311 50%, #0a0e0d 100%);
  padding: 0 0 80px 0;
}

/* ====== HERO ====== */
.hero {
  padding: 60px 32px 40px 32px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: -100px; right: -100px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(52,199,89,0.15), transparent 70%);
  pointer-events: none;
}
.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #34c759;
  margin-bottom: 12px;
}
.hero-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 9vw, 96px);
  line-height: 0.92;
  letter-spacing: -0.01em;
  margin: 0 0 8px 0;
  color: #fff;
}
.hero-sub {
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  color: #8a958e;
  font-weight: 400;
  max-width: 600px;
  line-height: 1.5;
}
.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 24px;
  margin-top: 40px;
  max-width: 800px;
}
.hero-stat {
  border-left: 2px solid #34c759;
  padding-left: 16px;
}
.hero-stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #5a655e;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.hero-stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  color: #fff;
  line-height: 1;
}
.hero-stat-unit {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #8a958e;
  margin-left: 4px;
}

/* ====== TABS ====== */
.tabs {
  display: flex;
  gap: 4px;
  padding: 24px 32px 0 32px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }
.tab {
  background: transparent;
  border: none;
  color: #5a655e;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab:hover { color: #b8c0ba; }
.tab.active {
  color: #34c759;
  border-bottom-color: #34c759;
}

/* ====== SECTION ====== */
.section {
  padding: 48px 32px 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}
.section-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 14px;
  letter-spacing: 0.3em;
  color: #5a655e;
  text-transform: uppercase;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-title::before {
  content: '';
  width: 24px;
  height: 1px;
  background: #34c759;
}

/* ====== HOLE GRID ====== */
.holes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}
.hole {
  background: linear-gradient(180deg, #131816 0%, #0f1412 100%);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s, border-color 0.2s;
}
.hole:hover {
  border-color: rgba(52,199,89,0.3);
  transform: translateY(-2px);
}

.hole-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 20px 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.hole-number {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 64px;
  line-height: 0.85;
  color: #fff;
  letter-spacing: -0.02em;
}
.hole-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #8a958e;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
.hole-meta-row { display: flex; gap: 8px; justify-content: flex-end; }
.hole-meta-row .v {
  color: #fff;
  font-weight: 700;
}
.par-badge {
  background: rgba(52,199,89,0.12);
  color: #34c759;
  padding: 3px 8px;
  border-radius: 2px;
}
.index-badge-hard {
  background: rgba(255,59,48,0.12);
  color: #ff3b30;
  padding: 3px 8px;
  border-radius: 2px;
}
.index-badge-mid {
  background: rgba(255,149,0,0.12);
  color: #ff9500;
  padding: 3px 8px;
  border-radius: 2px;
}
.index-badge-easy {
  background: rgba(90,200,250,0.12);
  color: #5ac8fa;
  padding: 3px 8px;
  border-radius: 2px;
}

.hole-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px;
  letter-spacing: 0.02em;
  padding: 0 20px;
  margin: 8px 0 12px 0;
  color: #fff;
}
.hole-desc {
  padding: 0 20px 16px 20px;
  font-size: 13px;
  color: #b8c0ba;
  line-height: 1.5;
}

.hole-clubs {
  padding: 12px 20px;
  background: rgba(0,0,0,0.25);
  border-top: 1px solid rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.clubs-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  color: #5a655e;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.clubs-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.club-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
}
.club-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #000;
}
.club-arrow {
  color: #5a655e;
  font-size: 11px;
}

.hole-strategy {
  padding: 14px 20px;
  font-size: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.strategy-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.2em;
  padding: 3px 7px;
  border-radius: 2px;
  text-transform: uppercase;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}
.strategy-tag.safe { background: rgba(90,200,250,0.15); color: #5ac8fa; }
.strategy-tag.balanced { background: rgba(52,199,89,0.15); color: #34c759; }
.strategy-tag.aggressive { background: rgba(255,59,48,0.15); color: #ff3b30; }
.strategy-text {
  color: #b8c0ba;
  font-size: 12px;
  line-height: 1.5;
}

.hole-risks {
  padding: 14px 20px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.risk-chip {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.05em;
  padding: 4px 8px;
  background: rgba(255,59,48,0.08);
  color: #ff8a82;
  border: 1px solid rgba(255,59,48,0.15);
  border-radius: 2px;
}

/* ====== SUMMARY ====== */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.summary-card {
  background: linear-gradient(180deg, #131816 0%, #0f1412 100%);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 4px;
  padding: 24px;
}
.summary-card-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #5a655e;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.summary-card-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 48px;
  line-height: 1;
  color: #fff;
}
.summary-card-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #8a958e;
  margin-top: 4px;
}

/* ====== CLUB STATS BAR ====== */
.club-stats {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}
.club-stat-row {
  display: grid;
  grid-template-columns: 90px 1fr 60px;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.club-stat-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}
.club-stat-bar-track {
  height: 6px;
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
  overflow: hidden;
}
.club-stat-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}
.club-stat-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #fff;
  text-align: right;
  font-weight: 700;
}

/* ====== 9-HOLE BREAK ====== */
.nine-divider {
  margin: 40px auto;
  padding: 32px;
  max-width: 1400px;
  background: linear-gradient(135deg, rgba(52,199,89,0.05), rgba(52,199,89,0.02));
  border: 1px solid rgba(52,199,89,0.15);
  border-radius: 4px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 24px;
  align-items: center;
}
@media (max-width: 700px) {
  .nine-divider { grid-template-columns: 1fr 1fr; }
}
.nine-divider .nd-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32px;
  color: #34c759;
  letter-spacing: 0.05em;
}
.nine-divider .nd-stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #5a655e;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.nine-divider .nd-stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  color: #fff;
  line-height: 1;
}

/* ====== INSIGHT BOX ====== */
.insight {
  margin: 32px auto;
  max-width: 1400px;
  padding: 0 32px;
}
.insight-card {
  background: linear-gradient(135deg, rgba(255,149,0,0.06), rgba(255,149,0,0.02));
  border: 1px solid rgba(255,149,0,0.2);
  border-left: 3px solid #ff9500;
  padding: 20px 24px;
  border-radius: 2px;
  display: flex;
  gap: 16px;
}
.insight-icon {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  color: #ff9500;
  flex-shrink: 0;
}
.insight-content h4 {
  margin: 0 0 6px 0;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 18px;
  letter-spacing: 0.05em;
  color: #fff;
}
.insight-content p {
  margin: 0;
  font-size: 13px;
  color: #c8d0ca;
  line-height: 1.6;
}

/* ====== FOOTER ====== */
.footer {
  text-align: center;
  padding: 40px 32px;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin-top: 40px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #5a655e;
  text-transform: uppercase;
}
.footer-mark {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  color: #34c759;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
  letter-spacing: 0.2em;
}
`;

// ============ COMPONENTS ============

function ClubChip({ raw }) {
  const meta = parseClub(raw);
  return (
    <span className="club-chip">
      <span className="club-icon" style={{ background: meta.color }}>{meta.icon}</span>
      {meta.label}
    </span>
  );
}

function indexBadgeClass(idx) {
  if (idx <= 6) return 'index-badge-hard';
  if (idx <= 12) return 'index-badge-mid';
  return 'index-badge-easy';
}

function HoleCard({ hole }) {
  return (
    <div className="hole">
      <div className="hole-header">
        <div className="hole-number">{String(hole.n).padStart(2, '0')}</div>
        <div className="hole-meta">
          <div className="hole-meta-row">
            <span>Par</span>
            <span className="par-badge">{hole.par}</span>
          </div>
          <div className="hole-meta-row">
            <span>Idx</span>
            <span className={indexBadgeClass(hole.index)}>{hole.index}</span>
          </div>
          <div className="hole-meta-row">
            <span>Meter</span>
            <span className="v">{hole.meters}</span>
          </div>
        </div>
      </div>

      <div className="hole-title">{hole.title}</div>
      <div className="hole-desc">{hole.desc}</div>

      <div className="hole-clubs">
        <div className="clubs-label">Klubbor — Tee → Green</div>
        <div className="clubs-row">
          {hole.clubs.map((c, i) => (
            <React.Fragment key={i}>
              <ClubChip raw={c} />
              {i < hole.clubs.length - 1 && <span className="club-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="hole-strategy">
        <span className={`strategy-tag ${hole.strategy}`}>
          {hole.strategy === 'safe' ? 'Säkert' : hole.strategy === 'aggressive' ? 'Aggressivt' : 'Balanserat'}
        </span>
        <span className="strategy-text">{hole.note}</span>
      </div>

      {hole.risks && hole.risks.length > 0 && (
        <div className="hole-risks">
          {hole.risks.map((r, i) => <span key={i} className="risk-chip">⚠ {r}</span>)}
        </div>
      )}
    </div>
  );
}

function NineSummary({ holes, label }) {
  const par = holes.reduce((s, h) => s + h.par, 0);
  const meters = holes.reduce((s, h) => s + h.meters, 0);
  return (
    <div className="nine-divider">
      <div className="nd-title">{label}</div>
      <div>
        <div className="nd-stat-label">Par</div>
        <div className="nd-stat-value">{par}</div>
      </div>
      <div>
        <div className="nd-stat-label">Meter</div>
        <div className="nd-stat-value">{meters}</div>
      </div>
      <div>
        <div className="nd-stat-label">Hål</div>
        <div className="nd-stat-value">{holes.length}</div>
      </div>
    </div>
  );
}

function useClubStats() {
  return useMemo(() => {
    const counts = {};
    HOLES.forEach(h => {
      h.clubs.forEach(raw => {
        // Normalize "eller" cases by counting both alternatives lightly
        const cleaned = raw.replace(/\s*\(.+?\)/g, '').trim();
        if (cleaned.includes('eller')) {
          cleaned.split('eller').map(s => s.trim()).forEach(c => {
            counts[c] = (counts[c] || 0) + 0.5;
          });
        } else {
          counts[cleaned] = (counts[cleaned] || 0) + 1;
        }
      });
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = sorted[0]?.[1] || 1;
    return { sorted, max };
  }, []);
}

function ClubStats() {
  const { sorted, max } = useClubStats();
  return (
    <div className="club-stats">
      {sorted.map(([club, count]) => {
        const meta = CLUB_META[club] || { label: club, icon: '?', color: '#999' };
        const pct = (count / max) * 100;
        return (
          <div key={club} className="club-stat-row">
            <div className="club-stat-name">
              <span className="club-icon" style={{ background: meta.color }}>{meta.icon}</span>
              {meta.label}
            </div>
            <div className="club-stat-bar-track">
              <div className="club-stat-bar-fill" style={{ width: pct + '%', background: meta.color }} />
            </div>
            <div className="club-stat-count">{count % 1 === 0 ? count : count.toFixed(1)}×</div>
          </div>
        );
      })}
    </div>
  );
}

function StrategyStats() {
  const counts = HOLES.reduce((acc, h) => {
    acc[h.strategy] = (acc[h.strategy] || 0) + 1;
    return acc;
  }, {});
  return (
    <div className="summary-grid">
      <div className="summary-card" style={{ borderTop: '2px solid #5ac8fa' }}>
        <div className="summary-card-label">Säkert spel</div>
        <div className="summary-card-value">{counts.safe || 0}</div>
        <div className="summary-card-sub">hål av 18</div>
      </div>
      <div className="summary-card" style={{ borderTop: '2px solid #34c759' }}>
        <div className="summary-card-label">Balanserat</div>
        <div className="summary-card-value">{counts.balanced || 0}</div>
        <div className="summary-card-sub">hål av 18</div>
      </div>
      <div className="summary-card" style={{ borderTop: '2px solid #ff3b30' }}>
        <div className="summary-card-label">Aggressivt</div>
        <div className="summary-card-value">{counts.aggressive || 0}</div>
        <div className="summary-card-sub">hål av 18</div>
      </div>
    </div>
  );
}

// ============ MAIN ============

export default function GolfGuide() {
  const [activeTab, setActiveTab] = useState('alla');
  const front9 = HOLES.slice(0, 9);
  const back9 = HOLES.slice(9, 18);
  const totalPar = HOLES.reduce((s, h) => s + h.par, 0);
  const totalMeters = HOLES.reduce((s, h) => s + h.meters, 0);

  const visibleHoles = activeTab === 'front' ? front9 : activeTab === 'back' ? back9 : HOLES;

  return (
    <>
      <style>{css}</style>
      <div className="guide">

        {/* HERO */}
        <div className="hero">
          <div className="hero-eyebrow">Spelguide · {COURSE.tee}</div>
          <h1 className="hero-title">ÅKAGÅRDEN<br />GOLFKLUBB</h1>
          <div className="hero-sub">
            En kuperad parkbana ritad av {COURSE.designer} mitt på {COURSE.location}.
            Vinden är alltid i spel — och utsikten över Skälderviken är värd biljetten själv.
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-label">Par</div>
              <div className="hero-stat-value">{COURSE.par}</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">Längd</div>
              <div className="hero-stat-value">{COURSE.totalMeters}<span className="hero-stat-unit">m</span></div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">Hål</div>
              <div className="hero-stat-value">18</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label">Tee</div>
              <div className="hero-stat-value" style={{ fontSize: 24 }}>{COURSE.tee}</div>
            </div>
          </div>
        </div>

        {/* INSIGHT */}
        <div className="insight">
          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h4>Strategisk översikt</h4>
              <p>
                Du går driver på <b>12 av 18 hål</b> — en aggressiv tee-strategi som passar
                en bana med relativt korta par 4:or. Banan straffar dålig placering hårdare
                än kort längd, så fokusera på att hålla bollen i spel snarare än maxa varje
                slag. Vind är konstant — räkna alltid med en extra klubba.
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'alla' ? 'active' : ''}`} onClick={() => setActiveTab('alla')}>
            Alla 18 hål
          </button>
          <button className={`tab ${activeTab === 'front' ? 'active' : ''}`} onClick={() => setActiveTab('front')}>
            Front 9
          </button>
          <button className={`tab ${activeTab === 'back' ? 'active' : ''}`} onClick={() => setActiveTab('back')}>
            Back 9
          </button>
        </div>

        {/* HOLES */}
        <div className="section">
          {activeTab === 'alla' ? (
            <>
              <div className="section-title">Front 9 · Ut</div>
              <div className="holes-grid">
                {front9.map(h => <HoleCard key={h.n} hole={h} />)}
              </div>
              <NineSummary holes={front9} label="Front 9" />
              <div className="section-title">Back 9 · In</div>
              <div className="holes-grid">
                {back9.map(h => <HoleCard key={h.n} hole={h} />)}
              </div>
              <NineSummary holes={back9} label="Back 9" />
            </>
          ) : (
            <>
              <div className="section-title">{activeTab === 'front' ? 'Front 9 · Ut' : 'Back 9 · In'}</div>
              <div className="holes-grid">
                {visibleHoles.map(h => <HoleCard key={h.n} hole={h} />)}
              </div>
              <NineSummary holes={visibleHoles} label={activeTab === 'front' ? 'Front 9' : 'Back 9'} />
            </>
          )}
        </div>

        {/* TOTAL */}
        <div className="section">
          <div className="section-title">Totalt · 18 hål</div>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-card-label">Total Par</div>
              <div className="summary-card-value">{totalPar}</div>
              <div className="summary-card-sub">Front {front9.reduce((s,h)=>s+h.par,0)} · Back {back9.reduce((s,h)=>s+h.par,0)}</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-label">Total Meter</div>
              <div className="summary-card-value">{totalMeters}</div>
              <div className="summary-card-sub">Snitt {Math.round(totalMeters/18)}m/hål</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-label">Par 5</div>
              <div className="summary-card-value">{HOLES.filter(h=>h.par===5).length}</div>
              <div className="summary-card-sub">scoring opportunities</div>
            </div>
            <div className="summary-card">
              <div className="summary-card-label">Par 3</div>
              <div className="summary-card-value">{HOLES.filter(h=>h.par===3).length}</div>
              <div className="summary-card-sub">precision required</div>
            </div>
          </div>
        </div>

        {/* CLUB STATS */}
        <div className="section">
          <div className="section-title">Klubbstatistik · 18 hål</div>
          <ClubStats />
        </div>

        {/* STRATEGY STATS */}
        <div className="section">
          <div className="section-title">Spelfilosofi · Risk vs Reward</div>
          <StrategyStats />
        </div>

        {/* COURSE MANAGEMENT TIPS */}
        <div className="insight">
          <div className="insight-card" style={{
            background: 'linear-gradient(135deg, rgba(52,199,89,0.06), rgba(52,199,89,0.02))',
            borderColor: 'rgba(52,199,89,0.2)',
            borderLeftColor: '#34c759',
          }}>
            <div className="insight-icon" style={{ color: '#34c759' }}>✓</div>
            <div className="insight-content">
              <h4>Course Management — 5 regler för rundan</h4>
              <p style={{ marginBottom: 8 }}>
                <b style={{ color: '#34c759' }}>1.</b> Vinden är alltid faktor — addera en klubba mot vinden, dra av en med.<br/>
                <b style={{ color: '#34c759' }}>2.</b> På korta par 4 (hål 1, 3, 10, 18): aggressivt från tee, defensivt på inspel.<br/>
                <b style={{ color: '#34c759' }}>3.</b> Index 1-4 (hål 7, 11, 6, 15): planera för bogey, var glad åt par.<br/>
                <b style={{ color: '#34c759' }}>4.</b> Greenerna lutar mycket — sikta alltid under flaggan, aldrig över.<br/>
                <b style={{ color: '#34c759' }}>5.</b> Vatten är i spel på hål 5 och 6. Säkerhetsmarginal &gt; hjältesvinghårdhet.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="footer-mark">⛳ AKAGÅRDEN · GUIDE</div>
          <div>Data: Caddee + Trackman-anteckningar · Genererat för Alexander</div>
          <div style={{ marginTop: 8, opacity: 0.6 }}>Hål 7–18: längder är uppskattade utifrån totalsumma och dina klubbval — verifiera på tee-skylten.</div>
        </div>

      </div>
    </>
  );
}
