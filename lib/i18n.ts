export type Locale = "en" | "mn";

export const translations = {
  en: {
    appTitle: "UB Coverage Map",
    statsBar: {
      samples: "Samples",
      avgSignal: "Avg Signal",
      avgLevel: "Avg Level",
      bestCarrier: "Best Carrier",
    },
    filterPanel: {
      title: "Filters",
      reset: "Reset",
      showing: "Showing",
      samplesOf: "samples",
      colorMode: "Color Mode",
      signalLevel: "Signal Level",
      networkType: "Network Type",
      carrier: "Carrier",
      weak: "Weak (1)",
      strong: "Strong (5)",
      colorModes: {
        signal: "Signal Level",
        network: "Network Type",
      },
      legend: {
        signal: {
          5: "Excellent (≥ −65 dBm)",
          4: "Good (−75 to −65)",
          3: "Fair (−85 to −75)",
          2: "Poor (−95 to −85)",
          1: "Very Poor (< −95)",
        },
      },
    },
    popover: {
      signal: "Signal",
      level: "Level",
      wifi: "WiFi",
      speed: "Speed",
      app: "App",
    },
    map: {
      loading: "Loading map…",
    },
  },
  mn: {
    appTitle: "УБ Хамрах Хүрээ",
    statsBar: {
      samples: "Дээж",
      avgSignal: "Дундаж Дохио",
      avgLevel: "Дундаж Түвшин",
      bestCarrier: "Шилдэг Оператор",
    },
    filterPanel: {
      title: "Шүүлтүүр",
      reset: "Арилгах",
      showing: "Харуулж буй",
      samplesOf: "дээж",
      colorMode: "Өнгөний Горим",
      signalLevel: "Дохионы Түвшин",
      networkType: "Сүлжээний Төрөл",
      carrier: "Оператор",
      weak: "Сул (1)",
      strong: "Хүчтэй (5)",
      colorModes: {
        signal: "Дохионы Түвшин",
        network: "Сүлжээний Төрөл",
      },
      legend: {
        signal: {
          5: "Маш сайн (≥ −65 dBm)",
          4: "Сайн (−75 ~ −65)",
          3: "Дунд (−85 ~ −75)",
          2: "Муу (−95 ~ −85)",
          1: "Маш муу (< −95)",
        },
      },
    },
    popover: {
      signal: "Дохио",
      level: "Түвшин",
      wifi: "WiFi",
      speed: "Хурд",
      app: "Апп",
    },
    map: {
      loading: "Зураг ачааллаж байна…",
    },
  },
} satisfies Record<Locale, unknown>;

export type Translations = (typeof translations)["en"];
