// ─── Translations ───────────────────────────────────────────
const T = {
  ko: {
    // Nav
    'nav-home':  '홈',
    'nav-about': '소개',
    'nav-guide': '매뉴얼',
    'nav-forge': '로블록스 대장간',
    'nav-share': '영상 공유',
    'nav-contact': '문의',
    'nav-play':  '지금 플레이하기',
    'footer-play': '플레이하기',

    // Image alt text
    'img-alt-hero-thumbnail': 'Code Builder 게임 화면',
    'img-alt-step1': '코드 빌더 창 열기',
    'img-alt-step2': '블록 조립',
    'img-alt-step3': '에이전트 실행',
    'img-alt-world': 'Code Builder 게임 월드',
    'img-alt-about-world': 'Code Builder 월드',
    'img-alt-guide-preview': 'Code Builder 수업 화면',
    'nav-toggle-aria': '메뉴 열기',

    // Home — Hero
    'hero-badge':  '로블록스 인게임 코딩 교육',
    'hero-title':  '내가 만든 코드가<br /><span class="highlight">즉시 게임 속에</span> 반영된다',
    'hero-sub':    'Code Builder는 로블록스 게임 플레이 도중 블록 코딩 창을 열어<br class="br-desktop" />에이전트에게 명령을 내리는 인게임 코딩 교육 플랫폼입니다.',
    'hero-play':   '▶ 지금 플레이하기',
    'hero-how':    '작동 방식 보기 ↓',
    'hero-scroll': '스크롤',

    // Home — Features
    'features-label': '왜 Code Builder인가',
    'features-title': '코딩 교육의<br />새로운 무대',
    'feat1-title': 'PC · 모바일 지원',
    'feat1-desc':  'C키(PC) 또는 <code>&lt;&gt;</code> 버튼(모바일)으로 코드 빌더 창을 열고 닫음',
    'feat2-title': '즉시 반영',
    'feat2-desc':  '블록을 조립하고 실행을 누르면 에이전트가 게임 속에서 즉시 반응',
    'feat3-title': '예측 불가 에이전트',
    'feat3-desc':  '에이전트가 항상 완벽하게 명령을 따르지 않음 — 그것도 게임의 재미이자 도전',
    'feat4-title': '12차시 커리큘럼',
    'feat4-desc':  '이동 → 꽃 심기 → 반복 → 조건 → 함수, 나만의 정원을 완성하며 익히는 12개의 점진적인 수업',

    // Home — Difference
    'diff-label': '다른 점',
    'diff-title': '게임 밖이 아니라,<br />게임 안에서 코딩합니다',
    'diff1-title': '웹 기반 코딩 학습',
    'diff1-desc':  '브라우저에서 블록을 조립하지만, 결과는 게임과 분리된 별도 화면에서만 확인합니다',
    'diff2-title': '게임 연동형 코딩 도구',
    'diff2-desc':  '게임과 연동되긴 하지만, 별도 프로그램 설치가 필요하고 대부분 유료입니다',
    'diff3-title': 'Code Builder',
    'diff3-desc':  '설치 없이, 로블록스를 플레이하는 도중 <kbd>C</kbd>키 하나로 코드창을 열고 즉시 실행합니다',

    // Home — How It Works
    'hiw-label': '작동 방식',
    'hiw-title': '세 단계, 바로 시작',
    'step1-title': '코드 빌더 창 열기',
    'step1-desc':  '게임 도중 <kbd>C</kbd>키(PC) 또는 <strong>&lt;&gt;</strong> 버튼(모바일)을 누르면 화면 우측에 블록 코딩 패널이 나타납니다.',
    'step2-title': '블록 조립',
    'step2-desc':  '이동 · 반복 · 조건 · 함수 블록을 드래그해 명령을 만들어보세요. 코딩 경험이 없어도 됩니다.',
    'step2-example': '앞으로 이동 → (앞으로 이동 × 오른쪽 회전) 3회 반복',
    'step3-title': '실행 — 게임 속에서 확인',
    'step3-desc':  '▶ 실행 버튼을 누르면 에이전트가 즉시 움직입니다. 결과를 보고 코드를 수정하며 배워나갑니다.',

    // Home — Streamers
    'streamers-label': '스트리머 플레이 영상',
    'streamers-title': '스트리머들도<br />직접 플레이했습니다',

    // Home — World
    'world-label': '게임 세계관',
    'world-title': '코드가 세상을 움직인다',
    'world-desc':  '코드 빌리지에서 다른 플레이어들과 함께 임무를 수행하고, 랭킹 보드에 이름을 올리세요.',
    'world-play':  '플레이하기',

    // CTA
    'cta-title':   '지금 바로 시작하세요',
    'cta-desc':    '로블록스 계정만 있으면 무료로 플레이할 수 있습니다.',
    'cta-play':    '▶ 지금 플레이하기',
    'cta-contact': '문의하기',

    // Footer
    'footer-copy': '© 2026 Code Builder (GTVS). All rights reserved.',

    // About — Page Hero
    'about-hero-label': 'About',
    'about-hero-title': '아이들이 이미 있는 곳으로<br /><span class="highlight">코딩 교육이 찾아간다.</span>',

    // About — Mission
    'mission-label': '미션',
    'mission-title': '교육이 아이들을<br />찾아가는 세상',
    'mission-p1': '아이들은 이미 로블록스 안에 있습니다. 하루 평균 2시간 이상을 게임 세계에서 보내는 아이들에게 우리가 코딩 교육을 들고 찾아갔습니다. Code Builder는 "공부하러 오세요"가 아닌 "놀면서 배우세요"의 철학을 실현합니다.',
    'mission-p2': '블록 코딩 창 하나가 게임을 멈추지 않습니다. 오히려 더 깊이 게임에 몰입하게 만드는 도구가 됩니다. 코드를 짜는 것이 즐겁고, 틀려도 다시 시도하고 싶어지는 경험— 그것이 Code Builder입니다.',

    // About — Roblox Stats
    'roblox-label': '왜 로블록스인가',
    'roblox-title': '세계에서 가장 큰<br />어린이 게임 플랫폼',
    'stat1-num':   '8,800만+',
    'stat1-label': '일간 활성 사용자(DAU)',
    'stat2-num':   '17세 이하',
    'stat2-label': '전체 사용자의 약 60%',
    'stat3-num':   '1위',
    'stat3-label': '어린이·청소년 게임 플랫폼',
    'stat4-num':   '200+',
    'stat4-label': '서비스 국가',
    'roblox-note': '로블록스는 이미 아이들의 일상입니다. 별도의 설치 없이 접근 가능한 플랫폼 위에서 코딩 교육이 진행되면, 진입 장벽이 사라집니다.',

    // About — Team
    'team-label': '팀',
    'team-title': '만드는 사람들',
    'ceo-name':  '최강민',
    'ceo-role':  'Co-Founder & CEO',
    'ceo-desc':  '비즈니스 전략, 커리큘럼 설계, 파일럿 운영을 총괄합니다.',
    'cto-name':  '개발 총괄',
    'cto-role':  'Co-Founder & CTO',
    'cto-desc':  '로블록스 플러그인 개발, 블록 코딩 엔진 설계 및 서버 아키텍처를 담당합니다.',

    // About — Pilot
    'pilot-label':     '파일럿',
    'pilot-title':     '현재 운영 중',
    'pilot-logo':      '해달에듀',
    'pilot-card-title': '해달에듀와 함께하는 파일럿 프로그램',
    'pilot-card-desc':  '해달에듀(HaedalEdu)와 협력하여 실제 학생들을 대상으로 Code Builder 커리큘럼을 운영 중입니다. 현장 피드백을 바탕으로 콘텐츠를 지속적으로 개선하고 있습니다.',
    'pilot-card-btn':   '제휴 문의하기',

    // About — CTA
    'about-cta-title': '직접 경험해보세요',
    'about-cta-desc':  '로블록스 계정만 있으면 무료로 플레이할 수 있습니다.',

    // Contact — Page Hero
    'contact-hero-label': 'Contact',
    'contact-hero-title': '무엇이든<br /><span class="highlight">물어보세요</span>',
    'contact-hero-sub':   '제휴, 도입 문의, 또는 그냥 궁금한 것 무엇이든 환영합니다.',

    // Contact — Form
    'form-name-label': '이름',
    'form-name-ph':    '홍길동',
    'form-org-label':  '기관명',
    'form-org-ph':     'OO초등학교 (선택)',
    'form-email-label': '이메일',
    'form-type-label': '문의 유형',
    'opt-select':   '선택해주세요',
    'opt-personal': '개인',
    'opt-academy':  '학교 · 기관',
    'opt-partner':  '제휴 · 미디어',
    'form-msg-label': '내용',
    'form-msg-ph':    '문의 내용을 자유롭게 작성해주세요.',
    'form-submit':    '보내기 →',
    'form-success':   '감사합니다! 빠른 시일 내에 연락드리겠습니다.',
    'form-error':     '문제가 발생했어요. 잠시 후 다시 시도하거나 이메일로 문의해주세요.',

    // Contact — Info
    'info1-title': '직접 연락하기',
    'info1-desc':  '양식 대신 직접 이메일로 연락해도 됩니다.',
    'info2-title': '게임 바로가기',
    'info2-desc':  '지금 바로 로블록스에서 Code Builder를 체험해보세요.',
    'info2-play':  '▶ 플레이하기',

    // Share — Page Hero
    'share-hero-label': 'Share',
    'share-hero-title': '재밌게 플레이한<br /><span class="highlight">영상을 보내주세요</span>',
    'share-hero-sub':   '플레이 영상을 올려주시면 저희 팀이 확인 후 소개해드릴게요. (영상 1개당 최대 2GB)',

    // Share — Form
    'share-nickname-label': '닉네임',
    'share-nickname-ph':    '로블록스 닉네임 (선택)',
    'share-email-ph':       'example@gmail.com',
    'share-email-hint':     '감사 인사를 보내드릴 이메일이에요.',
    'share-video-label':    '영상 파일',
    'share-video-hint':     'MP4, MOV, WebM 등 영상 파일 · 최대 2GB',
    'share-msg-label':      '한 마디',
    'share-msg-ph':         '영상에 대해 자유롭게 남겨주세요 (선택)',
    'share-submit':         '영상 보내기 →',
    'share-uploading':      '업로드 중…',
    'share-success':        '감사합니다! 영상이 잘 도착했어요.',
    'share-error':          '업로드에 실패했어요. 잠시 후 다시 시도해주세요.',
    'share-error-nofile':   '영상 파일을 선택해주세요.',
    'share-error-toolarge': '영상은 2GB 이하만 업로드할 수 있어요.',

    // Share — Info
    'share-info1-title': '업로드 안내',
    'share-info1-desc':  '영상은 저희 팀 구글 드라이브로 안전하게 전달되며, 검토 후 SNS나 커뮤니티에 소개될 수 있습니다.',

    // Roblox Forge (issue #15/#16/#17 done — wand, pet, shield concepts)
    'forge-hero-label': 'Roblox Forge',
    'forge-hero-title': '로블록스 대장간<br /><span class="highlight">프롬프트로 로블록스 아이템 만들기</span>',
    'forge-hero-sub':   '색상·재질·모양 키워드를 글로 적으면 즉시 3D 아이템으로 조립돼요. AI 호출 없이 브라우저에서 바로 만들어지고, 로블록스 스튜디오에 바로 가져갈 수 있는 파일로 내보낼 수 있어요.',
    'forge-concept-wand':   '🪄 마법 지팡이',
    'forge-concept-pet':    '🐾 숄더 펫',
    'forge-concept-shield': '🛡️ 커스텀 방패',
    'forge-prompt-label': '무엇을 만들고 싶나요?',
    'forge-prompt-ph-wand':    '예: 불타는 별 지팡이, 나무로 만든 하트 지팡이, 금색 초승달 지팡이',
    'forge-prompt-hint-wand':  '색상 · 재질(불/나무/어둠/얼음/금속) · 모양(별/하트/달/보석) 키워드를 인식해요. AI 없이 규칙 매칭이라 결과가 정확히 예측 가능해요.',
    'forge-prompt-ph-pet':     '예: 선글라스를 낀 고양이, 리본을 맨 강아지, 모자를 쓴 토끼',
    'forge-prompt-hint-pet':   '색상 · 동물(고양이/강아지/토끼) · 액세서리(선글라스/리본/모자) 키워드를 인식해요.',
    'forge-prompt-ph-shield':   '예: 우주가 그려진 방패, 불꽃이 타오르는 방패, 파도가 치는 방패',
    'forge-prompt-hint-shield': '색상 · 무늬(우주/불꽃/파도/번개) 키워드를 인식해요. AI 이미지 생성 대신 캔버스로 무늬를 직접 그려요.',
    'forge-build':        '🔨 만들기',
    'forge-export': '⬇ 내보내기 (.glb)',
    'forge-export-hint': '내보낸 .glb 파일은 Roblox Studio의 3D 가져오기(Import 3D)에서 바로 불러올 수 있어요.',
    'forge-matched-prefix': '인식된 키워드',
    'forge-matched-none': '키워드를 못 찾아서 기본 모양으로 만들었어요.',

    // Guide — Hero
    'guide-hero-label': 'Guide',
    'guide-hero-title': '선생님을 위한<br /><span class="highlight">체험학습 매뉴얼</span>',
    'guide-hero-sub':   'Code Builder 12차시 커리큘럼으로 코딩 수업을 준비하는 방법',

    // Guide — Intro
    'guide-intro-label': '가이드',
    'guide-intro-title': 'Code Builder로<br />코딩 수업을 시작하세요',
    'guide-intro-p1': 'Code Builder는 로블록스 플레이 도중 블록 코딩 창을 열어 에이전트에게 명령을 내리는 인게임 코딩 교육 플랫폼입니다. 별도 프로그램 설치 없이, 학생들은 이미 익숙한 로블록스 화면에서 바로 코딩을 시작할 수 있습니다.',
    'guide-intro-p2': '이 매뉴얼은 초·중등 교사와 코딩 강사가 12차시 커리큘럼을 체험학습·방과후 수업에 활용할 때 참고할 수 있도록 준비물, 진행 방법, 차시별 학습목표를 정리했습니다.',

    // Guide — Prep
    'guide-prep-label': '수업 준비',
    'guide-prep-title': '시작하기 전 준비물',
    'prep1-title': '기기',
    'prep1-desc':  'PC(키보드) 또는 모바일 · 태블릿. 학생 1인당 1대, 어려우면 2인 1팀도 가능합니다',
    'prep2-title': '인터넷 연결',
    'prep2-desc':  '로블록스 서버 접속을 위한 안정적인 와이파이가 필요합니다',
    'prep3-title': '로블록스 계정',
    'prep3-desc':  '학생별 또는 팀별로 미리 로그인해두면 수업 시간을 아낄 수 있습니다',
    'prep4-title': '플레이 링크 공유',
    'prep4-desc':  '게임 링크를 QR코드나 채팅으로 미리 공유해 접속 시간을 줄이세요',

    // Guide — Onboarding
    'guide-onboard-label': '첫 접속',
    'guide-onboard-title': '5단계 온보딩 튜토리얼',
    'guide-onboard-sub': '학생이 처음 접속하면 아래 5단계 카드가 자동으로 표시됩니다. 별도 설명 없이도 따라올 수 있지만, 미리 알아두면 질문에 빠르게 답할 수 있어요.',
    'onboard1-title': '코드 빌더에 오신 걸 환영해요!',
    'onboard1-desc':  '블록을 조립해 캐릭터를 움직여 보세요. 캐릭터가 항상 말을 잘 듣지 않을 수 있어요.',
    'onboard2-title': '열고 닫기',
    'onboard2-desc':  '<kbd>C</kbd> 키(PC) 또는 <strong>&lt;&gt;</strong> 버튼(모바일)으로 코드 빌더를 열고 닫을 수 있어요.',
    'onboard3-title': '캐릭터 선택',
    'onboard3-desc':  '헤더의 <strong>&lt;</strong> / <strong>&gt;</strong> 버튼으로 조종할 에이전트를 선택하세요.',
    'onboard4-title': '블록 팔레트',
    'onboard4-desc':  '왼쪽에서 블록을 드래그해 캔버스에 쌓으세요. 탭으로 블록 종류를 바꿀 수 있어요.',
    'onboard5-title': '실행해 보세요!',
    'onboard5-desc':  '실행 버튼으로 코드를 돌리고, 초기화 버튼으로 에이전트를 원위치로 돌릴 수 있어요.',

    // Guide — Blocks
    'guide-blocks-label': '블록 살펴보기',
    'guide-blocks-title': '사용 가능한 블록 7종',
    'block1-title': '앞으로 이동',
    'block1-desc':  'Action · 에이전트를 앞으로 한 칸(8스터드) 이동',
    'block2-title': '오른쪽 회전',
    'block2-desc':  'Action · 에이전트를 오른쪽으로 90도 회전',
    'block3-title': '꽃 심기',
    'block3-desc':  'Action · 에이전트가 서 있는 위치에 꽃을 심음',
    'block4-title': '반복',
    'block4-desc':  'Loop · 안에 담긴 블록을 N번 반복 실행 (최대 20회)',
    'block5-title': '장애물이 있으면',
    'block5-desc':  'Conditional · 전방에 장애물이 있을 때만 안의 블록 실행',
    'block6-title': '함수 만들기',
    'block6-desc':  'Function · 이름을 붙인 블록 묶음을 정의',
    'block7-title': '함수 호출',
    'block7-desc':  'Function · 미리 만들어 둔 함수를 실행',

    // Guide — Curriculum
    'guide-curriculum-label': '12차시 커리큘럼',
    'guide-curriculum-title': '차시별 학습목표 &amp; 진행 조건',
    'guide-curriculum-note': '각 차시는 50분 기준입니다. 학생이 골 타일에 도달하거나 목표 개수의 꽃을 심으면 시스템이 자동으로 다음 차시 맵으로 이동시킵니다 — 교사가 진행을 일일이 체크하지 않아도 됩니다.',

    'gl1-title': '코드빌더 시작하기',
    'gl1-goal':  '블록 코드로 캐릭터를 이동시킬 수 있다',
    'gl1-concept': '순차구조',
    'gl1-blocks':  '앞으로 이동 · 오른쪽 회전',
    'gl1-cond':  '진행 조건: <strong>Goal 타일 도달</strong>',

    'gl2-title': '미로 탈출하기',
    'gl2-goal':  '순서에 맞게 블록을 나열하여 미로를 탈출할 수 있다',
    'gl2-concept': '순차 심화',
    'gl2-blocks':  '앞으로 이동 · 오른쪽 회전',
    'gl2-cond':  '진행 조건: <strong>Goal 타일 도달</strong>',

    'gl3-title': '꽃 한 송이 심기',
    'gl3-goal':  '이동과 함께 꽃 심기 블록을 사용할 수 있다',
    'gl3-concept': '꽃 심기 도입',
    'gl3-blocks':  '앞으로 이동 · 꽃 심기',
    'gl3-cond':  '진행 조건: <strong>꽃 1송이 심기</strong>',

    'gl4-title': '꽃길 만들기',
    'gl4-goal':  '이동하면서 꽃을 심어 패턴을 만들 수 있다',
    'gl4-concept': '순차 + 꽃 심기',
    'gl4-blocks':  '앞으로 이동 · 꽃 심기',
    'gl4-cond':  '진행 조건: <strong>꽃 3송이 심기</strong>',

    'gl5-title': '반복으로 미로 탈출',
    'gl5-goal':  '반복 블록으로 같은 동작을 여러 번 실행할 수 있다',
    'gl5-concept': '반복문',
    'gl5-blocks':  '반복',
    'gl5-cond':  '진행 조건: <strong>Goal 타일 도달</strong>',

    'gl6-title': '반복으로 꽃밭 만들기',
    'gl6-goal':  '반복 블록으로 규칙적인 꽃밭을 만들 수 있다',
    'gl6-concept': '반복 + 꽃 심기',
    'gl6-blocks':  '반복 · 꽃 심기',
    'gl6-cond':  '진행 조건: <strong>꽃 5송이 심기</strong>',

    'gl7-title': '장애물 감지하기',
    'gl7-goal':  '조건 블록으로 장애물을 감지하고 행동을 바꿀 수 있다',
    'gl7-concept': '조건문',
    'gl7-blocks':  '장애물이 있으면',
    'gl7-cond':  '진행 조건: <strong>Goal 타일 도달</strong>',

    'gl8-title': '반복 속 조건',
    'gl8-goal':  '반복 안에 조건을 넣어 복잡한 동작을 만들 수 있다',
    'gl8-concept': '반복 + 조건 중첩',
    'gl8-blocks':  '반복 · 장애물이 있으면',
    'gl8-cond':  '진행 조건: <strong>Goal 타일 도달</strong>',

    'gl9-title': '나만의 함수 만들기',
    'gl9-goal':  '함수를 정의하고 호출하여 코드를 재사용할 수 있다',
    'gl9-concept': '함수 정의 · 호출',
    'gl9-blocks':  '함수 만들기 · 함수 호출',
    'gl9-cond':  '진행 조건: <strong>꽃 3송이 심기</strong>',

    'gl10-title': '함수로 꽃길 만들기',
    'gl10-goal':  '함수와 반복 블록을 함께 사용하여 자동으로 꽃길을 만들 수 있다',
    'gl10-concept': '함수 + 반복 응용',
    'gl10-blocks':  '함수 · 반복 · 꽃 심기',
    'gl10-cond':  '진행 조건: <strong>꽃 5송이 심기</strong>',

    'gl11-title': '함수 여러 개 조합하기',
    'gl11-goal':  '여러 함수를 만들고 조합하여 복잡한 동작을 만들 수 있다',
    'gl11-concept': '함수 심화',
    'gl11-blocks':  '함수 만들기 · 함수 호출',
    'gl11-cond':  '진행 조건: <strong>꽃 6송이 심기</strong>',

    'gl12-title': '나만의 정원 만들기',
    'gl12-goal':  '배운 모든 블록을 활용하여 나만의 정원을 창작할 수 있다',
    'gl12-concept': '자유 프로젝트',
    'gl12-blocks':  '전체 블록',
    'gl12-cond':  '진행 조건: <strong>꽃 10송이 심기</strong>',

    // Guide — Tips
    'guide-tips-label': '진행 팁',
    'guide-tips-title': '수업이 매끄러워지는 4가지 팁',
    'tip1-title': '자동 진행 시스템',
    'tip1-desc':  '목표(골 도달 · 꽃 개수)를 달성하면 시스템이 자동으로 다음 차시 맵으로 이동시킵니다. 진행 여부를 따로 체크하지 않아도 됩니다',
    'tip2-title': '리더보드로 동기부여',
    'tip2-desc':  '화면 좌측 상단에 차시 진행 순위가 표시됩니다. 서로의 진행 상황을 보며 자연스럽게 동기부여가 됩니다',
    'tip3-title': '초기화 버튼 활용',
    'tip3-desc':  '에이전트가 막히거나 실수했을 때 초기화 버튼으로 위치만 리셋할 수 있어요. 심어둔 꽃은 그대로 유지됩니다',
    'tip4-title': '안전한 명령 실행',
    'tip4-desc':  '서버가 모든 명령을 검증해 허용된 블록만 실행되므로, 예상치 못한 동작으로부터 안전합니다',

    // Guide — CTA
    'guide-cta-title': '체험학습 도입이 궁금하신가요?',
    'guide-cta-desc':  '학교 · 학원 · 기관 단위 체험학습 및 방과후 수업 도입 문의를 받고 있습니다.',
  },

  en: {
    // Nav
    'nav-home':    'Home',
    'nav-about':   'About',
    'nav-guide':   'Guide',
    'nav-forge':   'Roblox Forge',
    'nav-share':   'Share a Video',
    'nav-contact': 'Contact',
    'nav-play':    'Play Now',
    'footer-play': 'Play',

    // Image alt text
    'img-alt-hero-thumbnail': 'Code Builder Roblox coding game screenshot',
    'img-alt-step1': 'Opening the Code Builder window',
    'img-alt-step2': 'Assembling code blocks',
    'img-alt-step3': 'Running the agent',
    'img-alt-world': 'Code Builder game world',
    'img-alt-about-world': 'Code Builder game world',
    'img-alt-guide-preview': 'Code Builder classroom screen',
    'nav-toggle-aria': 'Open menu',

    // Home — Hero
    'hero-badge':  'Roblox In-Game Coding Education',
    'hero-title':  'The code I made is<br /><span class="highlight">immediately reflected</span><br />in the game',
    'hero-sub':    'Code Builder is an in-game block coding platform that lets you open a coding window during Roblox gameplay<br class="br-desktop" />and give commands to your agent.',
    'hero-play':   '▶ Play Now',
    'hero-how':    'See How It Works ↓',
    'hero-scroll': 'Scroll',

    // Home — Features
    'features-label': 'Why Code Builder',
    'features-title': 'A New Stage for<br />Coding Education',
    'feat1-title': 'PC & Mobile',
    'feat1-desc':  'Open the Code Builder window with the <code>C</code> key (PC) or the <code>&lt;&gt;</code> button (mobile)',
    'feat2-title': 'Instant Feedback',
    'feat2-desc':  'Assemble blocks and press Run — your agent reacts in the game world instantly',
    'feat3-title': 'Unpredictable Agent',
    'feat3-desc':  'Your agent won\'t always follow commands perfectly — that\'s part of the fun and the challenge',
    'feat4-title': '12-Lesson Curriculum',
    'feat4-desc':  'Movement → planting → loops → conditionals → functions — 12 progressive lessons that build toward your own garden',

    // Home — Difference
    'diff-label': 'What\'s Different',
    'diff-title': 'Not outside the game —<br />coding happens inside it',
    'diff1-title': 'Web-Based Coding Tools',
    'diff1-desc':  'You assemble blocks in a browser, but the result only shows up on a separate screen, apart from any game',
    'diff2-title': 'Game-Linked Coding Tools',
    'diff2-desc':  'These connect to a game, but require a separate program install and are mostly paid',
    'diff3-title': 'Code Builder',
    'diff3-desc':  'No install — press <kbd>C</kbd> while playing Roblox to open the code window and run it instantly',

    // Home — How It Works
    'hiw-label': 'How It Works',
    'hiw-title': 'Three Steps, Start Now',
    'step1-title': 'Open the Code Builder',
    'step1-desc':  'During gameplay, press <kbd>C</kbd> (PC) or the <strong>&lt;&gt;</strong> button (mobile) to open the block coding panel on the right side of the screen.',
    'step2-title': 'Assemble Blocks',
    'step2-desc':  'Drag movement, loop, condition, and function blocks to build your command. No prior coding experience needed.',
    'step2-example': 'Move Forward → (Move Forward × Turn Right) repeat 3 times',
    'step3-title': 'Run — See It in the Game',
    'step3-desc':  'Press ▶ Run and the agent moves immediately. Watch the result, tweak your code, and learn as you go.',

    // Home — Streamers
    'streamers-label': 'Streamer Gameplay',
    'streamers-title': 'Streamers Have<br />Played It Too',

    // Home — World
    'world-label': 'Game World',
    'world-title': 'Code Moves the World',
    'world-desc':  'Complete missions with other players in Code Village and get your name on the leaderboard.',
    'world-play':  'Play Now',

    // CTA
    'cta-title':   'Start Right Now',
    'cta-desc':    'Free to play with just a Roblox account.',
    'cta-play':    '▶ Play Now',
    'cta-contact': 'Contact Us',

    // Footer
    'footer-copy': '© 2026 Code Builder (GTVS). All rights reserved.',

    // About — Page Hero
    'about-hero-label': 'About',
    'about-hero-title': 'Coding education goes<br /><span class="highlight">where the kids already are.</span>',

    // About — Mission
    'mission-label': 'Mission',
    'mission-title': 'A world where education<br />finds the children',
    'mission-p1': 'Children are already inside Roblox — spending more than 2 hours a day in the game world. Code Builder brings coding education to them. Not "come study," but "learn while you play."',
    'mission-p2': 'The block coding window doesn\'t pause the game. It deepens immersion. Writing code is enjoyable; failing makes you want to try again. That\'s Code Builder.',

    // About — Roblox Stats
    'roblox-label': 'Why Roblox',
    'roblox-title': 'The World\'s Largest<br />Children\'s Gaming Platform',
    'stat1-num':   '88M+',
    'stat1-label': 'Daily Active Users (DAU)',
    'stat2-num':   'Under 17',
    'stat2-label': '~60% of all users',
    'stat3-num':   '#1',
    'stat3-label': 'Children & Teen Platform',
    'stat4-num':   '200+',
    'stat4-label': 'Countries Served',
    'roblox-note': 'Roblox is already part of children\'s daily lives. Coding education on a platform they already access — with no extra installation — removes every barrier to entry.',

    // About — Team
    'team-label': 'Team',
    'team-title': 'The People Behind It',
    'ceo-name':  'Kangmin Choi',
    'ceo-role':  'Co-Founder & CEO',
    'ceo-desc':  'Leads business strategy, curriculum design, and pilot operations.',
    'cto-name':  'Dev Lead',
    'cto-role':  'Co-Founder & CTO',
    'cto-desc':  'Handles Roblox plugin development, block coding engine design, and server architecture.',

    // About — Pilot
    'pilot-label':     'Pilot',
    'pilot-title':     'Currently Running',
    'pilot-logo':      'HaedalEdu',
    'pilot-card-title': 'Pilot Program with HaedalEdu',
    'pilot-card-desc':  'In partnership with HaedalEdu, we\'re running the Code Builder curriculum with real students. We continuously improve content based on on-site feedback.',
    'pilot-card-btn':   'Partnership Inquiry',

    // About — CTA
    'about-cta-title': 'Try It Yourself',
    'about-cta-desc':  'Free to play with just a Roblox account.',

    // Contact — Page Hero
    'contact-hero-label': 'Contact',
    'contact-hero-title': 'Ask us<br /><span class="highlight">anything</span>',
    'contact-hero-sub':   'Partnership inquiries, adoption questions, or just plain curiosity — all welcome.',

    // Contact — Form
    'form-name-label': 'Name',
    'form-name-ph':    'Jane Doe',
    'form-org-label':  'Organization',
    'form-org-ph':     'Springfield Elementary (optional)',
    'form-email-label': 'Email',
    'form-type-label': 'Inquiry Type',
    'opt-select':   'Please select',
    'opt-personal': 'Individual',
    'opt-academy':  'School · Institution',
    'opt-partner':  'Partnership · Media',
    'form-msg-label': 'Message',
    'form-msg-ph':    'Tell us what\'s on your mind.',
    'form-submit':    'Send →',
    'form-success':   'Thank you! We\'ll get back to you soon.',
    'form-error':     'Something went wrong. Please try again shortly or email us directly.',

    // Contact — Info
    'info1-title': 'Contact Directly',
    'info1-desc':  'Feel free to email us directly instead of using the form.',
    'info2-title': 'Play the Game',
    'info2-desc':  'Experience Code Builder on Roblox right now.',
    'info2-play':  '▶ Play Now',

    // Share — Page Hero
    'share-hero-label': 'Share',
    'share-hero-title': 'Send Us Your<br /><span class="highlight">Best Gameplay Clips</span>',
    'share-hero-sub':   "Upload a video of you playing and we'll check it out — it might get featured. (Max 2GB per video)",

    // Share — Form
    'share-nickname-label': 'Nickname',
    'share-nickname-ph':    'Your Roblox nickname (optional)',
    'share-email-ph':       'you@example.com',
    'share-email-hint':     "We'll send a thank-you note to this address.",
    'share-video-label':    'Video File',
    'share-video-hint':     'MP4, MOV, WebM, etc. · Max 2GB',
    'share-msg-label':      'A Note',
    'share-msg-ph':         "Tell us about the video (optional)",
    'share-submit':         'Send Video →',
    'share-uploading':      'Uploading…',
    'share-success':        "Thanks! Your video made it through.",
    'share-error':          'Upload failed. Please try again shortly.',
    'share-error-nofile':   'Please choose a video file.',
    'share-error-toolarge': 'Videos must be 2GB or smaller.',

    // Share — Info
    'share-info1-title': 'Upload Info',
    'share-info1-desc':  "Videos are sent securely to our team's Google Drive and may be featured on social media or in our community afterward.",

    // Roblox Forge (issue #15/#16/#17 done — wand, pet, shield concepts)
    'forge-hero-label': 'Roblox Forge',
    'forge-hero-title': 'Roblox Forge<br /><span class="highlight">Build a Roblox Item From a Prompt</span>',
    'forge-hero-sub':   "Describe a color, material, and shape and it assembles into a 3D item instantly — no AI call, right in your browser — then export it as a file ready for Roblox Studio.",
    'forge-concept-wand':   '🪄 Magic Wand',
    'forge-concept-pet':    '🐾 Shoulder Pet',
    'forge-concept-shield': '🛡️ Custom Shield',
    'forge-prompt-label': 'What do you want to make?',
    'forge-prompt-ph-wand':    'e.g. a flaming star wand, a wooden heart wand, a gold crescent-moon wand',
    'forge-prompt-hint-wand':  'Recognizes color, material (fire/wood/dark/ice/metal), and shape (star/heart/moon/gem) keywords — plain rule matching, no AI, so results are exactly predictable.',
    'forge-prompt-ph-pet':     'e.g. a cat with sunglasses, a dog with a bowtie, a rabbit with a hat',
    'forge-prompt-hint-pet':   'Recognizes color, animal (cat/dog/rabbit), and accessory (sunglasses/bowtie/hat) keywords.',
    'forge-prompt-ph-shield':   'e.g. a shield painted with space, a shield engulfed in flames, a shield with crashing waves',
    'forge-prompt-hint-shield': 'Recognizes color and pattern (space/fire/waves/lightning) keywords. Instead of AI image generation, the pattern is drawn directly on a canvas.',
    'forge-build':        '🔨 Build',
    'forge-export': '⬇ Export (.glb)',
    'forge-export-hint': 'The exported .glb file can be imported directly via Roblox Studio\'s 3D Import.',
    'forge-matched-prefix': 'Matched keywords',
    'forge-matched-none': "Couldn't find a keyword, so this defaulted to a plain shape.",

    // Guide — Hero
    'guide-hero-label': 'Guide',
    'guide-hero-title': 'A Field-Trip Manual<br /><span class="highlight">for Teachers</span>',
    'guide-hero-sub':   'How to run a coding class with the Code Builder 12-lesson curriculum',

    // Guide — Intro
    'guide-intro-label': 'Guide',
    'guide-intro-title': 'Start Teaching<br />with Code Builder',
    'guide-intro-p1': 'Code Builder is an in-game coding education platform where students open a block coding window during Roblox gameplay and give commands to their agent. With no separate install, students can start coding right inside a screen they already know.',
    'guide-intro-p2': 'This manual gives elementary and middle school teachers and coding instructors what they need to run the 12-lesson curriculum as a field trip or after-school class — what to prepare, how to run it, and each lesson\'s learning goal.',

    // Guide — Prep
    'guide-prep-label': 'Before Class',
    'guide-prep-title': 'What You\'ll Need',
    'prep1-title': 'Devices',
    'prep1-desc':  'PC (keyboard) or mobile/tablet. One per student is ideal; pairs of two also work',
    'prep2-title': 'Internet Connection',
    'prep2-desc':  'A stable Wi-Fi connection is needed to reach Roblox servers',
    'prep3-title': 'Roblox Accounts',
    'prep3-desc':  'Have students (or teams) log in ahead of time to save class time',
    'prep4-title': 'Share the Play Link',
    'prep4-desc':  'Share the game link via QR code or chat beforehand to speed up joining',

    // Guide — Onboarding
    'guide-onboard-label': 'First Launch',
    'guide-onboard-title': 'The 5-Step Onboarding Tutorial',
    'guide-onboard-sub': 'New players automatically see these 5 cards on first launch. Students can follow along on their own, but knowing them ahead of time helps you answer questions fast.',
    'onboard1-title': 'Welcome to Code Builder!',
    'onboard1-desc':  'Assemble blocks to move your character. Your character won\'t always listen perfectly.',
    'onboard2-title': 'Open & Close',
    'onboard2-desc':  'Press <kbd>C</kbd> (PC) or the <strong>&lt;&gt;</strong> button (mobile) to open and close the Code Builder.',
    'onboard3-title': 'Select a Character',
    'onboard3-desc':  'Use the <strong>&lt;</strong> / <strong>&gt;</strong> buttons in the header to pick which agent to control.',
    'onboard4-title': 'Block Palette',
    'onboard4-desc':  'Drag blocks from the left onto the canvas. Switch categories using the tabs.',
    'onboard5-title': 'Give It a Run!',
    'onboard5-desc':  'Press Run to execute your code, and Reset to move the agent back to its start position.',

    // Guide — Blocks
    'guide-blocks-label': 'The Blocks',
    'guide-blocks-title': '7 Available Blocks',
    'block1-title': 'Move Forward',
    'block1-desc':  'Action · Moves the agent forward one tile (8 studs)',
    'block2-title': 'Turn Right',
    'block2-desc':  'Action · Rotates the agent 90 degrees to the right',
    'block3-title': 'Place Flower',
    'block3-desc':  'Action · Plants a flower at the agent\'s current position',
    'block4-title': 'Repeat',
    'block4-desc':  'Loop · Runs the blocks inside N times (max 20)',
    'block5-title': 'If Obstacle',
    'block5-desc':  'Conditional · Runs the blocks inside only when an obstacle is ahead',
    'block6-title': 'Define Function',
    'block6-desc':  'Function · Names and defines a group of blocks',
    'block7-title': 'Call Function',
    'block7-desc':  'Function · Runs a previously defined function',

    // Guide — Curriculum
    'guide-curriculum-label': '12-Lesson Curriculum',
    'guide-curriculum-title': 'Learning Goals &amp; Progress Conditions',
    'guide-curriculum-note': 'Each lesson runs about 50 minutes. When a student reaches the goal tile or plants the target number of flowers, the system automatically advances them to the next lesson\'s map — no manual checking required.',

    'gl1-title': 'Getting Started with Code Builder',
    'gl1-goal':  'Can move the character using block code',
    'gl1-concept': 'Sequencing',
    'gl1-blocks':  'Move Forward · Turn Right',
    'gl1-cond':  'Progress: <strong>Reach the Goal Tile</strong>',

    'gl2-title': 'Escaping the Maze',
    'gl2-goal':  'Can escape a maze by arranging blocks in the right order',
    'gl2-concept': 'Sequencing (Advanced)',
    'gl2-blocks':  'Move Forward · Turn Right',
    'gl2-cond':  'Progress: <strong>Reach the Goal Tile</strong>',

    'gl3-title': 'Planting One Flower',
    'gl3-goal':  'Can use the Place Flower block together with movement',
    'gl3-concept': 'Intro to Place Flower',
    'gl3-blocks':  'Move Forward · Place Flower',
    'gl3-cond':  'Progress: <strong>Plant 1 flower</strong>',

    'gl4-title': 'Making a Flower Path',
    'gl4-goal':  'Can plant flowers while moving to form a pattern',
    'gl4-concept': 'Sequencing + Planting',
    'gl4-blocks':  'Move Forward · Place Flower',
    'gl4-cond':  'Progress: <strong>Plant 3 flowers</strong>',

    'gl5-title': 'Escaping the Maze with Loops',
    'gl5-goal':  'Can repeat the same action multiple times using a loop block',
    'gl5-concept': 'Loops',
    'gl5-blocks':  'Repeat',
    'gl5-cond':  'Progress: <strong>Reach the Goal Tile</strong>',

    'gl6-title': 'Building a Flower Bed with Loops',
    'gl6-goal':  'Can create a regular flower bed using a loop block',
    'gl6-concept': 'Loops + Planting',
    'gl6-blocks':  'Repeat · Place Flower',
    'gl6-cond':  'Progress: <strong>Plant 5 flowers</strong>',

    'gl7-title': 'Detecting Obstacles',
    'gl7-goal':  'Can detect an obstacle and change behavior using a conditional block',
    'gl7-concept': 'Conditionals',
    'gl7-blocks':  'If Obstacle',
    'gl7-cond':  'Progress: <strong>Reach the Goal Tile</strong>',

    'gl8-title': 'Conditionals Inside Loops',
    'gl8-goal':  'Can create complex behavior by nesting a conditional inside a loop',
    'gl8-concept': 'Loops + Nested Conditionals',
    'gl8-blocks':  'Repeat · If Obstacle',
    'gl8-cond':  'Progress: <strong>Reach the Goal Tile</strong>',

    'gl9-title': 'Making Your Own Function',
    'gl9-goal':  'Can reuse code by defining and calling a function',
    'gl9-concept': 'Defining & Calling Functions',
    'gl9-blocks':  'Define Function · Call Function',
    'gl9-cond':  'Progress: <strong>Plant 3 flowers</strong>',

    'gl10-title': 'A Flower Path Using Functions',
    'gl10-goal':  'Can combine functions and loops to build a flower path automatically',
    'gl10-concept': 'Functions + Loops',
    'gl10-blocks':  'Function · Repeat · Place Flower',
    'gl10-cond':  'Progress: <strong>Plant 5 flowers</strong>',

    'gl11-title': 'Combining Multiple Functions',
    'gl11-goal':  'Can build complex behavior by creating and combining several functions',
    'gl11-concept': 'Functions (Advanced)',
    'gl11-blocks':  'Define Function · Call Function',
    'gl11-cond':  'Progress: <strong>Plant 6 flowers</strong>',

    'gl12-title': 'Building Your Own Garden',
    'gl12-goal':  'Can create a personal garden using everything learned so far',
    'gl12-concept': 'Free Project',
    'gl12-blocks':  'All blocks',
    'gl12-cond':  'Progress: <strong>Plant 10 flowers</strong>',

    // Guide — Tips
    'guide-tips-label': 'Tips',
    'guide-tips-title': '4 Tips for a Smoother Class',
    'tip1-title': 'Automatic Progression',
    'tip1-desc':  'When students reach a goal (tile or flower count), the system automatically moves them to the next lesson\'s map — no manual checking needed',
    'tip2-title': 'Motivate with the Leaderboard',
    'tip2-desc':  'A lesson-progress ranking shows in the top-left of the screen. Seeing each other\'s progress naturally motivates students',
    'tip3-title': 'Use the Reset Button',
    'tip3-desc':  'If an agent gets stuck or makes a mistake, Reset only resets its position — any flowers already planted stay put',
    'tip4-title': 'Safe Command Execution',
    'tip4-desc':  'The server validates every command so only allowed blocks run, keeping students safe from unexpected behavior',

    // Guide — CTA
    'guide-cta-title': 'Curious about bringing this to your students?',
    'guide-cta-desc':  'We welcome inquiries about field trips and after-school programs for schools, academies, and institutions.',
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = T;
}
