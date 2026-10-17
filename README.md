# 物理ラボ（高3・物理）

物理基礎ラボ（basicphysics-review）と同じエンジンで作る、物理の演習・シミュレーター集。
GitHub Pages で公開する想定（新しいリポジトリ、例：cota-science/physics-lab）。

- index.html … 単元メニュー（js/index.js に単元を登録）
- js/app.js … 本体（物理基礎ラボと同じ。保存キーだけ `physics-lab:` に変更して、同じドメインでも答えが混ざらない）
- units/*.js … 単元ファイル（①定義 → ②読解 → ③次元 → ④手順 → まとめ）
- anim/*.html … シミュレーター
- 「微積」「微積なし」のタグで、数学Ⅲの微積を使う見方と教科書の見方を併記する
