# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are solo self-trackers: individuals managing weight or energy balance who already think in deficit / maintenance / surplus terms. They want a low-friction daily check-in and a honest history over time — not meal logging, coaching, or a calorie spreadsheet.

## Product Purpose

CircaCal lets someone record, once per calendar day in their time zone, whether they ate in a rough deficit, at maintenance, or in a surplus. Optional body metrics (weight, height, notes) and statistics over daily picks help them stay honest and see patterns. Success is consistent, low-friction directional logging — not precise calorie accounting.

## Positioning

The meaningfully different mechanism is a three-choice daily energy estimate instead of calorie counting or meal logging. Neighboring calorie apps cannot truthfully claim the same job: one honest rough label per day, reset nightly in the user’s time zone, with stats and body metrics as supporting context.

## Operating Context

Used as a personal web app: sign up / sign in with email, set a time zone, open the dashboard to log today’s energy estimate (changeable until the day rolls over), review statistics history, and maintain body-metric logs. Dark/light theme is available. Email verification and password reset are part of the auth flow.

## Capabilities and Constraints

Confirmed today:

- Daily energy record: exactly one of deficit, maintenance, or surplus per user per calendar date (timezone-aware).
- Statistics over historical daily picks.
- Body metric logs: optional weight (kg/lb), height (cm/in), and notes.
- Account settings: time zone.
- Auth: Better Auth email/password with verification and password reset; Resend for outbound email when configured.

Constraints:

- Do not invent testimonials, customers, benchmarks, pricing, licensing claims, or medical advice.
- No calorie counting, food database, meal logging, macros, or coaching in the current product truth.
- MIT-licensed personal project (copyright tanuv, 2026).

Undecided: growth into meal/calorie/coaching features is not approved; treat as out of scope until explicitly reopened.

## Brand Commitments

- Product name: **CircaCal**
- Existing mark: flame icon + wordmark (`app/components/circacal-logo.tsx`); favicon at `public/circacal-icon.svg`
- Marketing voice on the landing page is plain and practical (“Skip the spreadsheet”, deficit / maintenance / surplus)
- No separate brand book or locked palette was confirmed in init

## Evidence on Hand

- Runnable product UI and copy in `app/routes/landing-page.tsx`, dashboard, statistics, body-metrics, settings, and auth routes
- Domain model in `prisma/schema.prisma` (`DailyEnergyRecord`, `BodyMetricLog`, estimate enums)
- Estimate UX copy and colors in `app/lib/estimate-config.ts`
- No customer testimonials, case studies, press, or third-party proof assets — do not fabricate them

## Product Principles

1. One honest daily label beats precise tracking the user will abandon.
2. The calendar day and time zone define the unit of logging; never blur “today.”
3. Body metrics and statistics support honesty over time; they are not the primary loop.
4. Stay a personal energy check-in — do not drift into calorie apps by default.
5. Only claim what the product and real assets can support.
