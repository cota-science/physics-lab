/*
 * 単元ファイルのひな形（このファイル自体はメニューに出ません）
 *
 * 使い方：
 *   1. このファイルをコピーして units/〇〇.js にする
 *   2. 下の id を、js/index.js の id と同じにする
 *   3. js/index.js の file に "units/〇〇.js" と書く
 *
 * 書き方の詳しい例は units/plane.js・units/rigid.js を見てください
 * （物理量の斜体 Q()、ベクトル B()、分数 d()、「微積」タグ CALC、シミュレーターへのボタン ANIM() など）。
 */
(function(){

const CALC = `<span class='calc-tag'>微積</span>`;
const NOCALC = `<span class='nocalc-tag'>微積なし</span>`;

const SECTIONS = [
{ id:"def", tab:"①定義", title:"① 定義カード",
  advice:"正答率が低いときに結果画面に出る、復習のアドバイス。",
  intro:"この層のねらいを書く。",
  ref:{label:"定義カードを見る", html:"<p>定義カードの HTML</p>"},
  groups:[
  { title:"A. 小見出し", lead:"問題群の前に出る説明（省略可）", qs:[
    // 1つ選ぶ：answer は選択肢の番号（0から数える）
    {id:"d1", type:"choice", prompt:"問題文", options:["正解","誤答1","誤答2"], answer:0, explain:"解説"},
    // すべて選ぶ：answer は番号の配列
    {id:"d2", type:"multi", prompt:"問題文", options:["A","B","C"], answer:[0,2], explain:"解説"},
    // 空欄：text の {0} {1} … に、options[0] options[1] … から選ぶ
    {id:"d3", type:"blanks", text:"速度は位置を時間で{0}したもの。", options:[["微分","積分"]], answer:[0], explain:"解説"},
    // 数値：tol は許容誤差、traps は「よくある誤答: ヒント」
    {id:"d4", type:"num", prompt:`${CALC} 問題文`, answer:9.8, tol:0.05, unit:"m/s", traps:{"4.9":"½ をかけ忘れていませんか。"}, explain:"解説"},
    // 記述（自己採点）。scored:false で採点に入れない
    {id:"d5", type:"self", prompt:"問題文", model:"模範解答", scored:false},
    // 点検リスト（採点なし）
    {id:"d6", type:"checklist", prompt:"答案を点検しよう。", items:["軸と正の向きを書いた","単位を確かめた"]}
  ]}]
}
];

registerUnit({
  id: "template",          // js/index.js の id と同じにする
  title: "単元名",
  sections: SECTIONS
});
})();
