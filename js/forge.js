// ─── Roblox Forge — export spike (M0, issue #15, done) + prompt-driven
// wand assembly (M1, issue #16). T is defined in js/i18n-data.js (loaded
// before this module).

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { buildWandFromPrompt, disposeWandGroup } from './forge-wand.js';

function t(lang, key, fallback) {
  return (T[lang] && T[lang][key]) || fallback;
}

function initScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x13161e);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.3, 3.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.4, 0);
  controls.enableDamping = true;
  controls.minDistance = 1.8;
  controls.maxDistance = 6;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x22232f, 1.1));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
  dirLight.position.set(2.5, 3, 4);
  scene.add(dirLight);

  let current = null;

  function setWand(group) {
    if (current) {
      scene.remove(current);
      disposeWandGroup(current);
    }
    current = group;
    scene.add(current);
  }

  function resize() {
    const wrap = canvas.parentElement;
    const { clientWidth, clientHeight } = wrap;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let autoRotate = true;
  controls.addEventListener('start', () => {
    autoRotate = false;
  });

  function animate() {
    requestAnimationFrame(animate);
    if (current && autoRotate) current.rotation.y += 0.006;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return {
    setWand,
    getWand: () => current,
  };
}

function exportGlb(object3d, filename) {
  new GLTFExporter().parse(
    object3d,
    (result) => {
      const blob = new Blob([result], { type: 'model/gltf-binary' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    (err) => {
      console.error('GLTF export failed', err);
      alert('내보내기에 실패했어요. 콘솔을 확인해주세요.');
    },
    { binary: true }
  );
}

function traitLabels(traits) {
  const parts = [];
  if (traits.colorLabel) parts.push(traits.colorLabel);
  if (traits.materialMatch) parts.push(traits.materialMatch.label);
  if (traits.tipMatch) parts.push(traits.tipMatch.label);
  return parts;
}

function describeTraits(lang, traits) {
  const parts = traitLabels(traits);
  if (!parts.length) return t(lang, 'forge-matched-none', '색상/재질/모양 키워드를 못 찾아서 기본 보석 지팡이로 만들었어요.');
  return `${t(lang, 'forge-matched-prefix', '인식된 키워드')}: ${parts.join(', ')}`;
}

function fileNameFor(traits) {
  const parts = traitLabels(traits);
  return `code-builder-forge-${parts.length ? parts.join('-') : 'wand'}.glb`;
}

function main() {
  const canvas = document.getElementById('forgeCanvas');
  const exportBtn = document.getElementById('forgeExportBtn');
  const form = document.getElementById('forgeForm');
  const promptInput = document.getElementById('forgePrompt');
  const status = document.getElementById('forgeStatus');
  if (!canvas || !exportBtn || !form || !promptInput) return;

  const scene = initScene(canvas);
  let currentTraits = null;

  function generate(prompt) {
    const lang = document.documentElement.lang || 'ko';
    const { group, traits } = buildWandFromPrompt(prompt);
    scene.setWand(group);
    currentTraits = traits;
    if (status) {
      status.hidden = false;
      status.className = 'form-status success';
      status.textContent = describeTraits(lang, traits);
    }
  }

  generate('');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generate(promptInput.value.trim());
  });

  exportBtn.addEventListener('click', () => {
    const wand = scene.getWand();
    if (wand) exportGlb(wand, fileNameFor(currentTraits || {}));
  });
}

main();
