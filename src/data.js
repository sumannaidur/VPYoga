// Single source of truth for programme + Surya Namaskar content.
// Breath cues follow the commonly taught sequence; lineages differ (esp. steps 5-6).
// TODO(client): have Dr. Venkatesh T confirm cues and wording before launch.
export const PROGRAMMES = [
  { id: 'yoga', title: 'Yoga Classes', tag: 'Strength & Flexibility', img: 'yoga.webp',
    text: 'Group and personal sessions that combine asana, breathing practice and relaxation.' },
  { id: 'surya', title: 'Surya Namaskar', tag: 'Energy & vitality', img: 'surya.webp',
    text: 'The twelve-step sun salutation, taught with attention to posture and breath.' },
  { id: 'meditation', title: 'Meditation', tag: 'Inner peace', img: 'meditation.webp',
    text: 'Guided meditation practices to help you settle the mind and build a steady habit.' },
  { id: 'therapy', title: 'Yoga Therapy', tag: 'Personalised care', img: 'therapy.webp',
    text: 'Individual guidance that adapts yoga practice to your needs. Not a substitute for medical care.' },
  { id: 'training', title: 'Teacher Training', tag: 'Learn & grow', img: 'training.webp',
    text: 'Study yoga in depth and learn to teach it. Ask us about current courses.' },
  { id: 'corporate', title: 'Corporate Yoga', tag: 'Workplace wellness', img: 'corporate.webp',
    text: 'Yoga and breathing sessions for teams, designed around your workplace.' },
];

export const SURYA = [
  ['Pranamasana', 'Prayer Pose', 'Exhale', ['Stand tall, feet together, palms joined at the chest.', 'Weight even on both feet; shoulders relaxed.']],
  ['Hastauttanasana', 'Raised Arms Pose', 'Inhale', ['Lift the arms overhead and arch gently back.', 'Keep the hips forward and the neck easy.']],
  ['Hastapadasana', 'Standing Forward Bend', 'Exhale', ['Fold forward from the hips, hands towards the floor.', 'Bend the knees as much as you need to.']],
  ['Ashwa Sanchalanasana', 'Equestrian Pose', 'Inhale', ['Step one leg back, lower the knee, look up.', 'Hands stay beside the front foot.']],
  ['Dandasana', 'Plank Pose', 'Hold the breath, or exhale', ['Take the front foot back to meet the other.', 'Body in one line from head to heels.']],
  ['Ashtanga Namaskara', 'Eight-Limbed Salute', 'Exhale', ['Lower knees, chest and chin to the floor.', 'Hips stay lifted; elbows close to the body.']],
  ['Bhujangasana', 'Cobra Pose', 'Inhale', ['Slide forward and lift the chest, elbows slightly bent.', 'Keep the shoulders away from the ears.']],
  ['Adho Mukha Svanasana', 'Downward-Facing Dog', 'Exhale', ['Lift the hips up and back into an inverted V.', 'Press the floor away; heels need not touch.']],
  ['Ashwa Sanchalanasana', 'Low Lunge', 'Inhale', ['Step the foot forward between the hands, back knee down.', 'Lift the chest and look up.']],
  ['Hastapadasana', 'Standing Forward Bend', 'Exhale', ['Bring the back foot forward and fold over the legs.', 'Let the head hang heavy.']],
  ['Hastauttanasana', 'Raised Arms Pose', 'Inhale', ['Rise up with the arms overhead and arch gently back.', 'Move slowly and keep the legs steady.']],
  ['Pranamasana', 'Prayer Pose', 'Exhale', ['Return to standing, palms at the chest.', 'Pause, breathe normally, then begin the next round.']],
].map(([name, en, breath, tips], i) => ({ n: i + 1, name, en, breath, tips,
  img: `surya/thumb-${String(i + 1).padStart(2, '0')}.webp` }));
