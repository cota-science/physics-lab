# 物理ラボ（高3・物理）

見て、動かして、解いて確かめる物理の Web 教材です。[物理基礎ラボ](https://cota-science.github.io/basicphysics-review/) の続編で、同じしくみで動きます。

- 公開ページ：https://cota-science.github.io/physics-lab/
- 対象：高校3年・物理選択者
- 構成：学習指導要領「物理」の4つの大項目（(1)様々な運動 (2)波 (3)電気と磁気 (4)原子）にそった全18単元
- 数学Ⅲの微分・積分を使う見方には「微積」、教科書と同じ微積を使わない見方には「微積なし」のタグを付けて併記しています

## フォルダ構成

```
index.html        単元メニュー（トップページ）
css/style.css     演習ページの見た目（物理基礎ラボと共通＋「微積」タグ・導出の2列比較）
js/app.js         演習の本体（通常は編集不要。答えは端末に保存、保存キーは physics-lab:）
js/index.js       単元の一覧（単元を追加したらここに1行書く）
js/italic.js      本文中の物理量の文字を自動でイタリックにする部品（表記の約束は下の「文字の表記」）
js/kit.js         単元ファイル用の共通部品（物理量の斜体 Q・ベクトル B・分数 d・微積タグ・定義カード GLOS・2通りの導出 DERIVE2）
units/            単元ファイル（1単元＝1ファイル）
  TEMPLATE.js     新しい単元のひな形
  plane.js        1 平面内の運動
  rigid.js        2 剛体のつり合い
  momentum.js     3 運動量と力積
  circular.js     4 円運動と慣性力
  shm.js          5 単振動
  gravitation.js  6 万有引力
  gas.js          7 気体分子の運動
anim/             シミュレーター
  lab.css         シミュレーター共通の見た目
  lab-common.js   シミュレーター共通部品（LAB.app でタブ・設定・再生・グラフ・URL 指定を組み立てる）
  deriv.html      速度・加速度の定義ラボ（#vel 平均の速度 → 瞬間の速度／#acc 平均の加速度 → 瞬間の加速度。path ＝ eight・circle・throw／#rel 合成と相対の速度・加速度。ex ＝ train・crane・throws、view ＝ g・A）
  plane.html      平面運動ラボ（#proj 放物運動とベクトル／#range 角度と到達距離／#slope 斜面への投射）
  rigid.html      剛体ラボ（#moment 力のモーメント／#balance 重心とてこ／#ladder はしごのつり合い／#tip 箱の転倒。sc ＝ push・slope）
  momentum.html   運動量ラボ（#collide 一直線上の衝突／#oblique 平面上の衝突（力積と運動量のベクトル図）／#merge 平面での合体／#bounce 床ではね返るボール）
  circular.html   円運動ラボ（#uniform 等速円運動のベクトル／#conical 円すい振り子と遠心力／#vertical 鉛直面内の円運動／#train 電車の中のおもり。motion ＝ acc・const・dec、obj ＝ pend・rest・cut・spring、view ＝ train・ground）
  shm.html        単振動ラボ（#circle 円運動の影／#spring ばね振り子とエネルギー／#pendulum 大きな振れ角の単振り子／#buoy 浮力と重力の単振動（水に浮かぶ物体））
  gravitation.html 万有引力ラボ（#orbit 人工衛星の軌道と面積速度／#kepler ケプラーの第3法則／#escape 打ち上げと第2宇宙速度／#transfer 軌道の変更（人工衛星・探査機のホーマン遷移））
  gas.html        気体分子ラボ（#kinetic 分子の運動と圧力／#wall 壁との衝突（加熱・冷却）／#piston ピストンとの衝突（圧縮・膨張）／#pv p-V 図と状態変化／#cycle 熱機関のサイクル）
```

## 単元のつくり

どの単元も同じ5つのタブで進みます。

1. **①定義** … 定義カード（用語・式・単位）と、主な式の「微積なし／微積」2通りの導出
2. **②読解** … 図や問題文の言葉から、物理量の向き・成分・条件を読み取る
3. **③次元** … 単位を予測し、式の次元を判定する。次元で見つからない誤りは「極端な場合」で確かめる
4. **④手順** … 7ステップ（図示 → 既知・未知 → 式を選ぶ → 文字式 → 次元 → 数値 → 妥当性）で解く
5. **まとめ** … どの考え方を使うかを選ぶ

## 単元を追加する

1. `units/TEMPLATE.js` をコピーして（共通部品は `const {Q, B, d, CALC, ...} = window.KIT;` で使える） `units/〇〇.js` を作り、問題を書く
2. `js/index.js` で、その単元の行の `file: null` を `file: "units/〇〇.js"` にする
3. ブラウザで開くと、書き方に誤り（answer の範囲外など）があれば、ページの上に「先生向け」の警告が出ます

問題の種類（`type`）：`choice`（1つ選ぶ）、`multi`（すべて選ぶ）、`blanks`（空欄に選んで入れる）、`num`（数値を入力。`tol` は許容誤差、`traps` はよくある誤答とヒント）、`self`（記述・自己採点）、`checklist`（点検・採点なし）

## シミュレーターへのリンク

URL の `#` 以降で、モードと値を指定して開けます。問題文の ▶ ボタンはこれを使っています。

- `anim/deriv.html#acc&path=circle&tp=0.12&dt=1.6`（tp ＝ 点 P の時刻を運動全体の割合で、dt ＝ Δt の最初の値）
- `anim/plane.html#proj&v0=19.6&th=30&h=39.2`（&g=1.6 で月など）
- `anim/plane.html#slope&v0=9.8&al=30`
- `anim/rigid.html#moment&r=0.5&F=20&phi=60`
- `anim/rigid.html#ladder&th=60&W=200&w=0&ax=A`
- `anim/momentum.html#collide&m1=2&m2=1&v1=3&v2=0&e=0.5`
- `anim/circular.html#vertical&r=0.4&v0=4.43&m=0.1`
- `anim/shm.html#spring&k=49&m=0.5&A=0.05&dir=v`
- `anim/shm.html#buoy&rb=600&L=0.2&Sa=0.01&A=0.05&rho=1000`
- `anim/gravitation.html#orbit&r0=2&v0=5.6`
- `anim/gravitation.html#orbit&body=moon`（body は earth／moon／venus／mars／jupiter／sun。#orbit・#escape・#transfer で使える）
- `anim/gravitation.html#transfer&ex=mars&r1=1&r2=1.524`（ex は leo／geo／mars／venus、b2=off で到着点の噴射なし）
- `anim/gas.html#pv&proc=p&p1=1&V1=24.9&V2=33.2`（proc ＝ v 定積・p 定圧・T 等温・a 断熱）
- `anim/gas.html#wall&Tg=300&Tw=900`（壁との衝突）、`anim/gas.html#piston&dir=e&u=15`（dir ＝ c 圧縮・e 膨張）

## 文字の表記（イタリックとレギュラー）
- **物理量の文字はイタリック**（*m, a, g, T, θ, mg, ma* …）、ベクトルは太字イタリック（円運動ラボの電車のモードでは文字の上に →）。
- **レギュラーのまま**にするもの：単位（m, s, N, J, Hz, kg, 〔m/s²〕, N·m …）、sin・cos・tan・lim などの関数名、微分の d、π・Δ、点や粒子の名前（A, B, O, P …）、次元の記号〔L〕〔M〕〔T〕、(a)(b)(c) などの項目記号。
- 式の部品として書くときは `Q("m")`（単元）・`S("m")`（ラボ）を使う。本文に直接書いた記号は `js/italic.js` が自動でイタリックにする（ラボは lab-common.js、単元は app.js、rigid.html・plane.html は auto で呼び出し）。
- 自動整形の例外：数値のあとの単位、単位の連なり（m/s²、kg·m/s）、〔 〕の中、「単位は …」のあと、「何 m」は単位とみなす。それでも直らないところは `<span class="keep">s</span>` で囲むと触られない。
- キャンバス（図）の中の文字も、通常フォントで描く文字列なら `js/italic.js` が `fillText` を差しかえて自動でイタリックにする（`S 5.87 N`、`x-t〔m〕` など）。下付きは `p_A` のように `_` で書くと小さく下げて描く。記号そのものを描くときの `symFont`（最初からイタリック）はそのまま。

## 検証

`tools/check.py` で、単元の全採点問題が「正解」と判定されるか、誤答ヒントがすべて出るか、スマホ幅（390px）・PC 幅（1280px）ではみ出しや JS エラーがないかを確かめられます（Playwright と Node.js が必要）。

```
python3 -m http.server 8130        # リポジトリの直下で
python3 tools/check.py gas "anim/gas.html#kinetic"   # 単元 id と、確かめたいシミュレーターの URL
```

## 進み具合

| 大項目 | 単元 | 演習 | シミュレーター |
|---|---|---|---|
| (1) 様々な運動 | 1 平面内の運動 | ✓ | 速度・加速度の定義ラボ、平面運動ラボ |
| | 2 剛体のつり合い | ✓ | 剛体ラボ |
| | 3 運動量と力積 | ✓ | 運動量ラボ |
| | 4 円運動と慣性力 | ✓ | 円運動ラボ |
| | 5 単振動 | ✓ | 単振動ラボ |
| | 6 万有引力 | ✓ | 万有引力ラボ |
| | 7 気体分子の運動 | ✓ | 気体分子ラボ |
| (2) 波 | 8 〜 10 | 準備中 | |
| (3) 電気と磁気 | 11 〜 16 | 準備中 | |
| (4) 原子 | 17 〜 18 | 準備中 | |
