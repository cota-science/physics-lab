/*
 * 表記の自動整形：本文中に直接書かれた物理量の文字（m, a, g, T, θ, mg, ma …）をイタリックにする。
 *   ITALIC.run(root, "s")   root の下のテキストを整形（"s" は付けるクラス名：ラボは s、単元は qv）
 * 規則：物理量＝イタリック。単位（数値のあとの m, s, N, J …、〔m/s²〕、kg・Hz など）・sin/cos/tan・微分の d・π・Δ・
 *       点や粒子の名前（A, B, O, P …）・英単語はそのまま。既に <i>・.s・.va・.qv などの中にある文字は触らない。
 */
(function(){
"use strict";
const UNITS = new Set("m s g N J W V A C K T Hz kg cm mm km mol Pa rad min h ms Wb H F Ω".split(" "));
const MULTI = new Set("kg Hz cm mm km mol Pa rad ms Wb min eV".split(" "));
const KEEP = new Set("sin cos tan cot sec csc lim log ln exp max min deg arcsin arccos arctan sinh cosh tanh const".split(" "));
const UPPER = new Set("F T L E R M N I U K V S W".split(" "));
const GREEK = new Set("θφωαβγδελμρστηκνξζψϕ".split(""));
const SKIP = "i,em,.s,.va,.vb,.qv,.qb,.qu,.keep,script,style,input,textarea,select,option,code,pre,svg,canvas,sub.keep";
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
          if(w === "d"){ const nx = text.slice(j).match(/^\s*[＝=]/); italic = !!nx; }
          else italic = true;
        } else italic = UPPER.has(w) && !/点\s?$/.test(before) && !/^\s?点/.test(text.slice(j, j + 2)) && !/[A-Z][・、,]\s?$/.test(before) && !/^[・、,]\s?[A-Z](?![A-Za-z])/.test(text.slice(j, j + 3));
      } else {
        // 2〜4字
        if(/^(GM|RT)$/.test(w)) italic = true;
        else if(/^[A-Z]+$/.test(w)) italic = false;                       // AB など（点・粒子の名前）
        else if(/^d[txyzvrm]$/.test(w)){ out += text.slice(last, i) + "d" + `<i class="@">${w[1]}</i>`; last = j; changed = true; prevUnit = false; prevEnd = j; continue; }
        else italic = /^[mgakvtxyhrlnfpqe]+$/.test(w) || (/[a-z]/.test(w) && /[A-Z]/.test(w) && /^[mgakvtxyhrlnfpqeGMRTVUFELIKS]+$/.test(w));
      }
    } else {
      // ギリシャ文字の連なり
      italic = [...w].every(c => GREEK.has(c)) && !(w.length === 1 && w === "μ" && prevNum);
    }
    prevUnit = unit; prevEnd = j;
    if(italic){ out += text.slice(last, i) + `<i class="@">${w}</i>`; last = j; changed = true; }
  }
  if(!changed) return null;
  return out + text.slice(last);
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
    const h = convert(n.nodeValue);
    if(h == null) continue;
    const span = document.createElement("span");
    span.className = "keep";
    span.innerHTML = h.replace(/class="@"/g, `class="${cls}" data-auto="1"`);
    n.replaceWith(...span.childNodes); k++;
  }
  return k;
}
function scan(root){ return nodes(root).map(n => [n.nodeValue.trim().slice(0, 60), convert(n.nodeValue)]).filter(x => x[1]); }
/* ページ全体を監視して、書きかわるたびに整形する（古い単独ページ用） */
function auto(cls, root){
  root = root || document.body; let pend = false;
  const obs = new MutationObserver(() => { if(pend) return; pend = true; requestAnimationFrame(() => { pend = false; obs.disconnect(); run(root, cls); obs.observe(root, {childList:true, subtree:true, characterData:true}); }); });
  run(root, cls); obs.observe(root, {childList:true, subtree:true, characterData:true});
}
window.ITALIC = {run, scan, convert, auto};
})();
