/*
 * 物理ラボ　単元2：剛体のつり合い
 * 学習指導要領「物理」(1)様々な運動 (ア)平面内の運動と剛体のつり合い ㋒剛体のつり合い
 * このファイルは js/index.js の file に "units/rigid.js" と書くと読み込まれます。
 * 微積（数学Ⅲ）を使う見方には CALC、使わない見方には NOCALC のタグを付けて併記する。
 */
(function(){

if(typeof document !== "undefined" && !document.getElementById("notation-style")){
  const st = document.createElement("style");
  st.id = "notation-style";
  st.textContent = '.qv{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-size:1.1em;padding:0 .04em}'
                 + '.qb{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:italic;font-weight:700;font-size:1.1em;padding:0 .04em}'
                 + '.qu{font-family:"Times New Roman",Times,"Noto Serif",serif;font-style:normal;font-size:1.1em}';
  document.head.appendChild(st);
}

const Q = s => `<i class='qv'>${s}</i>`;
const F = Q("F"), M = Q("M"), l = Q("l"), r = Q("r"), th = Q("θ"), x = Q("x"), m = Q("m"), g = Q("g"), L = Q("L");
const xG = `${Q("x")}<sub>G</sub>`, lam = Q("λ");
const d = (a, b) => `<span style='display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.92em;line-height:1.15;margin:0 2px'><span style='border-bottom:1px solid currentColor;padding:0 2px'>${a}</span><span>${b}</span></span>`;
const INT = (a, b) => `<span style='display:inline-flex;align-items:center;vertical-align:middle'><span style='font-size:1.5em;line-height:1'>∫</span><span style='display:inline-flex;flex-direction:column;font-size:.7em;line-height:1.1;margin-left:-1px'><span>${b}</span><span>${a}</span></span></span>`;
const CALC = `<span class='calc-tag'>微積</span>`;
const NOCALC = `<span class='nocalc-tag'>微積なし</span>`;
const BASIC = `<span style='display:inline-block;font-size:12px;font-weight:700;color:var(--muted);border:1px dashed var(--muted);border-radius:4px;padding:0 5px;margin-left:4px;vertical-align:1px'>物理基礎の復習</span>`;
const ANIM = (href, label) => `<a href='${href}' style='display:inline-block;margin:8px 6px 0 0;padding:6px 12px;border:1.5px solid var(--blue);border-radius:8px;color:var(--blue);font-weight:700;text-decoration:none;line-height:1.5'>▶ ${label}</a>`;
const BASICLAB = "https://cota-science.github.io/basicphysics-review/";
const GLOS = (id, groups) => groups.map((gr, i) => `<details name='glos-${id}' ${i ? "" : "open"} style='margin:6px 0;border:1px solid var(--line);border-radius:6px;padding:2px 10px'>
<summary style='cursor:pointer;font-weight:700;padding:6px 0'>${gr.title}<span style='font-weight:400;color:var(--muted);font-size:13px'>（${gr.rows.length}語）</span></summary>
<div class="tbl"><table><colgroup><col style="width:7.2em"><col></colgroup>
<tr><th>用語</th><th>定義（記号・式・単位）</th></tr>
${gr.rows.map(row => `<tr><td>${row[0]}</td><td>${row[1]}${row[2] ? `<br><span style='color:var(--blue);font-weight:700'>${row[2]}</span>` : ""}</td></tr>`).join("\n")}
</table></div></details>`).join("\n");

const DEF_TABLE = `<p style='margin:4px 0;font-size:14px;color:var(--muted)'>小単元をタップすると開きます。</p>` + GLOS("rigid", [
{ title:"1 力のモーメント", rows:[
  ["剛体","力を受けても変形しない（と考えてよい）大きさのある物体。大きさがあるので、回転を考える必要がある"],
  ["作用線","力の作用点を通り、力の向きに引いた直線"],
  ["力のモーメント","力が物体を回転させるはたらきの大きさ。力の大きさ × うでの長さ。反時計回りを正とすることが多い",`${M} ＝ ${F}${l}〔N·m〕`],
  ["うでの長さ","回転軸（点 O）から<b>作用線</b>までの距離（垂線の長さ）。作用点までの距離ではない",`${l} ＝ ${r} sin ${th}（${r}：O から作用点まで、${th}：${r} と力のなす角）`],
  ["力の分解で見る","力を、O と作用点を結ぶ線に沿った成分と垂直な成分に分けると、回転させるのは垂直な成分だけ",`${M} ＝ (${F} sin ${th})・${r}`],
  ["作用線上の移動","力の作用点を作用線上で移動させても、剛体に対するはたらき（並進・回転）は変わらない"]
]},
{ title:"2 力の合成と偶力", rows:[
  ["平行な2力の合成","同じ向きの平行な2力の合力は、大きさが和で、作用線は2力の作用点を力の大きさの逆比に内分する点を通る",`${F}₁${l}₁ ＝ ${F}₂${l}₂`],
  ["偶力","大きさが等しく、向きが逆で、作用線が平行な（一致しない）2力。合力は 0 だが、回転させるはたらきがある",`${M} ＝ ${F}${Q("d")}（${Q("d")}：2つの作用線の距離）`],
  ["偶力のモーメント","どの点のまわりで計算しても同じ値になる。だから偶力は1つの力に合成できない"]
]},
{ title:"3 剛体のつり合い", rows:[
  ["力のつり合い" + BASIC,"物体にはたらく力の合力が 0。成分ごとに書くと、水平・鉛直それぞれで和が 0",`Σ${F}<sub>x</sub> ＝ 0、Σ${F}<sub>y</sub> ＝ 0`],
  ["剛体のつり合いの条件","① 力の合力が 0（並進しない）　② 任意の点のまわりの力のモーメントの和が 0（回転しない）",`Σ${M} ＝ 0`],
  ["回転軸の選び方","つり合っていれば、どの点のまわりでもモーメントの和は 0。未知の力が多く集まる点を軸にすると、それらのモーメントが 0 になり式が簡単になる"]
]},
{ title:"4 重心", rows:[
  ["重心","物体の各部分にはたらく重力の合力の作用点。重力は重心に1つの力 " + Q("M") + g + " がはたらくと考えてよい"],
  ["重心の座標 " + NOCALC,"小さな部分（質量 " + m + "₁, " + m + "₂, …）に分け、位置を質量で重みづけして平均する",`${xG} ＝ ${d(m+"₁"+x+"₁ ＋ "+m+"₂"+x+"₂ ＋ …", m+"₁ ＋ "+m+"₂ ＋ …")}`],
  ["重心の座標 " + CALC,"分割を限りなく細かくすると、和が積分になる。線密度 " + lam + "(" + x + ")〔kg/m〕の棒では",`${xG} ＝ ${d(INT("0",L)+x+lam+"("+x+")d"+x, INT("0",L)+lam+"("+x+")d"+x)}`],
  ["重心と支点","1点でつるした物体が静止すると、重心は支点の真下にある（糸の延長線上）"],
  ["倒れない条件","重心を通る鉛直線が、物体と床が接している面（底面）の内側を通る"]
]}]);

const DERIVE = `<h4 style='margin:14px 0 4px'>棒の重心を2通りで求める</h4>
<div class="derive">
<div><h4>${NOCALC} 細かく分けて和をとる</h4>
<p>① 長さ ${L} の棒を ${Q("n")} 個に分ける。${Q("i")} 番目の部分の位置を ${x}<sub>i</sub>、質量を ${m}<sub>i</sub> とする。</p>
<p>② ${xG} ＝ Σ${m}<sub>i</sub>${x}<sub>i</sub> ÷ Σ${m}<sub>i</sub></p>
<p>③ 一様な棒なら、左右対称なので ${xG} ＝ ${L}/2（中点）。</p>
<p>④ 一様でない棒は、重いほうに重心が寄る。左右を2つの部分に分けて、それぞれの重心と質量から求めることもできる。</p></div>
<div><h4>${CALC} 積分する</h4>
<p>① 位置 ${x} の長さ d${x} の部分の質量は d${m} ＝ ${lam}(${x})d${x}。</p>
<p>② ${xG} ＝ ∫${x} d${m} ÷ ∫d${m} ＝ ∫₀<sup>${L}</sup>${x}${lam}d${x} ÷ ∫₀<sup>${L}</sup>${lam}d${x}</p>
<p>③ 一様（${lam} 一定）：${xG} ＝ ${lam}${L}²/2 ÷ ${lam}${L} ＝ ${L}/2</p>
<p>④ ${lam} ＝ ${Q("k")}${x}（端ほど重い）：${xG} ＝ ${Q("k")}${L}³/3 ÷ ${Q("k")}${L}²/2 ＝ 2${L}/3</p></div>
</div>
<p style='font-size:14px;color:var(--muted);margin:4px 0'>Σ（和）を限りなく細かくしたものが ∫（積分）。どちらも「位置を質量で重みづけした平均」という同じ考え方である。</p>`;

const FORMULAS = `<p class="formula">力のモーメント：${M} ＝ ${F}${l} ＝ ${F}${r} sin ${th}（反時計回りを正）　偶力：${M} ＝ ${F}${Q("d")}</p>
<p class="formula">つり合い：Σ${F}<sub>x</sub> ＝ 0、Σ${F}<sub>y</sub> ＝ 0、Σ${M} ＝ 0（どの点のまわりでも）</p>
<p class="formula">重心：${xG} ＝ Σ${m}<sub>i</sub>${x}<sub>i</sub> ÷ Σ${m}<sub>i</sub>　${CALC} ${xG} ＝ ∫${x}${lam}d${x} ÷ ∫${lam}d${x}</p>
<p class="formula">すべらない条件：${Q("f")} ≦ ${Q("μ")}${Q("N")}（静止摩擦力は最大摩擦力以下）</p>`;

const DIM_TABLE = `<div class="tbl"><table>
<tr><th>量</th><th>単位</th><th>次元</th></tr>
<tr><td>力 ${F}</td><td>N ＝ kg·m/s²</td><td>〔M〕〔L〕/〔T〕²</td></tr>
<tr><td>長さ ${l}, ${r}, ${x}</td><td>m</td><td>〔L〕</td></tr>
<tr><td>力のモーメント ${M}</td><td>N·m</td><td>〔M〕〔L〕²/〔T〕²</td></tr>
<tr><td>線密度 ${lam}</td><td>kg/m</td><td>〔M〕/〔L〕</td></tr>
<tr><td>sin ${th}・tan ${th}・摩擦係数 ${Q("μ")}</td><td>なし</td><td>次元なし</td></tr></table></div>
<p style='font-size:14px;margin:6px 0'>力のモーメントの単位 N·m は、仕事の単位 J（＝ N·m）と同じ次元だが、モーメントには J を使わない。</p>`;

/* 図：うでの長さ */
const FIG_ARM = `<svg class="graph" viewBox="0 0 320 230" role="img" aria-label="点 O を軸とする長さ 0.50 m の棒の端に、棒の延長と 60° をなす向きに力 F がはたらく。O から作用線への垂線がうでの長さ">
<defs><marker id="rgA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
<line x1="40" y1="120" x2="240" y2="120" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-opacity=".55"/>
<circle cx="40" cy="120" r="6" fill="var(--paper,#fff)" stroke="currentColor" stroke-width="2"/><text x="26" y="112" font-size="13" fill="currentColor">O</text>
<line x1="170" y1="241" x2="290" y2="33" stroke="currentColor" stroke-opacity=".45" stroke-dasharray="5 4"/>
<text x="250" y="50" font-size="12" fill="currentColor" opacity=".7" text-anchor="end">作用線</text>
<line x1="240" y1="120" x2="275" y2="59.4" stroke="#dd5a12" stroke-width="3" marker-end="url(#rgA)"/>
<text x="281" y="66" font-size="15" font-style="italic" font-weight="700" fill="#dd5a12">F</text>
<line x1="240" y1="120" x2="290" y2="120" stroke="currentColor" stroke-opacity=".4" stroke-dasharray="3 3"/>
<path d="M262,120 A22,22 0 0 0 251,101" fill="none" stroke="currentColor"/><text x="266" y="110" font-size="12" fill="currentColor">60°</text>
<line x1="40" y1="120" x2="190" y2="206.6" stroke="#7a4ad8" stroke-width="2.4"/>
<text x="100" y="186" font-size="14" font-style="italic" fill="#7a4ad8">l</text><text x="108" y="186" font-size="12" fill="#7a4ad8">（うでの長さ）</text>
<path d="M181.3,201.6 L186,193.4 L194.7,198.4" fill="none" stroke="#7a4ad8"/>
<text x="140" y="112" font-size="12" fill="currentColor" text-anchor="middle">0.50 m</text>
</svg>`;

/* 図：はしご */
const FIG_LADDER = `<svg class="graph" viewBox="0 0 320 220" role="img" aria-label="なめらかな鉛直の壁に立てかけた一様なはしご。床と 60° をなす。はしごには重力、壁からの垂直抗力、床からの垂直抗力と摩擦力がはたらく">
<defs><marker id="rgB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
<rect x="260" y="10" width="14" height="190" fill="currentColor" fill-opacity=".15"/><line x1="260" y1="10" x2="260" y2="200" stroke="currentColor"/>
<rect x="20" y="200" width="254" height="12" fill="currentColor" fill-opacity=".15"/><line x1="20" y1="200" x2="274" y2="200" stroke="currentColor"/>
<line x1="160" y1="200" x2="260" y2="27" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-opacity=".6"/>
<text x="150" y="196" font-size="13" fill="currentColor">A</text><text x="240" y="24" font-size="13" fill="currentColor">B</text>
<path d="M185,200 A25,25 0 0 0 172.5,178.3" fill="none" stroke="currentColor"/><text x="189" y="192" font-size="12" fill="currentColor">60°</text>
<circle cx="210" cy="113.5" r="4" fill="currentColor"/><text x="216" y="110" font-size="12" fill="currentColor">G</text>
<line x1="210" y1="113.5" x2="210" y2="168" stroke="#22863a" stroke-width="2.6" marker-end="url(#rgB)"/><text x="214" y="160" font-size="13" fill="#22863a">重力 200 N</text>
<line x1="258" y1="27" x2="208" y2="27" stroke="#dd5a12" stroke-width="2.6" marker-end="url(#rgB)"/><text x="150" y="31" font-size="13" fill="#dd5a12">壁の垂直抗力</text>
<line x1="160" y1="200" x2="160" y2="140" stroke="#1d64d8" stroke-width="2.6" marker-end="url(#rgB)"/><text x="64" y="146" font-size="13" fill="#1d64d8">床の垂直抗力</text>
<line x1="160" y1="200" x2="205" y2="200" stroke="#7a4ad8" stroke-width="2.6" marker-end="url(#rgB)"/><text x="98" y="218" font-size="13" fill="#7a4ad8">床の摩擦力 →</text>
</svg>`;

const TF = ["正しい", "誤り"];
const UNITQ = ["N", "N·m", "N/m", "m", "kg·m", "単位なし"];

const SECTIONS = [
{ id:"def", advice:"「うでの長さは作用線までの距離」「つり合いの条件は2つ」を定義カードで確かめよう。", tab:"①定義", title:"① 定義カード",
  intro:`物理基礎では物体を「点」として扱い、力のつり合いだけを考えました。大きさのある物体（剛体）では、<b>回転</b>も考える必要があります。<br>シミュレーターで確かめよう：<br>${ANIM("anim/rigid.html#moment","力のモーメントとうでの長さ")}${ANIM("anim/rigid.html#balance","重心とてこ")}${ANIM("anim/rigid.html#ladder","はしごのつり合い")}${ANIM(BASICLAB+"anim/balance.html","力のつり合い（物理基礎ラボ）")}`,
  ref:{label:"定義カードと導出を見る", html:DEF_TABLE + DERIVE},
  groups:[
  { title:"A. 力のモーメント", qs:[
    {id:"d1",type:"blanks",text:`力のモーメントは ${M} ＝ ${F} × {0} で、この長さを{1}という。`,
     options:[["回転軸から作用線までの距離","回転軸から作用点までの距離","作用点が動いた距離"],["うでの長さ","変位","作用線"]],answer:[0,0],
     explain:`回転軸から作用線に下ろした垂線の長さです。作用点までの距離 ${r} と、力となす角 ${th} を使うと ${l} ＝ ${r} sin ${th}。${ANIM("anim/rigid.html#moment","うでの長さを見る")}`},
    {id:"d2",type:"choice",prompt:`長さ 0.30 m のスパナの端に、スパナと 30° をなす向きに 10 N の力を加えた。ボルト（スパナの他端）のまわりの力のモーメントの大きさはどれか。`,
     options:["1.5 N·m","3.0 N·m","2.6 N·m"],answer:0,
     explain:`${M} ＝ ${F}${r} sin ${th} ＝ 10 × 0.30 × sin 30° ＝ 1.5 N·m。3.0 N·m はスパナに垂直に押したとき（最大）、2.6 N·m は cos を使ったときの値です。`},
    {id:"d3",type:"choice",prompt:"剛体にはたらく力の作用点を、その力の作用線上で別の点に移した。剛体に対するはたらきはどうなるか。",
     options:["変わらない（どの点のまわりでも、うでの長さが変わらない）","作用点が軸から遠くなれば、モーメントが大きくなる","並進させるはたらきだけが変わる"],answer:0,
     explain:"うでの長さは「軸から作用線までの距離」なので、作用線上のどこに作用点があっても同じです。はしごや棒の問題で、力を作用線上で動かして考えてよい理由です。"}
  ]},
  { title:"B. 力の合成と偶力", qs:[
    {id:"d4",type:"num",prompt:`水平な棒の ${x} ＝ 0 に下向き 10 N、${x} ＝ 0.40 m に下向き 30 N の力がはたらく。2力の合力の作用線の位置 ${x} を求めよ。`,answer:0.3,tol:0.005,unit:"m",
     traps:{"0.2":"2点の中点ではありません。大きい力のほうに寄ります。","0.1":"それは 30 N の作用点から合力の作用線までの距離です。"},
     explain:`合力 40 N の作用線は、2つの作用点を力の大きさの<b>逆比</b>（30 : 10）に内分する点。10 × ${x} ＝ 30 × (0.40 − ${x}) より ${x} ＝ 0.30 m。「どの点のまわりのモーメントも、もとの2力と合力で等しい」という条件と同じです。`},
    {id:"d5",type:"blanks",text:`偶力の合力は{0}であり、偶力のモーメントは、計算する回転軸の位置に{1}。`,
     options:[["0","2F","F"],["よらない","よって変わる"]],answer:[0,0],
     explain:`距離 ${Q("d")} 離れた偶力のモーメントは、どの点のまわりでも ${F}${Q("d")}。合力が 0 なので並進はさせず、回転だけさせます。ハンドルや水道の蛇口を回す力が例です。`}
  ]},
  { title:"C. 剛体のつり合い", qs:[
    {id:"d6",type:"multi",prompt:"静止している剛体について、正しいものをすべて選べ。",
     options:["はたらく力の合力は 0","どの点のまわりでも、力のモーメントの和は 0","重心のまわりの力のモーメントの和だけが 0 で、ほかの点のまわりでは 0 とは限らない","合力が 0 なら、回転することはない"],answer:[0,1],
     explain:"静止の条件は ① 合力 0 と ② モーメントの和 0 の2つ。合力が 0 なら、ある1点のまわりで和が 0 のとき、ほかのすべての点のまわりでも 0 になります。偶力のように合力が 0 でも回転することがあるので、①だけでは不十分です。"},
    {id:"d7",type:"choice",prompt:"剛体のつり合いの問題で、モーメントを考える点（回転軸）はどのように選ぶとよいか。",
     options:["未知の力の作用点（とくに未知の力が多く集まる点）を選ぶ","必ず重心を選ぶ","必ず物体の端を選ぶ"],answer:0,
     explain:"その点を通る力のモーメントは 0（うでの長さ 0）になるので、未知数が減ります。どの点を選んでも正しい答えが出ます。"}
  ]},
  { title:"D. 重心", qs:[
    {id:"d8",type:"blanks",text:`質量 ${m}₁, ${m}₂ の小物体が ${x}₁, ${x}₂ にあるとき、重心は ${xG} ＝ (${m}₁${x}₁ ＋ ${m}₂${x}₂) ÷ {0}。`,
     options:[[`(${m}₁ ＋ ${m}₂)`,`(${x}₁ ＋ ${x}₂)`,"2"]],answer:[0],
     explain:`位置を質量で重みづけした平均です。${m}₁ ＝ ${m}₂ のときだけ、中点 (${x}₁ ＋ ${x}₂)/2 になります。`},
    {id:"d9",type:"choice",prompt:`${CALC} 長さ ${L}、線密度 ${lam}(${x})〔kg/m〕の棒の重心 ${xG} を表す式はどれか（${x} は一端からの距離）。`,
     options:[`∫₀<sup>L</sup>${x}${lam} d${x} ÷ ∫₀<sup>L</sup>${lam} d${x}`,`∫₀<sup>L</sup>${x}${lam} d${x}`,`∫₀<sup>L</sup>${x} d${x} ÷ ${L}`],answer:0,
     explain:`Σ${m}<sub>i</sub>${x}<sub>i</sub> ÷ Σ${m}<sub>i</sub> の和を積分にしたもの。分母 ∫${lam}d${x} は棒の質量です。3つ目は一様な棒のときだけ正しい式です。`},
    {id:"d10",type:"choice",prompt:"床に置いた物体が倒れないための条件として正しいものはどれか。",
     options:["重心を通る鉛直線が、床と接している面（底面）の内側を通る","重心が底面より低い位置にある","重心が物体の中心にある"],answer:0,
     explain:"重心を通る鉛直線が底面の外に出ると、重力のモーメントが物体を倒す向きにはたらきます。底面の端が回転軸になると考えます。"}
  ]}]
},
{ id:"read", advice:"力を作用線ごと図にかき、軸から作用線への垂線（うでの長さ）を書き込もう。", tab:"②読解", title:"② 読解ドリル",
  intro:"電卓はなるべく使いません。図や問題文から、力の作用線・うでの長さ・回転の向きを読み取る練習です。",
  groups:[
  { title:"A. うでの長さを読む", lead:`長さ 0.50 m の棒が点 O を軸として回転できる。棒の端に、棒の延長と 60° をなす向きに 20 N の力 ${F} を加えた。${ANIM("anim/rigid.html#moment&r=0.5&F=20&phi=60","この値で確かめる")}`, figure:FIG_ARM, qs:[
    {id:"ra1",type:"num",prompt:"O のまわりの力のモーメントの大きさ（有効数字2桁）",answer:8.66,tol:0.1,unit:"N·m",
     traps:{"10":"0.50 m は O から作用点までの距離です。うでの長さは作用線までの距離 0.50 sin 60° です。","5":"sin と cos を取り違えていませんか。図の紫の線（垂線）の長さを考えます。"},
     explain:`${l} ＝ 0.50 × sin 60° ≒ 0.433 m、${M} ＝ 20 × 0.433 ≒ 8.7 N·m。力を棒に垂直な成分 20 sin 60° と平行な成分に分けて、垂直な成分 × 0.50 m としても同じです。`},
    {id:"ra2",type:"choice",prompt:"力の大きさは 20 N のまま向きだけを変える。O のまわりのモーメントが最大になるのはどの向きか。",
     options:["棒に垂直な向き","棒に平行な向き（棒の延長方向）","棒と 45° の向き"],answer:0,
     explain:`${l} ＝ ${r} sin ${th} は ${th} ＝ 90° で最大（${l} ＝ ${r}）。棒に平行に引くと作用線が O を通り、モーメントは 0 です。ドアを押すとき、ドアに垂直に押すのが楽な理由です。`},
    {id:"ra3",type:"choice",prompt:"図の力 F は、棒を O のまわりにどちら向きに回転させるか。",
     options:["反時計回り","時計回り","回転させない"],answer:0,
     explain:"作用点（棒の右端）で、力は上向きの成分をもちます。O の右側を上に押すので反時計回りです。反時計回りを正とすると、このモーメントは ＋8.7 N·m です。"}
  ]},
  { title:"B. てこを読む", lead:"軽い棒（重さは無視）を支点で支え、支点の左 0.20 m の位置に 30 N のおもりをつるした。右側に 20 N のおもりをつるして、棒を水平につり合わせたい。", qs:[
    {id:"rb1",type:"num",prompt:"20 N のおもりをつるす位置は、支点の右何 m か。",answer:0.3,tol:0.005,unit:"m",
     traps:{"0.2":"左右のおもりの重さが違うので、同じ距離ではつり合いません。","0.13":"30 × 0.20 ＝ 20 × x の両辺を取り違えていませんか。"},
     explain:"支点のまわりのモーメント：30 × 0.20 ＝ 20 × x より x ＝ 0.30 m。軽いほうを遠くにつるします。"},
    {id:"rb2",type:"num",prompt:"このとき、支点が棒を支える力の大きさ",answer:50,tol:0.1,unit:"N",
     traps:{"10":"支点は2つのおもりの重さを両方支えます。","0":"モーメントは 0 でも、力のつり合いから支点の力は 0 になりません。"},
     explain:"鉛直方向の力のつり合い：支点の力 ＝ 30 ＋ 20 ＝ 50 N（上向き）。つり合いの条件は「力」と「モーメント」の2つです。"},
    {id:"rb3",type:"choice",prompt:"rb1 で、支点のまわりのモーメントの式に、支点が支える力が出てこないのはなぜか。",
     options:["支点の力の作用線が回転軸を通り、うでの長さが 0 だから","支点の力は 0 だから","支点の力は上向きなので、モーメントを考えなくてよいから"],answer:0,
     explain:"支点の力（50 N）は 0 ではありませんが、うでの長さ 0 なのでモーメントは 0。未知の力の作用点を軸にすると、その力を式から消せます。"}
  ]},
  { title:"C. はしごを読む", lead:`なめらかな鉛直の壁に、重さ 200 N の一様なはしごを、床と 60° をなすように立てかけた。床はあらく、はしごは静止している。${ANIM("anim/rigid.html#ladder&th=60&w=0","はしごのつり合い")}`, figure:FIG_LADDER, qs:[
    {id:"rc1",type:"multi",prompt:"はしごにはたらく力をすべて選べ。",
     options:["重力（重心 G に鉛直下向き）","壁からの垂直抗力（水平）","床からの垂直抗力（鉛直上向き）","床からの静止摩擦力（水平）","壁からの摩擦力","はしごが壁を押す力"],answer:[0,1,2,3],
     explain:"壁はなめらかなので摩擦力ははたらきません。「はしごが壁を押す力」は壁が受ける力で、はしごにはたらく力ではありません（作用・反作用）。"},
    {id:"rc2",type:"choice",prompt:"床からの静止摩擦力の向きはどちらか。",
     options:["壁に向かう向き","壁から離れる向き","摩擦力ははたらかない"],answer:0,
     explain:"水平方向の力は、壁の垂直抗力（壁から離れる向き）と床の摩擦力だけ。つり合うには、摩擦力は壁に向かう向きです。はしごの下端は、壁から離れる向きにすべろうとしています。"},
    {id:"rc3",type:"choice",prompt:"このはしごで、どの点のまわりのモーメントを考えると、式がいちばん簡単になるか。",
     options:["床との接点 A（未知の力2つのうでの長さが 0）","重心 G","壁との接点 B（未知の力1つ）"],answer:0,
     explain:"A には床の垂直抗力と摩擦力の2つの未知の力がはたらくので、A のまわりでは、残る未知数は壁の垂直抗力だけになります。B のまわりでも解けますが、未知数が2つ残ります。"}
  ]},
  { title:"D. 重心を読む", qs:[
    {id:"rd1",type:"num",prompt:`質量 2.0 kg の小物体が ${x} ＝ 0、3.0 kg の小物体が ${x} ＝ 0.50 m にある（軽い棒でつながっている）。重心の位置を求めよ。`,answer:0.3,tol:0.005,unit:"m",
     traps:{"0.25":"中点ではありません。重いほうに寄ります。","0.2":"それは 3.0 kg の物体から重心までの距離です。"},
     explain:`${xG} ＝ (2.0 × 0 ＋ 3.0 × 0.50) ÷ (2.0 ＋ 3.0) ＝ 0.30 m。${ANIM("anim/rigid.html#balance","重心とてこ")}`},
    {id:"rd2",type:"num",prompt:`${CALC} 長さ 1.2 m の棒の線密度が、一端からの距離 ${x} に比例する（${lam} ＝ ${Q("k")}${x}）。その端から重心までの距離を求めよ。`,answer:0.8,tol:0.01,unit:"m",
     traps:{"0.6":"一様な棒ではありません。x が大きいほど重いので、重心は中点より先です。","0.4":"重心は重いほう（x が大きいほう）に寄ります。"},
     explain:`${xG} ＝ ∫₀<sup>1.2</sup>${Q("k")}${x}² d${x} ÷ ∫₀<sup>1.2</sup>${Q("k")}${x} d${x} ＝ (${Q("k")} × 1.2³/3) ÷ (${Q("k")} × 1.2²/2) ＝ 2 × 1.2/3 ＝ 0.80 m。`},
    {id:"rd3",type:"choice",prompt:"「物体の重心は、必ず物体の内部（物質がある所）にある。」",options:TF,answer:1,
     explain:"誤り。リング（輪）の重心は中心で、そこには物質がありません。L字形や馬蹄形の物体も重心が外にあることがあります。"},
    {id:"rd4",type:"blanks",prompt:`${NOCALC} と ${CALC} の対応を読む。`,text:`重心の式の分子 Σ${m}<sub>i</sub>${x}<sub>i</sub> は、微積では {0} にあたり、分母 Σ${m}<sub>i</sub> は {1} にあたる。`,
     options:[[`∫${x} d${m}`,`∫d${m}`,`d${m}/d${x}`],[`∫${x} d${m}`,`∫d${m}（全質量）`,`d${m}/d${x}`]],answer:[0,1],
     explain:`Σ を ∫ に、${m}<sub>i</sub> を d${m} ＝ ${lam}d${x} にかえると、和の式が積分の式になります。d${m}/d${x} は線密度 ${lam} です。`}
  ]}]
},
{ id:"dim", advice:"モーメントは「力 × 長さ」。重心の式は「長さ」になるか確かめよう。", tab:"③次元", title:"③ 次元チェック",
  intro:`力のモーメントは N·m、重心の座標は m。積分 ∫…d${x} は「× m」です。`,
  ref:{label:"次元の表を見る", html:DIM_TABLE},
  groups:[
  { title:"A. 計算せずに単位を予測する", lead:`${F}〔N〕、${l}, ${x}〔m〕、${m}〔kg〕、${lam}〔kg/m〕とする。`, qs:[
    {id:"da1",type:"choice",prompt:`${F}${l}`,options:UNITQ,answer:1,explain:"N × m ＝ N·m（力のモーメント）。",two:true},
    {id:"da2",type:"choice",prompt:`(${m}₁${x}₁ ＋ ${m}₂${x}₂) ÷ (${m}₁ ＋ ${m}₂)`,options:UNITQ,answer:3,explain:"kg·m ÷ kg ＝ m（重心の座標）。",two:true},
    {id:"da3",type:"choice",prompt:`${CALC} ∫${x}${lam} d${x}`,options:UNITQ,answer:4,explain:"m × kg/m × m ＝ kg·m（重心の式の分子）。",two:true},
    {id:"da4",type:"choice",prompt:`${CALC} ∫${lam} d${x}`,options:["kg","kg·m","kg/m","単位なし"],answer:0,explain:"kg/m × m ＝ kg（棒の質量）。",two:true},
    {id:"da5",type:"choice",prompt:`摩擦力 ÷ 垂直抗力（${Q("f")}/${Q("N")}）`,options:UNITQ,answer:5,explain:"N ÷ N で単位なし。摩擦係数 μ と比べる量です。",two:true}
  ]},
  { title:"B. 式の次元を判定する", qs:[
    {id:"db1",type:"multi",prompt:"次の式のうち、次元が合わないものをすべて選べ。",
     options:[`${M} ＝ ${F} ÷ ${l}`,`${xG} ＝ (${m}₁${x}₁ ＋ ${m}₂${x}₂) ÷ (${x}₁ ＋ ${x}₂)`,`${F}₁${l}₁ ＝ ${F}₂${l}₂`,`${Q("μ")} ≧ 1 ÷ (2 tan ${th})`,`${xG} ＝ 2${L}/3`],answer:[0,1],
     explain:`${F}/${l} は N/m でモーメントではありません。(kg·m) ÷ m ＝ kg で、重心の座標（m）になりません（分母は質量の和）。`}
  ]},
  { title:"C. 次元で見つからない誤り", qs:[
    {id:"dc1",type:"choice",prompt:`うでの長さを ${l} ＝ ${r} cos ${th} と書いてしまった。どうすれば誤りに気づけるか。`,
     options:[`${th} ＝ 0°（力が棒に平行）を代入すると ${M} ＝ ${F}${r} になり、「回さないはず」と矛盾する`,"次元チェックで見つかる","気づく方法はない"],answer:0,
     explain:`sin と cos はどちらも単位がないので、次元では区別できません。力を棒の方向に引いても回らない（${M} ＝ 0）という極端な場合で確かめます。`},
    {id:"dc2",type:"choice",prompt:`はしごが静止するための条件 ${Q("μ")} ≧ 1/(2 tan ${th})（${th}：床とのなす角）で、${th} → 90°（はしごを鉛直に立てる）とどうなるか。この結果は妥当か。`,
     options:["必要な μ → 0。鉛直に立てれば壁を押さないので摩擦はいらない。妥当","必要な μ → ∞。妥当でない","必要な μ → 0.5。妥当"],answer:0,
     explain:`tan ${th} → ∞ なので 1/(2 tan ${th}) → 0。反対に、はしごを寝かせる（${th} を小さくする）ほど大きな摩擦が必要になります。式の正しさを、極端な場合の直感で確かめられます。`}
  ]}]
},
{ id:"step", advice:"力をすべて作用線つきで図にかき、①力のつり合い（水平・鉛直）②モーメントのつり合い（軸を選ぶ）の順に式を書こう。", tab:"④手順", title:"④ 手順固定の演習",
  intro:`7ステップで解きます。①物体と力をすべて図示 → ②既知・未知 → ③式を選ぶ（力のつり合い・モーメントのつり合い、回転軸） → ④文字式 → ⑤次元 → ⑥数値 → ⑦妥当性（別の軸でも確かめる）。反時計回りを正とする。`,
  ref:{label:"式を見る", html:FORMULAS},
  groups:[
  { title:"問題1（棒を2本の糸でつるす・すべてのステップ）", lead:ANIM("anim/rigid.html#balance","重心とてこで確かめる"),
    quote:"長さ 1.0 m、重さ 40 N の一様な棒 AB の両端を、2本の糸で鉛直につるして水平に保つ。A から 0.20 m の位置に重さ 60 N のおもりをつるした。糸 A、糸 B の張力 T<sub>A</sub>、T<sub>B</sub> を求めよ。", qs:[
    {id:"s11",type:"multi",prompt:"ステップ1　棒にはたらく力をすべて選べ。",
     options:["糸 A の張力（A に上向き）","糸 B の張力（B に上向き）","棒の重力 40 N（中点に下向き）","おもりが棒を引く力 60 N（A から 0.20 m に下向き）","おもりの重力 60 N（おもりに下向き）"],answer:[0,1,2,3],
     explain:"「おもりの重力」はおもりにはたらく力です。棒にはたらくのは、おもりをつるした糸が棒を引く力（おもりが静止しているので大きさは 60 N）です。"},
    {id:"s12",type:"choice",prompt:"ステップ3　T<sub>B</sub> を先に求めたい。どの点のまわりのモーメントを考えるか。",
     options:["A のまわり（T<sub>A</sub> のモーメントが 0 になる）","B のまわり","棒の中点のまわり"],answer:0,
     explain:"A を軸にすると、未知数 T<sub>A</sub> のうでの長さが 0 になり、未知数は T<sub>B</sub> だけになります。"},
    {id:"s13",type:"choice",prompt:"ステップ4　A のまわりのモーメントのつり合いの式はどれか。",
     options:["T<sub>B</sub> × 1.0 ＝ 40 × 0.50 ＋ 60 × 0.20","T<sub>B</sub> × 1.0 ＝ 40 × 1.0 ＋ 60 × 0.20","T<sub>B</sub> ＝ 40 ＋ 60"],answer:0,
     explain:"T<sub>B</sub> は反時計回り、棒の重力（中点、うで 0.50 m）とおもり（うで 0.20 m）は時計回り。反時計回り ＝ 時計回り、と書いてもよい。棒の重力は重心（中点）にはたらきます。"},
    {id:"s14",type:"num",prompt:"ステップ6　T<sub>B</sub>",answer:32,tol:0.1,unit:"N",
     traps:{"52":"棒の重力の作用点は中点（A から 0.50 m）です。","50":"モーメントのつり合いを使います。単純に半分ずつではありません。","68":"それは T_A です。A のまわりの式に出てくるのは T_B です。"},
     explain:"T<sub>B</sub> ＝ 20 ＋ 12 ＝ 32 N。"},
    {id:"s15",type:"num",prompt:"T<sub>A</sub>（力のつり合いから）",answer:68,tol:0.1,unit:"N",
     traps:{"32":"それは T_B です。","100":"T_A ＋ T_B ＝ 100 N です。"},
     explain:"鉛直方向：T<sub>A</sub> ＋ T<sub>B</sub> ＝ 40 ＋ 60 より T<sub>A</sub> ＝ 100 − 32 ＝ 68 N。"},
    {id:"s16",type:"choice",prompt:"ステップ7　答えを確かめる方法として最も適切なものはどれか。",
     options:["B のまわりのモーメントの式 T<sub>A</sub> × 1.0 ＝ 40 × 0.50 ＋ 60 × 0.80 を確かめる","T<sub>A</sub> と T<sub>B</sub> が等しいか確かめる","T<sub>A</sub> が 60 N より小さいか確かめる"],answer:0,
     explain:"20 ＋ 48 ＝ 68 N で一致します。つり合っていればどの点のまわりでも和は 0 なので、別の軸で確かめられます。おもりが A に近いので T<sub>A</sub> ＞ T<sub>B</sub> も妥当です。"}
  ]},
  { title:"問題2（はしご・ステップ1〜3を誘導）", lead:ANIM("anim/rigid.html#ladder&th=60&w=0&W=200","この問題の値で確かめる"),
    quote:"なめらかな鉛直の壁に、長さ L、重さ 200 N の一様なはしご AB を、床と 60° をなすように立てかけた（A が床、B が壁）。床はあらい。tan 60° ＝ 1.73 とする。(1) 壁からの垂直抗力 N<sub>B</sub>、(2) 床からの垂直抗力 N<sub>A</sub>、(3) 床からの摩擦力 f を求めよ。(4) はしごがすべらないための床の静止摩擦係数 μ の最小値を求めよ。", qs:[
    {id:"s21",type:"blanks",prompt:"ステップ3　力のつり合い（水平・鉛直）を書く。",text:"水平：f ＝ {0}　鉛直：N<sub>A</sub> ＝ {1}",
     options:[["N_B","N_A","200 N"],["200 N","N_B","f"]],answer:[0,0],
     explain:"水平方向の力は f（壁向き）と N<sub>B</sub>（壁から離れる向き）、鉛直方向は N<sub>A</sub>（上）と重力（下）だけです。"},
    {id:"s22",type:"blanks",prompt:"ステップ3　A のまわりのうでの長さを読む。",text:`N<sub>B</sub> のうでの長さ：{0}　重力のうでの長さ：{1}`,
     options:[[`${L} sin 60°`,`${L} cos 60°`,`${L}`],[`(${L}/2) cos 60°`,`(${L}/2) sin 60°`,`${L}/2`]],answer:[0,0],
     explain:`N<sub>B</sub> は水平な力なので、うでの長さは A から B までの<b>高さ</b> ${L} sin 60°。重力は鉛直な力なので、うでの長さは A から G までの<b>水平距離</b> (${L}/2) cos 60°。作用線までの距離を、力の向きに垂直な方向で測ります。`},
    {id:"s23",type:"num",prompt:"ステップ6　(1) N<sub>B</sub>（有効数字2桁）",answer:57.8,tol:0.8,unit:"N",
     traps:{"100":"重力のうでの長さは L/2 ではなく (L/2) cos 60° です。","173":"sin と cos が逆になっていませんか（N_B のうでは L sin 60°）。","115":"重心は中点なので、重力のうでは (L/2) cos 60° です。"},
     explain:`N<sub>B</sub> × ${L} sin 60° ＝ 200 × (${L}/2) cos 60° より N<sub>B</sub> ＝ 200/(2 tan 60°) ＝ 100/1.73 ≒ 58 N。${L} は約分されて消えます。`},
    {id:"s24",type:"num",prompt:"(2) N<sub>A</sub>",answer:200,tol:0.5,unit:"N",
     explain:"鉛直方向の力のつり合いから N<sub>A</sub> ＝ 200 N。はしごの傾きによりません。"},
    {id:"s25",type:"num",prompt:"(3) f（有効数字2桁）",answer:57.8,tol:0.8,unit:"N",
     traps:{"200":"それは N_A です。水平方向のつり合いから f ＝ N_B です。"},
     explain:"水平方向：f ＝ N<sub>B</sub> ≒ 58 N。"},
    {id:"s26",type:"num",prompt:"(4) μ の最小値（有効数字2桁）",answer:0.289,tol:0.01,unit:"",
     traps:{"3.46":"μ ＝ f/N_A です。逆になっていませんか。"},
     explain:`すべらない条件 f ≦ μN<sub>A</sub> より μ ≧ f/N<sub>A</sub> ＝ 57.8/200 ≒ 0.29。文字式では μ ≧ 1/(2 tan ${th})。`},
    {id:"s27",type:"choice",prompt:"ステップ7　はしごを寝かせて、床とのなす角を 60° から 45° にした。必要な μ の最小値はどうなるか。",
     options:["大きくなる（0.50）","小さくなる","変わらない"],answer:0,
     explain:`1/(2 tan 45°) ＝ 0.50。寝かせるほど重力のうでが長く、壁の垂直抗力のうでが短くなるので、大きな N<sub>B</sub>（＝ f）が必要です。${ANIM("anim/rigid.html#ladder&th=45&w=0&W=200","45° で確かめる")}`}
  ]},
  { title:"問題3（重心と倒れる条件・答えだけ入力）", lead:`紙に7ステップを書いて解き、答えを入力せよ。${ANIM("anim/rigid.html#balance","重心とてこ")}`,
    quote:"(a) 1辺 0.60 m の正方形の一様な薄い板から、1つの角を含む1辺 0.30 m の正方形を切り取った（右上の角を切り取る）。左下の角を原点、右向きを x 軸とする。(b) 長さ 2.0 m の棒の線密度が、端 A からの距離 x〔m〕を使って λ ＝ 1.0 ＋ 0.50x〔kg/m〕と表される。(c) 高さ 0.80 m、幅 0.40 m の一様な直方体をあらい板にのせ、板を少しずつ傾ける（すべらないとする）。", qs:[
    {id:"s31",type:"num",prompt:"(a) 残った板の重心の x 座標",answer:0.25,tol:0.005,unit:"m",
     traps:{"0.3":"切り取る前の重心です。切り取った部分の分だけ左に寄ります。","0.225":"面積で重みづけします。切り取った部分（面積 0.09 m²、重心 x ＝ 0.45 m）を「負の質量」として引きます。"},
     explain:"全体（面積 0.36、x ＝ 0.30）から、切り取った部分（面積 0.09、x ＝ 0.45）を引く：x<sub>G</sub> ＝ (0.36 × 0.30 − 0.09 × 0.45) ÷ (0.36 − 0.09) ＝ 0.0675 ÷ 0.27 ＝ 0.25 m。残りを2つの長方形に分けて求めても同じです。"},
    {id:"s32",type:"num",prompt:`(b) ${CALC} 棒の質量`,answer:3,tol:0.02,unit:"kg",
     traps:{"2":"λ が一定ではありません。∫(1.0 ＋ 0.50x)dx を計算します。","2.5":"0.50x の積分は 0.25x² です。"},
     explain:"∫₀² (1.0 ＋ 0.50x)dx ＝ [x ＋ 0.25x²]₀² ＝ 2.0 ＋ 1.0 ＝ 3.0 kg。"},
    {id:"s33",type:"num",prompt:`(b) ${CALC} A から重心までの距離（有効数字3桁）`,answer:1.11,tol:0.01,unit:"m",
     traps:{"1":"一様な棒ではありません。A から遠いほど重いので、重心は中点より先です。","3.33":"それは ∫xλdx です。棒の質量 3.0 kg で割ります。"},
     explain:"∫₀² x(1.0 ＋ 0.50x)dx ＝ [0.5x² ＋ x³/6]₀² ＝ 2.0 ＋ 1.33 ＝ 3.33。x<sub>G</sub> ＝ 3.33 ÷ 3.0 ≒ 1.11 m。"},
    {id:"s34",type:"num",prompt:"(c) 直方体が倒れはじめるときの、板の傾斜角 θ の tan θ",answer:0.5,tol:0.01,unit:"",
     traps:{"2":"tan θ ＝ 幅/高さ です。逆になっていませんか。","0.25":"重心は直方体の中心にあります。半分ずつ（0.20 m と 0.40 m）の比です。"},
     explain:"重心（中心）を通る鉛直線が、底面の下側の端を通るとき倒れはじめます。tan θ ＝ (幅の半分)/(高さの半分) ＝ 0.20/0.40 ＝ 0.50（θ ≒ 27°）。"},
    {id:"s35",type:"checklist",prompt:"解き終えたら、自分の答案を点検しよう（採点には入りません）。",
     items:["物体にはたらく力だけを、作用点・作用線つきで図にかいた（物体が及ぼす力と区別した）","重力は重心にかいた","力のつり合いを水平・鉛直の2式で書いた","回転軸を、未知の力が集まる点に選んだ","うでの長さを、軸から作用線への垂線で測った","別の点のまわりのモーメントでも確かめた"]}
  ]}]
},
{ id:"sum", advice:"「力のつり合い（並進）」と「モーメントのつり合い（回転）」の2本立てで考えよう。", tab:"まとめ", title:"単元のまとめ",
  intro:"計算はしません。どの考え方を使うかを答えます。",
  ref:{label:"式を見る", html:FORMULAS},
  groups:[{ title:"考え方を選ぶ", qs:[
    {id:"m1",type:"choice",prompt:"ナットを回すとき、同じ力で大きなモーメントを得たい。",
     options:["長いスパナを使い、スパナに垂直に力を加える","短いスパナを使う","スパナの向きに力を加える"],answer:0,
     explain:`${M} ＝ ${F}${r} sin ${th}。${r} を大きく、${th} ＝ 90° にします。`},
    {id:"m2",type:"choice",prompt:"静止している棒にはたらく、2つの未知の力を求めたい。",
     options:["力のつり合いの式と、モーメントのつり合いの式を組み合わせる","力のつり合いの式だけで求める","モーメントは考えなくてよい"],answer:0,
     explain:"剛体では、力のつり合い（最大2式）とモーメントのつり合い（1式）を使えます。"},
    {id:"m3",type:"choice",prompt:"モーメントのつり合いの式を書くとき、回転軸を選びたい。",
     options:["未知の力が集まる点を選ぶ","いつも重心を選ぶ","力がはたらいていない点を選ぶ"],answer:0,
     explain:"その点を通る力のモーメントは 0 になるので、未知数を減らせます。"},
    {id:"m4",type:"choice",prompt:"いくつかの物体を組み合わせた物体の重心を求めたい。",
     options:["各部分の重心と質量から、質量で重みづけした平均を求める","各部分の重心の中点をとる","いちばん重い部分の重心を答えにする"],answer:0,
     explain:"x<sub>G</sub> ＝ Σm<sub>i</sub>x<sub>i</sub> ÷ Σm<sub>i</sub>。穴があいた物体は、穴の部分を負の質量として引けます。"},
    {id:"m5",type:"choice",prompt:`${CALC} 密度が場所によって変わる棒の重心を求めたい。`,
     options:["∫xλdx ÷ ∫λdx を計算する","棒の中点を答えにする","λ の最大値の位置を答えにする"],answer:0,
     explain:"和を積分にした式です。一様な棒なら中点になることを確かめておこう。"},
    {id:"m6",type:"self",prompt:"次の文を自分の言葉で完成させよ。「物体を質点として扱えず、剛体として扱う必要があるのは（　　）を考えるときである。」",scored:false,
     model:"例：物体の回転を考えるとき。力の作用点の位置（作用線）によって回転のしかたが変わるので、力の大きさと向きだけでなく作用線も必要になる。"}
  ]}]
}
];

registerUnit({
  id: "rigid",
  title: "2 剛体のつり合い",
  sections: SECTIONS
});
})();
