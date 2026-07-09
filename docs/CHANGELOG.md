# Changelog

## Sprint 5.3 - Learning Experience

- Added a practical Learning topic workspace on `Learning/topic.html`.
- Added editable notes and current focus per topic.
- Added structured learning resources with title, URL, and type.
- Added practice checklist items with add, delete, and completion toggle support.
- Added automatic `lastStudy` updates after every topic workspace change.
- Moved shared `escapeHtml()` and `createId(prefix)` helpers into `assets/js/utils.js`.
- Added LocalStorage migration/defaults for `resources`, `practice`, `currentFocus`, and `lastStudy`.

## Sprint 5.2 - Learning Details

- Added universal `Learning/topic.html?id=<topic-id>` detail routing.
- Added Open links from Learning Manager cards to the universal detail page.

## Sprint 5.1 - Learning Manager

- Added LocalStorage-backed Learning Manager with CRUD, search, category filter, and status filter.
