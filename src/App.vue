<template>
  <body id="page-top">
  <div id="wrapper" v-cloak :class="{'iframe-collapsed': isIframeCollapsed}">
    <div class="d-flex flex-column" id="content-wrapper">
      <div id="content">
        <nav class="navbar navbar-light navbar-expand bg-white shadow topbar static-top">
          <h4 class="m-3">Iframe Guide Page</h4>
          <span class="text-sm-start">ZOOM Contact Center Smart Embeded - with Vue3 Option Api</span>

          <div class="ms-auto p-3">
            <button class="btn btn-success" :disabled="!isIframeCollapsed" @click.stop="toggleIframeCollapse">iframe 열기</button>
            <button class="btn btn-info" :disabled="isIframeCollapsed" @click.stop="toggleIframeCollapse">iframe 닫기</button>
          </div>
        </nav>

        <div class="m-3">
          <div class="card m-3 p-3 shadow-sm">
            <div class="row">
              <div class="col-4">
                <div class="card-title"> 전화걸기</div>
                <div class="card-subtitle text-danger" style="font-size: 12px"> 오디오장치 연결 필수</div>
                <div class="card-body">
                  <form class="d-sm-inline-block w-auto me-auto">
                    <div class="input-group"><input class="bg-light form-control border-0 small" type="text"
                                                    id="phoneNumber" v-model="numberToCall" name="phoneNumber"
                                                    inputmode="tel"
                                                    placeholder="e.g., (650) 555-7890">
                      <button class="btn btn-primary py-0" type="button" @click.prevent="makeCall();">Call</button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="col-8">
                <div class="card-title"> 전화끊기</div>
                <div class="card-subtitle text-danger" style="font-size: 12px"> &nbsp;
<!--                  <pre>{{JSON.stringify( zccEngagementCache, null, 2)}}</pre>-->
                </div>
                <div class="card-body">
                  <form class="d-sm-inline-block w-auto me-auto">
                    <div class="input-group">
                      <input class="bg-light form-control border-0 small" :value="activeCallId"style="min-width: 220px;"/>
                      <button class="btn btn-danger py-0" type="button" @click.prevent="terminateEngagement(activeCallId,'voice');">End</button>
                      <button class="btn btn-warning py-0" type="button" @click.prevent="closeEngagementWrapup(activeCallId,'voice');">상담완료</button>
