const NAME_STYLES = [
  {
    text: 'Benjamin Wasson',
    noise: '42 65 6E 6A 61 6D 69 6E  57 61 73 73 6F 6E ',
    mono: false,
    size: ''
  },
  {
    text: '42 65 6E 6A 61 6D 69 6E  57 61 73 73 6F 6E',
    noise: '0123456789ABCDEF ',
    mono: true,
    size: ''
  },
  {
    text: [
      '+-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+',
      '|B|e|n|j|a|m|i|n| |W|a|s|s|o|n|',
      '+-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+'
    ].join('\n'),
    noise: '+-| ',
    mono: true,
    size: ''
  },
  {
    text: [
      ' ___        __     ___    ____     _____  _____          __      __     ___    ____    ____    _____  ______       ___       ____     ___     ___    _______',
      '\\     \\  \\    ___) |    \\  |  |   (_   |    /  \\    |        | (_    _) |    \\  |  |    |  |    |  |    /  \\     )  ____)  )  ____)   )   (   |    \\  |  |       ',
      ' |     )  |  (__   |  |\\ \\ |  |     |  |   /    \\   |  |\\/|  |   |  |   |  |\\ \\ |  |    |  |    |  |   /    \\   (  (___   (  (___    /     \\  |  |\\ \\ |  |       ',
      ' |    <   |   __)  |  | \\ \\|  |  _  |  |  /  ()  \\  |  |  |  |   |  |   |  | \\ \\|  |    |  |    |  |  /  ()  \\   \\___  \\   \\___  \\  (       ) |  | \\ \\|  |       ',
      ' |     )  |  (___  |  |  \\    | ( |_|  | |   __   | |  |  |  |  _|  |_  |  |  \\    |     \\  \\/\\/  /  |   __   |  ____)  )  ____)  )  \\     /  |  |  \\    |       ',
      '/     /__/       )_|  |___\\   |__\\    /__|  (__)  |_|  |__|  |_(      )_|  |___\\   |______\\      /___|  (__)  |_(      (__(      (____)   (___|  |___\\   |_______'
    ].join('\n'),
    noise: '\\/|_()<>- ',
    mono: true,
    size: '0.3rem'
  }
];

let currentStyle = 0;

function glitch() {
  const el = document.getElementById('name');
  currentStyle = (currentStyle + 1) % NAME_STYLES.length;
  const style = NAME_STYLES[currentStyle];
  const target = style.text;
  const noiseChars = style.noise;
  const step = Math.max(1, Math.ceil(target.length / 50));
  let i = 0;

  el.style.fontFamily = style.mono ? 'monospace' : '';
  el.style.whiteSpace = style.mono ? 'pre' : '';
  el.style.fontSize = style.size || '';
  el.style.lineHeight = style.size ? '1.2' : '';
  el.style.overflowX = style.size ? 'auto' : '';

  const interval = setInterval(() => {
    el.textContent = target.split('').map((c, idx) =>
      c === '\n' ? '\n' : idx < i ? target[idx] : noiseChars[Math.floor(Math.random() * noiseChars.length)]
    ).join('');
    i += step;
    if (i > target.length) { el.textContent = target; clearInterval(interval); }
  }, 40);
}
