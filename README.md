[README.md](https://github.com/user-attachments/files/28936922/README.md)
# 🎓 고려대학교 중어중문학과 학점 계산기 (KU Chinese Literature GPA Calculator)

> 고려대학교 중어중문학과 학생분들을 위한 심플하고 현대적인 모노톤 & 네온 테마의 프리미엄 학점 계산기 웹 애플리케이션입니다.

배포 및 사용이 편리한 Vite + Vanilla JS 환경에서 작동하며, 학기별 취득 평점의 변화를 눈으로 볼 수 있는 네온 스타일의 꺾은선 추이 그래프를 내장하고 있습니다.

---

## 🌟 주요 기능 (Key Features)

- **심플 & 네온 대시보드 UI**: 화이트/그레이 모노톤 레이아웃에 형광 네온 컬러 포인트를 조합하여 깔끔하고 세련된 시각 효과를 선사합니다.
- **고려대 학점 기준 산정**:
  - GPA = $\frac{\sum(\text{평점} \times \text{학점})}{\sum \text{학점}}$ (A+ 4.5점 ~ F 0.0점 기준)
  - **취득 학점**: 평점평균에는 F 학점이 반영되나, 이수 학점 요약 바에서는 F 학점 과목의 학점이 제외되어 정확한 졸업 이수 학점 자가진단이 가능합니다.
- **학기별 평점 추이 그래프**: HTML5 Canvas를 이용해 고해상도(Retina/High-DPI) 화면에서도 번짐 없이 또렷하고 빛나는 네온 라인 차트를 제공합니다.
- **로컬 자동 저장 (LocalStorage)**: 입력 내용이 브라우저에 실시간 저장되어, 나중에 재접속하더라도 이전 입력 내용이 안전하게 보존됩니다.
- **반응형 웹 지원**: 데스크톱 모니터뿐만 아니라 모바일 스마트폰 화면에서도 최적화된 화면 비율로 사용 가능합니다.

---

## 📂 프로젝트 파일 구조 (Project Structure)

```text
gpa-calculator/
├── .github/workflows/deploy.yml  # GitHub Actions 자동 배포 설정 파일
├── public/                       # 정적 리소스 폴더
├── src/
│   ├── main.js                   # 평점 계산 및 캔버스 그래프 렌더링 로직
│   └── style.css                 # 모노톤 & 네온 테마 스타일시트
├── index.html                    # 웹 서비스 메인 레이아웃
├── vite.config.js                # Vite 빌드 및 경로 설정 파일
├── package.json                  # 프로젝트 메타데이터 및 스크립트 정의
└── README.md                     # 프로젝트 설명 문서
```

---

## ⚙️ 로컬 실행 방법 (How to run locally)

컴퓨터에서 직접 실행하고 수정하고 싶으시다면 아래 절차를 따릅니다. (Node.js 설치 필요)

1. **의존성 패키지 설치**:
   ```bash
   npm install
   ```

2. **로컬 개발 서버 실행**:
   ```bash
   npm run dev
   ```
   실행 후 출력되는 로컬 링크(예: `http://localhost:5173/ku-gpa-calculator/`)로 접속합니다.

3. **배포용 빌드**:
   ```bash
   npm run build
   ```

---

## 🚀 GitHub Pages 배포 설정

이 프로젝트는 **GitHub Actions**를 사용하여 푸시와 동시에 자동 배포되도록 설정되어 있습니다.

1. 본 프로젝트의 전체 파일(단, `node_modules` 폴더 제외)을 본인의 GitHub 저장소에 업로드합니다.
2. 깃허브 저장소 페이지의 **Settings > Pages** 메뉴로 이동합니다.
3. **Build and deployment > Source** 항목을 **`GitHub Actions`**로 설정합니다.
4. 약 1분 후 `https://<본인의GitHub아이디>.github.io/ku-gpa-calculator/` 주소로 배포가 완료됩니다.
