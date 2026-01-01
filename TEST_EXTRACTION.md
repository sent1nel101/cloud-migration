# Quick Test: PDF/DOCX Extraction

**Status**: Build passes ✅  
**Next Step**: Manual testing with real files

---

## How to Test

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Open Resume Upload
Navigate to: http://localhost:3000/resume-upload

### 3. Upload PDF File  
- Click "Upload Resume"
- Select a PDF file
- **Check browser console** (F12 → Console tab)

### Expected Console Output (PDF):
```
[RESUME PARSER] Starting PDF extraction with pdfjs-dist...
[RESUME PARSER] Parsing PDF document...
[RESUME PARSER] PDF loaded with X pages
[RESUME PARSER] Extracted text length: XXXX chars
[RESUME PARSER] First 100 chars: John Smith Senior Software...
[RESUME REVIEW] Parsed data: Object { name: "John Smith", email: "john@example.com", ... }
```

### Expected Console Output (DOCX):
```
[RESUME PARSER] Starting DOCX extraction...
[RESUME PARSER] Buffer size: XXXX bytes
[RESUME PARSER] jszip library loaded
[RESUME PARSER] DOCX loaded as ZIP archive
[RESUME PARSER] Extracted document.xml (XXXX bytes)
[RESUME PARSER] Found XXX text elements
[RESUME PARSER] Extracted text length: XXXX chars
[RESUME PARSER] First 100 chars: Jane Doe Senior Product...
[RESUME REVIEW] Parsed data: Object { name: "Jane Doe", email: "jane@example.com", ... }
```

---

## Success Criteria

✅ **PASS** if:
- Console shows extraction logs (not empty)
- `name` field contains actual person name (NOT "%PDF-1.7" or "PK...")
- `email`, `phone`, `skills` fields populated with real data
- No errors in console

❌ **FAIL** if:
- `name` = "%PDF-1.7" or "PK\u0003\u0004..."
- Console shows no extraction logs or errors
- Fields empty or contain binary data

---

## Files to Test With

Generate sample files if needed:
- PDF: Export a Word doc as PDF, or download sample PDF resume
- DOCX: Save a resume as .docx
- TXT: Plain text resume

---

## Debugging

If extraction fails, check:

1. **Console logs** - Shows exactly where it failed
2. **Browser DevTools Network tab** - See API response
3. **Build output** - Verify `npm run build` passes
4. **Dev server** - Look for any errors in terminal

---

**Ready to test!** Run `npm run dev` and test with real resume files.
