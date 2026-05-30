function glitch() {
  const el = document.getElementById('name');
  const original = el.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent = original.split('').map((c, idx) =>
      c === ' ' ? ' ' : idx < i ? original[idx] : chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    i++;
    if (i > original.length) { el.textContent = original; clearInterval(interval); }
  }, 40);
}
