# BCF Audit Hub — คู่มือใช้งาน & Deploy

หน้าเดียวรวมลิงก์เอกสาร Audit ทั้งหมด แยกตามรายการตรวจ + หน้าภาพรวม
เก็บ **เฉพาะลิงก์** ไม่มีข้อมูลลับในไฟล์ — ข้อมูลจริงยังอยู่ใน Google Drive และคุมสิทธิ์ด้วยบัญชี Google

---

## 1) แก้ชื่อ audit / เพิ่ม-ลบไฟล์

เปิด `index.html` หา block ที่คั่นด้วย `▼▼▼ แก้ตรงนี้ที่เดียวพอ ▼▼▼`
ทั้งหมดอยู่ในตัวแปร `AUDITS` — แก้ชื่อ, คำอธิบาย, กลุ่ม, และลิงก์ได้เลย

เพิ่มไฟล์หนึ่งบรรทัด:
```js
{ name:"ชื่อไฟล์ที่จะโชว์", type:"sheet", url:"https://docs.google.com/..." },
```
`type` ที่ใช้ได้: `sheet` `doc` `slide` `pdf` `folder` `link`

ไฟล์เดียวใช้หลาย audit → ก็อปบรรทัดนั้นไปวางใน audit อื่นได้ (เป็นลิงก์เดิม ไม่ได้ทำสำเนา)
เปลี่ยน audit ใหม่ทั้งชุด → ก็อป object ทั้งก้อนแล้วแก้ `id`, `name`

> หมายเหตุ: `id` ต้องเป็นภาษาอังกฤษ ไม่เว้นวรรค (ใช้ทำลิงก์ `#id` ด้วย)

---

## 2) Deploy ขึ้น GitHub Pages → audit.sukmart.com

1. สร้าง repo (เช่น `bcf-audit-hub`) แล้ว push ไฟล์ทั้งหมดในโฟลเดอร์นี้
2. Repo → **Settings → Pages** → Source: `Deploy from a branch` → `main` / root → Save
3. ไฟล์ `CNAME` มีค่า `audit.sukmart.com` อยู่แล้ว GitHub จะตั้ง Custom domain ให้อัตโนมัติ
4. ที่ผู้ดูแล DNS ของ sukmart.com (เช่น Cloudflare) เพิ่มเรคคอร์ด:
   ```
   Type: CNAME   Name: audit   Target: <github-username>.github.io
   ```
   - ถ้าใช้ Cloudflare ให้ตั้งเป็น **DNS only (เมฆสีเทา)** ตอนแรกเพื่อให้ GitHub ออกใบ HTTPS ได้ก่อน แล้วค่อยเปิด proxy (เมฆส้ม) ทีหลังถ้าจะใช้ Cloudflare Access
5. รอ DNS + ใบรับรอง (ไม่กี่นาที–ชม.) แล้วเปิด https://audit.sukmart.com

---

## 3) ใส่รหัสกันคนนอก (แนะนำ) — Cloudflare Access

ทำให้ต้องล็อกอินก่อนเห็นหน้าเว็บ ฟรีถึง 50 users:

1. ย้าย DNS ของ sukmart.com มาที่ Cloudflare (ถ้ายังไม่ได้ใช้) และเปิด **proxy (เมฆส้ม)** ที่เรคคอร์ด `audit`
2. Cloudflare Dashboard → **Zero Trust** → Access → Applications → **Add application** → Self-hosted
3. ตั้งโดเมน: `audit.sukmart.com`
4. สร้าง Policy → Action: **Allow** → Include: **Emails** แล้วใส่อีเมลที่อนุญาต (หรือใช้ Email domain / One-time PIN)
5. Save — ทีนี้ใครเข้า audit.sukmart.com จะต้องยืนยันอีเมลก่อนถึงจะเห็นหน้า

> ถ้าไม่อยากตั้ง Access: หน้าเว็บก็ยังปลอดภัยเพราะมีแค่ลิงก์ ใครคลิกลิงก์ Drive ก็ยังต้องมีสิทธิ์ Google อยู่ดี
> Access แค่เพิ่มชั้นกันไม่ให้คนนอกเห็น "รายชื่อไฟล์"

---

## 4) เวลาแก้แล้วหน้าไม่อัปเดต (เพราะ PWA cache)

แก้ `index.html` แล้ว push — ปกติเห็นทันที (service worker ตั้งเป็น network-first สำหรับหน้าเว็บ)
ถ้าแก้ไอคอน/manifest แล้วไม่เปลี่ยน ให้เปิด `sw.js` แล้วขยับเวอร์ชัน:
```js
const CACHE = 'bcf-audit-v1';  // → เปลี่ยนเป็น v2, v3 ...
```

---

## ไฟล์ในชุดนี้
```
index.html              หน้าเว็บหลัก (แก้ AUDITS ที่นี่)
manifest.webmanifest    PWA manifest
sw.js                   service worker (offline + cache)
CNAME                   audit.sukmart.com
.nojekyll               กัน GitHub Pages ประมวลผลผิด
icons/                  favicon + PWA icons + โลโก้เว็บ
```
