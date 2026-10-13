"""Re-crop the 12 Surya Namaskar figures from the master chart (labels/neighbour slivers removed).
Source: public/assets/poses/surya-sequence.webp. Output: public/assets/poses/clean/step-NN.webp"""
from PIL import Image
import numpy as np
S=Image.open('public/assets/poses/surya-sequence.webp').convert('RGB')
B=[(80,40,215,345),(255,35,400,345),(480,150,640,345),(665,145,860,345),(890,170,1130,345),(1115,250,1360,345),
   (25,500,265,690),(285,505,535,690),(545,465,765,690),(815,495,950,690),(980,405,1115,690),(1215,410,1315,690)]
bg=S.getpixel((700,20)); CW,CH=300,320
for i,b in enumerate(B,1):
    c=S.crop(b); can=Image.new('RGB',(CW,CH),bg)
    can.paste(c,((CW-c.width)//2,CH-c.height-6)); can=can.resize((CW*2,CH*2),Image.LANCZOS)
    # Key the navy backdrop out: alpha rises with colour distance from the sampled background.
    a=np.asarray(can).astype(float); d=np.sqrt(((a-np.array(bg))**2).sum(2))
    al=np.clip((d-22)/48,0,1); out=np.dstack([a,al*255]).astype('uint8')
    Image.fromarray(out,'RGBA').save(f'public/assets/poses/clean/step-{i:02d}.webp',quality=90)
print('bg',bg)
