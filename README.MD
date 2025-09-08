# Zoom_CCSE_guide

본 프로젝트는 **Vite + Vue** 기반의 Zoom Contact Center Smart Embed 예제입니다.  
HTTPS 환경에서 실행되어야 하며, 내부 네트워크 또는 외부 접근이 가능합니다.

---

## 1. 폴더 구조 예시

Zoom_CCSE_guide/
├─ certs/
│ ├─ cert.pem # SSL 인증서
│ └─ key.pem # SSL 개인키
├─ src/
│ └─ ... # Vue 소스 코드
├─ vite.config.js
├─ package.json
└─ README.md

> `certs` 폴더에는 HTTPS 접속용 인증서(`cert.pem`)와 개인키(`key.pem`)가 있어야 합니다.

---

## 2. HTTPS 인증서 설정

1. `certs` 폴더를 최상위 경로에 생성합니다.
2. 인증서 파일(`cert.pem`)과 개인키(`key.pem`)를 복사합니다.
3. `vite.config.js`에서 인증서 경로가 정확한지 확인합니다.

로컬 테스트용 self-signed 인증서를 사용해도 되며, 브라우저에서 경고가 표시될 수 있습니다.

1. certs 폴더로 이동
   cd certs
2. 개인키 생성 
   openssl genrsa -out key.pem 2048
3. 인증서 생성 
   openssl req -new -x509 -key key.pem -out cert.pem -days 365

---

## 3. host 및 port 설정

vite.config.js 파일 내 server.host 와 server.port 값은
https://zoom.us/cci/index/admin#/admin-integrations 에서 설정한 Smart Embed instance URL 경로와 동일해야합니다.
server.host 마지막에는 '/'가 포함되지 않아야 합니다.

---

## 4. 프로젝트 실행 방법

최상위 경로에서 아래 명령어를 실행합니다.

npm install
npm run dev

