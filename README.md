# Signal — Network Coverage Map / Сүлжээний Хамрах Хүрээний Газрын Зураг

> 🇲🇳 [Монгол](#монгол) · 🇬🇧 [English](#english)

---

<a name="english"></a>
## 🇬🇧 English

An interactive web app showing mobile network coverage across Ulaanbaatar, Mongolia.

### About

**Signal** is a platform that visualizes mobile network quality on a map for Ulaanbaatar. It lets you filter and compare signal strength and coverage across Mobicom, Unitel, and Skytel carriers in real time across 2G, 3G, 4G, and 5G networks.

### Features

- **Interactive map** — Dark-themed Leaflet map centered on Ulaanbaatar with colored sample dots
- **Color modes** — Switch between signal level and network type coloring
  - Signal level: 5=green, 4=lime, 3=yellow, 2=orange, 1=red
  - Network type: 5G=blue, 4G=green, 3G=yellow, 2G=red
- **Filters** — Filter by carrier, network type, and signal level range
- **Sample popover** — Click any dot to see carrier, network type, signal (dBm), WiFi strength, speed, and timestamp
- **Stats bar** — Total samples, average signal, best carrier, and per-network counts at a glance

### Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [shadcn/ui](https://ui.shadcn.com) | UI components (Card, Badge, Slider) |
| [Radix UI](https://www.radix-ui.com) | Accessible UI primitives |
| [Leaflet](https://leafletjs.com) | Interactive map |

### Getting Started

**Requires:** Node.js 18+

```bash
git clone https://github.com/amgaland/signal.git
cd signal
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### File Structure

```
signal/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page — filter state, wiring
│   └── globals.css       # Global CSS variables
├── components/
│   ├── CoverageMap.tsx   # Leaflet map + click popover
│   ├── FilterPanel.tsx   # Sidebar filter panel
│   ├── StatsBar.tsx      # Top stats bar
│   └── ui/               # shadcn/ui components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── slider.tsx
├── lib/
│   ├── mockData.ts       # 55 mock samples
│   └── utils.ts          # Tailwind merge helper
└── ...
```

### Data Model

```typescript
{
  ts: string;             // Timestamp (ISO 8601)
  device_id_hash: string; // Hashed device ID
  lat: number;            // Latitude
  lon: number;            // Longitude
  network_type: "2G" | "3G" | "4G" | "5G";
  carrier: "Mobicom" | "Unitel" | "Skytel";
  cellular_dbm: number;   // Signal strength (dBm)
  cellular_level: 1 | 2 | 3 | 4 | 5;
  wifi_dbm: number;       // WiFi signal strength
  wifi_level: 1 | 2 | 3 | 4;
  speed_kmh: number;      // Device speed (km/h)
  app_version: string;
}
```

### Signal Level Reference

| Level | dBm Range | Quality |
|-------|-----------|---------|
| 5 | −65 and above | Excellent |
| 4 | −75 to −65 | Good |
| 3 | −85 to −75 | Fair |
| 2 | −95 to −85 | Poor |
| 1 | Below −95 | Very Poor |

### License

MIT License © 2024

---

<a name="монгол"></a>
## 🇲🇳 Монгол

Улаанбаатар хотын гар утасны сүлжээний хамрах хүрээг харуулах интерактив вэб програм.

### Тухай

**Signal** нь Улаанбаатар хотод хэрэглэгчдийн гар утасны сүлжээний чанарыг газрын зурган дээр дүрслэн харуулах платформ юм. Mobicom, Unitel, Skytel операторуудын 2G, 3G, 4G, 5G сүлжээний дохионы хүч, хамрах хүрээг бодит цагт шүүж, харьцуулах боломжийг олгоно.

### Үндсэн боломжууд

- **Интерактив газрын зураг** — Улаанбаатар хотыг төвлөрүүлсэн харанхуй дэвсгэртэй Leaflet зураг дээр өгөгдлийн цэгүүдийг харуулна
- **Өнгөний горим** — Дохионы түвшин эсвэл сүлжээний төрлөөр өнгийг сонгож харах боломж
  - Дохионы түвшин: 5=ногоон, 4=цайвар ногоон, 3=шар, 2=улбар шар, 1=улаан
  - Сүлжээний төрөл: 5G=цэнхэр, 4G=ногоон, 3G=шар, 2G=улаан
- **Шүүлтүүр** — Оператор, сүлжээний төрөл, дохионы түвшнээр өгөгдлийг шүүнэ
- **Дэлгэрэнгүй мэдээлэл** — Цэг дээр дарахад оператор, сүлжээний төрөл, дохионы хүч (dBm), WiFi хүч, хурд зэрэг дэлгэрэнгүй мэдээлэл гарна
- **Статистик самбар** — Нийт дээж, дундаж дохионы хүч, хамгийн сайн оператор, сүлжээний төрлүүдийн тоо харагдана

### Технологийн стек

| Технологи | Зориулалт |
|-----------|-----------|
| [Next.js 14](https://nextjs.org) | App Router бүхий React фреймворк |
| [TypeScript](https://www.typescriptlang.org) | Төрлийн аюулгүй байдал |
| [Tailwind CSS](https://tailwindcss.com) | Загварчлал |
| [shadcn/ui](https://ui.shadcn.com) | UI компонентууд (Card, Badge, Slider) |
| [Radix UI](https://www.radix-ui.com) | Хүртээмжтэй UI примитивүүд |
| [Leaflet](https://leafletjs.com) | Интерактив газрын зураг |

### Суулгах заавар

**Шаардлага:** Node.js 18 болон түүнээс дээш хувилбар

```bash
git clone https://github.com/amgaland/signal.git
cd signal
npm install
npm run dev
```

Дараа нь хөтөч дээр [http://localhost:3000](http://localhost:3000) хаягийг нээнэ.

### Файлын бүтэц

```
signal/
├── app/
│   ├── layout.tsx        # Үндсэн layout
│   ├── page.tsx          # Нүүр хуудас — шүүлт, төлөв
│   └── globals.css       # Глобал CSS хувьсагчид
├── components/
│   ├── CoverageMap.tsx   # Leaflet газрын зураг + попап
│   ├── FilterPanel.tsx   # Хажуугийн шүүлтүүр самбар
│   ├── StatsBar.tsx      # Дээд статистик мөр
│   └── ui/               # shadcn/ui компонентууд
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── slider.tsx
├── lib/
│   ├── mockData.ts       # 55 дээжийн туршилтын өгөгдөл
│   └── utils.ts          # Tailwind нэгдүүлэх тусламж
└── ...
```

### Өгөгдлийн загвар

```typescript
{
  ts: string;             // Огноо, цаг (ISO 8601)
  device_id_hash: string; // Төхөөрөмжийн нэрийн хаш
  lat: number;            // Өргөрөг
  lon: number;            // Уртраг
  network_type: "2G" | "3G" | "4G" | "5G";
  carrier: "Mobicom" | "Unitel" | "Skytel";
  cellular_dbm: number;   // Дохионы хүч (dBm)
  cellular_level: 1 | 2 | 3 | 4 | 5;
  wifi_dbm: number;       // WiFi дохионы хүч
  wifi_level: 1 | 2 | 3 | 4;
  speed_kmh: number;      // Хурд (км/цаг)
  app_version: string;
}
```

### Дохионы түвшний утга

| Түвшин | dBm утга | Тайлбар |
|--------|----------|---------|
| 5 | −65 ба дээш | Маш сайн |
| 4 | −75 ~ −65 | Сайн |
| 3 | −85 ~ −75 | Дунд |
| 2 | −95 ~ −85 | Муу |
| 1 | −95-аас доош | Маш муу |

### Лиценз

MIT License © 2024
