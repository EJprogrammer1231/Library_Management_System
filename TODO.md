# TODO - LibraryManagementSystem (backend+DB integration)

- [ ] Inspect remaining frontend/admin service usage to ensure endpoints match expectations
- [x] Rewrite `backend/server.js` to remove `state.json` persistence and use MongoDB via Mongoose models
- [x] Add Mongoose models for Books, Reports, and Students (and any needed indexes)
- [x] Ensure existing endpoints remain compatible:
  - [x] GET/POST books + reports + students routes
- [ ] Update frontend service modules to be backend-first (load from backend; save via backend; keep localStorage as cache fallback)
- [ ] Update admin-frontend service modules similarly
- [x] Add basic backend validation and error handling
- [ ] Run backend + frontends, verify flows work and data persists in MongoDB


