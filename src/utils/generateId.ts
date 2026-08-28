export function generateRegistrationId(
  authorityName: string | undefined | null,
  type: 'R' | 'A'
): string {
  let authCode = 'XXXXX';
  if (authorityName) {
    const words = authorityName.toUpperCase().split(/[\s,()&]+/).filter(w => !['OF', 'AND', 'THE', 'FOR', 'IN', 'DEPARTMENT', 'MINISTRY'].includes(w) && w.length > 0);
    
    if (words.length > 0) {
      const rawInitials = words.map(w => w[0]).join('');
      if (rawInitials.length >= 5) {
        authCode = rawInitials.substring(0, 5);
      } else {
        const combined = words.join('');
        if (combined.length >= 5) {
          authCode = combined.substring(0, 5);
        } else {
          authCode = combined.padEnd(5, 'X');
        }
      }
    }
  }

  const receiptType = 'E';
  const yearDigits = new Date().getFullYear().toString().slice(-2);
  const serial = String(Math.floor(Math.random() * 90000) + 10000);

  return `${authCode}/${type}/${receiptType}/${yearDigits}/${serial}`;
}
