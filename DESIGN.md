# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-07
- Primary product surfaces:
  - Intro/consent screen
  - Model loading screen
  - Guided camera scan screen
  - Estimate confirmation/correction screen
  - Manual fallback screen
  - Product recommendation result screen
- Evidence reviewed:
  - `README.md` — browser-only prototype, privacy/safety boundaries, product data notes.
  - `.omx/plans/prd-hanwha-face-insurance-recommender.md` — privacy-first, demo honesty, actual client-side inference, failure fallback, official product source constraints.
  - `.omx/plans/test-spec-hanwha-face-insurance-recommender.md` — responsive/manual QA, copy safety, privacy checks.
  - `src/main.js` — current SPA screens and state transitions.
  - `src/styles.css` — existing visual system: orange/navy palette, large rounded cards, responsive grids.
  - `src/copy.js` — Korean privacy/disclaimer microcopy.
  - `src/products.js`, `src/recommendations.js` — card metadata, reasons, official source links.
  - `output/playwright/home.png`, `output/playwright/manual-result.png` — current desktop visual baseline.
- Observed facts:
  - App is a vanilla Vite single-page app with no framework component layer.
  - UI already uses Hanwha-like orange accents, dark navy text, glassy white cards, high border radius, and card grids.
  - Camera analysis now uses a guided face-direction scan with user confirmation before recommendations.
  - Privacy and non-advice disclaimers are core acceptance criteria, not optional footer content.
- Design inferences:
  - The visual language should feel trustworthy and calm like an insurance/financial product, but remain clearly prototype/demo oriented.
  - The most important UX improvement is reducing cognitive load during camera scan and making “estimate → user confirmation → reference cards” explicit.

## Brand
- Personality:
  - Trustworthy, calm, privacy-first, modern, helpful, non-salesy.
  - Prototype/demo identity should be visible without making the app look unfinished.
- Trust signals:
  - Explicit “이미지 저장 없음 / 이미지 서버 전송 없음” badges.
  - Short privacy bullets near the primary CTA.
  - Product cards must show official source link and checked date.
  - Estimate confirmation must happen before product recommendations.
- Avoid:
  - Sales funnel aesthetics, quote/consultation/application CTAs, urgency banners.
  - Overclaiming model accuracy, suitability, eligibility, premium, or underwriting results.
  - Dense legal copy as the dominant visual element.

## Product goals
- Goals:
  - Let a user experience browser-side apparent age/gender inference safely.
  - Show 2–4 Hanwha-related product cards as reference information only.
  - Make privacy boundaries and model uncertainty understandable at a glance.
  - Support desktop and mobile web flows with graceful manual fallback.
- Non-goals:
  - No insurance sale, lead capture, quote, consultation, application, account, backend DB, or image/video storage.
  - No true identity, biological sex, legal age, health status, suitability, or premium claim.
- Success signals:
  - User can start camera only after reading concise privacy framing.
  - User can complete guided scan without rushing to read instructions.
  - User notices and can correct the estimated age/gender before seeing products.
  - Product cards feel scannable and clearly source-backed.

## Personas and jobs
- Primary personas:
  - Prototype reviewer evaluating feasibility/privacy/UX.
  - General web user trying a camera-based recommendation demo.
  - Developer/designer iterating on browser-only ML interaction.
- User jobs:
  - Understand what the app will and will not do with camera data.
  - Run a guided scan without confusion.
  - Correct inaccurate inferred age/gender.
  - Browse relevant product references and official pages.
- Key contexts of use:
  - Desktop browser during development/demo.
  - Mobile portrait browser where camera preview and controls must stack.
  - Privacy-sensitive setting where users need reassurance before granting camera permission.

## Information architecture
- Primary navigation:
  - No global navigation. Linear single-task flow with reset/manual escape actions.
- Core routes/screens:
  - Intro/consent → loading → camera scan → estimate confirmation → product result.
  - Fallback/manual path can branch from intro, camera errors, or edit action.
- Content hierarchy:
  - Screen purpose headline.
  - Immediate privacy/safety context.
  - Primary action.
  - Secondary/manual escape.
  - Details and disclaimers as supportive, not visually overwhelming.

## Design principles
- Principle 1: Privacy before novelty.
  - Camera and model features should always be framed by “no image/video storage” and correction control.
- Principle 2: Guided interaction over passive instruction.
  - Camera scan should show the next required action and completed steps, not only time-based text.
- Principle 3: Explainable reference, not recommendation authority.
  - Product cards must show why they appear and where official details live.
- Principle 4: Calm financial-product UI.
  - Use generous spacing, restrained motion, high readability, and stable layouts.
- Tradeoffs:
  - ML library size is acceptable for prototype if loading state and manual fallback are strong.
  - Do not send face-analysis diagnostics off-page; camera and inference outputs stay in the browser.

## Visual language
- Color:
  - Primary navy: `#172033` for high-trust headings/cards.
  - Primary orange: `#ff6b1a` / `#e55b18` for key CTAs and section accents.
  - Soft blue: `#2749aa`, `#edf2ff` for neutral trust badges.
  - Success green: `#137a3a`, `#ecfdf3` for completed scan steps.
  - Warm notice: `#fff7ed`, `#5d3211` for disclaimers.
  - Background: light neutral gradient; avoid saturated full-screen orange.
