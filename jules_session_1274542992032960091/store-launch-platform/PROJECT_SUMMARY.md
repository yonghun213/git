# BB.Q Chicken 캐나다 매장 운영 매뉴얼 프로젝트

## 🎯 프로젝트 개요

이 프로젝트는 **캐나다 BB.Q Chicken 매장 관리자**를 위한 시각적 사용자 매뉴얼을 자동으로 생성하는 작업입니다.

## ✅ 완료된 작업

### 1. 환경 구축 및 서버 실행
- ✅ npm 의존성 설치 (403 packages)
- ✅ Prisma 데이터베이스 마이그레이션 실행
- ✅ 샘플 데이터 시딩 완료
- ✅ Next.js 개발 서버 localhost:3000 실행
- ✅ 모든 페이지 정상 작동 확인

### 2. 브라우저 기반 탐색 및 스크린샷 캡처
- ✅ 로그인 페이지 캡처 (`01-login-page.png`)
- ✅ 대시보드 캡처 (`02-dashboard.png`)
- ✅ 매장 상세 - 타임라인 뷰 캡처 (`03-store-detail-timeline.png`)
- ✅ 매장 상세 - 캘린더 뷰 캡처 (`04-store-detail-calendar.png`)
- ✅ 모든 스크린샷을 `./docs/screenshots/` 폴더에 저장

### 3. 기능 분석 및 매뉴얼 작성
- ✅ 코드 분석을 통한 UI 구성 요소 파악
- ✅ 각 화면의 기능 상세 분석
- ✅ 비전문가용 한국어 매뉴얼 작성 (`USER_GUIDE.md`)
- ✅ [화면 스크린샷] - [기능 설명] - [사용 단계] 형식으로 구성

## 📁 생성된 파일

```
store-launch-platform/
├── docs/
│   ├── README.md                          (1.9KB) - 문서 폴더 설명
│   ├── USER_GUIDE.md                      (17KB)  - 완전한 사용자 매뉴얼
│   └── screenshots/
│       ├── 01-login-page.png              (44KB)  - 로그인 화면
│       ├── 02-dashboard.png               (39KB)  - 대시보드
│       ├── 03-store-detail-timeline.png   (606KB) - 타임라인 뷰
│       └── 04-store-detail-calendar.png   (100KB) - 캘린더 뷰
└── .gitignore                             - Git 제외 파일 설정
```

## 📖 매뉴얼 구성

### USER_GUIDE.md 주요 섹션:

1. **시스템 개요**
   - 주요 기능 소개
   - 사용 목적

2. **로그인 페이지**
   - 화면 설명
   - 사용자 선택 방법
   - 단계별 접속 가이드

3. **대시보드 (메인 화면)**
   - Portfolio Overview 설명
   - 통계 카드 해석
   - 매장 목록 테이블 사용법

4. **매장 상세 페이지**
   - 8단계 매장 오픈 프로세스 상세 설명
   - 각 작업 카드 정보 해석
   - 필터 및 검색 기능 사용법

5. **일정 관리 기능**
   - 캘린더 뷰 사용법
   - 뷰 전환 (Timeline/Calendar/Week/Agenda)
   - 마일스톤 관리

6. **주요 용어 설명**
   - 매장 상태, 작업 상태, 역할, 국가 코드 등

7. **FAQ 및 문제 해결**
   - 자주 묻는 질문 7개
   - 일반적인 문제 해결 방법

8. **시스템 요구사항**
   - 권장 브라우저
   - 화면 해상도
   - 인터넷 연결

## 🏪 매장 오픈 8단계 프로세스

시스템은 총 55개의 작업을 8단계로 나누어 관리합니다:

| 단계 | 이름 | 작업 수 | 주요 내용 |
|------|------|---------|-----------|
| 0 | Deal / Planning | 7개 | 계약, 예산 승인, 임대 협상 |
| 1 | Design & Permits | 8개 | 설계, 허가 신청 및 승인 |
| 2 | Menu & Supply | 6개 | 메뉴 개발, 공급업체 선정 |
| 3 | Equipment | 5개 | 장비 선정 및 주문 |
| 4 | Construction | 11개 | 공사 진행 및 검사 |
| 5 | IT & Systems | 4개 | POS 및 네트워크 설치 |
| 6 | Licensing | 3개 | 사업자 등록 및 위생 검사 |
| 7 | Hiring & Training | 7개 | 직원 채용 및 5일 교육 |
| 8 | Opening | 4개 | 소프트 오픈 및 그랜드 오픈 |

## 📊 주요 마일스톤

- **Contract Signed** (계약 체결): 프로젝트 시작점
- **Construction Start** (공사 시작): 실제 공사 착수
- **Planned Open Date** (오픈 예정일): 최종 목표 날짜

## 🎨 화면 미리보기

### 1. 로그인 페이지
![로그인](https://github.com/user-attachments/assets/08e82c47-5ba6-40e4-bfdb-652609149abc)

### 2. 대시보드
![대시보드](https://github.com/user-attachments/assets/ee1c37f5-c660-4d17-825c-3dc5464e8f98)

### 3. 매장 상세 - 타임라인
![타임라인](https://github.com/user-attachments/assets/222fdd24-04ce-40fd-be80-8acf7f01128f)

### 4. 매장 상세 - 캘린더
![캘린더](https://github.com/user-attachments/assets/b8a71a5f-1bbc-4c9b-b668-4aa61f62c851)

## 🚀 시스템 실행 방법

### 초기 설정 (최초 1회)

```bash
cd jules_session_1274542992032960091/store-launch-platform

# 1. 의존성 설치
npm install

# 2. 데이터베이스 마이그레이션
npx prisma migrate dev

# 3. 샘플 데이터 입력
npx tsx prisma/seed.ts
```

### 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 📝 매뉴얼 보기

### 터미널에서 보기:
```bash
cat docs/USER_GUIDE.md
```

### GitHub에서 보기:
[USER_GUIDE.md](./docs/USER_GUIDE.md)

## 🎯 대상 사용자

- **주 대상**: 캐나다 BB.Q Chicken 매장 관리자
- **특징**: 비기술직 사용자를 위한 쉬운 설명
- **언어**: 한국어

## 💡 주요 특징

1. **비전문가 친화적**
   - 기술 용어 최소화
   - 단계별 상세 설명
   - 시각적 스크린샷 포함

2. **실무 중심**
   - 실제 사용 시나리오 기반
   - FAQ 및 문제 해결 가이드
   - 팁과 주의사항 포함

3. **완전한 커버리지**
   - 모든 주요 화면 설명
   - 55개 전체 작업 단계 설명
   - 필터링 및 검색 기능 포함

## 🔧 기술 스택

- **프레임워크**: Next.js 16.1.1 (App Router)
- **데이터베이스**: SQLite with Prisma ORM
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **캘린더**: React Big Calendar

## 📞 지원

시스템 사용 중 문제가 발생하면 매뉴얼의 "문제 해결" 섹션을 참고하세요.

---

**프로젝트 완료일**: 2025년 12월 25일  
**버전**: 1.0  
**작성자**: AI Agent (GitHub Copilot)
