/*
 * 物理ラボ 本体（物理基礎ラボと同じエンジン）
 * 通常は編集不要です。問題は units/ フォルダの単元ファイルに書きます。
 */
(function(){
"use strict";

const KANA = "アイウエオカキクケコ";
const PREFIX = "physics-lab:";   // 物理基礎ラボ（physics-test:）と保存領域を分ける
const UNITS = {};          // 読み込み済みの単元
const loading = {};        // 読み込み中の Promise

window.registerUnit = function(u){ UNITS[u.id] = u; };

/* ---------- storage ---------- */
function load(key, fallback){
  try{ const v = JSON.parse(localStorage.getItem(PREFIX+key)); return v || fallback; }catch(e){ return fallback; }
}
function store(key, val){ try{ localStorage.setItem(PREFIX+key, JSON.stringify(val)); }catch(e){} }

/* ---------- current unit ---------- */
let unit = null, S = [], ALLQ = [], QMAP = {}, state = {a:{}}, sec = 0, numbering = {};

function scored(q){ return q.type !== "checklist" && q.scored !== false; }

function setUnit(u){
  unit = u; S = u.sections; ALLQ = []; QMAP = {};
  S.forEach(s => s.groups.forEach(g => g.qs.forEach(q => { q.sec = s.id; ALLQ.push(q); QMAP[q.id] = q; })));
  state = load("unit:"+u.id, {a:{}});
  if(!state.a) state.a = {};
}
function save(){
  store("unit:"+unit.id, state);
  const all = ALLQ.filter(scored); let d=0, o=0;
  all.forEach(q => { const st = state.a[q.id]; if(st && st.checked){ d++; if(st.correct) o++; } });
  const sum = load("summary", {}); sum[unit.id] = {done:d, ok:o, total:all.length}; store("summary", sum);
}

/* ---------- validation (for teachers adding units) ---------- */
function validate(u){
  const p = [], ids = new Set();
  if(!u.sections || !u.sections.length) return ["sections がありません。"];
  u.sections.forEach((s,si) => {
    if(!s.id) p.push(`${si+1}番目の section に id がありません。`);
    (s.groups||[]).forEach(g => (g.qs||[]).forEach(q => {
      const where = `${s.tab||s.id} の問題 ${q.id||"(id なし)"}`;
      if(!q.id) p.push(`${where}：id がありません。`);
      else if(ids.has(q.id)) p.push(`${where}：id が重複しています。`);
      ids.add(q.id);
      const t = q.type;
      if(t==="choice"){
        if(!Array.isArray(q.options)) p.push(`${where}：options がありません。`);
        else if(!(q.answer>=0 && q.answer<q.options.length)) p.push(`${where}：answer が選択肢の範囲外です（0から数えます）。`);
      } else if(t==="multi"){
        if(!Array.isArray(q.answer) || q.answer.some(a=>!(a>=0 && a<q.options.length))) p.push(`${where}：answer は選択肢番号の配列にしてください。`);
      } else if(t==="blanks"){
        const n = (q.text.match(/\{\d\}/g)||[]).length;
        if(n !== q.options.length) p.push(`${where}：空欄 {0},{1}… の数（${n}）と options の数（${q.options.length}）が違います。`);
        if(!Array.isArray(q.answer) || q.answer.length !== q.options.length) p.push(`${where}：answer の数が空欄の数と違います。`);
        else q.answer.forEach((a,i)=>{ if(!(a>=0 && a<q.options[i].length)) p.push(`${where}：${KANA[i]} の answer が範囲外です。`); });
      } else if(t==="num"){
        if(typeof q.answer!=="number" || typeof q.tol!=="number") p.push(`${where}：answer と tol は数値で書いてください。`);
      } else if(t==="self"){
        if(!q.model) p.push(`${where}：model（模範解答）がありません。`);
      } else if(t!=="checklist"){
        p.push(`${where}：type "${t}" は使えません。`);
      }
    }));
  });
  return p;
}

/* ---------- helpers ---------- */
function parseNum(str){
  if(str==null) return NaN;
  const t = String(str).replace(/[０-９．]/g, c => String.fromCharCode(c.charCodeAt(0)-0xFEE0))
    .replace(/[−ー―–—‐‑－﹣ｰ]/g,"-").replace(/[＋]/g,"+").replace(/[，,\s]/g,"");
  if(!/^[+-]?\d*\.?\d+$/.test(t)) return NaN;
  return parseFloat(t);
}
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;"); }
function markSVG(kind){
  const p = kind==="ok" ? "M46 13 C37 5 16 6 9 22 C3 38 17 53 33 52 C49 51 57 36 51 22 C49 17 45 13 40 11"
          : kind==="mid" ? "M30 8 L52 48 L8 48 Z"
          : "M10 26 L24 46 L52 8";
  return `<svg class="mark" viewBox="0 0 60 60" aria-hidden="true"><path d="${p}"/></svg>`;
}
function grade(q, st){
  const v = st.v;
  switch(q.type){
    case "choice": return v === q.answer;
    case "multi":  return Array.isArray(v) && v.slice().sort().join() === q.answer.slice().sort().join();
    case "blanks": return Array.isArray(v) && q.answer.every((a,i) => v[i] === a);
    case "num": { const n = parseNum(v); return !isNaN(n) && Math.abs(n-q.answer) <= q.tol + 1e-9; }
  }
  return false;
}
function complete(q, st){
  const v = st.v;
  if(q.type==="choice") return typeof v === "number";
  if(q.type==="multi")  return Array.isArray(v) && v.length > 0;
  if(q.type==="blanks") return Array.isArray(v) && q.options.every((_,i) => typeof v[i] === "number");
  if(q.type==="num")    return !isNaN(parseNum(v));
  return true;
}
function fmtAns(q){
  if(q.type==="choice") return q.options[q.answer];
  if(q.type==="multi")  return q.answer.map(i => q.options[i]).join("／");
  if(q.type==="blanks") return q.answer.map((a,i) => `${KANA[i]}：${q.options[i][a]}`).join("　");
  if(q.type==="num")    return `${String(q.answer).replace("-","−")} ${q.unit||""}`;
  return "";
}

/* ---------- question ---------- */
function qHTML(q){
  const no = numbering[q.id];
  const st = state.a[q.id] || {};
  const done = !!st.checked;
  let h = `<div class="q" id="q-${q.id}" data-q="${q.id}">`;
  h += `<p class="prompt"><span class="qno">問${no}</span>${q.prompt||""}</p>`;

  if(q.type==="choice" || q.type==="multi"){
    const multi = q.type==="multi";
    if(multi) h += `<p class="hint">当てはまるものをすべて選ぶ</p>`;
    h += `<div class="opts${q.two?" two":""}" role="${multi?"group":"radiogroup"}">`;
    q.options.forEach((o,i) => {
      const sel = multi ? (Array.isArray(st.v) && st.v.includes(i)) : st.v === i;
      const isAns = multi ? q.answer.includes(i) : q.answer === i;
      let cls = "opt" + (sel ? " sel" : "");
      if(done && !st.correct){ if(isAns) cls += " right"; else if(sel) cls += " wrongpick"; }
      h += `<button type="button" class="${cls}" data-act="pick" data-i="${i}" role="${multi?"checkbox":"radio"}" aria-checked="${sel}" ${done?"disabled":""}>${o}</button>`;
    });
    h += `</div>`;
  } else if(q.type==="blanks"){
    const v = st.v || [];
    const sentence = q.text.replace(/\{(\d)\}/g, (_,n) => {
      n = +n; const val = typeof v[n] === "number" ? q.options[n][v[n]] : "";
      return `<span class="bl${val?"":" empty"}" data-bl="${n}"><span class="k">${KANA[n]}</span>${val||"　　"}</span>`;
    });
    h += `<p class="sentence">${sentence}</p><div class="selects">`;
    q.options.forEach((opts,n) => {
      h += `<div class="selrow"><label for="sel-${q.id}-${n}">${KANA[n]}</label><select id="sel-${q.id}-${n}" data-act="blank" data-n="${n}" ${done?"disabled":""}>
        <option value="">選ぶ</option>${opts.map((o,i) => `<option value="${i}" ${v[n]===i?"selected":""}>${o}</option>`).join("")}</select></div>`;
    });
    h += `</div>`;
  } else if(q.type==="num"){
    h += `<div class="numrow">${done?"":`<button type="button" class="sign" data-act="sign" aria-label="正負を切り替える">±</button>`}<input type="text" inputmode="decimal" autocomplete="off" aria-label="答え" data-act="num" value="${st.v!=null?esc(st.v):""}" ${done?"disabled":""} placeholder="例 −1.5"><span class="unit">${q.unit||""}</span></div>`;
    if(!done) h += `<p class="hint" style="margin:6px 0 0">負の数は「±」ボタンで符号を切り替える</p>`;
  } else if(q.type==="self"){
    h += `<textarea data-act="text" aria-label="あなたの答え" placeholder="ここに書く">${st.v?esc(st.v):""}</textarea>`;
  } else if(q.type==="checklist"){
    const v = st.v || [];
    h += `<div class="checklist">${q.items.map((it,i) => `<label><input type="checkbox" data-act="chk" data-i="${i}" ${v.includes(i)?"checked":""}><span>${it}</span></label>`).join("")}</div>`;
  }

  if(q.type==="self"){
    if(!st.revealed){
      h += `<div class="actions"><button type="button" class="btn ghost" data-act="reveal">模範解答を見る</button></div>`;
    } else {
      h += `<div class="model"><b>模範解答</b>${q.model}</div>`;
      if(q.scored !== false){
        if(!st.checked){
          h += `<p class="hint" style="margin:10px 0 0">自分の答えと比べて、自己採点しよう。</p><div class="selfmark">
            <button type="button" data-act="self" data-s="ok">書けた</button>
            <button type="button" data-act="self" data-s="mid">半分くらい</button>
            <button type="button" data-act="self" data-s="ng">書けなかった</button></div>`;
        } else {
          const k = st.self;
          h += `<div class="fb">${markSVG(k)}<div class="fb-body"><p class="verdict">${k==="ok"?"よく書けました":k==="mid"?"もう一歩":"模範解答を写して覚えよう"}</p>
            <button type="button" class="link" data-act="retry">自己採点をやり直す</button></div></div>`;
        }
      }
    }
  } else if(q.type==="checklist"){
    /* 採点なし */
  } else if(!done){
    h += `<div class="actions"><button type="button" class="btn" data-act="check">答え合わせ</button><span class="note" aria-live="polite"></span></div>`;
  } else {
    const ok = st.correct;
    let trap = "";
    if(!ok && q.type==="num" && q.traps){
      const n = parseNum(st.v);
      for(const k in q.traps){
        const kv = parseFloat(k);
        if(Math.abs(kv-n) <= Math.max(q.tol, Math.abs(kv)*0.01)){ trap = `<span class="trap">${q.traps[k]}</span>`; break; }
      }
    }
    h += `<div class="fb">${markSVG(ok?"ok":"ng")}<div class="fb-body">
      <p class="verdict">${ok?"正解":"もう一度確認しよう"}</p>
      <p class="explain">${ok?"":`<span class="ans">正解：${fmtAns(q)}</span>`}${trap}${q.explain||""}</p>
      ${ok?"":`<button type="button" class="link" data-act="retry">もう一度解く</button>`}
    </div></div>`;
  }
  return h + `</div>`;
}

/* ---------- unit views ---------- */
function sectionStats(id){
  const qs = ALLQ.filter(q => q.sec === id && scored(q));
  let done=0, ok=0;
  qs.forEach(q => { const st = state.a[q.id]; if(st && st.checked){ done++; if(st.correct) ok++; } });
  return {total:qs.length, done, ok};
}
function unitHash(i){ return `#/u/${unit.id}/${i}`; }

function renderTabs(){
  const tabs = document.getElementById("tabs");
  const items = S.map((s,i) => { const st = sectionStats(s.id);
    return `<a class="tab" role="tab" aria-selected="${sec===i}" href="${unitHash(i)}">${s.tab}<span class="cnt">${st.done}/${st.total}</span></a>`; });
  items.push(`<a class="tab" role="tab" aria-selected="${sec===S.length}" href="${unitHash(S.length)}">結果</a>`);
  tabs.innerHTML = items.join("");
  const act = tabs.querySelector('[aria-selected="true"]'); if(act) act.scrollIntoView({block:"nearest", inline:"center"});
  const all = ALLQ.filter(scored); let d=0, o=0;
  all.forEach(q => { const st = state.a[q.id]; if(st && st.checked){ d++; if(st.correct) o++; } });
  document.getElementById("progBar").style.width = (all.length ? d/all.length*100 : 0) + "%";
  document.getElementById("scoreMini").textContent = `${o}点 ／ ${all.length}問中 ${d}問済`;
}

function pager(){
  const n = S.length;
  const prev = sec > 0 ? `<a class="btn ghost" href="${unitHash(sec-1)}">前へ：${S[sec-1].tab}</a>` : `<a class="btn ghost" href="#/">単元一覧へ</a>`;
  const next = sec < n ? `<a class="btn" href="${unitHash(sec+1)}">次へ：${sec+1<n ? S[sec+1].tab : "結果"}</a>` : `<a class="btn" href="#/">単元一覧へ</a>`;
  return `<div class="pager">${prev}${next}</div>`;
}

function renderSection(warnings){
  const main = document.getElementById("main");
  let h = "";
  if(warnings && warnings.length){
    h += `<div class="warn"><b>先生向け：単元ファイルに確認が必要な箇所があります</b><ul>${warnings.map(w=>`<li>${esc(w)}</li>`).join("")}</ul></div>`;
  }
  if(sec >= S.length){ main.innerHTML = h + resultsHTML(); renderTabs(); return; }
  const s = S[sec];
  numbering = {}; let no = 0;
  s.groups.forEach(g => g.qs.forEach(q => { numbering[q.id] = ++no; }));
  h += `<div class="sheet"><h2>${s.title}</h2>${s.intro?`<p class="intro">${s.intro}</p>`:""}`;
  if(s.ref) h += `<details class="ref"><summary>${s.ref.label}</summary>${s.ref.html}</details>`;
  s.groups.forEach(g => {
    if(g.title) h += `<h3>${g.title}</h3>`;
    if(g.lead) h += `<p class="lead">${g.lead}</p>`;
    if(g.quote) h += `<blockquote><p>${g.quote}</p></blockquote>`;
    if(g.figure) h += g.figure;
    g.qs.forEach(q => { h += qHTML(q); });
  });
  h += `</div>${pager()}`;
  main.innerHTML = h;
  renderTabs();
}

function resultsHTML(){
  const all = ALLQ.filter(scored); let d=0, o=0;
  all.forEach(q => { const st = state.a[q.id]; if(st && st.checked){ d++; if(st.correct) o++; } });
  let h = `<div class="sheet"><h2>結果</h2>`;
  h += `<p class="big">${o} ／ ${all.length}</p><p class="intro">${d<all.length ? `まだ答え合わせをしていない問題が ${all.length-d} 問あります。` : "すべての問題に答えました。"}</p>`;
  const advice = [];
  S.forEach((s,i) => {
    const st = sectionStats(s.id); const pct = st.total ? st.ok/st.total*100 : 0;
    h += `<div class="res-row"><span>${s.tab}</span><div class="bar"><span style="width:${pct}%"></span></div><span class="n">${st.ok}/${st.total}</span></div>`;
    if(st.done > 0 && st.ok/st.done < 0.7) advice.push({i, text:`${s.title}の正答率が低めです。${s.advice||""}`});
  });
  if(advice.length){
    h += `<h3>戻って復習しよう</h3><ul class="advice">${advice.map(a => `<li>${a.text} <a class="link" href="${unitHash(a.i)}">${S[a.i].tab}へ</a></li>`).join("")}</ul>`;
  } else if(d > 0){
    h += `<h3>ふり返り</h3><p>答え合わせをした範囲では、どの層もよくできています。間違えた問題があれば、「もう一度解く」で解き直しておこう。</p>`;
  }
  h += `<h3>最初からやり直す</h3><p class="lead">この単元の答えをすべて消去します。</p><div class="actions"><button type="button" class="btn ghost" data-act="reset">答えをすべて消去</button></div>`;
  h += `<p class="foot">答えはこの端末のブラウザにだけ保存されます。</p></div>${pager()}`;
  return h;
}

function rerenderQ(id){
  const el = document.getElementById("q-"+id); if(!el) return;
  el.outerHTML = qHTML(QMAP[id]);
  renderTabs();
}

/* ---------- menu ---------- */
function renderMenu(){
  document.body.classList.remove("in-unit");
  document.getElementById("unitBar").hidden = true;
  document.getElementById("scoreMini").textContent = "";
  document.title = "物理ラボ";
  const sum = load("summary", {});
  let h = `<div class="sheet menu"><h2>単元を選ぶ</h2>
    <p class="intro"><b>物理ラボ</b>（高3・物理）：見て、動かして、解いて確かめる。▶ のページはシミュレーター、そのほかは演習（Webテスト）です。<br>どの単元も「①定義 → ②読解 → ③次元 → ④手順 → まとめ」の順に進みます。<span class="calc-tag">微積</span> の問題は数学Ⅲの微分・積分を使う見方、<span class="nocalc-tag">微積なし</span> は教科書と同じ微積を使わない見方です。両方で説明できるようにしよう。答えはこの端末に保存されるので、途中でやめても続きから解けます。</p>`;
  (window.UNIT_LIST || []).forEach(g => {
    h += `<h3>${g.group}</h3><ul class="units">`;
    g.units.forEach(u => {
      if(u.href){   // 単元ではないページ（アニメーション集など）へのボタン
        h += `<li><a class="unit link" href="${u.href}"><span class="ut">${u.title}</span>${u.note ? `<span class="us">${u.note}</span>` : ""}</a></li>`;
        return;
      }
      if(!u.file){
        h += `<li><div class="unit soon" aria-disabled="true"><span class="ut">${u.title}</span><span class="us">準備中</span></div></li>`;
        return;
      }
      const s = sum[u.id];
      const status = s && s.done
        ? `<span class="bar"><span style="width:${s.total? s.done/s.total*100 : 0}%"></span></span>${s.done}/${s.total}問済・${s.ok}点`
        : `まだ解いていません`;
      h += `<li><a class="unit" href="#/u/${u.id}/0"><span class="ut">${u.title}</span><span class="us">${status}</span></a></li>`;
    });
    h += `</ul>`;
  });
  h += `</div>`;
  document.getElementById("main").innerHTML = h;
}

/* ---------- loading & routing ---------- */
function findEntry(id){
  for(const g of (window.UNIT_LIST||[])) for(const u of g.units) if(u.id === id) return u;
  return null;
}
function loadUnit(entry){
  if(UNITS[entry.id]) return Promise.resolve(UNITS[entry.id]);
  if(loading[entry.id]) return loading[entry.id];
  loading[entry.id] = new Promise((resolve, reject) => {
    const sc = document.createElement("script");
    sc.src = entry.file;
    sc.onload = () => UNITS[entry.id] ? resolve(UNITS[entry.id])
      : reject(`${entry.file} は読み込めましたが、registerUnit の id が "${entry.id}" になっていません。`);
    sc.onerror = () => reject(`${entry.file} が見つかりません。units/index.js の file のパスとファイル名を確認してください。`);
    document.head.appendChild(sc);
  });
  loading[entry.id].catch(() => { delete loading[entry.id]; });
  return loading[entry.id];
}
function showError(msg){
  document.getElementById("main").innerHTML = `<div class="sheet"><h2>単元を開けませんでした</h2><p class="err">${esc(msg)}</p><p><a class="btn ghost" href="#/">単元一覧へ</a></p></div>`;
}

const warned = {};
function route(){
  const m = location.hash.match(/^#\/u\/([\w-]+)(?:\/(\d+))?/);
  if(!m){ renderMenu(); window.scrollTo(0,0); return; }
  const entry = findEntry(m[1]);
  if(!entry || !entry.file){ showError(`単元「${m[1]}」は units/index.js に登録されていないか、準備中です。`); return; }
  loadUnit(entry).then(u => {
    if(unit !== u) setUnit(u);
    sec = Math.min(parseInt(m[2]||"0",10), S.length);
    document.body.classList.add("in-unit");
    document.getElementById("unitBar").hidden = false;
    document.getElementById("homeLink").textContent = "‹ 単元一覧";
    document.getElementById("unitTitle").textContent = u.title || entry.title;
    document.title = `${u.title || entry.title}｜物理ラボ`;
    let w = null;
    if(!warned[u.id]){ w = validate(u); warned[u.id] = true; }
    renderSection(w);
    window.scrollTo(0,0);
  }).catch(showError);
}
window.addEventListener("hashchange", () => {
  if(!/^#\/u\//.test(location.hash)) document.getElementById("homeLink").textContent = "物理ラボ";
  route();
});

/* ---------- events ---------- */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if(!b || !unit) return;
  const act = b.dataset.act;
  if(act === "reset"){
    if(b.dataset.armed){ state = {a:{}}; save(); location.hash = unitHash(0); }
    else { b.dataset.armed = "1"; b.textContent = "もう一度押すと消去します"; }
    return;
  }
  const qel = b.closest("[data-q]"); if(!qel) return;
  const id = qel.dataset.q, q = QMAP[id]; const st = state.a[id] = state.a[id] || {};
  if(act === "pick"){
    const i = +b.dataset.i;
    if(q.type === "multi"){ st.v = Array.isArray(st.v) ? st.v : []; st.v = st.v.includes(i) ? st.v.filter(x => x !== i) : st.v.concat(i); }
    else st.v = i;
    save(); rerenderQ(id);
    const nb = document.querySelector(`#q-${id} [data-act="pick"][data-i="${i}"]`); if(nb) nb.focus();
  } else if(act === "sign"){
    const inp = qel.querySelector('[data-act="num"]');
    let v = (inp.value || "").trim().replace(/^[−ー―–—‐‑－﹣ｰ]/,"-");
    v = v.startsWith("-") ? v.slice(1) : (v.startsWith("+") ? "-" + v.slice(1) : "-" + v);
    inp.value = v; st.v = v; save();
    const n = qel.querySelector(".note"); if(n) n.textContent = "";
  } else if(act === "check"){
    if(!complete(q, st)){ const n = qel.querySelector(".note"); if(n) n.textContent = q.type==="num" ? "数値を入力してください" : "すべて選んでから答え合わせしよう"; return; }
    st.checked = true; st.correct = grade(q, st); save(); rerenderQ(id);
  } else if(act === "retry"){
    st.checked = false; st.correct = false; delete st.self; save(); rerenderQ(id);
  } else if(act === "reveal"){
    st.revealed = true; save(); rerenderQ(id);
  } else if(act === "self"){
    st.self = b.dataset.s; st.checked = true; st.correct = st.self === "ok"; save(); rerenderQ(id);
  }
});
document.addEventListener("change", e => {
  const t = e.target; const qel = t.closest("[data-q]"); if(!qel || !unit) return;
  const id = qel.dataset.q, q = QMAP[id]; const st = state.a[id] = state.a[id] || {};
  if(t.dataset.act === "blank"){
    const n = +t.dataset.n; st.v = Array.isArray(st.v) ? st.v : [];
    st.v[n] = t.value === "" ? null : +t.value; save();
    const bl = qel.querySelector(`[data-bl="${n}"]`);
    if(bl){ const val = t.value === "" ? "" : q.options[n][+t.value]; bl.classList.toggle("empty", !val); bl.innerHTML = `<span class="k">${KANA[n]}</span>${val||"　　"}`; }
  } else if(t.dataset.act === "chk"){
    const i = +t.dataset.i; st.v = Array.isArray(st.v) ? st.v : [];
    st.v = t.checked ? st.v.concat(i) : st.v.filter(x => x !== i); save();
  }
});
document.addEventListener("input", e => {
  const t = e.target; if(!unit || (t.dataset.act !== "num" && t.dataset.act !== "text")) return;
  const qel = t.closest("[data-q]"); const id = qel.dataset.q;
  const st = state.a[id] = state.a[id] || {}; st.v = t.value; save();
  const n = qel.querySelector(".note"); if(n) n.textContent = "";
});
document.addEventListener("keydown", e => {
  if(e.key === "Enter" && e.target.dataset && e.target.dataset.act === "num"){
    const btn = e.target.closest("[data-q]").querySelector('[data-act="check"]'); if(btn){ e.preventDefault(); btn.click(); }
  }
});

if(window.ITALIC) window.ITALIC.auto("qv", document.getElementById("main"));   // 本文中の物理量の文字を自動でイタリックに（js/italic.js）
route();
})();
