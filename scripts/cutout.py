import cv2, numpy as np, sys, os
from PIL import Image
def cutout(path, out, bg='light', maxside=1024, iters=6):
    im = cv2.imread(path); h, w = im.shape[:2]
    s = min(1.0, maxside / max(h, w)); small = cv2.resize(im, (int(w*s), int(h*s)), interpolation=cv2.INTER_AREA)
    H, W = small.shape[:2]
    g = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY).astype(np.float32)
    # background colour model from the border
    border = np.concatenate([small[:6].reshape(-1,3), small[-6:].reshape(-1,3), small[:, :6].reshape(-1,3), small[:, -6:].reshape(-1,3)]).astype(np.float32)
    bgc = np.median(border, axis=0)
    dist = np.linalg.norm(small.astype(np.float32) - bgc, axis=2)
    mask = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
    mask[dist > 28] = cv2.GC_PR_FGD
    mask[dist > 70] = cv2.GC_FGD
    mask[:4] = mask[-4:] = cv2.GC_BGD; mask[:, :4] = mask[:, -4:] = cv2.GC_BGD
    b = np.zeros((1,65)); f = np.zeros((1,65))
    cv2.grabCut(small, mask, None, b, f, iters, cv2.GC_INIT_WITH_MASK)
    m = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    # keep the biggest component, fill holes, smooth edge
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n > 1:
        keep = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]); m = np.where(lab == keep, 255, 0).astype(np.uint8)
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE); m2 = np.zeros_like(m); cv2.drawContours(m2, cnts, -1, 255, -1)
    m2 = cv2.morphologyEx(m2, cv2.MORPH_OPEN, np.ones((3,3), np.uint8))
    m2 = cv2.GaussianBlur(m2, (0,0), 1.4)
    m2 = cv2.resize(m2, (w, h), interpolation=cv2.INTER_CUBIC)
    rgba = cv2.cvtColor(im, cv2.COLOR_BGR2BGRA); rgba[:, :, 3] = m2
    ys, xs = np.where(m2 > 8); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    pad = 6; rgba = rgba[max(0,y0-pad):y1+pad, max(0,x0-pad):x1+pad]
    cv2.imwrite(out, rgba, [cv2.IMWRITE_PNG_COMPRESSION, 6]); return rgba.shape
if __name__ == '__main__':
    for p in sys.argv[1:]:
        n = os.path.basename(p); print(n, cutout(p, '/home/claude/cut/' + n))
