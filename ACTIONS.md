# Actions & Progress Tracking

**Session**: Session 38 - Resume Upload & Parsing  
**Status**: Planning Phase  
**Target**: Enable users to upload resumes and auto-populate roadmap form with parsed data

---

## Current Context

### Completed Work
- ✅ Session 37: Fixed goals/education columns (raw SQL) + created /roadmap-generator page
- ✅ User authentication and dashboard working
- ✅ Roadmap generation and form prefilling functional
- ✅ All 32 pages building successfully (0 TypeScript errors)

### What's Working
- Users can sign up/login
- Users can generate roadmaps on home page (unauthenticated) or /roadmap-generator (authenticated)
- Dashboard shows saved roadmaps with Edit Inputs button
- Form prefills from URL params (role, years, goals, skills, education)

---

## Session 38 Plan: Resume Upload & Parsing

### Architecture Overview
```
User Flow:
1. Upload Resume → /resume-upload (drag-drop file)
2. Parse Resume → Backend extracts data
3. Review Parsed Data → /resume-review (form with prefilled + missing fields highlighted)
4. Generate Roadmap → /roadmap-generator with form data
```

### Tech Decisions Needed
1. **Resume Parsing Library**:
   - Option A: `pdf-parse` + `docx` + text parsing (npm packages)
   - Option B: `Tesseract.js` (OCR for scanned PDFs)
   - Option C: Third-party API (uploadcare.com, cloudinary, etc.)
   - **Recommendation**: Option A - lightweight, no external dependencies

2. **File Upload Method**:
   - Client-side: FormData + multipart/form-data
   - Server-side: tmp file storage or in-memory parsing
   - Route: POST `/api/resume/parse`

3. **Data Extraction Strategy**:
   - PDF: `pdf-parse` library
   - DOCX: `docx-parser` or `mammoth`
   - TXT: regex patterns
   - Output: Structured object matching CareerInput interface

### Implementation Phases

#### Phase 1: Resume Upload Component (2 hours)
- [ ] Create `/app/resume-upload/page.tsx`
  - Drag-and-drop file input
  - File type validation (.pdf, .docx, .txt)
  - File size limit (5MB)
  - Upload button with loading state
  
- [ ] Create `/components/ResumeUploadForm.tsx`
  - Form state management
  - File validation
  - Error display
  - Progress feedback

#### Phase 2: Resume Parser Service (3 hours)
- [ ] Install packages: `pdf-parse`, `docx`
- [ ] Create `/lib/resume-parser.ts`
  - `parseResume(file)` - main entry point
  - `extractPDF(buffer)` - extract text from PDF
  - `extractDOCX(buffer)` - extract text from DOCX
  - `extractTXT(text)` - parse plain text
  - `structureData(extractedText)` - convert to structured format
  
- [ ] Create `/app/api/resume/parse` route
  - Accept file upload
  - Validate file size/type
  - Call parser service
  - Return structured data or errors

#### Phase 3: Resume Review Page (2 hours)
- [ ] Create `/app/resume-review/page.tsx`
  - Display parsed data with edit capability
  - Highlight missing required fields
  - Show field status: filled / missing
  - Allow user to add/edit any field
  - Form validation before proceeding

- [ ] Update `InputForm` component if needed for resume context

#### Phase 4: Integration (1 hour)
- [ ] Add "Upload Resume" link to Header (authenticated users)
- [ ] Add "Upload Resume" button to dashboard sidebar
- [ ] Create workflow navigation: upload → review → generate
- [ ] Update /roadmap-generator to accept resume context

#### Phase 5: Testing (1 hour)
- [ ] Create sample test resumes
- [ ] Test PDF parsing
- [ ] Test DOCX parsing  
- [ ] Test TXT parsing
- [ ] Test missing field detection
- [ ] Test mobile upload UX
- [ ] Build passes without errors

---

## Dependencies to Install

```bash
npm install pdf-parse docx
```

---

## Database Changes
**None** - Resume upload is transient (not stored). Only user completes the generated roadmap.

---

## Files to Create
- `app/resume-upload/page.tsx` - Upload page
- `app/resume-review/page.tsx` - Review & edit page
- `components/ResumeUploadForm.tsx` - Upload form component
- `lib/resume-parser.ts` - Parser service
- `app/api/resume/parse/route.ts` - Parse API endpoint

---

## Files to Modify
- `components/Header.tsx` - Add upload link
- `app/dashboard/page.tsx` - Add upload link to sidebar
- `types/index.ts` - Add ResumeParseResult interface if needed

---

## Risk Assessment
- **Low Risk**: Using npm libraries for parsing
- **Medium Risk**: Handling different resume formats consistently
- **Testing Required**: Edge cases (corrupted files, unusual formats)

---

## Success Criteria
- ✅ User can upload .pdf, .docx, .txt files
- ✅ Parser extracts: name, email, current role, experience, skills, education
- ✅ Missing required fields highlighted in review form
- ✅ User can edit all fields before generating roadmap
- ✅ Form submits to /roadmap-generator with prefilled data
- ✅ Build passes with 0 errors
- ✅ All 3 file formats tested

---

## Next Steps After Resume Upload
1. Add video tutorial generation (for PREMIUM tier)
2. Add progress tracking dashboard
3. Add job matching recommendations
4. Add community forums
