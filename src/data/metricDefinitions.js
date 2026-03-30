export const DASHBOARD_METRICS = [
  {
    id: "life_expectancy",
    title: "Life Expectancy",
    shortTitle: "Life expectancy",
    description:
      "Average years a newborn is expected to live under current mortality patterns.",
    unit: "years",
    decimals: 1,
    direction: "up",
    fetch: {
      type: "owid",
      url: "https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Life%20expectancy/Life%20expectancy.csv",
      valueFieldCandidates: [
        "Life expectancy",
        "Life expectancy at birth",
        "Period life expectancy at birth - Sex: total - Age: 0",
        "Life expectancy at birth (historical)"
      ]
    },
    sourceName: "Our World in Data — Life expectancy dataset",
    sourceUrl:
      "https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Life%20expectancy/Life%20expectancy.csv"
  },
  {
    id: "extreme_poverty",
    title: "Extreme Poverty",
    shortTitle: "Extreme poverty",
    description:
      "Share of people living below the international poverty line (2017 PPP).",
    unit: "%",
    decimals: 1,
    direction: "down",
    fetch: {
      type: "owid",
      url: "https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Extreme%20poverty/Extreme%20poverty.csv",
      valueFieldCandidates: [
        "Share below $2.15 a day",
        "Extreme poverty",
        "Poverty headcount ratio at $2.15 a day (2017 PPP) (% of population)"
      ]
    },
    sourceName: "Our World in Data — Extreme poverty dataset",
    sourceUrl:
      "https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Extreme%20poverty/Extreme%20poverty.csv"
  },
  {
    id: "literacy_rate",
    title: "Literacy Rate",
    shortTitle: "Literacy",
    description:
      "Estimated share of adults (15+) who can read and write a short statement.",
    unit: "%",
    decimals: 1,
    direction: "up",
    fetch: {
      type: "owid",
      url: "https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Literacy%20rate/Literacy%20rate.csv",
      valueFieldCandidates: [
        "Literacy rate",
        "Literacy rate, adult total (% of people ages 15 and above)"
      ]
    },
    sourceName: "Our World in Data — Literacy rate dataset",
    sourceUrl:
      "https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Literacy%20rate/Literacy%20rate.csv"
  },
  {
    id: "child_mortality",
    title: "Child Mortality",
    shortTitle: "Child mortality",
    description: "Under-5 mortality rate (deaths per 1,000 live births).",
    unit: "per 1,000",
    decimals: 1,
    direction: "down",
    fetch: {
      type: "worldbank",
      indicator: "SH.DYN.MORT",
      countryCode: "WLD"
    },
    sourceName: "World Bank API — Under-5 mortality rate",
    sourceUrl:
      "https://api.worldbank.org/v2/country/all/indicator/SH.DYN.MORT?format=json"
  },
  {
    id: "internet_usage",
    title: "Internet Usage",
    shortTitle: "Internet access",
    description: "Share of people using the internet.",
    unit: "%",
    decimals: 1,
    direction: "up",
    fetch: {
      type: "worldbank",
      indicator: "IT.NET.USER.ZS",
      countryCode: "WLD"
    },
    sourceName: "World Bank API — Individuals using the Internet",
    sourceUrl:
      "https://api.worldbank.org/v2/country/all/indicator/IT.NET.USER.ZS?format=json"
  },
  {
    id: "electricity_access",
    title: "Access to Electricity",
    shortTitle: "Electricity access",
    description:
      "Share of the population with access to electricity in households.",
    unit: "%",
    decimals: 1,
    direction: "up",
    fetch: {
      type: "worldbank",
      indicator: "EG.ELC.ACCS.ZS",
      countryCode: "WLD"
    },
    sourceName: "World Bank API — Access to electricity",
    sourceUrl:
      "https://api.worldbank.org/v2/country/all/indicator/EG.ELC.ACCS.ZS?format=json"
  },
  {
    id: "vaccination_coverage",
    title: "Vaccination Coverage",
    shortTitle: "Vaccination",
    description:
      "DPT immunization coverage among children ages 12-23 months.",
    unit: "%",
    decimals: 1,
    direction: "up",
    fetch: {
      type: "worldbank",
      indicator: "SH.IMM.IDPT",
      countryCode: "WLD"
    },
    sourceName:
      "World Bank API (WHO/UNICEF estimates) — DPT immunization coverage",
    sourceUrl:
      "https://api.worldbank.org/v2/country/all/indicator/SH.IMM.IDPT?format=json"
  },
  {
    id: "school_enrollment",
    title: "School Enrollment",
    shortTitle: "School enrollment",
    description: "Primary school net enrollment rate.",
    unit: "%",
    decimals: 1,
    direction: "up",
    fetch: {
      type: "worldbank",
      indicator: "SE.PRM.NENR",
      countryCode: "WLD"
    },
    sourceName:
      "World Bank API (UNESCO UIS source) — Primary net enrollment",
    sourceUrl:
      "https://api.worldbank.org/v2/country/all/indicator/SE.PRM.NENR?format=json"
  },
  {
    id: "gender_equality",
    title: "Gender Equality Metric",
    shortTitle: "Women in parliament",
    description:
      "Share of seats held by women in national parliaments.",
    unit: "%",
    decimals: 1,
    direction: "up",
    fetch: {
      type: "worldbank",
      indicator: "SG.GEN.PARL.ZS",
      countryCode: "WLD"
    },
    sourceName:
      "World Bank API — Women in national parliaments",
    sourceUrl:
      "https://api.worldbank.org/v2/country/all/indicator/SG.GEN.PARL.ZS?format=json"
  },
  {
    id: "scientific_knowledge",
    title: "Scientific Knowledge Growth",
    shortTitle: "Scientific publications",
    description:
      "Scientific and technical journal articles published annually.",
    unit: "articles",
    decimals: 0,
    direction: "up",
    fetch: {
      type: "worldbank",
      indicator: "IP.JRN.ARTC.SC",
      countryCode: "WLD"
    },
    sourceName:
      "World Bank API — Scientific and technical journal articles",
    sourceUrl:
      "https://api.worldbank.org/v2/country/all/indicator/IP.JRN.ARTC.SC?format=json"
  }
];

export const SNAPSHOT_METRIC_IDS = [
  "life_expectancy",
  "literacy_rate",
  "extreme_poverty",
  "internet_usage"
];

export const COMPARISON_METRICS = [
  {
    id: "life_expectancy",
    label: "Life expectancy",
    indicator: "SP.DYN.LE00.IN",
    unit: "years",
    decimals: 1
  },
  {
    id: "extreme_poverty",
    label: "Extreme poverty",
    indicator: "SI.POV.DDAY",
    unit: "%",
    decimals: 1
  },
  {
    id: "internet_usage",
    label: "Internet usage",
    indicator: "IT.NET.USER.ZS",
    unit: "%",
    decimals: 1
  }
];

export const DEFAULT_COMPARISON_COUNTRIES = {
  countryA: "USA",
  countryB: "IND"
};
