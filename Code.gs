/**
 * ============================================================================
 *  BCF Audit Hub — Backend (Google Apps Script)
 * ============================================================================
 *  ทำหน้าที่: เก็บข้อมูล audit/ลิงก์ทั้งหมดไว้ใน Google Sheet
 *  - GET  ?action=load            → ส่งข้อมูลทั้งหมดกลับไปให้หน้าเว็บ (ใครก็เรียกได้ = ดูได้)
 *  - POST {action:'save', key, data} → บันทึกข้อมูล (ต้องมี admin key ที่ถูกต้อง)
 *
 *  วิธีติดตั้ง: ดูใน README — โดยสรุปคือ วางโค้ดนี้ใน Apps Script ของ Sheet
 *  แล้ว Deploy เป็น Web app (Execute as: Me, Access: Anyone)
 * ============================================================================
 */

// ⚠️ เปลี่ยนรหัสนี้เป็นรหัสลับของคุณเอง (ใช้ตอนเข้าโหมดแก้ไขบนหน้าเว็บ)
const ADMIN_KEY = 'CHANGE_ME_TO_YOUR_SECRET';

// ชื่อชีตที่ใช้เก็บข้อมูล (สร้างให้อัตโนมัติถ้ายังไม่มี)
const SHEET_NAME = 'AuditData';
const DATA_CELL  = 'A1';   // เก็บ JSON ทั้งก้อนในเซลล์เดียว

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'load';
  if (action === 'load') {
    return json_({ ok: true, data: readData_() });
  }
  return json_({ ok: false, error: 'unknown action' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.action === 'save') {
      if (body.key !== ADMIN_KEY) {
        return json_({ ok: false, error: 'invalid key' });
      }
      writeData_(body.data);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* ---------- helpers ---------- */
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(DATA_CELL).setValue(JSON.stringify(defaultData_()));
  }
  return sh;
}

function readData_() {
  const raw = sheet_().getRange(DATA_CELL).getValue();
  if (!raw) return defaultData_();
  try { return JSON.parse(raw); } catch (e) { return defaultData_(); }
}

function writeData_(data) {
  sheet_().getRange(DATA_CELL).setValue(JSON.stringify(data));
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ข้อมูลตั้งต้น (ครั้งแรกที่ยังไม่มีอะไรใน Sheet) */
function defaultData_() {
  return {
    site: {
      title: 'BCF Audit Hub',
      subtitle: 'ศูนย์รวมเอกสารตรวจประเมิน · Black Chicken Farm (Kanchanaburi)'
    },
    audits: [
      {
        id: 'nuaanamai',
        name: 'เนื้ออนามัย',
        desc: 'มาตรฐานเนื้อสัตว์อนามัย — เอกสารต่ออายุใบรับรอง',
        groups: [
          {
            label: 'เอกสารหลัก',
            items: [
              { name: 'แบบฟอร์มขอต่ออายุ เนื้ออนามัย', type: 'doc',   url: 'https://docs.google.com/document/d/REPLACE_ME/edit' },
              { name: 'ตารางบันทึกอุณหภูมิห้องเย็น',     type: 'sheet', url: 'https://docs.google.com/spreadsheets/d/REPLACE_ME/edit' }
            ]
          }
        ]
      }
    ]
  };
}
