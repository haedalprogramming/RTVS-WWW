// ─── Roblox Forge — three concepts from the issue #13 prototype plan:
// 마법 지팡이 (wand), 숄더 펫 (pet), 커스텀 방패 (shield). Each concept module
// exports build*FromPrompt(prompt) -> { group, labels }. T is defined in
// js/i18n-data.js (loaded before this module).

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { disposeGroup, mergeToSingleMesh } from './forge-shared.js';
import { buildWandFromPrompt } from './forge-wand.js';
import { buildPetFromPrompt } from './forge-pet.js';
import { buildShieldFromPrompt } from './forge-shield.js';

const CONCEPTS = {
  wand: {
    build: buildWandFromPrompt,
    filePrefix: 'wand',
    phKey: 'forge-prompt-ph-wand',
    hintKey: 'forge-prompt-hint-wand',
  },
  pet: {
    build: buildPetFromPrompt,
    filePrefix: 'pet',
    phKey: 'forge-prompt-ph-pet',
    hintKey: 'forge-prompt-hint-pet',
  },
  shield: {
    build: buildShieldFromPrompt,
    filePrefix: 'shield',
    phKey: 'forge-prompt-ph-shield',
    hintKey: 'forge-prompt-hint-shield',
  },
};

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
  controls.target.set(0, 0.2, 0);
  controls.enableDamping = true;
  controls.minDistance = 1.4;
  controls.maxDistance = 6;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x22232f, 1.1));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
  dirLight.position.set(2.5, 3, 4);
  scene.add(dirLight);

  let current = null;

  function setModel(group) {
    if (current) {
      scene.remove(current);
      disposeGroup(current);
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
    setModel,
    getModel: () => current,
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

function describeLabels(lang, labels) {
  if (!labels.length) return t(lang, 'forge-matched-none', '키워드를 못 찾아서 기본 모양으로 만들었어요.');
  return `${t(lang, 'forge-matched-prefix', '인식된 키워드')}: ${labels.join(', ')}`;
}

function fileNameFor(filePrefix, labels) {
  const suffix = labels.length ? labels.join('-') : filePrefix;
  return `code-builder-forge-${filePrefix}-${suffix}.glb`;
}

function main() {
  const canvas = document.getElementById('forgeCanvas');
  const exportBtn = document.getElementById('forgeExportBtn');
  const form = document.getElementById('forgeForm');
  const promptInput = document.getElementById('forgePrompt');
  const status = document.getElementById('forgeStatus');
  const tabs = document.querySelectorAll('.forge-concept-tab');
  if (!canvas || !exportBtn || !form || !promptInput) return;

  const scene = initScene(canvas);
  let currentLabels = [];
  let currentConceptKey = 'wand';

  function applyConceptText() {
    const lang = document.documentElement.lang || 'ko';
    const concept = CONCEPTS[currentConceptKey];
    promptInput.placeholder = t(lang, concept.phKey, '');
    const hintEl = document.getElementById('forgePromptHint');
    if (hintEl) hintEl.textContent = t(lang, concept.hintKey, '');
  }

  function generate(prompt) {
    const lang = document.documentElement.lang || 'ko';
    const { group, labels } = CONCEPTS[currentConceptKey].build(prompt);
    scene.setModel(group);
    currentLabels = labels;
    if (status) {
      status.hidden = false;
      status.className = 'form-status success';
      status.textContent = describeLabels(lang, labels);
    }
  }

  function switchConcept(key) {
    if (!CONCEPTS[key] || key === currentConceptKey) return;
    currentConceptKey = key;
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.concept === key));
    promptInput.value = '';
    applyConceptText();
    generate('');
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => switchConcept(tab.dataset.concept));
  });

  applyConceptText();
  generate('');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generate(promptInput.value.trim());
  });

  exportBtn.addEventListener('click', () => {
    const model = scene.getModel();
    if (!model) return;
    // Bake down to a single MeshPart named "Handle" — Roblox's Accessory
    // Fitting Tool / Tool workflow needs one BasePart selected, not a Model
    // group of several separately-colored parts.
    const merged = mergeToSingleMesh(model, 'Handle');
    exportGlb(merged, fileNameFor(CONCEPTS[currentConceptKey].filePrefix, currentLabels));
    disposeGroup(merged);
  });
}

main();