- Typography:
  - System Korean-first stack.
  - Large display headline on intro/result, but clamp smaller on mobile.
  - Strong section labels and concise body copy.
- Spacing/layout rhythm:
  - 8px base rhythm, cards 20–32px padding, desktop two-column where useful.
  - Important controls must remain visible without excessive vertical scrolling on mobile.
- Shape/radius/elevation:
  - Rounded cards 22–32px, buttons 14–18px, pills 999px.
  - Softer shadows than current heavy cards; reserve strongest contrast for profile/result summary.
- Motion:
  - Subtle hover/progress transitions only.
  - Respect reduced-motion; no essential information should rely on animation.
- Imagery/iconography:
  - No user image thumbnails or face snapshots.
  - Use text badges, small status dots, and simple geometric accents instead of decorative illustrations.

## Components
- Existing components to reuse:
  - `.card`, `.btn`, `.badge`, `.notice`, `.camera-grid`, `.product-card`, `.profile-card`, `.scan-*`.
- New/changed components:
  - Top-level app masthead/brand strip.
  - Hero “flow preview” / trust panel.
  - Compact disclaimer variant for repeated legal copy.
  - Guided scan card with larger phase text and step indicators.
  - Estimate confirmation summary card.
  - Product card source/caveat layout refinement.
- Variants and states:
  - Buttons: primary orange, secondary white, dark/navy optional; disabled visible.
  - Notice: warm disclaimer, compact caveat.
  - Scan steps: pending, done.
  - Product cards: default, hover/focus.
- Token/component ownership:
  - Keep tokens as CSS custom properties in `src/styles.css`.
  - Do not introduce a design system package or Tailwind for this prototype.

## Accessibility
- Target standard:
  - Aim for WCAG 2.1 AA contrast/readability where practical.
- Keyboard/focus behavior:
  - All buttons/links/forms keyboard accessible.
  - Add visible focus rings distinct from hover.
- Contrast/readability:
  - Navy/orange text must pass on white/soft backgrounds.
  - Body copy should not be too light or too small on mobile.
- Screen-reader semantics:
  - Use headings in logical order.
  - Scan progress/phase should be text-visible; future enhancement can add `aria-live`.
- Reduced motion and sensory considerations:
  - Disable hover lift/progress animation for `prefers-reduced-motion: reduce`.
  - Do not require fast head movement.

## Responsive behavior
- Supported breakpoints/devices:
  - Desktop width around 1120–1280px.
  - Tablet/mobile under 860px with single-column stacking.
  - Mobile portrait down to ~360px.
- Layout adaptations:
  - Intro: two columns desktop, single-column mobile.
  - Camera: video first, scan controls below/above depending single-column flow.
  - Results: profile summary first, cards one column on mobile.
- Touch/hover differences:
  - Touch targets at least ~44px high.
  - Hover effects are progressive enhancement only.

## Interaction states
- Loading:
  - Model loading screen should explain browser ML initialization.
- Empty:
  - No face / unsupported camera should move to manual fallback with retry.
- Error:
  - Camera permission and model errors must be specific enough to act on.
- Success:
  - Scan completed state should be clear before confirmation screen.
- Disabled:
  - Disabled scan button should communicate processing without layout shift.
- Offline/slow network, if applicable:
  - Model CDN failure should show manual fallback; no special offline mode currently.

## Content voice
- Tone:
  - Plain Korean, calm, direct, transparent.
  - Use “참고”, “추정”, “확인”, “공식 출처” consistently.
- Terminology:
  - Prefer “추정 나이/성별”, “모델 점수”, “얼굴 감지 품질”.
  - Avoid “정확한”, “추천 적합”, “가입 가능”, “보험료 확인/계산”, “상담 신청”.
- Microcopy rules:
  - Every model result must invite correction.
  - Product reason copy must explain display logic without implying suitability.
  - Repeated disclaimer can be compact after the intro but must remain visible.

## Implementation constraints
- Framework/styling system:
  - Vanilla JS + Vite + CSS. No framework or heavy UI library.
- Design-token constraints:
  - CSS variables only; refactor current hard-coded colors/radii into tokens where practical.
- Performance constraints:
  - ML chunk is already large; avoid adding visual dependencies or icon packs.
  - Keep animations CSS-only and minimal.
- Compatibility constraints:
  - Mobile/desktop web; camera requires localhost/HTTPS depending browser.
- Test/screenshot expectations:
  - `npm test` and `npm run build` must pass after UI changes.
  - Browser snapshot should show intro and manual/result flows remain navigable.
  - No added banned copy or lead-capture fields.

## Open questions
- [x] Remove debug-mode numeric logging from demo builds. / owner: product-dev / impact: privacy messaging clarity
- [ ] Is there an official Hanwha brand guideline asset/color palette to align with beyond the current orange/navy inference? / owner: design/product / impact: brand fidelity
- [ ] Should a future visual reference be generated and matched with `$visual-ralph` after this design contract? / owner: user / impact: pixel-level polish
