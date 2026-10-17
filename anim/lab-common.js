/*
 * 物理ラボ シミュレーター共通部品（anim/*.html から読み込む）
 *   LAB.app(config) でページ全体（モードのタブ・図・グラフ・設定・数値・見てみよう）を組み立てる。
 *   各ページは物理（mode.reset / mode.step）と描画（mode.draw）だけを書けばよい。
 *
 * config = {
 *   title: "運動量ラボ",
 *   modes: { key: {
 *     label: "タブの名前",
 *     params: [[key, ラベル, min, max, step, 単位, 小数桁, 初期値], ...],
 *     selects: [[key, ラベル, [[値, 表示], ...], 初期値], ...],      // 省略可
 *     toggles: [[key, ラベル, 初期値], ...],                           // 省略可
 *     timed: true,           // 再生ボタンと時刻スライダーを出す
 *     duration(P): 再生の長さ〔s〕、 reset(P, S): 状態の初期化、 step(P, S, dt): 時間を進める
 *     draw(ctx): 描画。ctx = {P, S, T(トグル), t, stage, graphs[4], ro(html), eqs(html), banner(text,color)}
 *     graphs: 使うグラフの枚数（0〜4）、 legend: HTML、 asks: [[問い, 答え], ...]
 *   }}
 * }
 * URL の #mode&key=値… でモードと値を指定できる。
 */
