# Product Requirements Document: Bubbles Web Application

**Product:** Bubbles (usebubbles.com / app.usebubbles.com)
**Version:** 1.0
**Date:** 2026-04-29

---

## Overview

Bubbles is an async video collaboration tool. This PRD covers the authentication lifecycle — logout, re-login, and all supported signup paths — so that automated Playwright tests can be generated and executed against both the marketing site (`usebubbles.com`) and the web app (`app.usebubbles.com`).

---

## Feature 1: Logout and Re-Login

### User Story
As a logged-in user, I want to log out from my profile settings so that my session is ended securely, and I want to be able to log back in afterwards.

### Flow
`Profile avatar → Settings → Profile tab → Logout button → Confirm Logout dialog → Logged out`

### Acceptance Criteria
- [ ] Clicking the profile avatar opens the user menu or navigates to Settings
- [ ] Settings page has a **Profile** tab that is selectable
- [ ] A **Logout** button is visible on the Profile settings page
- [ ] Clicking Logout triggers a confirmation dialog or prompt
- [ ] Confirming logout ends the session and redirects the user to the login/home page
- [ ] After logout, accessing `app.usebubbles.com` redirects the user to the login screen (session is cleared)
- [ ] The user can successfully log back in using their credentials after logout
- [ ] After re-login, the user lands on the Bubbles Home screen

### Edge Cases
- Clicking the browser back button after logout must not restore the authenticated session
- Cancelling the logout confirmation dialog must keep the user logged in
- Logout must work regardless of which page the user is on when they initiate it

---

## Feature 2: Sign Up — Google One-Tap (Marketing Site)

### User Story
As a new visitor on `usebubbles.com`, I want to sign up using Google One-Tap so that I can create an account quickly without filling in a form.

### Flow
`usebubbles.com homepage → Google One-Tap prompt appears → Select Google account → OTP / consent → Onboarding → Bubbles Home screen`

### Acceptance Criteria
- [ ] Google One-Tap prompt is displayed on the `usebubbles.com` homepage for unauthenticated visitors
- [ ] Selecting a Google account from the One-Tap prompt initiates the OAuth consent flow
- [ ] On successful Google authentication, the user is redirected to the onboarding flow
- [ ] Completing onboarding lands the user on the Bubbles Home screen at `app.usebubbles.com`
- [ ] The newly created account is associated with the Google email address

### Edge Cases
- Dismissing the One-Tap prompt must not break the page or prevent the user from signing up via another method
- If the Google account is already registered, the user should be logged in (not shown a duplicate account error)

---

## Feature 3: Sign Up — Google OAuth (In-App Form)

### User Story
As a new visitor on `app.usebubbles.com`, I want to sign up using my Google account from the in-app signup form so that I can create an account quickly.

### Flow
`app.usebubbles.com signup page → Click "Continue with Google" → Google OAuth consent → Onboarding → Bubbles Home screen`

### Acceptance Criteria
- [ ] The signup form at `app.usebubbles.com` displays a **Continue with Google** button
- [ ] Clicking the button opens a Google OAuth consent popup or redirect
- [ ] Completing the Google OAuth flow redirects the user back to `app.usebubbles.com`
- [ ] The user is taken through the onboarding flow after successful OAuth
- [ ] After completing onboarding, the user lands on the Bubbles Home screen
- [ ] The account is linked to the authenticated Google email

### Edge Cases
- Closing the Google OAuth popup without completing it must return the user to the signup form without errors
- An existing Google-linked account must result in login, not a duplicate account error

---

## Feature 4: Sign Up — Microsoft OAuth (In-App Form)

### User Story
As a new visitor on `app.usebubbles.com`, I want to sign up using my Microsoft account from the in-app signup form so that I can create an account via my work identity.

### Flow
`app.usebubbles.com signup page → Click "Continue with Microsoft" → Microsoft OAuth consent → Onboarding → Bubbles Home screen`

### Acceptance Criteria
- [ ] The signup form at `app.usebubbles.com` displays a **Continue with Microsoft** button
- [ ] Clicking the button opens a Microsoft OAuth consent popup or redirect
- [ ] Completing the Microsoft OAuth flow redirects the user back to `app.usebubbles.com`
- [ ] The user is taken through the onboarding flow after successful OAuth
- [ ] After completing onboarding, the user lands on the Bubbles Home screen
- [ ] The account is linked to the authenticated Microsoft / work email

