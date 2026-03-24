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
      isdnSearch: "Search MSISDN",
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
      isdn: "MSISDN",
      collected: "Collected",
      period: "Period",
      samples: "Samples",
      quality: {
        5: "Excellent",
        4: "Good",
        3: "Fair",
        2: "Poor",
        1: "Very Poor",
      },
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
      isdnSearch: "MSISDN хайх",
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
      isdn: "MSISDN",
      collected: "Цуглуулсан",
      period: "Хугацаа",
      samples: "Дээж",
      quality: {
        5: "Маш сайн",
        4: "Сайн",
        3: "Дунд",
        2: "Муу",
        1: "Маш муу",
      },
    },
    map: {
      loading: "Зураг ачааллаж байна…",
    },
  },
} satisfies Record<Locale, unknown>;

export type Translations = (typeof translations)["en"];
