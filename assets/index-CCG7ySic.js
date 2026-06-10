(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=Object.freeze({appTitle:`한화손보 AI 생체정보 기반 상품 추천`,heroTitle:`얼굴 인식으로 내게 맞는 상품을 확인하세요`,heroBody:`추정 나이와 성별을 확인하면 연령대와 성별에 맞는 한화손보 추천 상품을 보여드립니다.`,privacyBullets:[`카메라는 버튼을 누른 뒤에만 켜집니다.`,`필요하면 추정 결과를 직접 수정합니다.`],startButton:`카메라로 나이·성별 추정`,manualButton:`수동 입력으로 보기`,retryButton:`다시 시도`,resetButton:`처음으로`,analyzeButton:`얼굴 입체 스캔 시작`,stopScanButton:`얼굴 스캔 중지`,stopCameraButton:`카메라 끄기`,loadingModel:`분석 모델을 준비하고 있습니다`,cameraReady:`얼굴을 찾으면 자동으로 스캔을 시작합니다.`,analyzing:`얼굴 방향과 여러 각도의 프레임을 분석하고 있습니다...`,estimateBadge:`추정 결과`,productSourceLabel:`공식 출처 보기`,fallbackTitle:`수동 입력으로 이어갑니다`,fallbackBody:`카메라 권한 거부, 브라우저 제한, 얼굴 미검출, 낮은 신뢰도 상황에서는 수동 입력으로 상품 확인을 이어갑니다.`});function t(){return!!navigator.mediaDevices?.getUserMedia}async function n(e){if(!t())throw Error(`unsupported-camera`);let n=await navigator.mediaDevices.getUserMedia({video:{facingMode:`user`,width:{ideal:960},height:{ideal:720}},audio:!1});return e.srcObject=n,e.muted=!0,e.playsInline=!0,await e.play(),n}function r(e){let t=e?.getTracks?e:e?.srcObject;if(t?.getTracks)for(let e of t.getTracks())e.stop();e?.srcObject&&(e.srcObject=null)}function i(e){let t=e?.name||e?.message||``;return t.includes(`NotAllowed`)||t.includes(`Permission`)?`카메라 권한이 허용되지 않았습니다.`:t.includes(`NotFound`)||t.includes(`DevicesNotFound`)?`사용 가능한 카메라를 찾지 못했습니다.`:t.includes(`unsupported-camera`)?`이 브라우저는 카메라 API를 지원하지 않습니다.`:`카메라 준비 중 문제가 발생했습니다.`}var a=Object.freeze({TWENTIES:`20s`,THIRTIES:`30s`,FORTIES:`40s`,FIFTIES:`50s`,SIXTIES_PLUS:`60plus`,UNKNOWN:`unknown`});function o(e){let t=Number(e);return!Number.isFinite(t)||t<0?a.UNKNOWN:t<30?a.TWENTIES:t<40?a.THIRTIES:t<50?a.FORTIES:t<60?a.FIFTIES:a.SIXTIES_PLUS}function s(e){return{[a.TWENTIES]:`20대`,[a.THIRTIES]:`30대`,[a.FORTIES]:`40대`,[a.FIFTIES]:`50대`,[a.SIXTIES_PLUS]:`60대 이상`,[a.UNKNOWN]:`연령대 미확인`}[e]||`연령대 미확인`}var c=`modulepreload`,l=function(e,t){return new URL(e,t).href},u={},ee=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=l(t,n),t in u)return;u[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:c,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},d,f,p=12e3,m=220,h=12,te=.15,ne=.25,re=20,ie=12,ae=18,oe=2,g=Object.freeze({CENTER_START:`center-start`,FIRST_SIDE:`first-side`,OPPOSITE_SIDE:`opposite-side`,CENTER_END:`center-end`,DONE:`done`}),se=Object.freeze({backend:`webgl`,async:!0,debug:!1,modelBasePath:`https://cdn.jsdelivr.net/npm/@vladmandic/human/models`,cacheSensitivity:0,filter:{enabled:!0,autoBrightness:!0,equalization:!1,flip:!1},face:{enabled:!0,detector:{enabled:!0,rotation:!1,maxDetected:1,minConfidence:.2,return:!1},mesh:{enabled:!0},iris:{enabled:!1},description:{enabled:!0,minConfidence:te},emotion:{enabled:!1},antispoof:{enabled:!1},liveness:{enabled:!1}},body:{enabled:!1},hand:{enabled:!1},object:{enabled:!1},gesture:{enabled:!1},segmentation:{enabled:!1}});async function _(e=()=>{}){return f||(f=(async()=>{e(`모델 모듈을 불러오고 있습니다.`);let t=await ee(()=>import(`./human.esm-B6tcPwUd.js`),[],import.meta.url);return d=new(t.default||t.Human)(se),e(`분석 모델을 초기화하고 있습니다.`),await d.load(),await d.warmup(),e(`분석 모델 준비가 완료되었습니다.`),!0})(),f)}function ce(e){let t=String(e||``).toLowerCase();return t.includes(`female`)||t.includes(`woman`)?`female`:t.includes(`male`)||t.includes(`man`)?`male`:`unknown`}function v(e){let t=Number(e);return Number.isFinite(t)?t:0}function y(e){let t=v(e);return t<0?0:t>1?1:t}function le(e){let t=Number(e);return Number.isFinite(t)?Math.round(t*180/Math.PI):null}function b(e){if(!e.length)return null;let t=[...e].sort((e,t)=>e-t),n=Math.floor(t.length/2);return t.length%2?t[n]:(t[n-1]+t[n])/2}function ue(e){let t=[...e].sort((e,t)=>e-t),n=[];for(let e of t){let t=n.at(-1);!t||e-t.values.at(-1)>2?n.push({values:[e]}):t.values.push(e)}return n.map(e=>({count:e.values.length,min:e.values[0],max:e.values.at(-1),median:Math.round(b(e.values))}))}function de(e){let t=e.map(e=>e.apparentAge).filter(e=>e>0);if(!t.length)return{apparentAge:null,ageSamples:t};let n=Math.round(b(t)),r=Math.min(...t),i=Math.max(...t)-r>=8;if(n<20&&i){let e=ue(t).filter(e=>e.median>=20&&e.median>=n+6&&e.count>=3).sort((e,t)=>t.count-e.count||t.median-e.median)[0];if(e)return{apparentAge:e.median,ageSamples:t}}return{apparentAge:n,ageSamples:t}}function fe(e){return e&&(e<re?re:e)}function pe(e){return new Promise(t=>setTimeout(t,e))}async function me(e,t=m){if(await pe(t),typeof e?.requestVideoFrameCallback==`function`){await new Promise(t=>e.requestVideoFrameCallback(()=>t()));return}}function x(e){return le(e?.rotation?.angle?.yaw)}function S(e){let t=Math.round(v(e?.age)),n=ce(e?.gender),r=y(e?.genderScore??e?.genderConfidence),i=y(e?.boxScore),a=y(e?.faceScore),o=Math.max(y(e?.score),i,a),s=x(e);return{apparentAge:t>0?t:null,apparentGender:n,genderConfidence:r,faceConfidence:o,boxScore:i,faceScore:a,yawDegrees:s}}function he(e){let t={female:0,male:0};for(let n of e)(n.apparentGender===`female`||n.apparentGender===`male`)&&(t[n.apparentGender]+=n.genderConfidence);let n=t.female>t.male?`female`:t.male>t.female?`male`:`unknown`;if(n===`unknown`)return{apparentGender:`unknown`,genderConfidence:0};let r=Math.max(...e.filter(e=>e.apparentGender===n).map(e=>e.genderConfidence),0);return r<te?{apparentGender:`unknown`,genderConfidence:r}:{apparentGender:n,genderConfidence:r}}function ge(e,t=h){let n=e.filter(Boolean).map(S);if(!n.length)return{apparentAge:null,ageBucket:`unknown`,apparentGender:`unknown`,genderConfidence:0,faceConfidence:0,uncertainReason:`얼굴을 찾지 못했습니다.`};let{apparentAge:r,ageSamples:i}=de(n),a=fe(r),{apparentGender:s,genderConfidence:c}=he(n),l=Math.max(...n.map(e=>e.faceConfidence),0),u=[];return a||u.push(`나이 추정값이 불안정합니다. (${i.length}/${t}프레임)`),s===`unknown`&&u.push(`성별 추정값을 확정하기 어렵습니다. (최고 ${Math.round(c*100)}%)`),l&&l<ne&&u.push(`얼굴 감지 품질이 낮습니다. (${Math.round(l*100)}%)`),{apparentAge:a,ageBucket:a?o(a):`unknown`,apparentGender:s,genderConfidence:c,faceConfidence:l,uncertainReason:u.join(` `)||``}}async function _e(e){if(await _(),!d)throw Error(`face-analyzer-not-loaded`);let t=(await d.detect(e))?.face?.[0];if(!t)return{detected:!1,faceConfidence:0,yawDegrees:null};let n=S(t);return{detected:n.faceConfidence>0,faceConfidence:n.faceConfidence,yawDegrees:n.yawDegrees}}function ve(){return{step:g.CENTER_START,stableSamples:0,firstSideSign:0,completedSteps:[]}}function C(e){return{[g.CENTER_START]:`정면이 화면 중앙에 오도록 맞춰주세요`,[g.FIRST_SIDE]:`좋습니다. 옆면이 보이도록 천천히 돌려주세요`,[g.OPPOSITE_SIDE]:`좋습니다. 이제 반대쪽으로 천천히 돌려주세요`,[g.CENTER_END]:`마지막으로 다시 정면을 바라봐 주세요`,[g.DONE]:`스캔 완료. 결과를 정리하고 있습니다`}[e]||`얼굴이 화면 안에 들어오게 맞춰주세요`}function ye(e){return Math.min(1,e.completedSteps.length/4)}function be(e,t){let n=x(t),r=!1;return e.step===g.CENTER_START||e.step===g.CENTER_END?r=Number.isFinite(n)&&Math.abs(n)<=ie:e.step===g.FIRST_SIDE?r=Number.isFinite(n)&&Math.abs(n)>=ae:e.step===g.OPPOSITE_SIDE&&(r=Number.isFinite(n)&&e.firstSideSign!==0&&n*e.firstSideSign<=-18),r?(e.stableSamples+=1,e.stableSamples<oe?{yawDegrees:n,step:e.step,phase:`${C(e.step)} · 잠시 유지해 주세요`,completedSteps:[...e.completedSteps],scanCompleted:!1}:(e.step===g.CENTER_START?(e.completedSteps.push(g.CENTER_START),e.step=g.FIRST_SIDE):e.step===g.FIRST_SIDE?(e.completedSteps.push(g.FIRST_SIDE),e.firstSideSign=Math.sign(n)||1,e.step=g.OPPOSITE_SIDE):e.step===g.OPPOSITE_SIDE?(e.completedSteps.push(g.OPPOSITE_SIDE),e.step=g.CENTER_END):e.step===g.CENTER_END&&(e.completedSteps.push(g.CENTER_END),e.step=g.DONE),e.stableSamples=0,{yawDegrees:n,step:e.step,phase:C(e.step),completedSteps:[...e.completedSteps],scanCompleted:e.step===g.DONE})):(e.stableSamples=0,{yawDegrees:n,step:e.step,phase:t?C(e.step):`얼굴이 화면 중앙에 오도록 맞춰주세요`,completedSteps:[...e.completedSteps],scanCompleted:e.step===g.DONE})}function xe(e,t){typeof e==`function`&&e(t)}function Se(){let e=Error(`face-scan-aborted`);return e.name=`AbortError`,e}function w(e){if(e?.aborted)throw Se()}async function Ce(e,t={}){if(await _(),!d)throw Error(`face-analyzer-not-loaded`);let{signal:n}=t,r=[],i=ve(),a=performance.now(),o={step:i.step,phase:C(i.step),completedSteps:[],scanCompleted:!1,yawDegrees:null};for(;performance.now()-a<p&&!o.scanCompleted;){w(n);let s=performance.now()-a,c=await d.detect(e);w(n);let l=c?.face?.[0];l&&r.push(l),o=be(i,l),xe(t.onProgress,{elapsedMs:s,durationMs:p,progress:ye(i),phase:o.phase,samplesCaptured:r.length,yawDegrees:o.yawDegrees,step:o.step,completedSteps:o.completedSteps,scanCompleted:o.scanCompleted});let u=p-(performance.now()-a);if(u<=0)break;await me(e,Math.min(m,u)),w(n)}let s=Math.round(performance.now()-a),c=ge(r,h);return c.scanCompleted=o.scanCompleted,c.completedSteps=o.completedSteps,xe(t.onProgress,{elapsedMs:s,durationMs:p,progress:1,phase:`분석 결과를 정리하고 있습니다`,samplesCaptured:r.length,yawDegrees:o.yawDegrees,step:o.step,completedSteps:o.completedSteps,scanCompleted:o.scanCompleted}),c}Object.freeze([`apparentAge`,`ageBucket`,`apparentGender`,`genderConfidence`,`faceConfidence`,`uncertainReason`]);var T=`2026-06-07`,E=Object.freeze([{id:`direct-driver`,name:`캐롯 운전자보험`,category:`운전자`,summary:`운전 중 사고 후 생기는 비용 부담에 대비하는 운전자 상품입니다.`,reasonTags:[`운전`,`이동`,`성인`],thumbnailIcon:`운전`,thumbnailTone:`blue`,sourceUrl:`https://www.carrotins.com/`,sourceLabel:`한화손보 캐롯 공식 홈페이지`,sourceCheckedAt:T,caveat:`운전 여부와 직업, 차량 이용 형태에 따라 실제 확인 항목이 달라집니다.`},{id:`direct-cancer`,name:`다이렉트 내가고른암보험`,category:`암`,summary:`암 및 유사암 진단비 등 주요 질병 보장을 중심으로 확인하는 건강 상품입니다.`,reasonTags:[`건강`,`암`,`성인`],thumbnailIcon:`암`,thumbnailTone:`purple`,sourceUrl:`https://mall.hwgeneralins.com/index.do`,sourceLabel:`한화다이렉트 메인`,sourceCheckedAt:T,caveat:`질병 이력, 연령, 세부 담보 조건은 공식 자료로 별도 확인해야 합니다.`},{id:`medical-indemnity`,name:`한화실손의료보험(갱신형)`,category:`실손`,summary:`질병이나 상해로 실제 부담한 의료비를 중심으로 확인하는 실손의료 상품입니다.`,reasonTags:[`실손`,`의료비`,`건강`],thumbnailIcon:`실손`,thumbnailTone:`green`,sourceUrl:`https://www.hwgeneralins.com/upload/product/medical%282204%29_03.pdf`,sourceLabel:`한화손보 실손의료보험 약관`,sourceCheckedAt:T,caveat:`실손의료보험은 갱신형 상품입니다. 보장 내용, 자기부담금, 갱신 조건은 공식 자료에서 확인해야 합니다.`},{id:`signature-women-health`,name:`한화 시그니처 여성 건강보험 4.0(무)`,category:`여성 건강`,summary:`여성 질환과 여성암 관련 보장을 중심으로 구성된 여성 건강 상품입니다.`,reasonTags:[`여성`,`건강`,`성인`],thumbnailIcon:`여성`,thumbnailTone:`pink`,sourceUrl:`https://www.carrotins.com/`,sourceLabel:`한화손보 캐롯 공식 홈페이지`,sourceCheckedAt:T,caveat:`여성 전용 상품군이므로 필요할 때만 공식 자료를 확인하세요.`,genderSpecific:`female`},{id:`direct-fire`,name:`다이렉트 119주택화재보험`,category:`화재`,summary:`거주 공간의 화재·생활위험에 대비하는 주택화재 상품입니다.`,reasonTags:[`주거`,`생활`,`가족`],thumbnailIcon:`화재`,thumbnailTone:`orange`,sourceUrl:`https://mall.hwgeneralins.com/index.do`,sourceLabel:`한화다이렉트 메인`,sourceCheckedAt:T,caveat:`주택 형태, 소유/임차 여부, 담보 구성에 따라 확인할 내용이 달라집니다.`},{id:`direct-dental`,name:`치아안심보험`,category:`치아`,summary:`치과 치료와 구강 관리 관련 비용 부담을 확인하는 치아 상품입니다.`,reasonTags:[`치아`,`건강`,`생활`],thumbnailIcon:`치아`,thumbnailTone:`teal`,sourceUrl:`https://www.hwgeneralins.com/`,sourceLabel:`한화손보 홈페이지`,sourceCheckedAt:T,caveat:`보장개시, 면책, 감액 등 세부 조건은 공식 상품 자료에서 확인해야 합니다.`},{id:`direct-travel`,name:`캐롯 해외여행보험`,category:`여행`,summary:`해외여행 중 생기는 의료·휴대품·일정 변수에 대비하는 여행 상품입니다.`,reasonTags:[`여행`,`이동`,`단기`],thumbnailIcon:`여행`,thumbnailTone:`sky`,sourceUrl:`https://www.carrotins.com/`,sourceLabel:`한화손보 캐롯 공식 홈페이지`,sourceCheckedAt:T,caveat:`여행 일정, 목적지, 체류 기간에 따라 필요한 확인 사항이 달라질 수 있습니다.`},{id:`comprehensive-health`,name:`한화 더건강한 한아름종합보험(무)`,category:`종합 건강`,summary:`암·뇌·심장 등 여러 건강 위험을 함께 확인하는 종합 건강 상품입니다.`,reasonTags:[`건강`,`종합`,`중장년`],thumbnailIcon:`건강`,thumbnailTone:`navy`,sourceUrl:`https://mall.hwgeneralins.com/ins/ltr/life_features_01.do`,sourceLabel:`한화 더건강한 한아름종합보험 상품 페이지`,sourceCheckedAt:T,caveat:`세부 보장과 예시는 성별, 나이, 직업, 담보 구성에 따라 달라질 수 있습니다.`},{id:`senior-care`,name:`한화 더 경증 간편건강보험Ⅱ(세만기형)(무)`,category:`간병/노후`,summary:`간병인 사용 입원생활비 등 노후 간병비 부담을 중심으로 확인하는 간병인 상품입니다.`,reasonTags:[`간병`,`노후`,`건강`],thumbnailIcon:`간병`,thumbnailTone:`gold`,sourceUrl:`https://mall.hwgeneralins.com/ins/ltr/care_features_01.do`,sourceLabel:`한화손보 간병인보험 상품 페이지`,sourceCheckedAt:T,caveat:`간병 관련 담보, 고지유형, 연령 조건, 갱신 여부는 공식 자료에서 확인해야 합니다.`},{id:`direct-golf`,name:`다이렉트 홀인원보험`,category:`골프`,summary:`골프 활동 중 생기는 비용 부담에 대비하는 골프 상품입니다.`,reasonTags:[`골프`,`취미`,`활동`],thumbnailIcon:`골프`,thumbnailTone:`green`,sourceUrl:`https://www.carrotins.com/product/holeinone/intro`,sourceLabel:`한화손보 캐롯 홀인원보험 페이지`,sourceCheckedAt:T,caveat:`취미·운동 활동 여부에 따라 확인할 내용이 달라질 수 있습니다.`}]);function D(e){return E.find(t=>t.id===e)}var O=Object.freeze({[a.TWENTIES]:[`direct-travel`,`medical-indemnity`,`direct-driver`,`direct-dental`],[a.THIRTIES]:[`direct-driver`,`medical-indemnity`,`direct-fire`,`direct-dental`],[a.FORTIES]:[`direct-cancer`,`comprehensive-health`,`direct-driver`,`direct-fire`],[a.FIFTIES]:[`comprehensive-health`,`direct-cancer`,`direct-fire`,`direct-dental`],[a.SIXTIES_PLUS]:[`senior-care`,`comprehensive-health`,`direct-cancer`,`direct-fire`],[a.UNKNOWN]:[`direct-cancer`,`direct-driver`,`direct-fire`]}),we=Object.freeze([a.TWENTIES,a.THIRTIES,a.FORTIES,a.FIFTIES]),Te=Object.freeze({"direct-travel":{[a.TWENTIES]:`20대는 여행과 이동 계획이 늘기 쉬워, 여행 중 생기는 변수에 대비하는 상품으로 추천합니다.`,default:({ageLabel:e})=>`${e}에 여행 일정이 있다면 출발 전에 확인하기 좋은 상품입니다.`},"direct-driver":{[a.TWENTIES]:`20대는 운전을 시작하거나 이동 범위가 넓어지는 경우가 많아, 운전 중 사고에 대비하는 상품으로 추천합니다.`,[a.THIRTIES]:`30대는 출퇴근과 일상 이동으로 운전 시간이 늘기 쉬워, 운전자 상품을 함께 추천합니다.`,[a.FORTIES]:`40대는 가족 이동과 업무 이동이 함께 늘기 쉬워, 운전 중 사고에 대비하는 상품으로 추천합니다.`,default:({ageLabel:e})=>`${e}에 운전이나 차량 이동이 잦다면 확인하기 좋은 상품입니다.`},"direct-dental":{[a.TWENTIES]:`20대는 바쁜 일정으로 치과 관리를 미루기 쉬워, 치과 치료 부담을 확인하는 상품으로 추천합니다.`,[a.THIRTIES]:`30대는 일상 관리와 치료 일정이 함께 늘기 쉬워, 치아 상품을 함께 추천합니다.`,default:({ageLabel:e})=>`${e}에는 치과 치료와 구강 관리 비용을 함께 점검하는 상품으로 추천합니다.`},"medical-indemnity":{[a.TWENTIES]:`20대는 병원 이용이나 갑작스러운 치료비 부담을 미리 살펴두면 좋아, 실손의료보험을 함께 추천합니다.`,[a.THIRTIES]:`30대는 일상 의료비와 가족 생활비를 함께 고려할 시기라, 실제 부담한 의료비를 점검하는 실손의료보험을 추천합니다.`,default:({ageLabel:e})=>`${e}에 병원비 부담을 기본으로 준비하고 싶다면 확인하기 좋은 상품입니다.`},"direct-cancer":{[a.FORTIES]:`40대부터는 주요 질병 대비를 더 구체적으로 점검할 시기라, 암 상품을 우선 추천합니다.`,[a.FIFTIES]:`50대는 주요 질병 보장을 더 꼼꼼히 확인하는 경우가 많아, 암 상품을 우선 추천합니다.`,[a.SIXTIES_PLUS]:`60대 이상은 주요 질병 보장을 먼저 점검하는 경우가 많아, 암 상품을 함께 추천합니다.`,default:()=>`건강 보장을 먼저 살펴보고 싶을 때 기본으로 확인하기 좋은 상품입니다.`},"signature-women-health":{default:()=>`여성으로 선택한 경우, 여성 질환과 여성암 관련 보장을 함께 살펴보는 상품으로 추천합니다.`},"direct-fire":{[a.TWENTIES]:`20대는 자취·독립·이사처럼 주거 환경이 바뀌기 쉬워, 생활 공간을 위한 화재 상품을 추천합니다.`,[a.THIRTIES]:`30대는 주거 공간과 생활 자산이 늘어나는 시기라, 주택화재 상품을 함께 추천합니다.`,[a.FORTIES]:`40대는 가족 생활 공간을 안정적으로 관리해야 하는 경우가 많아, 화재·생활위험 상품을 추천합니다.`,default:({ageLabel:e})=>`${e}에는 거주 공간의 화재와 생활위험을 함께 점검하는 상품으로 추천합니다.`},"comprehensive-health":{[a.FORTIES]:`40대부터는 암·뇌·심장 같은 주요 질병을 함께 점검할 필요가 커져, 종합 건강 상품을 추천합니다.`,[a.FIFTIES]:`50대는 여러 건강 위험을 한 번에 점검하고 싶은 경우가 많아, 종합 건강 상품을 우선 추천합니다.`,[a.SIXTIES_PLUS]:`60대 이상은 주요 건강 위험을 폭넓게 점검하는 상품을 우선 추천합니다.`,default:({ageLabel:e})=>`${e}에 건강 보장을 폭넓게 보고 싶다면 확인하기 좋은 상품입니다.`},"senior-care":{[a.SIXTIES_PLUS]:`60대 이상은 치료 이후 간병비와 가족 부담까지 고려할 일이 많아져, 노후 간병 준비를 확인하는 상품으로 추천합니다.`,default:({ageLabel:e})=>`${e}에 간병비와 장기 치료 이후 생활 부담을 함께 살펴보고 싶다면 추천합니다.`},"direct-golf":{default:()=>`골프 활동을 한다면 라운딩 중 생기는 비용 부담에 대비하는 상품으로 추천합니다.`}});function Ee(e){return[...new Set(e)]}function De(e){return e===`female`||e===`male`?e:`unknown`}function Oe(e,t){return typeof e==`function`?e(t):e}function ke(e){let t=e?.ageBucket||a.UNKNOWN,n=De(e?.apparentGender||e?.gender),r=[...O[t]||O[a.UNKNOWN]];n===`female`&&we.includes(t)&&(r=[`signature-women-health`,...r]),n!==`female`&&(r=r.filter(e=>D(e)?.genderSpecific!==`female`));let i=Ee(r).map(D).filter(Boolean).slice(0,4);if(i.length<2){let e=E.filter(e=>!i.some(t=>t.id===e.id)&&e.genderSpecific!==`female`);return[...i,...e].slice(0,2)}return i}function Ae(e,t){let n=t?.ageBucket||a.UNKNOWN,r=t?.ageBucketLabel||`현재 연령대`,i=Te[e.id],o=i?.[n]||i?.default;return o?Oe(o,{ageBucket:n,ageLabel:r,product:e}):`${r}에 ${e.category} 상품을 확인하기 좋은 조건이라 추천합니다.`}var je=document.querySelector(`#app`),k=null,A=null,Me=20,Ne=.45,j=3,Pe=320,Fe=420,Ie=e=>`./${e}`,M=null,N=null,P=!1,F=0,I=!1,L=null;function Le(e){return{female:`여성 추정`,male:`남성 추정`,unknown:`미확인`}[e]||`미확인`}function Re(e){return{female:`여성`,male:`남성`,unknown:`선택 안 함`}[e]||`선택 안 함`}function ze(e){return e===`manual`||e===`confirmed`}function Be(e){let t=Number(e);return Number.isFinite(t)?Math.max(Me,Math.round(t)):null}function R(e){return String(e??``).replace(/[&<>'"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,"'":`&#039;`,'"':`&quot;`})[e])}function z(e){return new Promise(t=>{window.setTimeout(t,e)})}function B(e){let t=document.querySelector(`#video-overlay-label`);t&&(t.textContent=e)}function V(){N&&=(window.clearTimeout(N),null);let e=document.querySelector(`.video-wrap`);e&&e.classList.remove(`face-detected`)}function Ve(){let e=document.querySelector(`.video-wrap`);e&&(V(),e.classList.add(`face-detected`),N=window.setTimeout(()=>{e.classList.remove(`face-detected`),N=null},760))}function H({keepEffect:e=!1}={}){M&&=(window.clearTimeout(M),null),F=0,I=!1,e||V()}async function He(){let e=0;for(;P&&e<12;)await z(34),e+=1}function U(e){let t=document.querySelector(`#analyze-face`),n=document.querySelector(`#stop-scan`);t&&(t.disabled=e),n&&n.classList.toggle(`hidden`,!e)}function Ue(t=e.cameraReady){let n=document.querySelector(`#scan-progress-bar`),r=document.querySelector(`.video-wrap`);n&&(n.style.width=`0%`),r&&(r.classList.remove(`is-scanning`,`scan-complete`),r.style.setProperty(`--scan-progress`,`0%`),r.style.setProperty(`--scan-y`,`0px`),delete r.dataset.scanStep),document.querySelectorAll(`#scan-steps [data-step]`).forEach(e=>{e.classList.remove(`done`,`active`),e.setAttribute(`aria-current`,`false`)}),V(),B(t),X(t)}function We(){L&&L.abort()}function Ge(e){return e?.name===`AbortError`||e?.message===`face-scan-aborted`}function W(e=980){try{return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?160:e}catch{return e}}function G(t){je.innerHTML=`
    <main class="app-shell">
      <div class="container">
        <header class="app-header" aria-label="서비스 정보">
          <div class="brand-lockup">
            <img class="brand-logo" src="${Ie(`hanwha-logo.svg`)}" alt="Hanwha" width="145" height="40" />
            <div>
              <strong>${e.appTitle}</strong>
            </div>
          </div>
        </header>
        ${t}
      </div>
    </main>
  `}function K(){$(),G(`
    <section class="hero">
      <div class="card hero-card">
        <h1 class="page-title">${e.heroTitle}</h1>
        <p class="muted hero-body">${e.heroBody}</p>
        <div class="badges">
          <span class="badge">브라우저 내 분석</span>
          <span class="badge">얼굴 입체 스캔</span>
        </div>
        <div class="flow-strip" aria-label="진행 방식">
          <div><b>1</b><span>카메라 권한 허용</span></div>
          <div><b>2</b><span>얼굴 입체 스캔</span></div>
          <div><b>3</b><span>추천 상품 확인</span></div>
        </div>
        <div class="actions">
          <button class="btn orange" id="start-camera">${e.startButton}</button>
          <button class="btn secondary" id="manual-start">${e.manualButton}</button>
        </div>
      </div>
      <aside class="card trust-card">
        <p class="eyebrow">Privacy first</p>
        <h2>카메라 데이터는 저장하지 않습니다.</h2>
        <ul class="privacy-list">
          ${e.privacyBullets.map(e=>`<li>${e}</li>`).join(``)}
        </ul>
      </aside>
    </section>
  `),document.querySelector(`#start-camera`).addEventListener(`click`,J),document.querySelector(`#manual-start`).addEventListener(`click`,()=>Q(`수동 입력을 선택했습니다.`))}function Ke(t=e.loadingModel){G(`
    <section class="card center-card">
      <p class="eyebrow">모델 준비</p>
      <h1 class="page-title">${e.loadingModel}</h1>
      <p class="muted" id="load-status">${R(t)}</p>
      <div class="loading-bar" aria-hidden="true"><span></span></div>
      <div class="actions"><button class="btn secondary" id="back-home">${e.resetButton}</button></div>
    </section>
  `),document.querySelector(`#back-home`).addEventListener(`click`,K)}async function q({eyebrow:e=`AI scan`,title:t=`분석 결과를 정리하고 있습니다`,body:n=`잠시 후 다음 화면으로 이동합니다.`,steps:r=[`스캔 완료`,`추정값 정리`,`다음 화면 준비`],durationMs:i=980}={}){G(`
    <section class="card center-card transition-card" aria-live="polite">
      <div class="transition-orb" aria-hidden="true">
        <span></span>
      </div>
      <p class="eyebrow">${R(e)}</p>
      <h1 class="page-title">${R(t)}</h1>
      <p class="muted">${R(n)}</p>
      <ol class="transition-steps">
        ${r.map((e,t)=>`<li style="--step-index:${t}"><span>✓</span>${R(e)}</li>`).join(``)}
      </ol>
    </section>
  `),await z(W(i))}async function J(){if(!t()){Q(`이 브라우저는 카메라 API를 지원하지 않습니다.`);return}try{Ke(),await _(e=>{let t=document.querySelector(`#load-status`);t&&(t.textContent=e)}),qe();let t=document.querySelector(`#camera-video`);k=await n(t),X(e.cameraReady),B(`얼굴이 가이드 안에 들어오면 자동으로 시작합니다`),Je(t)}catch(e){Q(i(e))}}function qe(){G(`
    <section class="card stage camera-stage">
      <div>
        <h1 class="page-title">얼굴 스캔을 시작합니다</h1>
        <p class="muted">안내가 바뀔 때까지 천천히 움직여 주세요. 라이브 프레임만 브라우저 메모리에서 분석합니다.</p>
      </div>
      <div class="camera-grid">
        <div class="video-wrap">
          <video id="camera-video" autoplay muted playsinline></video>
          <div class="scan-hud" aria-hidden="true">
            <div class="scan-grid"></div>
            <div class="scan-line"></div>
            <div class="face-frame">
              <span class="corner top-left"></span>
              <span class="corner top-right"></span>
              <span class="corner bottom-left"></span>
              <span class="corner bottom-right"></span>
            </div>
            <div class="scan-pulse"></div>
          </div>
          <div class="video-overlay"><span id="video-overlay-label">얼굴이 가이드 안에 들어오게 맞춰주세요</span></div>
        </div>
        <aside class="status-panel card inner-card">
          <p class="eyebrow">Guided scan</p>
          <div class="scan-progress"><span id="scan-progress-bar"></span></div>
          <button class="btn orange" id="analyze-face">${e.analyzeButton}</button>
          <button class="btn secondary hidden" id="stop-scan">${e.stopScanButton}</button>
          <ol class="scan-steps" id="scan-steps">
            <li data-step="center-start"><span class="step-mark">1</span><span class="step-copy">정면</span></li>
            <li data-step="first-side"><span class="step-mark">2</span><span class="step-copy">옆면</span></li>
            <li data-step="opposite-side"><span class="step-mark">3</span><span class="step-copy">반대쪽</span></li>
            <li data-step="center-end"><span class="step-mark">4</span><span class="step-copy">정면 복귀</span></li>
          </ol>
          <div class="status-line" id="status-line">카메라 준비 중...</div>
          <button class="btn secondary" id="manual-fallback">${e.manualButton}</button>
          <button class="btn secondary" id="stop-camera">${e.stopCameraButton}</button>
        </aside>
      </div>
    </section>
  `),document.querySelector(`#analyze-face`).addEventListener(`click`,Z),document.querySelector(`#stop-scan`).addEventListener(`click`,We),document.querySelector(`#manual-fallback`).addEventListener(`click`,()=>Q(`수동 입력을 선택했습니다.`)),document.querySelector(`#stop-camera`).addEventListener(`click`,K)}function Y(e){M=window.setTimeout(()=>{Ze(e)},Pe)}function Je(e){H(),e&&Y(e)}function Ye(e){let t=Math.round(e*100);B(`얼굴을 감지했습니다. 스캔을 준비합니다`),X(`얼굴 감지됨 · 자동 시작 준비 ${F}/${j} · 품질 ${t}%`)}async function Xe(e){I=!0,M&&=(window.clearTimeout(M),null),Ve(),B(`스캔을 자동으로 시작합니다`),X(`얼굴 감지 완료 · 자동 스캔 시작`);let t=document.querySelector(`#analyze-face`);t&&(t.disabled=!0),await z(W(Fe)),!(!e?.isConnected||!k)&&await Z({autoStarted:!0})}async function Ze(t){if(I||P||!t?.isConnected||!k)return;if(t.readyState<HTMLMediaElement.HAVE_CURRENT_DATA){Y(t);return}let n=!1;P=!0;try{let r=await _e(t);r.detected&&r.faceConfidence>=Ne?(F+=1,Ye(r.faceConfidence),n=F>=j):(F=0,V(),B(`얼굴이 가이드 안에 들어오면 자동으로 시작합니다`),X(e.cameraReady))}catch{F=0,V(),X(`자동 감지 대기 중입니다. 필요하면 버튼으로 시작하세요.`)}finally{P=!1}if(n){await Xe(t);return}!I&&t?.isConnected&&k&&Y(t)}function X(e){let t=document.querySelector(`#status-line`);t&&(t.textContent=e)}function Qe({progress:e=0,phase:t=``,samplesCaptured:n=0,yawDegrees:r=null,step:i=``,completedSteps:a=[]}){let o=document.querySelector(`#scan-progress-bar`),s=document.querySelector(`.video-wrap`),c=document.querySelector(`#video-overlay-label`),l=Math.min(100,Math.max(0,Math.round(e*100)));c&&(c.textContent=l>=100?`스캔 완료`:t||`얼굴이 화면 안에 들어오게 맞춰주세요.`),o&&(o.style.width=`${l}%`),s&&(s.classList.add(`is-scanning`),s.classList.toggle(`scan-complete`,l>=100),s.style.setProperty(`--scan-progress`,`${l}%`),s.style.setProperty(`--scan-y`,`${l*2.3}px`),i&&(s.dataset.scanStep=i)),document.querySelectorAll(`#scan-steps [data-step]`).forEach(e=>{let t=a.includes(e.dataset.step),n=e.dataset.step===i&&!t&&l<100;e.classList.toggle(`done`,t),e.classList.toggle(`active`,n),e.setAttribute(`aria-current`,n?`step`:`false`)}),X(`스캔 진행 ${l}% · 샘플 ${n}개${Number.isFinite(r)?` · yaw ${Math.round(r)}°`:``}`)}async function Z({autoStarted:t=!1}={}){if(H({keepEffect:t}),t||await He(),L)return;let n=document.querySelector(`#camera-video`);L=new AbortController;try{U(!0),X(e.analyzing);let t=await Ce(n,{onProgress:Qe,signal:L.signal});if(t.uncertainReason||!t.apparentAge||t.apparentGender===`unknown`){A=t,Q(t.uncertainReason||`추정값이 불안정합니다.`,t);return}A=t,L=null,$({abortScan:!1}),await q({eyebrow:`Scan complete`,title:`얼굴 입체 스캔을 완료했습니다`,body:`추정 나이와 성별을 확인 화면에 정리하고 있습니다.`,steps:[`스캔 완료`,`추정값 정리`,`확인 화면 준비`],durationMs:920}),$e(t)}catch(e){if(Ge(e)){Ue(`얼굴 스캔을 중지했습니다. 다시 시작하려면 버튼을 눌러주세요.`);return}Q(`얼굴 분석 중 문제가 발생했습니다. 수동 입력으로 이어갑니다.`)}finally{L=null,U(!1)}}function $e(e){let t=e.apparentGender&&e.apparentGender!==`unknown`?e.apparentGender:`unknown`,n=Be(e.apparentAge);G(`
    <section class="confirm-layout">
      <div class="card">
        <p class="eyebrow">추정값 확인</p>
        <h1 class="page-title">데이터를 확인해 주세요</h1>
        <p class="muted">카메라 모델은 외형만 보고 추정합니다. 실제 나이와 차이가 나면 이 화면에서 직접 수정하세요.</p>
        <div class="estimate-summary">
          <div><span>추정 나이</span><b>${e.apparentAge?`${R(e.apparentAge)}세`:`미확인`}</b></div>
          <div><span>추정 성별</span><b>${R(Le(e.apparentGender))}</b></div>
        </div>
        <div class="confirm-actions">
          <button class="btn orange" type="button" id="confirm-profile">이 값으로 상품 보기</button>
        </div>
      </div>
    </section>
  `),document.querySelector(`#confirm-profile`).addEventListener(`click`,async()=>{let r={apparentAge:n,ageBucket:o(n),apparentGender:t,genderConfidence:1,faceConfidence:e.faceConfidence,uncertainReason:``,confirmed:!0};A=r,await q({eyebrow:`Recommendation`,title:`추천 상품을 구성하고 있습니다`,body:`확인한 나이와 성별을 기준으로 상품 카드를 준비하고 있습니다.`,steps:[`기준값 확인`,`추천 상품 구성`,`공식 출처 연결`],durationMs:820}),et(r,`confirmed`)})}function Q(t,n=null){$();let r=n?.apparentAge||``,i=n?.apparentGender&&n.apparentGender!==`unknown`?n.apparentGender:`unknown`;G(`
    <section class="card center-card">
      <p class="eyebrow">수동 입력</p>
      <h1 class="page-title">${e.fallbackTitle}</h1>
      <p class="muted">${e.fallbackBody}</p>
      <div class="notice compact">사유: ${R(t)}</div>
      <form id="manual-form" class="form-grid">
        <div class="field">
          <label for="manual-age">나이</label>
          <input id="manual-age" name="age" type="number" min="20" max="100" inputmode="numeric" value="${R(r)}" required />
        </div>
        <div class="field">
          <label for="manual-gender">성별 선택</label>
          <select id="manual-gender" name="gender">
            <option value="unknown" ${i===`unknown`?`selected`:``}>선택 안 함</option>
            <option value="female" ${i===`female`?`selected`:``}>여성</option>
            <option value="male" ${i===`male`?`selected`:``}>남성</option>
          </select>
        </div>
        <div class="actions">
          <button class="btn orange" type="submit">상품 보기</button>
          <button class="btn secondary" type="button" id="retry-camera">${e.retryButton}</button>
        </div>
      </form>
    </section>
  `),document.querySelector(`#manual-form`).addEventListener(`submit`,async e=>{e.preventDefault();let t=new FormData(e.currentTarget),n=Be(t.get(`age`)),r={apparentAge:n,ageBucket:o(n),apparentGender:t.get(`gender`)||`unknown`,genderConfidence:1,faceConfidence:0,uncertainReason:``,manual:!0};A=r,await q({eyebrow:`Recommendation`,title:`추천 상품을 구성하고 있습니다`,body:`입력한 나이와 성별을 기준으로 상품 카드를 준비하고 있습니다.`,steps:[`입력값 확인`,`추천 상품 구성`,`공식 출처 연결`],durationMs:820}),et(r,`manual`)}),document.querySelector(`#retry-camera`).addEventListener(`click`,J)}function et(t,n){let r=s(t.ageBucket),i={...t,ageBucketLabel:r},a=ke(i),o=n===`manual`?`수동 입력`:n===`confirmed`?`추정값 확인`:e.estimateBadge,c=ze(n);G(`
    <section class="stage">
      <div class="card result-hero">
        <p class="eyebrow">${o}</p>
        <h1 class="page-title">추천 상품 ${a.length}가지를 준비했습니다</h1>
      </div>
      <div class="result-grid">
        <aside class="card profile-card">
          <span class="badge">${o}</span>
          <h2>분석/입력 정보</h2>
          <div class="metric"><b>나이</b><span>${t.apparentAge?`${t.apparentAge}세`:`미확인`}</span></div>
          <div class="metric"><b>연령대</b><span>${r}</span></div>
          <div class="metric"><b>성별</b><span>${c?Re(t.apparentGender):Le(t.apparentGender)}</span></div>
          <div class="actions">
            <button class="btn secondary" id="edit-manual">수정하기</button>
            <button class="btn secondary" id="home">${e.resetButton}</button>
          </div>
        </aside>
        <div class="product-grid">
          ${a.map(e=>tt(e,i)).join(``)}
        </div>
      </div>
    </section>
  `),document.querySelector(`#edit-manual`).addEventListener(`click`,()=>Q(`결과 수정을 선택했습니다.`,A)),document.querySelector(`#home`).addEventListener(`click`,K)}function tt(t,n){return`
    <article class="product-card">
      <div class="product-thumbnail product-thumbnail--${rt(t.thumbnailTone)}" aria-hidden="true">
        <div class="thumbnail-copy">
          <span class="thumbnail-brand">HANWHA</span>
          <strong>${R(t.thumbnailIcon||t.category)}</strong>
        </div>
        ${it(t.id)}
      </div>
      <div class="product-topline">
        <div class="category">${R(t.category)}</div>
        <span>추천 상품</span>
      </div>
      <h3>${R(t.name)}</h3>
      <p>${R(t.summary)}</p>
      <p class="muted">${R(Ae(t,n))}</p>
      <p class="caveat">${R(t.caveat)}</p>
      <a class="source-link" href="${R(t.sourceUrl)}" target="_blank" rel="noreferrer noopener">
        ${e.productSourceLabel} · ${R(t.sourceLabel)} · 확인일 ${R(t.sourceCheckedAt)}
      </a>
    </article>
  `}var nt=new Set([`orange`,`blue`,`purple`,`green`,`pink`,`teal`,`sky`,`navy`,`gold`]);function rt(e){return nt.has(e)?e:`orange`}function it(e){switch(e){case`direct-driver`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M39 129C61 118 100 113 139 116C185 119 219 125 242 137H35C29 137 28 132 39 129Z"/>
          <path class="thumb-road" d="M38 119C76 96 128 95 223 111"/>
          <path class="thumb-fill" d="M76 77C84 55 98 43 124 43H164C184 43 197 53 206 77L223 82C232 85 237 93 237 103V114H55V99C55 90 61 83 70 81L76 77Z"/>
          <path class="thumb-light" d="M95 76L104 58H161C173 58 181 63 188 76H95Z"/>
          <circle class="thumb-dark" cx="91" cy="114" r="18"/>
          <circle class="thumb-dark" cx="197" cy="114" r="18"/>
          <circle class="thumb-white" cx="91" cy="114" r="7"/>
          <circle class="thumb-white" cx="197" cy="114" r="7"/>
          <path class="thumb-line" d="M51 92H29M49 104H19M231 76H245" />
        </svg>`;case`direct-cancer`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M70 130C104 116 178 116 221 133H63C54 133 57 132 70 130Z"/>
          <path class="thumb-shield" d="M139 22L210 46V86C210 115 181 133 139 141C97 133 68 115 68 86V46L139 22Z"/>
          <path class="thumb-fill" d="M129 45C108 46 96 60 98 78C100 94 115 101 130 91C121 110 129 124 142 122C155 120 159 105 148 91C165 102 181 94 182 78C183 60 169 45 148 45C144 45 141 47 139 50C137 47 134 45 129 45Z"/>
          <path class="thumb-line" d="M139 52C131 65 128 78 139 92C150 78 147 65 139 52Z"/>
          <circle class="thumb-white" cx="89" cy="43" r="8"/>
          <circle class="thumb-white soft" cx="205" cy="34" r="5"/>
        </svg>`;case`medical-indemnity`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M57 132C92 117 177 117 226 134H48C40 134 43 132 57 132Z"/>
          <path class="thumb-shield" d="M137 19L205 43V82C205 112 177 132 137 139C97 132 69 112 69 82V43L137 19Z"/>
          <rect class="thumb-white" x="121" y="50" width="32" height="78" rx="8"/>
          <rect class="thumb-white" x="98" y="73" width="78" height="32" rx="8"/>
          <path class="thumb-line" d="M68 112L50 126M205 39L225 26M216 67L238 63"/>
          <circle class="thumb-fill" cx="96" cy="39" r="13"/>
        </svg>`;case`signature-women-health`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M56 132C94 118 179 119 221 135H49C39 135 42 133 56 132Z"/>
          <circle class="thumb-white soft" cx="137" cy="70" r="54"/>
          <path class="thumb-fill" d="M137 36C121 36 111 47 111 61C111 79 128 89 137 98C146 89 163 79 163 61C163 47 153 36 137 36Z"/>
          <path class="thumb-dark" d="M137 100C153 100 165 111 166 129H108C109 111 121 100 137 100Z"/>
          <circle class="thumb-white" cx="137" cy="66" r="19"/>
          <path class="thumb-line" d="M96 48C87 57 83 68 85 83M181 47C190 59 193 73 189 88"/>
        </svg>`;case`direct-fire`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M53 133C91 118 181 119 226 136H46C36 136 39 134 53 133Z"/>
          <path class="thumb-white" d="M75 77L139 32L203 77V130H75V77Z"/>
          <path class="thumb-dark" d="M139 32L213 84L205 95L139 49L73 95L65 84L139 32Z"/>
          <rect class="thumb-fill" x="117" y="88" width="38" height="42" rx="7"/>
          <path class="thumb-flame" d="M198 100C209 87 204 75 196 66C197 78 184 82 184 97C184 110 194 119 207 119C219 119 228 110 228 98C228 88 222 81 215 75C217 91 206 92 198 100Z"/>
          <path class="thumb-line" d="M91 92H110M166 92H185"/>
        </svg>`;case`direct-dental`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M72 131C108 118 178 118 220 134H62C53 134 57 132 72 131Z"/>
          <path class="thumb-white" d="M102 35C117 27 129 36 138 36C147 36 159 27 174 35C197 46 194 80 184 105C176 126 162 140 151 134C143 130 145 107 138 107C131 107 133 130 125 134C114 140 100 126 92 105C82 80 79 46 102 35Z"/>
          <path class="thumb-fill" d="M113 61C123 66 132 67 142 66C153 66 164 62 173 55"/>
          <path class="thumb-line" d="M75 52L55 43M199 50L220 39M74 92L49 97M204 92L227 98"/>
          <circle class="thumb-fill" cx="190" cy="29" r="10"/>
        </svg>`;case`direct-travel`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M46 132C80 119 175 118 232 136H40C30 136 33 134 46 132Z"/>
          <path class="thumb-white soft" d="M64 73C67 59 80 51 94 56C102 42 124 39 135 55C146 51 162 58 163 73H64Z"/>
          <path class="thumb-fill" d="M68 95L221 41C230 38 237 47 230 54L185 99L194 132L181 137L162 113L125 124L113 111L151 87L110 76L97 56L142 71L201 49L64 83L68 95Z"/>
          <path class="thumb-line" d="M48 104C76 98 101 99 124 105M175 35C189 26 205 25 222 30"/>
          <circle class="thumb-white" cx="78" cy="37" r="8"/>
        </svg>`;case`comprehensive-health`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M59 132C97 118 176 118 224 136H50C40 136 43 134 59 132Z"/>
          <path class="thumb-shield" d="M137 19L207 44V84C207 114 178 134 137 141C96 134 67 114 67 84V44L137 19Z"/>
          <path class="thumb-fill" d="M137 116C134 112 99 89 99 63C99 48 109 38 123 38C131 38 136 43 137 48C139 43 144 38 152 38C166 38 176 48 176 63C176 89 141 112 137 116Z"/>
          <path class="thumb-white" d="M133 62H145V78H161V90H145V106H133V90H117V78H133V62Z"/>
          <path class="thumb-line" d="M73 99L50 112M207 38L225 24"/>
        </svg>`;case`senior-care`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M61 133C97 119 179 119 223 136H52C42 136 45 134 61 133Z"/>
          <circle class="thumb-white soft" cx="142" cy="63" r="45"/>
          <circle class="thumb-fill" cx="124" cy="58" r="17"/>
          <circle class="thumb-dark" cx="167" cy="58" r="17"/>
          <path class="thumb-fill" d="M90 119C95 95 111 82 128 82C139 82 147 87 151 96C144 103 139 112 137 125H90V119Z"/>
          <path class="thumb-dark" d="M142 125C145 101 160 82 178 82C197 82 210 96 214 125H142Z"/>
          <path class="thumb-white" d="M73 102C96 106 111 115 121 130C96 132 77 124 65 109C62 105 68 101 73 102Z"/>
          <path class="thumb-white" d="M222 102C199 106 184 115 174 130C199 132 218 124 230 109C233 105 227 101 222 102Z"/>
        </svg>`;case`direct-golf`:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M54 131C93 117 178 119 228 136H46C37 136 40 133 54 131Z"/>
          <path class="thumb-line" d="M149 28V123"/>
          <path class="thumb-fill" d="M149 31L211 47L149 64V31Z"/>
          <path class="thumb-white" d="M71 125C91 107 121 98 151 100C181 102 205 112 224 126H71Z"/>
          <circle class="thumb-white" cx="104" cy="107" r="15"/>
          <circle class="thumb-dark" cx="104" cy="107" r="4"/>
          <path class="thumb-fill" d="M193 127C193 116 183 109 171 109C158 109 149 116 149 127H193Z"/>
        </svg>`;default:return`
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M58 132C96 118 177 118 224 136H50C40 136 43 134 58 132Z"/>
          <path class="thumb-shield" d="M137 19L207 44V84C207 114 178 134 137 141C96 134 67 114 67 84V44L137 19Z"/>
          <path class="thumb-white" d="M133 57H145V78H166V90H145V111H133V90H112V78H133V57Z"/>
        </svg>`}}function $({abortScan:e=!0}={}){H(),e&&L&&L.abort(),k&&=(r(k),null)}window.addEventListener(`beforeunload`,$),K();