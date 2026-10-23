const http = require("http");

const PORT = Number(process.env.PORT || 3000);
const APP_VERSION = process.env.APP_VERSION || "local";
const STARTED_AT = new Date();

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OpsPilot · Cloud Operations</title>
<style>
:root{color-scheme:dark;--bg:#08111f;--panel:#101d30;--panel2:#0d1829;--line:#213149;--muted:#91a4bd;--text:#edf5ff;--cyan:#59d7f7;--green:#49d7a0;--amber:#ffca78;--red:#ff7f91}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 75% -10%,#153353 0,transparent 38%),var(--bg);color:var(--text);font:14px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
button{font:inherit}.layout{display:grid;grid-template-columns:240px minmax(0,1fr);min-height:100vh}.sidebar{border-right:1px solid var(--line);background:rgba(8,17,31,.86);padding:24px 16px;display:flex;flex-direction:column;gap:28px}.brand{display:flex;align-items:center;gap:11px;padding:0 8px}.brand-mark{width:38px;height:38px;border-radius:12px;background:linear-gradient(145deg,#66e2ff,#387cff);display:grid;place-items:center;color:#071321;font-weight:900;font-size:20px;box-shadow:0 8px 28px #2b9dce33}.brand-name{font-size:17px;font-weight:800;letter-spacing:-.4px}.brand-sub{font-size:10px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase}.nav-label{font-size:10px;color:#7186a2;letter-spacing:1.6px;padding:0 12px;margin-bottom:8px}.nav{display:grid;gap:5px}.nav a{color:#a9bad0;text-decoration:none;padding:11px 12px;border-radius:10px;display:flex;gap:12px;align-items:center}.nav a.active,.nav a:hover{color:#f2fbff;background:#162a40}.nav a.active{box-shadow:inset 3px 0 var(--cyan)}.nav-icon{width:18px;text-align:center;color:var(--cyan);font-size:16px}.side-bottom{margin-top:auto;border:1px solid var(--line);background:var(--panel2);padding:14px;border-radius:13px}.side-bottom strong{display:block;font-size:12px}.side-bottom p{margin:5px 0 12px;color:var(--muted);font-size:11px}.tiny-status{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--green)}.dot{width:7px;height:7px;border-radius:50%;background:currentColor;box-shadow:0 0 12px currentColor}
main{min-width:0;padding:28px clamp(18px,3vw,42px) 36px}.topbar{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:28px}.eyebrow{color:var(--cyan);text-transform:uppercase;letter-spacing:1.8px;font-size:10px;font-weight:800}.topbar h1{font-size:clamp(24px,3vw,34px);letter-spacing:-1.2px;margin:5px 0 4px}.subtitle{color:var(--muted);margin:0}.top-actions{display:flex;gap:10px;align-items:center}.live-pill{border:1px solid #28644f;background:#102e2a;color:var(--green);padding:8px 11px;border-radius:999px;display:flex;align-items:center;gap:8px;font-size:12px;white-space:nowrap}.avatar{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:#203752;border:1px solid #3b5878;font-weight:800;color:#d8f6ff}
.hero{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:25px 28px;border-radius:18px;border:1px solid #29445f;background:linear-gradient(110deg,#142b43,#102039 65%,#102c3d);margin-bottom:20px}.hero:after{content:"";position:absolute;width:280px;height:280px;border-radius:50%;right:8%;top:-190px;border:1px solid #59d7f722;box-shadow:0 0 0 30px #59d7f70a,0 0 0 60px #59d7f707}.hero-copy{position:relative;z-index:1}.hero h2{font-size:clamp(19px,2.2vw,25px);letter-spacing:-.6px;margin:8px 0}.hero p{color:#adc0d6;max-width:610px;margin:0}.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:17px}.btn{border:1px solid #36516d;background:#172e47;color:#eaf7ff;border-radius:9px;padding:10px 14px;cursor:pointer;font-weight:700;font-size:12px}.btn.primary{background:var(--cyan);color:#061523;border-color:var(--cyan)}.btn:hover{filter:brightness(1.08)}.hero-art{position:relative;z-index:1;min-width:150px;text-align:center}.orb{margin:auto;width:94px;height:94px;border:1px solid #4fcde777;border-radius:27px;transform:rotate(45deg);display:grid;place-items:center;background:linear-gradient(135deg,#60dcf51c,#4c7bff1c);box-shadow:0 0 35px #35b8e51c}.orb span{transform:rotate(-45deg);font-size:39px;color:var(--cyan)}.hero-art small{display:block;color:#8ea8c4;margin-top:17px;font-size:10px;letter-spacing:1.5px}
.section-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:26px 0 13px}.section-head h3{font-size:15px;margin:0;letter-spacing:-.2px}.section-head span{color:var(--muted);font-size:11px}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}.card{background:linear-gradient(145deg,#111f33,#0e192a);border:1px solid var(--line);border-radius:14px;padding:17px;min-width:0}.metric-top{display:flex;justify-content:space-between;gap:10px;align-items:center;color:var(--muted);font-size:12px}.metric-icon{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:#1b3048;color:var(--cyan);font-size:16px}.metric-value{font-size:28px;font-weight:800;letter-spacing:-1px;margin:12px 0 3px}.metric-foot{font-size:11px;color:var(--muted)}.positive{color:var(--green)}.cyan{color:var(--cyan)}.amber{color:var(--amber)}
.two-col{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(280px,1fr);gap:14px}.panel-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.panel-title h3{margin:0;font-size:14px}.panel-title small{color:var(--muted);font-size:11px}.pipeline{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;align-items:center}.stage{position:relative;background:#0c1727;border:1px solid #23364f;border-radius:11px;padding:14px 9px;text-align:center}.stage:not(:last-child):after{content:"›";position:absolute;right:-9px;top:26px;color:#55718f;font-size:20px;z-index:2}.stage-icon{width:31px;height:31px;margin:0 auto 8px;border-radius:9px;display:grid;place-items:center;background:#17344a;color:var(--cyan);font-weight:800}.stage strong{display:block;font-size:11px}.stage small{display:block;color:var(--muted);font-size:10px;margin-top:4px}.stage.complete .stage-icon{background:#12382f;color:var(--green)}.pipeline-note{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:11px;margin-top:15px}.pipeline-note .dot{color:var(--green)}
.health-list{display:grid;gap:15px}.health-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.health-name{font-size:12px;font-weight:700}.health-desc{font-size:10px;color:var(--muted);margin-top:2px}.health-state{font-size:10px;color:var(--green);display:flex;align-items:center;gap:6px}.health-state .dot{width:6px;height:6px}.bar{grid-column:1/-1;height:5px;background:#23334a;border-radius:20px;overflow:hidden}.bar span{display:block;height:100%;border-radius:20px;background:linear-gradient(90deg,#32a9dc,#61e3f6)}.bar.green span{background:linear-gradient(90deg,#2baf84,#60e6b4)}
.activity{display:grid;gap:0}.activity-row{display:grid;grid-template-columns:32px 1fr auto;gap:11px;align-items:start;padding:12px 0;border-bottom:1px solid #1e2c40}.activity-row:last-child{border-bottom:0}.activity-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:9px;background:#17352f;color:var(--green)}.activity-icon.blue{background:#18334b;color:var(--cyan)}.activity-row strong{display:block;font-size:11px}.activity-row p{margin:3px 0 0;color:var(--muted);font-size:10px}.activity-time{font-size:10px;color:#8499b2;white-space:nowrap}.release{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #1e2c40}.release:last-child{border-bottom:0}.release-left{display:flex;align-items:center;gap:10px}.release-mark{width:32px;height:32px;border-radius:9px;background:#172d45;display:grid;place-items:center;color:var(--cyan)}.release strong{font-size:11px;display:block}.release small{font-size:10px;color:var(--muted)}.tag{font-size:10px;color:var(--green);border:1px solid #28604d;background:#112e29;padding:4px 7px;border-radius:6px}
.footer{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:22px;color:#7087a3;font-size:10px}.footer span{display:flex;align-items:center;gap:7px}
@media(max-width:1050px){.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.two-col{grid-template-columns:1fr}.hero-art{min-width:115px}.orb{width:75px;height:75px}}
@media(max-width:680px){.layout{grid-template-columns:1fr}.sidebar{display:none}main{padding:20px 14px}.topbar{align-items:flex-start}.top-actions{gap:6px}.live-pill{font-size:0;padding:10px}.live-pill .dot{font-size:12px}.avatar{display:none}.hero{padding:20px}.hero-art{display:none}.metrics{gap:9px}.card{padding:13px}.metric-value{font-size:24px}.pipeline{grid-template-columns:repeat(2,minmax(0,1fr))}.stage:nth-child(2):after{display:none}.section-head{margin-top:21px}}
</style>
</head>
<body>
<div class="layout">
<aside class="sidebar">
  <div class="brand"><div class="brand-mark">⌁</div><div><div class="brand-name">OpsPilot</div><div class="brand-sub">Cloud operations</div></div></div>
  <div><div class="nav-label">WORKSPACE</div><nav class="nav">
    <a class="active" href="#overview"><span class="nav-icon">▦</span>Overview</a>
    <a href="#pipeline"><span class="nav-icon">⇢</span>CI/CD Pipeline</a>
    <a href="#services"><span class="nav-icon">◈</span>Services & Health</a>
    <a href="#releases"><span class="nav-icon">◷</span>Releases</a>
    <a href="#activity"><span class="nav-icon">☷</span>Activity Log</a>
  </nav></div>
  <div class="side-bottom"><div class="tiny-status"><span class="dot"></span> Demo environment online</div><p>OpsPilot application dashboard is responding to HTTP requests.</p><strong>Environment · Kubernetes</strong></div>
</aside>
<main id="overview">
<header class="topbar"><div><div class="eyebrow">Cloud operations / Overview</div><h1>Welcome back, DevOps Engineer!</h1><p class="subtitle">CI/CD Pipeline: Build. Deploy. Monitor.</p></div><div class="top-actions"><div class="live-pill"><span class="dot"></span> APPLICATION ONLINE</div><div class="avatar">SK</div></div></header>
<section class="hero"><div class="hero-copy"><div class="eyebrow">DEPLOYMENT CONTROL CENTER</div><h2>Ship confidently. Operate reliably.</h2><p>Monitor your application release, review pipeline stages, and check service health from one clean workspace.</p><div class="hero-actions"><button class="btn primary" onclick="document.querySelector('#pipeline').scrollIntoView({behavior:'smooth'})">View pipeline ↗</button><button class="btn" onclick="document.querySelector('#services').scrollIntoView({behavior:'smooth'})">Check service health</button></div></div><div class="hero-art"><div class="orb"><span>⌘</span></div><small>DEPLOY · OBSERVE · IMPROVE</small></div></section>
<div class="section-head"><h3>Environment overview</h3><span>Illustrative dashboard metrics</span></div>
<section class="metrics">
  <div class="card"><div class="metric-top"><span>Application status</span><span class="metric-icon">⌁</span></div><div class="metric-value positive">Healthy</div><div class="metric-foot"><span class="positive">● Online</span> · HTTP service responding</div></div>
  <div class="card"><div class="metric-top"><span>Running replicas</span><span class="metric-icon">▣</span></div><div class="metric-value">2 <span style="font-size:13px;color:var(--muted);font-weight:500">/ 2</span></div><div class="metric-foot"><span class="positive">● Expected count</span> · Demo configuration</div></div>
  <div class="card"><div class="metric-top"><span>Release version</span><span class="metric-icon">↗</span></div><div class="metric-value cyan" id="version">v${APP_VERSION}</div><div class="metric-foot">Injected by deployment environment</div></div>
  <div class="card"><div class="metric-top"><span>Uptime</span><span class="metric-icon">◷</span></div><div class="metric-value" id="uptime">00:00</div><div class="metric-foot">Since this app process started</div></div>
</section>
<div class="two-col">
  <section id="pipeline"><div class="section-head"><h3>Delivery pipeline</h3><span>Automated workflow</span></div><div class="card"><div class="panel-title"><h3>From commit to production</h3><small>CI / CD</small></div><div class="pipeline">
    <div class="stage complete"><div class="stage-icon">✓</div><strong>GitHub</strong><small>Code commit</small></div>
    <div class="stage complete"><div class="stage-icon">✓</div><strong>Jenkins</strong><small>Build & test</small></div>
    <div class="stage complete"><div class="stage-icon">▧</div><strong>Docker</strong><small>Image registry</small></div>
    <div class="stage complete"><div class="stage-icon">◈</div><strong>Kubernetes</strong><small>Deployment</small></div>
  </div><div class="pipeline-note"><span class="dot"></span> Pipeline layout shown for this project; stage states are illustrative, not fetched from Jenkins.</div></div></section>
  <section id="services"><div class="section-head"><h3>Service health</h3><span>Demo indicators</span></div><div class="card"><div class="panel-title"><h3>Application components</h3><small>Environment view</small></div><div class="health-list">
    <div class="health-row"><div><div class="health-name">Web application</div><div class="health-desc">Node.js · Port 3000</div></div><div class="health-state"><span class="dot"></span>Online</div><div class="bar green"><span style="width:100%"></span></div></div>
    <div class="health-row"><div><div class="health-name">Container image</div><div class="health-desc">Docker image build</div></div><div class="health-state"><span class="dot"></span>Configured</div><div class="bar"><span style="width:86%"></span></div></div>
    <div class="health-row"><div><div class="health-name">Kubernetes service</div><div class="health-desc">Service route · Port 80</div></div><div class="health-state"><span class="dot"></span>Configured</div><div class="bar"><span style="width:92%"></span></div></div>
  </div></div></section>
</div>
<div class="two-col">
  <section id="activity"><div class="section-head"><h3>Recent activity</h3><span>Example events</span></div><div class="card"><div class="activity">
    <div class="activity-row"><div class="activity-icon">✓</div><div><strong>Application process started</strong><p>Node.js server is accepting requests.</p></div><div class="activity-time">Runtime</div></div>
    <div class="activity-row"><div class="activity-icon blue">↗</div><div><strong>Release version loaded</strong><p>Version value read from APP_VERSION.</p></div><div class="activity-time">Runtime</div></div>
    <div class="activity-row"><div class="activity-icon blue">⌘</div><div><strong>Health endpoint available</strong><p>HTTP health check is ready for probes.</p></div><div class="activity-time">Runtime</div></div>
  </div></div></section>
  <section id="releases"><div class="section-head"><h3>Release information</h3><span>Current instance</span></div><div class="card"><div class="panel-title"><h3>Application release</h3><span class="tag">RUNNING</span></div>
    <div class="release"><div class="release-left"><div class="release-mark">⌘</div><div><strong>OpsPilot web dashboard</strong><small>Node.js container</small></div></div><span class="tag">Online</span></div>
    <div class="release"><div class="release-left"><div class="release-mark">#</div><div><strong>Build / version</strong><small id="releaseVersion">v${APP_VERSION}</small></div></div><span class="tag">Active</span></div>
    <div class="release"><div class="release-left"><div class="release-mark">◷</div><div><strong>Started at</strong><small>${STARTED_AT.toISOString().replace("T"," ").slice(0,19)} UTC</small></div></div></div>
  </div></section>
</div>
<footer class="footer"><span><span class="dot" style="color:var(--green)"></span> OpsPilot application is responding</span><span>Built for a GitHub → Jenkins → Docker → Kubernetes CI/CD demonstration</span></footer>
</main></div>
<script>
const startedAt = Date.now();
function tick(){const s=Math.floor((Date.now()-startedAt)/1000);const h=String(Math.floor(s/3600)).padStart(2,'0');const m=String(Math.floor((s%3600)/60)).padStart(2,'0');const sec=String(s%60).padStart(2,'0');document.getElementById('uptime').textContent=h+':'+m+':'+sec;}
tick();setInterval(tick,1000);
</script>
</body></html>`;

const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    return res.end(JSON.stringify({ status: "ok", app: "opspilot", version: APP_VERSION, uptimeSeconds: Math.floor(process.uptime()) }));
  }
  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    return res.end();
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  res.end(page);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`OpsPilot running on port ${PORT}; version=${APP_VERSION}`);
});
