# 単元の検証：全採点問題の正解判定・誤答ヒント・390px/1280px のはみ出しと JS エラー
# 準備: リポジトリの直下で  python3 -m http.server 8130  を起動しておく（Playwright と node が必要）
# 使い方: python3 tools/check.py UNIT "anim/x.html#a" "anim/x.html#b" ...
import asyncio, sys, json, subprocess
from playwright.async_api import async_playwright
UNIT=sys.argv[1]; PAGES=sys.argv[2:]
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS=os.environ.get('SHOTS','/tmp/physics-lab-shots'); os.makedirs(SHOTS, exist_ok=True)
js = """global.window={};global.document=undefined;require('%s/js/kit.js');
global.registerUnit=u=>{const o={qs:[],traps:[]};u.sections.forEach((s,si)=>s.groups.forEach(g=>g.qs.forEach(q=>{o.qs.push([si,q.id,q.type,q.answer,q.scored===false]); if(q.traps)for(const k in q.traps)o.traps.push([si,q.id,k])})));console.log(JSON.stringify(o))};require('%s/units/%s.js')"""%(ROOT,ROOT,UNIT)
D = json.loads(subprocess.check_output(['node','-e',js]))
async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch(); errs=[]
    ctx = await b.new_context(viewport={'width':390,'height':900})
    await ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: m.type=='error' and 'net::' not in m.text and errs.append(m.text))
    bad=[]; n=0; cur=None
    for si,qid,typ,ans,unsc in D['qs']:
      if typ in ('self','checklist'): continue
      if cur!=si:
        await pg.goto(f'http://localhost:8130/index.html#/u/{UNIT}/{si}'); await pg.wait_for_selector(f'#q-{qid}'); cur=si
        w = await pg.query_selector('.warn')
        if w: print('WARN', await w.inner_text())
      el=f'#q-{qid}'
      if typ=='num': await pg.fill(f'{el} [data-act=num]', str(ans))
      elif typ=='blanks':
        for i,a in enumerate(ans): await pg.select_option(f'{el} select[data-n="{i}"]', str(a))
      else:
        for a in (ans if isinstance(ans,list) else [ans]): await pg.click(f'{el} [data-act=pick][data-i="{a}"]')
      await pg.click(f'{el} [data-act=check]'); n+=1
      if await pg.inner_text(f'{el} .verdict')!='正解': bad.append(qid)
    print(UNIT,'graded',n,'bad',bad)
    miss=[]
    for si,qid,k in D['traps']:
      await pg.goto(f'http://localhost:8130/index.html#/u/{UNIT}/{si}'); await pg.evaluate("localStorage.clear()"); await pg.reload(); await pg.wait_for_selector(f'#q-{qid}')
      el=f'#q-{qid}'
      await pg.fill(f'{el} [data-act=num]', k); await pg.click(f'{el} [data-act=check]')
      if not await pg.query_selector(f'{el} .trap'): miss.append((qid,k))
    print('traps',len(D['traps']),'missing',miss)
    await ctx.close()
    for w,scheme in [(390,'light'),(1280,'dark')]:
      ctx = await b.new_context(viewport={'width':w,'height':900}, color_scheme=scheme)
      await ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
      pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(f'{w} {e}'))
      for u in [f'index.html#/u/{UNIT}/0', f'index.html#/u/{UNIT}/3']+PAGES:
        await pg.goto('http://localhost:8130/'+u); await pg.wait_for_timeout(2500 if 'anim' in u else 400)
        ov = await pg.evaluate("document.documentElement.scrollWidth - innerWidth")
        name = u.replace('/','_').replace('#','_').replace('&','_')[:60]
        await pg.screenshot(path=f'{SHOTS}/{UNIT}-{name}-{w}.png', full_page=True)
        if ov>0: print('OVERFLOW',u,w,ov)
      await ctx.close()
    print('errors',errs); await b.close()
asyncio.run(main())
