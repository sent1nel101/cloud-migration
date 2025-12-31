# Session 34: Next Tasks - Resource Integration & Testing

**Status**: Ready to Start  
**Priority**: High (last work before production deployment)  
**Estimated Time**: 1 hour

---

## 📋 Task Checklist for Next Session

### Task 1: Integrate Resource Links into API (20 min)
**File**: `app/api/roadmap/route.ts`

**What to do**:
1. Import resources at top:
   ```typescript
   import { getResourcesForRole } from "@/lib/resources"
   ```

2. In the `generateRoadmapWithAI` function, after line 606 where roadmap is generated:
   ```typescript
   // Get real resources for the target role
   const roleResources = getResourcesForRole(roadmap.title)
   ```

3. Update the template to include real resources in professional/premium content sections:
   - Replace placeholder courses with `roleResources.courses`
   - Replace placeholder certifications with `roleResources.certifications`
   - **ADD NEW**: Include `roleResources.communities` in the response

4. Test: Generate a roadmap, verify courses/certs/communities have real URLs

**Key Points**:
- `getResourcesForRole()` takes role name and returns courses, certs, communities
- Fallback to Cloud Architect resources if role not found
- All URLs are real, tested links

---

### Task 2: Add Communities Section to RoadmapDisplay (15 min)
**File**: `components/RoadmapDisplay.tsx`

**What to do**:
1. Find where certifications are rendered (around line 180-240)
2. After certifications section, add communities section:
   ```typescript
   {premium && roadmap.premium_tier_content?.communities && (
     <div className="communities-section">
       <h4>Communities</h4>
       <div className="communities-list">
         {roadmap.premium_tier_content.communities.map((community, idx) => (
           <a 
             key={idx}
             href={community.url}
             target="_blank"
             rel="noopener noreferrer"
             className="community-link"
           >
             {community.name}
           </a>
         ))}
       </div>
     </div>
   )}
   ```

3. Add CSS styling to `app/globals.css`:
   ```css
   .communities-section {
     margin-top: 2rem;
   }
   
   .communities-list {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
     gap: 1rem;
   }
   
   .community-link {
     padding: 0.75rem 1rem;
     background: var(--secondary-light);
     border-radius: 0.5rem;
     text-decoration: none;
     color: var(--text-primary);
     transition: background 0.3s;
   }
   
   .community-link:hover {
     background: var(--secondary);
   }
   ```

**Key Points**:
- Communities section should display after certifications
- Each link opens in new tab
- Links should have noopener/noreferrer for security

---

### Task 3: Test End-to-End (15 min)

**Test Scenario 1: Professional Tier**
1. Create account (if needed)
2. Go to features-pricing
3. Click "Upgrade to Professional" → $39
4. Complete payment with test card: `4242 4242 4242 4242`
5. Go to home page
6. Fill form: role=Cloud Architect, years=5, goals=learn cloud, skills=python,docker
7. Generate roadmap
8. Verify:
   - ✅ Roadmap displays (no errors)
   - ✅ "Curated course links" section has real URLs
   - ✅ Links point to Coursera, Udemy, etc.
   - ✅ Click a link, verify it opens in new tab

**Test Scenario 2: Premium Tier**
1. From dashboard, upgrade to Premium → $129
2. Complete payment
3. From dashboard, click "Edit Inputs" on previous roadmap
4. Verify:
   - ✅ Form prefills with original role, years, goals, skills, education
   - ✅ Can modify fields
   - ✅ Click "Generate Roadmap"
5. Verify roadmap shows:
   - ✅ "AI-Powered Resume Rewrites" section (4 tabs)
   - ✅ "Certification Roadmap by ROI" section
   - ✅ **NEW**: "Communities" section with real links (Reddit, Slack, Discord, etc.)
   - ✅ All sections have real URLs

**Test Scenario 3: Tier Hierarchy**
1. As Premium user, go to features-pricing
2. Verify:
   - ✅ "Get Started Free" button is DISABLED (can't downgrade)
   - ✅ "Upgrade to Professional" button is DISABLED (can't downgrade)
   - ✅ "Get Premium" button shows "Current Plan"
3. As Professional user:
   - ✅ "Get Started Free" button DISABLED
   - ✅ "Upgrade to Professional" shows "Current Plan"
   - ✅ "Get Premium" ENABLED

---

## 🔧 Code References

### Resource URLs Available
See `lib/resources.ts` for all available roles and links:
- Cloud Architect
- Cloud Engineer  
- Data Engineer
- DevOps Engineer
- Solutions Architect

Each has courses, certifications, and communities.

### API Template Structure
Current template in `app/api/roadmap/route.ts` expects:
```typescript
{
  professional_tier_content: {
    courses: [...],
    portfolio_ideas: [...],
    skills_gap: [...]
    // ADD: certifications_with_roi
    // ADD: communities
  },
  premium_tier_content: {
    // Same structure
  }
}
```

---

## 🚀 After These Tasks

**Remaining Work**:
1. Run Prisma migration on production database:
   ```bash
   npx prisma db push --url="postgresql://..." --accept-data-loss
   ```

2. Test on production environment

3. Deploy to production (Vercel)

**Timeline**: 
- Task 1+2+3: ~1 hour
- Production setup: ~30 min
- **Total**: 1.5 hours to production ready

---

## 📌 Important Notes

1. **Resource Database is Complete**: All 70+ links are real, tested, and up-to-date
2. **No Breaking Changes**: Integration is purely additive
3. **Backward Compatible**: Old roadmaps still work, new ones have real links
4. **Test Thoroughly**: This is last work before production

---

## 📞 Quick Reference

**If Build Fails**:
1. Check imports at top of route files
2. Verify `getResourcesForRole()` function signature
3. Run `npx prisma generate` to regenerate client

**If Resources Don't Show**:
1. Verify API returns courses/certifications/communities in JSON
2. Check RoadmapDisplay component is rendering these sections
3. Check browser console for JavaScript errors

**If Links Don't Work**:
1. Verify URLs in `lib/resources.ts` are correct
2. Test links manually in browser
3. Check for typos in role name matching

---

**Previous**: SESSION_33_SUMMARY.md  
**Current**: NEXT_SESSION_TASKS.md  
**Next**: Production Deployment (Session 35)