(function(){
"use strict";
const $ = id => document.getElementById(id);
const f = (n, d=2) => { if(!isFinite(n)) return "—"; return (Math.abs(n) < 0.5*Math.pow(10,-d) ? 0 : n).toFixed(d).replace("-", "−"); };
const S = s => `<span class="s">${s}</span>`;
const V = s => `<span class="vb">${s}</span>`;
function css(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
function prep(cv){
  const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
  if(cv.width !== Math.round(w*dpr) || cv.height !== Math.round(h*dpr)){ cv.width = Math.round(w*dpr); cv.height = Math.round(h*dpr); }
  const c = cv.getContext("2d"); c.setTransform(dpr,0,0,dpr,0,0); c.clearRect(0,0,w,h);
  return {c, w, h};
}
function niceStep(span, n){ const raw = span/n; const p = Math.pow(10, Math.floor(Math.log10(raw))); const q = raw/p; return (q < 1.5 ? 1 : q < 3 ? 2 : q < 7 ? 5 : 10)*p; }
function arrow(c, x1, y1, x2, y2, color, w=2.6, dash){
  const L = Math.hypot(x2-x1, y2-y1); if(L < 1.5) return;
  c.save(); c.strokeStyle = color; c.fillStyle = color; c.lineWidth = w; if(dash) c.setLineDash(dash);
  c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke(); c.setLineDash([]);
  const a = Math.atan2(y2-y1, x2-x1), hl = Math.min(11, L*0.45);
  c.beginPath(); c.moveTo(x2,y2); c.lineTo(x2-hl*Math.cos(a-0.4), y2-hl*Math.sin(a-0.4)); c.lineTo(x2-hl*Math.cos(a+0.4), y2-hl*Math.sin(a+0.4)); c.closePath(); c.fill();
  c.restore();
}
function label(c, txt, x, y, color, align="left", font){
  c.save(); c.fillStyle = color; c.font = font || `13px ${css("--f-ui")}`; c.textAlign = align; c.textBaseline = "middle"; c.fillText(txt, x, y); c.restore();
}
const symFont = (px=14, bold) => `${bold ? "bold " : ""}italic ${px}px ${css("--f-sym")}`;
const uiFont = (px=13, bold) => `${bold ? "bold " : ""}${px}px ${css("--f-ui")}`;
const numFont = (px=11) => `${px}px ${css("--f-num")}`;
/* 世界座標 b = {x0,x1,y0,y1} を等倍率で収める */
function fit(w, h, b, pad=16){
  const s = Math.min((w-2*pad)/(b.x1-b.x0), (h-2*pad)/(b.y1-b.y0));
  const ox = (w - (b.x1-b.x0)*s)/2, oy = (h - (b.y1-b.y0)*s)/2;
  return {s, X:x => ox + (x-b.x0)*s, Y:y => h - oy - (y-b.y0)*s};
}
function disc(c, x, y, r, fill, stroke){ c.beginPath(); c.arc(x, y, r, 0, Math.PI*2); if(fill){ c.fillStyle = fill; c.fill(); } if(stroke){ c.strokeStyle = stroke; c.lineWidth = 1.5; c.stroke(); } }
function table(rows){ return `<table class="ro">${rows.map(r => `<tr><td>${r[0]}</td><td class="num">${r[1]}</td></tr>`).join("")}</table>`; }

/* 時間グラフ：series = [{fn:t=>値 または pts:[[t,v],...], color, name, area}], tmax, t（現在時刻）, title, unit, ylo/yhi（省略可）, marks */
function graph(cv, o){
  const {c, w, h} = prep(cv);
  const ink2 = css("--ink2"), ink3 = css("--ink3"), grid = css("--grid2");
  const tmax = Math.max(o.tmax || 1, 1e-6), n = 160;
  const samples = o.series.map(s => s.pts ? s.pts : Array.from({length:n+1}, (_, i) => { const tt = tmax*i/n; return [tt, s.fn(tt)]; }));
  let lo = o.ylo, hi = o.yhi;
  if(lo == null || hi == null){
    let a = 0, b = 0; samples.forEach(pts => pts.forEach(p => { if(isFinite(p[1])){ a = Math.min(a, p[1]); b = Math.max(b, p[1]); } }));
    if(b - a < 1e-9){ b += 1; a -= 1; }
    const pad = (b - a)*0.1; if(lo == null) lo = a < 0 ? a - pad : 0; if(hi == null) hi = b > 0 ? b + pad : 0;
    if(hi - lo < 1e-9) hi = lo + 1;
  }
  const pl = 8, pr = 8, pt = 22, pb = 16;
  const X = t => pl + t/tmax*(w-pl-pr), Y = v => h - pb - (v-lo)/(hi-lo)*(h-pt-pb);
  c.strokeStyle = grid; c.lineWidth = 1; c.beginPath(); c.moveTo(pl, Y(0)); c.lineTo(w-pr, Y(0)); c.moveTo(pl, pt); c.lineTo(pl, h-pb); c.stroke();
  c.font = uiFont(12); c.fillStyle = ink2; c.textBaseline = "middle"; c.textAlign = "left"; c.fillText(`${o.title}${o.unit ? "〔"+o.unit+"〕" : ""}`, pl+4, 10);
  const tnow = o.t == null ? tmax : Math.min(o.t, tmax);
  o.series.forEach((s, k) => {
    const pts = samples[k], col = css(s.color) || s.color;
    if(s.area){
      c.beginPath(); c.moveTo(X(0), Y(0)); pts.forEach(p => { if(p[0] <= tnow) c.lineTo(X(p[0]), Y(p[1])); }); c.lineTo(X(tnow), Y(0)); c.closePath();
      c.fillStyle = css("--hl2-a"); c.fill();
    }
    c.strokeStyle = col; c.globalAlpha = 0.3; c.lineWidth = 1.5; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke(); c.globalAlpha = 1;
    c.lineWidth = 2.2; c.beginPath(); let started = false;
    pts.forEach(p => { if(p[0] <= tnow + 1e-12){ started ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1])); started = true; } }); c.stroke();
    if(s.name){ c.font = numFont(11); c.fillStyle = col; c.textAlign = "right"; c.fillText(s.name, w - pr, 10 + 13*k); }
  });
  if(o.note){ c.font = numFont(11); c.fillStyle = css("--hl2"); c.textAlign = "right"; c.textBaseline = "alphabetic"; c.fillText(o.note, w-pr, h-4); }
  if(o.t != null){ c.strokeStyle = ink3; c.setLineDash([2,3]); c.beginPath(); c.moveTo(X(tnow), pt); c.lineTo(X(tnow), h-pb); c.stroke(); c.setLineDash([]); }
  return {X, Y, c, w, h};
}

