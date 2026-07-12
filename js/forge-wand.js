// ─── Roblox Forge — 마법 지팡이 concept (issue #16) ─────────────────────────
// No AI: plain substring matching against small Korean/English keyword
// tables, then three.js primitive/shape geometry picked accordingly. Only
// the "ornament" (the part sitting above the cone collar) reacts to
// color/material/shape keywords — the handle and collar keep the wand's
// silhouette consistent.

import * as THREE from 'three';
import { COLOR_KEYWORDS, DEFAULT_COLOR_HEX, matchFirst, makeSolidTexture } from './forge-shared.js';

const MATERIAL_KEYWORDS = [
  {
    keys: ['불타는', '화염', '불꽃', 'fire'],
    label: '불타는',
    apply: (mat, hex) => {
      mat.emissive.set(hex ?? 0xff5500);
      mat.emissiveIntensity = 0.9;
      mat.roughness = 0.35;
      mat.metalness = 0.1;
    },
  },
  {
    keys: ['나무', '목재', 'wood'],
    label: '나무',
    apply: (mat) => {
      mat.metalness = 0;
      mat.roughness = 0.9;
    },
  },
  {
    keys: ['어둠', '그림자', '다크', 'dark'],
    label: '어둠',
    apply: (mat) => {
      mat.metalness = 0.3;
      mat.roughness = 0.6;
    },
  },
  {
    keys: ['얼음', '빙결', 'ice'],
    label: '얼음',
    // roughness/metalness stay well above near-mirror values — this scene
    // has no environment map, so a near-zero roughness reflects almost
    // nothing back at the camera and renders as dull/dark instead of icy.
    apply: (mat) => {
      mat.transparent = true;
      mat.opacity = 0.55;
      mat.roughness = 0.35;
      mat.metalness = 0.05;
    },
  },
  {
    keys: ['금속', '철', '강철', 'metal'],
    label: '금속',
    // Same reasoning as ice: without an environment map, high metalness
    // has almost no diffuse response and reads as near-black, so this
    // trades a little metallic accuracy for staying visibly colored.
    apply: (mat) => {
      mat.metalness = 0.6;
      mat.roughness = 0.35;
    },
  },
];
const DEFAULT_MATERIAL_APPLY = (mat, hex) => {
  mat.emissive.set(hex ?? DEFAULT_COLOR_HEX);
  mat.emissiveIntensity = 0.4;
  mat.metalness = 0.3;
  mat.roughness = 0.3;
};

function buildStarGeometry(outerR, innerR, points, depth) {
  const shape = new THREE.Shape();
  const step = Math.PI / points;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geo.center();
  return geo;
}

// Classic three.js example heart outline (webgl_geometry_shapes), authored
// at ~22x19 units — scaled down uniformly (including extrude depth) to sit
// alongside the other ~0.3-unit ornaments.
function buildHeartGeometry() {
  const x = 0, y = 0;
  const heartShape = new THREE.Shape();
  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

  const geo = new THREE.ExtrudeGeometry(heartShape, { depth: 8, bevelEnabled: false });
  geo.center();
  geo.scale(0.014, 0.014, 0.014);
  return geo;
}

// A true crescent needs boolean subtraction (no CSG lib here) — an open
// torus arc is the cheap approximation for "moon".
function buildMoonGeometry() {
  return new THREE.TorusGeometry(0.14, 0.045, 12, 24, Math.PI * 1.5);
}

const TIP_KEYWORDS = [
  { keys: ['별', 'star'], label: '별', build: () => buildStarGeometry(0.17, 0.075, 5, 0.09) },
  { keys: ['하트', '사랑', 'heart'], label: '하트', build: buildHeartGeometry },
  { keys: ['달', '초승달', '문', 'moon'], label: '초승달', build: buildMoonGeometry },
  { keys: ['보석', '다이아몬드', '수정', 'gem', 'diamond'], label: '보석', build: () => new THREE.OctahedronGeometry(0.16, 0) },
];
const DEFAULT_TIP_BUILD = () => new THREE.OctahedronGeometry(0.16, 0);

export function buildWandFromPrompt(prompt) {
  const text = (prompt || '').toLowerCase();
  const colorMatch = matchFirst(text, COLOR_KEYWORDS);
  const materialMatch = matchFirst(text, MATERIAL_KEYWORDS);
  const tipMatch = matchFirst(text, TIP_KEYWORDS);
  const colorHex = colorMatch ? colorMatch.hex : DEFAULT_COLOR_HEX;

  const group = new THREE.Group();
  group.name = 'ForgeWand';

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 1.4, 16),
    new THREE.MeshStandardMaterial({ map: makeSolidTexture(0x6b4a2f) })
  );
  handle.position.y = -0.2;
  group.add(handle);

  const collar = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.4, 16),
    new THREE.MeshStandardMaterial({ map: makeSolidTexture(0xc0c0c0), metalness: 0.6, roughness: 0.3 })
  );
  collar.position.y = 0.7;
  group.add(collar);

  const ornamentGeo = tipMatch ? tipMatch.build() : DEFAULT_TIP_BUILD();
  const ornamentMat = new THREE.MeshStandardMaterial({ map: makeSolidTexture(colorHex) });
  (materialMatch ? materialMatch.apply : DEFAULT_MATERIAL_APPLY)(ornamentMat, colorHex);
  const ornament = new THREE.Mesh(ornamentGeo, ornamentMat);
  ornament.position.y = 1.0;
  group.add(ornament);

  const labels = [];
  if (colorMatch) labels.push(colorMatch.keys[0]);
  if (materialMatch) labels.push(materialMatch.label);
  if (tipMatch) labels.push(tipMatch.label);

  return { group, labels };
}
