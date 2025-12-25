# BB.Q Chicken 캐나다 매장 운영 매뉴얼
## Store Launch Platform 사용자 가이드

---

## 📋 목차
1. [시스템 개요](#시스템-개요)
2. [로그인 페이지](#1-로그인-페이지)
3. [대시보드 (메인 화면)](#2-대시보드-메인-화면)
4. [매장 상세 페이지](#3-매장-상세-페이지)
5. [일정 관리 기능](#4-일정-관리-기능)

---

## 시스템 개요

이 시스템은 BB.Q Chicken 매장의 **오픈 준비 과정**을 관리하는 플랫폼입니다. 
새로운 매장을 오픈할 때 필요한 모든 작업(계약, 설계, 인테리어, 직원 채용, 교육 등)을 **단계별로 추적**하고 관리할 수 있습니다.

### 주요 기능
- ✅ 매장별 오픈 진행 상황 확인
- ✅ 단계별 작업 목록 및 일정 관리
- ✅ 타임라인 및 캘린더 뷰
- ✅ 작업 필터링 및 검색

---

## 1. 로그인 페이지

![로그인 페이지](./screenshots/01-login-page.png)

### 화면 설명
로그인 페이지에서는 시스템에 접속할 사용자를 선택합니다.

### 화면 구성 요소
1. **제목**: "Store Launch Ops" - 시스템 이름
2. **안내 문구**: "Select a user to simulate login (MVP Mode)" - 사용자 선택 안내
3. **사용자 목록**: 
   - Alice Admin (관리자)
   - Pablo PM (프로젝트 매니저)
   - Carlos Contributor (기여자)
   - Maria Contributor (기여자)
   - Victor Viewer (조회 전용)
4. **Enter Platform 버튼**: 시스템 진입 버튼

### 사용 방법

**단계 1**: 본인의 역할에 맞는 사용자를 선택합니다
- **매장 관리자/점주**: "Alice Admin" 또는 "Pablo PM" 선택
- **일반 직원**: "Carlos Contributor" 또는 "Maria Contributor" 선택
- **조회만 필요한 경우**: "Victor Viewer" 선택

**단계 2**: 원하는 사용자의 라디오 버튼을 클릭합니다

**단계 3**: 화면 하단의 파란색 "Enter Platform" 버튼을 클릭합니다

**단계 4**: 자동으로 대시보드 화면으로 이동합니다

> 💡 **팁**: 대부분의 매장 관리자는 "Alice Admin"이나 "Pablo PM"을 선택하시면 됩니다.

---

## 2. 대시보드 (메인 화면)

![대시보드](./screenshots/02-dashboard.png)

### 화면 설명
대시보드는 시스템의 메인 화면으로, **전체 매장의 오픈 진행 상황**을 한눈에 볼 수 있습니다.

### 화면 구성 요소

#### 상단 네비게이션 바
1. **StoreLaunch 로고**: 클릭하면 대시보드로 이동
2. **Overview**: 현재 대시보드 페이지
3. **Stores**: 매장 목록 (현재는 Overview와 동일)
4. **Pricing**: 가격 정보 (아직 준비 중)
5. **로그인 정보**: 현재 로그인한 사용자 이메일 표시
6. **Logout 버튼**: 로그아웃

#### Portfolio Overview (전체 통계)
세 개의 통계 카드로 구성:

1. **Total Stores (전체 매장 수)**
   - 의미: 시스템에 등록된 전체 매장 개수
   - 예시: "1" - 현재 1개 매장이 등록됨

2. **Active Launches (진행 중인 오픈)**
   - 의미: 현재 오픈 준비 중인 매장 개수
   - 파란색 숫자로 강조 표시
   - 예시: "1" - 1개 매장이 오픈 준비 중

3. **Countries (국가)**
   - 의미: 매장이 위치한 국가 코드
   - 예시: "MX" - 멕시코에 매장이 있음

#### Active Stores (매장 목록 테이블)
현재 진행 중인 매장들의 상세 정보를 테이블 형식으로 표시:

| 열 이름 | 설명 |
|---------|------|
| **Name** | 매장 이름 (파란색 링크 - 클릭하면 상세 페이지로 이동) |
| **Country** | 국가 코드 (MX=멕시코, CO=콜롬비아 등) |
| **Planned Open** | 계획된 오픈 날짜 |
| **Status** | 현재 진행 상태 (PLANNING=계획 중, CONSTRUCTION=공사 중, OPEN=오픈 완료) |

### 사용 방법

**매장 상세 정보 보기**
1. Active Stores 테이블에서 확인하고 싶은 매장 이름을 찾습니다
2. 매장 이름(파란색 링크)을 클릭합니다
3. 매장 상세 페이지로 이동합니다

**전체 현황 파악하기**
- 상단의 세 가지 통계 카드를 확인하여 전체 매장 운영 현황을 파악합니다
- 여러 국가에 매장이 있는 경우 "Countries" 카드에서 확인 가능합니다

> 💡 **팁**: 매장 이름을 클릭하면 해당 매장의 모든 작업 내역과 일정을 확인할 수 있습니다.

---

## 3. 매장 상세 페이지

![매장 상세 - 타임라인 뷰](./screenshots/03-store-detail-timeline.png)

### 화면 설명
특정 매장의 오픈 준비 과정을 **단계별로 상세하게** 확인할 수 있는 페이지입니다.

### 화면 구성 요소

#### 1. 매장 정보 헤더
- **← Back to Dashboard**: 대시보드로 돌아가기 버튼
- **매장 이름**: "Mexico City Flagship" - 매장명 표시
- **위치 정보**: "Mexico City, MX" - 도시와 국가
- **오픈 예정일**: "Open: 6/1/2025" - 계획된 오픈 날짜

#### 2. 뷰 전환 버튼
- **Timeline**: 단계별 작업 목록 (현재 화면)
- **Calendar**: 캘린더 형식으로 보기
- **+ New Task**: 새 작업 추가 버튼 (주황색)

#### 3. 필터 및 검색 도구
- **All Tasks / Focus**: 전체 작업 또는 중요 작업만 보기
- **All Phases**: 단계별 필터 (0. Deal / Planning, 1. Design & Permits 등)
- **All Statuses**: 상태별 필터 (Not Started, In Progress, Done)
- **All Roles**: 담당자별 필터 (Project Manager, IT, Operations 등)
- **Search...**: 작업 검색창

#### 4. 매장 상태 정보 (왼쪽 사이드바)
- **STATUS**: 현재 진행 상태 (PLANNING)
- **Tasks**: 전체 작업 수 (55 / 55)
- **Milestones**: 주요 일정
  - Planned Open Date: 6/1/2025 (오픈 예정일)
  - Construction Start: 3/3/2025 (공사 시작일)
  - Contract Signed: 12/3/2024 (계약 체결일)

#### 5. 단계별 작업 목록 (타임라인 뷰)

시스템은 매장 오픈을 **8단계**로 나누어 관리합니다:

##### **0. Deal / Planning (계약 및 계획)** - 7개 작업
- Approve Budget (예산 승인)
- Contract Signed (계약 체결) ⭐ 중요 마일스톤
- Define Store Concept & Format (매장 컨셉 정의)
- Site Survey / Feasibility (현장 조사)
- Lease Negotiation (임대 협상)
- Sign Lease (임대 계약)
- Kickoff: Master Launch Plan (마스터 플랜 시작)

##### **1. Design & Permits (설계 및 허가)** - 8개 작업
- Select Architect / Designer (건축가/디자이너 선정)
- Schematic Layout Design (기본 레이아웃 설계)
- MEP Plan (전기/배관 설계)
- Finalize Floor Plan (최종 평면도)
- Permit Package Prep (허가 서류 준비)
- Submit Permits (허가 신청)
- Permit Review Loop (허가 검토)
- Permit Approved (허가 승인)

##### **2. Menu & Supply (메뉴 및 공급망)** - 6개 작업
- Draft Menu Selection (메뉴 초안)
- Recipe Testing (레시피 테스트)
- Menu Costing (메뉴 원가 계산)
- Finalize Menu (메뉴 확정)
- Select Key Suppliers (주요 공급업체 선정)
- Set Up Vendor Accounts (업체 계정 설정)

##### **3. Equipment (장비)** - 5개 작업
- Equipment List Draft (장비 목록 작성)
- Request Quotes (견적 요청)
- Select Equipment Vendors (장비 업체 선정)
- Place Equipment Orders (장비 주문)
- Confirm Delivery Windows (배송 일정 확인)

##### **4. Construction (공사)** - 11개 작업
- GC Selection / Contract (시공사 선정/계약)
- Construction Start (공사 시작) ⭐ 중요 마일스톤
- Construction Kickoff (공사 착수)
- Demolition / Prep (철거 및 준비)
- Framing & Rough-in MEP (골조 및 배관 작업)
- Rough-in Inspection Scheduling (1차 검사 일정)
- Rough-in Inspections (1차 검사)
- Drywall / Finishes (벽체 및 마감)
- Signage Install Plan (간판 설치 계획)
- Equipment Install (장비 설치)
- Final Clean (최종 청소)

##### **5. IT & Systems (IT 및 시스템)** - 4개 작업
- Select POS (POS 시스템 선정)
- Order POS Hardware (POS 기기 주문)
- Install Network (네트워크 설치)
- Configure POS (POS 설정)

##### **6. Licensing (인허가)** - 3개 작업
- Business License App (사업자 등록 신청)
- Health Inspection (위생 검사)
- Business License Issued (사업자 등록증 발급)

##### **7. Hiring & Training (채용 및 교육)** - 7개 작업
- Hire Store Manager (매장 관리자 채용)
- Hire Crew (직원 채용)
- Training Day 1~5 (교육 1~5일차)

##### **8. Opening (오픈)** - 4개 작업
- Soft Open (소프트 오픈)
- Soft Opening Day 1 (소프트 오픈 1일차)
- Grand Open (그랜드 오픈)
- Grand Opening Execution (그랜드 오픈 실행)

### 각 작업 카드의 정보
각 작업 카드에는 다음 정보가 표시됩니다:
- **작업 이름**: 해야 할 일
- **담당 역할**: ADMIN, PM, IT, OPERATIONS 등
- **소요 기간**: "1d" = 1일 소요
- **기준점**: ⚓ OPEN_DATE (오픈일 기준), CONSTRUCTION_START (공사 시작일 기준) 등
- **일정**: "Dec 3→Dec 8" (시작일→종료일)

### 사용 방법

**1. 전체 작업 진행 상황 확인하기**
- 왼쪽 사이드바에서 "Tasks: 55 / 55"를 확인
- 각 단계를 펼쳐서 작업 목록 확인

**2. 특정 단계의 작업만 보기**
- 상단 필터에서 "All Phases" 드롭다운 클릭
- 원하는 단계 선택 (예: "4. Construction")

**3. 작업 상태별로 필터링하기**
- "All Statuses" 드롭다운에서 선택
  - **Not Started**: 아직 시작하지 않은 작업
  - **In Progress**: 진행 중인 작업
  - **Done**: 완료된 작업

**4. 담당자별로 작업 보기**
- "All Roles" 드롭다운에서 역할 선택
- 예: "IT / Systems"를 선택하면 IT 관련 작업만 표시

**5. 작업 검색하기**
- 오른쪽 상단 "Search..." 입력창에 키워드 입력
- 예: "permit"을 입력하면 허가 관련 작업만 표시

**6. 중요한 작업만 보기**
- "Focus" 버튼 클릭
- 현재 진행해야 할 핵심 작업만 강조 표시

**7. 각 단계 펼치기/접기**
- 단계 제목 옆의 "▼" 아이콘 클릭
- 작업 목록이 숨겨지거나 표시됨

> 💡 **팁**: 
> - "All Tasks"와 "Focus" 버튼을 전환하면서 우선순위 작업을 파악하세요
> - 주요 마일스톤(Contract Signed, Construction Start, Planned Open Date)을 항상 확인하세요
> - 각 작업의 일정을 확인하여 지연되는 작업이 없는지 점검하세요

---

## 4. 일정 관리 기능

![매장 상세 - 캘린더 뷰](./screenshots/04-store-detail-calendar.png)

### 화면 설명
매장 오픈 준비 작업들을 **캘린더 형식**으로 확인할 수 있는 화면입니다.

### 화면 구성 요소

#### 1. 뷰 전환 버튼
- **Timeline**: 타임라인 뷰 (단계별 작업 목록)
- **Calendar**: 캘린더 뷰 (현재 화면) - 주황색으로 활성화

#### 2. 캘린더 컨트롤
- **Today**: 오늘 날짜로 이동
- **Back**: 이전 달로 이동 (왼쪽 화살표)
- **Next**: 다음 달로 이동 (오른쪽 화살표)
- **현재 월 표시**: "December 2025" (년-월)

#### 3. 뷰 타입 선택
- **Month**: 월간 보기 (현재 선택됨)
- **Week**: 주간 보기
- **Agenda**: 일정 목록 보기

#### 4. 캘린더 그리드
- 일요일(Sun)부터 토요일(Sat)까지 표시
- 각 날짜에 해당하는 작업이 표시됨
- 회색 날짜: 이전/다음 달 날짜
- 흰색 날짜: 현재 달 날짜

#### 5. 마일스톤 표시 (왼쪽 사이드바)
- **Planned Open Date**: 6/1/2025 (오픈 예정일)
- **Construction Start**: 3/3/2025 (공사 시작일)
- **Contract Signed**: 12/3/2024 (계약 체결일) - 녹색으로 표시 (완료됨)

### 사용 방법

**1. 월별 일정 확인하기**
- 캘린더에서 원하는 달의 작업 일정을 한눈에 확인
- 작업이 있는 날짜는 특별히 표시됨

**2. 다른 달로 이동하기**
- **이전 달 보기**: "Back" 버튼 또는 왼쪽 화살표 클릭
- **다음 달 보기**: "Next" 버튼 또는 오른쪽 화살표 클릭
- **오늘로 돌아가기**: "Today" 버튼 클릭

**3. 주간 보기로 전환하기**
1. 상단의 "Week" 버튼 클릭
2. 한 주의 상세 일정을 볼 수 있습니다

**4. 일정 목록으로 보기**
1. "Agenda" 버튼 클릭
2. 작업들이 시간순으로 목록 형태로 표시됩니다

**5. 타임라인 뷰로 돌아가기**
- 상단의 "Timeline" 버튼 클릭
- 단계별 작업 목록으로 돌아갑니다

**6. 중요 일정 확인하기**
- 왼쪽 사이드바의 "Milestones" 섹션에서 3가지 주요 일정 확인:
  - 계약 체결일
  - 공사 시작일
  - 오픈 예정일

### 캘린더 활용 팁

**월별 계획 수립**
- Month 뷰를 사용하여 한 달 동안의 전체 작업 분포 확인
- 특정 주에 작업이 몰려있는지 확인

**주별 상세 일정 관리**
- Week 뷰로 전환하여 한 주의 상세 일정 관리
- 하루에 여러 작업이 있는 경우 우선순위 조정

**일정 목록으로 확인**
- Agenda 뷰로 전환하여 시간 순서대로 작업 확인
- 다가오는 작업들을 순서대로 파악

> 💡 **팁**: 
> - Timeline과 Calendar를 번갈아 보면서 작업을 관리하세요
> - 주요 마일스톤 날짜를 잘 기억하고 관리하세요
> - Week 뷰는 단기 계획에, Month 뷰는 중장기 계획에 유용합니다

---

## 5. 주요 용어 설명

### 매장 상태 (Status)
- **PLANNING**: 계획 단계 - 아직 공사 시작 전
- **CONSTRUCTION**: 공사 중 - 인테리어 공사 진행 중
- **PRE_OPENING**: 오픈 준비 - 직원 교육 및 최종 점검 중
- **OPEN**: 오픈 완료 - 정상 영업 중
- **CANCELLED**: 취소됨 - 프로젝트 중단

### 작업 상태
- **Not Started**: 아직 시작하지 않음
- **In Progress**: 현재 진행 중
- **Done**: 완료됨

### 담당 역할 (Role)
- **ADMIN**: 관리자 - 중요 의사결정 및 승인
- **PM**: 프로젝트 매니저 - 전체 프로젝트 관리
- **IT**: IT 담당자 - 시스템 및 네트워크 설치
- **OPERATIONS**: 운영 담당자 - 매장 운영 준비
- **CONSTRUCTION**: 공사 담당자 - 인테리어 공사 관리
- **MARKETING**: 마케팅 담당자 - 홍보 및 오픈 행사

### 국가 코드
- **MX**: 멕시코 (Mexico)
- **CO**: 콜롬비아 (Colombia)
- **CA**: 캐나다 (Canada)

---

## 6. 자주 묻는 질문 (FAQ)

### Q1: 새로운 작업을 추가하려면 어떻게 하나요?
**A**: 매장 상세 페이지에서 오른쪽 상단의 주황색 "+ New Task" 버튼을 클릭하세요.

### Q2: 작업의 상태를 변경하려면?
**A**: 각 작업 카드를 클릭하면 상세 정보가 나타나고, 상태를 변경할 수 있습니다.

### Q3: 여러 매장을 동시에 관리할 수 있나요?
**A**: 네, 대시보드에서 모든 매장의 현황을 확인하고, 각 매장을 클릭하여 개별 관리가 가능합니다.

### Q4: 마일스톤은 무엇인가요?
**A**: 마일스톤은 프로젝트의 중요한 전환점입니다. 예를 들어:
- Contract Signed (계약 체결)
- Construction Start (공사 시작)
- Planned Open Date (오픈 예정일)

### Q5: Focus 모드는 언제 사용하나요?
**A**: Focus 모드는 현재 진행해야 할 가장 중요한 작업들만 보여줍니다. 매일 아침 Focus 모드로 오늘 해야 할 일을 확인하세요.

### Q6: 작업 검색은 어떻게 하나요?
**A**: 오른쪽 상단의 "Search..." 입력창에 찾고 싶은 작업의 이름이나 키워드를 입력하세요.

### Q7: 캘린더와 타임라인 중 어느 것을 사용해야 하나요?
**A**: 
- **타임라인**: 단계별로 작업을 확인하고 관리할 때
- **캘린더**: 날짜별로 일정을 확인하고 계획할 때

둘 다 필요에 따라 전환하며 사용하시면 됩니다.

---

## 7. 문제 해결

### 로그인이 안 되는 경우
1. 사용자를 선택했는지 확인하세요 (라디오 버튼이 선택되어 있어야 함)
2. "Enter Platform" 버튼을 클릭했는지 확인하세요
3. 브라우저를 새로고침하고 다시 시도하세요

### 페이지가 느리게 로딩되는 경우
1. 인터넷 연결을 확인하세요
2. 브라우저 캐시를 삭제하세요
3. 다른 브라우저로 시도해보세요

### 작업이 표시되지 않는 경우
1. 필터 설정을 확인하세요 (All Phases, All Statuses로 설정)
2. 검색창이 비어있는지 확인하세요
3. 페이지를 새로고침하세요

---

## 8. 연락처 및 지원

시스템 사용 중 문제가 발생하거나 도움이 필요한 경우:

- **기술 지원**: IT 부서에 문의
- **운영 문의**: 매장 운영 담당자에게 문의
- **긴급 문제**: 시스템 관리자에게 즉시 연락

---

## 9. 시스템 요구사항

### 권장 브라우저
- Google Chrome (최신 버전)
- Microsoft Edge (최신 버전)
- Safari (최신 버전)
- Firefox (최신 버전)

### 화면 해상도
- 최소: 1280 x 720
- 권장: 1920 x 1080 이상

### 인터넷 연결
- 안정적인 인터넷 연결 필요

---

## 10. 매뉴얼 버전 정보

- **버전**: 1.0
- **작성일**: 2025년 12월
- **대상**: BB.Q Chicken 캐나다 매장 관리자
- **시스템 버전**: Store Launch Platform MVP

---

**이 매뉴얼을 통해 BB.Q Chicken 매장 오픈 준비 과정을 효율적으로 관리하실 수 있습니다!** 🍗
