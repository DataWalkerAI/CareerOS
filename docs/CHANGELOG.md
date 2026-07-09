# Changelog

## Sprint 7.0 - Portfolio Manager

- Added Portfolio Manager at `Portfolio/index.html` with LocalStorage-backed project CRUD.
- Added `assets/js/portfolio.js` for project search, type/status filters, edit, delete, and dashboard updates.
- Added `careeros.portfolio` storage support with normalized project records and seed projects.
- Added Portfolio dashboard statistics and sidebar navigation to the Portfolio Manager.

## Sprint 6.0 - Interview Center

- Added Interview Center with CRUD question management, review mode, search, filters, and sorting.
- Added `Interview/index.html` for the question bank and `Interview/question.html` for focused question review/editing.
- Added `careeros.interview` LocalStorage support with normalized interview question records.
- Added dashboard interview statistics for questions needing practice and mastered questions.
- Added Learning topic links that open related interview questions.

## Sprint 5.4 - UX Polish & Autosave

- Removed the manual Learning workspace save button and replaced it with 500ms debounced autosave.
- Added Saving/Saved autosave feedback, Cmd+S/Ctrl+S immediate save, and save toasts.
- Added reusable toast notifications in `assets/js/utils.js` for workspace, resource, and practice actions.
- Improved Learning resources with card-based rendering, type labels, URL/domain display, Open/Delete controls, empty states, and card transitions.
- Added Practice checklist progress with completed counts, empty states, completion toasts, and row transitions.
- Added relative last-study dates for Today, Yesterday, days ago, weeks ago, and older formatted dates.

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
