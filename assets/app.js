/* Tashqi savdo dashboard.
 *
 * Ma'lumot manbai: SIAT (stat.uz) SDMX JSON fayllari (data/data.js ichida).
 * MUHIM: fayldagi oylik qiymatlar YIL BOSHIDAN JAMLANMA (kumulyativ):
 *   "2024-M03" = 2024-yil yanvar–mart jami.
 * Shuning uchun bitta oyning qiymati = shu oy jamlanmasi − oldingi oy jamlanmasi.
 * Qiymatlar ming AQSH dollarida.
 */
(function () {
  'use strict';

  var OTHER_CODE = '0'; // "Boshqa mamlakatlar" — mamlakat bo'yicha taqsimlanmagan qism
  var TOP_N = 10;

  // ---------- Matnlar (UZ / RU) ----------
  var I18N = {
    uz: {
      title: "O'zbekiston tashqi savdosi",
      subtitle: 'Eksport va import, mamlakatlar kesimida · manba: Milliy statistika qo\'mitasi (SIAT)',
      mode: 'Rejim', export: 'Eksport', import: 'Import', year: 'Yil', month: 'Oy', country: 'Mamlakat',
      reset: 'Tozalash', allCountries: 'Barcha mamlakatlar', wholeYear: 'Butun yil',
      wholeYearPartial: 'Yil boshidan (yanvar–{m})',
      months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'],
      monthsShort: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
      periodYear: '{y}-yil', periodYtd: '{y}-yil, yanvar–{m}', periodMonth: '{y}-yil {m}',
      periodLine: 'Davr: <strong>{p}</strong> · Mamlakat: <strong>{c}</strong>',
      turnover: 'Tovar aylanmasi', balance: 'Savdo saldosi',
      vsPrev: "o'tgan yilning shu davriga nisbatan", noPrev: "o'tgan yil ma'lumoti yo'q",
      shareOf: 'Jami {mode}dagi ulushi: {v}',
      surplus: 'profitsit', deficit: 'defitsit',
      monthlyTitle: 'Oylik dinamika — {mode}, {c}',
      monthlyHint: "Ustun: {y}-yil, chiziq: {py}-yil. Ustunni bosib oyni tanlang.",
      yearlyTitle: 'Yillar kesimida — eksport va import, {c}',
      yearlyHint: "* {y}-yil — faqat yanvar–{m}. Ustunni bosib yilni tanlang.",
      yearlyHintFull: 'Ustunni bosib yilni tanlang.',
      topTitle: 'Top-{n} mamlakat — {mode}, {p}',
      topHint: '"{o}" ({v}, {s}) reytingga kiritilmagan. Ustunni bosib mamlakatni tanlang.',
      topHintNoOther: 'Ustunni bosib mamlakatni tanlang.',
      tableTitle: 'Barcha mamlakatlar — {mode}, {p}',
      search: 'Qidirish…',
      colRank: '№', colCountry: 'Mamlakat', colValue: 'mln $', colShare: 'Ulushi', colPrev: "O'tgan yil", colChange: "O'zgarish",
      tipPrev: "O'tgan yil", empty: "Ma'lumot yo'q",
      notes: [
        "Manba: O'zbekiston Respublikasi Milliy statistika qo'mitasi, SIAT ochiq ma'lumotlari — <a href=\"{u1}\" target=\"_blank\" rel=\"noopener\">eksport</a>, <a href=\"{u2}\" target=\"_blank\" rel=\"noopener\">import</a>. O'lchov birligi: ming AQSH dollari (dashboardda mln/mlrd $ ko'rinishida).",
        "Manbadagi oylik qiymatlar yil boshidan jamlanma; bitta oy qiymati qo'shni oylar farqi sifatida hisoblangan. Manbada qayta ko'rib chiqishlar bo'lgani uchun ayrim kichik qiymatlar manfiy chiqishi mumkin.",
        "\"{o}\" — mamlakat bo'yicha ko'rsatilmagan qism. U jami summalarga kiradi, lekin Top-{n} reytingiga kiritilmagan.",
        "Manbada oxirgi o'zgarish: {mod}. Dashboard ma'lumoti yuklangan sana: {f}."
      ]
    },
    ru: {
      title: 'Внешняя торговля Узбекистана',
      subtitle: 'Экспорт и импорт в разрезе стран · источник: Национальный комитет по статистике (SIAT)',
      mode: 'Режим', export: 'Экспорт', import: 'Импорт', year: 'Год', month: 'Месяц', country: 'Страна',
      reset: 'Сбросить', allCountries: 'Все страны', wholeYear: 'Весь год',
      wholeYearPartial: 'С начала года (январь–{m})',
      months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
      monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
      periodYear: '{y} год', periodYtd: '{y}, январь–{m}', periodMonth: '{m} {y}',
      periodLine: 'Период: <strong>{p}</strong> · Страна: <strong>{c}</strong>',
      turnover: 'Товарооборот', balance: 'Сальдо торговли',
      vsPrev: 'к тому же периоду прошлого года', noPrev: 'нет данных за прошлый год',
      shareOf: 'Доля в общем {mode}е: {v}',
      surplus: 'профицит', deficit: 'дефицит',
      monthlyTitle: 'Помесячная динамика — {mode}, {c}',
      monthlyHint: 'Столбцы: {y} год, линия: {py} год. Нажмите на столбец, чтобы выбрать месяц.',
      yearlyTitle: 'По годам — экспорт и импорт, {c}',
      yearlyHint: '* {y} год — только январь–{m}. Нажмите на столбец, чтобы выбрать год.',
      yearlyHintFull: 'Нажмите на столбец, чтобы выбрать год.',
      topTitle: 'Топ-{n} стран — {mode}, {p}',
      topHint: '«{o}» ({v}, {s}) не включены в рейтинг. Нажмите на столбец, чтобы выбрать страну.',
      topHintNoOther: 'Нажмите на столбец, чтобы выбрать страну.',
      tableTitle: 'Все страны — {mode}, {p}',
      search: 'Поиск…',
      colRank: '№', colCountry: 'Страна', colValue: 'млн $', colShare: 'Доля', colPrev: 'Прошлый год', colChange: 'Изменение',
      tipPrev: 'Прошлый год', empty: 'Нет данных',
      notes: [
        'Источник: Национальный комитет Республики Узбекистан по статистике, открытые данные SIAT — <a href="{u1}" target="_blank" rel="noopener">экспорт</a>, <a href="{u2}" target="_blank" rel="noopener">импорт</a>. Единица измерения: тыс. долларов США (на дашборде — млн/млрд $).',
        'Помесячные значения в источнике накопительные с начала года; значение отдельного месяца вычислено как разница соседних месяцев. Из-за пересмотров в источнике отдельные небольшие значения могут быть отрицательными.',
        '«{o}» — часть без разбивки по странам. Она входит в итоговые суммы, но не включена в Топ-{n}.',
        'Последнее изменение в источнике: {mod}. Дата загрузки данных дашборда: {f}.'
      ]
    }
  };
  var MODE_WORD_RU = { export: 'экспорт', import: 'импорт' };
  var MODE_WORD_UZ = { export: 'eksport', import: 'import' };

  function t(key, vars) {
    var s = I18N[state.lang][key];
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function modeWord(mode) { return (state.lang === 'ru' ? MODE_WORD_RU : MODE_WORD_UZ)[mode]; }
  function modeTitle(mode) { return t(mode); }

  // ---------- Ma'lumotni o'qish ----------
  function parseDataset(raw) {
    var block = raw[0];
    var meta = {};
    block.metadata.forEach(function (m) { meta[m.name_en] = m; });
    var periods = Object.keys(block.data[0]).filter(function (k) { return /^\d{4}-M\d{2}$/.test(k); }).sort();
    var rows = {};
    block.data.forEach(function (r) {
      rows[String(r.Code)] = {
        names: { uz: r.Klassifikator, ru: r.Klassifikator_ru },
        cum: periods.reduce(function (acc, p) { acc[p] = typeof r[p] === 'number' ? r[p] : null; return acc; }, {})
      };
    });
    return { meta: meta, periods: periods, rows: rows };
  }

  var DS = { export: parseDataset(window.SIAT_DATA.export), import: parseDataset(window.SIAT_DATA.import) };

  // Har bir yil uchun mavjud oxirgi oy (masalan, joriy yil to'liq bo'lmasligi mumkin)
  var lastMonth = {};
  DS.export.periods.forEach(function (p) {
    var y = +p.slice(0, 4), m = +p.slice(6);
    if (DS.import.periods.indexOf(p) !== -1) lastMonth[y] = Math.max(lastMonth[y] || 0, m);
  });
  var YEARS = Object.keys(lastMonth).map(Number).sort();

  // Ikkala fayldagi mamlakatlar birlashmasi
  var COUNTRIES = {};
  ['export', 'import'].forEach(function (mode) {
    Object.keys(DS[mode].rows).forEach(function (code) {
      if (!COUNTRIES[code]) COUNTRIES[code] = DS[mode].rows[code].names;
    });
  });
  function countryName(code) {
    if (code === 'all') return t('allCountries');
    var n = COUNTRIES[code];
    return n ? (n[state.lang] || n.uz) : code;
  }

  function pkey(y, m) { return y + '-M' + (m < 10 ? '0' : '') + m; }

  // Jamlanma qiymat: y-yil yanvar..m oy
  function cumOf(row, y, m) {
    if (!row) return 0; // mamlakat bu faylda yo'q => savdo yo'q
    var v = row.cum[pkey(y, m)];
    return v === undefined ? null : v;
  }

  // Davr qiymati: month=0 => yil boshidan (mavjud oxirgi oygacha), aks holda bitta oy
  function rowValue(row, y, month, uptoMonth) {
    if (month === 0) return cumOf(row, y, uptoMonth || lastMonth[y]);
    var cur = cumOf(row, y, month);
    if (cur === null) return null;
    if (month === 1) return cur;
    var prev = cumOf(row, y, month - 1);
    return prev === null ? null : cur - prev;
  }

  // mode bo'yicha qiymat; code='all' => barcha mamlakatlar yig'indisi
  function value(mode, code, y, month, uptoMonth) {
    if (!lastMonth[y]) return null;
    var rows = DS[mode].rows;
    if (code !== 'all') return rowValue(rows[code], y, month, uptoMonth);
    var sum = 0, any = false;
    Object.keys(rows).forEach(function (c) {
      var v = rowValue(rows[c], y, month, uptoMonth);
      if (v !== null) { sum += v; any = true; }
    });
    return any ? sum : null;
  }

  // O'tgan yilning xuddi shu davri (joriy yil to'liq bo'lmasa — o'sha oygacha)
  function prevValue(mode, code, y, month) {
    if (!lastMonth[y - 1]) return null;
    if (month === 0) return value(mode, code, y - 1, 0, Math.min(lastMonth[y], lastMonth[y - 1]));
    return month <= lastMonth[y - 1] ? value(mode, code, y - 1, month) : null;
  }

  // ---------- Formatlash ----------
  var nf1 = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf2 = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var nf0 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  function units() { return state.lang === 'ru' ? { bn: 'млрд $', mn: 'млн $', th: 'тыс. $' } : { bn: 'mlrd $', mn: 'mln $', th: 'ming $' }; }

  // v — ming dollarda
  function fmtMoney(v) {
    if (v === null || v === undefined || isNaN(v)) return '—';
    var u = units(), a = Math.abs(v);
    if (a >= 1e6) return nf2.format(v / 1e6) + ' ' + u.bn;
    if (a >= 1e3) return nf1.format(v / 1e3) + ' ' + u.mn;
    return nf1.format(v) + ' ' + u.th;
  }
  function fmtMn(v) { return v === null ? '—' : nf1.format(v / 1e3); }
  function fmtAxis(v) {
    var u = units(), a = Math.abs(v);
    if (a >= 1e6) return nf1.format(v / 1e6) + ' ' + u.bn;
    if (a >= 1e3) return nf0.format(v / 1e3) + ' ' + u.mn;
    return nf0.format(v);
  }
  function fmtPct(x) { return x === null || !isFinite(x) ? '—' : nf1.format(x * 100) + '%'; }
  function change(cur, prev) {
    if (cur === null || prev === null || prev === 0) return null;
    return (cur - prev) / Math.abs(prev);
  }
  function deltaHtml(ch) {
    if (ch === null) return '<span>—</span>';
    var cls = ch > 0 ? 'delta-up' : (ch < 0 ? 'delta-down' : '');
    var arrow = ch > 0 ? '▲' : (ch < 0 ? '▼' : '');
    return '<span class="' + cls + '">' + arrow + ' ' + (ch > 0 ? '+' : '') + fmtPct(ch) + '</span>';
  }

  function periodLabel(y, month) {
    var L = I18N[state.lang];
    if (month > 0) return t('periodMonth', { y: y, m: L.months[month - 1] });
    if (lastMonth[y] === 12) return t('periodYear', { y: y });
    return t('periodYtd', { y: y, m: L.months[lastMonth[y] - 1] });
  }

  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function withAlpha(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function modeColor(mode) { return cssVar(mode === 'export' ? '--series-export' : '--series-import'); }

  // ---------- Holat (URL hash'da saqlanadi — havolani ulashish mumkin) ----------
  var DEFAULT = { mode: 'export', year: YEARS[YEARS.length - 1], month: 0, country: 'all', lang: 'uz' };
  var state = Object.assign({}, DEFAULT);
  var table = { sortKey: 'value', sortDir: -1, query: '' };

  function readHash() {
    var p = new URLSearchParams(location.hash.slice(1));
    if (p.get('mode') === 'export' || p.get('mode') === 'import') state.mode = p.get('mode');
    if (lastMonth[+p.get('year')]) state.year = +p.get('year');
    var m = +p.get('month');
    if (m >= 1 && m <= lastMonth[state.year]) state.month = m;
    if (p.get('country') && COUNTRIES[p.get('country')]) state.country = p.get('country');
    if (p.get('lang') === 'ru' || p.get('lang') === 'uz') state.lang = p.get('lang');
  }
  function writeHash() {
    var p = new URLSearchParams({ mode: state.mode, year: state.year, month: state.month, country: state.country, lang: state.lang });
    history.replaceState(null, '', '#' + p.toString());
  }

  function set(patch) {
    Object.assign(state, patch);
    if (state.month > lastMonth[state.year]) state.month = 0;
    writeHash();
    render();
  }

  // ---------- Filtrlar ----------
  var $ = function (id) { return document.getElementById(id); };

  function renderFilters() {
    var L = I18N[state.lang];
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $('subtitle').textContent = t('subtitle');
    $('tableSearch').placeholder = t('search');

    document.querySelectorAll('[data-mode]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode)); });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)); });

    $('yearSel').innerHTML = YEARS.slice().reverse().map(function (y) {
      return '<option value="' + y + '"' + (y === state.year ? ' selected' : '') + '>' + y + (lastMonth[y] < 12 ? ' *' : '') + '</option>';
    }).join('');

    var lm = lastMonth[state.year];
    var opts = ['<option value="0">' + (lm === 12 ? t('wholeYear') : t('wholeYearPartial', { m: L.months[lm - 1] })) + '</option>'];
    for (var m = 1; m <= lm; m++) opts.push('<option value="' + m + '">' + cap(L.months[m - 1]) + '</option>');
    $('monthSel').innerHTML = opts.join('');
    $('monthSel').value = String(state.month);

    var codes = Object.keys(COUNTRIES).sort(function (a, b) {
      if (a === OTHER_CODE) return 1;
      if (b === OTHER_CODE) return -1;
      return countryName(a).localeCompare(countryName(b), state.lang);
    });
    $('countrySel').innerHTML = '<option value="all">' + t('allCountries') + '</option>' + codes.map(function (c) {
      return '<option value="' + c + '">' + esc(countryName(c)) + '</option>';
    }).join('');
    $('countrySel').value = state.country;
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return '&#' + ch.charCodeAt(0) + ';'; }); }

  // ---------- KPI kartochkalar ----------
  function renderKpis() {
    var y = state.year, m = state.month, c = state.country;
    var ex = value('export', c, y, m), im = value('import', c, y, m);
    var exP = prevValue('export', c, y, m), imP = prevValue('import', c, y, m);
    var to = ex === null || im === null ? null : ex + im;
    var toP = exP === null || imP === null ? null : exP + imP;
    var bal = ex === null || im === null ? null : ex - im;
    var balP = exP === null || imP === null ? null : exP - imP;

    function share(mode, v) {
      if (c === 'all' || v === null) return '';
      var total = value(mode, 'all', y, m);
      return '<div class="k-extra">' + t('shareOf', { mode: modeWord(mode), v: fmtPct(total ? v / total : null) }) + '</div>';
    }
    function delta(cur, prev) {
      if (prev === null) return '<div class="k-delta">' + t('noPrev') + '</div>';
      return '<div class="k-delta">' + deltaHtml(change(cur, prev)) + ' ' + t('vsPrev') + '</div>';
    }
    function card(label, v, color, extra) {
      return '<div class="kpi" style="--kpi-color:' + color + '"><div class="k-label">' + label + '</div>' +
        '<div class="k-value">' + fmtMoney(v) + '</div>' + extra + '</div>';
    }
    var balDelta = balP === null ? '<div class="k-delta">' + t('noPrev') + '</div>'
      : '<div class="k-delta">' + (bal - balP >= 0 ? '+' : '') + fmtMoney(bal - balP) + ' ' + t('vsPrev') + '</div>';

    $('kpis').innerHTML =
      card(t('export'), ex, 'var(--series-export)', delta(ex, exP) + share('export', ex)) +
      card(t('import'), im, 'var(--series-import)', delta(im, imP) + share('import', im)) +
      card(t('turnover'), to, 'var(--axis)', delta(to, toP)) +
      card(t('balance') + (bal === null ? '' : ' · ' + (bal >= 0 ? t('surplus') : t('deficit'))), bal, 'var(--axis)', balDelta);

    $('periodLine').innerHTML = t('periodLine', { p: esc(periodLabel(y, m)), c: esc(countryName(c)) });
  }

  // ---------- Grafiklar ----------
  var charts = {};

  function baseOptions() {
    var grid = cssVar('--grid'), muted = cssVar('--text-muted'), text = cssVar('--text-secondary');
    Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    Chart.defaults.color = text;
    return {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'start', labels: { boxWidth: 10, boxHeight: 10, useBorderRadius: true, borderRadius: 2, color: text } },
        tooltip: {
          backgroundColor: cssVar('--surface'), titleColor: cssVar('--text-primary'), bodyColor: text,
          borderColor: cssVar('--axis'), borderWidth: 1, padding: 10, boxPadding: 4,
          callbacks: { label: function (ctx) { return ' ' + ctx.dataset.label + ': ' + fmtMoney(ctx.parsed.y !== undefined && ctx.chart.options.indexAxis !== 'y' ? ctx.parsed.y : ctx.parsed.x); } }
        }
      },
      scales: {
        x: { grid: { display: false }, border: { color: cssVar('--axis') }, ticks: { color: muted } },
        y: { grid: { color: grid }, border: { display: false }, ticks: { color: muted, callback: fmtAxis }, beginAtZero: true }
      }
    };
  }

  function upsert(id, config) {
    // Grafik o'z click hodisasi ichida o'chirilmasligi uchun qayta chizishni keyinga suramiz
    var onClick = config.options.onClick;
    if (onClick) config.options.onClick = function (evt, els) { setTimeout(function () { onClick(evt, els); }, 0); };
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart($(id), config);
  }

  function renderMonthly() {
    var L = I18N[state.lang], y = state.year, mode = state.mode, c = state.country;
    var color = modeColor(mode);
    var cur = [], prev = [];
    for (var m = 1; m <= 12; m++) {
      cur.push(m <= lastMonth[y] ? value(mode, c, y, m) : null);
      prev.push(lastMonth[y - 1] && m <= lastMonth[y - 1] ? value(mode, c, y - 1, m) : null);
    }
    var colors = cur.map(function (_, i) { return state.month && state.month !== i + 1 ? withAlpha(color, 0.35) : color; });
    var datasets = [{
      type: 'bar', label: modeTitle(mode) + ' ' + y, data: cur, backgroundColor: colors, hoverBackgroundColor: color,
      borderRadius: 4, borderSkipped: 'start', maxBarThickness: 36, order: 2
    }];
    if (lastMonth[y - 1]) {
      datasets.push({
        type: 'line', label: modeTitle(mode) + ' ' + (y - 1), data: prev, borderColor: cssVar('--series-prev'),
        backgroundColor: cssVar('--series-prev'), borderWidth: 2, pointRadius: 3, pointHoverRadius: 5, tension: 0.25, order: 1
      });
    }
    var opts = baseOptions();
    opts.onClick = function (evt, els) {
      if (!els.length) return;
      var mm = els[0].index + 1;
      if (mm <= lastMonth[y]) set({ month: state.month === mm ? 0 : mm });
    };
    opts.onHover = pointer;
    upsert('monthlyChart', { type: 'bar', data: { labels: L.monthsShort, datasets: datasets }, options: opts });

    $('monthlyTitle').textContent = t('monthlyTitle', { mode: modeTitle(mode), c: countryName(c) });
    $('monthlyHint').textContent = lastMonth[y - 1] ? t('monthlyHint', { y: y, py: y - 1 }) : '';
  }

  function renderYearly() {
    var L = I18N[state.lang], c = state.country;
    var labels = YEARS.map(function (y) { return lastMonth[y] < 12 ? y + '*' : String(y); });
    function series(mode) {
      return YEARS.map(function (y) {
        // Oy tanlangan bo'lsa — har yilning o'sha oyi; aks holda yil jami
        return state.month ? (state.month <= lastMonth[y] ? value(mode, c, y, state.month) : null) : value(mode, c, y, 0);
      });
    }
    var datasets = ['export', 'import'].map(function (mode) {
      var col = modeColor(mode);
      return {
        label: modeTitle(mode), data: series(mode),
        backgroundColor: YEARS.map(function (y) { return y === state.year ? col : withAlpha(col, 0.45); }),
        hoverBackgroundColor: col, borderRadius: 4, borderSkipped: 'start', maxBarThickness: 28,
        borderColor: cssVar('--surface'), borderWidth: { left: 1, right: 1 }
      };
    });
    var opts = baseOptions();
    opts.onClick = function (evt, els) { if (els.length) set({ year: YEARS[els[0].index] }); };
    opts.onHover = pointer;
    upsert('yearlyChart', { type: 'bar', data: { labels: labels, datasets: datasets }, options: opts });

    var partial = YEARS.filter(function (y) { return lastMonth[y] < 12; });
    $('yearlyTitle').textContent = t('yearlyTitle', { c: countryName(c) }) + (state.month ? ' · ' + cap(L.months[state.month - 1]) : '');
    $('yearlyHint').textContent = partial.length && !state.month
      ? t('yearlyHint', { y: partial[0], m: L.months[lastMonth[partial[0]] - 1] })
      : t('yearlyHintFull');
  }

  // Tanlangan rejim/davr bo'yicha barcha mamlakatlar ro'yxati
  function countryRows() {
    var mode = state.mode, y = state.year, m = state.month;
    var total = value(mode, 'all', y, m);
    return Object.keys(COUNTRIES).map(function (code) {
      var v = value(mode, code, y, m), p = prevValue(mode, code, y, m);
      return { code: code, name: countryName(code), value: v, share: total ? (v || 0) / total : null, prev: p, change: change(v, p) };
    }).filter(function (r) { return (r.value || 0) !== 0 || (r.prev || 0) !== 0; });
  }

  function renderTop(rows) {
    var mode = state.mode, color = modeColor(mode);
    var top = rows.filter(function (r) { return r.code !== OTHER_CODE && r.value > 0; })
      .sort(function (a, b) { return b.value - a.value; }).slice(0, TOP_N);
    var other = rows.filter(function (r) { return r.code === OTHER_CODE; })[0];
    var sel = state.country;
    var hasSel = top.some(function (r) { return r.code === sel; });

    var opts = baseOptions();
    opts.indexAxis = 'y';
    opts.interaction = { mode: 'nearest', axis: 'y', intersect: false };
    opts.plugins.legend = { display: false };
    opts.scales = {
      x: { grid: { color: cssVar('--grid') }, border: { display: false }, ticks: { color: cssVar('--text-muted'), callback: fmtAxis, maxRotation: 0, maxTicksLimit: 5 }, beginAtZero: true },
      y: { grid: { display: false }, border: { color: cssVar('--axis') }, ticks: { color: cssVar('--text-secondary'), autoSkip: false } }
    };
    opts.plugins.tooltip.callbacks.label = function (ctx) {
      var r = top[ctx.dataIndex];
      return ' ' + fmtMoney(r.value) + ' · ' + fmtPct(r.share);
    };
    opts.onClick = function (evt, els) { if (els.length) { var code = top[els[0].index].code; set({ country: sel === code ? 'all' : code }); } };
    opts.onHover = pointer;
    upsert('topChart', {
      type: 'bar',
      data: {
        labels: top.map(function (r) { return r.name; }),
        datasets: [{
          label: modeTitle(mode), data: top.map(function (r) { return r.value; }),
          backgroundColor: top.map(function (r) { return hasSel && r.code !== sel ? withAlpha(color, 0.35) : color; }),
          hoverBackgroundColor: color, borderRadius: 4, borderSkipped: 'start', maxBarThickness: 22
        }]
      },
      options: opts
    });

    $('topTitle').textContent = t('topTitle', { n: TOP_N, mode: modeTitle(mode), p: periodLabel(state.year, state.month) });
    $('topHint').textContent = other && other.value
      ? t('topHint', { o: countryName(OTHER_CODE), v: fmtMoney(other.value), s: fmtPct(other.share) })
      : t('topHintNoOther');
  }

  function pointer(evt, els) { evt.native.target.style.cursor = els.length ? 'pointer' : 'default'; }

  // ---------- Jadval ----------
  var COLS = [
    { key: 'rank', label: 'colRank', sortable: false },
    { key: 'name', label: 'colCountry' },
    { key: 'value', label: 'colValue' },
    { key: 'share', label: 'colShare' },
    { key: 'prev', label: 'colPrev' },
    { key: 'change', label: 'colChange' }
  ];

  function renderTable(rows) {
    $('tableTitle').textContent = t('tableTitle', { mode: modeTitle(state.mode), p: periodLabel(state.year, state.month) });
    var headRow = document.querySelector('#countryTable thead tr');
    headRow.innerHTML = COLS.map(function (col) {
      var sort = table.sortKey === col.key ? (table.sortDir > 0 ? 'ascending' : 'descending') : 'none';
      var label = t(col.label);
      return '<th data-key="' + col.key + '"' + (col.sortable === false ? '' : ' aria-sort="' + sort + '"') + '>' + esc(label) + '</th>';
    }).join('');

    // O'rin (rank) har doim qiymat bo'yicha
    var ranked = rows.slice().sort(function (a, b) { return (b.value || 0) - (a.value || 0); });
    var rank = {};
    ranked.forEach(function (r, i) { rank[r.code] = i + 1; });

    var q = table.query.trim().toLowerCase();
    var list = rows.filter(function (r) {
      return !q || r.name.toLowerCase().indexOf(q) !== -1 ||
        (COUNTRIES[r.code].uz || '').toLowerCase().indexOf(q) !== -1 ||
        (COUNTRIES[r.code].ru || '').toLowerCase().indexOf(q) !== -1;
    });
    var k = table.sortKey, dir = table.sortDir;
    list.sort(function (a, b) {
      if (k === 'name') return dir * a.name.localeCompare(b.name, state.lang);
      var av = a[k], bv = b[k];
      if (av === null) return 1;
      if (bv === null) return -1;
      return dir * (av - bv);
    });

    var body = document.querySelector('#countryTable tbody');
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="6" class="muted" style="text-align:center">' + t('empty') + '</td></tr>';
      return;
    }
    body.innerHTML = list.map(function (r) {
      var cls = [r.code === state.country ? 'selected' : '', r.code === OTHER_CODE ? 'other' : ''].join(' ').trim();
      return '<tr data-code="' + r.code + '"' + (cls ? ' class="' + cls + '"' : '') + '>' +
        '<td class="muted">' + rank[r.code] + '</td>' +
        '<td>' + esc(r.name) + '</td>' +
        '<td>' + fmtMn(r.value) + '</td>' +
        '<td>' + fmtPct(r.share) + '</td>' +
        '<td class="muted">' + fmtMn(r.prev) + '</td>' +
        '<td>' + deltaHtml(r.change) + '</td></tr>';
    }).join('');
  }

  function renderNotes() {
    var mod = (DS.export.meta['Last modified date'] || {}).value_en || '—';
    $('notes').innerHTML = I18N[state.lang].notes.map(function (s) {
      return '<p>' + s.replace('{u1}', 'https://siat.stat.uz/media/uploads/sdmx/sdmx_data_1170.json')
        .replace('{u2}', 'https://siat.stat.uz/media/uploads/sdmx/sdmx_data_1173.json')
        .replace('{n}', TOP_N).replace('{o}', countryName(OTHER_CODE)).replace('{mod}', mod).replace('{f}', window.SIAT_DATA.fetchedAt || '—') + '</p>';
    }).join('');
  }

  function render() {
    renderFilters();
    renderKpis();
    renderMonthly();
    renderYearly();
    var rows = countryRows();
    renderTop(rows);
    renderTable(rows);
    renderNotes();
  }

  // ---------- Hodisalar ----------
  document.querySelectorAll('[data-mode]').forEach(function (b) { b.addEventListener('click', function () { set({ mode: b.dataset.mode }); }); });
  document.querySelectorAll('[data-lang]').forEach(function (b) { b.addEventListener('click', function () { set({ lang: b.dataset.lang }); }); });
  $('yearSel').addEventListener('change', function (e) { set({ year: +e.target.value }); });
  $('monthSel').addEventListener('change', function (e) { set({ month: +e.target.value }); });
  $('countrySel').addEventListener('change', function (e) { set({ country: e.target.value }); });
  $('resetBtn').addEventListener('click', function () {
    table.query = ''; $('tableSearch').value = '';
    set({ mode: DEFAULT.mode, year: DEFAULT.year, month: 0, country: 'all' });
  });
  $('tableSearch').addEventListener('input', function (e) { table.query = e.target.value; renderTable(countryRows()); });
  document.querySelector('#countryTable thead').addEventListener('click', function (e) {
    var th = e.target.closest('th');
    if (!th || th.dataset.key === 'rank') return;
    var key = th.dataset.key;
    if (table.sortKey === key) table.sortDir *= -1;
    else { table.sortKey = key; table.sortDir = key === 'name' ? 1 : -1; }
    renderTable(countryRows());
  });
  document.querySelector('#countryTable tbody').addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-code]');
    if (tr) set({ country: state.country === tr.dataset.code ? 'all' : tr.dataset.code });
  });
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', render);
  }

  readHash();
  writeHash();
  render();
})();
