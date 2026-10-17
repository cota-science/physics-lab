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
    { id: "anim-plane", title: "▶ 平面運動ラボ",            href: "anim/plane.html#proj", note: "放物運動を位置・速度・加速度ベクトルで見る。速度ベクトルを1点から並べると Δv はいつも鉛直下向き。投げる角度と到達距離、斜面への投射も" },
    { id: "plane",      title: "1 平面内の運動",            file: "units/plane.js" },
    { id: "anim-rigid", title: "▶ 剛体ラボ",               href: "anim/rigid.html#moment", note: "力のモーメントとうでの長さ（作用点を作用線上で動かす・力の分解）、重心とてこ（密度がかたよった棒の重心を積分で）、はしごのつり合い（どの点のまわりでもモーメントの和が 0）" },
    { id: "rigid",      title: "2 剛体のつり合い",          file: "units/rigid.js" },
    { id: "momentum",   title: "3 運動量と力積",            file: null },
    { id: "circular",   title: "4 円運動と慣性力",          file: null },
    { id: "shm",        title: "5 単振動",                  file: null },
    { id: "gravitation",title: "6 万有引力",                file: null },
    { id: "gas",        title: "7 気体分子の運動",          file: null }
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
