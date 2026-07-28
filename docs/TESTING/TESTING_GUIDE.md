# Complete Testing Guide - For QA Testers

**No Coding Knowledge Required!** This guide takes you through every single feature of the T&P Portal with step-by-step instructions.

## Table of Contents

1. [What is QA Testing?](#what-is-qa-testing)
2. [How to Test the Portal](#how-to-test-the-portal)
3. [Testing Checklist](#testing-checklist)
4. [URL Map & Full App Test Flows](#url-map--full-app-test-flows)
5. [Step-by-Step Test Cases](#step-by-step-test-cases)
6. [How to Report Bugs](#how-to-report-bugs)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## URL Map & Full App Test Flows

**Base URL (local):** http://localhost:3000

### Public Pages (No Login)

| Page         | URL           | What to Verify                                      | Primary Buttons/Links                    |
| ------------ | ------------- | --------------------------------------------------- | ---------------------------------------- |
| Landing      | /             | Hero content loads, sections visible, smooth scroll | Login, Register, Explore/CTA buttons     |
| Why Recruit  | /why-recruit  | Content, cards, CTA to register                     | Register as Recruiter, Contact/CTA       |
| Placements   | /placements   | Stats, charts/cards render                          | View Details/CTA links                   |
| Login        | /login        | Form renders, validation                            | Login button, Forgot password if present |
| Logout       | /logout       | Session clears, redirect to login                   | Logout confirm (if shown)                |
| Unauthorized | /unauthorized | Access denied message                               | Back/Home or Login                       |

### Student Area (Student Login Required)

| Page         | URL                   | What to Verify                 | Primary Buttons/Links        |
| ------------ | --------------------- | ------------------------------ | ---------------------------- |
| Dashboard    | /student              | Cards, metrics, quick links    | View Jobs, View Applications |
| Profile      | /student/profile      | Form loads with data           | Edit/Save Profile            |
| Jobs         | /student/jobs         | Job list, filters, match score | View Details, Apply          |
| Applications | /student/applications | Status list, filters           | View Application             |
| Interviews   | /student/interviews   | Interview schedule list        | View Details/Join link       |
| Offers       | /student/offers       | Offer list and status          | Accept/Decline (if enabled)  |
| Resume       | /student/resume       | Upload box and resume details  | Upload, Delete               |
| Register     | /student/register     | Registration form              | Register/Submit              |

### Recruiter Area (Recruiter Login Required)

| Page      | URL                 | What to Verify        | Primary Buttons/Links       |
| --------- | ------------------- | --------------------- | --------------------------- |
| Dashboard | /recruiter          | Metrics, jobs summary | Post Job, View Applications |
| Jobs      | /recruiter/jobs     | Jobs list, job status | Post New Job, Edit, Close   |
| Rounds    | /recruiter/rounds   | Interview rounds list | Add Round, Schedule         |
| Offers    | /recruiter/offers   | Offers list           | Send Offer, Update Status   |
| Register  | /recruiter/register | Registration form     | Register/Submit             |

### Admin Area (Admin Login Required)

| Page          | URL                  | What to Verify           | Primary Buttons/Links      |
| ------------- | -------------------- | ------------------------ | -------------------------- |
| Dashboard     | /admin               | Overall stats, summaries | Quick links to modules     |
| Analytics     | /admin/analytics     | Charts load, filters     | Filter/Export (if present) |
| Announcements | /admin/announcements | List, create form        | Create Announcement        |
| Audit Logs    | /admin/audit-logs    | Logs list, filters       | Filter, Export             |
| Export        | /admin/export        | Export options list      | Download CSV/Export        |
| Jobs          | /admin/jobs          | Job list and filters     | View Job, Update Status    |
| Recruiters    | /admin/recruiters    | Recruiter list           | Approve/Reject             |
| Settings      | /admin/settings      | Settings form            | Save Settings              |

### Button Audit (For Missing Buttons)

On every page above:

1. Confirm the **primary action button** is visible (e.g., Apply, Post Job, Save, Export).
2. If missing, record:
   - URL path
   - Role used (Student/Recruiter/Admin)
   - Screenshot
   - Steps to reproduce
3. Also check **secondary actions** (Edit, Cancel, Back) where applicable.

---

## Full Application Test Flows (Simple, End-to-End)

Follow these in order to cover the whole application. Each flow includes exact URLs.

### Flow A: Public Access + Authentication

1. Open landing page: http://localhost:3000
   - Expected: Landing sections load, Login and Register visible.
2. Open /login
   - Expected: Login form, validation messages for empty submit.
3. Try wrong credentials
   - Expected: Error message, no login.
4. Login as Student
   - Expected: Redirect to /student
5. Logout from /logout
   - Expected: Session cleared, redirected to /login.
6. Try accessing /admin while logged out
   - Expected: Redirect to /unauthorized or /login.

### Flow B: Student Journey (Apply for Job)

1. Login as Student → /student
2. Go to /student/profile
   - Update profile fields → Save
   - Expected: Success message and updated data.
3. Go to /student/resume
   - Upload PDF → Expected: Resume appears, parse details visible.
4. Go to /student/jobs
   - Use filters/search, open a job
   - Expected: Eligibility criteria visible.
5. Click Apply on a job
   - Expected: Confirmation dialog, status becomes Applied.
6. Go to /student/applications
   - Expected: New application listed with correct status.
7. Go to /student/interviews (if scheduled)
   - Expected: Interview entries show date/time/link.
8. Go to /student/offers (if any)
   - Expected: Offer details visible; Accept/Decline if enabled.

### Flow C: Recruiter Journey (Post Job to Offer)

1. Login as Recruiter → /recruiter
2. Go to /recruiter/jobs
   - Click Post New Job → fill form → Submit
   - Expected: Job appears in list.
3. Open the job → View Applications
   - Expected: Applicant list with match score.
4. Update application status (Shortlist/Reject)
   - Expected: Status changes and persists after refresh.
5. Go to /recruiter/rounds
   - Add interview round → Schedule date/time
   - Expected: Round appears in list.
6. Go to /recruiter/offers
   - Send offer → Expected: Offer shows in list with status.

### Flow D: Admin Journey (Approvals + Oversight)

1. Login as Admin → /admin
2. Go to /admin/recruiters
   - Approve a pending recruiter
   - Expected: Status updates and recruiter can login.
3. Go to /admin/jobs
   - Review jobs list, filters, and status updates.
4. Go to /admin/announcements
   - Create announcement → Expected: Appears in list.
5. Go to /admin/audit-logs
   - Use filters → Expected: Logs update.
6. Go to /admin/export
   - Export CSV → Expected: File downloads.
7. Go to /admin/settings
   - Update a setting → Save
   - Expected: Success message and persisted value.

---

## What is QA Testing?

**QA = Quality Assurance**

Your job: **Make sure everything works correctly!**

### What You'll Do

✅ Create test accounts
✅ Use every feature in the portal
✅ Check if buttons work
✅ Verify information is correct
✅ Find and report problems
✅ Make sure it's user-friendly

### What You're Looking For

| Category           | Look For                               |
| ------------------ | -------------------------------------- |
| **Functionality**  | Do buttons work? Do forms submit?      |
| **Data Accuracy**  | Is information correct and consistent? |
| **User Interface** | Is it easy to use? Are buttons clear?  |
| **Performance**    | Does it load fast? Responsive?         |
| **Security**       | Can't bypass login? Data is safe?      |
| **Error Handling** | Good error messages? No crashes?       |

---

## How to Test the Portal

### Prerequisites

**What You Need:**

- Computer with internet
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Notepad or document editor (to write bug reports)
- Docker Desktop installed (for running the app)
- Test accounts (provided by team)

### Basic Test Process

```
1. Open the Website
   ↓
2. Try Feature
   ↓
3. Does it work as expected?
   ↙↘
   YES → Continue    NO → Document Bug
   ↓
4. Try Next Feature
```

### What is "Expected Behavior"?

It's what should happen according to requirements.

**Example:**

```
Feature: Login with email and password
Expected Behavior:
├─ Enter email ✓
├─ Enter password ✓
├─ Click login ✓
├─ See dashboard ✓
└─ Not see login page anymore

If You Don't See Dashboard → BUG!
```

### Test Accounts

Use these to test the system:

| Role      | Email                 | Password      | What to Look For          |
| --------- | --------------------- | ------------- | ------------------------- |
| Student   | student@nitap.ac.in   | student@123   | Job browsing, applying    |
| Recruiter | recruiter@nitap.ac.in | recruiter@123 | Job posting, applications |
| Admin     | admin@nitap.ac.in     | admin@123     | Stats, settings, exports  |

---

## Testing Checklist

### Part 1: Website Access

```
☐ Website loads (http://localhost:3000)
☐ Homepage is visible
☐ Login button is clickable
☐ Register button is clickable
☐ Website looks good on mobile (if responsive)
☐ All text is readable
☐ No broken images
```

### Part 2: Authentication

```
☐ Login with correct email/password works
☐ Login fails with wrong password
☐ Login fails with wrong email
☐ Can logout
☐ After logout, can't access dashboard
☐ Can register new account
☐ Can't register with existing email
☐ Passwords are hidden (shown as dots)
☐ Invalid email shows error
```

### Part 3: User Profiles

```
☐ Can view own profile
☐ Can edit profile details
☐ Changes save correctly
☐ Can't edit other user's profile
☐ Different roles see different information
```

### Part 4: Student Features

```
☐ Student can see "Jobs" list
☐ Student can see job details
☐ Student can apply to job
☐ Match score appears
☐ Can view own applications
☐ Application status updates
☐ Can upload resume (PDF)
☐ Resume is parsed correctly
☐ Can see extracted skills
☐ Can delete resume
```

### Part 5: Recruiter Features

```
☐ Recruiter can post job
☐ Job appears in job list
☐ Recruiter can see applications
☐ Can shortlist/reject applications
☐ Can schedule interview
☐ Can update interview result
☐ Can send job offer
☐ Recruiter dashboard stats are correct
```

### Part 6: Admin Features

```
☐ Admin can see all students
☐ Admin can see all recruiters
☐ Admin can approve recruiter
☐ Admin dashboard shows correct statistics
☐ Can export data as CSV
☐ Can view audit logs
☐ Can change system settings
☐ Can filter audit logs
```

### Part 7: Data & Numbers

```
☐ Job count is correct
☐ Application count is correct
☐ Placement statistics are accurate
☐ CGPA calculations correct
☐ Match scores reasonable (0-100%)
☐ Salary figures display correctly
☐ Dates format is consistent
```

### Part 8: Error Handling

```
☐ Form validation works (empty fields)
☐ File upload size limit enforced
☐ File upload type check (PDF only)
☐ Network error shows message
☐ Invalid input shows error
☐ 404 error on wrong URL
☐ Clear error messages (users understand)
```

### Part 9: Security

```
☐ Password never shown in plain text
☐ Can't access other user's data
☐ Can't modify others' applications
☐ Logout clears session
☐ Passwords are encrypted (stored safely)
☐ Admin can only access admin features
```

### Part 10: Performance

```
☐ Pages load in < 3 seconds
☐ Dashboard loads quickly
☐ File uploads work smoothly
☐ Buttons respond immediately
☐ No page freezes
☐ Search/filter works fast
```

---

## Step-by-Step Test Cases

### TEST CASE 1: User Registration

**Purpose:** Verify new users can register successfully

**Steps:**

1. **Open Website**
   - Open browser
   - Go to: http://localhost:3000
   - **Expected:** Homepage loads

2. **Click Register Button**
   - Look for "Register" button (top right)
   - Click it
   - **Expected:** Registration page opens

3. **Select Student Role**
   - You see three options: Student, Recruiter, Admin
   - Select "Student"
   - **Expected:** Student registration form appears

4. **Fill Registration Form**

   ```
   Name: Test Student
   Email: teststudent@email.com
   Password: TestPass123
   Branch: CSE
   Year: 2nd
   CGPA: 8.5
   ```

   - **Expected:** All fields accept input

5. **Submit Form**
   - Click "Register" button
   - **Expected:** You see "Registration Successful" message
   - **Expected:** Redirected to login page

6. **Login with New Account**
   - Email: teststudent@email.com
   - Password: TestPass123
   - Click "Login"
   - **Expected:** You see student dashboard
   - **Expected:** Name shows as "Test Student"

**Result:** ✅ PASS / ❌ FAIL

**If FAIL, Note:**

- What went wrong?
- What error message showed?
- Screenshot?

---

### TEST CASE 2: Posting and Applying to Job

**Purpose:** Verify complete job posting and application flow

**Prerequisite:** Have Recruiter and Student accounts ready

**PART A: Recruiter Posts Job**

1. **Login as Recruiter**
   - Email: recruiter@nitap.ac.in
   - Password: recruiter@123
   - **Expected:** Recruiter dashboard opens

2. **Go to Jobs Section**
   - Click "My Jobs" or "Post Job"
   - **Expected:** Job management page opens

3. **Click "Post New Job"**
   - Button should be visible
   - **Expected:** Job form appears

4. **Fill Job Form**

   ```
   Job Title: Web Developer
   Description: Build web applications
   Location: Bangalore
   Salary (CTC): 5 lakhs
   Min CGPA: 7.0
   Branches: CSE, IT
   Years: 3rd, 4th
   ```

   - Click in each field and type
   - **Expected:** All fields accept input

5. **Submit Job**
   - Click "Post Job"
   - **Expected:** Success message appears
   - **Expected:** Redirected to job list

6. **Verify Job in List**
   - Look for job in job list
   - **Expected:** "Web Developer" appears

**PART B: Student Applies to Job**

1. **Logout**
   - Click logout/profile menu
   - Click "Logout"
   - **Expected:** Logged out, back to login page

2. **Login as Student**
   - Email: student@nitap.ac.in
   - Password: student@123
   - **Expected:** Student dashboard opens

3. **Go to Jobs**
   - Click "Browse Jobs" or "Jobs" menu
   - **Expected:** Job list visible

4. **Find Posted Job**
   - Look for "Web Developer" job
   - **Expected:** Job card shows job details
   - **Expected:** Shows match score

5. **View Job Details**
   - Click on job card
   - **Expected:** Full job details show

6. **Check Eligibility**
   - Look for eligibility section
   - **Expected:** Shows:
     ```
     ✅ CGPA Match: PASS
     ✅ Branch Match: PASS
     ✅ Year Match: PASS
     ```

7. **Apply to Job**
   - Click "Apply" button
   - **Expected:** Application confirmation popup

8. **Confirm Application**
   - Click "Confirm"
   - **Expected:** Success message
   - **Expected:** Status changes to "Applied"

9. **Verify Application**
   - Click "My Applications"
   - **Expected:** "Web Developer" appears in list
   - **Expected:** Status shows "Applied"

**PART C: Recruiter Views Applicants**

1. **Logout and Login as Recruiter**
   - Logout
   - Login: recruiter@nitap.ac.in / recruiter@123

2. **View My Jobs**
   - Click "My Jobs"
   - **Expected:** "Web Developer" job visible

3. **View Applications**
   - Click on job
   - Click "View Applications" or "Applicants"
   - **Expected:** List of applicants appears

4. **Verify Student Application**
   - Look for student name in list
   - **Expected:** Shows applicant details:
     ```
     Name: student
     Email: student@nitap.ac.in
     Match Score: XX%
     Status: Applied
     ```

**Result:** ✅ PASS / ❌ FAIL

**If FAIL, Note Issues:**

- Problem at which step?
- What was expected vs actual?
- Screenshot?

---

### TEST CASE 3: Resume Upload and Parsing

**Purpose:** Verify resume upload works and is parsed correctly

**Steps:**

1. **Prepare Test Resume**
   - Create a file called "resume.pdf"
   - Content should mention:
     ```
     Skills: Python, Java, React
     CGPA: 8.5
     Education: B.Tech CSE
     ```

2. **Login as Student**
   - Email: student@nitap.ac.in
   - Password: student@123

3. **Go to Resume Section**
   - Click "My Resume"
   - **Expected:** Resume upload page opens

4. **Upload Resume**
   - Click "Upload Resume" or drag-drop area
   - Select resume.pdf file
   - **Expected:** File selection dialog appears
   - **Expected:** File selected shows in form

5. **Wait for Upload**
   - After selecting file, system processes
   - **Expected:** "Processing..." message appears
   - **Expected:** Within few seconds, completes

6. **Verify Upload Success**
   - **Expected:** Success message shows
   - **Expected:** Parsed resume displays

7. **Check Extracted Information**
   - Look for these sections:
     ```
     Skills: Python, Java, React
     CGPA from Resume: 8.5 (or similar)
     Education: B.Tech, CSE
     Keywords: [relevant words]
     ```
   - **Expected:** Skills are recognized
   - **Expected:** CGPA is extracted
   - **Expected:** Education details show

8. **Verify File Size Limit**
   - Try uploading file > 5MB
   - **Expected:** Error message: "File must be < 5MB"

9. **Verify File Type Limit**
   - Try uploading .doc or .txt file
   - **Expected:** Error message: "Must be PDF"

**Result:** ✅ PASS / ❌ FAIL

**Document Any Issues:**

- What extracted incorrectly?
- File upload error?

---

### TEST CASE 4: Admin Dashboard & Statistics

**Purpose:** Verify admin can access all statistics and features

**Steps:**

1. **Login as Admin**
   - Email: admin@nitap.ac.in
   - Password: admin@123
   - **Expected:** Admin dashboard opens

2. **Check Key Metrics**
   - Look for these cards on dashboard:
     ```
     Total Students: [number]
     Total Recruiters: [number]
     Total Jobs: [number]
     Total Applications: [number]
     ```
   - **Expected:** All show reasonable numbers

3. **Verify Numbers Make Sense**
   - Count students you created
   - Compare with "Total Students"
   - **Expected:** Number matches (or higher)

4. **View Analytics**
   - Click "Analytics" or "Statistics"
   - **Expected:** Charts and graphs visible
   - **Expected:** Data displayed clearly

5. **Check Branch-wise Stats**
   - Look for branch statistics
   - **Expected:** Shows each branch with:
     ```
     Branch: CSE
     Total: 50 students
     Placed: 45 students
     Rate: 90%
     ```

6. **View Company Stats**
   - Click "Analytics" or "Companies"
   - **Expected:** Shows:
     ```
     Company Name
     Jobs Posted
     Applications Received
     Selection Rate
     ```

7. **Access Settings**
   - Click "Settings"
   - **Expected:** Settings page opens
   - **Expected:** Shows:
     ```
     Placement Season: 2025-26
     Min CGPA Cutoff: 6.5
     Portal Open: Yes/No
     ```

8. **Export Data**
   - Click "Export"
   - **Expected:** Export options visible:
     ```
     ☐ Export Students (CSV)
     ☐ Export Recruiters (CSV)
     ☐ Export Jobs (CSV)
     ☐ Export Applications (CSV)
     ☐ Export Placements (CSV)
     ```

9. **Download CSV**
   - Click "Export Students"
   - **Expected:** File downloads (student_YYYY-MM-DD.csv)
   - **Expected:** Can open in Excel/Sheets

10. **Check Audit Logs**
    - Click "Audit Logs"
    - **Expected:** Shows list of activities:
      ```
      Timestamp | User | Action | Details
      2026-02-06 15:30 | John Smith | Created Job | Web Dev
      2026-02-06 15:25 | Jane Doe | Applied | Python Dev
      ```
    - **Expected:** Logs show recent actions

**Result:** ✅ PASS / ❌ FAIL

**Notes:**

- Are all stats visible?
- Do numbers seem correct?
- Can export successfully?

---

### TEST CASE 5: Interview & Offer Flow

**Purpose:** Verify complete interview and offer process

**Prerequisite:** Student must have applied to job and be ready

**PART A: Recruiter Schedules Interview**

1. **Login as Recruiter**
   - View job applications
   - Find student applicant

2. **Shortlist Student**
   - Click "Shortlist" button
   - **Expected:** Status changes to "Shortlisted"
   - **Expected:** Student sees status update

3. **Schedule Interview**
   - Click "Schedule Interview"
   - **Expected:** Interview scheduling form appears

4. **Fill Interview Details**

   ```
   Round Type: Technical Round 1
   Date: Select future date
   Time: 10:00 AM
   Location: Virtual (Zoom)
   Notes: Basic coding problems
   ```

   - **Expected:** All fields accept input

5. **Submit Interview Schedule**
   - Click "Schedule"
   - **Expected:** Success message
   - **Expected:** Student notification sent

**PART B: Student Views Interview**

1. **Login as Student**
   - Check "My Interviews" or dashboard
   - **Expected:** Interview appears with:
     ```
     Company: [recruiter]
     Round: Technical Round 1
     Date: [scheduled date]
     Time: [scheduled time]
     Location: [meeting location]
     ```

2. **Verify Notification**
   - **Expected:** Interview shows in notifications
   - **Expected:** Can access Zoom/meeting link

**PART C: Recruiter Updates Interview Result**

1. **Login as Recruiter**
   - Go to interview/application
   - Click "Record Interview Result"

2. **Fill Interview Result**

   ```
   Result: PASSED / FAILED
   Score: 85 (out of 100)
   Feedback: "Good problem solving, proceed to round 2"
   ```

   - **Expected:** Form accepts input

3. **Submit Result**
   - Click "Save Result"
   - **Expected:** Status updates

**PART D: Recruiter Sends Offer**

1. **From successful application**
   - Click "Create Offer" or "Send Offer"

2. **Fill Offer Details**

   ```
   Offer CTC: 6 Lakhs
   Joining Date: June 1, 2026
   Valid Until: February 20, 2026
   ```

3. **Send Offer**
   - Click "Send Offer"
   - **Expected:** Offer created
   - **Expected:** Notification sent to student

**PART E: Student Accepts Offer**

1. **Login as Student**
   - Go to "My Offers"
   - **Expected:** New offer visible

2. **Review Offer**
   - See offer details:
     ```
     Company: [recruiter company]
     CTC: 6 Lakhs
     Valid Until: [date]
     ```

3. **Accept Offer**
   - Click "Accept Offer"
   - **Expected:** Confirmation popup

4. **Confirm**
   - Click "Yes, Accept"
   - **Expected:** Status changes to "Accepted"
   - **Expected:** Confirmation message

**Result:** ✅ PASS / ❌ FAIL

**Document:**

- Where did it fail?
- Did notifications work?

---

## How to Report Bugs

### Bug Report Format

When you find a problem, document it:

```
BUG REPORT #001

Title: Logout Button Not Working

Date Found: February 6, 2026
Tester Name: John Smith

WHAT HAPPENED:
1. Logged in as student
2. Clicked "Logout" button
3. Expected: Returned to login page
4. Actual: Still on student dashboard

ERROR MESSAGE:
"Internal Server Error (500)"

SCREENSHOTS:
[Attach before and after screenshots]

STEPS TO REPRODUCE:
1. Login as student
2. Click Profile menu
3. Click Logout
4. Button doesn't respond

EXPECTED BEHAVIOR:
User should be logged out and see login page

ACTUAL BEHAVIOR:
Page doesn't change, error shows in console

SEVERITY:
🔴 Critical (Can't use feature at all)
🟠 High (Feature partially broken)
🟡 Medium (Minor issue, workaround exists)
🟢 Low (Very minor, doesn't affect usage)

BROWSER TESTED:
Chrome 122.0.0

ATTACHMENT:
error.png (screenshot of error)
```

### Severity Levels

| Level           | Impact                      | Example             |
| --------------- | --------------------------- | ------------------- |
| 🔴 **Critical** | Feature doesn't work at all | Login page crashes  |
| 🟠 **High**     | Major feature broken        | Can't upload resume |
| 🟡 **Medium**   | Workaround exists           | Wrong color button  |
| 🟢 **Low**      | Cosmetic issue              | Typo in text        |

### Info to Include

✅ **Always Include:**

- What you did (exact steps)
- What was expected
- What actually happened
- Actual error message (if any)
- Screenshot/video
- Browser and version
- Date/time
- Your username

---

## Common Issues & Solutions

### Issue 1: "File Not Uploaded"

**Cause:** File is too large or wrong type

**Solutions:**

- ✅ Ensure PDF format
- ✅ Check file < 5MB
- ✅ Try different browser
- ✅ Clear cache (Ctrl+Shift+Delete)

### Issue 2: "Application Auto-Rejected"

**Cause:** Student doesn't meet job requirements

**Check:**

- Student CGPA < Job minimum CGPA?
- Student branch not in allowed list?
- Student year not in allowed years?

**Note:** This is expected behavior if requirements not met!

### Issue 3: "Can't Find Job in List"

**Cause:** Filters are hiding the job

**Solutions:**

- ✅ Clear all filters
- ✅ Check job status (should be "Open")
- ✅ Try different search terms
- ✅ Check job posting was successful

### Issue 4: "Statistics Don't Match"

**Cause:** Data might be outdated or cached

**Solutions:**

- ✅ Refresh page (F5)
- ✅ Clear cache (Ctrl+Shift+Delete)
- ✅ Wait a few seconds, refresh
- ✅ Open in new browser tab

### Issue 5: "Can't Download CSV Export"

**Cause:** Browser blocking download

**Solutions:**

- ✅ Check download folder
- ✅ Disable pop-up blocker
- ✅ Try different browser
- ✅ Check storage space on computer

### Issue 6: "Interview Link Not Working"

**Cause:** Link expired or incorrect

**Solutions:**

- ✅ Ask recruiter to resend
- ✅ Copy-paste link carefully (no extra spaces)
- ✅ Try in different browser
- ✅ Clear cookies and try again

### Issue 7: "Match Score Seems Wrong"

**Cause:** Resume parsing might be incomplete

**Check:**

- ✅ Resume has required keywords?
- ✅ Skills clearly listed in resume?
- ✅ Resume in good format (not scanned image)?
- ✅ Re-upload resume if needed

### Issue 8: "Can't Login"

**Cause:** Wrong credentials or account issue

**Solutions:**

- ✅ Check email spelling
- ✅ Check password (case-sensitive)
- ✅ Check Caps Lock is off
- ✅ Use "Forgot Password"
- ✅ Check if account approved (for recruiters)

---

## Testing Tips & Tricks

### 👍 Do's

✅ **Test thoroughly** - Don't rush through checklist
✅ **Use multiple browsers** - Chrome, Firefox, Safari, Edge
✅ **Test on mobile** - If responsive design
✅ **Try valid & invalid data** - Check error handling
✅ **Document everything** - Detailed notes help developers
✅ **Recreate bugs** - Can you do it again?
✅ **Ask clarifying questions** - If requirement unclear
✅ **Take screenshots** - Help explain complex issues

### 👎 Don'ts

❌ **Don't skip steps** - They're there for a reason
❌ **Don't assume** - Verify everything
❌ **Don't be afraid** - Click things! That's testing!
❌ **Don't give up** - Try multiple times
❌ **Don't use same test data** - Create fresh accounts
❌ **Don't just click OK** - Read error messages
❌ **Don't test same way** - Try different approaches

### 🎯 Pro Testing Techniques

**Boundary Testing:**

```
Field: CGPA (0-10 scale)
Test: 0, 0.1, 5, 9.9, 10, 10.1, -1
Expected: 0-10 accepts, others error
```

**Error Testing:**

```
Leave fields empty → What happens?
Enter very long text → What happens?
Upload huge file → What happens?
Fast clicking → What happens?
Back button spam → What happens?
```

**Scenario Testing:**

```
What if student applies, then deletes resume?
What if recruiter posts job, then deletes it?
What if admin changes settings mid-interview?
What if network drops during upload?
```

---

## Test Reports

### Daily Test Report Template

```
DATE: February 6, 2026
TESTER: John Smith
DURATION: 3 hours

FEATURES TESTED:
✅ Student registration
✅ Job posting
✅ Job application
✅ Resume upload
⚠️  Interview scheduling (1 issue found)
❌ CSV export (couldn't test)

BUGS FOUND:
🔴 #001: Interview date picker broken
🟡 #002: Spelling error in confirmation message

TESTED ON:
✅ Chrome 122.0
✅ Firefox 123.0
❌ Safari (not available)

NOTES:
- System is stable overall
- Most features working well
- Need to fix date picker issue before release
- Performance is good
```

### Weekly Test Summary

```
Week: Feb 1-7, 2026

TOTAL TEST HOURS: 25
BUGS FOUND: 12
├─ Critical: 2
├─ High: 4
├─ Medium: 4
└─ Low: 2

FIXED THIS WEEK: 8
PENDING: 4

RELEASE READINESS: 85%

RECOMMENDATION: Can release after fixing 2 critical bugs
```

---

## Glossary

| **Term**              | **Meaning**                                |
| --------------------- | ------------------------------------------ |
| **QA**                | Quality Assurance - Testing to find issues |
| **Bug**               | Something not working as expected          |
| **Defect**            | Same as bug                                |
| **Test Case**         | Set of steps to test a feature             |
| **Severity**          | How bad is the bug?                        |
| **Regression**        | An old bug came back                       |
| **Edge Case**         | Unusual situation, unusual input           |
| **Expected Behavior** | What should happen                         |
| **Actual Behavior**   | What really happened                       |
| **RCA**               | Root Cause Analysis - Why did bug happen?  |

---

## Quick Checklist for Each Test Session

```
□ Clear browser cache before testing
□ Use fresh test account
□ Test on Chrome AND Firefox
□ Test on mobile if available
□ Try both valid and invalid input
□ Check error messages make sense
□ Verify data saves correctly
□ Check performance (loads fast?)
□ Take screenshots of bugs
□ Document findings
□ Report any issues
```

---

## Contact Team

- **Questions?** Ask developer or QA lead
- **Found bug?** File bug report immediately
- **Need test account?** Contact admin
- **Environment down?** Check project Slack

---

**Good luck with testing! You're helping make the portal better! 🚀**

For non-technical users wanting to learn the system, see: [User Learning Guides](./QUICK_START.md)