/* ---------- ページの組み立て ---------- */
function app(cfg){
  const modes = cfg.modes, keys = Object.keys(modes);
  let mode = keys[0], P = {}, T = {}, St = {}, t = 0, playing = false, last = null, speed = 1, dur = 0;
  document.body.innerHTML = `<div class="wrap">
  <header class="top"><a class="back" href="../index.html">‹ 物理ラボ</a><h1>${cfg.title}</h1></header>
  <nav class="tabs" role="tablist" aria-label="モード">${keys.map(k => `<button role="tab" data-mode="${k}">${modes[k].label}</button>`).join("")}</nav>
  <div class="grid">
    <section class="card"><h2 id="hStage">${cfg.title}</h2>
      <canvas id="stage" role="img" aria-label="${cfg.title}の図"></canvas>
      <div class="legend" id="legend"></div>
      <p class="note" id="banner" style="font-weight:700"></p>
      <div class="bar" id="timebar">
        <button class="btn" id="play" type="button">▶ 再生</button>
        <button class="btn ghost" id="reset" type="button" aria-label="最初にもどす">⟲</button>
        <div class="time"><span class="num" id="tLabel">t = 0.00 s</span><input type="range" id="tSlider" min="0" max="1000" value="0" aria-label="時刻"></div>
        <select id="speed" aria-label="再生の速さ" style="font:inherit;padding:4px;border-radius:6px;border:1px solid var(--line);background:var(--surface);color:var(--ink)">
          <option value="0.25">×0.25</option><option value="0.5">×0.5</option><option value="1" selected>×1</option><option value="2">×2</option></select>
      </div>
    </section>
    <section class="card"><h2>グラフと数値</h2>
      <div class="minis" id="minis">${[0,1,2,3].map(i => `<canvas id="g${i}"></canvas>`).join("")}</div>
      <div id="ro" style="margin-top:8px"></div><div id="eqs"></div>
    </section>
    <section class="card"><h2>設定</h2><div class="ctrls" id="ctrls"></div><div class="toggles" id="toggles"></div></section>
    <section class="card"><h2>見てみよう</h2><ol class="qs" id="asks"></ol></section>
  </div></div>`;
  const M = () => modes[mode];
  function build(){
    const m = M();
    $("ctrls").innerHTML = (m.params || []).map(([k, lab, mn, mx, st]) =>
      `<div class="ctrl"><label for="c-${k}"><span>${lab}</span><span class="num" id="v-${k}"></span></label><input type="range" id="c-${k}" data-k="${k}" min="${mn}" max="${mx}" step="${st}"></div>`).join("")
      + (m.selects || []).map(([k, lab, opts]) => `<div class="ctrl"><label for="c-${k}"><span>${lab}</span></label><select id="c-${k}" data-k="${k}">${opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join("")}</select></div>`).join("");
    $("toggles").innerHTML = (m.toggles || []).map(([k, lab]) => `<label><input type="checkbox" data-t="${k}">${lab}</label>`).join("");
    $("ctrls").querySelectorAll("input[type=range]").forEach(el => el.addEventListener("input", e => { P[e.target.dataset.k] = +e.target.value; changed(); }));
    $("ctrls").querySelectorAll("select").forEach(el => el.addEventListener("change", e => { const v = e.target.value; P[e.target.dataset.k] = isNaN(+v) ? v : +v; changed(); }));
    $("toggles").querySelectorAll("input").forEach(el => el.addEventListener("change", e => { T[e.target.dataset.t] = e.target.checked; draw(); }));
    $("legend").innerHTML = m.legend || "";
    $("asks").innerHTML = (m.asks || []).map(a => `<li>${a[0]} <details><summary>答え</summary> ${a[1]}</details></li>`).join("");
    $("timebar").hidden = !m.timed;
    $("stage").style.aspectRatio = m.aspect || "";
    const ng = m.graphs || 0; [0,1,2,3].forEach(i => $("g"+i).hidden = i >= ng); $("minis").hidden = ng === 0;
    document.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.mode === mode));
  }
  function sync(){
    const m = M();
    (m.params || []).forEach(([k, , , , , u, d]) => { $("c-"+k).value = P[k]; $("v-"+k).textContent = `${f(P[k], d)}${u ? (u === "°" ? "°" : " "+u) : ""}`; });
    (m.selects || []).forEach(([k]) => { $("c-"+k).value = P[k]; });
    (m.toggles || []).forEach(([k]) => { const el = document.querySelector(`[data-t="${k}"]`); if(el) el.checked = !!T[k]; });
  }
  function setHash(){
    const m = M(), ks = (m.params || []).map(p => p[0]).concat((m.selects || []).map(s => s[0]));
    try{ history.replaceState(null, "", "#" + mode + ks.map(k => `&${k}=${P[k]}`).join("")); }catch(e){}
  }
  function resetState(){ const m = M(); St = {}; t = 0; if(m.reset) m.reset(P, St); dur = m.duration ? m.duration(P, St) : 0; }
  function changed(){ resetState(); playing = !!M().timed; last = null; sync(); setHash(); draw(); }
  function setMode(k, prm){
    mode = modes[k] ? k : keys[0]; const m = M();
    P = {}; (m.params || []).forEach(p => P[p[0]] = p[7]); (m.selects || []).forEach(s => P[s[0]] = s[3]);
    T = {}; (m.toggles || []).forEach(x => T[x[0]] = !!x[2]);
    Object.assign(P, prm || {});
    build(); resetState(); playing = !!m.timed; last = null; sync(); setHash(); draw();
  }
  function readHash(){
    const parts = location.hash.replace(/^#/, "").split("&"), k = modes[parts[0]] ? parts[0] : keys[0], m = modes[k], prm = {};
    const allowed = {}; (m.params || []).forEach(p => allowed[p[0]] = "n"); (m.selects || []).forEach(s => allowed[s[0]] = "s");
    parts.slice(1).forEach(kv => { const [a, b] = kv.split("="); if(!allowed[a] || b == null) return; const v = decodeURIComponent(b); prm[a] = isNaN(+v) ? v : +v; });
    setMode(k, prm);
  }
  function draw(){
    const m = M();
    const ctx = {P, S:St, T, t, dur, stage:$("stage"), graphs:[0,1,2,3].map(i => $("g"+i)),
      ro:h => { $("ro").innerHTML = h; }, eqs:h => { $("eqs").innerHTML = h; },
      banner:(txt, col) => { $("banner").textContent = txt || ""; $("banner").style.color = col ? (css(col) || col) : css("--ui"); }};
    $("banner").textContent = "";
    m.draw(ctx);
    if(m.timed){
      $("tLabel").textContent = `t = ${f(t)} s`;
      $("tSlider").value = dur > 0 ? Math.round(t/dur*1000) : 0;
      $("play").textContent = playing ? "❚❚ 停止" : (dur > 0 && t >= dur - 1e-9 ? "▶ もう一度" : "▶ 再生");
    }
  }
  /* 時刻 tt まで状態を進めなおす（スライダー用） */
  function seek(tt){ const m = M(); resetState(); const h = m.dt || 1/240; while(t < tt - 1e-12){ const d = Math.min(h, tt - t); m.step(P, St, d, t); t += d; } }
  function advance(sec){ const m = M(); const h = m.dt || 1/240; let rem = sec; while(rem > 1e-12){ const d = Math.min(h, rem, dur > 0 ? dur - t : h); if(d <= 1e-12) break; m.step(P, St, d, t); t += d; rem -= d; } if(dur > 0 && t >= dur - 1e-9){ t = dur; playing = false; } }
  document.querySelectorAll(".tabs button").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $("play").addEventListener("click", () => { if(playing) playing = false; else { if(dur > 0 && t >= dur - 1e-9) resetState(); playing = true; last = null; } draw(); });
  $("reset").addEventListener("click", () => { resetState(); playing = false; draw(); });
  $("tSlider").addEventListener("input", e => { playing = false; seek(dur*(+e.target.value)/1000); draw(); });
  $("speed").addEventListener("change", e => { speed = +e.target.value; });
  window.addEventListener("hashchange", readHash);
  window.addEventListener("resize", draw);
  if(window.matchMedia){ const mq = window.matchMedia("(prefers-color-scheme: dark)"); if(mq.addEventListener) mq.addEventListener("change", draw); }
  function loop(ts){
    if(playing && M().timed){ if(last != null){ advance(Math.min((ts - last)/1000, 0.05)*speed); draw(); } last = ts; } else last = null;
    requestAnimationFrame(loop);
  }
  readHash(); requestAnimationFrame(loop);
  return {redraw:draw, get mode(){ return mode; }};
}

window.LAB = {$, f, S, V, css, prep, niceStep, arrow, label, symFont, uiFont, numFont, fit, disc, table, graph, app};
})();
