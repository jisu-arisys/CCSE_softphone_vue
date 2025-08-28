<template>
  <div>
    <h1>Iframe Guide Page</h1>

    <!-- 상태 변경 버튼 예제 -->
    <div>
      <button v-for="status in statuses" :key="status.id" @click="setAgentStatus(status.id)">
        상태 변경: {{ status.name }}
      </button>
    </div>

    <!-- iframe 예제 -->
    <iframe :src="smartEmbedUrl" width="800" height="400"></iframe>
    <div v-if="placement === 'hover'" id="floating-iframe-container" :class="{'floating-hidden': !isIframeFloatingVisible}" :style="iframeStyle">
        <div id="floating-iframe-header" style="display: flex; justify-content: space-between; align-items: center;">
            <span @mousedown="startDrag" class="title" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Smart Embed</span>
            <i class="bi bi-x close-btn" @click.prevent="toggleFloatingIframeVisibility"></i>
        </div>
        <iframe
                v-bind:src="smartEmbedUrl"
                sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin allow-downloads"
                allow="geolocation;autoplay;microphone;camera;display-capture;midi;encrypted-media;clipboard-write;"
                id="zoom-embeddable-phone-iframe-hover">
        </iframe>
    </div>
    <div id="iframe-resize-handle" v-if="placement === 'right-side'">
        <i :class="collapseIconClass" @click.stop="toggleIframeCollapse" style="cursor: pointer; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5rem; z-index: 11;"></i>
    </div>
    <iframe v-if="placement === 'right-side'"
            v-bind:style="'width: ' + zccSmartEmbedDimensions.widthInPixels + 'px; height: 100vh;'"
            v-bind:src="smartEmbedUrl"
            sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin allow-downloads"
            allow="geolocation;autoplay;microphone;camera;display-capture;midi;encrypted-media;clipboard-write;"
            id="zoom-embeddable-phone-iframe-right-side">
    </iframe>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// iframe URL
const smartEmbedUrl = ref("https://www.zoom.us/cci/callbar/crm/?origin=https://192.168.10.75:4033")

// 상태 목록 예제
const statuses = [
  { id: 23, name: "회의" },
  { id: 24, name: "상담중" },
  { id: 25, name: "대기중" }
]

// 상태 변경 함수
function setAgentStatus(statusCode) {
  console.log("setAgentStatus called:", statusCode)
  // iframe 통신 예제 (postMessage)
  const iframe = document.querySelector("iframe")
  if (iframe) {
    iframe.contentWindow.postMessage({ statusCode }, "*")
  }
}
</script>

<style>
button {
  margin: 4px;
  padding: 6px 12px;
}
</style>
