// ─── Roblox Forge — shared keyword-matching + texture helpers ─────────────
// Used by all three concepts (wand, pet, shield). No AI: everything here is
// plain substring matching and canvas drawing.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const COLOR_KEYWORDS = [
  { keys: ['빨간', '빨강', '레드', 'red'], hex: 0xff3b30 },
  { keys: ['파란', '파랑', '블루', 'blue'], hex: 0x2f6fed },
  { keys: ['초록', '녹색', '그린', 'green'], hex: 0x2ecc71 },
  { keys: ['노란', '노랑', '옐로', 'yellow'], hex: 0xf5c518 },
  { keys: ['보라', '퍼플', 'purple'], hex: 0x9b59b6 },
  { keys: ['분홍', '핑크', 'pink'], hex: 0xff6fae },
  { keys: ['주황', '오렌지', 'orange'], hex: 0xff8c32 },
  { keys: ['검은', '검정', '블랙', 'black'], hex: 0x1c1c1e },
  { keys: ['하얀', '흰', '화이트', 'white'], hex: 0xf2f2f2 },
  { keys: ['금색', '골드', 'gold'], hex: 0xd4af37 },
  { keys: ['은색', '실버', 'silver'], hex: 0xc0c0c0 },
];
export const DEFAULT_COLOR_HEX = 0x3fd0ff;

export function matchFirst(text, table) {
  return table.find((entry) => entry.keys.some((k) => text.includes(k))) || null;
}

export function matchColor(text) {
  return matchFirst(text, COLOR_KEYWORDS);
}

// Roblox's MeshPart import ignores a flat PBR baseColorFactor with no
// texture — it only picks up color from an actual image map. So every part
// gets its color baked into a tiny solid-fill canvas texture instead of a
// bare material.color, even though that's redundant for the in-browser
// three.js preview itself.
export function makeSolidTexture(hex) {
  const size = 8;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `#${hex.toString(16).padStart(6, '0')}`;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeCanvasTexture(size, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  draw(canvas.getContext('2d'), size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Roblox's Accessory Fitting Tool (and the Tool/Accessory workflow in
// general) needs exactly one BasePart named "Handle" selected — it rejects
// a Model/group. Our concepts build several separate meshes (color-coded
// parts), so at export time we bake every part's color into one shared
// atlas texture, remap each part's UVs into its atlas cell, and merge all
// geometries into a single mesh — so what lands in Studio is already one
// MeshPart, no manual union/weld surgery required.
export function mergeToSingleMesh(group, name) {
  group.updateMatrixWorld(true);
  const meshes = [];
  group.traverse((node) => {
    if (node.isMesh) meshes.push(node);
  });

  const cols = Math.ceil(Math.sqrt(meshes.length));
  const rows = Math.ceil(meshes.length / cols);
  const cellPx = 32;

  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = cols * cellPx;
  atlasCanvas.height = rows * cellPx;
  const actx = atlasCanvas.getContext('2d');

  const preparedGeometries = meshes.map((mesh, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const u0 = col / cols;
    const u1 = (col + 1) / cols;
    const v0 = 1 - (row + 1) / rows;
    const v1 = 1 - row / rows;

    const sourceImage = mesh.material.map && mesh.material.map.image;
    if (sourceImage) {
      actx.drawImage(sourceImage, col * cellPx, row * cellPx, cellPx, cellPx);
    } else {
      actx.fillStyle = '#ffffff';
      actx.fillRect(col * cellPx, row * cellPx, cellPx, cellPx);
    }

    let geo = mesh.geometry.clone();
    geo.applyMatrix4(mesh.matrixWorld);
    if (!geo.attributes.normal) geo.computeVertexNormals();
    const uv = geo.attributes.uv;
    for (let k = 0; k < uv.count; k++) {
      uv.setXY(k, u0 + uv.getX(k) * (u1 - u0), v0 + uv.getY(k) * (v1 - v0));
    }
    // Different primitive generators produce indexed vs. non-indexed
    // geometry — mergeGeometries requires every input to agree, so
    // normalize all of them to non-indexed.
    if (geo.index) geo = geo.toNonIndexed();
    return geo;
  });

  const merged = mergeGeometries(preparedGeometries, false);
  const atlasTexture = new THREE.CanvasTexture(atlasCanvas);
  atlasTexture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({ map: atlasTexture });
  const mesh = new THREE.Mesh(merged, material);
  mesh.name = name;
  return mesh;
}

export function disposeGroup(group) {
  group.traverse((node) => {
    if (node.isMesh) {
      node.geometry.dispose();
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
}
