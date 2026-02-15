# AIMES Eleven Industrial Platform

> **AI-based Manufacturing Execution System** for 11 Industrial Domains

A3 Security Co., Ltd. | A3-AI Working Group | Designed by Brian Lee

---

## Overview

AIMES(AI-based Manufacturing Execution System)는 **식품, 제약, 화학, 반도체, 자동차, 배터리, 금속, 의료기기, 화장품, 농수산물, 섬유** 등 11개 제조 산업에 걸쳐 동일한 기술 스택과 아키텍처 위에 도메인별 특화 기능을 제공하는 **차세대 통합 MES 플랫폼** 소개 웹페이지입니다.

하나의 공통 기술 기반(React + FastAPI + PostgreSQL) 위에 산업별 특화 서비스를 플러그인 방식으로 확장하며, 동일한 아키텍처, 워크플로우, AI/ML 파이프라인으로 11개 제조 산업의 AX(AI Transformation) 전환을 가속합니다.

---

## Project Structure

```
webpage_Eleven_AIMES/
├── index.html      # 메인 HTML (1,647 lines) - 12개 섹션 + 모달
├── style.css       # 스타일시트 (1,338 lines) - Dark Glassmorphism 디자인 시스템
├── script.js       # 인터랙션 (531 lines) - Three.js + GSAP + i18n + 모달
└── README.md       # 프로젝트 문서
```

---

## 11 Industry Domains

| # | 산업 | Industry | 핵심 규제/표준 | AI 모델 수 |
|---|------|----------|---------------|-----------|
| 1 | 식품 제조 | Food Manufacturing | HACCP, MFDS | 6 |
| 2 | 제약/의약품 | Pharmaceutical | 21 CFR Part 11, ICH Q1A, DSCSA | 6 |
| 3 | 화학제품 | Chemical | K-REACH, GHS/MSDS, PSM | 6 |
| 4 | 반도체/전자 | Semiconductor & Electronics | SEMI Standards | 8 |
| 5 | 자동차 부품 | Automotive | IATF 16949, ISO 9001 | 6 |
| 6 | 배터리/셀 | Battery Cell & Pack | IEC 62619 | 6 |
| 7 | 금속/철강 | Metal & Steel | ISO 9001 | 6 |
| 8 | 의료기기 | Medical Device | FDA 510(k), ISO 13485 | 6 |
| 9 | 화장품 | Cosmetics | ISO 22716, KFDA, EU Reg | 6 |
| 10 | 농수산물 가공 | Agricultural & Marine | HACCP, GAP | 6 |
| 11 | 섬유 | Textile | ISO 14001, OEKO-TEX | 6 |

---

## Page Sections

웹페이지는 총 **12개 섹션**으로 구성되어 있습니다.

### 1. Hero Section
- 플랫폼 소개 및 핵심 수치 (11개 도메인, 100+ 마이크로서비스, 1100+ API, 60+ AI/ML 모델)
- 11개 산업 아이콘이 원형으로 배치된 인터랙티브 비주얼
- 카운터 애니메이션

### 2. Platform Overview
- 통합 아키텍처 / 도메인 특화 / 보안 내재화 3가지 핵심 가치 소개

### 3. 11 Industry Domains
- 11개 산업별 카드 그리드 (클릭 시 상세 모달)
- 각 카드: 산업명, 설명, 서비스 태그, 규제 배지, AI 모델 수
- 모달: 핵심 기능 목록 + AI/ML 모델 상세

### 4. 8-Layer Architecture
- ISA-95 기반 Purdue Model 8계층 아키텍처 다이어그램
- L1(OT Integration) ~ L8(Presentation) 각 계층별 기술 구성요소 시각화

### 5. Technology Stack
- Frontend / Backend / Database & Storage / AI-ML / DevOps & Infra / Security 6개 카테고리
- 산업 전체에 공통 적용되는 기술 스택 시각화

### 6. Common Workflow
- 8단계 공통 제조 워크플로우 (수요예측 → 입고 → 전처리 → 본공정 → 품질검사 → 포장 → 출하 → 사후관리)
- 타임라인 형태의 시각적 파이프라인

### 7. AI/ML Pipeline
- 6개 공통 AI/ML 모델: 품질 예측, 이상 탐지, 비전 검사, 공정 최적화, 예측 정비, 수요 예측
- 각 모델별 알고리즘 태그 (LSTM, XGBoost, YOLOv8, Prophet 등)
- Edge AI (NVIDIA Jetson) vs GPU Server (NVIDIA L40S) 비교

### 8. Microservices Pattern
- 공통 서비스 6개: API Gateway, Production, Quality, Maintenance, Notification, Data Ingestion
- 11개 산업별 특화 서비스 목록

### 9. Security Architecture
- Purdue Model Level 0-5 네트워크 계층 시각화
- 보안 배지: Zero Trust, AES-256, TLS 1.3/mTLS, OT/IT 분리, RBAC+ABAC, HashiCorp Vault

### 10. Comparison Matrix
- 11개 산업 x 17개 기능 비교 매트릭스 테이블
- 공통 기능 5개 + 산업별 특화 기능 12개

