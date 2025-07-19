# Herald Church AI System

🏛️ 교회 사역을 위한 AI 기반 관리 플랫폼

## 🌟 프로젝트 소개

Herald Church AI System은 교회 사역을 위한 종합적인 AI 기반 관리 플랫폼입니다. Palantir의 Titan Control Tower 스타일을 적용하여 직관적이고 강력한 인터페이스를 제공합니다.

## 🚀 주요 기능

### 📊 실시간 대시보드
- 출석률, 헌금, 성도 수 등 주요 지표 실시간 모니터링
- 트렌드 차트 및 데이터 시각화
- AI 기반 예측 분석

### 👥 성도 관리 시스템
- 성도 정보 입력/수정/삭제
- 가족 구성 및 신앙 상태 관리
- 사역 영역별 분류 및 관리

### 📖 설교 관리 및 분석
- 설교 내용 및 피드백 관리
- AI 기반 설교 분석
- 출석 데이터 연동

### 🤖 AI 코파일럿
- 실시간 AI 어시스턴트
- 교회 사역 관련 질의응답
- 실행 로그 및 분석 결과 제공

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Material-UI
- **Charts**: Recharts
- **Styling**: Emotion
- **Routing**: React Router DOM
- **Build Tool**: Create React App

## 📁 프로젝트 구조

```
church-ai-platform/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # React 컴포넌트들
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── MemberManagement.tsx
│   │   │   └── SermonManagement.tsx
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── README.md
├── backend/                 # Node.js 백엔드 (향후 개발 예정)
├── .gitignore
└── README.md
```

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone https://github.com/[your-username]/herald-church-ai.git
cd herald-church-ai/frontend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 브라우저에서 확인
http://localhost:3000

## 🌐 배포

### GitHub Pages
```bash
cd frontend
npm run build
npm run deploy
```

### Netlify
1. `npm run build` 실행
2. `build` 폴더를 Netlify에 드래그 앤 드롭

### Vercel
```bash
vercel --yes
```

## 🎨 디자인 철학

- **Palantir Titan Control Tower 스타일**: 전문적이고 강력한 인터페이스
- **다크 테마**: 장시간 사용에도 편안한 시각적 경험
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **직관적 네비게이션**: 사용자 친화적인 메뉴 구조

## 🔧 개발 가이드

### 코드 수정 후 확인
```bash
npm start  # 개발 서버 실행 (실시간 수정 반영)
```

### 빌드 및 배포
```bash
npm run build  # 프로덕션 빌드
npm run serve  # 로컬에서 빌드 결과 확인
```

## 📈 향후 계획

- [ ] 백엔드 API 개발 (Node.js + Express)
- [ ] 데이터베이스 연동 (MongoDB)
- [ ] AI 서비스 통합 (OpenAI GPT-4)
- [ ] 사용자 인증 시스템
- [ ] 모바일 앱 개발
- [ ] 다국어 지원

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**Herald Church AI System** - 교회 사역의 미래를 여는 AI 플랫폼 🏛️✨ 