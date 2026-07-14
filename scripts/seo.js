'use strict';

const SITE_URL = 'https://roblox.code-builder.kr';
const SITE_NAME = 'Code Builder';
const OG_IMAGE = `${SITE_URL}/img/og-thumbnail.jpg`;
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 600;

// path: the page's URL suffix relative to the site root, '' for the homepage.
const PAGES = {
  index: {
    path: '',
    ko: {
      title: '로블록스 코딩 게임 Code Builder | 게임 속에서 배우는 블록 코딩',
      description:
        '로블록스 코딩 게임 Code Builder에서 블록 코딩으로 에이전트를 조종하세요. 설치 없이 로블록스 플레이 중 바로 즐기는 인게임 코딩 교육 플랫폼입니다.',
      keywords:
        '로블록스 코딩 게임, 로블록스 코딩, 코딩 게임, 블록 코딩, 인게임 코딩 교육, 로블록스 교육, Code Builder',
      ogTitle: '로블록스 코딩 게임 Code Builder — 내가 만든 코드가 즉시 게임 속에 반영된다',
      ogDescription:
        '설치 없이 로블록스를 플레이하며 블록 코딩으로 에이전트를 조종하는 로블록스 코딩 게임, Code Builder를 지금 플레이해보세요.',
    },
    en: {
      title: 'Code Builder — A Roblox Coding Game You Play In-World',
      description:
        'Code Builder is a Roblox coding game where you open a block-coding window mid-gameplay and command your agent. No installs — play free on Roblox.',
      keywords:
        'roblox coding game, roblox coding, coding game, block coding, in-game coding education, learn to code on roblox, Code Builder',
      ogTitle: 'Code Builder — Your Code, Instantly Alive In-Game',
      ogDescription:
        'A Roblox coding game where the block code you write takes effect immediately in the game world. No installs — just play.',
    },
  },
  about: {
    path: 'about.html',
    ko: {
      title: '회사 소개 | 로블록스 코딩 게임 Code Builder를 만드는 사람들',
      description:
        '아이들이 이미 있는 로블록스 안으로 코딩 교육을 가져온 로블록스 코딩 게임, Code Builder의 미션과 팀을 소개합니다.',
      keywords: 'Code Builder 소개, 로블록스 코딩 게임, 로블록스 교육 스타트업, 코딩 교육 미션',
    },
    en: {
      title: 'About Us | The Team Behind the Roblox Coding Game Code Builder',
      description:
        'Meet the mission and team behind Code Builder, the Roblox coding game that brings coding education to where kids already play.',
      keywords: 'about Code Builder, roblox coding game, roblox education startup, coding education mission',
    },
  },
  guide: {
    path: 'guide.html',
    ko: {
      title: '교사용 매뉴얼 | 로블록스 코딩 게임 Code Builder 12차시 커리큘럼',
      description:
        '로블록스 코딩 게임 Code Builder의 12차시 커리큘럼으로 체험학습·방과후 코딩 수업을 준비하는 교사용 가이드입니다.',
      keywords: 'Code Builder 수업 가이드, 로블록스 코딩 게임, 로블록스 코딩 수업, 코딩 체험학습, 방과후 코딩',
    },
    en: {
      title: "Teacher's Guide | Code Builder's 12-Lesson Roblox Coding Curriculum",
      description:
        "A teacher's guide to running the Code Builder 12-lesson curriculum — the Roblox coding game — as a field trip or after-school class.",
      keywords: 'Code Builder teaching guide, roblox coding game, roblox coding class, coding field trip, after-school coding',
    },
  },
  share: {
    path: 'share.html',
    ko: {
      title: '플레이 영상 보내기 | 로블록스 코딩 게임 Code Builder',
      description:
        'Code Builder를 플레이하며 찍은 재미있는 영상을 보내주세요. 영상 1개당 최대 2GB까지 업로드할 수 있습니다.',
      keywords: 'Code Builder 영상 제보, 로블록스 코딩 게임, 플레이 영상 업로드, 구글 드라이브 업로드',
    },
    en: {
      title: 'Share Your Gameplay Video | Code Builder, the Roblox Coding Game',
      description:
        'Send us a fun video of you playing Code Builder. Upload up to 2GB per video.',
      keywords: 'Code Builder video submission, roblox coding game, gameplay video upload, google drive upload',
    },
  },
  popup: {
    path: 'popup.html',
    ko: {
      title: '동성로 놀장 로블록스 코딩 팝업 | Code Builder',
      description:
        '7.11(토)-7.12(일) 동성로 CGV한일 앞, 10분 만에 나만의 로블록스 게임을 만드는 블록코딩 체험 팝업. 준비물 없이 누구나 참여 가능.',
      keywords: '동성로 팝업, 로블록스 코딩 체험, 어린이 코딩 체험, 대구 코딩 팝업, 동성로 놀장, Code Builder',
      ogTitle: '동성로 놀장 로블록스 코딩 팝업 — 내 손으로 만드는 나만의 로블록스 게임',
      ogDescription: '7.11(토)-7.12(일) 동성로 CGV한일 앞에서 10분 코딩 체험을 해보세요. 사전예약 없이 현장 방문.',
    },
    en: {
      title: '동성로 놀장 로블록스 코딩 팝업 | Code Builder',
      description:
        '7.11(토)-7.12(일) 동성로 CGV한일 앞, 10분 만에 나만의 로블록스 게임을 만드는 블록코딩 체험 팝업. 준비물 없이 누구나 참여 가능.',
      keywords: '동성로 팝업, 로블록스 코딩 체험, 어린이 코딩 체험, 대구 코딩 팝업, 동성로 놀장, Code Builder',
      ogTitle: '동성로 놀장 로블록스 코딩 팝업 — 내 손으로 만드는 나만의 로블록스 게임',
      ogDescription: '7.11(토)-7.12(일) 동성로 CGV한일 앞에서 10분 코딩 체험을 해보세요. 사전예약 없이 현장 방문.',
    },
  },
  contact: {
    path: 'contact.html',
    ko: {
      title: '문의하기 | 로블록스 코딩 게임 Code Builder',
      description:
        '로블록스 코딩 게임 Code Builder에 대한 제휴, 도입, 일반 문의를 남겨주세요. 빠르게 답변드립니다.',
      keywords: 'Code Builder 문의, 로블록스 코딩 게임 문의, 제휴 문의, 학교 도입 문의',
    },
    en: {
      title: 'Contact | Code Builder, the Roblox Coding Game',
      description:
        'Get in touch about partnerships, school adoption, or general questions about Code Builder, the Roblox coding game.',
      keywords: 'contact Code Builder, roblox coding game inquiry, partnership inquiry, school adoption inquiry',
    },
  },
  forge: {
    path: 'forge.html',
    ko: {
      title: '로블록스 대장간 | 로블록스 코딩 게임 Code Builder',
      description:
        'Three.js로 만든 3D 아이템을 로블록스 스튜디오에 업로드 가능한 파일로 내보내는 Code Builder의 로블록스 대장간입니다.',
      keywords: 'Code Builder 로블록스 대장간, 로블록스 코딩 게임, 로블록스 아이템 제작, glb 내보내기, 로블록스 커스터마이징',
      ogTitle: '로블록스 대장간 — 내가 만든 3D 아이템을 로블록스로',
      ogDescription: 'Three.js로 만든 아이템을 돌려보고 실제 로블록스 스튜디오에서 쓸 수 있는 파일로 내보내보세요.',
    },
    en: {
      title: 'Roblox Forge | Code Builder, the Roblox Coding Game',
      description:
        'Export a Three.js-built 3D item as a file you can bring into Roblox Studio.',
      keywords: 'Code Builder Roblox Forge, roblox coding game, roblox item creation, glb export, roblox customization',
      ogTitle: 'Roblox Forge — Bring your 3D item into Roblox',
      ogDescription: 'Spin your Three.js item around, then export it as a file ready for Roblox Studio.',
    },
  },
  privacy: {
    path: 'privacy.html',
    ko: {
      title: '개인정보처리방침 | Code Builder',
      description: 'Code Builder 웹사이트의 개인정보처리방침입니다.',
      keywords: 'Code Builder 개인정보처리방침, 개인정보 보호',
    },
    en: {
      title: 'Privacy Policy | Code Builder',
      description: 'The privacy policy for the Code Builder website.',
      keywords: 'Code Builder privacy policy, data protection',
    },
  },
  terms: {
    path: 'terms.html',
    ko: {
      title: '이용약관 | Code Builder',
      description: 'Code Builder 웹사이트의 이용약관입니다.',
      keywords: 'Code Builder 이용약관',
    },
    en: {
      title: 'Terms of Service | Code Builder',
      description: 'The terms of service for the Code Builder website.',
      keywords: 'Code Builder terms of service',
    },
  },
};

module.exports = { SITE_URL, SITE_NAME, OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, PAGES };
