/*
 * 物理ラボ　単元1：平面内の運動
 * 学習指導要領「物理」(1)様々な運動 (ア)平面内の運動と剛体のつり合い ㋐曲線運動の速度と加速度 ㋑斜方投射
 * このファイルは js/index.js の file に "units/plane.js" と書くと読み込まれます。
 * 微積（数学Ⅲ）を使う見方には CALC、使わない見方には NOCALC のタグを付けて併記する。
 */
(function(){

/* 物理量（斜体）の表示用スタイル */
if(typeof document !== "undefined" && !document.getElementById("notation-style")){
  const st = document.createElement("style");
  st.id = "notation-style";
  st.textContent = '.qv{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-size:1.1em;padding:0 .04em}'
                 + '.qb{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-weight:700;font-size:1.1em;padding:0 .04em}'
                 + '.qu{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:normal;font-size:1.1em}';
  document.head.appendChild(st);
}

const Q = s => `<i class='qv'>${s}</i>`;
const B = s => `<b class='qb'>${s}</b>`;          // ベクトル（太字斜体）
const v0 = `${Q("v")}₀`, vx = `${Q("v")}<sub>x</sub>`, vy = `${Q("v")}<sub>y</sub>`;
const vAB = `${B("v")}<sub>AB</sub>`, vA = `${B("v")}<sub>A</sub>`, vB = `${B("v")}<sub>B</sub>`;
const th = Q("θ"), g = Q("g"), t = Q("t"), x = Q("x"), y = Q("y");
const d = (a, b) => `<span style='display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.92em;line-height:1.15;margin:0 2px'><span style='border-bottom:1px solid currentColor;padding:0 2px'>${a}</span><span>${b}</span></span>`;
const CALC = `<span class='calc-tag'>微積</span>`;
const NOCALC = `<span class='nocalc-tag'>微積なし</span>`;
const BASIC = `<span style='display:inline-block;font-size:12px;font-weight:700;color:var(--muted);border:1px dashed var(--muted);border-radius:4px;padding:0 5px;margin-left:4px;vertical-align:1px'>物理基礎の復習</span>`;
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const BASICLAB = "https://cota-science.github.io/basicphysics-review/";
const GLOS = (id, groups) => groups.map((gr, i) => `<details name='glos-${id}' ${i ? "" : "open"} style='margin:6px 0;border:1px solid var(--line);border-radius:6px;padding:2px 10px'>
<summary style='cursor:pointer;font-weight:700;padding:6px 0'>${gr.title}<span style='font-weight:400;color:var(--muted);font-size:13px'>（${gr.rows.length}語）</span></summary>
<div class="tbl"><table><colgroup><col style="width:7.2em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
${gr.rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}${r[2] ? `<br><span style='color:var(--blue);font-weight:700'>${r[2]}</span>` : ""}</td></tr>`).join("\n")}
</table></div></details>`).join("\n");

const DEF_TABLE = `<p style='margin:4px 0;font-size:14px;color:var(--muted)'>小単元をタップすると開きます。太字の斜体（${B("r")}, ${B("v")}, ${B("a")}）はベクトルを表します。</p>` + GLOS("plane", [
{ title:"1 位置・速度・加速度（ベクトル）", rows:[
  ["位置ベクトル","原点から物体の位置へ引いた矢印",`${B("r")} ＝ (${x}, ${y})〔m〕`],
  ["変位","位置の変化。始めの位置から終わりの位置へ引いた矢印（道のりとは違う）",`Δ${B("r")} ＝ ${B("r")}₂ − ${B("r")}₁`],
  ["平均の速度","変位を、かかった時間で割ったもの。向きは変位の向き",`<b class='qb' style='text-decoration:overline'>v</b> ＝ ${d("Δ"+B("r"),"Δ"+t)}`],
  ["速度（瞬間の速度）","Δ" + t + " を限りなく 0 に近づけたときの平均の速度。向きは軌道の接線方向",`${B("v")} ＝ ${d("d"+B("r"),"d"+t)} ＝ (${d("d"+x,"d"+t)}, ${d("d"+y,"d"+t)}) ＝ (${vx}, ${vy})　${CALC}`],
  ["速さ","速度の大きさ",`${Q("v")} ＝ |${B("v")}| ＝ √(${vx}² ＋ ${vy}²)〔m/s〕`],
  ["加速度","単位時間あたりの速度の変化。速さが一定でも、速度の向きが変われば加速度がある",`${B("a")} ＝ ${d("d"+B("v"),"d"+t)} ＝ (${d("d"+vx,"d"+t)}, ${d("d"+vy,"d"+t)})〔m/s²〕　${CALC}`]
]},
{ title:"2 速度の合成と相対速度" + BASIC, rows:[
  ["速度の合成","動くもの（水・電車）に対する速度と、そのもの自身の速度を、矢印として足し合わせる",`${B("v")} ＝ ${B("v")}₁ ＋ ${B("v")}₂（平行四辺形の規則）`],
  ["相対速度","A から見た B の速度（A に対する B の相対速度）。見ている人の速度を引く",`${vAB} ＝ ${vB} − ${vA}`],
  ["相対加速度","A から見た B の加速度。相対速度の変化の割合で、見ている人の加速度を引く（合成なら足す）",`${B("a")}<sub>AB</sub> ＝ ${B("a")}<sub>B</sub> − ${B("a")}<sub>A</sub> ＝ ${d("d"+vAB,"d"+t)}　${CALC}`]
]},
{ title:"3 放物運動", rows:[
  ["運動の独立性","水平方向と鉛直方向の運動は互いに影響しないので、別々に考えられる","水平：等速直線運動　鉛直：加速度 −" + g + " の等加速度運動"],
  ["加速度","投げ出された物体は重力だけを受けるので、加速度は運動中ずっと一定",`${B("a")} ＝ (0, −${g})（${y} 軸は鉛直上向き）`],
  ["斜方投射","水平と角 " + th + " をなす斜め上向きに、速さ " + v0 + " で投げ出した運動",`${x} ＝ ${v0} cos ${th}・${t}　　${y} ＝ ${v0} sin ${th}・${t} − ½${g}${t}²`],
  ["軌道の式",t + " を消去して、" + y + " を " + x + " で表した式。" + x + " の2次関数なので軌道は放物線",`${y} ＝ (tan ${th})${x} − ${d(g, "2"+v0+"² cos² "+th)}${x}²`],
  ["最高点","速度の鉛直成分が 0 になる点。速度の水平成分 " + v0 + " cos " + th + " は残っている",`${Q("t")}<sub>1</sub> ＝ ${d(v0+" sin "+th, g)}、${Q("H")} ＝ ${d(v0+"² sin² "+th, "2"+g)}`],
  ["水平到達距離","投げた点と同じ高さにもどるまでに水平に進む距離。" + th + " ＝ 45° で最大",`${Q("R")} ＝ ${d(v0+"² sin 2"+th, g)}`]
]}]);

/* 導出の2列比較（微積なし／微積） */
const DERIVE = `<h4 style='margin:14px 0 4px'>斜方投射の式を2通りで導く</h4>
<div class="derive">
<div><h4>${NOCALC} グラフの傾きと面積で</h4>
<p>① 加速度は (0, −${g}) で一定 → 水平は等速、鉛直は等加速度。</p>
<p>② 鉛直方向の ${vy}-${t} 図は、切片 ${v0} sin ${th}、傾き −${g} の直線：${vy} ＝ ${v0} sin ${th} − ${g}${t}</p>
<p>③ ${vy}-${t} 図の面積（台形）＝ 変位 ${y}：${y} ＝ ${v0} sin ${th}・${t} − ½${g}${t}²</p>
<p>④ 最高点は ${vy} ＝ 0（グラフが ${t} 軸と交わる点）。</p></div>
<div><h4>${CALC} 加速度を積分して</h4>
<p>① ${d("d"+vx,"d"+t)} ＝ 0、${d("d"+vy,"d"+t)} ＝ −${g}</p>
<p>② ${t} で積分：${vx} ＝ ${Q("C")}₁、${vy} ＝ −${g}${t} ＋ ${Q("C")}₂。${t} ＝ 0 の初速度から ${Q("C")}₁ ＝ ${v0} cos ${th}、${Q("C")}₂ ＝ ${v0} sin ${th}</p>
<p>③ もう一度積分（${t} ＝ 0 で原点）：${x} ＝ ${v0} cos ${th}・${t}、${y} ＝ ${v0} sin ${th}・${t} − ½${g}${t}²</p>
<p>④ 最高点は ${d("d"+y,"d"+t)} ＝ 0。軌道の式では ${d("d"+y,"d"+x)} ＝ 0（接線が水平）。</p></div>
</div>
<p style='font-size:14px;color:var(--muted);margin:4px 0'>どちらも同じ式になる。微積の積分定数は「${t} ＝ 0 のときの値（初期条件）」で決まり、微積なしではそれがグラフの切片にあたる。</p>`;

const FORMULAS = `<p class="formula">速度：${B("v")} ＝ ${d("d"+B("r"),"d"+t)}　加速度：${B("a")} ＝ ${d("d"+B("v"),"d"+t)}　相対速度：${vAB} ＝ ${vB} − ${vA}</p>
<p class="formula">斜方投射（上向き正）：${vx} ＝ ${v0} cos ${th}、${vy} ＝ ${v0} sin ${th} − ${g}${t}</p>
<p class="formula">${x} ＝ ${v0} cos ${th}・${t}、${y} ＝ ${v0} sin ${th}・${t} − ½${g}${t}²</p>
<p class="formula">軌道：${y} ＝ (tan ${th})${x} − ${d(g, "2"+v0+"² cos² "+th)}${x}²　最高点 ${Q("H")} ＝ ${d(v0+"² sin² "+th, "2"+g)}　到達距離 ${Q("R")} ＝ ${d(v0+"² sin 2"+th, g)}</p>`;

const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th><th>次元</th></tr>
<tr><td>位置 ${x}, ${y}・高さ ${Q("h")}</td><td>m</td><td>〔L〕</td></tr>
<tr><td>時間 ${t}</td><td>s</td><td>〔T〕</td></tr>
<tr><td>速度 ${Q("v")}・${d("d"+x,"d"+t)}</td><td>m/s</td><td>〔L〕/〔T〕</td></tr>
<tr><td>加速度 ${Q("a")}, ${g}・${d("d"+vy,"d"+t)}・${d("d²"+y,"d"+t+"²")}</td><td>m/s²</td><td>〔L〕/〔T〕²</td></tr>
<tr><td>sin ${th}・cos ${th}・tan ${th}</td><td>なし</td><td>次元なし（比）</td></tr></table></div>
<p style='font-size:14px;margin:6px 0'>${CALC} 微分 ${d("d"+Q("A"),"d"+t)} の単位は「${Q("A")} の単位 ÷ s」、積分 ∫${Q("A")} d${t} の単位は「${Q("A")} の単位 × s」。d${t} は時間（の小さな幅）なので <span class='keep'>s</span> の次元をもつ。</p>`;

/* 放物運動のストロボと、速度ベクトルを1点から並べた図 */
const HODO = `<svg class="graph" viewBox="0 0 340 190" role="img" aria-label="左：放物運動の5つの位置と速度ベクトル。右：その5本の速度ベクトルを1点から並べると、先端が鉛直な一直線上に等間隔に並ぶ">
<defs><marker id="plA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
<text x="10" y="16" font-size="12" fill="currentColor">等しい時間間隔の位置と速度</text>
<text x="236" y="16" font-size="12" fill="currentColor">速度を1点から並べる</text>
<path d="M20,150 Q111.8,52.8 203.6,150" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="4 4"/>
<line x1="10" y1="150" x2="215" y2="150" stroke="currentColor" stroke-opacity=".4"/>
${[[20,150,-25],[65.9,115.5,-12.5],[111.8,104.1,0],[157.7,115.5,12.5],[203.6,150,25]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="currentColor"/><line x1="${p[0]}" y1="${p[1]}" x2="${p[0]+25}" y2="${p[1]+p[2]}" stroke="#dd5a12" stroke-width="2.2" marker-end="url(#plA)"/>`).join("")}
<circle cx="250" cy="105" r="3.5" fill="currentColor"/><text x="238" y="109" font-size="12" fill="currentColor">O</text>
<line x1="300" y1="40" x2="300" y2="170" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="3 3"/>
${[55,80,105,130,155].map(yy=>`<line x1="250" y1="105" x2="300" y2="${yy}" stroke="#dd5a12" stroke-width="1.8" marker-end="url(#plA)"/>`).join("")}
<line x1="308" y1="55" x2="308" y2="80" stroke="#22863a" stroke-width="2.2" marker-end="url(#plA)"/>
<text x="312" y="72" font-size="12" fill="#22863a">Δ</text><text x="321" y="72" font-size="12" font-style="italic" font-weight="700" fill="#22863a">v</text>
<text x="236" y="186" font-size="11" fill="currentColor">先端は鉛直な一直線上</text>
</svg>`;

const TF = ["正しい", "誤り"];
const UNITQ = ["m/s", "m/s²", "m", "s", "単位なし"];

const SECTIONS = [
{ id:"def", advice:"速度・加速度をベクトルとして言えるか、定義カードで確かめよう。「速さが一定でも加速度がある」場合をおさえよう。", tab:"①定義", title:"① 定義カード",
  intro:`物理基礎の「一直線上の運動」を、平面（2次元）に広げます。位置・速度・加速度を<b>ベクトル</b>として扱い、水平と鉛直に分けて考えます。<br>シミュレーターで確かめよう：<br>${ANIM("anim/deriv.html#vel","平均の速度 → 瞬間の速度")}${ANIM("anim/deriv.html#acc","平均の加速度 → 瞬間の加速度")}${ANIM("anim/deriv.html#rel","合成と相対（速度・加速度）")}${ANIM("anim/plane.html#proj","放物運動とベクトル")}${ANIM("anim/plane.html#range","角度と到達距離")}${ANIM("anim/plane.html#slope","斜面への投射")}${ANIM(BASICLAB+"anim/relative.html#plane-sum","川を渡る船（物理基礎ラボ）")}`,
  ref:{label:"定義カードと導出を見る", html:DEF_TABLE + DERIVE},
  groups:[
  { title:"A. 位置・速度・加速度", qs:[
    {id:"d1",type:"blanks",text:"曲線上を動く物体の速度ベクトルの向きは{0}であり、その大きさを{1}という。",
     options:[["軌道の接線方向","位置ベクトルの向き","加速度の向き"],["速さ","変位","道のり"]],answer:[0,0],
     explain:`平均の速度 Δ${B("r")}/Δ${t} は2点を結ぶ弦の向きです。Δ${t} → 0 で弦は接線に近づくので、瞬間の速度は接線方向になります。${ANIM("anim/deriv.html#vel","Δt → 0 を見る")}`},
    {id:"d2",type:"choice",prompt:"速さを一定に保ったまま、カーブを曲がっている自動車の加速度について、正しいものはどれか。",
     options:["加速度は 0 でない（速度の向きが変わっている）","速さが一定なので、加速度は 0 である","カーブの外向きの加速度がある"],answer:0,
     explain:`加速度は「速度」の変化です。速度はベクトルなので、大きさ（速さ）が同じでも向きが変われば Δ${B("v")} ≠ 0 です。等速円運動（単元4）で、この加速度が円の中心向きであることを学びます。${ANIM("anim/deriv.html#acc&path=circle","等速円運動の Δv を見る")}`},
    {id:"d3",type:"blanks",prompt:`${CALC} 位置 ${B("r")}(${t}) から速度・加速度を求める。`,text:`${B("v")} ＝ {0}、${B("a")} ＝ {1}`,
     options:[[`d${B("r")}/d${t}`,`∫${B("r")} d${t}`,`${B("r")}/${t}`],[`d${B("v")}/d${t}`,`d²${B("v")}/d${t}²`,`${B("v")}/${t}`]],answer:[0,0],
     explain:`速度は位置の時間微分、加速度は速度の時間微分（位置の2階微分 d²${B("r")}/d${t}²）です。成分ごとに微分します。${ANIM("anim/deriv.html#acc","速度と加速度の定義を見る")}${B("r")}/${t} は、原点から出発して等速で進んだ場合だけ速度と一致します。`},
    {id:"d4",type:"choice",prompt:"周回コースを1周して、出発点にもどってきた。この1周の「平均の速度」はどうなるか。",
     options:["0（変位が 0）","1周の道のり ÷ かかった時間","最高速度の半分"],answer:0,
     explain:"平均の速度 ＝ 変位 ÷ 時間。始めと終わりの位置が同じなので変位は 0 です。道のり ÷ 時間は「平均の速さ」です。"}
  ]},
  { title:"B. 速度の合成と相対速度" + BASIC, lead:`${ANIM(BASICLAB+"anim/relative.html#plane-rel","平面の相対速度（物理基礎ラボ）")}${ANIM("anim/deriv.html#rel&ex=throws&view=A","加速度があるときの合成と相対")}`, qs:[
    {id:"d5",type:"blanks",text:`A から見た B の速度は ${vAB} ＝ {0}。平面では、この引き算を{1}で行う。`,
     options:[[`${vB} − ${vA}`,`${vA} − ${vB}`,`${vA} ＋ ${vB}`],["矢印（ベクトル）","速さの数値だけ"]],answer:[0,0],
     explain:`「見られる物体の速度 − 見ている人の速度」。${vB} − ${vA} ＝ ${vB} ＋ (−${vA}) なので、${vA} を逆向きにした矢印を ${vB} につなぎます。`},
    {id:"d6",type:"choice",prompt:"東向きに 3.0 m/s、北向きに 4.0 m/s の2つの速度を合成した速度の大きさはどれか。",
     options:["5.0 m/s","7.0 m/s","1.0 m/s"],answer:0,
     explain:"直交する2つの速度の合成は、三平方の定理で √(3.0² ＋ 4.0²) ＝ 5.0 m/s。向きがそろっていない速度の大きさを、そのまま足し引きしてはいけません。"}
  ]},
  { title:"C. 放物運動", lead:"空気抵抗は無視し、y 軸は鉛直上向きとする。", qs:[
    {id:"d7",type:"blanks",text:`投げ出された物体の加速度は {0} で、運動の途中で{1}。そのため、水平方向は{2}、鉛直方向は{3}になる。`,
     options:[[`(0, −${g})`,`(0, 0)`,"速度と同じ向き"],["変わらない","変わる"],["等速直線運動","等加速度運動"],["等速直線運動","等加速度運動"]],answer:[0,0,0,1],
     explain:`重力 ${Q("m")}${g} だけを受けるので、運動方程式から ${B("a")} ＝ (0, −${g})。水平方向の加速度は 0 なので等速、鉛直方向は加速度 −${g} の等加速度運動です。`},
    {id:"d8",type:"choice",prompt:`<b>鉛直</b>から角 ${Q("φ")} だけ傾けた斜め上向きに、速さ ${v0} で投げた。初速度の水平成分と鉛直成分はどれか。`,
     options:[`水平 ${v0} sin ${Q("φ")}、鉛直 ${v0} cos ${Q("φ")}`,`水平 ${v0} cos ${Q("φ")}、鉛直 ${v0} sin ${Q("φ")}`,`水平 ${v0} tan ${Q("φ")}、鉛直 ${v0}`],answer:0,
     explain:`角にくっついている辺（ここでは鉛直）が cos、向かい側（水平）が sin です。「水平は cos」と覚えるのではなく、図に角をかき込んで決めよう。${Q("φ")} ＝ 0（真上に投げる）なら水平成分 0 になるかで確かめられます。`},
    {id:"d9",type:"blanks",text:`斜方投射の軌道が放物線になるのは、${x} が ${t} の{0}、${y} が ${t} の{1}なので、${t} を消去すると ${y} が ${x} の{2}になるからである。`,
     options:[["1次式","2次式"],["1次式","2次式"],["1次関数","2次関数","3次関数"]],answer:[0,1,1],
     explain:`${t} ＝ ${x}/(${v0} cos ${th}) を ${y} の式に代入すると、${y} ＝ (tan ${th})${x} − ${g}${x}²/(2${v0}² cos² ${th})。${x}² の係数が負なので、上に凸の放物線です。`},
    {id:"d10",type:"multi",prompt:"最高点の条件として正しいものをすべて選べ。",
     options:[`${vy} ＝ 0 ${NOCALC}`,`d${y}/d${t} ＝ 0 ${CALC}`,`軌道の式で d${y}/d${x} ＝ 0 ${CALC}`,`速度 ${B("v")} ＝ 0`,`加速度 ${B("a")} ＝ 0`],answer:[0,1,2],
     explain:`${vy} ＝ d${y}/d${t} なので最初の2つは同じ条件です。軌道の接線が水平になるので d${y}/d${x} ＝ 0 でもあります。最高点でも水平成分 ${v0} cos ${th} が残るので速度は 0 でなく、加速度は (0, −${g}) のままです。`}
  ]}]
},
{ id:"read", advice:"ベクトルは成分に分けて読む。「だれから見たか」「どの方向の運動か」を先に決めよう。", tab:"②読解", title:"② 読解ドリル",
  intro:"電卓はなるべく使いません。問題文の言葉や式から、ベクトルの向き・成分・運動のようすを読み取る練習です。",
  groups:[
  { title:"A. 速度の変化を読む", lead:`放物運動で、等しい時間間隔ごとの位置と速度をかき、その速度ベクトルを1点から並べた。${ANIM("anim/plane.html#proj","放物運動とベクトル（右の図）")}`, figure:HODO, qs:[
    {id:"ra1",type:"choice",prompt:"図の右側で、となり合う速度ベクトルの先端を結んだ矢印 Δ" + B("v") + " について正しいものはどれか。",
     options:[`いつも鉛直下向きで、大きさ ${g}Δ${t} で一定`,"いつも軌道の接線方向","最高点で 0 になる"],answer:0,
     explain:`Δ${B("v")} ＝ ${B("a")}Δ${t} ＝ (0, −${g}Δ${t})。加速度が一定なので、速度の変化も一定です。水平成分は変わらないので、先端は鉛直な一直線上に等間隔に並びます。`},
    {id:"ra2",type:"num",prompt:`位置が ${x} ＝ 3.0${t}、${y} ＝ 4.0${t}〔m〕（${t}〔s〕）で表される物体の速さを求めよ。`,answer:5,tol:0.05,unit:"m/s",
     traps:{"7":"成分 3.0 と 4.0 をそのまま足していませんか。直交する成分なので三平方の定理です。"},
     explain:`${vx} ＝ 3.0 m/s、${vy} ＝ 4.0 m/s（どちらも一定）。速さ √(3.0² ＋ 4.0²) ＝ 5.0 m/s の等速直線運動です。`},
    {id:"ra3",type:"num",prompt:`${CALC} 位置が ${x} ＝ 3.0${t}、${y} ＝ 2.0${t}²〔m〕で表される物体の、${t} ＝ 2.0 s での速さを求めよ。`,answer:8.54,tol:0.1,unit:"m/s",
     traps:{"5":"y/t ＝ 4.0 m/s は 0〜2.0 s の平均の速度の y 成分です。微分して v_y ＝ 4.0t ＝ 8.0 m/s。","11":"成分 3.0 と 8.0 をそのまま足していませんか。三平方の定理です。","8":"それは y 成分だけです。x 成分 3.0 m/s も合わせます。"},
     explain:`${vx} ＝ d${x}/d${t} ＝ 3.0、${vy} ＝ d${y}/d${t} ＝ 4.0${t} ＝ 8.0 m/s。速さ √(3.0² ＋ 8.0²) ＝ √73 ≒ 8.5 m/s。`},
    {id:"ra4",type:"blanks",prompt:`${CALC} ra3 の物体の加速度を求める。`,text:`${B("a")} ＝ ({0}, {1})〔m/s²〕で、時間がたっても{2}。`,
     options:[["0","3.0","9.0"],["4.0","2.0","8.0"],["変わらない","大きくなる"]],answer:[0,0,0],
     explain:`${Q("a")}<sub>x</sub> ＝ d(3.0)/d${t} ＝ 0、${Q("a")}<sub>y</sub> ＝ d(4.0${t})/d${t} ＝ 4.0。加速度が一定で、初速度と垂直なので、この物体も放物線をえがきます（重力のかわりに ${y} 方向の一定の力を受けている）。`}
  ]},
  { title:"B. 平面の相対速度を読む", lead:"東向きを x、北向きを y とする。", qs:[
    {id:"rb1",type:"choice",prompt:"自動車 A が東向きに 10 m/s、自動車 B が北向きに 10 m/s で走っている。A から見た B の速度はどれか。",
     options:["北西向きに 約14 m/s","北東向きに 約14 m/s","北向きに 10 m/s","0"],answer:0,
     explain:`${vAB} ＝ ${vB} − ${vA} ＝ (0, 10) − (10, 0) ＝ (−10, 10)。西向き成分と北向き成分が等しいので北西向き、大きさ 10√2 ≒ 14 m/s。`},
    {id:"rb2",type:"num",prompt:"雨が鉛直に降る中を、人が水平に 4.0 m/s で走ると、雨は鉛直から 45° 傾いて前方から降ってくるように見えた。地面に対する雨の落下の速さを求めよ。",answer:4,tol:0.05,unit:"m/s",
     traps:{"5.7":"人から見た雨の速さ（斜辺）ではなく、地面から見た雨の鉛直の速さです。","2.8":"45° のとき、水平成分と鉛直成分は等しくなります。"},
     explain:"人から見た雨の速度 ＝ 雨の速度 − 人の速度。水平成分は人の速度を逆にした 4.0 m/s（後ろ向き）、鉛直成分は雨の落下の速さ。45° なので2つの成分は等しく、4.0 m/s。"},
    {id:"rb3",type:"choice",prompt:"「相対速度の大きさは、2つの物体の速さの差である。」",options:TF,answer:1,
     explain:"誤り。速度が同じ直線上にあるときでも向きによって和や差になり、平面では矢印の引き算です。rb1 では速さの差は 0 ですが、相対速度の大きさは約14 m/s です。"}
  ]},
  { title:"C. 軌道の式を読む", lead:`投げた点を原点、水平右向きを ${x}、鉛直上向きを ${y} とし、${g} ＝ 9.8 m/s² とする。ある小球の軌道は ${y} ＝ ${x} − 0.050${x}²〔m〕だった。`, qs:[
    {id:"rc1",type:"choice",prompt:"投げ上げた角度（水平からの角）はどれか。",options:["45°","30°","60°","0.050 rad"],answer:0,
     explain:`軌道の式 ${y} ＝ (tan ${th})${x} − … と比べると tan ${th} ＝ 1 なので ${th} ＝ 45°。原点での接線の傾き（d${y}/d${x} の ${x} ＝ 0 での値）が tan ${th} です。`},
    {id:"rc2",type:"num",prompt:"投げた点と同じ高さにもどる点の x 座標（水平到達距離）を求めよ。",answer:20,tol:0.1,unit:"m",
     traps:{"10":"それは最高点の x 座標です。y ＝ 0 となる x を求めます。"},
     explain:`${y} ＝ ${x}(1 − 0.050${x}) ＝ 0 より ${x} ＝ 0、20。到達距離は 20 m。放物線は左右対称なので、最高点は ${x} ＝ 10 m です。`},
    {id:"rc3",type:"num",prompt:"投げ出した速さ v₀ を求めよ。",answer:14,tol:0.1,unit:"m/s",
     traps:{"9.9":"v₀² cos²θ ＝ 98 から、cos²45° ＝ 0.5 で割るのを忘れていませんか。それは初速度の水平成分です。","196":"v₀² ＝ 196 です。平方根をとります。"},
     explain:`${g}/(2${v0}² cos² 45°) ＝ 0.050 より ${v0}² ＝ 9.8 ÷ (2 × 0.050 × 0.5) ＝ 196、${v0} ＝ 14 m/s。確かめ：${Q("R")} ＝ ${v0}² sin 90°/${g} ＝ 196/9.8 ＝ 20 m で rc2 と一致します。`},
    {id:"rc4",type:"choice",prompt:`高さのあるがけの上から、同じ速さで角度を変えて投げる。地面に着くまでの水平距離が最大になる角度はどうなるか。${ANIM("anim/plane.html#range","角度と到達距離")}`,
     options:["45° より小さい","45° ちょうど","45° より大きい"],answer:0,
     explain:"45° が最大になるのは、投げた点と同じ高さに落ちるときだけです。落ちる点が低いと、落下にかかる時間を高さがかせいでくれるので、水平成分を大きくする（角度を小さくする）ほうが得になります。シミュレーターで高さを変えて確かめよう。"}
  ]},
  { title:"D. 2通りの見方を読む", qs:[
    {id:"rd1",type:"blanks",prompt:`${NOCALC} と ${CALC} の対応を読む。`,text:`${vy}-${t} 図の{0}は加速度、{1}は変位を表す。微積では、それぞれ ${vy} を ${t} で{2}すること、${t} で{3}することにあたる。`,
     options:[["傾き","面積","切片"],["傾き","面積","切片"],["微分","積分"],["微分","積分"]],answer:[0,1,0,1],
     explain:`傾き ＝ d${vy}/d${t} ＝ ${Q("a")}<sub>y</sub>、面積 ＝ ∫${vy} d${t} ＝ Δ${y}。物理基礎で使った「傾きと面積」は、微分と積分の図形的な意味そのものです。`},
    {id:"rd2",type:"choice",prompt:`同じ高さから同時に、小球 P は静かに落とし、小球 Q は水平に投げ出した。2つの球の高さはいつも等しい。この理由として最も適切なものはどれか。`,
     options:["鉛直方向の初速度と加速度が同じなので、鉛直方向の運動がまったく同じだから","Q のほうが速いので、空気抵抗で同じになるから","水平に投げると重力が小さくなるから"],answer:0,
     explain:`どちらも鉛直方向は初速度 0、加速度 −${g}。水平方向の運動は鉛直方向の運動に影響しません（運動の独立性）。モンキーハンティングで、狙った向きに撃つと必ず当たるのも同じ理由です。`}
  ]}]
},
{ id:"dim", advice:"微分は「÷ s」、積分は「× s」。sin・cos・tan には単位がない。", tab:"③次元", title:"③ 次元チェック",
  intro:`${CALC} 微分・積分を含む式も次元で確かめられます。d${t} は時間なので、d/d${t} は「÷〔T〕」、∫ d${t} は「×〔T〕」です。`,
  ref:{label:"次元の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", lead:`${x}, ${y}〔m〕、${t}〔s〕、${v0}, ${vy}〔m/s〕、${g}〔m/s²〕とする。`, qs:[
    {id:"da1",type:"choice",prompt:`${CALC} d${x}/d${t}`,options:UNITQ,answer:0,explain:"m ÷ s ＝ m/s（速度の成分）。",two:true},
    {id:"da2",type:"choice",prompt:`${CALC} d²${y}/d${t}²`,options:UNITQ,answer:1,explain:"m ÷ s ÷ s ＝ m/s²（加速度の成分）。d²/dt² は「÷ s²」です。",two:true},
    {id:"da3",type:"choice",prompt:`${CALC} ∫ ${vy} d${t}`,options:UNITQ,answer:2,explain:"(m/s) × s ＝ m（変位）。vy-t 図の面積です。",two:true},
    {id:"da4",type:"choice",prompt:`${g}${x}² ÷ (2${v0}² cos² ${th})`,options:UNITQ,answer:2,explain:"(m/s²)·m² ÷ (m/s)² ＝ m。軌道の式の各項は長さ（m）になります。",two:true},
    {id:"da5",type:"choice",prompt:`${v0} sin ${th} ÷ ${g}`,options:UNITQ,answer:3,explain:"(m/s) ÷ (m/s²) ＝ s。最高点に達するまでの時間です。",two:true},
    {id:"da6",type:"choice",prompt:"軌道の式の (tan θ)x の tan θ",options:UNITQ,answer:4,explain:"tan θ は長さの比なので単位がありません。(tan θ)x は m です。",two:true}
  ]},
  { title:"B. 式の次元を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、次元が合わないものをすべて選べ。",
     options:[`${Q("R")} ＝ ${v0} sin 2${th} ÷ ${g}`,`${Q("H")} ＝ ${v0}² sin² ${th} ÷ 2${g}`,`${y} ＝ (tan ${th})${x} − ${g}${x}² ÷ (2${v0} cos² ${th})`,`${t} ＝ 2${v0} sin ${th} ÷ ${g}`,`${Q("v")} ＝ √(${vx}² ＋ ${vy}²)`],answer:[0,2],
     explain:`${v0} sin 2${th}/${g} は (m/s)/(m/s²) ＝ s で長さではありません（正しくは ${v0}²）。${g}${x}²/(2${v0} cos² ${th}) は (m/s²)·m²/(m/s) ＝ m²/s で長さではありません（正しくは ${v0}²）。`}
  ]},
  { title:"C. 次元で見つからない誤りは「極端な場合」で", qs:[
    {id:"dc1",type:"choice",prompt:`${Q("H")} ＝ ${v0}² sin² ${th} ÷ 2${g} に ${th} ＝ 90° を代入すると ${v0}²/2${g} になり、鉛直投げ上げの最高点の高さと一致する。この確かめ方で調べているのは何か。`,
     options:["特別な場合（極端な場合）に、すでに知っている結果と一致するか","単位がそろっているか","有効数字が正しいか"],answer:0,
     explain:`次元が合っていても、sin と cos の取り違えや係数の誤りは残ります。${th} ＝ 0°（水平に投げる → ${Q("H")} ＝ 0）、${th} ＝ 90°（真上 → 鉛直投げ上げ）のような極端な場合を代入すると見つけられます。`},
    {id:"dc2",type:"choice",prompt:`${Q("R")} ＝ ${v0}² sin 2${th} ÷ ${g} を、うっかり ${v0}² cos 2${th} ÷ ${g} と書いた。どの確かめ方で見つかるか。`,
     options:[`${th} ＝ 90°（真上）を代入すると ${Q("R")} ＝ −${v0}²/${g} になり、0 にならない`,"次元チェック","見つける方法はない"],answer:0,
     explain:`真上に投げれば同じ点にもどるので ${Q("R")} ＝ 0 のはずです。cos 180° ＝ −1 なので誤りとわかります。sin と cos はどちらも単位がないので、次元チェックでは見つかりません。`}
  ]}]
},
{ id:"step", advice:"軸と原点を最初に決め、初速度を成分に分ける。時間は鉛直方向の運動から求めることが多い。", tab:"④手順", title:"④ 手順固定の演習",
  intro:`7ステップで解きます。①軸と原点（正の向き） → ②既知・未知 → ③式を選ぶ → ④文字式 → ⑤次元 → ⑥数値 → ⑦妥当性。平面の運動では、ステップ1で<b>2つの軸</b>を決め、ベクトルを成分に分けます。${g} ＝ 9.8 m/s²、空気抵抗は無視する。`,
  ref:{label:"式を見る", html:FORMULAS},
  groups:[
  { title:"問題1（川を渡る船・すべてのステップ）", lead:ANIM(BASICLAB+"anim/relative.html#plane-sum","川を渡る船（物理基礎ラボ）で確かめる"),
    quote:"川幅 120 m の川が、どこでも 1.5 m/s で流れている。静水に対して 2.5 m/s で進む船で対岸へ渡る。(1) 船首を岸に垂直に向けたまま進むとき、渡るのにかかる時間と、下流に流される距離を求めよ。(2) 出発点の真向かいの地点に着くように進むとき、船首を向ける向きと、渡るのにかかる時間を求めよ。", qs:[
    {id:"s11",type:"choice",prompt:"ステップ1・3　岸から見た船の速度を表す式はどれか。",
     options:["（水に対する船の速度）＋（水の速度）","（水に対する船の速度）−（水の速度）","（水の速度）−（水に対する船の速度）"],answer:0,
     explain:`合成速度です。岸から見た速度 ＝ 水に対する速度 ＋ 水の速度（ベクトルの和）。岸に垂直な方向を ${y}、下流向きを ${x} として成分に分けます。`},
    {id:"s12",type:"blanks",prompt:"ステップ2　(1) の岸から見た船の速度を成分で表す。",text:`岸に垂直な成分 {0}、下流向きの成分 {1}`,
     options:[["2.5 m/s","1.5 m/s","2.9 m/s"],["2.5 m/s","1.5 m/s","0"]],answer:[0,1],
     explain:"船首が岸に垂直なので、水に対する速度 2.5 m/s はそのまま岸に垂直な成分。流れ 1.5 m/s が下流向きの成分になります。"},
    {id:"s13",type:"num",prompt:"ステップ6　(1) 渡るのにかかる時間",answer:48,tol:0.5,unit:"s",
     traps:{"41":"120 m を進むのは岸に垂直な方向です。斜めの速さ 2.9 m/s ではなく、垂直成分 2.5 m/s で割ります。","30":"速さ 2.5 と 1.5 を足していませんか。","80":"1.5 m/s は流れ（下流向き）の速さです。"},
     explain:"岸に垂直な方向に 120 m 進むので、120 ÷ 2.5 ＝ 48 s。流れは垂直方向の運動に影響しません（運動の独立性）。"},
    {id:"s14",type:"num",prompt:"(1) 下流に流される距離",answer:72,tol:0.5,unit:"m",
     explain:"下流向きには 1.5 m/s で 48 s 進むので 1.5 × 48 ＝ 72 m。"},
    {id:"s15",type:"choice",prompt:"ステップ3　(2) 真向かいに着くには、岸から見た速度が岸に垂直になればよい。船首はどちらに向けるか。",
     options:["上流側に傾ける（下流向き成分を打ち消す）","岸に垂直に向ける","下流側に傾ける"],answer:0,
     explain:"水に対する速度の上流向き成分が、流れ 1.5 m/s を打ち消せばよい。船首と上流側の岸のなす角を φ とすると 2.5 cos φ ＝ 1.5、cos φ ＝ 0.60（φ ≒ 53°）。"},
    {id:"s16",type:"num",prompt:"(2) 岸から見た船の速さ",answer:2,tol:0.05,unit:"m/s",
     traps:{"2.5":"それは水に対する速さです。上流向き成分は流れで打ち消されます。","2.9":"それは (1) の岸から見た速さです。","1":"2.5 − 1.5 ではなく、直角三角形の残りの辺です。"},
     explain:"水に対する速度 2.5 m/s が斜辺、上流向き成分 1.5 m/s が1辺の直角三角形。残りの辺（岸に垂直な成分）は √(2.5² − 1.5²) ＝ 2.0 m/s。"},
    {id:"s17",type:"num",prompt:"(2) 渡るのにかかる時間",answer:60,tol:0.5,unit:"s",
     explain:"120 ÷ 2.0 ＝ 60 s。"},
    {id:"s18",type:"choice",prompt:"ステップ7　(1) 48 s と (2) 60 s を比べた結果は妥当か。",
     options:["妥当。岸に垂直な成分が最大になるのは船首を垂直に向けたときなので、(1) が最短時間","妥当でない。流されない (2) のほうが速く着くはず","妥当でない。どちらも同じ時間になるはず"],answer:0,
     explain:"渡る時間は「岸に垂直な速度成分」だけで決まり、流れの速さによりません。最短時間で渡るには船首を垂直に、最短距離で渡るには上流側に傾けます。"}
  ]},
  { title:"問題2（がけからの斜方投射・ステップ1〜3を誘導）", lead:ANIM("anim/plane.html#proj&v0=19.6&th=30&h=39.2","この問題の値で確かめる"),
    quote:"高さ 39.2 m のがけの上から、水平と 30° 上向きに、速さ 19.6 m/s で小球を投げ出した。sin 30° ＝ 0.50、cos 30° ＝ 0.87 とする。(1) 地面に落ちるまでの時間、(2) その間に水平に進む距離、(3) 最高点の地面からの高さ、(4) 地面に落ちる直前の速さを求めよ。", qs:[
    {id:"s21",type:"choice",prompt:`ステップ1　投げた点を原点、水平右向きを ${x}、鉛直上向きを ${y} とする。地面の位置はどう表されるか。`,
     options:[`${y} ＝ −39.2 m`,`${y} ＝ ＋39.2 m`,`${y} ＝ 0`],answer:0,
     explain:"原点（投げた点）より 39.2 m 下なので、上向きを正とすると y ＝ −39.2 m。原点を地面にとる方法もありますが、どちらにしたかを最初に書くことが大切です。"},
    {id:"s22",type:"blanks",prompt:`ステップ2・4 ${CALC}　加速度 (0, −${g}) を ${t} で積分して速度を求める。`,text:`${vx} ＝ {0}、${vy} ＝ {1}。積分定数は {2} から決める。`,
     options:[[`19.6 cos 30°`,`19.6 sin 30°`,"0"],[`19.6 sin 30° − 9.8${t}`,`−9.8${t}`,`19.6 − 9.8${t}`],[`${t} ＝ 0 での速度（初速度）`,"最高点の高さ","地面の位置"]],answer:[0,0,0],
     explain:`∫0 d${t} ＝ ${Q("C")}₁、∫(−9.8) d${t} ＝ −9.8${t} ＋ ${Q("C")}₂。${t} ＝ 0 で ${vx} ＝ 19.6 cos 30°、${vy} ＝ 19.6 sin 30° ＝ 9.8 m/s となるように積分定数を決めます。`},
    {id:"s23",type:"blanks",prompt:`ステップ2・4 ${NOCALC}　同じことを ${vy}-${t} 図で考える。`,text:`${vy}-${t} 図は、切片 {0}、傾き {1} の直線。${y} は、この直線と ${t} 軸の間の{2}で求める。`,
     options:[["9.8 m/s","19.6 m/s","0"],["−9.8 m/s²","9.8 m/s²","0"],["面積（t 軸より下は負）","傾き"]],answer:[0,0,0],
     explain:`${vy} が負になってからの部分は ${t} 軸の下側の面積なので、変位は負（下向き）として数えます。`},
    {id:"s24",type:"choice",prompt:"ステップ3　(1) の時間を求める式はどれか。",
     options:[`−39.2 ＝ 9.8${t} − 4.9${t}²`,`39.2 ＝ 4.9${t}²`,`39.2 ＝ 17${t}`],answer:0,
     explain:`${y} ＝ 19.6 sin 30°・${t} − ½・9.8・${t}² が −39.2 になる時刻です。初速度に鉛直成分があるので自由落下の式は使えません。39.2 m は高さで、水平距離ではありません。`},
    {id:"s25",type:"num",prompt:"ステップ6　(1) 地面に落ちるまでの時間",answer:4,tol:0.03,unit:"s",
     traps:{"2":"それは投げた点と同じ高さにもどる時刻です。そこからさらに 39.2 m 落ちます。","2.83":"初速度の鉛直成分 9.8 m/s を忘れていませんか。","-2":"t ＞ 0 の解を選びます。"},
     explain:`4.9${t}² − 9.8${t} − 39.2 ＝ 0 → ${t}² − 2${t} − 8 ＝ 0 → (${t} − 4)(${t} ＋ 2) ＝ 0。${t} ＞ 0 より ${t} ＝ 4.0 s。`},
    {id:"s26",type:"num",prompt:"(2) 水平に進む距離（有効数字2桁）",answer:68,tol:1,unit:"m",
     traps:{"78.4":"初速度 19.6 m/s をそのまま使っていませんか。水平成分は 19.6 cos 30° です。","39.2":"水平成分は cos 30° です（sin と取り違えていませんか）。","34":"t ＝ 4.0 s を使います。"},
     explain:`水平成分 19.6 × 0.87 ≒ 17.1 m/s。等速なので ${x} ＝ 17.1 × 4.0 ≒ 68 m。`},
    {id:"s27",type:"num",prompt:"(3) 最高点の地面からの高さ",answer:44.1,tol:0.2,unit:"m",
     traps:{"4.9":"それは投げた点からの高さです。地面からの高さを求めます。","9.8":"最高点は vy ＝ 0 の t ＝ 1.0 s。y ＝ 9.8 × 1.0 − 4.9 × 1.0²。"},
     explain:`${vy} ＝ 9.8 − 9.8${t} ＝ 0 より ${t} ＝ 1.0 s。${y} ＝ 9.8 × 1.0 − 4.9 × 1.0² ＝ 4.9 m。地面からは 39.2 ＋ 4.9 ＝ 44.1 m。`},
    {id:"s28",type:"num",prompt:"(4) 地面に落ちる直前の速さ（有効数字2桁）",answer:34,tol:0.6,unit:"m/s",
     traps:{"29.4":"それは鉛直成分の大きさです。水平成分 17 m/s も合わせます。","46.5":"成分の大きさを足していませんか。三平方の定理です。","19.6":"高さが変わったので、速さは初速度と同じではありません。"},
     explain:`${vy} ＝ 9.8 − 9.8 × 4.0 ＝ −29.4 m/s、${vx} ≒ 17.1 m/s。速さ √(17.1² ＋ 29.4²) ≒ 34 m/s。`},
    {id:"s29",type:"choice",prompt:"ステップ7　(4) の答えを別の方法で確かめたい。最も適切なものはどれか。",
     options:["力学的エネルギー保存：v² ＝ 19.6² ＋ 2 × 9.8 × 39.2 から求めて一致するか確かめる","t ＝ 4.0 s を (2) の式に代入しなおす","答えが初速度 19.6 m/s より小さいか確かめる"],answer:0,
     explain:`½${Q("m")}${Q("v")}² ＝ ½${Q("m")}${v0}² ＋ ${Q("m")}${g}${Q("h")} より ${Q("v")}² ＝ 384 ＋ 768 ＝ 1152、${Q("v")} ≒ 34 m/s で一致します。速さだけなら投げた角度によらないこともわかります。落ちる点が低いので、初速度より大きくなるのが妥当です。`}
  ]},
  { title:"問題3（斜面への投射・答えだけ入力）", lead:`紙に7ステップを書いて解き、答えを入力せよ。tan 30° ＝ 0.58、cos 30° ＝ 0.87 とする。解き終えたら確かめよう：${ANIM("anim/plane.html#slope&v0=9.8&al=30","斜面への投射（この問題の値）")}`,
    quote:"傾斜角 30° の斜面の上端から、小球を水平に 9.8 m/s で投げ出したところ、斜面上に落ちた。", qs:[
    {id:"s31",type:"num",prompt:"(1) 投げ出してから斜面に落ちるまでの時間",answer:1.16,tol:0.05,unit:"s",
     traps:{"0.58":"それは斜面から最も離れる時刻です。斜面に落ちるのはその2倍の時刻です。","2":"落ちる点では (落下距離) ÷ (水平距離) ＝ tan 30° です。"},
     explain:`落ちる点で ½${g}${t}² ÷ (${v0}${t}) ＝ tan 30°。${t} ＝ 2${v0} tan 30°/${g} ＝ 2 × 9.8 × 0.58 ÷ 9.8 ≒ 1.16 s（約1.2 s）。`},
    {id:"s32",type:"num",prompt:"(2) 投げ出した点から落ちた点までの、斜面に沿った距離（有効数字2桁）",answer:13.1,tol:0.4,unit:"m",
     traps:{"11.4":"それは水平距離です。斜面に沿った距離は 水平距離 ÷ cos 30° です。","11.3":"それは水平距離です。斜面に沿った距離は 水平距離 ÷ cos 30° です。","6.6":"それは落下した高さです。"},
     explain:"水平距離 9.8 × 1.16 ≒ 11.4 m。斜面に沿った距離は 11.4 ÷ 0.87 ≒ 13 m。"},
    {id:"s33",type:"num",prompt:`(3) 斜面から最も離れる時刻 ${CALC}（斜面に垂直な距離を ${t} で微分して 0）または ${NOCALC}（速度が斜面と平行になる）で求めよ。`,answer:0.58,tol:0.03,unit:"s",
     traps:{"1.16":"それは斜面に落ちる時刻です。","1.2":"それは斜面に落ちる時刻です。"},
     explain:`${NOCALC} 速度が斜面と平行になるとき：${g}${t}/${v0} ＝ tan 30° より ${t} ＝ 0.58 s。${CALC} 斜面に垂直な軸では初速度 ${v0} sin 30°、加速度 −${g} cos 30° なので、距離を微分して 0 とおくと ${t} ＝ ${v0} tan 30°/${g} ＝ 0.58 s。落ちるまでの時間のちょうど半分です。`},
    {id:"s34",type:"checklist",prompt:"解き終えたら、自分の答案を点検しよう（採点には入りません）。",
     items:["2つの軸と原点、正の向きを最初に書いた","初速度・加速度を軸の方向の成分に分けた（sin・cos を図で確かめた）","時間を求める条件（地面・斜面・最高点）を式で書いた","t ＝ 0 や負の解など、不要な解を捨てた","微積の見方と、微積を使わない見方の少なくとも一方で説明できる","答えの単位と、極端な場合（θ ＝ 0°、90° など）を確かめた"]}
  ]}]
},
{ id:"sum", advice:"「軸を決める → 成分に分ける → 2つの方向は時間でつながる」を先に書こう。", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。どの考え方を使うかを答えます。",
  ref:{label:"式を見る", html:FORMULAS},
  groups:[{ title:"考え方を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:`位置 ${x}(${t})、${y}(${t}) が式で与えられた物体の、ある時刻の加速度を求めたい。`,
     options:[`${CALC} ${x}, ${y} をそれぞれ ${t} で2回微分する`,`${x}, ${y} を ${t}² で割る`,`速さを ${t} で割る`],answer:0,
     explain:`${B("a")} ＝ d²${B("r")}/d${t}²。成分ごとに微分します。${x}/${t}² のような割り算は、特別な場合しか成り立ちません。`},
    {id:"m2",type:"choice",prompt:"動いている船から見た、別の船の速度を求めたい。",
     options:["相手の速度ベクトル − 自分の速度ベクトル","相手の速さ − 自分の速さ","相手の速度ベクトル ＋ 自分の速度ベクトル"],answer:0,
     explain:"相対速度 v_AB ＝ v_B − v_A。平面では矢印の引き算（成分ごとの引き算）です。"},
    {id:"m3",type:"choice",prompt:"斜方投射で、地面に落ちる位置を求めたい。",
     options:["鉛直方向の運動から落ちる時刻を求め、その時刻を水平方向の式に代入する","水平方向の運動だけで求める","初速度 × 時間 で求める"],answer:0,
     explain:"2つの方向の運動は「時間」でつながっています。高さの条件がわかる鉛直方向から時刻を求めるのが基本です。"},
    {id:"m4",type:"choice",prompt:"斜方投射で、軌道の形（どこを通るか）を知りたい。",
     options:["x と y の式から t を消去して、軌道の式を求める","速度の式だけを使う","加速度の式だけを使う"],answer:0,
     explain:`${t} を消去すると ${y} ＝ (tan ${th})${x} − ${g}${x}²/(2${v0}² cos² ${th})。「ある点を通るか」「壁を越えるか」を調べるときに使います。`},
    {id:"m5",type:"choice",prompt:"斜面への投射で、落ちる位置や斜面から最も離れる時刻を求めたい。",
     options:["水平・鉛直、または斜面に平行・垂直に軸をとり、条件を式にする（どちらの軸でも解ける）","必ず水平・鉛直に軸をとる","斜面に平行な方向の運動だけを考える"],answer:0,
     explain:"軸は自由に選べます。斜面に平行・垂直にとると、重力加速度を g sin α と g cos α に分けることになり、「斜面から最も離れる」が「垂直成分の速度 ＝ 0」と簡単に書けます。"},
    {id:"m6",type:"self",prompt:`次の文を自分の言葉で完成させよ。「微積を使う見方と使わない見方（グラフの傾き・面積）は、（　　）という点でつながっている。」`,scored:false,
     model:"例：グラフの傾きが微分（d/dt）、グラフの面積が積分（∫dt）にあたり、どちらも同じ式が導ける。微積では初期条件が積分定数を決め、グラフでは切片にあたる。"}
  ]}]
}
];

registerUnit({
  id: "plane",               // js/index.js の id と同じにする
  title: "1 平面内の運動",
  sections: SECTIONS
});
})();
