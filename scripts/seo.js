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
};

module.exports = { SITE_URL, SITE_NAME, OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, PAGES };
