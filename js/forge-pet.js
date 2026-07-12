// ─── Roblox Forge — 숄더 펫 concept ─────────────────────────────────────────
// The original plan called for assembling pre-made .glb part modules (a cat
// base + a sunglasses part). We have no such asset library and generating
// or downloading arbitrary 3D model files isn't something to fabricate here,
// so this builds the same idea procedurally out of three.js primitives —
// same approach as the wand, just a body/head/ears/tail/accessory rig
// instead of a handle/collar/ornament rig.

import * as THREE from 'three';
import { COLOR_KEYWORDS, DEFAULT_COLOR_HEX, matchFirst, makeSolidTexture } from './forge-shared.js';

const PET_KEYWORDS = [
  { keys: ['강아지', '개', 'dog'], label: '강아지', earStyle: 'floppy' },
  { keys: ['토끼', 'bunny', 'rabbit'], label: '토끼', earStyle: 'tall' },
  { keys: ['고양이', '냥이', 'cat'], label: '고양이', earStyle: 'pointed' },
];
const DEFAULT_EAR_STYLE = 'pointed';

function buildSunglasses({ headRadius, headPos }) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ map: makeSolidTexture(0x1c1c1e), roughness: 0.3, metalness: 0.2 });
  const lensGeo = new THREE.BoxGeometry(headRadius * 0.42, headRadius * 0.28, headRadius * 0.12);
  const lensL = new THREE.Mesh(lensGeo, mat);
  lensL.position.set(-headRadius * 0.32, headRadius * 0.05, headRadius * 0.85);
  group.add(lensL);
  const lensR = new THREE.Mesh(lensGeo, mat);
  lensR.position.set(headRadius * 0.32, headRadius * 0.05, headRadius * 0.85);
  group.add(lensR);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(headRadius * 0.28, headRadius * 0.06, headRadius * 0.06), mat);
  bridge.position.set(0, headRadius * 0.05, headRadius * 0.85);
  group.add(bridge);
  group.position.copy(headPos);
  return group;
}

function buildBowtie({ headRadius, headPos, colorHex }) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ map: makeSolidTexture(colorHex) });
  const wingGeo = new THREE.ConeGeometry(headRadius * 0.32, headRadius * 0.4, 4);
  const wingL = new THREE.Mesh(wingGeo, mat);
  wingL.rotation.z = Math.PI / 2;
  wingL.position.set(-headRadius * 0.2, 0, 0);
  group.add(wingL);
  const wingR = new THREE.Mesh(wingGeo, mat);
  wingR.rotation.z = -Math.PI / 2;
  wingR.position.set(headRadius * 0.2, 0, 0);
  group.add(wingR);
  group.add(new THREE.Mesh(new THREE.SphereGeometry(headRadius * 0.14, 8, 8), mat));
  group.position.set(headPos.x, headPos.y - headRadius * 0.9, headPos.z + headRadius * 0.5);
  return group;
}

function buildHat({ headRadius, headPos, colorHex }) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ map: makeSolidTexture(colorHex) });
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(headRadius * 0.8, headRadius * 0.8, headRadius * 0.08, 16), mat);
  brim.position.y = headRadius * 1.05;
  group.add(brim);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(headRadius * 0.42, headRadius * 0.5, headRadius * 0.75, 16), mat);
  top.position.y = headRadius * 1.05 + headRadius * 0.4;
  group.add(top);
  group.position.copy(headPos);
  return group;
}

const ACCESSORY_KEYWORDS = [
  { keys: ['선글라스', '안경', 'sunglasses', 'glasses'], label: '선글라스', build: buildSunglasses },
  { keys: ['리본', '보타이', 'bowtie', 'ribbon'], label: '리본', build: buildBowtie },
  { keys: ['모자', 'hat'], label: '모자', build: buildHat },
];

function buildEars(style, radius, mat) {
  const group = new THREE.Group();
  if (style === 'floppy') {
    const earGeo = new THREE.SphereGeometry(radius * 0.32, 12, 8);
    const earL = new THREE.Mesh(earGeo, mat);
    earL.scale.set(0.6, 1.3, 0.5);
    earL.position.set(-radius * 0.75, radius * 0.15, 0);
    group.add(earL);
    const earR = new THREE.Mesh(earGeo, mat);
    earR.scale.set(0.6, 1.3, 0.5);
    earR.position.set(radius * 0.75, radius * 0.15, 0);
    group.add(earR);
  } else if (style === 'tall') {
    const earGeo = new THREE.CapsuleGeometry(radius * 0.16, radius * 0.85, 4, 8);
    const earL = new THREE.Mesh(earGeo, mat);
    earL.position.set(-radius * 0.35, radius * 1.15, 0);
    group.add(earL);
    const earR = new THREE.Mesh(earGeo, mat);
    earR.position.set(radius * 0.35, radius * 1.15, 0);
    group.add(earR);
  } else {
    const earGeo = new THREE.ConeGeometry(radius * 0.35, radius * 0.6, 8);
    const earL = new THREE.Mesh(earGeo, mat);
    earL.position.set(-radius * 0.55, radius * 0.85, 0);
    earL.rotation.z = 0.25;
    group.add(earL);
    const earR = new THREE.Mesh(earGeo, mat);
    earR.position.set(radius * 0.55, radius * 0.85, 0);
    earR.rotation.z = -0.25;
    group.add(earR);
  }
  return group;
}

export function buildPetFromPrompt(prompt) {
  const text = (prompt || '').toLowerCase();
  const colorMatch = matchFirst(text, COLOR_KEYWORDS);
  const petMatch = matchFirst(text, PET_KEYWORDS);
  const accessoryMatch = matchFirst(text, ACCESSORY_KEYWORDS);
  const colorHex = colorMatch ? colorMatch.hex : DEFAULT_COLOR_HEX;
  const earStyle = petMatch ? petMatch.earStyle : DEFAULT_EAR_STYLE;

  const group = new THREE.Group();
  group.name = 'ForgePet';

  const bodyRadius = 0.28;
  const bodyMat = new THREE.MeshStandardMaterial({ map: makeSolidTexture(colorHex) });
  const body = new THREE.Mesh(new THREE.SphereGeometry(bodyRadius, 16, 12), bodyMat);
  body.scale.set(1, 0.85, 1.1);
  group.add(body);

  const headRadius = 0.2;
  const headPos = new THREE.Vector3(0, bodyRadius * 0.55, bodyRadius * 0.9);
  const headMat = new THREE.MeshStandardMaterial({ map: makeSolidTexture(colorHex) });
  const head = new THREE.Mesh(new THREE.SphereGeometry(headRadius, 16, 12), headMat);
  head.position.copy(headPos);
  group.add(head);

  const ears = buildEars(earStyle, headRadius, headMat);
  ears.position.copy(headPos);
  group.add(ears);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.32, 8), new THREE.MeshStandardMaterial({ map: makeSolidTexture(colorHex) }));
  tail.position.set(0, bodyRadius * 0.3, -bodyRadius * 1.05);
  tail.rotation.x = Math.PI * 0.65;
  group.add(tail);

  if (accessoryMatch) {
    group.add(accessoryMatch.build({ headRadius, headPos, colorHex }));
  }

  const labels = [];
  if (colorMatch) labels.push(colorMatch.keys[0]);
  if (petMatch) labels.push(petMatch.label);
  if (accessoryMatch) labels.push(accessoryMatch.label);

  return { group, labels };
}
