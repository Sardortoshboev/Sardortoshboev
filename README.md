# O'zbekiston tashqi savdosi — dashboard

Eksport va import ko'rsatkichlari bo'yicha, mamlakatlar kesimidagi oddiy analitik dashboard.
Ma'lumot Milliy statistika qo'mitasining SIAT ochiq ma'lumotlaridan olinadi:

| Rejim  | Fayl | Ko'rsatkich |
|--------|------|-------------|
| Eksport | [sdmx_data_1170.json](https://siat.stat.uz/media/uploads/sdmx/sdmx_data_1170.json) | 1.08.02.0034 — Eksport hajmi (mamlakatlar kesimida, oylik) |
| Import  | [sdmx_data_1173.json](https://siat.stat.uz/media/uploads/sdmx/sdmx_data_1173.json) | 1.08.03.0032 — Import hajmi (mamlakatlar kesimida, oylik) |

## Imkoniyatlar

- **Filtrlar:** rejim (eksport/import), yil, oy ("butun yil" yoki bitta oy), mamlakat.
- **KPI kartochkalar:** eksport, import, tovar aylanmasi, savdo saldosi va o'tgan yilning shu davriga nisbatan o'zgarish.
- **Oylik dinamika:** tanlangan yil, o'tgan yil bilan solishtirib ko'rsatiladi.
- **Yillar kesimida:** eksport va import, 2021-yildan boshlab.
- **Top-10 mamlakat** va barcha mamlakatlar jadvali (qidiruv va saralash bilan).
- Grafik ustuni yoki jadval qatorini bosish filtrni o'zgartiradi.
- Interfeys tili: UZ / RU. Tungi (dark) rejim qurilma sozlamasiga qarab yoqiladi.
- Filtr holati URL'da saqlanadi (`#mode=import&year=2025&month=3&country=643`), shuning uchun havolani ulashish mumkin.

## Ishga tushirish

Server kerak emas: `index.html` faylini brauzerda ochish kifoya.
Chart.js `vendor/` papkasida saqlangan, shuning uchun internetsiz ham ishlaydi.

### GitHub Pages

Manzil: **https://abdoollox.github.io/SardorDashboard/**

Pages'ni bir marta yoqish kerak:
1. **Settings → Pages** bo'limiga kiring.
2. **Build and deployment → Source** maydonida **Deploy from a branch** ni tanlang.
3. Branch sifatida `claude/nice-sagan-6ogjoo`, papka sifatida `/ (root)` ni tanlang va **Save** tugmasini bosing.

Shundan keyin shu branch'ga qilingan har bir push saytni avtomatik yangilaydi (1–2 daqiqa ichida).
`.nojekyll` fayli GitHub'ga sahifani Jekyll orqali qayta ishlamasdan, fayllarni o'zgarishsiz joylashni bildiradi.

## Ma'lumotni yangilash

```bash
python3 scripts/update_data.py
```

Skript ikkala JSON faylni yuklab, ularni `data/` papkasiga saqlaydi va `data/data.js` faylini qayta yaratadi.
Brauzer ma'lumotni to'g'ridan-to'g'ri `siat.stat.uz` dan ololmaydi: sayt CORS sarlavhasini bermaydi.
Shuning uchun ma'lumotning nusxasi repozitoriyda saqlanadi.

## Ma'lumot haqida muhim izohlar

1. **Oylik qiymatlar yil boshidan jamlanma (kumulyativ).** Masalan, `2024-M03` — 2024-yilning yanvar–mart oylari yig'indisi.
   Bitta oyning qiymati quyidagicha hisoblanadi: `M(n) − M(n−1)`.
   "Butun yil" tanlanganda yilning mavjud oxirgi oyidagi jamlanma qiymat olinadi.
2. **Joriy yil to'liq emas** (hozircha sentyabrgacha). Shuning uchun o'tgan yil bilan solishtirish ham shu davr uchun qilinadi:
   yanvar–sentyabr bilan yanvar–sentyabr.
3. **"Boshqa mamlakatlar"** (kod `0`) — mamlakat bo'yicha ko'rsatilmagan qism, eksportning katta ulushini tashkil qiladi.
   U jami summalarga kiradi, lekin Top-10 reytingiga kiritilmaydi.
4. O'lchov birligi — ming AQSH dollari. Dashboardda qiymatlar mln/mlrd $ ko'rinishida ko'rsatiladi.
5. Manbada ma'lumotlar qayta ko'rib chiqilgani sababli, ayrim kichik oylik qiymatlar manfiy chiqishi mumkin.

## Tuzilma

```
index.html             sahifa
assets/app.js          ma'lumotni o'qish, hisob-kitob, grafiklar
assets/style.css       dizayn (yorug' va tungi rejim)
data/data.js           brauzer uchun ma'lumot (skript yaratadi)
data/*.json            SIAT dan olingan asl fayllar
scripts/update_data.py ma'lumotni yangilash skripti
vendor/                Chart.js 4.4.1
```
