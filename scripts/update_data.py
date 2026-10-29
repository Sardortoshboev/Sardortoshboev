#!/usr/bin/env python3
"""SIAT (stat.uz) dan eksport/import JSON fayllarini yuklab, dashboard uchun data/ ni yangilaydi.

Ishlatish:  python3 scripts/update_data.py

Natija:
  data/sdmx_data_1170.json  - eksport (asl fayl, o'zgarishsiz)
  data/sdmx_data_1173.json  - import  (asl fayl, o'zgarishsiz)
  data/data.js              - ikkala faylni brauzer uchun bitta JS faylga o'raydi
                              (index.html ni serversiz, shunchaki ochib ko'rish uchun)
"""
import json
import pathlib
import re
import sys
import urllib.request
from datetime import datetime, timezone

SOURCES = {
    "export": "https://siat.stat.uz/media/uploads/sdmx/sdmx_data_1170.json",
    "import": "https://siat.stat.uz/media/uploads/sdmx/sdmx_data_1173.json",
}
DATA_DIR = pathlib.Path(__file__).resolve().parent.parent / "data"
PERIOD_RE = re.compile(r"^\d{4}-M\d{2}$")


def fetch(url):
    with urllib.request.urlopen(url, timeout=60) as resp:
        return resp.read()


def validate(raw, name):
    """Fayl tuzilishi kutilgandek ekanini tekshiradi: [{metadata: [...], data: [...]}]."""
    if not (isinstance(raw, list) and raw and "data" in raw[0] and "metadata" in raw[0]):
        sys.exit(f"{name}: kutilmagan tuzilish")
    rows = raw[0]["data"]
    periods = [k for k in rows[0] if PERIOD_RE.match(k)]
    if not rows or not periods:
        sys.exit(f"{name}: ma'lumot yoki davr ustunlari topilmadi")
    return len(rows), periods[0], periods[-1]


def main():
    DATA_DIR.mkdir(exist_ok=True)
    bundle = {}
    for mode, url in SOURCES.items():
        body = fetch(url)
        raw = json.loads(body)
        count, first, last = validate(raw, mode)
        (DATA_DIR / url.rsplit("/", 1)[-1]).write_bytes(body)
        bundle[mode] = raw
        print(f"{mode}: {count} ta mamlakat, {first} .. {last}")

    bundle["fetchedAt"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    js = "// Avtomatik yaratilgan: scripts/update_data.py. Qo'lda tahrirlamang.\n"
    js += "window.SIAT_DATA = " + json.dumps(bundle, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DATA_DIR / "data.js").write_text(js, encoding="utf-8")
    print("data/data.js yangilandi")


if __name__ == "__main__":
    main()
