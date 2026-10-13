"""Download the licensed photos listed in src/photos.json, optimise to responsive WebP (and AVIF if
Pillow supports it) in public/assets/photos/, then set "local": true. Needs network + Pillow.
Usage: python3 scripts/fetch-photos.py   (run from the project root)
Both licences allow download and modification. Keep the photo credits in the footer."""
import io, json, urllib.request
from pathlib import Path
from PIL import Image, features
ROOT = Path(__file__).resolve().parent.parent
MAN = ROOT / 'src/photos.json'; OUT = ROOT / 'public/assets/photos'; OUT.mkdir(parents=True, exist_ok=True)
WIDTHS = [640, 1280, 1920, 2560]
data = json.loads(MAN.read_text())
for pid, p in data['photos'].items():
    src = p['cdn'] + ('?fm=jpg&q=90&w=2560&auto=format' if p['source'] == 'unsplash' else '?auto=compress&cs=tinysrgb&w=2560')
    req = urllib.request.Request(src, headers={'User-Agent': 'vishwa-poornima-site/1.0'})
    im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=60).read())).convert('RGB')
    for w in WIDTHS:
        if w > im.width: continue
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(OUT / f'{pid}-{w}.webp', 'WEBP', quality=78, method=6)
        if features.check('avif'): r.save(OUT / f'{pid}-{w}.avif', 'AVIF', quality=60)
    p['local'] = True; print('ok', pid, im.size)
MAN.write_text(json.dumps(data, indent=2))
