# Admin's Complete Guide

**For: System Administrators & Portal Managers**

Learn how to manage the T&P Portal, approve recruiters, view statistics, export data, and configure system settings.

---

## Table of Contents

1. [Admin Dashboard Overview](#admin-dashboard-overview)
2. [Approving Recruiters](#approving-recruiters)
3. [Managing Students & Data](#managing-students--data)
4. [Analytics & Statistics](#analytics--statistics)
5. [Exporting Data](#exporting-data)
6. [Portal Settings](#portal-settings)
7. [Audit & Security](#audit--security)
8. [Troubleshooting](#troubleshooting)

---

## Admin Dashboard Overview

### What Can You Do?

As an admin, you control and monitor the entire portal:

```
👥 User Management
   ├─ Approve recruiter registrations
   ├─ View all student profiles
   ├─ View all recruiter details
   └─ Monitor user activity

📊 Analytics & Reports
   ├─ View placement statistics
   ├─ Branch-wise placement data
   ├─ Company-wise hiring data
   ├─ Placement trends
   └─ Gender statistics

🔧 System Configuration
   ├─ Set CGPA cutoff
   ├─ Configure placement season
   ├─ Manage system settings
   ├─ Update email templates
   └─ Configure notifications

📥 Data Management
   ├─ Export student data (CSV)
   ├─ Export recruiter data (CSV)
   ├─ Export job postings (CSV)
   ├─ Export applications (CSV)
   ├─ Export placements (CSV)
   └─ Import bulk data (if available)

🔐 Security & Audit
   ├─ View audit logs (all activities)
   ├─ Track user actions
   ├─ Monitor failed login attempts
   ├─ Review sensitive operations
   └─ Generate compliance reports
```

### Admin Dashboard Layout

```
┌────────────────────────────────────────────────┐
│           ADMIN DASHBOARD                      │
├────────────────────────────────────────────────┤
│                                                │
│  📊 QUICK STATISTICS                           │
│  ┌──────────────────────────────────────────┐ │
│  │ Total Students:    450                   │ │
│  │ Total Recruiters:   25                   │ │
│  │ Total Jobs:         32                   │ │
│  │ Total Applications: 1,240                │ │
│  │ Placements:        180 (40%)             │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  📋 PENDING ACTIONS                            │
│  ├─ 3 recruiter registrations awaiting        │
│  └─ 2 system settings to configure            │
│                                                │
│  🔗 QUICK ACTIONS                              │
│  [View All Students] [View Recruiters]         │
│  [View Analytics] [View Audit Log]             │
│  [Export Data] [Settings] [Email Templates]    │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Approving Recruiters

### Why Approval Process?

- Verify recruiters are legitimate companies
- Prevent fake/spam recruiters
- Maintain quality of job postings
- Protect student data

### Recruiter Registration Queue

#### Step-by-Step:

1. **Go to Recruiters Section**
   - Click "Manage Recruiters"
   - **You see:** Lists of recruiters

2. **Find Pending Recruiters**
   - Filter: "Status = Pending Approval"
   - **Shows:** New recruiter registrations waiting

3. **View Recruiter Details**

   Click on recruiter name:

   ```
   Company Name: TechCorp India Pvt Ltd
   Company Email: recruitment@techcorp.com
   Company Phone: +91-080-XXXX-XXXX
   Website: www.techcorp.com

   HR Contact:
   Name: Priya Sharma
   Email: priya@techcorp.com
   Phone: 9876543210

   Company Description:
   "Leading cloud solutions provider with 200+ employees..."

   Registration Date: Feb 5, 2026
   Status: Pending Approval
   ```

4. **Verify Information**

   **Check List:**

   ```
   ✅ Company details reasonable?
   ✅ Email seems legitimate? (not @gmail.com)
   ✅ Website exists and working?
   ✅ HR contact provided?
   ✅ No red flags (spam signs)?
   ✅ Know this company? (search reputation)
   ```

5. **Make Decision**

   **Option 1: Approve**
   - Click "[Approve]" button
   - Confirmation: "Approve this recruiter?"
   - Click "Yes"
   - **Result:**
     ```
     ✅ Recruiter account activated
     ✅ Email sent: "Your account approved"
     ✅ Can now post jobs
     ✅ Appears in recruiter list
     ```

   **Option 2: Reject**
   - Click "[Reject]" button
   - Field: "Rejection Reason"
   - Examples:
     ```
     "Company not verified as legitimate"
     "Duplicate registration by same company"
     "Policy violation in registration details"
     "Unable to verify company information"
     ```
   - Click "Reject"
   - **Result:**
     ```
     ❌ Account deactivated
     📧 Email sent with rejection reason
     📧 Can reapply if issues resolved
     ```

   **Option 3: Request More Info**
   - Click "[Request Information]"
   - Field: "What additional info needed?"
   - Message:
     ```
     "Please provide your company's LinkedIn profile
     and official registration number."
     ```
   - Click "Send"
   - **Result:**
     ```
     📧 Recruiter gets message
     Status: "Awaiting Additional Info"
     ```

### Manage Active Recruiters

**On "Manage Recruiters" page:**

#### Suspend a Recruiter

If recruiter behaves badly:

1. Click recruiter name
2. Click "[Suspend Account]"
3. Reason: "Inappropriate job postings"
4. **Result:** Can't post jobs, can't see applications

#### Reactivate Recruiter

If previously suspended:

1. Click "[Reactivate]"
2. Reason: "Issues have been resolved"
3. **Result:** Can post jobs again

#### Delete Recruiter

⚠️ **Caution:** Deleting is permanent!

1. Click "[Delete]" (if must delete)
2. Confirm: "Delete permanently?"
3. **Result:** All their data removed

---

## Managing Students & Data

### View All Students

#### Step-by-Step:

1. **Go to Students Section**
   - Click "Manage Students"
   - **Shows:** List of all registered students

2. **Understand the List**

   ```
   Name        | Branch | Year | CGPA | Phone | Status
   ─────────────────────────────────────────────────────
   John Sharma | CSE    | 4th  | 8.2  | 9876.. | Active
   Priya Patel | IT     | 3rd  | 7.5  | 9876.. | Active
   Rahul Singh | CSE    | 4th  | 6.8  | 9876.. | Profile Inc.
   ```

   - **Status:**
     - Active: Complete profile, can apply
     - Profile Incomplete: Need more info
     - Suspended: Can't apply (if violated rules)

3. **Search a Student**
   - Field: "Search by name/email"
   - Results filter automatically

4. **Filter Students**

   ```
   Filter by:
   ☐ Branch (CSE, IT, ECE, ME)
   ☐ Year (3rd, 4th)
   ☐ CGPA Range (6.0-10.0)
   ☐ Status (Active, Inactive, Incomplete)
   ☐ Placed (Yes, No, Offers Pending)
   ```

### View Student Profile

**Click on student name:**

```
Personal Information:
├─ Name: John Sharma
├─ Email: john@college.ac.in
├─ Phone: 9876543210
├─ Branch: CSE
├─ Year: 4th
├─ CGPA: 8.2
├─ Gender: Male (for statistics)
└─ Graduation Date: June 2026

Contact Information:
├─ Address: Bangalore
├─ LinkedIn: linkedin.com/in/johnSharma
└─ GitHub: github.com/johnSharma

Resume:
├─ Uploaded: Yes
├─ File: resume.pdf
├─ Skills: Python, Java, React
└─ [Download Resume]

Applications:
├─ Web Dev: Applied
├─ Data Ana: Shortlisted
└─ Cloud Eng: Rejected

Placements:
├─ Offers Sent: 1
├─ Offers Accepted: 1
└─ Joining Date: June 1, 2026
```

### Bulk Student Management

**If you need to manage many students:**

1. **Select Multiple**
   - Checkboxes next to names
   - Click checkboxes for students to manage

2. **Bulk Actions**

   ```
   Options:
   - Notify Selected (send message to all)
   - Export Selected (CSV download)
   - Add Note (bulk notes)
   - Change Status (if needed)
   ```

3. **Example: Notify Students**
   - Select 10 students
   - Click "Notify Selected"
   - Subject: "Placement Drive This Friday"
   - Message: "3 companies recruiting..."
   - Click "Send to All"
   - **Result:** All 10 get notification

---

## Analytics & Statistics

### View Dashboard Statistics

Auto-updated statistics on main dashboard:

```
📊 Placement Overview
├─ Total Students: 450
├─ Total Placements: 180
├─ Placement Rate: 40%
└─ Average CTC: 6.2 Lakhs

📈 This Semester (2025-26)
├─ New Placements: 120
├─ Companies Visiting: 25
├─ Jobs Posted: 32
└─ Average Processing Time: 12 days

🏢 Top Recruiting Companies
├─ TechCorp: 15 placements
├─ CloudInc: 12 placements
├─ DataSys: 10 placements
├─ WebDev Corp: 8 placements
└─ Others: 135 placements

📚 Branch-Wise Placement
├─ CSE: 92 placed / 200 students (46%)
├─ IT: 65 placed / 150 students (43%)
├─ ECE: 18 placed / 80 students (23%)
└─ ME: 5 placed / 20 students (25%)
```

### Detailed Analytics

#### Branch-Wise Report

1. **Click "Analytics"**
2. **Select "By Branch"**
3. **You see:**

```
Branch: CSE
├─ Total Students: 200
├─ Actively Placed: 92 (46%)
├─ Holding Offers: 12 (6%)
├─ Interview Pending: 25 (12%)
├─ Applied: 30 (15%)
├─ Not Applied: 41 (21%)
├─ Avg CGPA: 7.8
└─ Avg CTC: 6.5 Lakhs
```

**What it tells you:**

- 46% already have jobs = success!
- 6% have offers coming = likely 52%
- 25 still in interviews = likely 50-55%
- 41 haven't applied = concern?

#### Year-Wise Report

```
Year: 4th Year Students
├─ Placement Rate: 42%
├─ Avg CTC: 6.4 Lakhs
└─ Top Company: TechCorp (15 students)

Year: 3rd Year Students
├─ Can apply: Yes (but rare)
├─ Placement Rate: 5%
└─ Avg CTC: 6.8 Lakhs (for those placed)
```

#### Company-Wise Report

```
Company: TechCorp India
├─ Jobs Posted: 5
├─ Applications: 50
├─ Selections: 15
├─ Selection Rate: 30%
├─ Avg Salary: 6.5 Lakhs
└─ Hiring Manager: Priya Sharma
```

#### Salary Insights

```
📊 CTC Distribution
├─ <4 Lakhs: 10%
├─ 4-5 Lakhs: 20%
├─ 5-7 Lakhs: 45%
├─ 7-10 Lakhs: 20%
└─ >10 Lakhs: 5%

Average CTC: 6.2 Lakhs
Median CTC: 6.0 Lakhs
Highest CTC: 25 Lakhs
```

---

## Exporting Data

### Export Student Data

#### Step-by-Step:

1. **Click "Export"**
   - Navigation: Admin menu → Export

2. **Select "Students"**
   - Click "Export Students"
   - File generated

3. **File Downloads**
   - Filename: `students_2026-02-06.csv`
   - Contains:
     ```
     Name, Email, Phone, Branch, Year, CGPA,
     Graduation Date, LinkedIn, GitHub
     ```

4. **Use the Data**
   - View in Excel/Google Sheets
   - Share with placement team
   - Use for notifications
   - Analysis/reports

### Export Recruiters Data

**File:** `recruiters_2026-02-06.csv`

Contains:

```
Company Name, Email, Phone, Website,
HR Contact, HR Email, HR Phone,
Active Since, Jobs Posted, Selections
```

### Export Jobs Data

**File:** `jobs_2026-02-06.csv`

Contains:

```
Job Title, Company, Location, Salary,
CGPA Required, Branches, Posted Date,
Status, Applications, Shortlisted
```

### Export Applications Data

**File:** `applications_2026-02-06.csv`

Contains:

```
Student Name, Job Title, Company,
Apply Date, Status, CGPA, Branch,
Match Score, Interview Scheduled,
Interview Date, Result
```

### Export Placement Data

**File:** `placements_2026-02-06.csv`

Contains:

```
Student Name, Company, Job Title,
CTC, Joining Date, Acceptance Date,
Branch, CGPA, Graduation
```

### Bulk Export (All Data)

1. **Click "Export All Data"**
2. **Files generated:**

   ```
   📦 placement_data_2026-02-06.zip
   ├─ students.csv
   ├─ recruiters.csv
   ├─ jobs.csv
   ├─ applications.csv
   ├─ placements.csv
   ├─ audit_logs.csv
   └─ statistics.pdf
   ```

3. **Download & Extract**
   - Gets .zip file (all data)
   - Extract to folder
   - Open in Excel/Google Sheets

---

## Portal Settings

### Access Settings

1. **Click "Settings"**
   - Admin menu → Settings
   - **Shows:** System configuration page

### Configure Placement Season

```
Current Season: 2025-26 Campus Placements

Settings:
├─ Season Name: 2025-26 Placements
├─ Start Date: January 1, 2026
├─ End Date: June 30, 2026
├─ Status: Active ✓
└─ [Update]
```

**What it does:**

- Student notices show current season
- Reports organize by season
- Helps track multi-year data

### Set Minimum CGPA

```
Global Settings
├─ Minimum CGPA to Apply: 6.0
│  (Students below can't apply to any job)
│
├─ Minimum CGPA Cutoff: 5.5
│  (Absolute minimum, even if job allows)
│
└─ [Update]
```

**Impact:**

- Set 6.0 = Only 6.0+ CGPA can apply
- Companies can require higher (7.0)
- Auto-rejects if below global minimum

### Set Salary Range

```
Expected Salary Settings
├─ Minimum Salary: 3 Lakhs
│  (Warn if less than this)
│
├─ Maximum Salary: 50 Lakhs
│  (Warn if more than this)
│
└─ [Update]
```

### Enable/Disable Portal

```
Portal Status
├─ Is Portal Open?
│  ☑ YES - Students can apply
│  ☐ NO - Portal closed
│
├─ Allow Recruiter Registration?
│  ☑ YES - Companies can register
│  ☐ NO - Can't register (e.g., season ended)
│
└─ [Update]
```

**Scenario:**

- Before placement season: Disable portal
- During season: Enable students
- Accepting only new jobs: Disable recruiter signup
- Season ended: Close portal

### Configure Notifications

```
Email Notifications
├─ ☑ Notify on Application
├─ ☑ Notify on Shortlist
├─ ☑ Notify on Interview Scheduled
├─ ☑ Notify on Offer Sent
├─ ☑ Notify on Placement
└─ [Update]

SMS Notifications (if enabled)
├─ ☑ Interview Reminders (24 hours before)
├─ ☑ Offer Expiry Reminder (3 days before)
└─ [Update]
```

### Email Templates

**Customize automatic emails sent:**

1. **Click "Email Templates"**
2. **Choose Template:**

   ```
   ☐ Application Received
   ☐ Shortlist Notification
   ☐ Interview Scheduled
   ☐ Interview Reminder
   ☐ Offer Sent
   ☐ Placement Confirmed
   ☐ Recruiter Approved
   └─ [Choose]
   ```

3. **Edit Template**

   Example: "Application Received"

   ```
   Subject: Your Application to [Job Title] at [Company]

   Body:
   Dear [Student Name],

   Thank you for applying to the position of [Job Title]
   at [Company Name].

   We have received your application and resume. You will
   hear from us within 5-7 days about the screening results.

   Best regards,
   T&P Team
   NIT Andhra Pradesh
   ```

4. **Available Variables:**

   ```
   [Student Name], [Company Name], [Job Title],
   [Interview Date], [Interview Time], [Interview Link],
   [CTC], [Offer Valid Until], etc.
   ```

5. **Save Template**
   - Update text as needed
   - Click "[Save]"
   - **Result:** All future emails use new template

---

## Audit & Security

### View Audit Logs

**Track all system activities:**

1. **Click "Audit Logs"**
   - Shows all user actions
   - **Includes:** Who, what, when

2. **Understand the Log**

   ```
   Timestamp        | User               | Action         | Details
   ─────────────────────────────────────────────────────────────────
   2026-02-06 15:30 | Priya Sharma (R)   | Posted Job     | Web Dev
   2026-02-06 15:25 | John (S)           | Applied        | Python Dev
   2026-02-06 15:20 | Admin              | Approved Rec.  | TechCorp
   2026-02-06 15:15 | Jane (R)           | Scheduled Int. | John Sharma
   2026-02-06 15:10 | John (S)           | Uploaded Resume| NIT...pdf
   2026-02-06 15:05 | Admin              | Changed Setting| Min CGPA

   Legend: (R) = Recruiter, (S) = Student, (A) = Admin
   ```

3. **Filter Logs**

   ```
   Filter by:
   ☐ Date Range (Feb 1 - Feb 6)
   ☐ User Type (Recruiter, Student, Admin)
   ☐ Action (Login, Post Job, Apply, etc.)
   ☐ User Name (Priya Sharma, John, etc.)

   [Apply Filter]
   ```

4. **Example Searches**

   ```
   Search 1: "Find all failed logins"
   Filter: Action = "Login Failed"
   Results: Security checks, wrong passwords, etc.

   Search 2: "What did John do?"
   Filter: User = "John"
   Results: All John's activities

   Search 3: "Job postings this week"
   Filter: Action = "Posted Job", Date = Last 7 days
   Results: All jobs posted
   ```

### Security Alerts

**Things to Watch For:**

⚠️ **Red Flags:**

```
1. Multiple failed login attempts
   Action: Contact user, reset password

2. Recruiter downloading all student data
   Action: Check if authorized, investigate

3. Account modified multiple times in short period
   Action: Possible compromise, force password reset

4. Deleted job postings
   Action: Check if intentional, review recruiter

5. Manual modifications of placements
   Action: Requires approval, check CGPA manually
```

### Download Audit Report

1. **Click "Download Audit Report"**
2. **Select Period:**
   - Last 7 days
   - Last 30 days
   - Custom date range

3. **File Generated:**
   - `audit_report_2026-02-06.pdf`
   - Contains summary and full logs

4. **Compliance Purpose:**
   - Regulatory requirements
   - Evidence for disputes
   - Historical track record

---

## Troubleshooting

### Issue 1: "Recruiter Registration Pending Too Long"

**Check:**

1. Is recruiter in "Pending Approval" list?
2. Have you reviewed their information?
3. Does company seem legitimate?

**Solution:**

- ✅ Approve legitimate companies promptly
- ✅ Request more info if suspicious
- ✅ Reject spam/fake registrations
- ✅ Set timeline: "Review pending within 24 hours"

### Issue 2: "Student CGPA Seems Wrong"

**Check:**

1. Did student enter it correctly?
2. Ask student to verify their CGPA
3. Request official transcript if needed

**Solution:**

- ✅ Contact student: "Please verify your CGPA"
- ✅ Request college transcript
- ✅ Update if student provides proof
- ✅ Flag if discrepancy found

### Issue 3: "Placement Statistics Not Updating"

**Cause:** Data is cached, needs refresh

**Solution:**

- ✅ Refresh page (F5)
- ✅ Clear cache (Ctrl+Shift+Delete)
- ✅ Wait 5 minutes (auto-update)
- ✅ Log out and back in

### Issue 4: "Can't Export Data"

**Check:**

1. Selected at least one data type?
2. Enough data exists?
3. No browser issues?

**Solution:**

- ✅ Try different browser
- ✅ Check internet connection
- ✅ Try again (temporary issue)
- ✅ Contact IT if repeated issue

### Issue 5: "Portal Can't Import Bulk Data"

**Note:** System doesn't support bulk import

**Workaround:**

- Individual registration (manual)
- Batch registration via command line (if IT authorized)
- Contact college IT for one-time database migration

### Issue 6: "Audit Log Shows Suspicious Activity"

**Example:** Recruiter downloaded 400+ students

**Action Steps:**

1. Review what happened
2. Contact recruiter: "Why did you download student data?"
3. Possible explanations:
   ```
   ✅ Legal: Building candidate database
   ⚠️ Concerning: Might violate privacy
   ```
4. Decision:
   ```
   If legitimate: Allow, document
   If suspicious: Suspend account, investigate
   ```

### Issue 7: "Wrong Student Placement Record"

**If system shows wrong placement:**

1. Check audit log: "Who modified this?"
2. Verify actual status with recruiter
3. Check if recruiter made mistake
4. Manually correct if absolutely necessary
   - Document the change
   - Log reason

### Issue 8: "Admin Account Compromised"

**Immediate Actions:**

1. ✅ Change password immediately
2. ✅ Check audit log for unauthorized changes
3. ✅ Inform IT security
4. ✅ Review all recent admin actions
5. ✅ Notify affected users if needed
6. ✅ Restore any incorrectly modified data

---

## Best Practices

### ✅ Do's

✅ **Review recruiter registrations daily**

- Approve legitimate companies quickly
- Reject suspicious ones promptly

✅ **Monitor analytics regularly**

- Weekly placement updates
- Track progress toward goals
- Identify bottlenecks

✅ **Maintain audit logs**

- Review unusual activities
- Keep records compliant
- Investigate suspicious patterns

✅ **Update settings seasonally**

- Configure before placement season starts
- Update email templates if needed
- Adjust CGPA cutoffs if policy changes

✅ **Export data regularly**

- Backup important data
- Share reports with management
- Archive historical data

### ❌ Don'ts

❌ **Don't approve suspicious recruiters**

- Check company legitimacy first
- Request information if unsure
- Reject spam/fake companies

❌ **Don't modify student data without reason**

- Can distort statistics
- Violates data integrity
- Should audit-log all changes

❌ **Don't ignore audit log warnings**

- Unusual patterns = investigate
- Multiple failed logins = security issue
- Bulk downloads = verify authorization

❌ **Don't leave settings misconfigured**

- Wrong CGPA cutoff = students can't apply
- Portal closed = nobody can register
- Wrong season = confusing reports

---

## Admin Checklist

### Daily Tasks

```
☐ Review pending recruiter registrations
☐ Check for suspicious activities in audit log
☐ Verify portal is running normally
☐ Respond to student/recruiter inquiries
```

### Weekly Tasks

```
☐ Check placement statistics
☐ Update CGPA requirements if needed
☐ Review email logs
☐ Backup important data
☐ Check system performance
```

### Before Placement Season

```
☐ Update placement season dates
☐ Review and update email templates
☐ Set minimum CGPA requirements
☐ Enable portal for registrations
☐ Communicate timeline to students/recruiters
☐ Verify all data from previous season archived
```

### After Placement Season

```
☐ Export all placement data
☐ Archive all records
☐ Generate final reports
☐ Disable new job postings
☐ Disable student applications
☐ Prepare data for management
```

---

## Contact & Support

**For Technical Issues:**

- IT Support Team: it-support@college.ac.in
- Portal Developer: dev-team@college.ac.in

**For Policy Questions:**

- T&P Coordinator: tnp-head@college.ac.in
- Management: director@college.ac.in

**For Student/Recruiter Issues:**

- Contact them directly
- Document in support ticket
- Escalate if needed

---

**Thank you for managing the portal! Good luck with placements! 🚀**

For recruiter instructions, see: [Recruiter Guide](./RECRUITER_GUIDE.md)
For student learning, see: [Student Guide](./STUDENT_GUIDE.md)
