# 🏆 Tuition Championship — Google Sheets & Form Setup Guide

This guide explains how to connect your weekly tuition tests to the live Tuition Championship static leaderboard with **no backend server required**.

---

## 1. Quick Architecture Overview

```text
[Teacher enters marks]
        ↓
[Google Form]
        ↓
[Google Sheet: TEST_RESULTS tab]
        ↓
[Static Website reads public CSV via gviz]
        ↓
[Rankings, Streaks, Achievements & Mystery Prizes computed in browser]
```

---

## 2. Google Sheet Tabs Structure

Create a Google Spreadsheet with the following 4 tabs:

### Tab 1: `STUDENTS`
| Student ID | Name | Class | Section | Active |
|---|---|---|---|---|
| S001 | Rahul Sharma | 7 | A | TRUE |
| S002 | Priya Patel | 7 | A | TRUE |
| S003 | Aman Verma | 7 | A | TRUE |

> **Rules**:
> - `Student ID` must be unique (e.g., S001, S002).
> - Use student display name (first name or full name; private details like phone numbers and addresses should never be stored here).

---

### Tab 2: `TESTS`
| Test ID | Date | Test Name | Subject | Class | Total Marks | Difficulty | Test Number | Season |
|---|---|---|---|---|---|---|---|---|
| T001 | 2026-07-05 | Number Systems Sprint | Maths | 7 | 50 | Medium | 1 | Season 1 |
| T002 | 2026-07-12 | Algebra Basics & Linear | Maths | 7 | 40 | Hard | 2 | Season 1 |
| T003 | 2026-07-19 | Heat & Temperature | Science | 7 | 50 | Medium | 3 | Season 1 |

> **Important**:
> - Tests can have **different total marks** (e.g. 25, 40, 50, 100). The website calculates percentage accurately:
>   $$\text{Percentage} = \frac{\text{Marks Scored}}{\text{Total Marks}} \times 100$$
> - `Difficulty` can be `Easy`, `Medium`, or `Hard`.

---

### Tab 3: `TEST_RESULTS` (Target for Google Form)
| Timestamp | Test ID | Student ID | Marks Scored |
|---|---|---|---|
| 2026-07-05 18:30:00 | T001 | S001 | 47 |
| 2026-07-05 18:31:00 | T001 | S002 | 46 |

> **Google Form Design**:
> - Question 1: **Test ID** (Dropdown or Short Answer, e.g., T001)
> - Question 2: **Student ID** (Dropdown or Short Answer, e.g., S001)
> - Question 3: **Marks Scored** (Number, e.g., 47)
> - Google Form automatically inputs the `Timestamp`.
> - The teacher does **not** need to enter total marks repeatedly.

---

### Tab 4: `PRIZES`
| Prize ID | Name | Required Rank | Required Tests | Status | Description |
|---|---|---|---|---|---|
| P001 | 👑 Season Champion Grand Prize: Kindle Paperwhite | 1 | 15 | LOCKED | Awarded to the #1 ranked student at the end of 15 tests. |
| P002 | 🥈 Runner-Up Honors: Noise Smartwatch | 2 | 15 | LOCKED | Awarded to 2nd place podium finisher. |
| P003 | 🥉 Bronze Podium: Premium Fountain Pen Set | 3 | 15 | LOCKED | Awarded to 3rd place podium finisher. |
| P004 | 🚀 Mid-Season Most Improved Award | 15 | 10 | UNLOCKED | Awarded to the student with the biggest leap. |

---

## 3. How to Connect to Website

1. In your Google Sheet, click **Share** (top right).
2. Under **General access**, change from *Restricted* to **"Anyone with the link can view"**.
3. Copy the URL or extract the Sheet ID from the browser address bar:
   `https://docs.google.com/spreadsheets/d/`**`[YOUR_SHEET_ID]`**`/edit`
4. Open the website, click the **Settings (gear icon)** in the top right.
5. Select **Live Google Sheet**, paste your **Sheet ID**, and click **Save & Apply**.
6. That's it! Click **Refresh** anytime to pull latest submissions.