### 11. ROI Analysis
- Before/After 비교 테이블 (6개 지표: OEE, 불량률, 다운타임, 수율, 에너지, 규제대응)
- ROI 요약 카드 4개: 투자금액, 연간절감, 투자회수기간, 5년 누적 ROI

### 12. Implementation Roadmap
- Phase 0~4 단계별 구현 로드맵
- 각 Phase별 기간, 제목, 설명이 포함된 글래스카드 타임라인

---

## Common Technology Stack

### Frontend
| 기술 | 용도 |
|------|------|
| React 18 + TypeScript | UI 프레임워크 |
| Vite | 빌드 도구 |
| Tailwind CSS | 유틸리티 CSS |
| TanStack React Query | 서버 상태 관리 |
| Zustand | 클라이언트 상태 관리 |
| Recharts | 데이터 시각화 |
| React Hook Form | 폼 처리 |

### Backend
| 기술 | 용도 |
|------|------|
| FastAPI (Python) | 도메인 서비스 API |
| Express.js (Node.js) | API Gateway |
| SQLAlchemy ORM | 데이터 접근 |
| Pydantic v2 | 데이터 검증 |
| Alembic | DB 마이그레이션 |

### Database & Storage
| 기술 | 용도 |
|------|------|
| PostgreSQL 16 | 메인 데이터베이스 |
| TimescaleDB | 시계열 데이터 |
| Redis 7 | 캐시 / 세션 |
| Apache Kafka | 메시지 스트리밍 |
| MinIO (S3) | 객체 스토리지 |

### AI/ML
| 기술 | 용도 |
|------|------|
| PyTorch | 딥러닝 프레임워크 |
| scikit-learn | 전통 ML |
| YOLOv8 | 객체 감지 / 비전 검사 |
| Prophet | 시계열 수요 예측 |
| MLflow | MLOps / 모델 관리 |
| ONNX Runtime | Edge AI 추론 |
| NVIDIA Jetson | Edge AI 디바이스 |

### DevOps & Security
| 기술 | 용도 |
|------|------|
| Docker Compose | 컨테이너 오케스트레이션 |
| Prometheus + Grafana | 모니터링 |
| Nginx | 리버스 프록시 |
| GitHub Actions | CI/CD |
| JWT + RBAC | 인증/인가 |
| TLS 1.3 + AES-256 | 암호화 |
| Zero Trust | 보안 아키텍처 |

---

## 6 Common AI/ML Models

모든 산업 도메인에 공통으로 적용되는 AI/ML 모델입니다.

| 모델 | 알고리즘 | 추론 환경 | 기대 효과 |
|------|----------|-----------|-----------|
| 품질 예측 | LSTM, XGBoost, SHAP | GPU Server | 불량률 40~60% 감소 |
| 이상 탐지 | Isolation Forest, Autoencoder | Edge + GPU | 실시간 이상 감지 |
| 비전 검사 | YOLOv8, EfficientNet, ONNX | Edge (< 100ms) | 95%+ 검사 정확도 |
| 공정 최적화 | PPO (RL), Bayesian Opt., Digital Twin | GPU Server | 수율 5~10% 향상 |
| 예측 정비 | CNN-LSTM, Survival Analysis | GPU Server | 다운타임 30~50% 감소 |
| 수요 예측 | Prophet, LSTM, LightGBM | GPU Server | 재고비용 절감 |

---

## 8-Layer Architecture (ISA-95)

```
┌─────────────────────────────────────────────────────┐
│ L8  Presentation    │ React 18, Tailwind, Recharts  │
├─────────────────────┼───────────────────────────────┤
│ L7  API Gateway     │ Express.js, JWT, RBAC, WAF    │
├─────────────────────┼───────────────────────────────┤
│ L6  Application     │ Production, Quality, Domain×N │
├─────────────────────┼───────────────────────────────┤
│ L5  AI/ML Service   │ Quality Pred, Anomaly, Vision │
├─────────────────────┼───────────────────────────────┤
│ L4  Data Processing │ Kafka, Airflow ETL, Stream    │
├─────────────────────┼───────────────────────────────┤
│ L3  Data Storage    │ PostgreSQL, TimescaleDB, Redis│
├─────────────────────┼───────────────────────────────┤
│ L2  Edge Gateway    │ NVIDIA Jetson, Protocol Conv. │
├─────────────────────┼───────────────────────────────┤
│ L1  OT Integration  │ PLC, SCADA, MQTT/OPC-UA       │
└─────────────────────┴───────────────────────────────┘
```

---

## ROI Analysis (11개 산업 평균)

| 지표 | 구축 전 (As-Is) | 구축 후 (To-Be) | 개선율 |
|------|----------------|----------------|--------|
| OEE (설비종합효율) | 60~75% | 82~92% | **+15~25%p** |
| 불량률 | 3~10% | 1~4% | **-40~60%** |
| 비계획 정지시간 | 월 8~20시간 | 월 2~8시간 | **-50~70%** |
| 원료 수율 | 85~92% | 90~97% | **+3~8%p** |
| 에너지 비용 | 100% (기준) | 80~90% | **-10~20%** |
| 규제대응 시간 | 월 40~80시간 | 월 8~16시간 | **-70~80%** |

