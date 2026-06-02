# BCF Audit Hub — คู่มือ (เวอร์ชันแก้ไขออนไลน์ได้)

หน้าเดียวรวมลิงก์เอกสาร Audit แยกตามรายการตรวจ + หน้าภาพรวม
**ตอนนี้แก้ไข/เพิ่ม/ลบลิงก์ได้จากหน้าเว็บโดยตรง** แล้วเซฟกลับเข้า Google Sheet จริง
คนทั่วไป = ดูอย่างเดียว · ใส่ admin key = แก้ได้

---

## ✅ ครั้งแรก: ตั้ง backend (ทำครั้งเดียว)

### 1) สร้าง Google Sheet ใหม่
- ไปที่ sheets.new (สร้าง Sheet เปล่า) ตั้งชื่ออะไรก็ได้ เช่น "BCF Audit Data"
- ไม่ต้องใส่อะไรในนั้น เดี๋ยวระบบสร้างชีต `AuditData` ให้เอง

### 2) วางโค้ด Apps Script
- ในหน้า Sheet นั้น เมนู **Extensions → Apps Script**
- ลบโค้ดเดิมที่มีออก แล้ววางทั้งหมดจากไฟล์ **`Code.gs`**
- แก้บรรทัด `ADMIN_KEY` ให้เป็นรหัสลับของคุณเอง:
  ```js
  const ADMIN_KEY = 'รหัสลับของคุณ';   // ← เปลี่ยนตรงนี้
  ```
- กด 💾 บันทึก

### 3) Deploy เป็น Web app
- มุมขวาบน กด **Deploy → New deployment**
- ไอคอนเฟือง ⚙️ ข้าง "Select type" → เลือก **Web app**
- ตั้งค่า:
  - Description: อะไรก็ได้
  - **Execute as: Me** (อีเมลคุณ)
  - **Who has access: Anyone**  ← สำคัญ ต้องเป็น Anyone หน้าเว็บถึงโหลดข้อมูลได้
- กด **Deploy** → อนุญาตสิทธิ์ (กด Authorize, เลือกบัญชี, Advanced → Go to project → Allow)
- ก็อป **Web app URL** ที่ได้ (ลงท้าย `/exec`)

### 4) ใส่ URL ลงหน้าเว็บ
- เปิดไฟล์ **`index.html`** หาบรรทัด:
  ```js
  const API_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
  ```
- แทนที่ด้วย URL จากข้อ 3 → เซฟ

เสร็จ! อัป `index.html` ขึ้น GitHub (ดูข้างล่าง)

---

## ✏️ วิธีแก้ลิงก์ (หลังตั้ง backend แล้ว)

1. เปิด audit.sukmart.com
2. กดปุ่ม **✎ แก้ไข** มุมขวาล่าง → ใส่ admin key
3. แก้ได้เลย:
   - คลิกที่ชื่อไฟล์ / คำอธิบาย / ชื่อ audit เพื่อพิมพ์แก้
   - ช่องใต้ชื่อไฟล์ (ตรงเครื่องหมาย #) = แก้ URL
   - dropdown = เปลี่ยนชนิดไฟล์ (Sheets/Docs/Slides/PDF/โฟลเดอร์/ลิงก์)
   - 🗑 = ลบ · "+ เพิ่มไฟล์" / "+ เพิ่มกลุ่ม" / "+ เพิ่ม Audit ใหม่"
4. กด **💾 บันทึก** → ข้อมูลเซฟเข้า Sheet ทันที คนอื่นรีเฟรชก็เห็นค่าใหม่

> ข้อมูลทั้งหมดเก็บใน Sheet — เปลี่ยนเครื่อง/เบราว์เซอร์ก็ยังอยู่ ไม่หาย

---

## 🚀 อัปขึ้น GitHub (เหมือนเดิม)

repo `bcf-audit-hub-` มีไฟล์อยู่แล้ว — รอบนี้แค่อัปทับไฟล์ที่เปลี่ยน:
- **`index.html`** (เวอร์ชันใหม่ มีโหมดแก้ไข + ใส่ API_URL แล้ว)
- **`icons/bcf-logo.png`** (โลโก้วงกลมขาวใหม่)
- **`sw.js`** (เวอร์ชัน cache เป็น v2)

วิธี: หน้า repo → **Add file → Upload files** → ลากทับ → Commit
Pages จะ redeploy เองใน 1-2 นาที

> `Code.gs` ไม่ต้องอัปขึ้น GitHub (มันอยู่ใน Apps Script แล้ว) — เก็บไว้เป็น backup เฉยๆ

---

## ไฟล์ในชุดนี้
```
index.html              หน้าเว็บ (ใส่ API_URL ที่นี่)
Code.gs                 โค้ด backend → วางใน Apps Script (ตั้ง ADMIN_KEY ที่นี่)
manifest.webmanifest    PWA
sw.js                   service worker
CNAME                   audit.sukmart.com
icons/                  favicon + PWA icons + โลโก้วงกลมขาว
```

## หมายเหตุความปลอดภัย
- admin key เก็บอยู่ใน Apps Script (ฝั่ง server) ไม่ได้ฝังในหน้าเว็บ — คนเปิดดู source หน้าเว็บไม่เห็นรหัส
- ใครไม่มีรหัส = แก้ไม่ได้ (กดบันทึกจะขึ้น "รหัสไม่ถูกต้อง")
- ถ้าจะกันคนนอกไม่ให้เห็นหน้าเลย ค่อยเพิ่ม Cloudflare Access ทีหลังได้
