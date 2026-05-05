# 📘 Knex.js Migration Cheat Sheet (ภาษาไทย)

สรุปคำสั่งและวิธีการกำหนด Schema สำหรับการสร้างตาราง (Table) ด้วย Knex.js

---

## 1. ประเภทข้อมูลพื้นฐาน (Data Types)

| อีโมจิ | คำสั่ง                       | คำอธิบาย                                 | ตัวอย่างการใช้งาน                        |
| :----: | :--------------------------- | :--------------------------------------- | :--------------------------------------- |
|   🔑   | `table.increments('id')`     | ตัวเลขเพิ่มอัตโนมัติ และเป็น Primary Key | `table.increments('user_id').primary();` |
|   📝   | `table.string('column')`     | ข้อความสั้น เช่น ชื่อ, อีเมล, รหัสผ่าน   | `table.string('email', 255);`            |
|   📄   | `table.text('column')`       | ข้อความยาว                               | `table.text('description');`             |
|   🔢   | `table.integer('column')`    | ตัวเลขจำนวนเต็ม                          | `table.integer('age');`                  |
|   🌡️   | `table.float('column')`      | ตัวเลขทศนิยมทั่วไป                       | `table.float('temperature');`            |
|   💰   | `table.decimal('col', 8, 2)` | ตัวเลขทศนิยมแม่นยำสูง (เหมาะกับเงิน)     | `table.decimal('price', 10, 2);`         |
|   ✅   | `table.boolean('column')`    | true / false                             | `table.boolean('is_active');`            |
|   📅   | `table.date('column')`       | วันที่ (YYYY-MM-DD)                      | `table.date('birthday');`                |
|   ⏰   | `table.time('column')`       | เวลา (HH:MM:SS)                          | `table.time('start_time');`              |
|   🕒   | `table.timestamp('column')`  | วันที่ + เวลา                            | `table.timestamp('created_at');`         |
|   🧩   | `table.json('column')`       | เก็บ JSON                                | `table.json('metadata');`                |
|   ⚡   | `table.jsonb('column')`      | JSON แบบเร็ว (PostgreSQL)                | `table.jsonb('metadata');`               |
|   🆔   | `table.uuid('column')`       | รหัสสุ่ม UUID                            | `table.uuid('id').primary();`            |

---

## 2. การกำหนดคุณสมบัติ (Constraints & Modifiers)

| อีโมจิ | คำสั่ง             | คำอธิบาย                       | ตัวอย่างการใช้งาน                                             |
| :----: | :----------------- | :----------------------------- | :------------------------------------------------------------ |
|   🔑   | `.primary()`       | ตั้งเป็น Primary Key           | `table.increments('id').primary();`                           |
|   🚫   | `.unique()`        | ห้ามค่าซ้ำ                     | `table.string('email').unique();`                             |
|   ❗   | `.notNullable()`   | ห้ามเป็น NULL                  | `table.string('username').notNullable();`                     |
|   🟢   | `.nullable()`      | อนุญาตให้เป็น NULL             | `table.string('bio').nullable();`                             |
|   ⚙️   | `.defaultTo()`     | กำหนดค่าเริ่มต้น               | `table.boolean('is_active').defaultTo(true);`                 |
|   ➕   | `.unsigned()`      | ตัวเลขต้องเป็นบวก              | `table.integer('age').unsigned();`                            |
|   ⚡   | `.index()`         | เพิ่ม index ให้ query เร็วขึ้น | `table.string('username').index();`                           |
|   🔗   | `.references()`    | Foreign Key                    | `table.integer('user_id').references('id').inTable('users');` |
|   📈   | `.checkPositive()` | ค่า > 0 เท่านั้น               | `table.integer('price').checkPositive();`                     |
|   📦   | `.checkIn([...])`  | จำกัดค่าใน list                | `table.string('role').checkIn(['admin','user']);`             |
|   🔍   | `.checkLength()`   | ตรวจความยาวข้อมูล              | `table.string('password').checkLength('>', 8);`               |
|   🔧   | `.alter()`         | แก้ column เดิม                | `table.string('email').notNullable().alter();`                |
|   ➡️   | `.after(column)`   | จัดตำแหน่ง column (MySQL)      | `table.string('phone').after('email');`                       |
|   ⬆️   | `.first()`         | ย้ายไปบนสุด                    | `table.string('id_card').first();`                            |

---

## 3. การจัดการเวลา (Timestamps) แบบมืออาชีพ

```js
// created_at (auto)
table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));

// updated_at (MySQL auto update)
table
  .timestamp("updated_at")
  .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
```

```npx
npx knex migrate:rollback --all
```

```
npx knex migrate:latest
```

```
npx knex migrate:up
```

```
npx knex migrate:down
```
