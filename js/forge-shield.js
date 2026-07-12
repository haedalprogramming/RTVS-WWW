// ─── Roblox Forge — 커스텀 방패 concept ─────────────────────────────────────
// The original plan called for AI-generated face art ("우주가 그려진 방패").
// AI image generation was deprioritized for this prototype (see issue #13
// discussion), so patterns are drawn procedurally on a canvas instead —
// same "bake color/pattern into a real texture" technique as the wand and
// pet, just with a drawn pattern instead of a flat fill.

import * as THREE from 'three';
import { COLOR_KEYWORDS, DEFAULT_COLOR_HEX, matchFirst, makeSolidTexture, makeCanvasTexture } from './forge-shared.js';

function drawSpacePattern(ctx, size) {
  ctx.fillStyle = '#0a1030';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = Math.random() > 0.85 ? '#9fd8ff' : '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.4 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ff8c32';
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.3, size * 0.09, 0, Math.PI * 2);
  ctx.fill();
}

function drawFirePattern(ctx, size) {
  const grad = ctx.createRadialGradient(size / 2, size * 0.75, size * 0.05, size / 2, size * 0.6, size * 0.65);
  grad.addColorStop(0, '#fff4c2');
  grad.addColorStop(0.35, '#ff8c32');
  grad.addColorStop(0.7, '#ff3b30');
  grad.addColorStop(1, '#5a0e0e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
}

function drawWavePattern(ctx, size) {
  ctx.fillStyle = '#0d4f8b';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = size * 0.02;
  for (let row = 0; row < 5; row++) {
    const y = (row + 0.5) * (size / 5);
    ctx.beginPath();
    for (let x = 0; x <= size; x += 4) {
      const yy = y + Math.sin((x / size) * Math.PI * 4 + row) * size * 0.03;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
}

function drawLightningPattern(ctx, size) {
  ctx.fillStyle = '#181820';
  ctx.fillRect(0, 0, size, size);
  ctx.beginPath();
  ctx.moveTo(size * 0.55, size * 0.05);
  ctx.lineTo(size * 0.35, size * 0.45);
  ctx.lineTo(size * 0.55, size * 0.45);
  ctx.lineTo(size * 0.3, size * 0.95);
  ctx.lineTo(size * 0.65, size * 0.55);
  ctx.lineTo(size * 0.45, size * 0.55);
  ctx.lineTo(size * 0.7, size * 0.05);
  ctx.closePath();
  ctx.fillStyle = '#f5c518';
  ctx.fill();
}

const PATTERN_KEYWORDS = [
  { keys: ['우주', '별자리', '은하', 'space', 'galaxy'], label: '우주', draw: drawSpacePattern },
  { keys: ['불', '화염', '불꽃', 'fire'], label: '불꽃', draw: drawFirePattern },
  { keys: ['파도', '물결', '바다', 'wave', 'water'], label: '파도', draw: drawWavePattern },
  { keys: ['번개', '천둥', 'lightning', 'thunder'], label: '번개', draw: drawLightningPattern },
];

export function buildShieldFromPrompt(prompt) {
  const text = (prompt || '').toLowerCase();
  const colorMatch = matchFirst(text, COLOR_KEYWORDS);
  const patternMatch = matchFirst(text, PATTERN_KEYWORDS);
  const colorHex = colorMatch ? colorMatch.hex : DEFAULT_COLOR_HEX;

  const group = new THREE.Group();
  group.name = 'ForgeShield';

  // Single material (not a [side, top, bottom] array) — the torus rim
  // already covers the thin edge, and every mesh needs exactly one material
  // for the export-time single-MeshPart merge (see forge-shared.js).
  const faceTexture = patternMatch ? makeCanvasTexture(128, patternMatch.draw) : makeSolidTexture(colorHex);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTexture, roughness: 0.5, metalness: 0.1 });

  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.08, 24), faceMat);
  face.rotation.x = Math.PI / 2;
  group.add(face);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.045, 10, 32),
    new THREE.MeshStandardMaterial({ map: makeSolidTexture(0xc0c0c0), metalness: 0.6, roughness: 0.35 })
  );
  group.add(rim);

  const boss = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 16, 12),
    new THREE.MeshStandardMaterial({ map: makeSolidTexture(colorMatch ? colorHex : 0xc0c0c0), metalness: 0.5, roughness: 0.3 })
  );
  boss.position.z = 0.09;
  group.add(boss);

  const labels = [];
  if (colorMatch) labels.push(colorMatch.keys[0]);
  if (patternMatch) labels.push(patternMatch.label);

  return { group, labels };
}