<!--                      <button class="btn btn-warning py-0" type="button" @click.prevent="setEngagementDisposition(activeCallId,'voice','렌탈');">렌탈</button>-->
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div class="card m-3 p-3 shadow-sm">
            <div class="row">
              <div class="col-4">
                <div class="card-title"> 상담원 상태출력</div>
                <div class="card-body">
                  <span id="agent-status-label" class="badge rounded-pill text-lg" :class="statusDropdownClass">{{ agentStatusDisplay }}</span>
                </div>
              </div>
              <div class="col-8">
                <div class="card-title"> 상담원 상태변경</div>
                <div class="card-body">
                  <button class="btn btn-light m-1 text-success" @click="setAgentStatus(1)">
                    대기
                  </button>
                  <button class="btn btn-light m-1" v-for="status in statusMappings" :key="status.id"
                          @click="setAgentStatus(status.id)">
                    {{ status.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div class="row m-1">
            <div class="col-6">
              <div class="card p-3 shadow-sm">
                <div class="card-title"> 받은 메세지 </div>
                <div class="row">
                  <div class="col-3 text-start">
                    <button class="btn btn-toolbar btn-sm text-danger" type="button" @click.prevent="zccSmartEmbedLogs.Received = []">Clean logs</button>
                  </div>
                  <label class="col-3 text-start align-content-center" style="font-size: 14px;">AutoScroll
                    <input type="checkbox" v-model="isAutoScroll.Received"/>
                  </label>
                  <div class="col text-end" style="font-size: 16px"> search
                    <input class="bg-light border-0 small"  type="text" v-model="keyword.Received" style="width: 140px;"/>
                  </div>
                </div>
                <div class="form-floating">
                  <textarea readonly :value="formattedLogs('Received', keyword.Received)" class="form-control messageBox" id="messageBox-Received" style="height: 300px"/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="card p-3 shadow-sm">
                <div class="card-title"> 보낸 메세지</div>
                <div class="row">
                  <div class="col-3 text-start">
                    <button class="btn btn-toolbar btn-sm text-danger" type="button" @click.prevent="zccSmartEmbedLogs.Sending = []">Clean logs</button>
                  </div>
                  <label class="col-3 text-start align-content-center" style="font-size: 14px;">AutoScroll
                    <input type="checkbox" v-model="isAutoScroll.Sending"/>
                  </label>
                  <div class="col text-end" style="font-size: 16px"> search
                    <input class="bg-light border-0 small"  type="text" v-model="keyword.Sending" style="width: 140px;"/>
                  </div>
                </div>
                <div class="form-floating">
                  <textarea readonly :value="formattedLogs('Sending', keyword.Sending)" class="form-control messageBox" id="messageBox-Sending" style="height: 300px"/>
                </div>
              </div>
            </div>
          </div>

          <div class="card m-3 p-3 shadow-sm">
            <div class="card-title" @click="toggleCard($event)" style="cursor: pointer; display: flex; justify-content: space-between;">
              상담원 이석사유 관리
              <span class="p-1 text-end">▼</span>
            </div>
            <div class="card-subtitle text-danger" style="font-size: 14px; display: flex; align-items: center; gap: 10px;"> 시스템 상태 (systemStatuses) - 변경불가 :
                <ul class="m-0 px-3" style="display: inline-flex; gap: 20px; list-style: disc inside;">
                  <li><b>1</b>: Ready</li>
                  <li><b>3</b>: Occupied</li>
                  <li><b>30</b>: Offline</li>
                </ul>
            </div>
            <div class="card-body" style="display: none;">
              <div class="row">
                <div class="col-md-6"><h6> 이석사유 추가 </h6>
                  <form @submit.prevent="addStatusMapping">
                    <div class="mb-3">
                      <label for="statusId" class="form-label">Status ID</label>
                      <input type="text" class="form-control" id="statusId" v-model="newStatus.id" required>
                    </div>
                    <div class="mb-3">
                      <label for="statusName" class="form-label">Status Name</label>
                      <input type="text" class="form-control" id="statusName" v-model="newStatus.name" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Status</button>
                  </form>
                </div>
                <div class="col-md-6"><h6> 이석사유 목록 및 삭제 </h6>
                  <div class="table-responsive">
                    <table class="table table-striped table-sm">
                      <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(mapping, index) in statusMappings">
                        <td>{{ mapping.id }}</td>
                        <td>{{ mapping.name }}</td>
                        <td><button class="btn btn-danger btn-sm" @click="deleteStatusMapping(index)">Delete</button></td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>



<!--          <div class="card m-3 p-3 shadow-sm">-->
<!--            <div class="card-title"> 인입시 닫힌 토글 열기</div>-->
<!--            <div class="card-body">-->
<!--              <button class="btn btn-light m-1" @click="process_zcc_call_ringing({ 'from':'010'});"> 전화왔다</button>-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>
    </div>

    <!-- iframe -->
    <div v-if="placement === 'hover'" id="floating-iframe-container"
         :class="{'floating-hidden': !isIframeFloatingVisible}" :style="iframeStyle">
      <div id="floating-iframe-header" style="display: flex; justify-content: space-between; align-items: center;">
        <span @mousedown="startDrag" class="title"
              style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Smart Embed</span>
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
      <i :class="collapseIconClass" @click.stop="toggleIframeCollapse"
         style="cursor: pointer; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5rem; z-index: 11;"></i>
    </div>
    <iframe v-if="placement === 'right-side'"
            v-bind:style="'width: ' + zccSmartEmbedDimensions.widthInPixels + 'px; height: 100vh;'"
            v-bind:src="smartEmbedUrl"
            sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin allow-downloads"
            allow="geolocation;autoplay;microphone;camera;display-capture;midi;encrypted-media;clipboard-write;"
            id="zoom-embeddable-phone-iframe-right-side">
    </iframe>
  </div>
  </body>
</template>

<script>
import {ref} from 'vue'

export default {
  data() {
    return {
      keyword: { Received : "", Sending : "" },
      isAutoScroll: { Received : true, Sending : true },
      btnStatuses: [
        {id: '1', name: "대기"},
        {id: '20', name: "나누기"},
        {id: '21', name: "식사"},
        {id: '22', name: "교육"},
        {id: '23', name: "회의"},
        {id: '24', name: "교대조 종료"},
        {id: '0bv-2zFiRuqe51BoFLRxZw', name: "타 부서 지원"},
      ],
      pageView: "dashboard", //dashboard
      editingContact: null,
      editingIndex: -1,
      selectedContact: null,
      agentStatus: "Unknown", // 상담원 상태 기본값 : systemStatues, statusMappings 모두 없을 때 출력됨.
      agentStatusCode: "",
      agentSubReason: "",
      newContact : {
        "name": "",
        "id": "",
        "email": "",
        "account": "",
        "location": "",
        "orders": "",
        "phone": ""
      },
      contacts: [
        // 인입시 팝업에 띄울 고객정보 리스트(연락처 목록)
        {
        "name": "Maurice Lawson",
        "id": "mlawson",
        "email": "maurice@example.com",
        "account": "Ozmo",
        "location": "San Jose",
        "orders": "5",
        "phone": "+16503331234"
      }, {
        "name": "Ashlee York",
        "id": "ayork",
        "email": "ashlee@example.com",
        "account": "Ozmo",
        "location": "Houston",
        "orders": "2",
        "phone": "+16503338784"
      }, {
        "name": "Clara Arellano",
        "id": "carellano",
        "email": "clara@omzo.net",
        "account": "Ozmo",
        "location": "London",
        "orders": "5",
        "phone": "+16503334444"
      }, {
        "name": "Darrel Marquez",
        "id": "dmarquez",
        "email": "darrel@omzo.net",
        "account": "Ozmo",
        "location": "Kansas City",
        "orders": "5",
        "phone": "+16503334445"
      }, {
        "name": "Hester Wilson",
        "id": "hwilson",
        "email": "hester@omzo.net",
        "account": "Ozmo",
        "location": "Atlanta",
        "orders": "5",
        "phone": "+16503334446"
      }, {
        "name": "John Chen",
        "id": "jchen",
        "email": "john@omzo.net",
        "account": "Ozmo",
        "location": "Denver",
        "orders": "5",
        "phone": "+16503334447"
      }, {
        "name": "Katie Carter",
        "id": "kcarter",
        "email": "katie@omzo.net",
        "account": "Ozmo",
        "location": "Chicago",
        "orders": "5",
        "phone": "+16503334448"
      }, {
        "name": "Shawna Owen",
        "id": "sowen",
        "email": "shawna@omzo.net",
        "account": "Ozmo",
        "location": "New York",
        "orders": "5",
        "phone": "+16503334449"
      }
      ],
      caseNumber: "",
      numberToCall: "",
      recentCalls: [],
      smartEmbedUrl: ref("https://www.zoom.us/cci/callbar/crm/?origin=https://192.168.10.75:4033"),
      zccEngagementCache: {}, // Will store engagementId -> engagementObject
      zccEngagementTimestamps: {}, // Separate cache for timestamps that persists longer

      zccSmartHelp: true,
      zccSmartEmbedLogs: { Received : [], Sending : [] },
      zccRecordingURLs: {},
      zccSmartEmbedDimensions: {"heightInPixels": 700, "widthInPixels": 848},
      zccScreenPopMessage: "",
      // leftSideNavColor: "#1a1647;",
      // leftSideNavLogo: "/img/zoomlly.png",
      isResizing: false,
      initialResizeX: 0,
      initialIframeWidth: 0,
      boundDoResize: null,
      boundStopResize: null,
      resizeShieldElement: null,
      isIframeCollapsed: false,
      iframePreCollapseWidth: 698, // Initialize with starting width
      cluster: 'default', // New setting
      debug: false, // New setting
      ctiVersion: '3', // New setting
      placement: 'right-side', // New setting: 'right-side' or 'hover'
      isIframeFloatingVisible: true, // New setting for hover mode visibility
      floatingIframePosition: {x: 0, y: 0}, // For draggable iframe
      showAgentStatus: true, // New setting
      showEngagementCount: true, // New setting
      allowUserToChangeStatus: true, // New setting
      vanitySubdomain: '', // New setting
      dispositionMappings: [],
      newDisposition: {id: '', name: ''},
      statusMappings: [
        {id: '20', name: "나누기"},
        {id: '21', name: "식사"},
        {id: '22', name: "교육"},
        {id: '23', name: "회의"},
        {id: '24', name: "교대조 종료"},
        {id: '0bv-2zFiRuqe51BoFLRxZw', name: "타 부서 지원"},
      ],
      newStatus: {id: '', name: ''},
      selectedStatus: "", // New data property for the dropdown
      systemStatuses: [ // Centralized system status codes
        {id: '1', name: 'Ready'},
        {id: '3', name: 'Occupied'},
        {id: '30', name: 'Offline'},
      ],
      customCard: {
        title: 'Case Details',
        fields: [],
        displayRule: 'always'
      },
      newCustomField: {
        displayName: '',
        type: 'variable',
        source: '',
        value: ''
      },
      activeSettingsTab: 'general', // New property for tab management
      isRefreshing: false, // Track refresh state
      isEngagementDrawerOpen: false, // Track engagement drawer state
      hasReceivedInitialAgentStatus: false // Track if we've received the first agent status on page load
    }
  },
  created() {
    this.boundDoResize = this.doResize.bind(this);
    this.boundStopResize = this.stopResize.bind(this);
    this.boundDoDrag = this.doDrag.bind(this);
    this.boundStopDrag = this.stopDrag.bind(this);
  },

  computed: {
    // active 상태인 callId 찾기 : addCall 정보 안뜸.
    activeCallId() {
      return Object.keys(this.zccEngagementCache)[0] || null;
    },

    // Count of today's interactions across all recent calls
    todaysInteractionsCount() {
      if (!this.recentCalls || this.recentCalls.length === 0) {
        return 0;
      }

      const now = new Date();
      const todayYear = now.getFullYear();
      const todayMonth = now.getMonth();
      const todayDate = now.getDate();

      let count = 0;
      for (let i = 0; i < this.recentCalls.length; i++) {
        const call = this.recentCalls[i];
        const ts = call && call.timestamp ? String(call.timestamp).trim() : '';
        if (!ts) continue;
        const d = new Date(ts);
        if (isNaN(d.getTime())) continue;
        if (d.getFullYear() === todayYear && d.getMonth() === todayMonth && d.getDate() === todayDate) {
          count++;
        }
      }
      return count;
    },
    collapseIconClass() {
      return this.isIframeCollapsed ? 'bi bi-chevron-left' : 'bi bi-chevron-right';
    },
    iframeStyle() {
      if (this.placement === 'hover') {
        const style = {
          position: 'fixed',
          top: this.floatingIframePosition.y + 'px',
          left: this.floatingIframePosition.x + 'px',
          width: this.zccSmartEmbedDimensions.widthInPixels + 'px',
          height: this.zccSmartEmbedDimensions.heightInPixels + 'px',
          backgroundColor: 'white', /* Ensure solid background to prevent transparency */
        };
        console.log('Hover iframe style:', style);
        return style;
      } else {
        return {
          width: this.zccSmartEmbedDimensions.widthInPixels + 'px',
          height: '100vh'
        };
      }
    },
    canChangeStatus() {
      // User cannot change status if no status has been received yet, or if in 'occupied' (3) or 'offline' (30) state
      const result = this.agentStatusCode !== '' && this.agentStatusCode !== '3' && this.agentStatusCode !== '30';
      console.log('=== CAN CHANGE STATUS ===');
      console.log('agentStatusCode:', this.agentStatusCode);
      console.log('agentStatusCode !== "":', this.agentStatusCode !== '');
      console.log('agentStatusCode !== "3":', this.agentStatusCode !== '3');
      console.log('agentStatusCode !== "30":', this.agentStatusCode !== '30');
      console.log('Final result:', result);
      return result;
    },

    // 상담원 상태출력 계산함수
    agentStatusDisplay() {
      // Find the current status in system statuses
      let displayStatus = this.systemStatuses.find(s => s.id === this.agentStatusCode);

      // If not a system status, check custom statuses
      if (!displayStatus) {
        displayStatus = this.statusMappings.find(s => s.id === this.agentStatusCode);
      }

      // If still not found, default to agentStatus (which might be "Unknown")
      let name = displayStatus ? displayStatus.name : this.agentStatus;

      return name;
    },

    statusDropdownClass() {
      switch (this.agentStatusCode) {
        case '1': // Ready
          return 'text-success';
        case '3': // Occupied
          return 'text-primary';
        case '': // No status yet
          return 'text-muted';
        default: // Other statuses (e.g., Offline, custom Not Ready)
          return 'text-danger';
      }
    },
    availableStatuses() {
      console.log('=== AVAILABLE STATUSES COMPUTED ===');
      console.log('agentStatusCode:', this.agentStatusCode);
      console.log('agentStatus:', this.agentStatus);

      // Combine system and custom statuses
      let allStatuses = [...this.systemStatuses.map(s => ({...s, system: true}))];
      this.statusMappings.forEach(customStatus => {
        // Ensure custom status IDs don't conflict with system status IDs
        if (!this.systemStatuses.some(sys => sys.id === customStatus.id)) {
          allStatuses.push({...customStatus, system: false});
        }
      });
      console.log('allStatuses:', allStatuses);

      // Filter based on current agent status
      const currentStatusCode = this.agentStatusCode;
      let filteredStatuses = [];

      // If no status code is set (initial state), show no statuses until iframe sends status
      if (!currentStatusCode || currentStatusCode === '') {
        filteredStatuses = [];
        console.log('No status code - showing no statuses');
      } else if (currentStatusCode === '1') { // Ready state
        // Can change to any custom status code
        filteredStatuses = allStatuses.filter(status => !status.system || status.id === '1');
        console.log('Ready state - filtered statuses:', filteredStatuses);
      } else if (currentStatusCode === '3' || currentStatusCode === '30') { // Occupied or Offline
        // Cannot change status, only show current status
        filteredStatuses = allStatuses.filter(status => status.id === currentStatusCode);
        console.log('Occupied/Offline state - filtered statuses:', filteredStatuses);
      } else { // Not Ready (20, 25) or a custom status
        // Can change to 'Ready' (1)
        filteredStatuses = allStatuses.filter(status => status.id === '1' || status.id === currentStatusCode);
        console.log('Other state - filtered statuses:', filteredStatuses);
      }

      // Filter out "forced" status from dropdown options (but keep current status if it's forced)
      filteredStatuses = filteredStatuses.filter(status => {
        // If this is the current status, allow it even if it's "forced"
        if (status.id === currentStatusCode) {
          return true;
        }
        // Otherwise, filter out any status with name "forced"
        return status.name.toLowerCase() !== 'forced';
      });

      const result = filteredStatuses.map(status => {
        let disabled = false;
        if (currentStatusCode === '3') {
          disabled = true; // If occupied, cannot change status
        }

        // Format custom 'Not Ready' codes for display in dropdown
        let displayName = status.name;
        // All custom statuses are "Not Ready"
        if (!status.system) {
          displayName = `${status.name}`;
        }
        return {...status, name: displayName, disabled: disabled};
      });

      console.log('Final result:', result);
      return result;
    },
    engagementCount() {
      let activeCount = 0;
      let wrapupCount = 0;
      for (const engagementId in this.zccEngagementCache) {
        const engagement = this.zccEngagementCache[engagementId];
        if (engagement.state === 'active') {
          activeCount++;
        } else if (engagement.state === 'wrapup') {
          wrapupCount++;
        }
      }
      return {active: activeCount, wrapup: wrapupCount};
    },
    shouldDisplayCustomCard() {
      if (this.customCard.fields.length === 0) {
        return false;
      }
      if (this.customCard.displayRule === 'always') {
        return true;
      }
      if (this.customCard.displayRule === 'if-variable-populated') {
        return this.customCard.fields.some(field => field.type === 'variable' && field.value);
      }
      return false;
    },
    activeEngagementsForContact() {
      if (this.selectedContact === null || !this.contacts[this.selectedContact]) {
        return {};
      }

      const contact = this.contacts[this.selectedContact];
      const contactPhone = contact.phone;
      const contactEmail = contact.email ? contact.email.toLowerCase() : null;

      const filteredEngagements = {};
      for (const engagementId in this.zccEngagementCache) {
        const engagement = this.zccEngagementCache[engagementId];
        const customerNumber = engagement.customerNumber;
        const customerEmail = engagement.customerEmail ? engagement.customerEmail.toLowerCase() : null;

        // Check if engagement is active or wrapup
        if (engagement.state === 'active' || engagement.state === 'wrapup') {
          // Match by phone number
          if (contactPhone && customerNumber && customerNumber === contactPhone) {
            filteredEngagements[engagementId] = engagement;
          }
          // Match by email
          else if (contactEmail && customerEmail && customerEmail === contactEmail) {
            filteredEngagements[engagementId] = engagement;
          }
        }
      }
      return filteredEngagements;
    },


    // New computed property for all active engagements (not tied to contacts)
    allActiveEngagements() {
      const activeEngagements = {};

      console.log('=== allActiveEngagements computed property executing ===');
      console.log('Current zccEngagementCache:', this.zccEngagementCache);

      for (const engagementId in this.zccEngagementCache) {
        const engagement = this.zccEngagementCache[engagementId];

        // Check if engagement is active or wrapup
        if (engagement.state === 'active' || engagement.state === 'wrapup') {
          activeEngagements[engagementId] = engagement;

          // Debug logging for all engagement types
          console.log(`${engagement.channel.toUpperCase()} engagement ${engagementId}:`, {
            state: engagement.state,
            callConnected: engagement.callConnected,
            channel: engagement.channel,
            dispositionId: engagement.dispositionId
          });
        }
      }

      console.log('Final activeEngagements object:', activeEngagements);
      return activeEngagements;
    },
    // Computed properties for conditional settings
    effectiveShowAgentStatus() {
      // Force agent status to be on when placement is hover
      const result = this.placement === 'hover' ? true : this.showAgentStatus;
      console.log('=== EFFECTIVE SHOW AGENT STATUS ===');
      console.log('placement:', this.placement);
      console.log('showAgentStatus:', this.showAgentStatus);
      console.log('Final result:', result);
      return result;
    },
    effectiveAllowUserToChangeStatus() {
      // Force allow user to change status to be off when show agent status is off
      const result = this.effectiveShowAgentStatus ? this.allowUserToChangeStatus : false;
      console.log('=== EFFECTIVE ALLOW USER TO CHANGE STATUS ===');
      console.log('effectiveShowAgentStatus:', this.effectiveShowAgentStatus);
      console.log('showAgentStatus:', this.showAgentStatus);
      console.log('allowUserToChangeStatus:', this.allowUserToChangeStatus);
      console.log('placement:', this.placement);
      console.log('Final result:', result);
      return result;
    },
    isShowAgentStatusDisabled() {
      // Disable the toggle when placement is hover (since it's forced on)
      return this.placement === 'hover';
    },
    isAllowUserToChangeStatusDisabled() {
      // Disable the toggle when show agent status is off (since it's forced off)
      return !this.effectiveShowAgentStatus;
    },
    dashboardCallLogs() {
      if (!this.recentCalls || this.recentCalls.length === 0) {
        return [];
      }

      // Get the 5 most recent calls for dashboard display
      return this.recentCalls
          .slice(-5)
          .reverse()
          .map(call => {
            // Determine channel and direction
            let channel = call.type || 'Unknown';
            let direction = '';
            if (call.callType) {
              direction = call.callType.charAt(0).toUpperCase() + call.callType.slice(1);
            }

            // Determine phone number based on direction and channel
            let phoneNumber = '';
            if (call.callType === 'outbound') {
              phoneNumber = call.toNumber || '';
            } else if (call.callType === 'inbound') {
              phoneNumber = call.fromNumber || '';
            } else if (channel === 'sms') {
              // For SMS, use fromNumber if available
              phoneNumber = call.fromNumber || '';
            }

            // Find matching contact
            let contactName = '';
            let contactIndex = -1;

            if (phoneNumber) {
              const matchingContact = this.contacts.find((contact, index) => {
                if (contact && contact.phone === phoneNumber) {
                  contactIndex = index;
                  return true;
                }
                return false;
              });

              if (matchingContact) {
                contactName = matchingContact.name;
              }
            }

            // Format date/time - handle empty/invalid timestamps from cancelled calls
            let dateTime = '';
            if (call.timestamp && call.timestamp.trim() !== '') {
              try {
                const date = new Date(call.timestamp);
                // Check if date is valid
                if (!isNaN(date.getTime())) {
                  dateTime = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                } else {
                  dateTime = 'N/A';
                }
              } catch (e) {
                dateTime = 'N/A';
              }
            } else {
              dateTime = 'N/A';
            }

            return {
              engagementId: call.engagementId || Math.random().toString(36).substr(2, 9),
              type: channel,
              direction: direction,
              phoneNumber: phoneNumber,
              queue: call.queue || '',
              dateTime: dateTime,
              disposition: call.dispositionCode || '',
              contactName: contactName,
              contactIndex: contactIndex
            };
          });
    }
  },
  watch: {
    placement(newPlacement) {
      // When placement changes to hover, force show agent status to be on
      if (newPlacement === 'hover' && !this.showAgentStatus) {
        this.showAgentStatus = true;
        this.saveSettings();
      }
    },
    showAgentStatus(newShowAgentStatus) {
      // When show agent status is turned off, force allow user to change status to be off
      if (!newShowAgentStatus && this.allowUserToChangeStatus) {
        this.allowUserToChangeStatus = false;
        this.saveSettings();
      }
    },
    // 메세지 추가시 최하단으로 스크롤 이동
    'zccSmartEmbedLogs.Sending': {
      handler() {
        this.$nextTick(() => {
          if (this.isAutoScroll.Sending) {
            const sendingContainer = this.$el.querySelector('#messageBox-Sending');
            if (sendingContainer) sendingContainer.scrollTop = sendingContainer.scrollHeight;;
          }
        });
      },
      deep: true
    },
    // 메세지 추가시 최하단으로 스크롤 이동
    'zccSmartEmbedLogs.Received': {
      handler() {
        this.$nextTick(() => {
          if (this.isAutoScroll.Received) {
            const receivedContainer = this.$el.querySelector('#messageBox-Received');
            if (receivedContainer) receivedContainer.scrollTop = receivedContainer.scrollHeight;;
          }
        });
      },
      deep: true
    }
  },
  methods: {
    toggleCard(event) {
      const card = event.currentTarget.closest('.card');
      const body = card.querySelectorAll('.card-body');
      body.forEach(b => b.style.display = b.style.display === 'none' ? 'block' : 'none');

      // 아이콘 바꾸기
      const icon = event.currentTarget.querySelector('span');
      icon.textContent = body.style.display === 'none' ? '▼' : '▲';
    },
    getKoreanTimestamp() {
      const d = new Date();
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      const hh = String((d.getUTCHours() + 9) % 24).padStart(2, '0');
      const min = String(d.getUTCMinutes()).padStart(2, '0');
      const sec = String(d.getUTCSeconds()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
    },
    formattedLogs(type, keyword = "") {
      let data = null;
      switch (type) {
        case "Received": data = this.zccSmartEmbedLogs.Received; break;
        case "Sending": data = this.zccSmartEmbedLogs.Sending; break;
        default: return ""; // type이 없으면 빈 문자열 반환
      }
      return data
          .filter(log => keyword === "" || JSON.stringify(log).includes(keyword))
          .map(log => JSON.stringify(log, null, 2))
          .join("\n\n");
    },
    // Helper functions for contact operations
    findContactByPhone(phoneNumber) {
      if (!phoneNumber) return null;
      return this.contacts.find(contact => contact && contact.phone === phoneNumber);
    },

    findContactByEmail(email) {
      if (!email) return null;
      const searchEmail = email.toLowerCase();
      return this.contacts.find(contact => contact && contact.email &&
          contact.email.toLowerCase() === searchEmail);
    },

    findContactByQuery(query) {
      if (!query) return null;
      const searchQuery = query.toLowerCase();
      return this.contacts.find(contact =>
              contact && (
                  (contact.id && contact.id.toLowerCase() === searchQuery) ||
                  (contact.name && contact.name.toLowerCase() === searchQuery) ||
                  (contact.email && contact.email.toLowerCase() === searchQuery) ||
                  contact.phone === searchQuery
              )
      );
    },

    createContactObject(contact) {
      if (!contact) return {};
      return {
        id: contact.id || '',
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
        entity: "contact"
      };
    },

    navigateToContact(contactIndex) {
      if (contactIndex !== -1 && contactIndex < this.contacts.length) {
        this.selectedContact = contactIndex;
        this.pageView = "contactdetails";
        return true;
      }
      return false;
    },

    // Message handling functions
    makeCall: function (number) {
      if (!(number === undefined)) {
        this.numberToCall = number;
      }

      this.sendMessage('onclicktoact', {
        phone: this.numberToCall
      });
    },

    process_zcc_error_log(type, data){
      console.error('['+ type + ']' + JSON.stringify(data));
    },
    //받은 메세지 출력 > 로그저장 > 메세지 타입별 처리함수 호출
    receiveMessage(event) {
      const data = event.data;

      if (!data) return;

      console.log("PostMessage received event ", data.type);
      console.log("PostMessage content ", JSON.stringify(data));
      console.log("Current agentStatusCode:", this.agentStatusCode);
      console.log("Current agentStatus:", this.agentStatus);

      this.zccSmartEmbedLogs.Received.push({"direction": "Received Message", "payload": data, "timestamp": this.getKoreanTimestamp()});

      // Message handler map
      const messageHandlers = {
        'pageView': () => {
          if (this.pageView !== 'contactdetails') {
            this.selectedContact = null;
          }
        },
        'zcc-contact-search-event': () => this.process_zcc_contact_search_event(event),
        'zcc-incomingPhone-request': () => this.process_zcc_incomingPhone_request(event),
        'zcc-incomingEmail-request': () => this.process_zcc_incomingEmail_request(event),
        'zcc-call-ringing': () => this.process_zcc_call_ringing(data.data), //벨울림
        'zcc-chat-ringing': () => this.process_zcc_chat_ringing(data.data),
        'zcc-chat-started': () => this.process_zcc_chat_started(data.data),
        'zcc-chat-ended': () => this.process_zcc_chat_ended(data.data),
        'zcc-sms-ringing': () => this.process_zcc_sms_ringing(data.data),
        'zcc-sms-started': () => this.process_zcc_sms_started(data.data),
        'zcc-sms-ended': () => this.process_zcc_sms_ended(data.data),
        'zcc-screen-pop': () => this.process_zcc_screen_pop(data.data),
        'zcc-call-connected': () => this.process_zcc_call_connected_event(data.data),
        'zcc-phone-call-log': () => this.process_zcc_phone_call_log(data.data),
        'zcc-resize': () => this.process_zcc_resize(data.data),
        'zcc-call-recording': () => this.process_zcc_call_recording(data.data),
        'zcc-get-variables-response': () => this.process_zcc_get_variables_response(data.data),
        'zcc-video-ringing': () => this.process_zcc_video_ringing(data.data),
        'zcc-video-started': () => this.process_zcc_video_started(data.data),
        'zcc-video-ended': () => this.process_zcc_video_ended(data.data),
        'zcc-engagement-status-response': () => this.process_zcc_engagement_status_response(data.data),
        'zcc-outbound-call-started': () => this.process_zcc_outbound_call_started(data.data),
        'zcc-inbound-not-connected': () => this.process_zcc_inbound_outbound_not_connected(data.data),
        'zcc-outbound-not-connected': () => this.process_zcc_outbound_outbound_not_connected(data.data),
        'zcc-call-ended': () => this.process_zcc_call_ended(data.data),
        'zcc-end-post-engagement': () => this.process_zcc_end_post_engagement(data.data),
        'zcc-init-config-request': () => this.process_zcc_init_config_response(event),
        'zcc-agent-status-notification': () => this.process_zcc_agent_status_notification(data.data), //상태변경 알림 이벤트
        'zcc-error': () => this.process_zcc_error_log(data.type, data.data) //상태변경 알림 이벤트
      };

      // Execute the handler if it exists
      const handler = messageHandlers[data.type];
      console.log('Looking for handler for type:', data.type);
      // console.log('Type length:', data.type.length);
      console.log('Type char codes:', Array.from(data.type).map(c => c.charCodeAt(0)));
      console.log('Handler found:', !!handler);
      if (handler) {
        console.log('Executing handler for:', data.type);
        try {
          handler();
          console.log('Handler executed successfully');
        } catch (error) {
          console.error('Error executing handler:', error);
        }
      } else {
        console.log('No handler found for message type:', data.type);
        console.log('Available handlers:', Object.keys(messageHandlers));
        console.log('Exact match check:');
        // Object.keys(messageHandlers).forEach(key => {
          // console.log(`  "${key}" === "${data.type}": ${key === data.type}`);
          // console.log(`  Key length: ${key.length}, Type length: ${data.type.length}`);
        // });
      }
    },

    // Test function for debugging chat events
    testChatFlow() {
      console.log('=== TESTING CHAT FLOW ===');

      // Simulate chat ringing
      const chatRingingData = {
        queueId: "test-queue-id",
        queueName: "Test Queue",
        engagementId: "test-chat-123",
        customerName: "Test Customer",
        customerEmail: "test@example.com"
      };

      console.log('Simulating zcc-chat-ringing event...');
      this.process_zcc_chat_ringing(chatRingingData);

      // Wait a bit then simulate chat started
      setTimeout(() => {
        console.log('Simulating zcc-chat-started event...');
        const chatStartedData = {
          engagementId: "test-chat-123",
          createTs: Date.now()
        };
        this.process_zcc_chat_started(chatStartedData);
      }, 1000);

      // Wait a bit then simulate chat ended (wrapup)
      setTimeout(() => {
        console.log('Simulating zcc-chat-ended event...');
        const chatEndedData = {
          engagementId: "test-chat-123",
          completeTs: Date.now()
        };
        this.process_zcc_chat_ended(chatEndedData);
      }, 2000);

      // Wait a bit then simulate end post engagement
      setTimeout(() => {
        console.log('Simulating zcc-end-post-engagement event...');
        const endPostData = {
          engagementId: "test-chat-123",
          dispositionCode: "Test Disposition"
        };
        this.process_zcc_end_post_engagement(endPostData);
      }, 3000);
    },

    saveSettings() {
      localStorage.setItem('debug', this.debug);
      localStorage.setItem('showAgentStatus', this.showAgentStatus);
      localStorage.setItem('showEngagementCount', this.showEngagementCount);
      localStorage.setItem('allowUserToChangeStatus', this.allowUserToChangeStatus);
      localStorage.setItem('placement', this.placement);
      localStorage.setItem('isIframeFloatingVisible', this.isIframeFloatingVisible);
      localStorage.setItem('floatingIframePosition', JSON.stringify(this.floatingIframePosition));

    },

    saveSettingsAndReload() {
      this.saveSettings(); // Save all settings before reloading
      localStorage.setItem('cluster', this.cluster);
      localStorage.setItem('ctiVersion', this.ctiVersion);
      localStorage.setItem('vanitySubdomain', this.vanitySubdomain);
      location.reload();
    },

    sendMessage(type, data) {
      console.log("Sending Message type=" + type + " with data=" + JSON.stringify(data));

      this.zccSmartEmbedLogs.Sending.push({
        "direction": "Sending Message", "payload": {
          type: type,
          data: data,
          timestamp: this.getKoreanTimestamp()
        }
      });

      try {
        const iframeName = "zoom-embeddable-phone-iframe-" + this.placement;
        console.log("Looking for iframe:", iframeName);

        const iframe = window.frames[iframeName];
        console.log("Found iframe:", iframe);

        if (iframe && iframe.contentWindow) {
          console.log("Iframe contentWindow available, sending message...");
          iframe.contentWindow.postMessage({
            type: type,
            data: data
          }, "*");
          console.log("Message sent successfully to iframe");
        } else {
          console.warn("Iframe not ready or contentWindow not available");
          console.log("Available frames:", Object.keys(window.frames));
        }
      } catch (error) {
        console.error("Error sending message to iframe:", error);
      }
    },

    //통화 콜정보 변경
    updateEngagementCache(engagement) {
      if (!engagement || !engagement.taskId) {
        console.warn("Attempted to update engagement cache with invalid engagement object:", engagement);
        return;
      }

      console.log(`=== updateEngagementCache called ===`);
      console.log(`Engagement to update:`, engagement);
      console.log(`Current cache state for ${engagement.taskId}:`, this.zccEngagementCache[engagement.taskId]);

      // If engagement state is 'ended' or similar, remove it from cache
      if (engagement.state === 'ended' || engagement.state === 'disconnected' || engagement.state === 'cancelled') {
        if (this.zccEngagementCache[engagement.taskId]) {
          delete this.zccEngagementCache[engagement.taskId];
          console.log(`Engagement ${engagement.taskId} removed from cache.`);
        }
      } else {
        // Add or update engagement in cache
        const existingEngagement = this.zccEngagementCache[engagement.taskId] || {};
        const updatedEngagement = {
          ...existingEngagement,
          ...engagement,
          dispositionId: existingEngagement.dispositionId || '' // Ensure dispositionId exists
        };

        // Use Vue reactivity-friendly assignment (Vue 2 compatible)
        if (this.$set) {
          this.$set(this.zccEngagementCache, engagement.taskId, updatedEngagement);
        } else {
          // Fallback for Vue 2
          this.zccEngagementCache[engagement.taskId] = updatedEngagement;
          // Force reactivity by triggering a change
          this.zccEngagementCache = {...this.zccEngagementCache};
        }

        console.log(`Engagement ${engagement.taskId} updated in cache. New state:`, this.zccEngagementCache[engagement.taskId]);
      }
    },

    addContact() {
      if (!this.newContact.name || !this.newContact.phone) {
        alert("이름과 전화번호는 필수입니다!");
        return;
      }
      this.contacts.push({ ...this.newContact });
      this.newContact = { name: "", id: "", email: "", account: "", location: "", orders: "", phone: "" }; // 초기화
      this.saveContact();
    },

    // Function to populate contact information for an engagement based on phone number or email
    populateContactInfo(engagement) {
      if (!engagement) return;

      let phoneNumberToSearch = null;
      let emailToSearch = null;

      // Determine which phone number to search for based on direction
      if (engagement.engagementDirection === 'inbound') {
        // For inbound calls, use the 'from' number
        phoneNumberToSearch = engagement.from;
      } else if (engagement.engagementDirection === 'outbound') {
        // For outbound calls, use the 'to' number
        phoneNumberToSearch = engagement.to;
      }

      // For chat and video, also check if we have an email to search with
      if (engagement.channel === 'chat' || engagement.channel === 'video' || engagement.channel === 'sms') {
        emailToSearch = engagement.customerEmail;
      }

      let matchingContact = null;

      // First try to find by phone number if available
      if (phoneNumberToSearch) {
        matchingContact = this.contacts.find(contact => {
          // Normalize phone numbers for comparison (remove any formatting differences)
          const normalizedContactPhone = this.normalizePhoneNumber(contact.phone);
          const normalizedSearchPhone = this.normalizePhoneNumber(phoneNumberToSearch);
          return normalizedContactPhone === normalizedSearchPhone;
        });
      }

      // If no phone match and we have an email, try email search
      if (!matchingContact && emailToSearch) {
        matchingContact = this.contacts.find(contact => {
          return contact.email && contact.email.toLowerCase() === emailToSearch.toLowerCase();
        });
      }

      if (matchingContact) {
        // Populate the engagement with contact information
        engagement.customerName = matchingContact.name;
        engagement.customerEmail = matchingContact.email;
        engagement.customerNumber = matchingContact.phone;
        engagement.customerAccount = matchingContact.account;
        engagement.customerLocation = matchingContact.location;
        engagement.customerOrders = matchingContact.orders;
        engagement.customerId = matchingContact.id;

        if (phoneNumberToSearch) {
          console.log(`Contact found for engagement ${engagement.taskId} by phone: ${matchingContact.name} (${matchingContact.phone})`);
        } else if (emailToSearch) {
          console.log(`Contact found for engagement ${engagement.taskId} by email: ${matchingContact.name} (${matchingContact.email})`);
        }
      } else {
        if (phoneNumberToSearch) {
          console.log(`No contact found for phone number: ${phoneNumberToSearch}`);
        } else if (emailToSearch) {
          console.log(`No contact found for email: ${emailToSearch}`);
        } else {
          console.log(`No phone number or email available for contact lookup in engagement ${engagement.taskId}`);
        }
      }
    },

    // Helper function to normalize phone numbers for comparison
    normalizePhoneNumber(phoneNumber) {
      if (!phoneNumber) return '';
      // Remove all non-digit characters and ensure it starts with +
      return '+' + phoneNumber.replace(/\D/g, '');
    },

    // Process different message types
    process_zcc_engagement_status_response(data) {
      if (!data) {
        console.warn("Invalid data for zcc-engagement-status-response:", data);
        return;
      }

      // Store callConnected states before clearing cache
      const previousCallConnectedStates = {};
      for (const engagementId in this.zccEngagementCache) {
        const engagement = this.zccEngagementCache[engagementId];
        if (engagement.callConnected !== undefined) {
          previousCallConnectedStates[engagementId] = engagement.callConnected;
        }
      }

      // Clear existing cache and repopulate with current active/wrapup engagements
      this.zccEngagementCache = {};

      // Process active engagements
      if (data.active && Array.isArray(data.active)) {
        data.active.forEach(engagement => {
          // Map engagementId to taskId for consistency with cache
          const mappedEngagement = {
            ...engagement,
            taskId: engagement.engagementId
          };

          // Check if this engagement had a previous callConnected state
          if (previousCallConnectedStates[engagement.engagementId] !== undefined) {
            // Preserve previous callConnected state
            mappedEngagement.callConnected = previousCallConnectedStates[engagement.engagementId];
          } else {
            // Set default callConnected state for new engagements - all channels start as not connected
            mappedEngagement.callConnected = false;
          }

          // Try to find and populate contact information
          this.populateContactInfo(mappedEngagement);
          this.updateEngagementCache(mappedEngagement);
        });
      }

      // Process wrapup engagements
      if (data.wrapup && Array.isArray(data.wrapup)) {
        data.wrapup.forEach(engagement => {
          // Map engagementId to taskId for consistency with cache
          const mappedEngagement = {
            ...engagement,
            taskId: engagement.engagementId,
            callConnected: true // Wrapup engagements are always connected (call was answered)
          };
          // Try to find and populate contact information
          this.populateContactInfo(mappedEngagement);
          this.updateEngagementCache(mappedEngagement);
        });
      }

      console.log("zccEngagementCache updated from status response:", this.zccEngagementCache);
    },

    process_zcc_outbound_call_started(data) {
      if (!data || !data.engagementId) {
        console.warn("Invalid data for zcc-outbound-call-started:", data);
        return;
      }
      console.log(`Processing zcc-outbound-call-started for ${data.engagementId}, startTs: ${data.startTs}`);

      // Show hover window if it's hidden and we're in hover mode
      if (this.placement === 'hover' && !this.isIframeFloatingVisible) {
        this.isIframeFloatingVisible = true;
        this.saveSettings();
      }

      // Store timestamp in separate persistent cache
      this.zccEngagementTimestamps[data.engagementId] = data.startTs;

      // Create engagement object
      const engagement = {
        taskId: data.engagementId,
        channel: 'voice', // Assuming phone for outbound calls
        engagementDirection: 'outbound',
        state: 'active',
        startTs: data.startTs,
        callStartTimestamp: data.startTs, // Store for use in call log if callStartTime is empty
        to: data.to || this.numberToCall, // Use the number being called
        callConnected: false // Initially false until call is answered
      };

      // Try to populate contact information
      this.populateContactInfo(engagement);

      // Add to cache
      this.updateEngagementCache(engagement);
    },

    //받기 전 끊김
    process_zcc_inbound_outbound_not_connected(data) {
      if (!data || !data.engagementId) {
        console.warn("Invalid data for zcc-inbound-outbound-not-connected:", data);
        return;
      }
      console.log(`=== INBOUND NOT CONNECTED EVENT ===`);
      console.log(`Reason: ${data.reasonCode || 'unknown'}, Message: ${data.message || 'none'}`);
      console.log(`Removing engagement ${data.engagementId} from cache due to ${data.reasonCode || 'unknown reason'}`);

      // Remove engagement from cache since it was declined/rejected
      // This handles all decline reasons: agent-rejected, customer-hangup, etc.
      this.updateEngagementCache({
        taskId: data.engagementId,
        state: 'disconnected'
      });
    },

    process_zcc_outbound_outbound_not_connected(data) {
      if (!data || !data.engagementId) {
        console.warn("Invalid data for zcc-outbound-outbound-not-connected:", data);
        return;
      }
      console.log(`=== OUTBOUND NOT CONNECTED EVENT ===`);
      console.log(`Reason: ${data.reasonCode || 'unknown'}, Message: ${data.message || 'none'}`);
      console.log(`Removing engagement ${data.engagementId} from cache due to ${data.reasonCode || 'unknown reason'}`);

      // Remove engagement from cache since it was not connected
      // This handles all outbound not connected reasons: outbound-call-canceled, etc.
      this.updateEngagementCache({
        taskId: data.engagementId,
        state: 'disconnected'
      });
    },

    process_zcc_call_ended(data) {
      if (!data || !data.engagementId) {
        console.warn("Invalid data for zcc-call-ended:", data);
        return;
      }
      // Mark engagement as wrapup
      this.updateEngagementCache({
        taskId: data.engagementId,
        state: 'wrapup'
      });
    },

    process_zcc_end_post_engagement(data) {
      if (!data || !data.engagementId) {
        console.warn("Invalid data for zcc-end-post-engagement:", data);
        return;
      }

      console.log('=== END POST ENGAGEMENT EVENT ===');
      console.log('Data received:', data);

      // Check if this is an SMS, video, or chat engagement
      const existingEngagement = this.zccEngagementCache[data.engagementId];
      if (existingEngagement && (existingEngagement.channel === 'sms' || existingEngagement.channel === 'video' || existingEngagement.channel === 'chat')) {
        // For SMS, video, and chat, keep it in wrapup state until user explicitly closes it
        // Just update the disposition if provided
        if (data.dispositionCode) {
          console.log(`Setting disposition for ${existingEngagement.channel} engagement ${data.engagementId}: ${data.dispositionCode}`);
          this.updateEngagementCache({
            taskId: data.engagementId,
            dispositionId: data.dispositionCode
          });
        } else {
          console.log(`No disposition code provided for ${existingEngagement.channel} engagement ${data.engagementId}`);
        }
        console.log(`${existingEngagement.channel} engagement ${data.engagementId} kept in wrapup state for user to close`);
      } else {
        // For other channels (voice), remove from cache
        this.updateEngagementCache({
          taskId: data.engagementId,
          state: 'ended' // This will trigger removal
        });
        console.log(`Non-SMS/video/chat engagement ${data.engagementId} removed from cache`);
      }
    },

    process_zcc_init_config_response(event) {
      this.sendMessage("zcc-init-config-response", {
        phone: {
          screenPopEvent: "RINGING", //ANSWER,RINGING
        }
      });


    },

    //인입번호 앱 내 조회 후 서버에 응답
    process_zcc_contact_search_event(event) {
      let contactObject = {};

      if (!event || !event.data || !event.data.data || !event.data.data.query) {
        this.sendMessage('zcc-contact-search-response', {});
        return;
      }

      let foundContact = null;
      const query = event.data.data.query;

      // Handle email-specific search
      if (query.type === 'email' && query.email) {
        foundContact = this.findContactByEmail(query.email);
      }
      // Handle general search
      else if (query) {
        foundContact = this.findContactByQuery(query);
      }

      if (foundContact) {
        contactObject = this.createContactObject(foundContact);
      }

      this.sendMessage('zcc-contact-search-response', contactObject);
    },

    // 전화벨 울리면, 받기 팝업에 연락처 정보를 띄움 : 애플리케이션에 일치하는 레코드가 없는 경우 빈배열 반환.
    // 배열에 여러 객체를 보내면, 상담원이 항목을 선택할 수 있도록 해당 객체가 표시됨
    //PostMessage content  {"type":"zcc-incomingPhone-request","data":{"incomingPhoneNumber":"+821027343718","engagementId":"WSgT4SxZT1GD8RgAgkebfg","channel":"voice"}}
    process_zcc_incomingPhone_request(event) {
      if (!event || !event.data || !event.data.data || !event.data.data.incomingPhoneNumber) {
        this.sendMessage('zcc-incomingPhone-response', []);
        return;
      }

      //test : 링울림 시점이 아닌 팝업 시점으로 메세지 전송시점 변경
      this.sendMessage('zcc-get-variables', {"engagementId": event.data.data.engagementId});
      this.message = {"engagementId": event.data.data.engagementId};

      const incomingNumber = event.data.data.incomingPhoneNumber;
      const matchingContacts = this.contacts.filter(contact => contact && contact.phone === incomingNumber);
      const contactObjects = matchingContacts.map(contact => this.createContactObject(contact));

      this.sendMessage('zcc-incomingPhone-response', contactObjects);

      // Navigate to contact details for SMS
      if (event.data.data.channel === "sms" && contactObjects.length > 0) {
        this.pageView = "contactdetails";
      }
    },

    process_zcc_incomingEmail_request(event) {
      if (!event || !event.data || !event.data.data || !event.data.data.email) {
        this.sendMessage('zcc-incomingEmail-response', []);
        return;
      }

      const incomingEmail = event.data.data.email;
      const matchingContacts = this.contacts.filter(contact => contact && contact.email === incomingEmail);
      const contactObjects = matchingContacts.map(contact => this.createContactObject(contact));

      this.sendMessage('zcc-incomingEmail-response', contactObjects);

      // Cache engagement data and request variables
      if (event.data.data.engagementId) {
        const engagementId = event.data.data.engagementId;
        const channel = event.data.data.channel || 'video';

        // Check if we already have an engagement for this ID
        if (this.zccEngagementCache[engagementId]) {
          // Update existing engagement with contact information
          const existingEngagement = this.zccEngagementCache[engagementId];
          const matchingContact = matchingContacts[0]; // Use first matching contact

          if (matchingContact) {
            this.updateEngagementCache({
              taskId: engagementId,
              customerEmail: incomingEmail,
              customerName: matchingContact.name,
              customerNumber: matchingContact.phone,
              customerAccount: matchingContact.account,
              customerLocation: matchingContact.location,
              customerOrders: matchingContact.orders,
              customerId: matchingContact.id
            });

            console.log(`Updated video engagement ${engagementId} with contact information for ${matchingContact.name}`);
          }
        } else {
          // Create new engagement if none exists
          this.zccEngagementCache[engagementId] = {
            "customerEmail": incomingEmail,
            "channel": channel
          };
        }

        // Request variables for this engagement
        this.sendMessage('zcc-get-variables', {"engagementId": engagementId});
      }
    },

    // Unified screen pop handling
    handleScreenPop(identifier, identifierType = 'phone') {
      if (!identifier) return false;

      let matchingContactIndex = -1;

      if (identifierType === 'phone') {
        matchingContactIndex = this.contacts.findIndex(contact => contact && contact.phone === identifier);
      } else if (identifierType === 'email') {
        matchingContactIndex = this.contacts.findIndex(contact => contact && contact.email === identifier);
      }

      return this.navigateToContact(matchingContactIndex);
    },

    async process_zcc_screen_pop(data) {
      if (!data || data === "") return;

      const success = this.handleScreenPop(data, 'phone');

      if (!success) {
        this.zccScreenPopMessage = "Incoming call from " + data;
        await delay(10000);
        this.zccScreenPopMessage = '';
      }
    },

    //벨 울림
    process_zcc_call_ringing(data) {
      if (!data || !data.from) return;

      // Show hover window if it's hidden and we're in hover mode
      if (this.placement === 'hover' && !this.isIframeFloatingVisible) {
        this.isIframeFloatingVisible = true;
        this.saveSettings();
      }

      //feat : 콜인입 오면 닫혀있는(true) 토글 열기 (2025.08.29)
      if (this.placement === 'right-side' && this.isIframeCollapsed) {
        this.toggleIframeCollapse();
      }

      // 인입번호를 연락처에서 조회하고 존재하면, pageView 와 선택된 연락처index 값 수정
      this.handleScreenPop(data.from, 'phone');

      // Request variables if engagement ID is provided
      if (data.engagementId) {
        // this.sendMessage('zcc-get-variables', {"engagementId": data.engagementId});

        // Store timestamp in separate persistent cache
        this.zccEngagementTimestamps[data.engagementId] = data.createTs;

        // Create engagement object
        const engagement = {
          taskId: data.engagementId,
          channel: data.channel,
          engagementDirection: 'inbound', // Assuming inbound for ringing
          state: 'active',
          customerNumber: data.from,
          callStartTimestamp: data.createTs, // Store for use in call log if callStartTime is empty
          from: data.from, // Add from number for contact lookup
          callConnected: false // Initially false until call is answered
        };

        // Try to populate contact information
        this.populateContactInfo(engagement);

        // Add to engagement cache
        this.updateEngagementCache(engagement);
      }
    },

    process_zcc_chat_ringing(data) {
      if (!data || !data.engagementId) return;

      console.log('=== CHAT RINGING EVENT ===');
      console.log('Data received:', data);

      // Show hover window if it's hidden and we're in hover mode
      if (this.placement === 'hover' && !this.isIframeFloatingVisible) {
        this.isIframeFloatingVisible = true;
        this.saveSettings();
      }

      // Create engagement object - chat starts as not connected (ringing)
      const engagement = {
        taskId: data.engagementId,
        channel: 'chat',
        engagementDirection: 'inbound', // Assuming inbound for ringing
        state: 'active',
        callConnected: false, // Chat starts as ringing (not connected)
        customerName: data.customerName || '',
        customerEmail: data.customerEmail || ''
      };

      console.log('Created chat engagement object:', engagement);

      // Try to populate contact information (for chat, this might be email-based)
      this.populateContactInfo(engagement);

      // Add to engagement cache
      this.updateEngagementCache(engagement);

      console.log('Chat engagement added to cache:', this.zccEngagementCache[data.engagementId]);

      // Request variables if engagement ID is provided
      if (data.engagementId) {
        this.sendMessage('zcc-get-variables', {"engagementId": data.engagementId});
      }

      this.handleScreenPop(data.customerEmail, 'email');
    },

    process_zcc_chat_started(data) {
      if (!data || !data.engagementId) return;

      console.log('=== CHAT STARTED EVENT ===');
      console.log('Data received:', data);

      // Check current state of engagement in cache
      const currentEngagement = this.zccEngagementCache[data.engagementId];
      console.log('Current engagement in cache before update:', currentEngagement);

      // Update engagement to show it's connected
      this.updateEngagementCache({
        taskId: data.engagementId,
        callConnected: true,
        state: 'active'
      });

      // Check state after update
      const updatedEngagement = this.zccEngagementCache[data.engagementId];
      console.log('Chat engagement after update:', updatedEngagement);
      console.log('callConnected value:', updatedEngagement.callConnected);
      console.log('state value:', updatedEngagement.state);

      // Force Vue reactivity update
      this.$forceUpdate();
    },

    process_zcc_chat_ended(data) {
      if (!data || !data.engagementId) return;

      console.log('=== CHAT ENDED EVENT ===');
      console.log('Data received:', data);

      // Mark chat as wrapup (not ended) so it shows in the drawer with disposition options
      this.updateEngagementCache({
        taskId: data.engagementId,
        state: 'wrapup',
        callConnected: true, // Wrapup engagements are always connected
        endTimestamp: data.completeTs || Date.now()
      });

      console.log('Chat engagement moved to wrapup state:', this.zccEngagementCache[data.engagementId]);
    },

    process_zcc_video_ringing(data) {
      if (!data || !data.engagementId) return;

      console.log('=== VIDEO RINGING EVENT ===');
      console.log('Data received:', data);

      // Show hover window if it's hidden and we're in hover mode
      if (this.placement === 'hover' && !this.isIframeFloatingVisible) {
        this.isIframeFloatingVisible = true;
        this.saveSettings();
      }

      // Create engagement object - video starts as not connected (ringing)
      const engagement = {
        taskId: data.engagementId,
        channel: 'video',
        engagementDirection: 'inbound', // Assuming inbound for ringing
        state: 'active',
        callConnected: false, // Video starts as ringing (not connected)
        customerName: data.customerName || '',
        customerEmail: data.customerEmail || '',
        queueName: data.queueName || '',
        queueId: data.queueId || ''
      };

      console.log('Created video engagement object:', engagement);

      // Try to populate contact information (for video, this might be email-based)
      this.populateContactInfo(engagement);

      // Add to engagement cache
      this.updateEngagementCache(engagement);

      console.log('Video engagement added to cache:', this.zccEngagementCache[data.engagementId]);

      setTimeout(() => {
        const engagementId = data.engagementId;
        const engagementData = this.zccEngagementCache[engagementId];

        if (engagementData && engagementData.customerEmail) {
          this.handleScreenPop(engagementData.customerEmail, 'email');
        }

        // Request variables if engagement ID is provided
        if (engagementId) {
          this.sendMessage('zcc-get-variables', {"engagementId": engagementId});
        }
      }, 1000);
    },

    process_zcc_video_started(data) {
      if (!data || !data.engagementId) return;

      console.log('=== VIDEO STARTED EVENT ===');
      console.log('Data received:', data);

      // Update engagement to show it's connected
      this.updateEngagementCache({
        taskId: data.engagementId,
        callConnected: true,
        state: 'active'
      });

      // Adjust iframe dimensions for video
      this.zccSmartEmbedDimensions.widthInPixels = 1152;

      console.log('Video engagement started for:', data.engagementId, '- now connected');
    },

    process_zcc_video_ended(data) {
      if (!data || !data.engagementId) return;

      console.log('=== VIDEO ENDED EVENT ===');
      console.log('Data received:', data);

      // Mark video as wrapup (not ended) so it shows in the drawer
      this.updateEngagementCache({
        taskId: data.engagementId,
        state: 'wrapup',
        endTimestamp: data.completeTs || Date.now()
      });

      console.log('Video engagement ended for:', data.engagementId, '- now in wrapup state');
    },

    process_zcc_sms_ringing(data) {
      if (!data || !data.engagementId) return;

      console.log('=== SMS RINGING EVENT ===');
      console.log('Data received:', data);

      // Show hover window if it's hidden and we're in hover mode
      if (this.placement === 'hover' && !this.isIframeFloatingVisible) {
        this.isIframeFloatingVisible = true;
        this.saveSettings();
      }

      // Create engagement object
      const engagement = {
        taskId: data.engagementId,
        channel: 'sms',
        engagementDirection: 'inbound', // Assuming inbound for ringing
        state: 'active',
        customerName: data.customerName || '',
        customerNumber: data.incomingPhoneNumber || '',
        callStartTimestamp: data.createTs || Date.now(),
        from: data.incomingPhoneNumber || '',
        callConnected: false // Initially false until SMS conversation starts
      };

      console.log('Created engagement object:', engagement);

      // Try to populate contact information
      this.populateContactInfo(engagement);

      // Add to engagement cache
      this.updateEngagementCache(engagement);

      console.log('Engagement added to cache:', this.zccEngagementCache[data.engagementId]);

      // Request variables if engagement ID is provided
      if (data.engagementId) {
        this.sendMessage('zcc-get-variables', {"engagementId": data.engagementId});
      }

      // Handle screen pop for SMS
      if (data.incomingPhoneNumber) {
        this.handleScreenPop(data.incomingPhoneNumber, 'phone');
      }
    },

    process_zcc_sms_started(data) {
      if (!data || !data.engagementId) return;

      console.log('=== SMS STARTED EVENT ===');
      console.log('Data received:', data);
      console.log('Current engagement cache before update:', this.zccEngagementCache[data.engagementId]);

      // Mark SMS as connected/started
      this.updateEngagementCache({
        taskId: data.engagementId,
        callConnected: true,
        state: 'active'
      });

      console.log('Engagement cache after update:', this.zccEngagementCache[data.engagementId]);
      console.log(`SMS conversation started for engagement: ${data.engagementId}`);
    },

    process_zcc_sms_ended(data) {
      if (!data || !data.engagementId) return;

      console.log('=== SMS ENDED EVENT ===');
      console.log('Data received:', data);
      console.log('Current engagement cache before update:', this.zccEngagementCache[data.engagementId]);

      // Mark SMS as wrapup (not ended) so it shows in the drawer
      this.updateEngagementCache({
        taskId: data.engagementId,
        state: 'wrapup',
        callConnected: true, // Wrapup engagements are always connected
        endTimestamp: data.completeTs || Date.now()
      });

      console.log('Engagement cache after update:', this.zccEngagementCache[data.engagementId]);
      console.log(`SMS conversation ended for engagement: ${data.engagementId} - now in wrapup state`);
    },


    // 상담원 상태변경 알림 이벤트 처리 함수
    process_zcc_agent_status_notification(data) {
      console.log('=== ENTERING process_zcc_agent_status_notification ===');
      console.log('Input data:', data);

      if (!data || !data.statusCode) {
        console.log('Early return - no data or statusCode');
        return;
      }

      console.log('=== PROCESSING AGENT STATUS NOTIFICATION ===');
      console.log('Raw data:', data);

      this.agentStatusCode = data.statusCode || "";
      console.log('Set agentStatusCode to:', this.agentStatusCode);
      console.log('agentStatusCode after setting:', this.agentStatusCode);

      // Update status text and sub-reason if available
      if (data.status) {
        this.agentStatus = data.status;
        console.log('Set agentStatus to status field:', this.agentStatus);
        console.log('agentStatus after setting:', this.agentStatus);
      } else {
        const systemStatus = this.systemStatuses.find(s => s.id === this.agentStatusCode);
        if (systemStatus) {
          this.agentStatus = systemStatus.name;
          console.log('Set agentStatus to system status:', this.agentStatus);
        } else {
          // Check if it's a custom status
          const customStatus = this.statusMappings.find(s => s.id === this.agentStatusCode);
          if (customStatus) {
            this.agentStatus = customStatus.name;
            console.log('Set agentStatus to custom status:', this.agentStatus);
          } else if (this.agentStatusCode) {
            // If we have a status code but no name, use the code as the status
            this.agentStatus = `Status ${this.agentStatusCode}`;
            console.log('Set agentStatus to code-based status:', this.agentStatusCode);
          } else {
            // Only set to "Unknown" if we have no status code at all (not logged in)
            this.agentStatus = "Unknown";
            console.log('Set agentStatus to Unknown');
          }
        }
      }

      // Set selectedStatus for the dropdown
      this.selectedStatus = this.agentStatusCode;
      console.log('Set selectedStatus to:', this.selectedStatus);

      // Update sub-reason if available
      this.agentSubReason = data.subReason || "";

      console.log('=== AGENT STATUS NOTIFICATION RECEIVED ===');
      console.log('Final agentStatus:', this.agentStatus);
      console.log('Final agentStatusCode:', this.agentStatusCode);
      console.log('Final selectedStatus:', this.selectedStatus);

      // Only refresh engagement data after the first agent status notification (page load)
      if (!this.hasReceivedInitialAgentStatus) {
        this.hasReceivedInitialAgentStatus = true;
        console.log('First agent status received - scheduling engagement refresh in 2 seconds...');

        setTimeout(() => {
          console.log('=== AUTO-REFRESH: After Initial Agent Status (2000ms) ===');
          this.refreshEngagementData();
        }, 2000);
      } else {
        console.log('Subsequent agent status update - no engagement refresh needed');
      }

      // Automatically add new 'Not Ready' reasons if parentStatusCode is '2'
      if (data.parentStatusCode === '2' && data.statusCode && data.subReason) {
        const newCustomStatus = {id: data.statusCode, name: data.subReason};
        // Check if this status already exists in system or custom mappings
        const exists = this.systemStatuses.some(s => s.id === newCustomStatus.id) ||
            this.statusMappings.some(s => s.id === newCustomStatus.id);

        if (!exists) {
          this.statusMappings.push(newCustomStatus);
          this.saveStatusMappings(); // Persist the new mapping
          console.log(`Automatically added new 'Not Ready' status: ${newCustomStatus.name} (${newCustomStatus.id})`);
        }
      }
    },


    //연결됨
    // PostMessage content  {"type":"zcc-call-connected","data":{"direction":"inbound","engagementId":"O3MDmdRJThK9LQ35aymSrg","from":"+821027343718","to":"+82221778196","queueName":"[Demo] 아정당 > 2번 가전렌탈","queueId":"ZbibbmgITOGRiJI79xMUEg"}}

    process_zcc_call_connected_event(data) {
      if (this.zccScreenPopMessage) {
        this.zccScreenPopMessage = this.zccScreenPopMessage.replace("Incoming call from", "Connected with");
      }

      // Mark the call as connected for both inbound and outbound calls
      this.updateEngagementCache({
        taskId: data.engagementId,
        callConnected: true
      });

      if (data.direction == "outbound") {
        this.updateEngagementCache({
          taskId: data.engagementId,
          engagementDirection: data.direction,
          state: 'active',
          customerNumber: data.to
        });
      }
    },

    process_zcc_phone_call_log(data) {
      if (!data || !data.objectRecord || !data.objectRecord.type) {
        console.error("Invalid data in process_zcc_phone_call_log");
        return;
      }

      const engagementType = data.objectRecord.type;
      let newCallObject = this.createCallLogObject(data, engagementType);

      if (!this.recentCalls) {
        this.recentCalls = [];
      }

      this.recentCalls.push(newCallObject);
      window.localStorage.setItem("recentCalls", JSON.stringify(this.recentCalls));

      // Handle engagement state based on channel type
      if (data.engagementId) {
        const existingEngagement = this.zccEngagementCache[data.engagementId];

        if (existingEngagement && (existingEngagement.channel === 'video' || existingEngagement.channel === 'sms')) {
          // For video and SMS, keep in wrapup state so they show in the drawer
          this.updateEngagementCache({
            taskId: data.engagementId,
            state: 'wrapup',
            endTimestamp: data.objectRecord.callEndTime || Date.now()
          });
          console.log(`Video/SMS engagement ${data.engagementId} moved to wrapup state`);
        } else {
          // For other channels (voice, chat), remove from cache
          this.updateEngagementCache({
            taskId: data.engagementId,
            state: 'ended' // This will trigger removal
          });
          console.log(`Non-video/SMS engagement ${data.engagementId} removed from cache`);
        }

        // Clean up the persistent timestamp cache after use
        if (this.zccEngagementTimestamps[data.engagementId]) {
          delete this.zccEngagementTimestamps[data.engagementId];
          console.log(`Cleaned up timestamp cache for ${data.engagementId}`);
        }
      }
    },
    // Clean notes by removing HTML tags and special characters
    cleanNotes(notesData) {
      // Get the notes value, handling both array and string cases
      let notesValue = '';
      if (Array.isArray(notesData)) {
        notesValue = notesData.join(' ');
      } else if (typeof notesData === 'string') {
        notesValue = notesData;
      } else if (notesData) {
        notesValue = String(notesData);
      }

      // Clean up the notes by removing HTML and special characters
      if (notesValue) {
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = notesValue;
        // Get text content (strips HTML tags)
        notesValue = tempDiv.textContent || tempDiv.innerText || '';
        // Remove any remaining special characters and trim
        notesValue = notesValue.replace(/\\n|\\r|\\t/g, ' ').trim();

        // Add a trailing period if one doesn't exist
        if (notesValue && notesValue.length > 0 && !notesValue.endsWith('.')) {
          notesValue += '.';
        }
      }

      return notesValue;
    },


    createCallLogObject(data, engagementType) {
      // Check if we have a cached engagement with startTs for cancelled calls
      let callStartTime = data.objectRecord.callStartTime || '';
      let callDuration = data.objectRecord.callDuration || '';

      console.log(`Creating call log for engagement ${data.engagementId}, callStartTime: "${callStartTime}"`);
      console.log(`Persistent timestamp cache:`, this.zccEngagementTimestamps);

      // If callStartTime is empty, try to use the persistent timestamp cache
      if (!callStartTime && data.engagementId && this.zccEngagementTimestamps[data.engagementId]) {

        const cachedTimestamp = this.zccEngagementTimestamps[data.engagementId];
        console.log(`Found persistent timestamp for ${data.engagementId}: ${cachedTimestamp}`);

        // Convert Unix timestamp to ISO string format
        callStartTime = new Date(cachedTimestamp).toISOString();
        console.log(`Converted to ISO: ${callStartTime}`);

        // For cancelled calls, set duration to 0:00 instead of NaN:NaN
        if (callDuration === 'NaN:NaN' || callDuration.includes('NaN')) {
          callDuration = '0:00';
        }
      } else if (!callStartTime) {
        console.log(`No persistent timestamp found for engagement ${data.engagementId}`);
      }

      let newCallObject = {
        "type": data.objectRecord.type || '',
        "callType": data.objectRecord.callType || '',
        "timestamp": callStartTime,
        "duration": callDuration,
        "engagementId": data.engagementId || '',
        "queue": data.objectRecord.callQueue || '',
        "dispositionCode": data.objectRecord.dispositionCode || '',
        "notes": this.cleanNotes(data.objectRecord.notes),
        "agentname": data.objectRecord.agentName || ''
      };

      // Add user ID if available
      if (data.user && data.user.id) {
        newCallObject.userId = data.user.id;
      }

      if (engagementType === 'phone') {
        this.zccScreenPopMessage = "";
        newCallObject.fromNumber = data.objectRecord.from || '';
        newCallObject.toNumber = data.objectRecord.to || '';
      } else if (engagementType === 'chat') {
        newCallObject.toNumber = data.objectRecord.agentName || '';

        // Set fromNumber based on available data
        if (data.user && data.user.name) {
          newCallObject.fromNumber = data.user.name;
        } else if (data.engagementId && this.zccEngagementCache[data.engagementId] &&
            this.zccEngagementCache[data.engagementId].customerEmail) {
          newCallObject.fromNumber = this.zccEngagementCache[data.engagementId].customerEmail;
        } else {
          newCallObject.fromNumber = "Consumer";
        }
      } else if (engagementType === 'sms') {
        newCallObject.toNumber = data.objectRecord.agentName || '';

        // Set fromNumber based on available data
        if (data.engagementId && this.zccEngagementCache[data.engagementId] &&
            this.zccEngagementCache[data.engagementId].customerNumber) {
          newCallObject.fromNumber = this.zccEngagementCache[data.engagementId].customerNumber;
        } else if (data.objectRecord.from) {
          newCallObject.fromNumber = data.objectRecord.from;
        } else {
          newCallObject.fromNumber = "SMS User";
        }
      }

      return newCallObject;
    },

    process_zcc_resize(data) {
      if (!data) return;

      console.log('Processing zcc-resize event:', data, 'Placement:', this.placement);

      if (this.placement === 'hover') {
        // In hover mode, update both width and height
        if (data.widthInPixels) {
          this.zccSmartEmbedDimensions.widthInPixels = data.widthInPixels;
          console.log('Updated hover width to:', data.widthInPixels);
        }
        if (data.heightInPixels) {
          this.zccSmartEmbedDimensions.heightInPixels = data.heightInPixels;
          console.log('Updated hover height to:', data.heightInPixels);
        }
        // Ensure visibility if a resize event comes in
        this.isIframeFloatingVisible = true;
        this.saveSettings();

        // Force a Vue reactivity update to ensure the computed property recalculates
        this.$forceUpdate();
      } else {
        // Original right-side behavior
        if (this.isIframeCollapsed) { // Don't allow ZCC to resize if collapsed or manually resizing
          return;
        }
        let newWidthPixels = data.widthInPixels;

        // Standardize certain width values

        if (!this.isIframeCollapsed) { // Only apply if not collapsed
          this.zccSmartEmbedDimensions.widthInPixels = newWidthPixels;
          this.iframePreCollapseWidth = newWidthPixels; // Update pre-collapse width
        }
      }
    },

    toggleFloatingIframeVisibility() {
      this.isIframeFloatingVisible = !this.isIframeFloatingVisible;
      this.saveSettings(); // Save the visibility state
    },


    toggleIframeCollapse() {
      if (this.placement === 'hover') return; // Collapse not applicable in hover mode

      console.log('[Before Toggle] isIframeCollapsed:', this.isIframeCollapsed);
      this.isIframeCollapsed = !this.isIframeCollapsed;
      console.log('[After Toggle] isIframeCollapsed:', this.isIframeCollapsed);

      if (this.isIframeCollapsed) {
        // If the iframe is currently visible (width > 0) and we are collapsing it
        if (this.zccSmartEmbedDimensions.widthInPixels > 0) {
          this.iframePreCollapseWidth = this.zccSmartEmbedDimensions.widthInPixels;
          console.log('Collapsing: Stored width', this.iframePreCollapseWidth);
        }
        this.zccSmartEmbedDimensions.widthInPixels = 0; // Collapse
        console.log('Collapsing: Set width to 0');
      } else {
        // Expanding
        const newWidth = this.iframePreCollapseWidth > 0 ? this.iframePreCollapseWidth : 698; // Fallback to 698
        this.zccSmartEmbedDimensions.widthInPixels = newWidth;
        console.log('Expanding: Set width to', newWidth, '(from iframePreCollapseWidth:', this.iframePreCollapseWidth, ')');
      }
      console.log('[End of Toggle] Final Width:', this.zccSmartEmbedDimensions.widthInPixels);
    },

    startResize(event) {
      // If the event target is the collapse/expand icon, do not proceed with resize.
      if (event.target.tagName === 'I' && (event.target.classList.contains('bi-chevron-left') || event.target.classList.contains('bi-chevron-right'))) {
        return;
      }

      if (this.isIframeCollapsed) return; // Prevent resize when collapsed
      this.isResizing = true;
      this.initialResizeX = event.clientX;
      this.initialIframeWidth = this.zccSmartEmbedDimensions.widthInPixels;

      const iframe = document.getElementById('zoom-embeddable-phone-iframe');
      if (iframe) {
        iframe.style.pointerEvents = 'none';
      }

      if (this.resizeShieldElement) { // Should not happen, but good for cleanup
        this.resizeShieldElement.removeEventListener('mousemove', this.boundDoResize);
        this.resizeShieldElement.removeEventListener('mouseup', this.boundStopResize);
        if (this.resizeShieldElement.parentNode) {
          this.resizeShieldElement.parentNode.removeChild(this.resizeShieldElement);
        }
        this.resizeShieldElement = null;
      }

      this.resizeShieldElement = document.createElement('div');
      this.resizeShieldElement.setAttribute('id', 'resize-shield');
      this.resizeShieldElement.style.position = 'fixed';
      this.resizeShieldElement.style.top = '0';
      this.resizeShieldElement.style.left = '0';
      this.resizeShieldElement.style.width = '100vw';
      this.resizeShieldElement.style.height = '100vh';
      this.resizeShieldElement.style.background = 'transparent'; // Or 'rgba(0,0,0,0.01)' for debugging
      this.resizeShieldElement.style.zIndex = '9999';
      this.resizeShieldElement.style.cursor = 'col-resize';

      document.body.appendChild(this.resizeShieldElement);

      this.resizeShieldElement.addEventListener('mousemove', this.boundDoResize);
      this.resizeShieldElement.addEventListener('mouseup', this.boundStopResize);

      event.preventDefault();
    },

    doResize(event) {
      if (!this.isResizing) return;

      const deltaX = event.clientX - this.initialResizeX;
      let newWidth = this.initialIframeWidth - deltaX;

      const minWidth = 200;
      const navElement = document.querySelector('.navbar.sidebar');
      const navWidth = navElement ? navElement.offsetWidth : 0;
      // Allow iframe to go almost to the edge, leaving a small margin
      const maxWidth = window.innerWidth - navWidth - 10;


      if (newWidth < minWidth) {
        newWidth = minWidth;
      }
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
      }

      this.zccSmartEmbedDimensions.widthInPixels = newWidth;
      if (!this.isIframeCollapsed) {
        this.iframePreCollapseWidth = newWidth;
      }
    },

    stopResize(event) {
      if (!this.isResizing) return;
      this.isResizing = false;

      const iframe = document.getElementById('zoom-embeddable-phone-iframe');
      if (iframe) {
        iframe.style.pointerEvents = 'auto';
      }

      if (this.resizeShieldElement) {
        this.resizeShieldElement.removeEventListener('mousemove', this.boundDoResize);
        this.resizeShieldElement.removeEventListener('mouseup', this.boundStopResize);
        if (this.resizeShieldElement.parentNode) {
          document.body.removeChild(this.resizeShieldElement);
        }
        this.resizeShieldElement = null;
      }
      console.log("Resizing stopped, shield removed, listeners cleaned. Iframe pointer-events restored.");
    },

    startDrag(event) {
      if (this.placement !== 'hover') return; // Only drag in hover mode
      this.isResizing = true; // Re-using isResizing for drag state
      this.initialDragX = event.clientX;
      this.initialDragY = event.clientY;
      this.initialIframeX = this.floatingIframePosition.x;
      this.initialIframeY = this.floatingIframePosition.y;

      const iframe = document.getElementById('zoom-embeddable-phone-iframe');
      if (iframe) {
        iframe.style.pointerEvents = 'none'; // Disable iframe interactions during drag
      }

      // Create a transparent shield to capture mouse events
      // Ensure it's always created and appended
      if (!this.dragShieldElement) {
        this.dragShieldElement = document.createElement('div');
        this.dragShieldElement.setAttribute('id', 'drag-shield');
        this.dragShieldElement.style.position = 'fixed';
        this.dragShieldElement.style.top = '0';
        this.dragShieldElement.style.left = '0';
        this.dragShieldElement.style.width = '100vw';
        this.dragShieldElement.style.height = '100vh';
        this.dragShieldElement.style.background = 'transparent';
        this.dragShieldElement.style.zIndex = '9998'; // Below resize shield if both active
        document.body.appendChild(this.dragShieldElement);
      }

      console.log("startDrag called."); // Log to confirm execution
      document.body.style.cursor = 'grabbing'; // Set cursor for entire body

      document.addEventListener('mousemove', this.boundDoDrag);
      document.addEventListener('mouseup', this.boundStopDrag);
      document.addEventListener('mouseleave', this.boundStopDrag); // Added to handle mouse leaving window
      event.preventDefault();
    },

    doDrag(event) {
      if (!this.isResizing) return; // Re-using isResizing for drag state

      const deltaX = event.clientX - this.initialDragX;
      const deltaY = event.clientY - this.initialDragY;

      let newX = this.initialIframeX + deltaX;
      let newY = this.initialIframeY + deltaY;

      // Boundary checks (optional, but good for usability)
      const floatingContainer = document.getElementById('floating-iframe-container');
      // Use floatingContainer.offsetWidth and offsetHeight for current dimensions
      const containerWidth = floatingContainer ? floatingContainer.offsetWidth : this.zccSmartEmbedDimensions.widthInPixels;
      const containerHeight = floatingContainer ? floatingContainer.offsetHeight : this.zccSmartEmbedDimensions.heightInPixels;


      // Prevent dragging off screen, allow a small margin from the edges
      newX = Math.max(0, Math.min(newX, window.innerWidth - containerWidth - 5));
      newY = Math.max(0, Math.min(newY, window.innerHeight - containerHeight - 5));

      this.floatingIframePosition = {x: newX, y: newY};
    },

    stopDrag(event) {
      console.log("stopDrag called."); // Log to confirm execution
      if (!this.isResizing) {
        console.log("stopDrag called but not resizing.");
        return;
      }
      this.isResizing = false; // Re-using isResizing for drag state

      const iframe = document.getElementById('zoom-embeddable-phone-iframe');
      if (iframe) {
        iframe.style.pointerEvents = 'auto'; // Restore iframe interactions
      }

      document.removeEventListener('mousemove', this.boundDoDrag);
      document.removeEventListener('mouseup', this.boundStopDrag);
      document.removeEventListener('mouseleave', this.boundStopDrag); // Remove listener

      if (this.dragShieldElement) {
        if (this.dragShieldElement.parentNode) {
          document.body.removeChild(this.dragShieldElement);
        }
        this.dragShieldElement = null;
      }
      document.body.style.cursor = 'auto'; // Explicitly reset cursor
      this.saveSettings(); // Save the new position
    },

    process_zcc_get_variables_response(data) {
      if (!data || !("variables" in data) || !Array.isArray(data.variables)) return;

      data.variables.forEach(variable => {
        if (variable && variable.globalVariableDisplayName) {
          this.customCard.fields.forEach(field => {
            if (field.type === 'variable' && field.source === variable.globalVariableDisplayName) {
              field.value = variable.value;
            }
          });
        }
      });
      this.saveCustomCardConfig(); // Persist the updated values
    },

    process_zcc_call_recording(data) {
      if (!data || !data.engagementId || !data.recordingUrl) return;

      const engagementId = data.engagementId;
      const recordingUrl = data.recordingUrl;

      this.zccRecordingURLs[engagementId] = recordingUrl;
      window.localStorage.setItem("recording-" + engagementId, recordingUrl);
    },

    requestEngagementStatus() {
      let timestamp = Date.now(); // Get the current timestamp in milliseconds
      let randomPart = Math.random().toString(36).substring(2, 15); // Generate a random string
      const requestId = "uuid-" + timestamp + "-" + randomPart;

      console.log('=== REQUESTING ENGAGEMENT STATUS ===');
      console.log('Request ID:', requestId);
      console.log('Sending message to iframe...');

      this.sendMessage('zcc-engagement-status-request', {requestId: requestId});

      console.log('Message sent, waiting for response...');
    },

    refreshEngagementData() {
      // Set loading state
      this.isRefreshing = true;

      console.log("=== REFRESH ENGAGEMENT DATA STARTED ===");
      console.log("Current zccEngagementCache:", this.zccEngagementCache);
      console.log("Current allActiveEngagements:", this.allActiveEngagements);

      // Check if iframe is ready
      const iframeName = "zoom-embeddable-phone-iframe-" + this.placement;
      const iframe = window.frames[iframeName];

      if (!iframe || !iframe.contentWindow) {
        console.warn("Iframe not ready, cannot refresh engagement data");
        this.isRefreshing = false;
        return;
      }

      console.log("Iframe is ready, proceeding with refresh...");

      // Clear the current cache to force a fresh start
      this.zccEngagementCache = {};
      this.zccEngagementTimestamps = {};

      console.log("Cache cleared, requesting fresh data...");

      // Request fresh engagement status
      this.requestEngagementStatus();

      // Reset loading state after a reasonable delay
      setTimeout(() => {
        this.isRefreshing = false;
        console.log("=== REFRESH COMPLETED ===");
        console.log("Final zccEngagementCache:", this.zccEngagementCache);
        console.log("Final allActiveEngagements:", this.zccEngagementCache);
      }, 2000);
    },

    toggleEngagementDrawer() {
      this.isEngagementDrawerOpen = !this.isEngagementDrawerOpen;
      console.log('=== ENGAGEMENT DRAWER TOGGLED ===');
      console.log('New state:', this.isEngagementDrawerOpen);
      console.log('Active engagements count:', Object.keys(this.allActiveEngagements).length);
      console.log('All active engagements:', this.allActiveEngagements);
    },

    getChannelBadgeClass(channel) {
      switch (channel?.toLowerCase()) {
        case 'voice':
          return 'bg-primary';
        case 'chat':
          return 'bg-success';
        case 'email':
          return 'bg-info';
        case 'sms':
          return 'bg-warning';
        case 'video':
          return 'bg-danger';
        default:
          return 'bg-secondary';
      }
    },

    getStateBadgeClass(state) {
      switch (state?.toLowerCase()) {
        case 'active':
          return 'bg-success';
        case 'wrapup':
          return 'bg-warning';
        case 'ringing':
          return 'bg-info';
        case 'incoming':
          return 'bg-info';
        default:
          return 'bg-secondary';
      }
    },

    terminateEngagement(engagementId, channelType) {
      const requestId = `request-${engagementId}-${Date.now()}`;
      this.sendMessage('zcc-terminate-engagement', {
        engagementId: engagementId,
        channelType: channelType,
        requestId: requestId
      });
    },

    closeEngagementWrapup(engagementId, channelType) {
      const requestId = `request-${engagementId}-${Date.now()}`;

      console.log(`=== CLOSING ENGAGEMENT WRAPUP ===`);
      console.log(`Engagement ID: ${engagementId}`);
      console.log(`Channel Type: ${channelType}`);
      console.log(`Request ID: ${requestId}`);

      this.sendMessage('zcc-close-engagement-wrapup', {
        engagementId: engagementId,
        channelType: channelType,
        requestId: requestId
      });

      // For SMS, video, and chat engagements, also remove from local cache since they're now fully closed
      if (channelType === 'sms' || channelType === 'video' || channelType === 'chat') {
        console.log(`Removing ${channelType} engagement ${engagementId} from local cache`);
        if (this.zccEngagementCache[engagementId]) {
          delete this.zccEngagementCache[engagementId];
        }
      }
    },

    setEngagementDisposition(engagementId, channelType, dispositionId) {
      const requestId = `request-${engagementId}-${Date.now()}`;

      console.log(`=== SETTING ENGAGEMENT DISPOSITION ===`);
      console.log(`Engagement ID: ${engagementId}`);
      console.log(`Channel Type: ${channelType}`);
      console.log(`Disposition ID: ${dispositionId}`);
      console.log(`Request ID: ${requestId}`);

      this.sendMessage('zcc-set-engagement-disposition', {
        engagementId: engagementId,
        channelType: channelType,
        requestId: requestId,
        dispositionId: dispositionId
      });
    },

    // UI and storage functions
    getRecordingURL(engagementId) {
      if (!engagementId) return null;
      return window.localStorage.getItem("recording-" + engagementId);
    },

    clearCommunicationLogs() {
      this.recentCalls = [];
      window.localStorage.removeItem("recentCalls");
    },

    editContact(index) {
      if (index >= 0 && index < this.contacts.length) {
        this.editingIndex = index;
        this.editingContact = {...this.contacts[index]};
        const modal = new bootstrap.Modal(document.getElementById('editContactModal'));
        modal.show();
      }
    },

    viewContact(index) {
      this.navigateToContact(index);
    },

    clearSelectedContact() {
      this.selectedContact = null;
      this.pageView = "accounts";
    },

    saveContact() {
      if (this.editingIndex > -1 && this.editingContact) {
        if (this.editingIndex < this.contacts.length) {
          this.contacts[this.editingIndex] = {...this.editingContact};
          window.localStorage.setItem("contacts", JSON.stringify(this.contacts));
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('editContactModal'));
        if (modal) {
          modal.hide();
        }
        this.editingContact = null;
        this.editingIndex = -1;
      }
    },

    getMyContactLogs(userId) {
      if (!userId || !this.recentCalls) {
        return [];
      }

      return this.recentCalls
          .filter(call => call && call.userId === userId)
          .map(call => {
            const tempRecordingURL = call.engagementId ?
                window.localStorage.getItem("recording-" + call.engagementId) : null;

            if (call.engagementId && !(call.engagementId in this.zccRecordingURLs)) {
              this.zccRecordingURLs[call.engagementId] = tempRecordingURL;
            }

            return {
              type: call.type || '',
              callType: call.callType || '',
              fromNumber: call.fromNumber || '',
              toNumber: call.toNumber || '',
              timestamp: call.timestamp || '',
              duration: call.duration || '',
              engagementId: call.engagementId || '',
              queue: call.queue || '',
              dispositionCode: call.dispositionCode || '',
              notes: call.notes || '',
              recordingUrl: tempRecordingURL || ''
            };
          });
    },
    loadDispositionMappings() {
      const mappings = localStorage.getItem('dispositionMappings');
      if (mappings) {
        this.dispositionMappings = JSON.parse(mappings);
      }
    },
    saveDispositionMappings() {
      localStorage.setItem('dispositionMappings', JSON.stringify(this.dispositionMappings));
    },
    addDispositionMapping() {
      if (this.newDisposition.id && this.newDisposition.name) {
        this.dispositionMappings.push({...this.newDisposition});
        this.saveDispositionMappings();
        this.newDisposition.id = '';
        this.newDisposition.name = '';
      }
    },
    deleteDispositionMapping(index) {
      this.dispositionMappings.splice(index, 1);
      this.saveDispositionMappings();
    },
    loadCustomCardConfig() {
      const config = localStorage.getItem('customCardConfig');
      if (config) {
        this.customCard = JSON.parse(config);
      }
    },
    saveCustomCardConfig() {
      localStorage.setItem('customCardConfig', JSON.stringify(this.customCard));
    },
    addCustomField() {
      if (this.newCustomField.displayName) {
        this.customCard.fields.push({...this.newCustomField});
        this.saveCustomCardConfig();
        this.newCustomField = {displayName: '', type: 'variable', source: '', value: ''};
      }
    },
    deleteCustomField(index) {
      this.customCard.fields.splice(index, 1);
      this.saveCustomCardConfig();
    },
    loadStatusMappings() {
      const mappings = localStorage.getItem('statusMappings');
      if (mappings) {
        this.statusMappings = JSON.parse(mappings);
      }
    },
    saveStatusMappings() {
      localStorage.setItem('statusMappings', JSON.stringify(this.statusMappings));
    },
    addStatusMapping() {
      if (this.newStatus.id && this.newStatus.name) {
        // Prevent adding system IDs
        if (this.systemStatuses.some(s => s.id === this.newStatus.id)) {
          alert('Status ID already exists in system statuses. Please choose a different ID!');
          return;
        }
        // Prevent adding duplicate IDs
        if (this.statusMappings.some(s => s.id === this.newStatus.id)) {
          alert('Status ID already exists!');
          return;
        }
        this.statusMappings.push({...this.newStatus});
        this.saveStatusMappings();
        this.newStatus.id = '';
        this.newStatus.name = '';
      }
    },
    deleteStatusMapping(index) {
      this.statusMappings.splice(index, 1);
      this.saveStatusMappings();
    },

    setAgentStatus(statusCode) {
      // Only send request if status code is different and allowed
      if (statusCode !== this.agentStatusCode && this.canChangeStatus) {
        this.sendMessage('zcc-agent-status-set-request', {
          id: statusCode
        });
      } else {
        // If not allowed or same status, revert dropdown to current agent status
        this.selectedStatus = this.agentStatusCode;
      }
    },

    // New method for tab switching
    setActiveSettingsTab(tab) {
      this.activeSettingsTab = tab;
    },

    // Helper method to format call duration, handling NaN:NaN from cancelled calls
    formatCallDuration(duration) {
      if (!duration || duration === 'NaN:NaN' || duration.includes('NaN')) {
        return '0:00'; // Show 0:00 for cancelled calls instead of N/A
      }
      return duration;
    },

    // Helper method to format call timestamp, handling empty timestamps from cancelled calls
    formatCallTimestamp(timestamp) {
      if (!timestamp) {
        return 'N/A';
      }

      // Convert to string if it's not already, then check if it's empty
      const timestampStr = String(timestamp);
      if (timestampStr.trim() === '') {
        return 'N/A';
      }

      try {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
        } else {
          return 'N/A';
        }
      } catch (e) {
        return 'N/A';
      }
    },

    // Test function to simulate zcc-resize event (for debugging)
    testHoverResize(width = 848, height = 700) {
      console.log(`Testing hover resize to ${width}x${height}`);
      this.process_zcc_resize({
        widthInPixels: width,
        heightInPixels: height
      });
    },


  },
  beforeMount() {
    this.iframePreCollapseWidth = this.zccSmartEmbedDimensions.widthInPixels; // Initialize with actual starting width

    let origin = location.origin;
    console.debug(origin);

    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);

    // Load settings from localStorage
    this.cluster = localStorage.getItem('cluster') || 'default';
    this.debug = localStorage.getItem('debug') === 'true';
    this.ctiVersion = localStorage.getItem('ctiVersion') || '3';
    this.showAgentStatus = localStorage.getItem('showAgentStatus') === 'true';
    this.showEngagementCount = localStorage.getItem('showEngagementCount') === 'true';
    this.allowUserToChangeStatus = localStorage.getItem('allowUserToChangeStatus') === 'true';
    this.vanitySubdomain = localStorage.getItem('vanitySubdomain') || '';
    this.placement = localStorage.getItem('placement') || 'right-side';
    this.isIframeFloatingVisible = localStorage.getItem('isIframeFloatingVisible') === 'true';

    // Apply conditional settings logic after loading
    // If placement is hover, force show agent status to be on
    if (this.placement === 'hover' && !this.showAgentStatus) {
      this.showAgentStatus = true;
    }

    // If show agent status is off, force allow user to change status to be off
    if (!this.showAgentStatus && this.allowUserToChangeStatus) {
      this.allowUserToChangeStatus = false;
    }

    const savedFloatingPosition = localStorage.getItem('floatingIframePosition');
    if (savedFloatingPosition) {
      this.floatingIframePosition = JSON.parse(savedFloatingPosition);
    } else {
      // Default position for hover mode (right side)
      // Ensure initial width is considered for right-side placement
      const initialWidth = this.zccSmartEmbedDimensions.widthInPixels || 698; // Use default if not set
      this.floatingIframePosition = {x: window.innerWidth - initialWidth - 20, y: 100};
    }

    // Override with query parameters if present
    const queryCluster = params.get("cluster");
    if (queryCluster) {
      this.cluster = queryCluster.toLowerCase();
    }

    const queryDebug = params.get("debug");
    if (queryDebug) {
      this.debug = (queryDebug === "1");
    }

    const queryCtiVersion = params.get("cti_version");
    if (queryCtiVersion) {
      this.ctiVersion = queryCtiVersion;
    }

    // Configure base URL based on cluster
    let baseUrl = '';
    let supportVanitySubdomain = false;

    switch (this.cluster) {
      case 'dev':
        baseUrl = 'https://dev-integration.zoomdev.us/cci/callbar/crm/';
        break;
      case 'qa':
        baseUrl = 'https://zoomdev.us/cci/callbar/crm/';
        break;
      case 'go':
        baseUrl = 'https://go.zoom.us/cci/callbar/crm/';
        break;
      case 'gov':
        baseUrl = 'https://www.zoomgov.com/cci/callbar/crm/';
        supportVanitySubdomain = true;
        break;
      default:
        baseUrl = 'https://www.zoom.us/cci/callbar/crm/';
        supportVanitySubdomain = true;
        break;
    }

    // Add origin parameter if needed
    let includeOrigin = params.get("origin") !== "1";
    if (includeOrigin) {
      baseUrl += '?origin=' + origin;
    }

    // Apply vanity subdomain if provided
    if (this.vanitySubdomain) {
      if (Boolean(this.vanitySubdomain.match(/^[A-Za-z-]+$/))) {
        console.log("using vanity subdomain");
      } else {
        console.log("Invalid Vanity Subdomain.");
        this.vanitySubdomain = null;
      }
    }

    if (this.vanitySubdomain && supportVanitySubdomain && this.cluster === 'go') {
      baseUrl = baseUrl.replace("https://go", "https://" + this.vanitySubdomain);
    } else if (this.vanitySubdomain && supportVanitySubdomain) {
      baseUrl = baseUrl.replace("https://www", "https://" + this.vanitySubdomain);
    }

    this.smartEmbedUrl = baseUrl;

    // Apply CTI version change if needed
    if (this.ctiVersion === "1") {
      this.smartEmbedUrl = this.smartEmbedUrl.replace("/cci/callbar/crm/", "/crm-int/callbar/");
    }

    // Set instructions mode (this was not part of the request, keeping existing logic)
    if (window.localStorage.getItem("smartembedinstructions") == 'false') {
      this.zccSmartHelp = false;
    }

    // Load contacts from localStorage
    this.saveContact();
    const savedContacts = window.localStorage.getItem("contacts");
    if (savedContacts) {
      this.contacts = JSON.parse(savedContacts);
    } else {
      window.localStorage.setItem("contacts", JSON.stringify(this.contacts));
    }

    // Load Disposition and Custom card data
    this.loadDispositionMappings();
    this.loadStatusMappings(); // Load status mappings
    this.loadCustomCardConfig();


    // Load recent calls from localStorage
    const recentCalls = window.localStorage.getItem("recentCalls");
    if (recentCalls) {
      this.recentCalls = JSON.parse(recentCalls);

      // Limit to 100 most recent calls to prevent localstorage issues
      if (this.recentCalls.length > 100) {
        this.recentCalls = this.recentCalls.slice(-100);
        window.localStorage.setItem("recentCalls", JSON.stringify(this.recentCalls));
      }
    }
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage);

    const resizeHandle = document.getElementById('iframe-resize-handle');
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', this.startResize);
    }

    // Ensure hover mode gets the correct initial dimensions
    if (this.placement === 'hover') {
      console.log('Initializing hover mode with dimensions:', this.zccSmartEmbedDimensions);
      // Force a reactivity update to ensure the iframe container gets the correct size
      this.$nextTick(() => {
        console.log('Vue nextTick - hover iframe style should be applied');
      });
    }


    // Make test function available globally for debugging
    window.testHoverResize = (width, height) => this.testHoverResize(width, height);


  },
  beforeUnmount() {
    window.removeEventListener('message', this.receiveMessage);

    const resizeHandle = document.getElementById('iframe-resize-handle');
    if (resizeHandle) {
      resizeHandle.removeEventListener('mousedown', this.startResize);
    }

    // Clean up shield and its listeners if component is destroyed mid-drag
    if (this.isResizing && this.resizeShieldElement) {
      this.resizeShieldElement.removeEventListener('mousemove', this.boundDoResize);
      this.resizeShieldElement.removeEventListener('mouseup', this.boundStopResize);
      if (this.resizeShieldElement.parentNode) {
        document.body.removeChild(this.resizeShieldElement);
      }
      this.resizeShieldElement = null;
      this.isResizing = false; // Ensure state is reset
      const iframe = document.getElementById('zoom-embeddable-phone-iframe');
      if (iframe) {
        iframe.style.pointerEvents = 'auto'; // Restore iframe events
      }
    }

    if (this.isResizing && this.dragShieldElement) { // Clean up drag shield
      this.dragShieldElement.removeEventListener('mousemove', this.boundDoDrag);
      this.dragShieldElement.removeEventListener('mouseup', this.boundStopDrag);
      if (this.dragShieldElement.parentNode) {
        document.body.removeChild(this.dragShieldElement);
      }
      this.dragShieldElement = null;
      this.isResizing = false;
      const iframe = document.getElementById('zoom-embeddable-phone-iframe');
      if (iframe) {
        iframe.style.pointerEvents = 'auto';
      }
    }
  }
}

</script>

<style>
button {
  margin: 4px;
  padding: 6px 12px;
}
</style>
