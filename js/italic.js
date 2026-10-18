/*
 * 表記の自動整形：本文中に直接書かれた物理量の文字（m, a, g, T, θ, mg, ma …）をイタリックにする。
 *   ITALIC.run(root, "s")   root の下のテキストを整形（"s" は付けるクラス名：ラボは s、単元は qv）
 * 規則：物理量＝イタリック。単位（数値のあとの m, s, N, J …、〔m/s²〕、kg・Hz など）・sin/cos/tan・微分の d・π・Δ・
 *       点や粒子の名前（A, B, O, P …）・英単語はそのまま。既に <i>・.s・.va・.qv などの中にある文字は触らない。
 */
(function(){
"use strict";
const UNITS = new Set("m s g N J W V A C K T Hz kg cm mm km mol Pa L rad min h ms Wb H F Ω".split(" "));
const MULTI = new Set("kg Hz cm mm km mol Pa rad ms Wb min eV".split(" "));
const KEEP = new Set("sin cos tan cot sec csc lim log ln exp max min deg arcsin arccos arctan sinh cosh tanh const".split(" "));
const UPPER = new Set("F T L E R M N I U K V S W".split(" "));
const GREEK = new Set("θφωαβγδελμρστηκνξζψϕ".split(""));
const SKIP = "i,em,.s,.va,.vb,.qv,.qb,.qu,.keep,script,style,input,textarea,select,option,code,pre,svg,canvas,sub.keep";
const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const unesc = t => t.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
function convert(text){
  if(/^\s*[A-Z]\s*$/.test(text)) return null;                      // 選択肢の点名・粒子名だけのテキスト
  if(/^\s*(?:N|J|W|m|s|kg|Hz|Pa|V|A|C|K|N·m|N·s|m\/s|m\/s²|kg·m\/s)\s*$/.test(text)) return null;
  // 戻り値：変更があれば HTML 文字列、なければ null
  let out = "", last = 0, changed = false, prevUnit = false, prevEnd = -1;
  const prot = [];                                       // 単位・次元の式（〔m/s²〕、kg·m/s² など）はそのまま
  for(const r of [/(?<=単位は\s?)[A-Za-z]+(?:\s?[×÷]\s?[A-Za-z]+)*/g, /\([a-eA-E]\)/g, /(?<![A-Za-z])[NJWV](?=\s*[＝=]\s*(?:kg|N|J|[mA]))/g, /(?<=[×÷]\s)[A-Za-z]{1,2}(?=[」）])/g, /(?<![A-Za-z])[NJWmsg](?=\s*で入力)/g, /〔[^〕]*〕/g, /(?<![A-Za-z])(?:kg|Hz|Pa|[mNJWsgVACK])[²³⁻¹]*(?:[·/](?:kg|Hz|Pa|[mNJWsgVACK])[²³⁻¹]*)+/g]){
    let q; while((q = r.exec(text))) prot.push([q.index, q.index + q[0].length]);
  }
  const inProt = k => prot.some(a => k >= a[0] && k < a[1]);
  const re = /[A-Za-zθφωαβγδελμρστηκνξζψϕ]+/g; let m;
  while((m = re.exec(text))){
    const w = m[0], i = m.index, j = i + w.length;
    const before = text.slice(Math.max(0, i - 3), i), ch = before.slice(-1);
    if(/^[0-9]/.test(text.slice(j, j + 1)) && /^[A-Za-z]+$/.test(w) && w.length > 1){ continue; }   // ra3 のような問題番号
    if(/何\s?$/.test(before) && UNITS.has(w)){ prevUnit = true; prevEnd = j; continue; }
    if(inProt(i)){ prevUnit = true; prevEnd = j; continue; }
    const prevNum = /[\d.)⁰¹²³⁴⁵⁶⁷⁸⁹⁻][\s\u2009]?$/.test(before) || /\d\/$/.test(before);
    const inBr = /[〔\[（(][\s]?$/.test(before) && /^[\s]?[〕\]）)]/.test(text.slice(j, j + 2)) ;
    const gap = text.slice(prevEnd < 0 ? 0 : prevEnd, i), linked = prevUnit && prevEnd >= 0 && /^[²³⁻¹]*(?:[/·・]|\s?[×÷]\s?)$/.test(gap);
    let italic = false, unit = false;
    if(/^[A-Za-z]+$/.test(w)){
      if(KEEP.has(w) || w.length > 4) italic = false;
      else if(MULTI.has(w)) { italic = false; unit = true; }
      else if(w.length === 1 && UNITS.has(w) && (prevNum || linked || inBr && /〔|\[/.test(before))){ italic = false; unit = true; }
      else if(w.length === 1){
        if(/[a-z]/.test(w)){
          if(w === "d"){ const nx = text.slice(j).match(/^(?:\s*[＝=]|-t)/); italic = !!nx; }
          else italic = true;
        } else italic = (UPPER.has(w) || (w === "A" && /[+＋−-]$/.test(before))) && !/点\s?$/.test(before) && !/^\s?点/.test(text.slice(j, j + 2)) && !/[A-Z][・、,]\s?$/.test(before) && !/^[・、,]\s?[A-Z](?![A-Za-z])/.test(text.slice(j, j + 3));
      } else {
        // 2〜4字
        if(/^[NTFfWS][AB]$/.test(w)){ out += esc(text.slice(last, i)) + `<span class="@">${w[0]}</span>${w[1]}`; last = j; changed = true; prevUnit = false; prevEnd = j; continue; }
        else if(/^(GM|RT)$/.test(w)) italic = true;
        else if(/^[A-Z]+$/.test(w)) italic = false;                       // AB など（点・粒子の名前）
        else if(/^d[txyzvrm]$/.test(w)){ out += esc(text.slice(last, i)) + "d" + `<span class="@">${w[1]}</span>`; last = j; changed = true; prevUnit = false; prevEnd = j; continue; }
        else italic = /^[mgakvtxyhrlnfpqe]+$/.test(w) || (/[a-z]/.test(w) && /[A-Z]/.test(w) && /^[mgakvtxyhrlnfpqeGMRTVUFELIKS]+$/.test(w));
      }
    } else {
      // ギリシャ文字の連なり
      italic = [...w].every(c => GREEK.has(c)) && !(w.length === 1 && w === "μ" && prevNum);
    }
    prevUnit = unit; prevEnd = j;
    if(italic){ out += esc(text.slice(last, i)) + `<span class="@">${w}</span>`; last = j; changed = true; }
  }
  if(!changed) return null;
  return out + esc(text.slice(last));
}
/* v_B のような添字（_ のあと）は <sub> にして、残りの部分を convert する */
function convertAll(text){
  if(!/[A-Za-zθφωαβγδελμρστ]_[A-Za-z0-9′']/.test(text)) return convert(text);
  let any = false;
  const out = text.split(/(?<=[A-Za-zθφωαβγδελμρστ′'])(_[A-Za-z0-9′']+)/).map(part => {
    if(/^_[A-Za-z0-9′']+$/.test(part)){ any = true; return `<sub>${part.slice(1)}</sub>`; }
    const h = convert(part); if(h != null) any = true; return h == null ? esc(part) : h;
  }).join("");
  return any ? out : null;
}
function nodes(root){
  const res = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while((n = w.nextNode())){
    const p = n.parentElement;
    if(!p || p.closest(SKIP) || !/[A-Za-zθφωαβγδελμρστηκνξζψϕ]/.test(n.nodeValue)) continue;
    res.push(n);
  }
  return res;
}
function run(root, cls){
  if(!root) return 0;
  let k = 0;
  for(const n of nodes(root)){
    const h = convertAll(n.nodeValue);
    if(h == null) continue;
    const span = document.createElement("span");
    span.className = "keep";
    span.innerHTML = h.replace(/class="@"/g, `class="${cls}" data-auto="1"`);
    n.replaceWith(span); k++;   // 1つの要素にまとめる（親が flex でも文が1つの塊のままになる）
  }
  return k;
}
function scan(root){ return nodes(root).map(n => [n.nodeValue.trim().slice(0, 60), convertAll(n.nodeValue)]).filter(x => x[1]); }
/* キャンバスの文字：通常フォントで描く文字列の中の物理量だけをイタリックで描きわける（図中の x-t〔m〕, S 5.87 N, a ＝ 3.0 m/s² など）。
   ctx.font が最初から italic のとき（記号そのものを描く呼び出し）は何もしない。 */
const segCache = new Map();
function segs(text){
  if(segCache.has(text)) return segCache.get(text);
  let r = null;
  const h = convert(text);
  if(h != null){
    r = []; const re = /<span class="@">([^<]*)<\/span>/g; let last = 0, m;
    while((m = re.exec(h))){ if(m.index > last) r.push([unesc(h.slice(last, m.index)), false]); r.push([unesc(m[1]), true]); last = m.index + m[0].length; }
    if(last < h.length) r.push([unesc(h.slice(last)), false]);
  }
  if(segCache.size > 3000) segCache.clear();
  segCache.set(text, r); return r;
}
function patchCanvas(){
  if(typeof CanvasRenderingContext2D === "undefined" || CanvasRenderingContext2D.prototype.__italic) return;
  const P = CanvasRenderingContext2D.prototype;
  for(const fn of ["fillText", "strokeText"]){
    const orig = P[fn];
    P[fn] = function(text, x, y, mw){
      const t = String(text), f0 = this.font;
      if(!/[A-Za-zθφωαβγδελμρστηκνξζψϕ]/.test(t) || /italic|oblique/.test(f0)) return orig.call(this, text, x, y, mw);
      let sg = [];
      t.split(/(_[A-Za-z0-9′']+)/).forEach(part => {
        if(/^_[A-Za-z0-9′']+$/.test(part)) sg.push([part.slice(1), "s"]);
        else if(part){ const g = segs(part); if(g) g.forEach(x => sg.push([x[0], x[1] ? "i" : "r"])); else sg.push([part, "r"]); }
      });
      if(sg.length === 1 && sg[0][1] === "r") return orig.call(this, text, x, y, mw);
      const al = this.textAlign, base = f0.replace(/\b(normal|italic|oblique)\s+/, ""), px = +(base.match(/([\d.]+)px/) || [0, 12])[1];
      const fo = st => st === "i" ? "italic " + base : st === "s" ? base.replace(/[\d.]+px/, (px*0.75).toFixed(1) + "px") : base;
      const ws = sg.map(([str, st]) => { this.font = fo(st); return this.measureText(str).width; });
      const tot = ws.reduce((a, b) => a + b, 0);
      let cx = al === "center" ? x - tot/2 : (al === "right" || al === "end") ? x - tot : x;
      this.textAlign = "left";
      sg.forEach(([str, st], k) => { this.font = fo(st); orig.call(this, str, cx, st === "s" ? y + px*0.25 : y); cx += ws[k]; });
      this.textAlign = al; this.font = f0;
    };
  }
  P.__italic = true;
}
patchCanvas();

/* ページ全体を監視して、書きかわるたびに整形する（古い単独ページ用） */
function auto(cls, root){
  root = root || document.body; let pend = false;
  const obs = new MutationObserver(() => { if(pend) return; pend = true; requestAnimationFrame(() => { pend = false; obs.disconnect(); run(root, cls); obs.observe(root, {childList:true, subtree:true, characterData:true}); }); });
  run(root, cls); obs.observe(root, {childList:true, subtree:true, characterData:true});
}
window.ITALIC = {run, scan, convert, auto};
})();
