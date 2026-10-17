/*
 * 単元ファイル用の共通部品（index.html で app.js の前に読み込む）
 *   const {Q, B, d, CALC, NOCALC, BASIC, ANIM, GLOS, DERIVE2, TF} = window.KIT;
 * units/plane.js・rigid.js は同じ部品を各ファイルの中に持っている（古い書き方）。単元3以降はこれを使う。
 */
(function(){
"use strict";
if(typeof document !== "undefined" && !document.getElementById("notation-style")){
  const st = document.createElement("style");
  st.id = "notation-style";
  st.textContent = '.qv{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-size:1.1em;padding:0 .04em}'
                 + '.qb{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-weight:700;font-size:1.1em;padding:0 .04em}'
                 + '.qu{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:normal;font-size:1.1em}';
  document.head.appendChild(st);
}
const Q = s => `<i class='qv'>${s}</i>`;                       // 物理量（斜体）
const B = s => `<b class='qb'>${s}</b>`;                       // ベクトル（太字斜体）
const d = (a, b) => `<span style='display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.92em;line-height:1.15;margin:0 2px'><span style='border-bottom:1px solid currentColor;padding:0 2px'>${a}</span><span>${b}</span></span>`;
const CALC = `<span class='calc-tag'>微積</span>`;
const NOCALC = `<span class='nocalc-tag'>微積なし</span>`;
const BASIC = `<span style='display:inline-block;font-size:12px;font-weight:700;color:var(--muted);border:1px dashed var(--muted);border-radius:4px;padding:0 5px;margin-left:4px;vertical-align:1px'>物理基礎の復習</span>`;
const BASICLAB = "https://cota-science.github.io/basicphysics-review/";
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
/* 定義カード：groups = [{title, rows:[[用語, 定義, 式], ...]}] */
const GLOS = (id, groups) => `<p style='margin:4px 0;font-size:14px;color:var(--muted)'>小単元をタップすると開きます。</p>` + groups.map((gr, i) => `<details name='glos-${id}' ${i ? "" : "open"} style='margin:6px 0;border:1px solid var(--line);border-radius:6px;padding:2px 10px'>
<summary style='cursor:pointer;font-weight:700;padding:6px 0'>${gr.title}<span style='font-weight:400;color:var(--muted);font-size:13px'>（${gr.rows.length}語）</span></summary>
<div class="tbl"><table><colgroup><col style="width:7.2em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
${gr.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}${r[2] ? `<br><span style='color:var(--blue);font-weight:700'>${r[2]}</span>` : ""}</td></tr>`).join("\n")}
</table></div></details>`).join("\n");
/* 2通りの導出：title, nocalc = {h, ps:[...]}, calc = {h, ps:[...]}, note */
const DERIVE2 = (title, nocalc, calc, note) => `<h4 style='margin:14px 0 4px'>${title}</h4>
<div class="derive">
<div><h4>${NOCALC} ${nocalc.h}</h4>${nocalc.ps.map(p => `<p>${p}</p>`).join("")}</div>
<div><h4>${CALC} ${calc.h}</h4>${calc.ps.map(p => `<p>${p}</p>`).join("")}</div>
</div>${note ? `<p style='font-size:14px;color:var(--muted);margin:4px 0'>${note}</p>` : ""}`;
const TF = ["正しい", "誤り"];
window.KIT = {Q, B, d, CALC, NOCALC, BASIC, BASICLAB, ANIM, GLOS, DERIVE2, TF};
})();
