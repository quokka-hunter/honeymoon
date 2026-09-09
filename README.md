# 우리의 이탈리아 · 2027

[여행 페이지](https://quokka-hunter.github.io/honeymoon/)

2027.03.26–04.09 이탈리아 신혼여행: 일정 지도, 준비 체크리스트, 경비 기록.

- `docs/data.js`: 날짜별 일정과 58개 스팟
- `docs/app.js`: 지도와 일정 화면
- `docs/planner.js`: 탭, 체크리스트, 경비 입력 및 브라우저 저장
- `docs/index.html`, `docs/style.css`: 화면 구성과 스타일

`main`의 `docs/`를 수정하면 GitHub Pages에 자동 반영됩니다.
체크리스트와 경비는 각 브라우저의 localStorage에만 저장되며 기기 간 동기화되지 않습니다.
브라우저 데이터를 삭제하면 입력 기록도 사라집니다. 입력 기록은 GitHub에 업로드되지 않습니다.
금액은 EUR/KRW별로 합산하며 환율 변환을 하지 않습니다.

로컬 실행: `python3 -m http.server 8000 --directory docs`

지도와 길찾기는 인터넷이 필요합니다. 여행 운영 정보의 출처는 페이지의 ‘여행 참고’에서 볼 수 있습니다.
지도 라이브러리와 데이터 라이선스는 `THIRD_PARTY_NOTICES.md`를 참고하세요.
