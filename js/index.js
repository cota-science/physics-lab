/*
 * 物理ラボ：単元の一覧（メニュー画面に表示される順番）
 * 学習指導要領「物理」の4つの大項目 (1)様々な運動 (2)波 (3)電気と磁気 (4)原子 にそって並べている。
 *
 * 単元を追加するとき：
 *   1. units/〇〇.js を作り、問題を書く（書き方は物理基礎ラボの units/TEMPLATE.js と同じ）
 *   2. 下の一覧で、その単元の file に "units/〇〇.js" を書く
 *
 * file: null の単元は、メニューに「準備中」と表示されます。
 * href を書いた行は単元ではなく、そのページへのボタンになります（シミュレーターなど）。
 * id は半角英数字とハイフンだけにし、単元ファイルの registerUnit の id と同じにしてください。
 * 単元が多すぎるときは、小単元（例：plane-1, plane-2）に分けて行を増やします。
 */
window.UNIT_LIST = [
  { group: "はじめに", units: [
    { id: "basic-lab",  title: "▶ 物理基礎ラボ（復習）", href: "https://cota-science.github.io/basicphysics-review/", note: "物理基礎の演習・シミュレーター。各単元の「物理基礎の復習」で使う" }
  ]},
  { group: "(1) 様々な運動", units: [
    { id: "anim-deriv", title: "▶ 速度・加速度の定義ラボ",   href: "anim/deriv.html#vel", note: "一般の曲線運動で、Δt を 0 に近づけると平均の速度 Δr/Δt が接線方向の瞬間の速度 dr/dt に、平均の加速度 Δv/Δt が瞬間の加速度 dv/dt になる様子。x-t・v-t グラフの割線と接線、速度を1点から並べた図も。合成と相対（v_B ＝ v_A ＋ v_AB、a_B ＝ a_A ＋ a_AB：加速する電車、クレーン、2つの投射）" },
    { id: "anim-plane", title: "▶ 平面運動ラボ",            href: "anim/plane.html#proj", note: "放物運動を位置・速度・加速度ベクトルで見る。速度ベクトルを1点から並べると Δv はいつも鉛直下向き。投げる角度と到達距離、斜面への投射も" },
    { id: "plane",      title: "1 平面内の運動",            file: "units/plane.js" },
    { id: "anim-rigid", title: "▶ 剛体ラボ",               href: "anim/rigid.html#moment", note: "力のモーメントとうでの長さ（作用点を作用線上で動かす・力の分解）、重心とてこ（密度がかたよった棒の重心を積分で）、はしごのつり合い（どの点のまわりでもモーメントの和が 0）、箱の転倒（押す・斜面で、倒れるのとすべるのはどちらが先か。垂直抗力の作用点が動く）" },
    { id: "rigid",      title: "2 剛体のつり合い",          file: "units/rigid.js" },
    { id: "anim-momentum", title: "▶ 運動量ラボ",          href: "anim/momentum.html#collide", note: "一直線上の衝突（x-t・v-t・p-t・F-t 図が連動、力積 ＝ F-t 図の面積）、平面上の衝突（各球の運動量の変化 ＝ 力積、系の運動量の和が一定のベクトル図）、平面での合体（運動量の矢印の和）、床ではね返るボール（h′ ＝ e²h）" },
    { id: "momentum",   title: "3 運動量と力積",            file: "units/momentum.js" },
    { id: "anim-circular", title: "▶ 円運動ラボ",          href: "anim/circular.html#uniform", note: "等速円運動の位置・速度・加速度ベクトル（速度を1点から並べると Δv は中心向き）、円すい振り子を地面から・回転する人から見る（遠心力）、鉛直面内の円運動と糸がたるむ位置、電車の中のおもり（加速・等速・減速、地面と電車の2つの立場、見かけの重力、糸を切る、単振り子とばね振り子の周期）" },
    { id: "circular",   title: "4 円運動と慣性力",          file: "units/circular.js" },
    { id: "anim-shm",   title: "▶ 単振動ラボ",            href: "anim/shm.html#circle", note: "等速円運動の影が単振動（x・v・a のグラフが連動）、ばね振り子（水平・鉛直）とエネルギー、単振り子（振れ角が大きいと周期が長くなる）、浮力と重力の単振動（水に浮かぶ物体）" },
    { id: "shm",        title: "5 単振動",                  file: "units/shm.js" },
    { id: "anim-gravitation", title: "▶ 万有引力ラボ",     href: "anim/gravitation.html#orbit", note: "人工衛星の軌道（円・楕円・放物線・双曲線、等しい時間の扇形で面積速度一定、エネルギーのグラフ）、ケプラーの第3法則、打ち上げと第2宇宙速度（U(r) ＝ −GM/r の図）、軌道の変更（人工衛星の低軌道→静止軌道、地球→火星の探査機。2回の噴射とΔv・遷移時間・エネルギー）" },
    { id: "gravitation",title: "6 万有引力",                file: "units/gravitation.js" },
    { id: "anim-gas",   title: "▶ 気体分子ラボ",          href: "anim/gas.html#kinetic", note: "分子の運動と圧力（壁が受ける力積から圧力を測る、速さの分布）、p-V 図と状態変化（定積・定圧・等温・断熱、面積 ＝ 仕事、Q ＝ ΔU ＋ W′）、熱機関のサイクルと熱効率" },
    { id: "gas",        title: "7 気体分子の運動",          file: "units/gas.js" }
  ]},
  { group: "(2) 波", units: [
    { id: "wave",       title: "8 波の伝わり方と重ね合わせ", file: null },
    { id: "sound",      title: "9 音（ドップラー効果）",     file: null },
    { id: "light",      title: "10 光",                     file: null }
  ]},
  { group: "(3) 電気と磁気", units: [
    { id: "efield",     title: "11 電場と電位",              file: null },
    { id: "capacitor",  title: "12 コンデンサー",            file: null },
    { id: "dc",         title: "13 直流回路",                file: null },
    { id: "magnetic",   title: "14 電流と磁場",              file: null },
    { id: "induction",  title: "15 電磁誘導",                file: null },
    { id: "ac",         title: "16 交流と電磁波",            file: null }
  ]},
  { group: "(4) 原子", units: [
    { id: "photon",     title: "17 電子と光",                file: null },
    { id: "nucleus",    title: "18 原子と原子核",            file: null }
  ]}
];
