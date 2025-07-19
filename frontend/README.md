# Herald Church AI System

교회 사역을 위한 AI 기반 관리 플랫폼입니다.

## 🚀 빠른 시작

### 로컬 개발
```bash
npm install
npm start
```

### 빌드
```bash
npm run build
```

## 🌐 배포 방법

### 1. GitHub Pages (추천)
1. GitHub에 저장소 생성
2. `package.json`의 `homepage` URL 수정
3. 다음 명령어 실행:
```bash
npm install gh-pages --save-dev
npm run deploy
```

### 2. Netlify (드래그 앤 드롭)
1. `npm run build` 실행
2. `build` 폴더를 Netlify에 드래그 앤 드롭
3. 자동으로 배포됨

### 3. Vercel
1. Vercel 계정 생성
2. `vercel login`
3. `vercel --yes` 실행

### 4. 로컬 서버
```bash
npm run build
npm run serve
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── Dashboard.tsx      # 메인 대시보드
│   ├── Layout.tsx         # 공통 레이아웃
│   ├── MemberManagement.tsx  # 성도 관리
│   └── SermonManagement.tsx  # 설교 관리
├── App.tsx               # 메인 앱
└── index.tsx            # 진입점
```

## 🔧 개발 팁

### 실시간 수정
1. `npm start`로 개발 서버 실행
2. 코드 수정 시 자동으로 브라우저 새로고침
3. 변경사항 즉시 확인 가능

### 배포 후 수정
1. 코드 수정
2. `npm run build` 실행
3. 배포 플랫폼에 다시 배포

## 🌟 주요 기능

- 📊 실시간 대시보드
- 👥 성도 관리 시스템
- 📖 설교 관리 및 분석
- 🤖 AI 코파일럿
- 📈 데이터 시각화

## 🎨 디자인

- Palantir Titan Control Tower 스타일
- 다크 테마
- 반응형 디자인
- Material-UI 기반
