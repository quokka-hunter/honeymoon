# 우리의 이탈리아 · 2027

2027년 3월 26일–4월 9일, 14박 15일 이탈리아 신혼여행 지도입니다.
기존 ChatGPT Sites 페이지의 화면·58개 스팟·날짜별 상세 일정을 그대로 가져왔습니다.

## GitHub Pages 최초 설정

1. 저장소 **Settings → Pages**를 엽니다.
2. **Source: Deploy from a branch**를 선택합니다.
3. **Branch: main**, 폴더 **/docs**를 선택하고 **Save**합니다.
4. 게시 완료 후 Pages 화면에 나타나는 실제 사이트 주소를 확인합니다.

예상 주소(활성화 전에는 접속되지 않을 수 있음):
https://quokka-hunter.github.io/honeymoon/

GitHub Free는 공개 저장소에서 Pages를 지원합니다. 비공개 저장소의 Pages는 GitHub Pro 등 지원 요금제가 필요합니다.
개인 계정에서 게시한 Pages는 일반적으로 공개 웹페이지입니다. 공개 전환 전 여행 일정이 외부에 보인다는 점을 확인하세요.

## 일정과 코드 수정

| 파일 | 내용 |
| --- | --- |
| `docs/data.js` | 15일 일정, 방문 시간, 스팟 좌표, 주차·이동 팁 |
| `docs/app.js` | 날짜 선택, 지도 핀, 상세 일정, Google 지도 연결 |
| `docs/style.css` | 모바일·PC 화면 스타일 |
| `docs/index.html` | 페이지 구조, 여행 전 확인 안내, 출처 |
| `docs/dolomites.jpg` | 돌로미티 참고 사진 |
| `docs/leaflet.js`, `docs/leaflet.css` | Leaflet 1.9.4 지도 라이브러리 |

`main`의 `docs/` 내용을 수정하고 커밋하면 Pages 설정 완료 후 자동으로 재게시됩니다.
변경이 크면 별도 브랜치와 Pull Request로 검토한 뒤 main에 병합하세요.

빌드·npm 설치·OpenAI API 키·ChatGPT 로그인 없이 동작하는 정적 사이트입니다.
GitHub Pages로 게시한 페이지의 운영은 GitHub 정책을 따르며 ChatGPT 구독에 의존하지 않습니다.

## 로컬 실행 및 간단한 검증

```sh
python3 -m http.server 8000 --directory docs
```

브라우저에서 http://localhost:8000 을 엽니다.

```sh
node --check docs/data.js
node --check docs/app.js
```

## 사용 시 참고

- 지도 배경(OpenStreetMap 타일)과 Google 길찾기는 인터넷이 필요합니다. 완전한 오프라인 지도는 아닙니다.
- 지도 점선은 방문 순서이며 실제 도로 경로가 아닙니다.
- 일정은 추천 초안이며 예약 완료를 뜻하지 않습니다. 2027년 운영·요금·휴일·리프트·입도료를 재확인하세요.
- 항공편 도착 시각, 숙소 주소, 렌터카 영업소를 예약 후 수정하세요.
- 여권·예약번호·연락처·인증정보는 공개 코드나 여행 페이지에 올리지 마세요.

## 출처와 라이선스

- 지도 라이브러리: Leaflet 1.9.4, BSD-2-Clause. `THIRD_PARTY_NOTICES.md` 참고.
- 지도 데이터: © OpenStreetMap contributors. https://www.openstreetmap.org/copyright
- 사진: Giovanni Fregni, CC0. 가을의 Val di Funes 참고 풍경이며 3월 말 풍경과 다릅니다.
  https://commons.wikimedia.org/wiki/File:Val_Di_Funes_(187440387).jpeg
- 여행 정보의 공식 출처는 페이지의 '여행 전 확인'에 수록했습니다.

## GitHub 공식 안내

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
