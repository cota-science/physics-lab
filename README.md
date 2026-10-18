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
  rigid.html      剛体ラボ（#moment 力のモーメント／#balance 重心とてこ／#ladder はしごのつり合い）
  momentum.html   運動量ラボ（#collide 一直線上の衝突／#merge 平面での合体／#bounce 床ではね返るボール）
  circular.html   円運動ラボ（#uniform 等速円運動のベクトル／#conical 円すい振り子と遠心力／#vertical 鉛直面内の円運動）
  shm.html        単振動ラボ（#circle 円運動の影／#spring ばね振り子とエネルギー／#pendulum 大きな振れ角の単振り子）
  gravitation.html 万有引力ラボ（#orbit 人工衛星の軌道と面積速度／#kepler ケプラーの第3法則／#escape 打ち上げと第2宇宙速度）
  gas.html        気体分子ラボ（#kinetic 分子の運動と圧力／#pv p-V 図と状態変化／#cycle 熱機関のサイクル）
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
- `anim/gravitation.html#orbit&r0=2&v0=5.6`
- `anim/gas.html#pv&proc=p&p1=1&V1=24.9&V2=33.2`（proc ＝ v 定積・p 定圧・T 等温・a 断熱）

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
