/**
 * Client-side Captcha Generator
 * Generates a random alphanumeric string and renders it to a data URL image
 * with noise and distortion to prevent simple OCR, while remaining strictly client-side.
 */

export const generateCaptcha = (): { image: string; code: string } => {
  const width = 320; // Increased width
  const height = 90; // Increased height
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return { image: '', code: '' };
  }

  // 1. Background
  ctx.fillStyle = '#1e293b'; // Slate-800 to match theme
  ctx.fillRect(0, 0, width, height);

  // 2. Generate Code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0 to avoid confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // 3. Add Noise (Lines)
  for (let i = 0; i < 12; i++) {
    ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  // 4. Draw Text
  ctx.font = 'bold 52px monospace'; // Much larger font
  ctx.textBaseline = 'middle';
  
  const charWidth = width / 7;
  for (let i = 0; i < 6; i++) {
    const char = code[i];
    ctx.save();
    // Position
    const x = (i + 0.5) * charWidth + (Math.random() * 20 - 10);
    const y = height / 2 + (Math.random() * 20 - 10);
    
    // Rotation
    const angle = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25 radians
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    ctx.fillStyle = '#f8fafc'; // White text
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  // 5. Add Noise (Dots)
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`;
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  return {
    image: canvas.toDataURL('image/png'),
    code: code
  };
};