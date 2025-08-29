"use strict";
(self.webpackChunkcrm = self.webpackChunkcrm || []).push([[169], {
    78169: function(Pe, G, s) {
        var q = this && this.__importDefault || function(d) {
                return d && d.__esModule ? d : {
                    default: d
                }
            }
        ;
        Object.defineProperty(G, "__esModule", {
            value: !0
        }),
            G.SmartEmbedAdapter = void 0;
        const ie = q(s(76709))
            , M = s(56405)
            , y = s(61367)
            , R = s(30824)
            , H = s(19598)
            , u = s(53019)
            , V = s(14535)
            , B = s(1775)
            , i = s(99031)
            , T = s(58127)
            , L = q(s(80646));
        class p {
            client = {};
            static myInstance;
            static adapterSetupDone;
            bus = {};
            sizeConfig = i.edPanelSizeConfig;
            isVideoChannelEnabled = !0;
            isChatChannelEnabled = !0;
            agentInfo;
            getScreenSizes() {
                return this.sizeConfig
            }
            static async getInstance() {
                return p.myInstance || (p.myInstance = new p),
                    p.myInstance
            }
            init = async ({crmBus: e}) => {
                const t = this;
                this.bus = e,
                    this.initWidth(),
                    (0,
                        T.addVendorEvents)(t),
                    (0,
                        T.addEventBusReceiveEvents)()
            }
            ;
            async getAgentInfo() {
                return {}
            }
            resize(e, t) {
                (0,
                    T.sendDataToVendor)(i.CTIToVendorEvents.RESIZE, {
                    widthInPixels: e,
                    heightInPixels: t
                })
            }
            initWidth() {
                (0,
                    R.setInitialDimensions)(this, y.PanelSizes.sm, [y.PanelSizes.md, y.PanelSizes.sm])
            }
            async toggleWidth() {
                (0,
                    R.toggleWidthUtil)(this)
            }
            async addNoteToTicket({comment: e}) {
                const t = {
                    comment: e
                };
                return (0,
                    u.SmartEmbedLogger)("addNoteToTicket", t),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.ADD_NOTE, t),
                    t
            }
            openDialPanel() {
                return (0,
                    u.SmartEmbedLogger)("openDialPanel"),
                    !0
            }
            async findUserByPhoneNumber(e) {
                let t = [];
                try {
                    const l = (0,
                        H.formatE164Number)(e?.trim());
                    t = await this.findByQuery(l)
                } catch (l) {
                    (0,
                        u.SmartEmbedErrorLogger)("Error while finding user by phone", l)
                }
                return (0,
                    u.SmartEmbedLogger)("[findUserByPhoneNumber]", e, t),
                    t
            }
            async findUserByName(e) {
                let t = [];
                try {
                    t = await this.findByQuery(e)
                } catch (l) {
                    (0,
                        u.SmartEmbedErrorLogger)(`User query by name ${e} failed`, l)
                }
                return (0,
                    u.SmartEmbedLogger)("[findUserByName]", e, t),
                    t
            }
            async findUserByEmail(e) {
                let t = [];
                try {
                    t = await this.findByQuery({
                        email: e,
                        type: "email"
                    })
                } catch (l) {
                    (0,
                        u.SmartEmbedErrorLogger)(`User query by email ${e} failed`, l)
                }
                return (0,
                    u.SmartEmbedLogger)("[findUserByEmail]", e, t),
                    t
            }
            async findByQuery(e) {
                let t = [], l;
                try {
                    l = await (0,
                        T.getDataFromVendor)({
                        requestEvent: i.CTIToVendorEvents.CONTACT_SEARCH_REQUEST,
                        requestData: {
                            query: e
                        },
                        expectedResponseEvent: i.VendorToCTIEvents.CONTACT_SEARCH_RESPONSE,
                        defaultValue: []
                    })
                } catch (f) {
                    (0,
                        u.SmartEmbedErrorLogger)("Error in findByQuery", f)
                }
                return typeof l == "object" && Object.keys(l).length > 0 ? t = [l] : Array.isArray(l) && (t = [...l]),
                    (0,
                        u.SmartEmbedLogger)("[findByQuery] result", {
                        searchResult: l,
                        query: e
                    }),
                    t
            }
            static getView(e) {
                switch (e) {
                    case "Engagement":
                        return L.default;
                    default:
                        return null
                }
            }
            async sendCallRecondingUrl(e, t) {
                t && (0,
                    T.sendDataToVendor)(i.CTIToVendorEvents.CALL_RECORDING, {
                    engagementId: e,
                    recordingUrl: t
                })
            }
            async createWrapUpObjectRecord({user: e, objectRecord: t, engagementId: l, relateTo: f, channelUpgradeInfo: I, smartNotes: v}) {
                const S = {
                    objectRecord: t,
                    engagementId: l,
                    relateTo: f,
                    user: e
                };
                return I && (S.channelUpgradeInfo = I),
                Array.isArray(v) && v.length && (S.smartNotes = v),
                    (0,
                        u.SmartEmbedLogger)("createWrapUpObjectRecord", S),
                    S
            }
            async completeEngagement(e) {
                (0,
                    T.sendDataToVendor)(i.CTIToVendorEvents.POST_ENGAGEMENT, {
                    ...e
                })
            }
            async addWrapUpToObject(e) {
                (0,
                    T.sendDataToVendor)(i.CTIToVendorEvents.CALL_LOG, e)
            }
            async screenPop(e) {
                (0,
                    T.sendDataToVendor)(i.CTIToVendorEvents.SCREEN_POP, {
                    id: e
                })
            }
            screenPopUser(e) {
                (0,
                    u.SmartEmbedLogger)("[screenPopUser]", e),
                e?.id && this.screenPop(e.id)
            }
            async setSize(e, t) {
                try {
                    let l, f = y.RightBarAieaWith.CLOSE;
                    t === y.AppWidthState.FULL ? l = y.SidebarWidths.EXPANDED : t === y.AppWidthState.COLLAPSED ? l = y.SidebarWidths.COLLAPSED : t === y.AppWidthState.FULL_WITH_AIEA ? (l = y.SidebarWidths.EXPANDED,
                        f = y.RightBarAieaWith.OPEN) : (l = y.SidebarWidths.COLLAPSED,
                        f = y.RightBarAieaWith.OPEN),
                    e === y.PanelSizes.lg && (l = y.SidebarWidths.COLLAPSED,
                        f = y.RightBarAieaWith.CLOSE),
                        this.resize(this.sizeConfig[e].baseWidth + l + f, this.sizeConfig[e].height),
                        this.bus.emit("set-panel-size", e)
                } catch (l) {
                    (0,
                        u.SmartEmbedErrorLogger)("Error setting size", e, l)
                }
            }
            async handleIncomingCall({incomingPhoneNumber: e, engagementId: t}) {
                (0,
                    u.SmartEmbedLogger)("Handle Incoming Call Called");
                const l = M.QUEUE_CHANNEL_TYPE.VOICE
                    , f = (0,
                    R.getCrmStoreConfig)(l);
                let I = [];
                try {
                    const v = await (0,
                        T.getDataFromVendor)({
                        requestEvent: i.CTIToVendorEvents.INCOMING_PHONE_REQUEST,
                        requestData: {
                            incomingPhoneNumber: e,
                            engagementId: t,
                            channel: V.ChannelTypes.VOICE
                        },
                        expectedResponseEvent: i.VendorToCTIEvents.INCOMING_PHONE_RESPONSE,
                        defaultValue: []
                    });
                    (0,
                        u.SmartEmbedLogger)("handleIncomingCall responseData from vendor ", v),
                        I = v,
                    v?.length <= 1 && f.screenPopEvent === "RINGING" && this.processScreenPop({
                        incomingPhoneNumber: e,
                        engagementId: t
                    })
                } catch (v) {
                    (0,
                        u.SmartEmbedErrorLogger)("Error while getting incoming call data from vendor ", v)
                }
                this.bus.emit("add-users", I, t)
            }
            async handleIncomingVideo({engagementId: e}) {
                (0,
                    u.SmartEmbedLogger)("Handling Video", {
                    engagementId: e
                });
                const t = M.QUEUE_CHANNEL_TYPE.LIVE_VIDEO
                    , l = (0,
                    R.getCrmStoreConfig)(t)
                    , f = ie.default.getters["crm/getEngagementPropertyValue"]({
                    engagementId: e,
                    property: "variables"
                }) || {
                    system: [],
                    custom: []
                }
                    , v = [...f.system, ...f.custom].find(D => D.globalVariableName === "Consumer.email") || "";
                if (v.length <= 0)
                    return;
                const S = v.value;
                if (S) {
                    let D = [];
                    try {
                        const F = await (0,
                            T.getDataFromVendor)({
                            requestEvent: i.CTIToVendorEvents.INCOMING_EMAIL_REQUEST,
                            requestData: {
                                email: S,
                                engagementId: e,
                                channel: V.ChannelTypes.VIDEO
                            },
                            expectedResponseEvent: i.VendorToCTIEvents.INCOMING_EMAIL_RESPONSE,
                            defaultValue: []
                        });
                        D = F,
                        F?.length <= 1 && l.screenPopEvent === "RINGING" && this.processScreenPop({
                            email: S
                        })
                    } catch (F) {
                        (0,
                            u.SmartEmbedErrorLogger)(" Error while getting incoming call data from vendor ", F)
                    }
                    this.bus.emit("add-users", D, e)
                }
                this.openDialPanel()
            }
            async handleIncomingWebChat({email: e, engagementId: t}) {
                (0,
                    u.SmartEmbedLogger)("Handling Web Chat", {
                    email: e,
                    engagementId: t
                });
                const l = M.QUEUE_CHANNEL_TYPE.CHAT
                    , f = (0,
                    R.getCrmStoreConfig)(l);
                if (e) {
                    let I = [];
                    try {
                        const v = await (0,
                            T.getDataFromVendor)({
                            requestEvent: i.CTIToVendorEvents.INCOMING_EMAIL_REQUEST,
                            requestData: {
                                email: e,
                                engagementId: t,
                                channel: V.ChannelTypes.CHAT
                            },
                            expectedResponseEvent: i.VendorToCTIEvents.INCOMING_EMAIL_RESPONSE,
                            defaultValue: []
                        });
                        I = v,
                        v?.length <= 1 && f.screenPopEvent === "RINGING" && this.processScreenPop({
                            email: e
                        })
                    } catch (v) {
                        (0,
                            u.SmartEmbedErrorLogger)(" Error while getting incoming call data from vendor ", v)
                    }
                    this.bus.emit("add-users", I, t)
                }
                this.openDialPanel()
            }
            async handleIncomingSmsChat({incomingPhoneNumber: e, engagementId: t}) {
                (0,
                    u.SmartEmbedLogger)("Handling incoming SMS", e, t);
                const l = M.QUEUE_CHANNEL_TYPE.SMS
                    , f = (0,
                    R.getCrmStoreConfig)(l);
                let I = [];
                try {
                    const v = await (0,
                        T.getDataFromVendor)({
                        requestEvent: i.CTIToVendorEvents.INCOMING_PHONE_REQUEST,
                        requestData: {
                            incomingPhoneNumber: e,
                            engagementId: t,
                            channel: V.ChannelTypes.SMS
                        },
                        expectedResponseEvent: i.VendorToCTIEvents.INCOMING_PHONE_RESPONSE,
                        defaultValue: []
                    });
                    (0,
                        u.SmartEmbedLogger)("handleIncomingSmsChat responseData from vendor ", v),
                        I = v,
                    v?.length <= 1 && f.screenPopEvent === "RINGING" && this.processScreenPop({
                        incomingPhoneNumber: e,
                        engagementId: t
                    })
                } catch (v) {
                    (0,
                        u.SmartEmbedErrorLogger)("Error while getting incoming call data from vendor ", v)
                }
                this.bus.emit("add-users", I, t)
            }
            processScreenPop({incomingPhoneNumber: e, email: t}) {
                const l = e || t;
                (0,
                    u.SmartEmbedLogger)("processScreenPop", e, t),
                l && this.screenPop(l)
            }
            async processWrapup(e) {
                const {processWrapup: t} = await (0,
                    B.useSmartEmbedWrapup)(e);
                await t()
            }
            async onDialOut(e) {
                if (!e?.phone) {
                    this.sendError({
                        code: "no-phone",
                        message: "Phone number is required"
                    });
                    return
                }
                return this.openDialPanel(),
                    this.bus.emit("voice-dialout", e, e.phone),
                    Promise.resolve()
            }
            convertReservationToCallData(e) {
                const t = {};
                e.channel === "voice" || e.channel,
                    (0,
                        u.SmartEmbedLogger)(e, t)
            }
            async setStatus(e, t, l) {
                this.notifyAgentStatus(e, t, l)
            }
            ringing(e) {
                (0,
                    u.SmartEmbedLogger)("Voice Ringing"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.CALL_RINGING, e)
            }
            callAccepted(e) {
                (0,
                    u.SmartEmbedLogger)("Call Accepted"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.CALL_CONNECTED, e)
            }
            obCallStarted(e) {
                (0,
                    u.SmartEmbedLogger)("Outbound call Started"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.OB_CALL_STARTED, {
                        engagementId: e?.engagementId,
                        from: e?.callFrom,
                        to: e?.callTo,
                        queueName: e?.queueName,
                        startTs: Date.now()
                    })
            }
            callTransfer(e) {
                (0,
                    u.SmartEmbedLogger)("Call Transferred"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.CALL_TRANSFER, {
                        content: e,
                        name: i.CTIToVendorEvents.CALL_TRANSFER
                    })
            }
            callHangup(e) {
                const {engagementId: t} = e?.task?.attributes || {};
                (0,
                    u.SmartEmbedLogger)("Call Hangup", t),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.CALL_ENDED, {
                        completeTs: Date.now(),
                        engagementId: t
                    })
            }
            callEnded(e) {
                const {reservation: t, task: l} = e || {};
                let {hangupCause: f} = t?.task?.attributes || {}
                    , I = l?.engagementId;
                (0,
                    u.SmartEmbedLogger)("Call Ended", f, I),
                typeof f == "string" && f.startsWith("crm-") && (f = f.slice(4));
                const v = Object.values(i.OUTBOUND_NOT_CONNECTED_REASONS)
                    , S = {
                    engagementId: I
                };
                let D = "";
                switch (f) {
                    case i.OUTBOUND_NOT_CONNECTED_REASONS.OUTBOUND_CALL_CANCELLED:
                        D = "Outbound call cancelled by Agent.";
                        break;
                    case i.OUTBOUND_NOT_CONNECTED_REASONS.OUTBOUND_CALL_AGENT_FAILED:
                        D = "Agent failed to connect.";
                        break;
                    case i.OUTBOUND_NOT_CONNECTED_REASONS.OUTBOUND_CALL_CUSTOMER_FAILED:
                        D = "Consumer wasn\u2019t able to answer your call. Try again later.";
                        break;
                    case i.OUTBOUND_NOT_CONNECTED_REASONS.OUTBOUND_CALL_CUSTOMER_UNREACHABLE:
                        D = "Couldn\u2019t reach the consumer. Please try again later.";
                        break;
                    case i.OUTBOUND_NOT_CONNECTED_REASONS.OUTBOUND_CALL_CONSUMER_NOT_ANSWER:
                        D = "The number you have dialed is not available, please try your call again later.";
                        break;
                    case i.OUTBOUND_NOT_CONNECTED_REASONS.OUTBOUND_CALL_CONSUMER_IS_BUSY:
                        D = "The number you have dialed is busy, please try your call again later.";
                        break;
                    case i.OUTBOUND_NOT_CONNECTED_REASONS.OUTBOUND_CALL_CONSUMER_DECLINES_CALL:
                        D = "The number you have dialed has rejected your call.";
                        break;
                    case i.OUTBOUND_NOT_CONNECTED_REASONS.OUTBOUND_CALL_INVALID_NUMBER:
                        D = "The number you have dialed does not exist or is no longer in service.";
                        break;
                    case i.OUTBOUND_NOT_CONNECTED_REASONS.OUTBOUND_CALL_DEFAULT_HANGUP_CATEGORY:
                        D = "The call to the number dialed cannot be completed at this time. Please check the phone number and try again later.";
                        break
                }
                v.includes(f) && (S.reasonCode = f,
                    S.message = D,
                    this.obCallNotConnected(S))
            }
            obCallNotConnected(e) {
                (0,
                    u.SmartEmbedLogger)("Outbound call not connected"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.OUTBOUND_NOT_CONNECTED, e)
            }
            inboundCallNotConnected(e) {
                const {reason: t, data: l} = e;
                (0,
                    u.SmartEmbedLogger)("Inbound call not connected", e);
                const {task: f} = l || {}
                    , I = f?.attributes?.engagementId
                    , v = Object.values(i.INBOUND_NOT_CONNECTED_REASONS);
                let S = "";
                switch (t) {
                    case i.INBOUND_NOT_CONNECTED_REASONS.CANCELLED:
                        S = "Consumer hung up.";
                        break;
                    case i.INBOUND_NOT_CONNECTED_REASONS.REJECTED:
                        S = "Call rejected by agent.";
                        break;
                    case i.INBOUND_NOT_CONNECTED_REASONS.RESCINDED:
                        S = "Call answered by another agent.";
                        break;
                    case i.INBOUND_NOT_CONNECTED_REASONS.TIMEOUT:
                        S = "Call missed.";
                        break
                }
                v.includes(t) && (0,
                    T.sendDataToVendor)(i.CTIToVendorEvents.INBOUND_NOT_CONNECTED, {
                    reasonCode: t,
                    message: S,
                    engagementId: I
                })
            }
            videoRinging(e) {
                (0,
                    u.SmartEmbedLogger)("Video Ringing"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.VIDEO_RINGING, {
                        queueId: e?.queueId,
                        queueName: e?.queueName,
                        engagementId: e?.engagementId,
                        customerEmail: e?.from?.email
                    })
            }
            videoStarted(e) {
                (0,
                    u.SmartEmbedLogger)("Video Started"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.VIDEO_STARTED, {
                        engagementId: e.engagementId,
                        createTs: e.createTs
                    })
            }
            videoEnded(e) {
                (0,
                    u.SmartEmbedLogger)("Video Ended"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.VIDEO_ENDED, {
                        completeTs: e.completeTs,
                        engagementId: e.engagementId
                    })
            }
            videoParticipantInfo(e) {
                (0,
                    T.sendDataToVendor)(i.CTIToVendorEvents.VIDEO_PARTICIPANT_INFO, {
                    participantInfo: e,
                    engagementId: e.engagementId
                })
            }
            chatRinging(e) {
                (0,
                    u.SmartEmbedLogger)("Chat Ringing"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.CHAT_RINGING, {
                        queueId: e?.queueId,
                        queueName: e?.queueName,
                        engagementId: e?.engagementId,
                        customerName: e?.from?.displayName,
                        customerEmail: e?.from?.email
                    })
            }
            chatStarted(e) {
                (0,
                    u.SmartEmbedLogger)("Chat Started"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.CHAT_STARTED, {
                        engagementId: e.engagementId,
                        createTs: e.createTs
                    })
            }
            chatEnded(e) {
                (0,
                    u.SmartEmbedLogger)("Chat Ended"),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.CHAT_ENDED, {
                        completeTs: e.completeTs,
                        engagementId: e.engagementId
                    })
            }
            smsRinging(e) {
                (0,
                    u.SmartEmbedLogger)("SMS ringing", e),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.SMS_RINGING, {
                        queueId: e?.queueId,
                        queueName: e?.queueName,
                        engagementId: e?.engagementId,
                        customerName: e?.from?.displayName,
                        customerEmail: e?.from?.email,
                        incomingPhoneNumber: e?.incomingPhoneNumber
                    })
            }
            smsStarted(e) {
                (0,
                    u.SmartEmbedLogger)("SMS Started", e),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.SMS_STARTED, {
                        engagementId: e.engagementId,
                        createTs: e.createTs
                    })
            }
            smsEnded(e) {
                (0,
                    u.SmartEmbedLogger)("SMS Ended", e),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.SMS_ENDED, {
                        completeTs: e.completeTs,
                        engagementId: e.engagementId
                    })
            }
            notifyAgentStatus(e, t, l) {
                (0,
                    u.SmartEmbedLogger)("Notify vendor of agent status", {
                    status: e,
                    parent: l
                });
                const f = {
                    statusCode: e,
                    parentStatusCode: t
                };
                switch (e) {
                    case M.STATUS_MAPPING.READY:
                        f.status = "Ready";
                        break;
                    case M.STATUS_MAPPING.OCCUPIED:
                        f.status = "Occupied";
                        break;
                    case M.STATUS_MAPPING.OFFLINE:
                        f.status = "Offline";
                        break;
                    default:
                        e === "2" ? f.status = "Not Ready" : t === "2" && (f.status = "Not Ready",
                        l?.subName && (f.subReason = l?.subName))
                }
                (0,
                    T.sendDataToVendor)(i.CTIToVendorEvents.AGENT_STATUS_NOTIFY, f)
            }
            sendError({code: e, message: t, requestId: l}) {
                const f = {
                    code: e,
                    message: t
                };
                l && (f.requestId = l),
                    (0,
                        T.sendDataToVendor)(i.CTIToVendorEvents.ERROR, f)
            }
        }
        G.SmartEmbedAdapter = p
    },
    1775: function(Pe, G, s) {
        var q = this && this.__createBinding || (Object.create ? function(L, p, d, e) {
                    e === void 0 && (e = d);
                    var t = Object.getOwnPropertyDescriptor(p, d);
                    (!t || ("get"in t ? !p.__esModule : t.writable || t.configurable)) && (t = {
                        enumerable: !0,
                        get: function() {
                            return p[d]
                        }
                    }),
                        Object.defineProperty(L, e, t)
                }
                : function(L, p, d, e) {
                    e === void 0 && (e = d),
                        L[e] = p[d]
                }
        )
            , ie = this && this.__setModuleDefault || (Object.create ? function(L, p) {
                    Object.defineProperty(L, "default", {
                        enumerable: !0,
                        value: p
                    })
                }
                : function(L, p) {
                    L.default = p
                }
        )
            , M = this && this.__importStar || function() {
            var L = function(p) {
                return L = Object.getOwnPropertyNames || function(d) {
                    var e = [];
                    for (var t in d)
                        Object.prototype.hasOwnProperty.call(d, t) && (e[e.length] = t);
                    return e
                }
                    ,
                    L(p)
            };
            return function(p) {
                if (p && p.__esModule)
                    return p;
                var d = {};
                if (p != null)
                    for (var e = L(p), t = 0; t < e.length; t++)
                        e[t] !== "default" && q(d, p, e[t]);
                return ie(d, p),
                    d
            }
        }();
        Object.defineProperty(G, "__esModule", {
            value: !0
        }),
            G.useSmartEmbedWrapup = void 0;
        const y = M(s(76709))
            , R = s(56405)
            , H = s(2117)
            , u = s(33332)
            , V = s(35878)
            , B = s(30824)
            , i = s(53019)
            , T = async L => {
                const p = await (0,
                        V.getCRMInstance)()
                    , d = L || (0,
                        B.getCurrentActiveTask)() || {}
                    , e = d?.engagementId
                    , t = y.default.getters["crm/getEngagementPropertyValue"]({
                        engagementId: e,
                        property: "contactsMap"
                    }) || {}
                    , l = y.default.getters["crm/getEngagementPropertyValue"]({
                        engagementId: e,
                        property: "selectedEntityType"
                    }) || null
                    , f = y.default.getters["crm/getEngagementPropertyValue"]({
                        engagementId: e,
                        property: "selectedDisposition"
                    }) || {}
                    , I = y.default.getters["crm/getEngagementPropertyValue"]({
                        engagementId: e,
                        property: "skipDisposition"
                    }) || !1
                    , v = y.default.getters["crm/getEngagementPropertyValue"]({
                        engagementId: e,
                        property: "isVoiceManuallyRecorded"
                    }) || !1
                    , S = y.default.getters["crm/getEngagementPropertyValue"]({
                        engagementId: e,
                        property: "isAutomaticCallRecordingEnabled"
                    }) || !1
                    , D = t.selectedUser || {}
                    , F = (0,
                        B.getChannelType)(d.tkType)
                    , Ie = !!(0,
                        B.getCrmStoreConfig)(F)?.callLogConfigs?.autoUpdateCallURL
                    , ue = async () => {
                        const ee = (0,
                            B.getCurrentEngagementNotes)(e)
                            , te = p?.agentInfo?.agentId
                            , ne = y.default.getters.user;
                        if (!Array.isArray(ee))
                            return;
                        const $ = ee.filter(P => P.createBy === ne?.id)?.sort( (P, Q) => new Date(P.createTime).valueOf() - new Date(Q.createTime).valueOf())
                            , _ = []
                            , ge = l || "";
                        for (let P = 0; P < $.length; P++) {
                            const Q = await p?.addNoteToTicket({
                                comment: $[P]?.notes,
                                agentId: te,
                                relateTo: ge
                            });
                            _.push(Q)
                        }
                        return _
                    }
                ;
                return {
                    processWrapup: async () => {
                        const ee = p?.agentInfo?.agentId
                            , te = l || ""
                            , ne = (0,
                            B.getCurrentEngagementNotes)(e)
                            , $ = y.default.getters.user
                            , _ = ne.filter(h => h.createBy === $?.id)?.sort( (h, C) => new Date(h.createTime).valueOf() - new Date(C.createTime).valueOf())
                            , P = _.filter(h => !!h.type && h.modifyTime === h.createTime).map(h => h.notes)
                            , Q = _.map(h => h.notes);
                        (0,
                            i.SmartEmbedLogger)("processWrapup saveNotes ", {
                            notes: Q,
                            smartNotes: P
                        }),
                            await ue();
                        const me = d?.autoCloseInfo?.defaultDisposition || y.storeUtils.crm.getDefaultDisposition()
                            , fe = me?.name || "-"
                            , Ee = d?.autoCloseInfo?.selectedDispositionName
                            , re = (d?.completeTs - d?.acceptTs) / 1e3
                            , he = `${Math.floor(re / 60)}:${Math.round(re % 60) < 10 ? `0${Math.round(re % 60)}` : Math.round(re % 60)}`
                            , ce = encodeURI(window.location.hostname)
                            , Oe = d?.callId ? `https://${ce}/cci/multi/recording-cli?sid=${d.callId}` : ""
                            , le = (v || S) && Ie
                            , oe = le ? Oe : ""
                            , pe = d.direction === "outbound" ? d?.from : d?.to
                            , Te = I ? "" : Ee || f?.label || fe
                            , Ge = {
                            callType: d?.direction === "inbound" || d?.direction === "IN_BOUND" ? "inbound" : "outbound",
                            from: d?.from,
                            to: d?.to,
                            callDuration: he,
                            callStartTime: d?.acceptTs ? new Date(d?.acceptTs) : "",
                            callEndTime: d?.completeTs ? new Date(d?.completeTs) : "",
                            callQueue: d?.queueName || "",
                            agentExtension: pe || "",
                            agentName: $?.name || "",
                            wrapUpTimeDuration: d?.completeTs ? `${(0,
                                R.tsToHHMMSS)(Math.abs(Date.now() - d?.completeTs))}` : "",
                            notes: Q,
                            dispositionCode: Te,
                            type: d?.tkType
                        };
                        let ae = "";
                        const K = (0,
                            B.getChannelType)(d.tkType);
                        let de = K === R.QUEUE_CHANNEL_TYPE.CHAT || K === R.QUEUE_CHANNEL_TYPE.SMS
                            , ve = K;
                        if (!de && K !== null) {
                            const {originalChatChannel: h} = await (0,
                                H.detectSource)({
                                engagementId: d.engagementId,
                                currentChannel: K
                            });
                            h && (de = !0,
                                ve = h)
                        }
                        de && (ae = await (0,
                            u.generateTranscript)(L.engagementId, ve === R.QUEUE_CHANNEL_TYPE.CHAT)),
                        ae && await p?.addNoteToTicket({
                            comment: ae,
                            agentId: ee,
                            relateTo: te
                        }),
                            await p?.completeEngagement({
                                engagementId: e,
                                dispositionCode: Te
                            });
                        const g = (0,
                            B.getUpgradeInfo)();
                        (0,
                            i.SmartEmbedLogger)("processWrapup data", {
                            defaultDisposition: me,
                            selectedDisposition: f,
                            autoCloseSelectedDispositionName: Ee,
                            autoCloseInfo: d?.autoCloseInfo,
                            channelUpgradeInformation: g,
                            chatTranscript: ae,
                            callRecordingURL: oe,
                            shouldUpdateRecordingURL: le
                        });
                        const a = {
                            objectRecord: Ge,
                            engagementId: e,
                            relateTo: te,
                            channelUpgradeInfo: g,
                            smartNotes: P
                        };
                        D.name && (a.user = D);
                        const N = await p?.createWrapUpObjectRecord(a);
                        await p?.addWrapUpToObject(N),
                        le && await p?.sendCallRecondingUrl(e, oe)
                    }
                }
            }
        ;
        G.useSmartEmbedWrapup = T
    },
    80646: (Pe, G, s) => {
        s.r(G),
            s.d(G, {
                default: () => ve
            });
        var q = function() {
            var a = this
                , N = a._self._c;
            return N("CurrentSession", a._g(a._b({
                ref: "session",
                attrs: {
                    disposition: a.disposition
                },
                on: {
                    dispositionChange: a.handleDisposition
                }
            }, "CurrentSession", a.$attrs, !1), a.$listeners))
        }
            , ie = []
            , M = s(83537)
            , y = s.n(M)
            , R = s(61849)
            , H = s.n(R)
            , u = s(83030)
            , V = s.n(u)
            , B = s(65888)
            , i = s.n(B)
            , T = s(34187)
            , L = s.n(T)
            , p = s(44987)
            , d = s.n(p)
            , e = s(73007)
            , t = s.n(e)
            , l = s(23716)
            , f = s.n(l)
            , I = s(2208)
            , v = s.n(I)
            , S = s(39084)
            , D = s.n(S)
            , F = s(81352)
            , we = s.n(F)
            , Ie = s(84653)
            , ue = s.n(Ie)
            , Me = s(59814)
            , ee = s.n(Me)
            , te = s(89099)
            , ne = s.n(te)
            , $ = s(34622)
            , _ = s.n($)
            , ge = s(27785)
            , P = s.n(ge)
            , Q = s(5339)
            , me = s.n(Q)
            , fe = s(53578)
            , Ee = s(8880)
            , re = s(35878);
        function Y(g) {
            "@babel/helpers - typeof";
            return Y = typeof V() == "function" && typeof me() == "symbol" ? function(a) {
                    return typeof a
                }
                : function(a) {
                    return a && typeof V() == "function" && a.constructor === V() && a !== V().prototype ? "symbol" : typeof a
                }
                ,
                Y(g)
        }
        function he(g, a) {
            var N = we()(g);
            if (ue()) {
                var h = ue()(g);
                a && (h = ee()(h).call(h, function(C) {
                    return ne()(g, C).enumerable
                })),
                    N.push.apply(N, h)
            }
            return N
        }
        function ce(g) {
            for (var a = 1; a < arguments.length; a++) {
                var N, h, C = arguments[a] != null ? arguments[a] : {};
                a % 2 ? d()(N = he(Object(C), !0)).call(N, function(A) {
                    Oe(g, A, C[A])
                }) : _() ? P()(g, _()(C)) : d()(h = he(Object(C))).call(h, function(A) {
                    H()(g, A, ne()(C, A))
                })
            }
            return g
        }
        function Oe(g, a, N) {
            return (a = Be(a))in g ? H()(g, a, {
                value: N,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : g[a] = N,
                g
        }
        function Be(g) {
            var a = le(g, "string");
            return Y(a) == "symbol" ? a : a + ""
        }
        function le(g, a) {
            if (Y(g) != "object" || !g)
                return g;
            var N = g[D()];
            if (N !== void 0) {
                var h = N.call(g, a || "default");
                if (Y(h) != "object")
                    return h;
                throw new TypeError("@@toPrimitive must return a primitive value.")
            }
            return (a === "string" ? String : Number)(g)
        }
        function oe() {
            "use strict";
            /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
            oe = function() {
                return a
            }
            ;
            var g, a = {}, N = Object.prototype, h = N.hasOwnProperty, C = H() || function(o, n, r) {
                o[n] = r.value
            }
                , A = typeof V() == "function" ? V() : {}, W = A.iterator || "@@iterator", X = A.asyncIterator || "@@asyncIterator", j = A.toStringTag || "@@toStringTag";
            function w(o, n, r) {
                return H()(o, n, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }),
                    o[n]
            }
            try {
                w({}, "")
            } catch {
                w = function(r, c, E) {
                    return r[c] = E
                }
            }
            function We(o, n, r, c) {
                var E = n && n.prototype instanceof Le ? n : Le
                    , m = i()(E.prototype)
                    , O = new Re(c || []);
                return C(m, "_invoke", {
                    value: Qe(o, r, O)
                }),
                    m
            }
            function De(o, n, r) {
                try {
                    return {
                        type: "normal",
                        arg: o.call(n, r)
                    }
                } catch (c) {
                    return {
                        type: "throw",
                        arg: c
                    }
                }
            }
            a.wrap = We;
            var je = "suspendedStart"
                , _e = "suspendedYield"
                , xe = "executing"
                , ye = "completed"
                , x = {};
            function Le() {}
            function Ne() {}
            function J() {}
            var be = {};
            w(be, W, function() {
                return this
            });
            var Ae = L()
                , Ce = Ae && Ae(Ae(Ve([])));
            Ce && Ce !== N && h.call(Ce, W) && (be = Ce);
            var se = J.prototype = Le.prototype = i()(be);
            function He(o) {
                var n;
                d()(n = ["next", "throw", "return"]).call(n, function(r) {
                    w(o, r, function(c) {
                        return this._invoke(r, c)
                    })
                })
            }
            function Se(o, n) {
                function r(E, m, O, b) {
                    var U = De(o[E], o, m);
                    if (U.type !== "throw") {
                        var Z = U.arg
                            , z = Z.value;
                        return z && Y(z) == "object" && h.call(z, "__await") ? n.resolve(z.__await).then(function(k) {
                            r("next", k, O, b)
                        }, function(k) {
                            r("throw", k, O, b)
                        }) : n.resolve(z).then(function(k) {
                            Z.value = k,
                                O(Z)
                        }, function(k) {
                            return r("throw", k, O, b)
                        })
                    }
                    b(U.arg)
                }
                var c;
                C(this, "_invoke", {
                    value: function(m, O) {
                        function b() {
                            return new n(function(U, Z) {
                                    r(m, O, U, Z)
                                }
                            )
                        }
                        return c = c ? c.then(b, b) : b()
                    }
                })
            }
            function Qe(o, n, r) {
                var c = je;
                return function(E, m) {
                    if (c === xe)
                        throw Error("Generator is already running");
                    if (c === ye) {
                        if (E === "throw")
                            throw m;
                        return {
                            value: g,
                            done: !0
                        }
                    }
                    for (r.method = E,
                             r.arg = m; ; ) {
                        var O = r.delegate;
                        if (O) {
                            var b = Fe(O, r);
                            if (b) {
                                if (b === x)
                                    continue;
                                return b
                            }
                        }
                        if (r.method === "next")
                            r.sent = r._sent = r.arg;
                        else if (r.method === "throw") {
                            if (c === je)
                                throw c = ye,
                                    r.arg;
                            r.dispatchException(r.arg)
                        } else
                            r.method === "return" && r.abrupt("return", r.arg);
                        c = xe;
                        var U = De(o, n, r);
                        if (U.type === "normal") {
                            if (c = r.done ? ye : _e,
                            U.arg === x)
                                continue;
                            return {
                                value: U.arg,
                                done: r.done
                            }
                        }
                        U.type === "throw" && (c = ye,
                            r.method = "throw",
                            r.arg = U.arg)
                    }
                }
            }
            function Fe(o, n) {
                var r = n.method
                    , c = o.iterator[r];
                if (c === g)
                    return n.delegate = null,
                    r === "throw" && o.iterator.return && (n.method = "return",
                        n.arg = g,
                        Fe(o, n),
                    n.method === "throw") || r !== "return" && (n.method = "throw",
                        n.arg = new TypeError("The iterator does not provide a '" + r + "' method")),
                        x;
                var E = De(c, o.iterator, n.arg);
                if (E.type === "throw")
                    return n.method = "throw",
                        n.arg = E.arg,
                        n.delegate = null,
                        x;
                var m = E.arg;
                return m ? m.done ? (n[o.resultName] = m.value,
                    n.next = o.nextLoc,
                n.method !== "return" && (n.method = "next",
                    n.arg = g),
                    n.delegate = null,
                    x) : m : (n.method = "throw",
                    n.arg = new TypeError("iterator result is not an object"),
                    n.delegate = null,
                    x)
            }
            function Ye(o) {
                var n = {
                    tryLoc: o[0]
                };
                1 in o && (n.catchLoc = o[1]),
                2 in o && (n.finallyLoc = o[2],
                    n.afterLoc = o[3]),
                    this.tryEntries.push(n)
            }
            function Ue(o) {
                var n = o.completion || {};
                n.type = "normal",
                    delete n.arg,
                    o.completion = n
            }
            function Re(o) {
                this.tryEntries = [{
                    tryLoc: "root"
                }],
                    d()(o).call(o, Ye, this),
                    this.reset(!0)
            }
            function Ve(o) {
                if (o || o === "") {
                    var n = o[W];
                    if (n)
                        return n.call(o);
                    if (typeof o.next == "function")
                        return o;
                    if (!isNaN(o.length)) {
                        var r = -1
                            , c = function E() {
                            for (; ++r < o.length; )
                                if (h.call(o, r))
                                    return E.value = o[r],
                                        E.done = !1,
                                        E;
                            return E.value = g,
                                E.done = !0,
                                E
                        };
                        return c.next = c
                    }
                }
                throw new TypeError(Y(o) + " is not iterable")
            }
            return Ne.prototype = J,
                C(se, "constructor", {
                    value: J,
                    configurable: !0
                }),
                C(J, "constructor", {
                    value: Ne,
                    configurable: !0
                }),
                Ne.displayName = w(J, j, "GeneratorFunction"),
                a.isGeneratorFunction = function(o) {
                    var n = typeof o == "function" && o.constructor;
                    return !!n && (n === Ne || (n.displayName || n.name) === "GeneratorFunction")
                }
                ,
                a.mark = function(o) {
                    return t() ? t()(o, J) : (o.__proto__ = J,
                        w(o, j, "GeneratorFunction")),
                        o.prototype = i()(se),
                        o
                }
                ,
                a.awrap = function(o) {
                    return {
                        __await: o
                    }
                }
                ,
                He(Se.prototype),
                w(Se.prototype, X, function() {
                    return this
                }),
                a.AsyncIterator = Se,
                a.async = function(o, n, r, c, E) {
                    E === void 0 && (E = y());
                    var m = new Se(We(o, n, r, c),E);
                    return a.isGeneratorFunction(n) ? m : m.next().then(function(O) {
                        return O.done ? O.value : m.next()
                    })
                }
                ,
                He(se),
                w(se, j, "Generator"),
                w(se, W, function() {
                    return this
                }),
                w(se, "toString", function() {
                    return "[object Generator]"
                }),
                a.keys = function(o) {
                    var n = Object(o)
                        , r = [];
                    for (var c in n)
                        r.push(c);
                    return f()(r).call(r),
                        function E() {
                            for (; r.length; ) {
                                var m = r.pop();
                                if (m in n)
                                    return E.value = m,
                                        E.done = !1,
                                        E
                            }
                            return E.done = !0,
                                E
                        }
                }
                ,
                a.values = Ve,
                Re.prototype = {
                    constructor: Re,
                    reset: function(n) {
                        var r;
                        if (this.prev = 0,
                            this.next = 0,
                            this.sent = this._sent = g,
                            this.done = !1,
                            this.delegate = null,
                            this.method = "next",
                            this.arg = g,
                            d()(r = this.tryEntries).call(r, Ue),
                            !n)
                            for (var c in this)
                                c.charAt(0) === "t" && h.call(this, c) && !isNaN(+v()(c).call(c, 1)) && (this[c] = g)
                    },
                    stop: function() {
                        this.done = !0;
                        var n = this.tryEntries[0].completion;
                        if (n.type === "throw")
                            throw n.arg;
                        return this.rval
                    },
                    dispatchException: function(n) {
                        if (this.done)
                            throw n;
                        var r = this;
                        function c(Z, z) {
                            return O.type = "throw",
                                O.arg = n,
                                r.next = Z,
                            z && (r.method = "next",
                                r.arg = g),
                                !!z
                        }
                        for (var E = this.tryEntries.length - 1; E >= 0; --E) {
                            var m = this.tryEntries[E]
                                , O = m.completion;
                            if (m.tryLoc === "root")
                                return c("end");
                            if (m.tryLoc <= this.prev) {
                                var b = h.call(m, "catchLoc")
                                    , U = h.call(m, "finallyLoc");
                                if (b && U) {
                                    if (this.prev < m.catchLoc)
                                        return c(m.catchLoc, !0);
                                    if (this.prev < m.finallyLoc)
                                        return c(m.finallyLoc)
                                } else if (b) {
                                    if (this.prev < m.catchLoc)
                                        return c(m.catchLoc, !0)
                                } else {
                                    if (!U)
                                        throw Error("try statement without catch or finally");
                                    if (this.prev < m.finallyLoc)
                                        return c(m.finallyLoc)
                                }
                            }
                        }
                    },
                    abrupt: function(n, r) {
                        for (var c = this.tryEntries.length - 1; c >= 0; --c) {
                            var E = this.tryEntries[c];
                            if (E.tryLoc <= this.prev && h.call(E, "finallyLoc") && this.prev < E.finallyLoc) {
                                var m = E;
                                break
                            }
                        }
                        m && (n === "break" || n === "continue") && m.tryLoc <= r && r <= m.finallyLoc && (m = null);
                        var O = m ? m.completion : {};
                        return O.type = n,
                            O.arg = r,
                            m ? (this.method = "next",
                                this.next = m.finallyLoc,
                                x) : this.complete(O)
                    },
                    complete: function(n, r) {
                        if (n.type === "throw")
                            throw n.arg;
                        return n.type === "break" || n.type === "continue" ? this.next = n.arg : n.type === "return" ? (this.rval = this.arg = n.arg,
                            this.method = "return",
                            this.next = "end") : n.type === "normal" && r && (this.next = r),
                            x
                    },
                    finish: function(n) {
                        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                            var c = this.tryEntries[r];
                            if (c.finallyLoc === n)
                                return this.complete(c.completion, c.afterLoc),
                                    Ue(c),
                                    x
                        }
                    },
                    catch: function(n) {
                        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                            var c = this.tryEntries[r];
                            if (c.tryLoc === n) {
                                var E = c.completion;
                                if (E.type === "throw") {
                                    var m = E.arg;
                                    Ue(c)
                                }
                                return m
                            }
                        }
                        throw Error("illegal catch attempt")
                    },
                    delegateYield: function(n, r, c) {
                        return this.delegate = {
                            iterator: Ve(n),
                            resultName: r,
                            nextLoc: c
                        },
                        this.method === "next" && (this.arg = g),
                            x
                    }
                },
                a
        }
        function pe(g, a, N, h, C, A, W) {
            try {
                var X = g[A](W)
                    , j = X.value
            } catch (w) {
                return void N(w)
            }
            X.done ? a(j) : y().resolve(j).then(h, C)
        }
        function Te(g) {
            return function() {
                var a = this
                    , N = arguments;
                return new (y())(function(h, C) {
                        var A = g.apply(a, N);
                        function W(j) {
                            pe(A, h, C, W, X, "next", j)
                        }
                        function X(j) {
                            pe(A, h, C, W, X, "throw", j)
                        }
                        W(void 0)
                    }
                )
            }
        }
        const ae = {
            name: "SmartEmbedEngagement",
            components: {
                CurrentSession: Ee.default
            },
            data: function() {
                return {
                    client: null,
                    contactsOrLeads: {},
                    relateTo: {}
                }
            },
            props: {},
            mounted: function() {
                var a = this;
                return Te(oe().mark(function N() {
                    return oe().wrap(function(C) {
                        for (; ; )
                            switch (C.prev = C.next) {
                                case 0:
                                    return C.next = 2,
                                        (0,
                                            re.getCRMInstance)();
                                case 2:
                                    a.client = C.sent;
                                case 3:
                                case "end":
                                    return C.stop()
                            }
                    }, N)
                }))()
            },
            computed: ce(ce(ce({}, (0,
                fe.mapGetters)("sessionPanels", ["currentActiveTask"])), (0,
                fe.mapGetters)("crm", ["getContactsList", "getEngagementPropertyValue", "getEngagement"])), {}, {
                disposition: function() {
                    var a = this.getEngagementPropertyValue({
                        engagementId: this.engagementId,
                        property: "selectedDisposition"
                    });
                    return a?.value
                }
            }),
            methods: {
                handleDisposition: function(a) {
                    this.$store.commit("crm/setEngagementProperty", {
                        engagementId: this.engagementId,
                        property: "selectedDisposition",
                        value: {
                            label: a.label,
                            value: a.value
                        }
                    })
                }
            },
            deactivated: function() {}
        };
        var K = s(50855)
            , de = (0,
            K.A)(ae, q, ie, !1, null, "16fdd703", null);
        const ve = de.exports
    }
}]);