| 투자 금액 (도메인당) | 연간 절감 효과 | 투자 회수 기간 | 5년 누적 ROI |
|:---:|:---:|:---:|:---:|
| 2~5억원 | 2~6억원/년 | 1~2년 | 400~800% |

---

## Implementation Roadmap

| Phase | 기간 | 단계 | 주요 활동 |
|:-----:|:----:|------|-----------|
| **Phase 0** | 1~2개월 | 기획 및 준비 | 시장조사, 파일럿 기업 선정, As-Is 분석, ROI 목표 설정 |
| **Phase 1** | 2~3개월 | 프로토타입 설계 | 아키텍처 설계, AI 모델 선정, IoT/센서 계획, 보안 설계 |
| **Phase 2** | 4~6개월 | 프로토타입 개발 | AIMES Core + 도메인 서비스 개발, IoT 인프라, AI 학습 |
| **Phase 3** | 3~4개월 | 검증 및 밸리데이션 | 파일럿 24/7 운영, AI 튜닝, ROI 측정, 규제 적합성 확인 |
| **Phase 4** | 6개월+ | 상용화 및 확산 | 상용 릴리스, 추가 고객 확보, 모듈 확장, 타 산업 적용 |

---

## Webpage Technical Details

### Design System
- **Theme**: Dark Glassmorphism (배경 `#050608`, 글래스 카드 `backdrop-filter: blur`)
- **Color Palette**: 6색 체계
  - Primary `#0ea5e9` (Cyan) — 메인 인터페이스
  - Accent `#8b5cf6` (Purple) — 강조, 제약/섬유 계열
  - Success `#10b981` (Green) — 긍정, 자동차/농수산 계열
  - Warning `#f59e0b` (Amber) — 주의, 화학/금속 계열
  - Danger `#ef4444` (Red) — 위험, 의료기기 계열
  - Companion `#f472b6` (Pink) — 보조, 반도체/화장품 계열
- **Fonts**: Outfit (headings) + Inter (body) — Google Fonts
- **17개 CSS 변수** 기반 일관된 디자인 토큰

### CDN Dependencies
| Library | Version | Purpose |
|---------|---------|---------|
| Bootstrap | 5.3.2 | 그리드 시스템, 반응형 레이아웃 |
| Bootstrap Icons | 1.11.1 | 아이콘 시스템 |
| Three.js | 0.160.0 | 3D 파티클 배경 애니메이션 |
| GSAP | 3.12.5 | 스크롤 트리거 애니메이션 |

### JavaScript Features (8 modules)
1. **Three.js Background** — 900개 파티클 + 연결선, 마우스 트래킹 카메라
2. **GSAP ScrollTrigger** — `.fade-in` 요소 스크롤 진입 애니메이션
3. **Counter Animation** — IntersectionObserver 기반 숫자 카운트업
4. **Smooth Scroll** — 앵커 링크 부드러운 스크롤 + 모바일 네비 자동 닫기
5. **Navbar Effect** — 스크롤에 따른 네비게이션 배경 투명도 변화
6. **Domain Card Modal** — 카드 클릭 → Header/Body 분리 모달 (ESC/외부 클릭 닫기)
7. **i18n (KR/EN)** — 130개 번역 키 기반 한/영 전환
8. **CSS Fallback** — GSAP 실패 시 CSS transition 기반 `.fade-in` 폴백

### Responsive Breakpoints
- `> 991px` — Desktop (풀 레이아웃)
- `575px ~ 991px` — Tablet (그리드 축소, 아키텍처 세로 배치)
- `< 575px` — Mobile (단일 컬럼, 히어로 링 숨김)

---

## How to Run

```bash
# 정적 파일이므로 간단한 HTTP 서버로 실행 가능

# Python
cd webpage_Eleven_AIMES
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# 브라우저에서 접속
open http://localhost:8080
```

별도의 빌드 과정이 필요 없는 순수 HTML/CSS/JS 정적 웹사이트입니다.

---

## Security Architecture

Purdue Model 기반 네트워크 계층 분리:

| Level | Zone | 구성 요소 |
|:-----:|:----:|-----------|
| Level 5 | Enterprise | Enterprise Firewall + IDS/IPS |
| Level 4 | IT Zone | MES 서버, AI 서버, DB 서버, Grafana, Vault, SIEM |
| Level 3 | DMZ | Edge Gateway, Protocol Converter, Data Diode |
| Level 2 | OT Zone | SCADA, HMI |
| Level 1 | OT Zone | PLC, RTU |
| Level 0 | OT Zone | 센서, 비전카메라, 검출기, 액추에이터 |

**보안 원칙**: Zero Trust / AES-256 암호화 / TLS 1.3 + mTLS / OT-IT 분리 / RBAC + ABAC / HashiCorp Vault

---

## License

&copy; 2025 A3 Security Co., Ltd. All rights reserved.
