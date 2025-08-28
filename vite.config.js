import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

export default defineConfig({
  plugins: [vue()],
  server: {
    // https://zoom.us/cci/index/admin#/admin-integrations 에서 설정한 스마트 내장 인스턴스 URL 경로
    host: '192.168.10.75', // 외부접속 허용
    port: 4033,
    // HTTPS 설정 필수
    // https: true
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem')
    },
  },
});