### Edge Cases
- Closing the Microsoft OAuth popup without completing it must return the user to the signup form without errors
- An existing Microsoft-linked account must result in login, not a duplicate account error

---

## Feature 5: Sign Up — Name + Work Email (OTP Flow)

### User Story
As a new visitor on `app.usebubbles.com`, I want to sign up using my name and work email so that I can create an account without using a social login.

### Flow
`app.usebubbles.com signup page → Enter Name + Work Email → Continue with email → Receive OTP email → Enter OTP → Onboarding → Bubbles Home screen`

### Acceptance Criteria
- [ ] The signup form displays fields for **Name** and **Work Email**
- [ ] A **Continue with email** button is present and enabled after both fields are filled
- [ ] Submitting a valid name and work email sends a one-time passcode (OTP) to that email address
- [ ] The user is shown an OTP entry screen after clicking Continue
- [ ] Entering the correct OTP proceeds to the onboarding flow
- [ ] Completing onboarding lands the user on the Bubbles Home screen
- [ ] Entering an incorrect OTP displays a validation error and allows retry
- [ ] The OTP expires after its valid window; an expired OTP shows an appropriate error

### Edge Cases
- Submitting with an empty Name field must show a validation error
- Submitting with an empty Email field must show a validation error
- Submitting with an invalid email format (e.g. `notanemail`) must show a format validation error
- Submitting with a personal email domain (e.g. `@gmail.com`, `@yahoo.com`) may prompt the user to use a work email
- Entering only whitespace in Name or Email fields must trigger validation errors

---

## Feature 6: Sign Up — Didn't Get a Code? (Resend OTP)

### User Story
As a user waiting for an OTP, I want to request the code again if I didn't receive it so that I can complete signup without being stuck.

### Flow
`OTP entry screen → Click "Didn't get a code?" → OTP is resent to the same email → Enter new OTP → Continue`

### Acceptance Criteria
- [ ] A **Didn't get a code?** link or button is visible on the OTP entry screen
- [ ] Clicking it triggers a new OTP to be sent to the same email address
- [ ] A confirmation message or toast indicates the new code has been sent
- [ ] The newly sent OTP is valid and can be used to proceed
- [ ] The previously issued OTP is invalidated after a resend (optional but ideal)

### Edge Cases
- Rapid repeated clicks on "Didn't get a code?" must not send excessive OTP emails (rate limiting)
- The resend option should still be available if the user waits a long time on the OTP screen

---

## Feature 7: Sign Up — Change Email (During OTP Step)

### User Story
As a user on the OTP entry screen, I want to change my email address if I entered the wrong one so that the OTP is sent to the correct inbox.

### Flow
`OTP entry screen → Click "Change email" → Return to signup form with email field editable → Enter new email → Continue with email → Receive new OTP → Enter OTP → Onboarding → Bubbles Home screen`

### Acceptance Criteria
- [ ] A **Change email** link or button is visible on the OTP entry screen
- [ ] Clicking it returns the user to the signup form (or makes the email field editable)
- [ ] Previously entered Name is retained when returning to the form
- [ ] Entering a new email and clicking Continue sends a fresh OTP to the new address
- [ ] The original email's OTP is no longer valid after the email is changed
- [ ] The user can complete signup successfully with the new email OTP

### Edge Cases
- Changing to the same email address must still issue a fresh OTP
- Changing to an already-registered email should handle the conflict gracefully (login prompt or error)

---

## Out of Scope

- Password-based login (Bubbles uses passwordless / OAuth flows)
- Account deletion or data export
- In-app collaboration features (bubbles creation, sharing, commenting)
- Billing and subscription management
- Mobile native applications (iOS / Android)

---

## Test Environment Notes

| URL | Purpose |
|-----|---------|
| `https://usebubbles.com` | Marketing site — Google One-Tap signup |
| `https://app.usebubbles.com` | Web app — all in-app signup and auth flows |

### Credentials Strategy
- OAuth flows (Google, Microsoft) require real test accounts; use environment variables:
  - `BUBBLES_GOOGLE_EMAIL`, `BUBBLES_GOOGLE_PASSWORD`
  - `BUBBLES_MS_EMAIL`, `BUBBLES_MS_PASSWORD`
- Email OTP flow requires a real or disposable inbox accessible during the test run (e.g. Mailosaur, Mailinator, or a dedicated test email)
  - `BUBBLES_TEST_EMAIL` — the work email used for OTP signup tests
