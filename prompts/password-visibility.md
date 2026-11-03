# Password visibility prompt log

## Prompt

Fix the most important problem from the GroupWatch stranger test on its own branch. Two family testers used the live app independently for about 10 minutes. Password recovery worked, but they wanted a way to reveal what they typed and check it before submitting.

Add a clear Show password / Hide password control to login, signup, new-password, and confirm-password fields. Keep passwords masked by default, preserve the typed value and password-manager autocomplete behavior, and make every control keyboard and screen-reader accessible. Do not log, store, transmit, or include any password value in test evidence.

## Implementation notes

- Added one reusable client component so every password screen behaves consistently.
- Kept each input masked by default and changed only its visual input type when toggled.
- Added button semantics, `aria-pressed`, and `aria-controls` for assistive technology.
- Preserved the existing field names, minimum length, required state, autofocus, and autocomplete values.
