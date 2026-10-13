"""Browser checks against `vite preview` (port 4173). Prints actual results."""
from playwright.sync_api import sync_playwright
U='http://localhost:4173/'
def run(p):
    b=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']); res={}
    # ---- desktop
    pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]; bad=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.on('response',lambda r: bad.append(r.url) if r.status>=400 else None)
    pg.goto(U,wait_until='load'); pg.wait_for_timeout(800)
    pg.screenshot(path='/tmp/s_hero.png')
    # surya: forward then reverse
    st=pg.evaluate("()=>{const s=ScrollTriggerRef();}") if False else None
    pg.evaluate("scrollTo(0,document.body.scrollHeight)"); pg.wait_for_timeout(1500); pg.evaluate("scrollTo(0,0)"); pg.wait_for_timeout(800)  # load lazy images first
    T="document.querySelector('.surya .pin-spacer').getBoundingClientRect().top+scrollY"
    pg.evaluate(f"scrollTo(0,({T})+10)"); pg.wait_for_timeout(6000)
    seq=[]; 
    for i in range(12):
        pg.evaluate(f"scrollTo(0,({T})+({i}+.5)/12*{55*12}/100*innerHeight)"); pg.wait_for_timeout(3500)
        seq.append(pg.inner_text('#s-n')+':'+pg.inner_text('#s-name'))
    res['surya_forward']=seq
    pg.screenshot(path='/tmp/s_surya.png')
    back=[]
    for i in (11,6,0):
        pg.evaluate(f"scrollTo(0,({T})+({i}+.5)/12*{55*12}/100*innerHeight)"); pg.wait_for_timeout(5000); back.append(pg.inner_text('#s-n'))
    res['surya_reverse(12,7,1)']=back
    pg.click('#s-next'); pg.wait_for_timeout(5000); res['next_after_1']=pg.inner_text('#s-n')
    pg.click('.thumbs li:nth-child(9) button'); pg.wait_for_timeout(6000); res['thumb9']=pg.inner_text('#s-n')
    for sec in ('programmes','meditation','about','join'):
        pg.evaluate(f"document.getElementById('{sec}').scrollIntoView({{behavior:'instant'}})"); pg.wait_for_timeout(2500); pg.screenshot(path=f'/tmp/s_{sec}.png')
    res['gl_canvases']=pg.evaluate("[...document.querySelectorAll('canvas.fx')].map(c=>c.id+':'+(c.dataset.gl||'off'))")
    res['rail_items']=pg.locator('.rail a').count(); res['rail_active']=pg.locator('.rail a.is-on span').all_inner_texts()
    # enquiry: invalid, then valid (mailto intercepted)
    pg.evaluate("scrollTo(0,0)"); pg.click('.nav__menu .btn'); pg.fill('#f-phone','abc'); pg.fill('#f-name','Test'); pg.click('#enquiry-form button[type=submit]')
    res['invalid_status_blank']=pg.inner_text('#enquiry-status')==''
    res['broken_orbs_imgs']=pg.evaluate("[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)")
    res['h_overflow_1440']=pg.evaluate("document.documentElement.scrollWidth>innerWidth")
    res['console_errors']=errs; res['http_errors']=bad
    # nav links resolve
    res['dead_hash_links']=pg.evaluate("[...document.querySelectorAll('a[href^=\"#\"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.querySelector(h))")
    pg.close()
    # ---- mobile / tablet overflow + menu
    for w,h in ((390,844),(820,1180)):
        m=b.new_page(viewport={'width':w,'height':h}); m.goto(U,wait_until='load'); m.wait_for_timeout(600)
        res[f'h_overflow_{w}']=m.evaluate("document.documentElement.scrollWidth>innerWidth")
        if w==390:
            m.screenshot(path='/tmp/m_hero.png'); m.click('.nav__toggle'); m.wait_for_timeout(500)
            res['menu_expanded']=m.get_attribute('.nav__toggle','aria-expanded'); m.screenshot(path='/tmp/m_menu.png'); m.click('.nav__menu a[href="#surya"]'); m.wait_for_timeout(1500); m.screenshot(path='/tmp/m_surya.png')
        m.close()
    # ---- reduced motion
    r=b.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce').new_page(); re=[]
    r.on('pageerror',lambda e: re.append(str(e))); r.goto(U,wait_until='load'); r.wait_for_timeout(500)
    res['rm_pinned_elements']=r.evaluate("[...document.querySelectorAll('.pin-spacer')].length")
    res['rm_orb_opacity']=r.evaluate("getComputedStyle(document.querySelector('.orb')).opacity")
    r.evaluate("document.getElementById('surya').scrollIntoView()"); r.click('#s-next'); r.click('#s-next'); r.wait_for_timeout(300); res['rm_step_after_2_next']=r.inner_text('#s-n'); res['rm_errors']=re
    b.close(); return res
with sync_playwright() as p:
    for k,v in run(p).items(): print(k,'=',v)
