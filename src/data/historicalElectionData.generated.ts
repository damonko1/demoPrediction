import type { HistoricalElectionYear } from "@/types/election";

export const historicalElectionYears = [2000,2004,2008,2012,2016,2020,2024] as const;

export const defaultHistoricalElectionYear: HistoricalElectionYear = 2024;

export const historicalStateResultsByYear = {
  "2000": {
    "AK": {
      "code": "AK",
      "democraticVotes": 79004,
      "republicanVotes": 167398,
      "otherVotes": 39158,
      "totalVotes": 285560,
      "baselineMargin": -30.95,
      "electoralVotes": 3
    },
    "AL": {
      "code": "AL",
      "democraticVotes": 692611,
      "republicanVotes": 941173,
      "otherVotes": 32488,
      "totalVotes": 1666272,
      "baselineMargin": -14.92,
      "electoralVotes": 9
    },
    "AR": {
      "code": "AR",
      "democraticVotes": 422768,
      "republicanVotes": 472940,
      "otherVotes": 26073,
      "totalVotes": 921781,
      "baselineMargin": -5.44,
      "electoralVotes": 6
    },
    "AZ": {
      "code": "AZ",
      "democraticVotes": 685341,
      "republicanVotes": 781652,
      "otherVotes": 65023,
      "totalVotes": 1532016,
      "baselineMargin": -6.29,
      "electoralVotes": 8
    },
    "CA": {
      "code": "CA",
      "democraticVotes": 5861203,
      "republicanVotes": 4567429,
      "otherVotes": 537190,
      "totalVotes": 10965822,
      "baselineMargin": 11.8,
      "electoralVotes": 54
    },
    "CO": {
      "code": "CO",
      "democraticVotes": 738227,
      "republicanVotes": 883748,
      "otherVotes": 119393,
      "totalVotes": 1741368,
      "baselineMargin": -8.36,
      "electoralVotes": 8
    },
    "CT": {
      "code": "CT",
      "democraticVotes": 816015,
      "republicanVotes": 561094,
      "otherVotes": 82416,
      "totalVotes": 1459525,
      "baselineMargin": 17.47,
      "electoralVotes": 8
    },
    "DC": {
      "code": "DC",
      "democraticVotes": 171923,
      "republicanVotes": 18073,
      "otherVotes": 11898,
      "totalVotes": 201894,
      "baselineMargin": 76.2,
      "electoralVotes": 3
    },
    "DE": {
      "code": "DE",
      "democraticVotes": 180068,
      "republicanVotes": 137288,
      "otherVotes": 10173,
      "totalVotes": 327529,
      "baselineMargin": 13.06,
      "electoralVotes": 3
    },
    "FL": {
      "code": "FL",
      "democraticVotes": 2912253,
      "republicanVotes": 2912790,
      "otherVotes": 138067,
      "totalVotes": 5963110,
      "baselineMargin": -0.01,
      "electoralVotes": 25
    },
    "GA": {
      "code": "GA",
      "democraticVotes": 1116230,
      "republicanVotes": 1419720,
      "otherVotes": 47258,
      "totalVotes": 2583208,
      "baselineMargin": -11.75,
      "electoralVotes": 13
    },
    "HI": {
      "code": "HI",
      "democraticVotes": 205286,
      "republicanVotes": 137845,
      "otherVotes": 24820,
      "totalVotes": 367951,
      "baselineMargin": 18.33,
      "electoralVotes": 4
    },
    "IA": {
      "code": "IA",
      "democraticVotes": 638517,
      "republicanVotes": 634373,
      "otherVotes": 80132,
      "totalVotes": 1353022,
      "baselineMargin": 0.31,
      "electoralVotes": 7
    },
    "ID": {
      "code": "ID",
      "democraticVotes": 138637,
      "republicanVotes": 336937,
      "otherVotes": 26041,
      "totalVotes": 501615,
      "baselineMargin": -39.53,
      "electoralVotes": 4
    },
    "IL": {
      "code": "IL",
      "democraticVotes": 2589026,
      "republicanVotes": 2019421,
      "otherVotes": 133661,
      "totalVotes": 4742108,
      "baselineMargin": 12.01,
      "electoralVotes": 22
    },
    "IN": {
      "code": "IN",
      "democraticVotes": 901980,
      "republicanVotes": 1245836,
      "otherVotes": 51486,
      "totalVotes": 2199302,
      "baselineMargin": -15.63,
      "electoralVotes": 12
    },
    "KS": {
      "code": "KS",
      "democraticVotes": 399276,
      "republicanVotes": 622332,
      "otherVotes": 50608,
      "totalVotes": 1072216,
      "baselineMargin": -20.8,
      "electoralVotes": 6
    },
    "KY": {
      "code": "KY",
      "democraticVotes": 638923,
      "republicanVotes": 872520,
      "otherVotes": 32663,
      "totalVotes": 1544106,
      "baselineMargin": -15.13,
      "electoralVotes": 8
    },
    "LA": {
      "code": "LA",
      "democraticVotes": 792344,
      "republicanVotes": 927871,
      "otherVotes": 45441,
      "totalVotes": 1765656,
      "baselineMargin": -7.68,
      "electoralVotes": 9
    },
    "MA": {
      "code": "MA",
      "democraticVotes": 1616487,
      "republicanVotes": 878502,
      "otherVotes": 238975,
      "totalVotes": 2733964,
      "baselineMargin": 26.99,
      "electoralVotes": 12
    },
    "MD": {
      "code": "MD",
      "democraticVotes": 1144008,
      "republicanVotes": 813827,
      "otherVotes": 67377,
      "totalVotes": 2025212,
      "baselineMargin": 16.3,
      "electoralVotes": 10
    },
    "ME": {
      "code": "ME",
      "democraticVotes": 319951,
      "republicanVotes": 286616,
      "otherVotes": 45250,
      "totalVotes": 651817,
      "baselineMargin": 5.11,
      "electoralVotes": 4
    },
    "MI": {
      "code": "MI",
      "democraticVotes": 2170418,
      "republicanVotes": 1953139,
      "otherVotes": 108944,
      "totalVotes": 4232501,
      "baselineMargin": 5.13,
      "electoralVotes": 18
    },
    "MN": {
      "code": "MN",
      "democraticVotes": 1168266,
      "republicanVotes": 1109659,
      "otherVotes": 160760,
      "totalVotes": 2438685,
      "baselineMargin": 2.4,
      "electoralVotes": 10
    },
    "MO": {
      "code": "MO",
      "democraticVotes": 1111138,
      "republicanVotes": 1189924,
      "otherVotes": 58830,
      "totalVotes": 2359892,
      "baselineMargin": -3.34,
      "electoralVotes": 11
    },
    "MS": {
      "code": "MS",
      "democraticVotes": 404614,
      "republicanVotes": 572844,
      "otherVotes": 16726,
      "totalVotes": 994184,
      "baselineMargin": -16.92,
      "electoralVotes": 7
    },
    "MT": {
      "code": "MT",
      "democraticVotes": 137126,
      "republicanVotes": 240178,
      "otherVotes": 33682,
      "totalVotes": 410986,
      "baselineMargin": -25.07,
      "electoralVotes": 3
    },
    "NC": {
      "code": "NC",
      "democraticVotes": 1257692,
      "republicanVotes": 1631163,
      "otherVotes": 26135,
      "totalVotes": 2914990,
      "baselineMargin": -12.81,
      "electoralVotes": 14
    },
    "ND": {
      "code": "ND",
      "democraticVotes": 95284,
      "republicanVotes": 174852,
      "otherVotes": 18120,
      "totalVotes": 288256,
      "baselineMargin": -27.6,
      "electoralVotes": 3
    },
    "NE": {
      "code": "NE",
      "democraticVotes": 231780,
      "republicanVotes": 433862,
      "otherVotes": 31377,
      "totalVotes": 697019,
      "baselineMargin": -28.99,
      "electoralVotes": 5
    },
    "NH": {
      "code": "NH",
      "democraticVotes": 266348,
      "republicanVotes": 273559,
      "otherVotes": 29174,
      "totalVotes": 569081,
      "baselineMargin": -1.27,
      "electoralVotes": 4
    },
    "NJ": {
      "code": "NJ",
      "democraticVotes": 1788850,
      "republicanVotes": 1284173,
      "otherVotes": 114203,
      "totalVotes": 3187226,
      "baselineMargin": 15.83,
      "electoralVotes": 15
    },
    "NM": {
      "code": "NM",
      "democraticVotes": 286783,
      "republicanVotes": 286417,
      "otherVotes": 25405,
      "totalVotes": 598605,
      "baselineMargin": 0.06,
      "electoralVotes": 5
    },
    "NV": {
      "code": "NV",
      "democraticVotes": 279978,
      "republicanVotes": 301575,
      "otherVotes": 27873,
      "totalVotes": 609426,
      "baselineMargin": -3.54,
      "electoralVotes": 4
    },
    "NY": {
      "code": "NY",
      "democraticVotes": 3942215,
      "republicanVotes": 2258577,
      "otherVotes": 759423,
      "totalVotes": 6960215,
      "baselineMargin": 24.19,
      "electoralVotes": 33
    },
    "OH": {
      "code": "OH",
      "democraticVotes": 2183628,
      "republicanVotes": 2350363,
      "otherVotes": 168007,
      "totalVotes": 4701998,
      "baselineMargin": -3.55,
      "electoralVotes": 21
    },
    "OK": {
      "code": "OK",
      "democraticVotes": 474276,
      "republicanVotes": 744337,
      "otherVotes": 15616,
      "totalVotes": 1234229,
      "baselineMargin": -21.88,
      "electoralVotes": 8
    },
    "OR": {
      "code": "OR",
      "democraticVotes": 720342,
      "republicanVotes": 713577,
      "otherVotes": 100031,
      "totalVotes": 1533950,
      "baselineMargin": 0.44,
      "electoralVotes": 7
    },
    "PA": {
      "code": "PA",
      "democraticVotes": 2485967,
      "republicanVotes": 2281127,
      "otherVotes": 145091,
      "totalVotes": 4912185,
      "baselineMargin": 4.17,
      "electoralVotes": 23
    },
    "RI": {
      "code": "RI",
      "democraticVotes": 249508,
      "republicanVotes": 130555,
      "otherVotes": 29049,
      "totalVotes": 409112,
      "baselineMargin": 29.08,
      "electoralVotes": 4
    },
    "SC": {
      "code": "SC",
      "democraticVotes": 566037,
      "republicanVotes": 786892,
      "otherVotes": 30973,
      "totalVotes": 1383902,
      "baselineMargin": -15.96,
      "electoralVotes": 8
    },
    "SD": {
      "code": "SD",
      "democraticVotes": 118804,
      "republicanVotes": 190700,
      "otherVotes": 6765,
      "totalVotes": 316269,
      "baselineMargin": -22.73,
      "electoralVotes": 3
    },
    "TN": {
      "code": "TN",
      "democraticVotes": 981720,
      "republicanVotes": 1061949,
      "otherVotes": 32512,
      "totalVotes": 2076181,
      "baselineMargin": -3.86,
      "electoralVotes": 11
    },
    "TX": {
      "code": "TX",
      "democraticVotes": 2433746,
      "republicanVotes": 3799639,
      "otherVotes": 174252,
      "totalVotes": 6407637,
      "baselineMargin": -21.32,
      "electoralVotes": 32
    },
    "UT": {
      "code": "UT",
      "democraticVotes": 203053,
      "republicanVotes": 515096,
      "otherVotes": 52605,
      "totalVotes": 770754,
      "baselineMargin": -40.49,
      "electoralVotes": 5
    },
    "VA": {
      "code": "VA",
      "democraticVotes": 1217290,
      "republicanVotes": 1437490,
      "otherVotes": 84667,
      "totalVotes": 2739447,
      "baselineMargin": -8.04,
      "electoralVotes": 13
    },
    "VT": {
      "code": "VT",
      "democraticVotes": 149022,
      "republicanVotes": 119775,
      "otherVotes": 25511,
      "totalVotes": 294308,
      "baselineMargin": 9.94,
      "electoralVotes": 3
    },
    "WA": {
      "code": "WA",
      "democraticVotes": 1247652,
      "republicanVotes": 1108864,
      "otherVotes": 130917,
      "totalVotes": 2487433,
      "baselineMargin": 5.58,
      "electoralVotes": 11
    },
    "WI": {
      "code": "WI",
      "democraticVotes": 1242987,
      "republicanVotes": 1237279,
      "otherVotes": 118341,
      "totalVotes": 2598607,
      "baselineMargin": 0.22,
      "electoralVotes": 11
    },
    "WV": {
      "code": "WV",
      "democraticVotes": 295497,
      "republicanVotes": 336475,
      "otherVotes": 16152,
      "totalVotes": 648124,
      "baselineMargin": -6.32,
      "electoralVotes": 5
    },
    "WY": {
      "code": "WY",
      "democraticVotes": 60481,
      "republicanVotes": 147947,
      "otherVotes": 5298,
      "totalVotes": 213726,
      "baselineMargin": -40.92,
      "electoralVotes": 3
    }
  },
  "2004": {
    "AK": {
      "code": "AK",
      "democraticVotes": 111025,
      "republicanVotes": 190889,
      "otherVotes": 10684,
      "totalVotes": 312598,
      "baselineMargin": -25.55,
      "electoralVotes": 3
    },
    "AL": {
      "code": "AL",
      "democraticVotes": 693933,
      "republicanVotes": 1176394,
      "otherVotes": 13088,
      "totalVotes": 1883415,
      "baselineMargin": -25.62,
      "electoralVotes": 9
    },
    "AR": {
      "code": "AR",
      "democraticVotes": 469953,
      "republicanVotes": 572898,
      "otherVotes": 12094,
      "totalVotes": 1054945,
      "baselineMargin": -9.76,
      "electoralVotes": 6
    },
    "AZ": {
      "code": "AZ",
      "democraticVotes": 893524,
      "republicanVotes": 1104294,
      "otherVotes": 14767,
      "totalVotes": 2012585,
      "baselineMargin": -10.47,
      "electoralVotes": 10
    },
    "CA": {
      "code": "CA",
      "democraticVotes": 6745485,
      "republicanVotes": 5509826,
      "otherVotes": 166042,
      "totalVotes": 12421353,
      "baselineMargin": 9.95,
      "electoralVotes": 55
    },
    "CO": {
      "code": "CO",
      "democraticVotes": 1001732,
      "republicanVotes": 1101255,
      "otherVotes": 26643,
      "totalVotes": 2129630,
      "baselineMargin": -4.67,
      "electoralVotes": 9
    },
    "CT": {
      "code": "CT",
      "democraticVotes": 857488,
      "republicanVotes": 693826,
      "otherVotes": 27455,
      "totalVotes": 1578769,
      "baselineMargin": 10.37,
      "electoralVotes": 7
    },
    "DC": {
      "code": "DC",
      "democraticVotes": 202970,
      "republicanVotes": 21256,
      "otherVotes": 3360,
      "totalVotes": 227586,
      "baselineMargin": 79.84,
      "electoralVotes": 3
    },
    "DE": {
      "code": "DE",
      "democraticVotes": 200152,
      "republicanVotes": 171660,
      "otherVotes": 3378,
      "totalVotes": 375190,
      "baselineMargin": 7.59,
      "electoralVotes": 3
    },
    "FL": {
      "code": "FL",
      "democraticVotes": 3583544,
      "republicanVotes": 3964522,
      "otherVotes": 61744,
      "totalVotes": 7609810,
      "baselineMargin": -5.01,
      "electoralVotes": 27
    },
    "GA": {
      "code": "GA",
      "democraticVotes": 1366149,
      "republicanVotes": 1914254,
      "otherVotes": 21472,
      "totalVotes": 3301875,
      "baselineMargin": -16.6,
      "electoralVotes": 15
    },
    "HI": {
      "code": "HI",
      "democraticVotes": 231708,
      "republicanVotes": 194191,
      "otherVotes": 3114,
      "totalVotes": 429013,
      "baselineMargin": 8.74,
      "electoralVotes": 4
    },
    "IA": {
      "code": "IA",
      "democraticVotes": 741898,
      "republicanVotes": 751957,
      "otherVotes": 13053,
      "totalVotes": 1506908,
      "baselineMargin": -0.67,
      "electoralVotes": 7
    },
    "ID": {
      "code": "ID",
      "democraticVotes": 181098,
      "republicanVotes": 409235,
      "otherVotes": 8043,
      "totalVotes": 598376,
      "baselineMargin": -38.13,
      "electoralVotes": 4
    },
    "IL": {
      "code": "IL",
      "democraticVotes": 2891550,
      "republicanVotes": 2345946,
      "otherVotes": 36826,
      "totalVotes": 5274322,
      "baselineMargin": 10.34,
      "electoralVotes": 21
    },
    "IN": {
      "code": "IN",
      "democraticVotes": 969011,
      "republicanVotes": 1479438,
      "otherVotes": 19553,
      "totalVotes": 2468002,
      "baselineMargin": -20.68,
      "electoralVotes": 11
    },
    "KS": {
      "code": "KS",
      "democraticVotes": 434993,
      "republicanVotes": 736456,
      "otherVotes": 16307,
      "totalVotes": 1187756,
      "baselineMargin": -25.38,
      "electoralVotes": 6
    },
    "KY": {
      "code": "KY",
      "democraticVotes": 712733,
      "republicanVotes": 1069439,
      "otherVotes": 13710,
      "totalVotes": 1795882,
      "baselineMargin": -19.86,
      "electoralVotes": 8
    },
    "LA": {
      "code": "LA",
      "democraticVotes": 820299,
      "republicanVotes": 1102169,
      "otherVotes": 20638,
      "totalVotes": 1943106,
      "baselineMargin": -14.51,
      "electoralVotes": 9
    },
    "MA": {
      "code": "MA",
      "democraticVotes": 1803800,
      "republicanVotes": 1071109,
      "otherVotes": 52546,
      "totalVotes": 2927455,
      "baselineMargin": 25.03,
      "electoralVotes": 12
    },
    "MD": {
      "code": "MD",
      "democraticVotes": 1334500,
      "republicanVotes": 1024703,
      "otherVotes": 25035,
      "totalVotes": 2384238,
      "baselineMargin": 12.99,
      "electoralVotes": 10
    },
    "ME": {
      "code": "ME",
      "democraticVotes": 396842,
      "republicanVotes": 330201,
      "otherVotes": 13709,
      "totalVotes": 740752,
      "baselineMargin": 9,
      "electoralVotes": 4
    },
    "MI": {
      "code": "MI",
      "democraticVotes": 2479183,
      "republicanVotes": 2313746,
      "otherVotes": 46323,
      "totalVotes": 4839252,
      "baselineMargin": 3.42,
      "electoralVotes": 17
    },
    "MN": {
      "code": "MN",
      "democraticVotes": 1445014,
      "republicanVotes": 1346695,
      "otherVotes": 36678,
      "totalVotes": 2828387,
      "baselineMargin": 3.48,
      "electoralVotes": 10
    },
    "MO": {
      "code": "MO",
      "democraticVotes": 1259171,
      "republicanVotes": 1455713,
      "otherVotes": 16480,
      "totalVotes": 2731364,
      "baselineMargin": -7.2,
      "electoralVotes": 11
    },
    "MS": {
      "code": "MS",
      "democraticVotes": 457766,
      "republicanVotes": 672660,
      "otherVotes": 9398,
      "totalVotes": 1139824,
      "baselineMargin": -18.85,
      "electoralVotes": 6
    },
    "MT": {
      "code": "MT",
      "democraticVotes": 173710,
      "republicanVotes": 266063,
      "otherVotes": 10661,
      "totalVotes": 450434,
      "baselineMargin": -20.5,
      "electoralVotes": 3
    },
    "NC": {
      "code": "NC",
      "democraticVotes": 1525849,
      "republicanVotes": 1961166,
      "otherVotes": 13992,
      "totalVotes": 3501007,
      "baselineMargin": -12.43,
      "electoralVotes": 15
    },
    "ND": {
      "code": "ND",
      "democraticVotes": 111052,
      "republicanVotes": 196651,
      "otherVotes": 5130,
      "totalVotes": 312833,
      "baselineMargin": -27.36,
      "electoralVotes": 3
    },
    "NE": {
      "code": "NE",
      "democraticVotes": 254328,
      "republicanVotes": 512814,
      "otherVotes": 11044,
      "totalVotes": 778186,
      "baselineMargin": -33.22,
      "electoralVotes": 5
    },
    "NH": {
      "code": "NH",
      "democraticVotes": 340511,
      "republicanVotes": 331237,
      "otherVotes": 6539,
      "totalVotes": 678287,
      "baselineMargin": 1.37,
      "electoralVotes": 4
    },
    "NJ": {
      "code": "NJ",
      "democraticVotes": 1911430,
      "republicanVotes": 1670003,
      "otherVotes": 30258,
      "totalVotes": 3611691,
      "baselineMargin": 6.68,
      "electoralVotes": 15
    },
    "NM": {
      "code": "NM",
      "democraticVotes": 370942,
      "republicanVotes": 376930,
      "otherVotes": 8432,
      "totalVotes": 756304,
      "baselineMargin": -0.79,
      "electoralVotes": 5
    },
    "NV": {
      "code": "NV",
      "democraticVotes": 397190,
      "republicanVotes": 418690,
      "otherVotes": 13707,
      "totalVotes": 829587,
      "baselineMargin": -2.59,
      "electoralVotes": 5
    },
    "NY": {
      "code": "NY",
      "democraticVotes": 4180755,
      "republicanVotes": 2806993,
      "otherVotes": 460518,
      "totalVotes": 7448266,
      "baselineMargin": 18.44,
      "electoralVotes": 31
    },
    "OH": {
      "code": "OH",
      "democraticVotes": 2741165,
      "republicanVotes": 2859764,
      "otherVotes": 26974,
      "totalVotes": 5627903,
      "baselineMargin": -2.11,
      "electoralVotes": 20
    },
    "OK": {
      "code": "OK",
      "democraticVotes": 503966,
      "republicanVotes": 959792,
      "otherVotes": 0,
      "totalVotes": 1463758,
      "baselineMargin": -31.14,
      "electoralVotes": 7
    },
    "OR": {
      "code": "OR",
      "democraticVotes": 943163,
      "republicanVotes": 866831,
      "otherVotes": 26788,
      "totalVotes": 1836782,
      "baselineMargin": 4.16,
      "electoralVotes": 7
    },
    "PA": {
      "code": "PA",
      "democraticVotes": 2938095,
      "republicanVotes": 2793847,
      "otherVotes": 37648,
      "totalVotes": 5769590,
      "baselineMargin": 2.5,
      "electoralVotes": 21
    },
    "RI": {
      "code": "RI",
      "democraticVotes": 259760,
      "republicanVotes": 169046,
      "otherVotes": 8328,
      "totalVotes": 437134,
      "baselineMargin": 20.75,
      "electoralVotes": 4
    },
    "SC": {
      "code": "SC",
      "democraticVotes": 661669,
      "republicanVotes": 937974,
      "otherVotes": 18057,
      "totalVotes": 1617700,
      "baselineMargin": -17.08,
      "electoralVotes": 8
    },
    "SD": {
      "code": "SD",
      "democraticVotes": 149244,
      "republicanVotes": 232584,
      "otherVotes": 6387,
      "totalVotes": 388215,
      "baselineMargin": -21.47,
      "electoralVotes": 3
    },
    "TN": {
      "code": "TN",
      "democraticVotes": 1036477,
      "republicanVotes": 1384375,
      "otherVotes": 16467,
      "totalVotes": 2437319,
      "baselineMargin": -14.27,
      "electoralVotes": 11
    },
    "TX": {
      "code": "TX",
      "democraticVotes": 2832704,
      "republicanVotes": 4526917,
      "otherVotes": 51128,
      "totalVotes": 7410749,
      "baselineMargin": -22.86,
      "electoralVotes": 34
    },
    "UT": {
      "code": "UT",
      "democraticVotes": 241199,
      "republicanVotes": 663742,
      "otherVotes": 22903,
      "totalVotes": 927844,
      "baselineMargin": -45.54,
      "electoralVotes": 5
    },
    "VA": {
      "code": "VA",
      "democraticVotes": 1454742,
      "republicanVotes": 1716959,
      "otherVotes": 23714,
      "totalVotes": 3195415,
      "baselineMargin": -8.21,
      "electoralVotes": 13
    },
    "VT": {
      "code": "VT",
      "democraticVotes": 184067,
      "republicanVotes": 121180,
      "otherVotes": 7062,
      "totalVotes": 312309,
      "baselineMargin": 20.14,
      "electoralVotes": 3
    },
    "WA": {
      "code": "WA",
      "democraticVotes": 1510201,
      "republicanVotes": 1304894,
      "otherVotes": 43989,
      "totalVotes": 2859084,
      "baselineMargin": 7.18,
      "electoralVotes": 11
    },
    "WI": {
      "code": "WI",
      "democraticVotes": 1489504,
      "republicanVotes": 1478120,
      "otherVotes": 29383,
      "totalVotes": 2997007,
      "baselineMargin": 0.38,
      "electoralVotes": 10
    },
    "WV": {
      "code": "WV",
      "democraticVotes": 326541,
      "republicanVotes": 423778,
      "otherVotes": 5473,
      "totalVotes": 755792,
      "baselineMargin": -12.87,
      "electoralVotes": 5
    },
    "WY": {
      "code": "WY",
      "democraticVotes": 70776,
      "republicanVotes": 167629,
      "otherVotes": 5456,
      "totalVotes": 243861,
      "baselineMargin": -39.72,
      "electoralVotes": 3
    }
  },
  "2008": {
    "AK": {
      "code": "AK",
      "democraticVotes": 123594,
      "republicanVotes": 193841,
      "otherVotes": 8762,
      "totalVotes": 326197,
      "baselineMargin": -21.54,
      "electoralVotes": 3
    },
    "AL": {
      "code": "AL",
      "democraticVotes": 813479,
      "republicanVotes": 1266546,
      "otherVotes": 19794,
      "totalVotes": 2099819,
      "baselineMargin": -21.58,
      "electoralVotes": 9
    },
    "AR": {
      "code": "AR",
      "democraticVotes": 422310,
      "republicanVotes": 638017,
      "otherVotes": 26290,
      "totalVotes": 1086617,
      "baselineMargin": -19.85,
      "electoralVotes": 6
    },
    "AZ": {
      "code": "AZ",
      "democraticVotes": 1034707,
      "republicanVotes": 1230111,
      "otherVotes": 28657,
      "totalVotes": 2293475,
      "baselineMargin": -8.52,
      "electoralVotes": 10
    },
    "CA": {
      "code": "CA",
      "democraticVotes": 8274473,
      "republicanVotes": 5011781,
      "otherVotes": 275646,
      "totalVotes": 13561900,
      "baselineMargin": 24.06,
      "electoralVotes": 55
    },
    "CO": {
      "code": "CO",
      "democraticVotes": 1288576,
      "republicanVotes": 1073589,
      "otherVotes": 39196,
      "totalVotes": 2401361,
      "baselineMargin": 8.95,
      "electoralVotes": 9
    },
    "CT": {
      "code": "CT",
      "democraticVotes": 997772,
      "republicanVotes": 629428,
      "otherVotes": 19592,
      "totalVotes": 1646792,
      "baselineMargin": 22.37,
      "electoralVotes": 7
    },
    "DC": {
      "code": "DC",
      "democraticVotes": 245800,
      "republicanVotes": 17367,
      "otherVotes": 2686,
      "totalVotes": 265853,
      "baselineMargin": 85.92,
      "electoralVotes": 3
    },
    "DE": {
      "code": "DE",
      "democraticVotes": 255459,
      "republicanVotes": 152374,
      "otherVotes": 4579,
      "totalVotes": 412412,
      "baselineMargin": 25,
      "electoralVotes": 3
    },
    "FL": {
      "code": "FL",
      "democraticVotes": 4282074,
      "republicanVotes": 4045624,
      "otherVotes": 63046,
      "totalVotes": 8390744,
      "baselineMargin": 2.82,
      "electoralVotes": 27
    },
    "GA": {
      "code": "GA",
      "democraticVotes": 1844123,
      "republicanVotes": 2048759,
      "otherVotes": 31604,
      "totalVotes": 3924486,
      "baselineMargin": -5.21,
      "electoralVotes": 15
    },
    "HI": {
      "code": "HI",
      "democraticVotes": 325871,
      "republicanVotes": 120566,
      "otherVotes": 9627,
      "totalVotes": 456064,
      "baselineMargin": 45.02,
      "electoralVotes": 4
    },
    "IA": {
      "code": "IA",
      "democraticVotes": 828940,
      "republicanVotes": 682379,
      "otherVotes": 25804,
      "totalVotes": 1537123,
      "baselineMargin": 9.53,
      "electoralVotes": 7
    },
    "ID": {
      "code": "ID",
      "democraticVotes": 236440,
      "republicanVotes": 403012,
      "otherVotes": 15670,
      "totalVotes": 655122,
      "baselineMargin": -25.43,
      "electoralVotes": 4
    },
    "IL": {
      "code": "IL",
      "democraticVotes": 3419348,
      "republicanVotes": 2031179,
      "otherVotes": 71844,
      "totalVotes": 5522371,
      "baselineMargin": 25.14,
      "electoralVotes": 21
    },
    "IN": {
      "code": "IN",
      "democraticVotes": 1374039,
      "republicanVotes": 1345648,
      "otherVotes": 31367,
      "totalVotes": 2751054,
      "baselineMargin": 1.03,
      "electoralVotes": 11
    },
    "KS": {
      "code": "KS",
      "democraticVotes": 514765,
      "republicanVotes": 699655,
      "otherVotes": 21452,
      "totalVotes": 1235872,
      "baselineMargin": -14.96,
      "electoralVotes": 6
    },
    "KY": {
      "code": "KY",
      "democraticVotes": 751985,
      "republicanVotes": 1048462,
      "otherVotes": 26173,
      "totalVotes": 1826620,
      "baselineMargin": -16.23,
      "electoralVotes": 8
    },
    "LA": {
      "code": "LA",
      "democraticVotes": 782989,
      "republicanVotes": 1148275,
      "otherVotes": 29497,
      "totalVotes": 1960761,
      "baselineMargin": -18.63,
      "electoralVotes": 9
    },
    "MA": {
      "code": "MA",
      "democraticVotes": 1904097,
      "republicanVotes": 1108854,
      "otherVotes": 90044,
      "totalVotes": 3102995,
      "baselineMargin": 25.63,
      "electoralVotes": 12
    },
    "MD": {
      "code": "MD",
      "democraticVotes": 1629467,
      "republicanVotes": 959862,
      "otherVotes": 42267,
      "totalVotes": 2631596,
      "baselineMargin": 25.44,
      "electoralVotes": 10
    },
    "ME": {
      "code": "ME",
      "democraticVotes": 421923,
      "republicanVotes": 295273,
      "otherVotes": 13967,
      "totalVotes": 731163,
      "baselineMargin": 17.32,
      "electoralVotes": 4
    },
    "MI": {
      "code": "MI",
      "democraticVotes": 2872579,
      "republicanVotes": 2048639,
      "otherVotes": 80378,
      "totalVotes": 5001596,
      "baselineMargin": 16.47,
      "electoralVotes": 17
    },
    "MN": {
      "code": "MN",
      "democraticVotes": 1573354,
      "republicanVotes": 1275409,
      "otherVotes": 61606,
      "totalVotes": 2910369,
      "baselineMargin": 10.24,
      "electoralVotes": 10
    },
    "MO": {
      "code": "MO",
      "democraticVotes": 1441911,
      "republicanVotes": 1445814,
      "otherVotes": 37480,
      "totalVotes": 2925205,
      "baselineMargin": -0.13,
      "electoralVotes": 11
    },
    "MS": {
      "code": "MS",
      "democraticVotes": 554662,
      "republicanVotes": 724597,
      "otherVotes": 10606,
      "totalVotes": 1289865,
      "baselineMargin": -13.17,
      "electoralVotes": 6
    },
    "MT": {
      "code": "MT",
      "democraticVotes": 231667,
      "republicanVotes": 242763,
      "otherVotes": 15679,
      "totalVotes": 490109,
      "baselineMargin": -2.26,
      "electoralVotes": 3
    },
    "NC": {
      "code": "NC",
      "democraticVotes": 2142651,
      "republicanVotes": 2128474,
      "otherVotes": 39726,
      "totalVotes": 4310851,
      "baselineMargin": 0.33,
      "electoralVotes": 15
    },
    "ND": {
      "code": "ND",
      "democraticVotes": 141278,
      "republicanVotes": 168601,
      "otherVotes": 6742,
      "totalVotes": 316621,
      "baselineMargin": -8.63,
      "electoralVotes": 3
    },
    "NE": {
      "code": "NE",
      "democraticVotes": 333319,
      "republicanVotes": 452979,
      "otherVotes": 14983,
      "totalVotes": 801281,
      "baselineMargin": -14.93,
      "electoralVotes": 5
    },
    "NH": {
      "code": "NH",
      "democraticVotes": 384826,
      "republicanVotes": 316534,
      "otherVotes": 9610,
      "totalVotes": 710970,
      "baselineMargin": 9.61,
      "electoralVotes": 4
    },
    "NJ": {
      "code": "NJ",
      "democraticVotes": 2215422,
      "republicanVotes": 1613207,
      "otherVotes": 39608,
      "totalVotes": 3868237,
      "baselineMargin": 15.57,
      "electoralVotes": 15
    },
    "NM": {
      "code": "NM",
      "democraticVotes": 472422,
      "republicanVotes": 346832,
      "otherVotes": 10904,
      "totalVotes": 830158,
      "baselineMargin": 15.13,
      "electoralVotes": 5
    },
    "NV": {
      "code": "NV",
      "democraticVotes": 533736,
      "republicanVotes": 412827,
      "otherVotes": 21285,
      "totalVotes": 967848,
      "baselineMargin": 12.49,
      "electoralVotes": 5
    },
    "NY": {
      "code": "NY",
      "democraticVotes": 4645332,
      "republicanVotes": 2418323,
      "otherVotes": 658364,
      "totalVotes": 7722019,
      "baselineMargin": 28.84,
      "electoralVotes": 31
    },
    "OH": {
      "code": "OH",
      "democraticVotes": 2940044,
      "republicanVotes": 2677820,
      "otherVotes": 90486,
      "totalVotes": 5708350,
      "baselineMargin": 4.59,
      "electoralVotes": 20
    },
    "OK": {
      "code": "OK",
      "democraticVotes": 502496,
      "republicanVotes": 960165,
      "otherVotes": 0,
      "totalVotes": 1462661,
      "baselineMargin": -31.29,
      "electoralVotes": 7
    },
    "OR": {
      "code": "OR",
      "democraticVotes": 1037291,
      "republicanVotes": 738475,
      "otherVotes": 52098,
      "totalVotes": 1827864,
      "baselineMargin": 16.35,
      "electoralVotes": 7
    },
    "PA": {
      "code": "PA",
      "democraticVotes": 3276363,
      "republicanVotes": 2655885,
      "otherVotes": 81024,
      "totalVotes": 6013272,
      "baselineMargin": 10.32,
      "electoralVotes": 21
    },
    "RI": {
      "code": "RI",
      "democraticVotes": 296571,
      "republicanVotes": 165391,
      "otherVotes": 9804,
      "totalVotes": 471766,
      "baselineMargin": 27.81,
      "electoralVotes": 4
    },
    "SC": {
      "code": "SC",
      "democraticVotes": 862449,
      "republicanVotes": 1034896,
      "otherVotes": 23624,
      "totalVotes": 1920969,
      "baselineMargin": -8.98,
      "electoralVotes": 8
    },
    "SD": {
      "code": "SD",
      "democraticVotes": 170924,
      "republicanVotes": 203054,
      "otherVotes": 7997,
      "totalVotes": 381975,
      "baselineMargin": -8.41,
      "electoralVotes": 3
    },
    "TN": {
      "code": "TN",
      "democraticVotes": 1087437,
      "republicanVotes": 1479178,
      "otherVotes": 33134,
      "totalVotes": 2599749,
      "baselineMargin": -15.07,
      "electoralVotes": 11
    },
    "TX": {
      "code": "TX",
      "democraticVotes": 3528633,
      "republicanVotes": 4479328,
      "otherVotes": 69834,
      "totalVotes": 8077795,
      "baselineMargin": -11.77,
      "electoralVotes": 34
    },
    "UT": {
      "code": "UT",
      "democraticVotes": 327670,
      "republicanVotes": 596030,
      "otherVotes": 28670,
      "totalVotes": 952370,
      "baselineMargin": -28.18,
      "electoralVotes": 5
    },
    "VA": {
      "code": "VA",
      "democraticVotes": 1959532,
      "republicanVotes": 1725005,
      "otherVotes": 38723,
      "totalVotes": 3723260,
      "baselineMargin": 6.3,
      "electoralVotes": 13
    },
    "VT": {
      "code": "VT",
      "democraticVotes": 219262,
      "republicanVotes": 98974,
      "otherVotes": 6810,
      "totalVotes": 325046,
      "baselineMargin": 37.01,
      "electoralVotes": 3
    },
    "WA": {
      "code": "WA",
      "democraticVotes": 1750848,
      "republicanVotes": 1229216,
      "otherVotes": 56814,
      "totalVotes": 3036878,
      "baselineMargin": 17.18,
      "electoralVotes": 11
    },
    "WI": {
      "code": "WI",
      "democraticVotes": 1677211,
      "republicanVotes": 1262393,
      "otherVotes": 43813,
      "totalVotes": 2983417,
      "baselineMargin": 13.9,
      "electoralVotes": 10
    },
    "WV": {
      "code": "WV",
      "democraticVotes": 303857,
      "republicanVotes": 397466,
      "otherVotes": 12128,
      "totalVotes": 713451,
      "baselineMargin": -13.12,
      "electoralVotes": 5
    },
    "WY": {
      "code": "WY",
      "democraticVotes": 82868,
      "republicanVotes": 164958,
      "otherVotes": 7078,
      "totalVotes": 254904,
      "baselineMargin": -32.2,
      "electoralVotes": 3
    }
  },
  "2012": {
    "AK": {
      "code": "AK",
      "democraticVotes": 122640,
      "republicanVotes": 164676,
      "otherVotes": 13179,
      "totalVotes": 300495,
      "baselineMargin": -13.99,
      "electoralVotes": 3
    },
    "AL": {
      "code": "AL",
      "democraticVotes": 795696,
      "republicanVotes": 1255925,
      "otherVotes": 22717,
      "totalVotes": 2074338,
      "baselineMargin": -22.19,
      "electoralVotes": 9
    },
    "AR": {
      "code": "AR",
      "democraticVotes": 394409,
      "republicanVotes": 647744,
      "otherVotes": 27315,
      "totalVotes": 1069468,
      "baselineMargin": -23.69,
      "electoralVotes": 6
    },
    "AZ": {
      "code": "AZ",
      "democraticVotes": 1025232,
      "republicanVotes": 1233654,
      "otherVotes": 40368,
      "totalVotes": 2299254,
      "baselineMargin": -9.06,
      "electoralVotes": 11
    },
    "CA": {
      "code": "CA",
      "democraticVotes": 7854285,
      "republicanVotes": 4839958,
      "otherVotes": 344304,
      "totalVotes": 13038547,
      "baselineMargin": 23.12,
      "electoralVotes": 55
    },
    "CO": {
      "code": "CO",
      "democraticVotes": 1323101,
      "republicanVotes": 1185243,
      "otherVotes": 61172,
      "totalVotes": 2569516,
      "baselineMargin": 5.37,
      "electoralVotes": 9
    },
    "CT": {
      "code": "CT",
      "democraticVotes": 905083,
      "republicanVotes": 634892,
      "otherVotes": 18229,
      "totalVotes": 1558204,
      "baselineMargin": 17.34,
      "electoralVotes": 7
    },
    "DC": {
      "code": "DC",
      "democraticVotes": 267070,
      "republicanVotes": 21381,
      "otherVotes": 5313,
      "totalVotes": 293764,
      "baselineMargin": 83.63,
      "electoralVotes": 3
    },
    "DE": {
      "code": "DE",
      "democraticVotes": 242584,
      "republicanVotes": 165484,
      "otherVotes": 5822,
      "totalVotes": 413890,
      "baselineMargin": 18.63,
      "electoralVotes": 3
    },
    "FL": {
      "code": "FL",
      "democraticVotes": 4237756,
      "republicanVotes": 4163447,
      "otherVotes": 72976,
      "totalVotes": 8474179,
      "baselineMargin": 0.88,
      "electoralVotes": 29
    },
    "GA": {
      "code": "GA",
      "democraticVotes": 1773827,
      "republicanVotes": 2078688,
      "otherVotes": 45324,
      "totalVotes": 3897839,
      "baselineMargin": -7.82,
      "electoralVotes": 16
    },
    "HI": {
      "code": "HI",
      "democraticVotes": 306658,
      "republicanVotes": 121015,
      "otherVotes": 9486,
      "totalVotes": 437159,
      "baselineMargin": 42.47,
      "electoralVotes": 4
    },
    "IA": {
      "code": "IA",
      "democraticVotes": 822544,
      "republicanVotes": 730617,
      "otherVotes": 29019,
      "totalVotes": 1582180,
      "baselineMargin": 5.81,
      "electoralVotes": 6
    },
    "ID": {
      "code": "ID",
      "democraticVotes": 212787,
      "republicanVotes": 420911,
      "otherVotes": 18576,
      "totalVotes": 652274,
      "baselineMargin": -31.91,
      "electoralVotes": 4
    },
    "IL": {
      "code": "IL",
      "democraticVotes": 3019512,
      "republicanVotes": 2135216,
      "otherVotes": 87286,
      "totalVotes": 5242014,
      "baselineMargin": 16.87,
      "electoralVotes": 20
    },
    "IN": {
      "code": "IN",
      "democraticVotes": 1152887,
      "republicanVotes": 1420543,
      "otherVotes": 51104,
      "totalVotes": 2624534,
      "baselineMargin": -10.2,
      "electoralVotes": 11
    },
    "KS": {
      "code": "KS",
      "democraticVotes": 440726,
      "republicanVotes": 692634,
      "otherVotes": 26611,
      "totalVotes": 1159971,
      "baselineMargin": -21.72,
      "electoralVotes": 6
    },
    "KY": {
      "code": "KY",
      "democraticVotes": 679370,
      "republicanVotes": 1087190,
      "otherVotes": 30652,
      "totalVotes": 1797212,
      "baselineMargin": -22.69,
      "electoralVotes": 8
    },
    "LA": {
      "code": "LA",
      "democraticVotes": 809141,
      "republicanVotes": 1152262,
      "otherVotes": 32662,
      "totalVotes": 1994065,
      "baselineMargin": -17.21,
      "electoralVotes": 8
    },
    "MA": {
      "code": "MA",
      "democraticVotes": 1921290,
      "republicanVotes": 1188314,
      "otherVotes": 74592,
      "totalVotes": 3184196,
      "baselineMargin": 23.02,
      "electoralVotes": 11
    },
    "MD": {
      "code": "MD",
      "democraticVotes": 1677844,
      "republicanVotes": 971869,
      "otherVotes": 57614,
      "totalVotes": 2707327,
      "baselineMargin": 26.08,
      "electoralVotes": 10
    },
    "ME": {
      "code": "ME",
      "democraticVotes": 401306,
      "republicanVotes": 292276,
      "otherVotes": 31176,
      "totalVotes": 724758,
      "baselineMargin": 15.04,
      "electoralVotes": 4
    },
    "MI": {
      "code": "MI",
      "democraticVotes": 2564569,
      "republicanVotes": 2115256,
      "otherVotes": 51136,
      "totalVotes": 4730961,
      "baselineMargin": 9.5,
      "electoralVotes": 16
    },
    "MN": {
      "code": "MN",
      "democraticVotes": 1546167,
      "republicanVotes": 1320225,
      "otherVotes": 70169,
      "totalVotes": 2936561,
      "baselineMargin": 7.69,
      "electoralVotes": 10
    },
    "MO": {
      "code": "MO",
      "democraticVotes": 1223796,
      "republicanVotes": 1482440,
      "otherVotes": 51087,
      "totalVotes": 2757323,
      "baselineMargin": -9.38,
      "electoralVotes": 10
    },
    "MS": {
      "code": "MS",
      "democraticVotes": 562949,
      "republicanVotes": 710746,
      "otherVotes": 11889,
      "totalVotes": 1285584,
      "baselineMargin": -11.5,
      "electoralVotes": 6
    },
    "MT": {
      "code": "MT",
      "democraticVotes": 201839,
      "republicanVotes": 267928,
      "otherVotes": 14281,
      "totalVotes": 484048,
      "baselineMargin": -13.65,
      "electoralVotes": 3
    },
    "NC": {
      "code": "NC",
      "democraticVotes": 2178391,
      "republicanVotes": 2270395,
      "otherVotes": 56586,
      "totalVotes": 4505372,
      "baselineMargin": -2.04,
      "electoralVotes": 15
    },
    "ND": {
      "code": "ND",
      "democraticVotes": 124966,
      "republicanVotes": 188320,
      "otherVotes": 9646,
      "totalVotes": 322932,
      "baselineMargin": -19.62,
      "electoralVotes": 3
    },
    "NE": {
      "code": "NE",
      "democraticVotes": 302081,
      "republicanVotes": 475064,
      "otherVotes": 17234,
      "totalVotes": 794379,
      "baselineMargin": -21.78,
      "electoralVotes": 5
    },
    "NH": {
      "code": "NH",
      "democraticVotes": 369561,
      "republicanVotes": 329918,
      "otherVotes": 11493,
      "totalVotes": 710972,
      "baselineMargin": 5.58,
      "electoralVotes": 4
    },
    "NJ": {
      "code": "NJ",
      "democraticVotes": 2122786,
      "republicanVotes": 1478088,
      "otherVotes": 37625,
      "totalVotes": 3638499,
      "baselineMargin": 17.72,
      "electoralVotes": 14
    },
    "NM": {
      "code": "NM",
      "democraticVotes": 415335,
      "republicanVotes": 335788,
      "otherVotes": 32635,
      "totalVotes": 783758,
      "baselineMargin": 10.15,
      "electoralVotes": 5
    },
    "NV": {
      "code": "NV",
      "democraticVotes": 531373,
      "republicanVotes": 463567,
      "otherVotes": 19978,
      "totalVotes": 1014918,
      "baselineMargin": 6.68,
      "electoralVotes": 6
    },
    "NY": {
      "code": "NY",
      "democraticVotes": 4324228,
      "republicanVotes": 2223397,
      "otherVotes": 569159,
      "totalVotes": 7116784,
      "baselineMargin": 29.52,
      "electoralVotes": 29
    },
    "OH": {
      "code": "OH",
      "democraticVotes": 2827621,
      "republicanVotes": 2661407,
      "otherVotes": 91794,
      "totalVotes": 5580822,
      "baselineMargin": 2.98,
      "electoralVotes": 18
    },
    "OK": {
      "code": "OK",
      "democraticVotes": 443547,
      "republicanVotes": 891325,
      "otherVotes": 0,
      "totalVotes": 1334872,
      "baselineMargin": -33.54,
      "electoralVotes": 7
    },
    "OR": {
      "code": "OR",
      "democraticVotes": 970488,
      "republicanVotes": 754175,
      "otherVotes": 64607,
      "totalVotes": 1789270,
      "baselineMargin": 12.09,
      "electoralVotes": 7
    },
    "PA": {
      "code": "PA",
      "democraticVotes": 2990274,
      "republicanVotes": 2680434,
      "otherVotes": 71332,
      "totalVotes": 5742040,
      "baselineMargin": 5.4,
      "electoralVotes": 20
    },
    "RI": {
      "code": "RI",
      "democraticVotes": 279677,
      "republicanVotes": 157204,
      "otherVotes": 9168,
      "totalVotes": 446049,
      "baselineMargin": 27.46,
      "electoralVotes": 4
    },
    "SC": {
      "code": "SC",
      "democraticVotes": 865941,
      "republicanVotes": 1071645,
      "otherVotes": 26532,
      "totalVotes": 1964118,
      "baselineMargin": -10.47,
      "electoralVotes": 9
    },
    "SD": {
      "code": "SD",
      "democraticVotes": 145039,
      "republicanVotes": 210610,
      "otherVotes": 8166,
      "totalVotes": 363815,
      "baselineMargin": -18.02,
      "electoralVotes": 3
    },
    "TN": {
      "code": "TN",
      "democraticVotes": 960709,
      "republicanVotes": 1462330,
      "otherVotes": 35538,
      "totalVotes": 2458577,
      "baselineMargin": -20.4,
      "electoralVotes": 11
    },
    "TX": {
      "code": "TX",
      "democraticVotes": 3308124,
      "republicanVotes": 4569843,
      "otherVotes": 115884,
      "totalVotes": 7993851,
      "baselineMargin": -15.78,
      "electoralVotes": 38
    },
    "UT": {
      "code": "UT",
      "democraticVotes": 251813,
      "republicanVotes": 740600,
      "otherVotes": 25027,
      "totalVotes": 1017440,
      "baselineMargin": -48.04,
      "electoralVotes": 6
    },
    "VA": {
      "code": "VA",
      "democraticVotes": 1971820,
      "republicanVotes": 1822522,
      "otherVotes": 60147,
      "totalVotes": 3854489,
      "baselineMargin": 3.87,
      "electoralVotes": 13
    },
    "VT": {
      "code": "VT",
      "democraticVotes": 199239,
      "republicanVotes": 92698,
      "otherVotes": 7353,
      "totalVotes": 299290,
      "baselineMargin": 35.6,
      "electoralVotes": 3
    },
    "WA": {
      "code": "WA",
      "democraticVotes": 1755396,
      "republicanVotes": 1290670,
      "otherVotes": 79450,
      "totalVotes": 3125516,
      "baselineMargin": 14.87,
      "electoralVotes": 12
    },
    "WI": {
      "code": "WI",
      "democraticVotes": 1620985,
      "republicanVotes": 1410966,
      "otherVotes": 39483,
      "totalVotes": 3071434,
      "baselineMargin": 6.84,
      "electoralVotes": 10
    },
    "WV": {
      "code": "WV",
      "democraticVotes": 238269,
      "republicanVotes": 417655,
      "otherVotes": 14514,
      "totalVotes": 670438,
      "baselineMargin": -26.76,
      "electoralVotes": 5
    },
    "WY": {
      "code": "WY",
      "democraticVotes": 69286,
      "republicanVotes": 170962,
      "otherVotes": 10453,
      "totalVotes": 250701,
      "baselineMargin": -40.56,
      "electoralVotes": 3
    }
  },
  "2016": {
    "AK": {
      "code": "AK",
      "democraticVotes": 116454,
      "republicanVotes": 163387,
      "otherVotes": 38767,
      "totalVotes": 318608,
      "baselineMargin": -14.73,
      "electoralVotes": 3
    },
    "AL": {
      "code": "AL",
      "democraticVotes": 729547,
      "republicanVotes": 1318255,
      "otherVotes": 75570,
      "totalVotes": 2123372,
      "baselineMargin": -27.73,
      "electoralVotes": 9
    },
    "AR": {
      "code": "AR",
      "democraticVotes": 380494,
      "republicanVotes": 684872,
      "otherVotes": 65269,
      "totalVotes": 1130635,
      "baselineMargin": -26.92,
      "electoralVotes": 6
    },
    "AZ": {
      "code": "AZ",
      "democraticVotes": 1161209,
      "republicanVotes": 1252401,
      "otherVotes": 159555,
      "totalVotes": 2573165,
      "baselineMargin": -3.54,
      "electoralVotes": 11
    },
    "CA": {
      "code": "CA",
      "democraticVotes": 8753788,
      "republicanVotes": 4483810,
      "otherVotes": 943997,
      "totalVotes": 14181595,
      "baselineMargin": 30.11,
      "electoralVotes": 55
    },
    "CO": {
      "code": "CO",
      "democraticVotes": 1338870,
      "republicanVotes": 1202484,
      "otherVotes": 238866,
      "totalVotes": 2780220,
      "baselineMargin": 4.91,
      "electoralVotes": 9
    },
    "CT": {
      "code": "CT",
      "democraticVotes": 897572,
      "republicanVotes": 673215,
      "otherVotes": 74133,
      "totalVotes": 1644920,
      "baselineMargin": 13.64,
      "electoralVotes": 7
    },
    "DC": {
      "code": "DC",
      "democraticVotes": 282830,
      "republicanVotes": 12723,
      "otherVotes": 17022,
      "totalVotes": 312575,
      "baselineMargin": 86.41,
      "electoralVotes": 3
    },
    "DE": {
      "code": "DE",
      "democraticVotes": 235603,
      "republicanVotes": 185127,
      "otherVotes": 20860,
      "totalVotes": 441590,
      "baselineMargin": 11.43,
      "electoralVotes": 3
    },
    "FL": {
      "code": "FL",
      "democraticVotes": 4504975,
      "republicanVotes": 4617886,
      "otherVotes": 297178,
      "totalVotes": 9420039,
      "baselineMargin": -1.2,
      "electoralVotes": 29
    },
    "GA": {
      "code": "GA",
      "democraticVotes": 1877963,
      "republicanVotes": 2089104,
      "otherVotes": 147665,
      "totalVotes": 4114732,
      "baselineMargin": -5.13,
      "electoralVotes": 16
    },
    "HI": {
      "code": "HI",
      "democraticVotes": 266891,
      "republicanVotes": 128847,
      "otherVotes": 41926,
      "totalVotes": 437664,
      "baselineMargin": 31.54,
      "electoralVotes": 4
    },
    "IA": {
      "code": "IA",
      "democraticVotes": 653669,
      "republicanVotes": 800983,
      "otherVotes": 110928,
      "totalVotes": 1565580,
      "baselineMargin": -9.41,
      "electoralVotes": 6
    },
    "ID": {
      "code": "ID",
      "democraticVotes": 189765,
      "republicanVotes": 409055,
      "otherVotes": 91435,
      "totalVotes": 690255,
      "baselineMargin": -31.77,
      "electoralVotes": 4
    },
    "IL": {
      "code": "IL",
      "democraticVotes": 3090729,
      "republicanVotes": 2146015,
      "otherVotes": 299680,
      "totalVotes": 5536424,
      "baselineMargin": 17.06,
      "electoralVotes": 20
    },
    "IN": {
      "code": "IN",
      "democraticVotes": 1033126,
      "republicanVotes": 1557286,
      "otherVotes": 144546,
      "totalVotes": 2734958,
      "baselineMargin": -19.17,
      "electoralVotes": 11
    },
    "KS": {
      "code": "KS",
      "democraticVotes": 427005,
      "republicanVotes": 671018,
      "otherVotes": 86379,
      "totalVotes": 1184402,
      "baselineMargin": -20.6,
      "electoralVotes": 6
    },
    "KY": {
      "code": "KY",
      "democraticVotes": 628854,
      "republicanVotes": 1202971,
      "otherVotes": 92324,
      "totalVotes": 1924149,
      "baselineMargin": -29.84,
      "electoralVotes": 8
    },
    "LA": {
      "code": "LA",
      "democraticVotes": 780154,
      "republicanVotes": 1178638,
      "otherVotes": 70240,
      "totalVotes": 2029032,
      "baselineMargin": -19.64,
      "electoralVotes": 8
    },
    "MA": {
      "code": "MA",
      "democraticVotes": 1995196,
      "republicanVotes": 1090893,
      "otherVotes": 292732,
      "totalVotes": 3378821,
      "baselineMargin": 26.76,
      "electoralVotes": 11
    },
    "MD": {
      "code": "MD",
      "democraticVotes": 1678006,
      "republicanVotes": 943428,
      "otherVotes": 160012,
      "totalVotes": 2781446,
      "baselineMargin": 26.41,
      "electoralVotes": 10
    },
    "ME": {
      "code": "ME",
      "democraticVotes": 357735,
      "republicanVotes": 335593,
      "otherVotes": 78564,
      "totalVotes": 771892,
      "baselineMargin": 2.87,
      "electoralVotes": 4
    },
    "MI": {
      "code": "MI",
      "democraticVotes": 2268839,
      "republicanVotes": 2279543,
      "otherVotes": 250902,
      "totalVotes": 4799284,
      "baselineMargin": -0.22,
      "electoralVotes": 16
    },
    "MN": {
      "code": "MN",
      "democraticVotes": 1367705,
      "republicanVotes": 1322949,
      "otherVotes": 254128,
      "totalVotes": 2944782,
      "baselineMargin": 1.52,
      "electoralVotes": 10
    },
    "MO": {
      "code": "MO",
      "democraticVotes": 1071068,
      "republicanVotes": 1594511,
      "otherVotes": 143026,
      "totalVotes": 2808605,
      "baselineMargin": -18.64,
      "electoralVotes": 10
    },
    "MS": {
      "code": "MS",
      "democraticVotes": 485131,
      "republicanVotes": 700714,
      "otherVotes": 23512,
      "totalVotes": 1209357,
      "baselineMargin": -17.83,
      "electoralVotes": 6
    },
    "MT": {
      "code": "MT",
      "democraticVotes": 177709,
      "republicanVotes": 279240,
      "otherVotes": 37577,
      "totalVotes": 494526,
      "baselineMargin": -20.53,
      "electoralVotes": 3
    },
    "NC": {
      "code": "NC",
      "democraticVotes": 2189316,
      "republicanVotes": 2362631,
      "otherVotes": 189617,
      "totalVotes": 4741564,
      "baselineMargin": -3.66,
      "electoralVotes": 15
    },
    "ND": {
      "code": "ND",
      "democraticVotes": 93758,
      "republicanVotes": 216794,
      "otherVotes": 33808,
      "totalVotes": 344360,
      "baselineMargin": -35.73,
      "electoralVotes": 3
    },
    "NE": {
      "code": "NE",
      "democraticVotes": 284494,
      "republicanVotes": 495961,
      "otherVotes": 63772,
      "totalVotes": 844227,
      "baselineMargin": -25.05,
      "electoralVotes": 5
    },
    "NH": {
      "code": "NH",
      "democraticVotes": 348526,
      "republicanVotes": 345790,
      "otherVotes": 49980,
      "totalVotes": 744296,
      "baselineMargin": 0.37,
      "electoralVotes": 4
    },
    "NJ": {
      "code": "NJ",
      "democraticVotes": 2148278,
      "republicanVotes": 1601933,
      "otherVotes": 123835,
      "totalVotes": 3874046,
      "baselineMargin": 14.1,
      "electoralVotes": 14
    },
    "NM": {
      "code": "NM",
      "democraticVotes": 385234,
      "republicanVotes": 319667,
      "otherVotes": 93418,
      "totalVotes": 798319,
      "baselineMargin": 8.21,
      "electoralVotes": 5
    },
    "NV": {
      "code": "NV",
      "democraticVotes": 539260,
      "republicanVotes": 512058,
      "otherVotes": 74067,
      "totalVotes": 1125385,
      "baselineMargin": 2.42,
      "electoralVotes": 6
    },
    "NY": {
      "code": "NY",
      "democraticVotes": 4379789,
      "republicanVotes": 2527142,
      "otherVotes": 895153,
      "totalVotes": 7802084,
      "baselineMargin": 23.75,
      "electoralVotes": 29
    },
    "OH": {
      "code": "OH",
      "democraticVotes": 2394164,
      "republicanVotes": 2841005,
      "otherVotes": 261318,
      "totalVotes": 5496487,
      "baselineMargin": -8.13,
      "electoralVotes": 18
    },
    "OK": {
      "code": "OK",
      "democraticVotes": 420375,
      "republicanVotes": 949136,
      "otherVotes": 83481,
      "totalVotes": 1452992,
      "baselineMargin": -36.39,
      "electoralVotes": 7
    },
    "OR": {
      "code": "OR",
      "democraticVotes": 1002106,
      "republicanVotes": 782403,
      "otherVotes": 216827,
      "totalVotes": 2001336,
      "baselineMargin": 10.98,
      "electoralVotes": 7
    },
    "PA": {
      "code": "PA",
      "democraticVotes": 2926441,
      "republicanVotes": 2970733,
      "otherVotes": 218228,
      "totalVotes": 6115402,
      "baselineMargin": -0.72,
      "electoralVotes": 20
    },
    "RI": {
      "code": "RI",
      "democraticVotes": 252525,
      "republicanVotes": 180543,
      "otherVotes": 31076,
      "totalVotes": 464144,
      "baselineMargin": 15.51,
      "electoralVotes": 4
    },
    "SC": {
      "code": "SC",
      "democraticVotes": 855373,
      "republicanVotes": 1155389,
      "otherVotes": 92265,
      "totalVotes": 2103027,
      "baselineMargin": -14.27,
      "electoralVotes": 9
    },
    "SD": {
      "code": "SD",
      "democraticVotes": 117458,
      "republicanVotes": 227721,
      "otherVotes": 24914,
      "totalVotes": 370093,
      "baselineMargin": -29.79,
      "electoralVotes": 3
    },
    "TN": {
      "code": "TN",
      "democraticVotes": 870695,
      "republicanVotes": 1522925,
      "otherVotes": 114407,
      "totalVotes": 2508027,
      "baselineMargin": -26.01,
      "electoralVotes": 11
    },
    "TX": {
      "code": "TX",
      "democraticVotes": 3877868,
      "republicanVotes": 4685047,
      "otherVotes": 406311,
      "totalVotes": 8969226,
      "baselineMargin": -9,
      "electoralVotes": 38
    },
    "UT": {
      "code": "UT",
      "democraticVotes": 310674,
      "republicanVotes": 515211,
      "otherVotes": 305432,
      "totalVotes": 1131317,
      "baselineMargin": -18.08,
      "electoralVotes": 6
    },
    "VA": {
      "code": "VA",
      "democraticVotes": 1981473,
      "republicanVotes": 1769443,
      "otherVotes": 231836,
      "totalVotes": 3982752,
      "baselineMargin": 5.32,
      "electoralVotes": 13
    },
    "VT": {
      "code": "VT",
      "democraticVotes": 178573,
      "republicanVotes": 95369,
      "otherVotes": 46525,
      "totalVotes": 320467,
      "baselineMargin": 25.96,
      "electoralVotes": 3
    },
    "WA": {
      "code": "WA",
      "democraticVotes": 1742718,
      "republicanVotes": 1221747,
      "otherVotes": 352554,
      "totalVotes": 3317019,
      "baselineMargin": 15.71,
      "electoralVotes": 12
    },
    "WI": {
      "code": "WI",
      "democraticVotes": 1382536,
      "republicanVotes": 1405284,
      "otherVotes": 188330,
      "totalVotes": 2976150,
      "baselineMargin": -0.76,
      "electoralVotes": 10
    },
    "WV": {
      "code": "WV",
      "democraticVotes": 188794,
      "republicanVotes": 489371,
      "otherVotes": 34886,
      "totalVotes": 713051,
      "baselineMargin": -42.15,
      "electoralVotes": 5
    },
    "WY": {
      "code": "WY",
      "democraticVotes": 55973,
      "republicanVotes": 174419,
      "otherVotes": 28396,
      "totalVotes": 258788,
      "baselineMargin": -45.77,
      "electoralVotes": 3
    }
  },
  "2020": {
    "AK": {
      "code": "AK",
      "democraticVotes": 153778,
      "republicanVotes": 189951,
      "otherVotes": 15801,
      "totalVotes": 359530,
      "baselineMargin": -10.06,
      "electoralVotes": 3
    },
    "AL": {
      "code": "AL",
      "democraticVotes": 849624,
      "republicanVotes": 1441170,
      "otherVotes": 32488,
      "totalVotes": 2323282,
      "baselineMargin": -25.46,
      "electoralVotes": 9
    },
    "AR": {
      "code": "AR",
      "democraticVotes": 423932,
      "republicanVotes": 760647,
      "otherVotes": 34490,
      "totalVotes": 1219069,
      "baselineMargin": -27.62,
      "electoralVotes": 6
    },
    "AZ": {
      "code": "AZ",
      "democraticVotes": 1672143,
      "republicanVotes": 1661686,
      "otherVotes": 53497,
      "totalVotes": 3387326,
      "baselineMargin": 0.31,
      "electoralVotes": 11
    },
    "CA": {
      "code": "CA",
      "democraticVotes": 11110250,
      "republicanVotes": 6006429,
      "otherVotes": 384202,
      "totalVotes": 17500881,
      "baselineMargin": 29.16,
      "electoralVotes": 55
    },
    "CO": {
      "code": "CO",
      "democraticVotes": 1804352,
      "republicanVotes": 1364607,
      "otherVotes": 111021,
      "totalVotes": 3279980,
      "baselineMargin": 13.41,
      "electoralVotes": 9
    },
    "CT": {
      "code": "CT",
      "democraticVotes": 1080831,
      "republicanVotes": 714717,
      "otherVotes": 28309,
      "totalVotes": 1823857,
      "baselineMargin": 20.07,
      "electoralVotes": 7
    },
    "DC": {
      "code": "DC",
      "democraticVotes": 317323,
      "republicanVotes": 18586,
      "otherVotes": 8447,
      "totalVotes": 344356,
      "baselineMargin": 86.75,
      "electoralVotes": 3
    },
    "DE": {
      "code": "DE",
      "democraticVotes": 296268,
      "republicanVotes": 200603,
      "otherVotes": 7475,
      "totalVotes": 504346,
      "baselineMargin": 18.97,
      "electoralVotes": 3
    },
    "FL": {
      "code": "FL",
      "democraticVotes": 5297045,
      "republicanVotes": 5668731,
      "otherVotes": 101680,
      "totalVotes": 11067456,
      "baselineMargin": -3.36,
      "electoralVotes": 29
    },
    "GA": {
      "code": "GA",
      "democraticVotes": 2473633,
      "republicanVotes": 2461854,
      "otherVotes": 64473,
      "totalVotes": 4999960,
      "baselineMargin": 0.24,
      "electoralVotes": 16
    },
    "HI": {
      "code": "HI",
      "democraticVotes": 366130,
      "republicanVotes": 196864,
      "otherVotes": 16790,
      "totalVotes": 579784,
      "baselineMargin": 29.19,
      "electoralVotes": 4
    },
    "IA": {
      "code": "IA",
      "democraticVotes": 759061,
      "republicanVotes": 897672,
      "otherVotes": 43397,
      "totalVotes": 1700130,
      "baselineMargin": -8.15,
      "electoralVotes": 6
    },
    "ID": {
      "code": "ID",
      "democraticVotes": 287021,
      "republicanVotes": 554119,
      "otherVotes": 26874,
      "totalVotes": 868014,
      "baselineMargin": -30.77,
      "electoralVotes": 4
    },
    "IL": {
      "code": "IL",
      "democraticVotes": 3471915,
      "republicanVotes": 2446891,
      "otherVotes": 114937,
      "totalVotes": 6033743,
      "baselineMargin": 16.99,
      "electoralVotes": 20
    },
    "IN": {
      "code": "IN",
      "democraticVotes": 1242416,
      "republicanVotes": 1729519,
      "otherVotes": 61183,
      "totalVotes": 3033118,
      "baselineMargin": -16.06,
      "electoralVotes": 11
    },
    "KS": {
      "code": "KS",
      "democraticVotes": 570323,
      "republicanVotes": 771406,
      "otherVotes": 30574,
      "totalVotes": 1372303,
      "baselineMargin": -14.65,
      "electoralVotes": 6
    },
    "KY": {
      "code": "KY",
      "democraticVotes": 772474,
      "republicanVotes": 1326646,
      "otherVotes": 37648,
      "totalVotes": 2136768,
      "baselineMargin": -25.94,
      "electoralVotes": 8
    },
    "LA": {
      "code": "LA",
      "democraticVotes": 856034,
      "republicanVotes": 1255776,
      "otherVotes": 36252,
      "totalVotes": 2148062,
      "baselineMargin": -18.61,
      "electoralVotes": 8
    },
    "MA": {
      "code": "MA",
      "democraticVotes": 2382202,
      "republicanVotes": 1167202,
      "otherVotes": 108601,
      "totalVotes": 3658005,
      "baselineMargin": 33.21,
      "electoralVotes": 11
    },
    "MD": {
      "code": "MD",
      "democraticVotes": 1985023,
      "republicanVotes": 976414,
      "otherVotes": 75593,
      "totalVotes": 3037030,
      "baselineMargin": 33.21,
      "electoralVotes": 10
    },
    "ME": {
      "code": "ME",
      "democraticVotes": 435072,
      "republicanVotes": 360737,
      "otherVotes": 32496,
      "totalVotes": 828305,
      "baselineMargin": 8.97,
      "electoralVotes": 4
    },
    "MI": {
      "code": "MI",
      "democraticVotes": 2804040,
      "republicanVotes": 2649852,
      "otherVotes": 85410,
      "totalVotes": 5539302,
      "baselineMargin": 2.78,
      "electoralVotes": 16
    },
    "MN": {
      "code": "MN",
      "democraticVotes": 1717077,
      "republicanVotes": 1484065,
      "otherVotes": 76029,
      "totalVotes": 3277171,
      "baselineMargin": 7.11,
      "electoralVotes": 10
    },
    "MO": {
      "code": "MO",
      "democraticVotes": 1253014,
      "republicanVotes": 1718736,
      "otherVotes": 54212,
      "totalVotes": 3025962,
      "baselineMargin": -15.39,
      "electoralVotes": 10
    },
    "MS": {
      "code": "MS",
      "democraticVotes": 539398,
      "republicanVotes": 756764,
      "otherVotes": 17597,
      "totalVotes": 1313759,
      "baselineMargin": -16.55,
      "electoralVotes": 6
    },
    "MT": {
      "code": "MT",
      "democraticVotes": 244786,
      "republicanVotes": 343602,
      "otherVotes": 15286,
      "totalVotes": 603674,
      "baselineMargin": -16.37,
      "electoralVotes": 3
    },
    "NC": {
      "code": "NC",
      "democraticVotes": 2684292,
      "republicanVotes": 2758773,
      "otherVotes": 81737,
      "totalVotes": 5524802,
      "baselineMargin": -1.35,
      "electoralVotes": 15
    },
    "ND": {
      "code": "ND",
      "democraticVotes": 114902,
      "republicanVotes": 235595,
      "otherVotes": 11322,
      "totalVotes": 361819,
      "baselineMargin": -33.36,
      "electoralVotes": 3
    },
    "NE": {
      "code": "NE",
      "democraticVotes": 374583,
      "republicanVotes": 556846,
      "otherVotes": 24954,
      "totalVotes": 956383,
      "baselineMargin": -19.06,
      "electoralVotes": 5
    },
    "NH": {
      "code": "NH",
      "democraticVotes": 424921,
      "republicanVotes": 365654,
      "otherVotes": 15607,
      "totalVotes": 806182,
      "baselineMargin": 7.35,
      "electoralVotes": 4
    },
    "NJ": {
      "code": "NJ",
      "democraticVotes": 2608335,
      "republicanVotes": 1883274,
      "otherVotes": 57744,
      "totalVotes": 4549353,
      "baselineMargin": 15.94,
      "electoralVotes": 14
    },
    "NM": {
      "code": "NM",
      "democraticVotes": 501614,
      "republicanVotes": 401894,
      "otherVotes": 20457,
      "totalVotes": 923965,
      "baselineMargin": 10.79,
      "electoralVotes": 5
    },
    "NV": {
      "code": "NV",
      "democraticVotes": 703486,
      "republicanVotes": 669890,
      "otherVotes": 32000,
      "totalVotes": 1405376,
      "baselineMargin": 2.39,
      "electoralVotes": 6
    },
    "NY": {
      "code": "NY",
      "democraticVotes": 5230985,
      "republicanVotes": 3244798,
      "otherVotes": 185952,
      "totalVotes": 8661735,
      "baselineMargin": 22.93,
      "electoralVotes": 29
    },
    "OH": {
      "code": "OH",
      "democraticVotes": 2679165,
      "republicanVotes": 3154834,
      "otherVotes": 88203,
      "totalVotes": 5922202,
      "baselineMargin": -8.03,
      "electoralVotes": 18
    },
    "OK": {
      "code": "OK",
      "democraticVotes": 503890,
      "republicanVotes": 1020280,
      "otherVotes": 36529,
      "totalVotes": 1560699,
      "baselineMargin": -33.09,
      "electoralVotes": 7
    },
    "OR": {
      "code": "OR",
      "democraticVotes": 1340383,
      "republicanVotes": 958448,
      "otherVotes": 75490,
      "totalVotes": 2374321,
      "baselineMargin": 16.09,
      "electoralVotes": 7
    },
    "PA": {
      "code": "PA",
      "democraticVotes": 3458229,
      "republicanVotes": 3377674,
      "otherVotes": 79380,
      "totalVotes": 6915283,
      "baselineMargin": 1.16,
      "electoralVotes": 20
    },
    "RI": {
      "code": "RI",
      "democraticVotes": 307486,
      "republicanVotes": 199922,
      "otherVotes": 9582,
      "totalVotes": 516990,
      "baselineMargin": 20.81,
      "electoralVotes": 4
    },
    "SC": {
      "code": "SC",
      "democraticVotes": 1091541,
      "republicanVotes": 1385103,
      "otherVotes": 37452,
      "totalVotes": 2514096,
      "baselineMargin": -11.68,
      "electoralVotes": 9
    },
    "SD": {
      "code": "SD",
      "democraticVotes": 150471,
      "republicanVotes": 261043,
      "otherVotes": 11095,
      "totalVotes": 422609,
      "baselineMargin": -26.16,
      "electoralVotes": 3
    },
    "TN": {
      "code": "TN",
      "democraticVotes": 1143711,
      "republicanVotes": 1852475,
      "otherVotes": 57665,
      "totalVotes": 3053851,
      "baselineMargin": -23.21,
      "electoralVotes": 11
    },
    "TX": {
      "code": "TX",
      "democraticVotes": 5259126,
      "republicanVotes": 5890347,
      "otherVotes": 165583,
      "totalVotes": 11315056,
      "baselineMargin": -5.58,
      "electoralVotes": 38
    },
    "UT": {
      "code": "UT",
      "democraticVotes": 560282,
      "republicanVotes": 865140,
      "otherVotes": 62867,
      "totalVotes": 1488289,
      "baselineMargin": -20.48,
      "electoralVotes": 6
    },
    "VA": {
      "code": "VA",
      "democraticVotes": 2413568,
      "republicanVotes": 1962430,
      "otherVotes": 84526,
      "totalVotes": 4460524,
      "baselineMargin": 10.11,
      "electoralVotes": 13
    },
    "VT": {
      "code": "VT",
      "democraticVotes": 242820,
      "republicanVotes": 112704,
      "otherVotes": 15444,
      "totalVotes": 370968,
      "baselineMargin": 35.07,
      "electoralVotes": 3
    },
    "WA": {
      "code": "WA",
      "democraticVotes": 2369612,
      "republicanVotes": 1584651,
      "otherVotes": 133368,
      "totalVotes": 4087631,
      "baselineMargin": 19.2,
      "electoralVotes": 12
    },
    "WI": {
      "code": "WI",
      "democraticVotes": 1630866,
      "republicanVotes": 1610184,
      "otherVotes": 56991,
      "totalVotes": 3298041,
      "baselineMargin": 0.63,
      "electoralVotes": 10
    },
    "WV": {
      "code": "WV",
      "democraticVotes": 235984,
      "republicanVotes": 545382,
      "otherVotes": 13286,
      "totalVotes": 794652,
      "baselineMargin": -38.94,
      "electoralVotes": 5
    },
    "WY": {
      "code": "WY",
      "democraticVotes": 73491,
      "republicanVotes": 193559,
      "otherVotes": 11453,
      "totalVotes": 278503,
      "baselineMargin": -43.11,
      "electoralVotes": 3
    }
  },
  "2024": {
    "AK": {
      "code": "AK",
      "democraticVotes": 140026,
      "republicanVotes": 184458,
      "otherVotes": 13693,
      "totalVotes": 338177,
      "baselineMargin": -13.14,
      "electoralVotes": 3
    },
    "AL": {
      "code": "AL",
      "democraticVotes": 772412,
      "republicanVotes": 1462616,
      "otherVotes": 30062,
      "totalVotes": 2265090,
      "baselineMargin": -30.47,
      "electoralVotes": 9
    },
    "AR": {
      "code": "AR",
      "democraticVotes": 396905,
      "republicanVotes": 759241,
      "otherVotes": 26530,
      "totalVotes": 1182676,
      "baselineMargin": -30.64,
      "electoralVotes": 6
    },
    "AZ": {
      "code": "AZ",
      "democraticVotes": 1582860,
      "republicanVotes": 1770242,
      "otherVotes": 36217,
      "totalVotes": 3389319,
      "baselineMargin": -5.53,
      "electoralVotes": 11
    },
    "CA": {
      "code": "CA",
      "democraticVotes": 9276179,
      "republicanVotes": 6081697,
      "otherVotes": 507599,
      "totalVotes": 15865475,
      "baselineMargin": 20.13,
      "electoralVotes": 54
    },
    "CO": {
      "code": "CO",
      "democraticVotes": 1728159,
      "republicanVotes": 1377441,
      "otherVotes": 87145,
      "totalVotes": 3192745,
      "baselineMargin": 10.98,
      "electoralVotes": 10
    },
    "CT": {
      "code": "CT",
      "democraticVotes": 992053,
      "republicanVotes": 736918,
      "otherVotes": 30039,
      "totalVotes": 1759010,
      "baselineMargin": 14.5,
      "electoralVotes": 7
    },
    "DC": {
      "code": "DC",
      "democraticVotes": 294185,
      "republicanVotes": 21076,
      "otherVotes": 10608,
      "totalVotes": 325869,
      "baselineMargin": 83.81,
      "electoralVotes": 3
    },
    "DE": {
      "code": "DE",
      "democraticVotes": 289758,
      "republicanVotes": 214351,
      "otherVotes": 8804,
      "totalVotes": 512913,
      "baselineMargin": 14.7,
      "electoralVotes": 3
    },
    "FL": {
      "code": "FL",
      "democraticVotes": 4683038,
      "republicanVotes": 6110125,
      "otherVotes": 100589,
      "totalVotes": 10893752,
      "baselineMargin": -13.1,
      "electoralVotes": 30
    },
    "GA": {
      "code": "GA",
      "democraticVotes": 2548017,
      "republicanVotes": 2663117,
      "otherVotes": 39771,
      "totalVotes": 5250905,
      "baselineMargin": -2.19,
      "electoralVotes": 16
    },
    "HI": {
      "code": "HI",
      "democraticVotes": 313044,
      "republicanVotes": 193661,
      "otherVotes": 15531,
      "totalVotes": 522236,
      "baselineMargin": 22.86,
      "electoralVotes": 4
    },
    "IA": {
      "code": "IA",
      "democraticVotes": 707278,
      "republicanVotes": 927019,
      "otherVotes": 29209,
      "totalVotes": 1663506,
      "baselineMargin": -13.21,
      "electoralVotes": 6
    },
    "ID": {
      "code": "ID",
      "democraticVotes": 274972,
      "republicanVotes": 605246,
      "otherVotes": 37248,
      "totalVotes": 917466,
      "baselineMargin": -36,
      "electoralVotes": 4
    },
    "IL": {
      "code": "IL",
      "democraticVotes": 3062863,
      "republicanVotes": 2449079,
      "otherVotes": 121368,
      "totalVotes": 5633310,
      "baselineMargin": 10.9,
      "electoralVotes": 19
    },
    "IN": {
      "code": "IN",
      "democraticVotes": 1163603,
      "republicanVotes": 1720347,
      "otherVotes": 52727,
      "totalVotes": 2936677,
      "baselineMargin": -18.96,
      "electoralVotes": 11
    },
    "KS": {
      "code": "KS",
      "democraticVotes": 544853,
      "republicanVotes": 758802,
      "otherVotes": 23936,
      "totalVotes": 1327591,
      "baselineMargin": -16.12,
      "electoralVotes": 6
    },
    "KY": {
      "code": "KY",
      "democraticVotes": 704043,
      "republicanVotes": 1337494,
      "otherVotes": 32993,
      "totalVotes": 2074530,
      "baselineMargin": -30.53,
      "electoralVotes": 8
    },
    "LA": {
      "code": "LA",
      "democraticVotes": 766870,
      "republicanVotes": 1208505,
      "otherVotes": 31600,
      "totalVotes": 2006975,
      "baselineMargin": -22.01,
      "electoralVotes": 8
    },
    "MA": {
      "code": "MA",
      "democraticVotes": 2126518,
      "republicanVotes": 1251303,
      "otherVotes": 135109,
      "totalVotes": 3512930,
      "baselineMargin": 24.91,
      "electoralVotes": 11
    },
    "MD": {
      "code": "MD",
      "democraticVotes": 1902577,
      "republicanVotes": 1035550,
      "otherVotes": 100207,
      "totalVotes": 3038334,
      "baselineMargin": 28.54,
      "electoralVotes": 10
    },
    "ME": {
      "code": "ME",
      "democraticVotes": 435652,
      "republicanVotes": 377977,
      "otherVotes": 28818,
      "totalVotes": 842447,
      "baselineMargin": 6.85,
      "electoralVotes": 4
    },
    "MI": {
      "code": "MI",
      "democraticVotes": 2736533,
      "republicanVotes": 2816636,
      "otherVotes": 111017,
      "totalVotes": 5664186,
      "baselineMargin": -1.41,
      "electoralVotes": 15
    },
    "MN": {
      "code": "MN",
      "democraticVotes": 1656979,
      "republicanVotes": 1519032,
      "otherVotes": 77909,
      "totalVotes": 3253920,
      "baselineMargin": 4.24,
      "electoralVotes": 10
    },
    "MO": {
      "code": "MO",
      "democraticVotes": 1200599,
      "republicanVotes": 1751986,
      "otherVotes": 42742,
      "totalVotes": 2995327,
      "baselineMargin": -18.41,
      "electoralVotes": 10
    },
    "MS": {
      "code": "MS",
      "democraticVotes": 466668,
      "republicanVotes": 747744,
      "otherVotes": 13596,
      "totalVotes": 1228008,
      "baselineMargin": -22.89,
      "electoralVotes": 6
    },
    "MT": {
      "code": "MT",
      "democraticVotes": 231906,
      "republicanVotes": 352079,
      "otherVotes": 18978,
      "totalVotes": 602963,
      "baselineMargin": -19.93,
      "electoralVotes": 4
    },
    "NC": {
      "code": "NC",
      "democraticVotes": 2715375,
      "republicanVotes": 2898423,
      "otherVotes": 85343,
      "totalVotes": 5699141,
      "baselineMargin": -3.21,
      "electoralVotes": 16
    },
    "ND": {
      "code": "ND",
      "democraticVotes": 112327,
      "republicanVotes": 246505,
      "otherVotes": 9323,
      "totalVotes": 368155,
      "baselineMargin": -36.45,
      "electoralVotes": 3
    },
    "NE": {
      "code": "NE",
      "democraticVotes": 369995,
      "republicanVotes": 564816,
      "otherVotes": 17371,
      "totalVotes": 952182,
      "baselineMargin": -20.46,
      "electoralVotes": 5
    },
    "NH": {
      "code": "NH",
      "democraticVotes": 418488,
      "republicanVotes": 395523,
      "otherVotes": 17022,
      "totalVotes": 831033,
      "baselineMargin": 2.76,
      "electoralVotes": 4
    },
    "NJ": {
      "code": "NJ",
      "democraticVotes": 2220713,
      "republicanVotes": 1968215,
      "otherVotes": 83797,
      "totalVotes": 4272725,
      "baselineMargin": 5.91,
      "electoralVotes": 14
    },
    "NM": {
      "code": "NM",
      "democraticVotes": 478802,
      "republicanVotes": 423391,
      "otherVotes": 21210,
      "totalVotes": 923403,
      "baselineMargin": 6,
      "electoralVotes": 5
    },
    "NV": {
      "code": "NV",
      "democraticVotes": 705197,
      "republicanVotes": 751205,
      "otherVotes": 28438,
      "totalVotes": 1484840,
      "baselineMargin": -3.1,
      "electoralVotes": 6
    },
    "NY": {
      "code": "NY",
      "democraticVotes": 4619195,
      "republicanVotes": 3578899,
      "otherVotes": 183335,
      "totalVotes": 8381429,
      "baselineMargin": 12.41,
      "electoralVotes": 28
    },
    "OH": {
      "code": "OH",
      "democraticVotes": 2533699,
      "republicanVotes": 3180116,
      "otherVotes": 53973,
      "totalVotes": 5767788,
      "baselineMargin": -11.21,
      "electoralVotes": 17
    },
    "OK": {
      "code": "OK",
      "democraticVotes": 499599,
      "republicanVotes": 1036213,
      "otherVotes": 30361,
      "totalVotes": 1566173,
      "baselineMargin": -34.26,
      "electoralVotes": 7
    },
    "OR": {
      "code": "OR",
      "democraticVotes": 1240600,
      "republicanVotes": 919480,
      "otherVotes": 84413,
      "totalVotes": 2244493,
      "baselineMargin": 14.31,
      "electoralVotes": 8
    },
    "PA": {
      "code": "PA",
      "democraticVotes": 3423042,
      "republicanVotes": 3543308,
      "otherVotes": 67856,
      "totalVotes": 7034206,
      "baselineMargin": -1.71,
      "electoralVotes": 19
    },
    "RI": {
      "code": "RI",
      "democraticVotes": 285156,
      "republicanVotes": 214406,
      "otherVotes": 13524,
      "totalVotes": 513086,
      "baselineMargin": 13.79,
      "electoralVotes": 4
    },
    "SC": {
      "code": "SC",
      "democraticVotes": 1028452,
      "republicanVotes": 1483747,
      "otherVotes": 35941,
      "totalVotes": 2548140,
      "baselineMargin": -17.87,
      "electoralVotes": 9
    },
    "SD": {
      "code": "SD",
      "democraticVotes": 146859,
      "republicanVotes": 272081,
      "otherVotes": 9982,
      "totalVotes": 428922,
      "baselineMargin": -29.19,
      "electoralVotes": 3
    },
    "TN": {
      "code": "TN",
      "democraticVotes": 1056265,
      "republicanVotes": 1966865,
      "otherVotes": 40812,
      "totalVotes": 3063942,
      "baselineMargin": -29.72,
      "electoralVotes": 11
    },
    "TX": {
      "code": "TX",
      "democraticVotes": 4835250,
      "republicanVotes": 6393597,
      "otherVotes": 159827,
      "totalVotes": 11388674,
      "baselineMargin": -13.68,
      "electoralVotes": 40
    },
    "UT": {
      "code": "UT",
      "democraticVotes": 562566,
      "republicanVotes": 883818,
      "otherVotes": 42110,
      "totalVotes": 1488494,
      "baselineMargin": -21.58,
      "electoralVotes": 6
    },
    "VA": {
      "code": "VA",
      "democraticVotes": 2333778,
      "republicanVotes": 2074097,
      "otherVotes": 95413,
      "totalVotes": 4503288,
      "baselineMargin": 5.77,
      "electoralVotes": 13
    },
    "VT": {
      "code": "VT",
      "democraticVotes": 235791,
      "republicanVotes": 119395,
      "otherVotes": 17699,
      "totalVotes": 372885,
      "baselineMargin": 31.21,
      "electoralVotes": 3
    },
    "WA": {
      "code": "WA",
      "democraticVotes": 2245849,
      "republicanVotes": 1530923,
      "otherVotes": 147471,
      "totalVotes": 3924243,
      "baselineMargin": 18.22,
      "electoralVotes": 12
    },
    "WI": {
      "code": "WI",
      "democraticVotes": 1668229,
      "republicanVotes": 1697626,
      "otherVotes": 57063,
      "totalVotes": 3422918,
      "baselineMargin": -0.86,
      "electoralVotes": 10
    },
    "WV": {
      "code": "WV",
      "democraticVotes": 214309,
      "republicanVotes": 533556,
      "otherVotes": 14719,
      "totalVotes": 762584,
      "baselineMargin": -41.86,
      "electoralVotes": 4
    },
    "WY": {
      "code": "WY",
      "democraticVotes": 69527,
      "republicanVotes": 192633,
      "otherVotes": 8963,
      "totalVotes": 271123,
      "baselineMargin": -45.41,
      "electoralVotes": 3
    }
  }
} as const;

export const splitElectoralVoteUnitsByYear = {
  "2000": {
    "ME": [
      {
        "id": "ME-AL",
        "label": "Maine at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": 5.11,
        "sourceNote": "Statewide popular vote winner receives Maine's two at-large electoral votes."
      },
      {
        "id": "ME-1",
        "label": "Maine CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 7.93,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "ME-2",
        "label": "Maine CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 1.87,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ],
    "NE": [
      {
        "id": "NE-AL",
        "label": "Nebraska at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": -28.99,
        "sourceNote": "Statewide popular vote winner receives Nebraska's two at-large electoral votes."
      },
      {
        "id": "NE-1",
        "label": "Nebraska CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -23,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-2",
        "label": "Nebraska CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -18,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-3",
        "label": "Nebraska CD-3",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -46,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ]
  },
  "2004": {
    "ME": [
      {
        "id": "ME-AL",
        "label": "Maine at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": 9,
        "sourceNote": "Statewide popular vote winner receives Maine's two at-large electoral votes."
      },
      {
        "id": "ME-1",
        "label": "Maine CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 12,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "ME-2",
        "label": "Maine CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 5.83,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ],
    "NE": [
      {
        "id": "NE-AL",
        "label": "Nebraska at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": -33.22,
        "sourceNote": "Statewide popular vote winner receives Nebraska's two at-large electoral votes."
      },
      {
        "id": "NE-1",
        "label": "Nebraska CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -32,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-2",
        "label": "Nebraska CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -20,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-3",
        "label": "Nebraska CD-3",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -52,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ]
  },
  "2008": {
    "ME": [
      {
        "id": "ME-AL",
        "label": "Maine at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": 17.32,
        "sourceNote": "Statewide popular vote winner receives Maine's two at-large electoral votes."
      },
      {
        "id": "ME-1",
        "label": "Maine CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 23,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "ME-2",
        "label": "Maine CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 11,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ],
    "NE": [
      {
        "id": "NE-AL",
        "label": "Nebraska at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": -14.93,
        "sourceNote": "Statewide popular vote winner receives Nebraska's two at-large electoral votes."
      },
      {
        "id": "NE-1",
        "label": "Nebraska CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -21,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-2",
        "label": "Nebraska CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 1.21,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-3",
        "label": "Nebraska CD-3",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -53,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ]
  },
  "2012": {
    "ME": [
      {
        "id": "ME-AL",
        "label": "Maine at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": 15.04,
        "sourceNote": "Statewide popular vote winner receives Maine's two at-large electoral votes."
      },
      {
        "id": "ME-1",
        "label": "Maine CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 21,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "ME-2",
        "label": "Maine CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 8.6,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ],
    "NE": [
      {
        "id": "NE-AL",
        "label": "Nebraska at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": -21.78,
        "sourceNote": "Statewide popular vote winner receives Nebraska's two at-large electoral votes."
      },
      {
        "id": "NE-1",
        "label": "Nebraska CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -17,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-2",
        "label": "Nebraska CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -7.1,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-3",
        "label": "Nebraska CD-3",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -53,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ]
  },
  "2016": {
    "ME": [
      {
        "id": "ME-AL",
        "label": "Maine at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": 2.87,
        "sourceNote": "Statewide popular vote winner receives Maine's two at-large electoral votes."
      },
      {
        "id": "ME-1",
        "label": "Maine CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 14.8,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "ME-2",
        "label": "Maine CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -10.3,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ],
    "NE": [
      {
        "id": "NE-AL",
        "label": "Nebraska at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": -25.05,
        "sourceNote": "Statewide popular vote winner receives Nebraska's two at-large electoral votes."
      },
      {
        "id": "NE-1",
        "label": "Nebraska CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -20.7,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-2",
        "label": "Nebraska CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -2.2,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-3",
        "label": "Nebraska CD-3",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -57,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ]
  },
  "2020": {
    "ME": [
      {
        "id": "ME-AL",
        "label": "Maine at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": 8.97,
        "sourceNote": "Statewide popular vote winner receives Maine's two at-large electoral votes."
      },
      {
        "id": "ME-1",
        "label": "Maine CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 23.09,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "ME-2",
        "label": "Maine CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -7.44,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ],
    "NE": [
      {
        "id": "NE-AL",
        "label": "Nebraska at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": -19.06,
        "sourceNote": "Statewide popular vote winner receives Nebraska's two at-large electoral votes."
      },
      {
        "id": "NE-1",
        "label": "Nebraska CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -15.6,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-2",
        "label": "Nebraska CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 6.5,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-3",
        "label": "Nebraska CD-3",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -54.7,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ]
  },
  "2024": {
    "ME": [
      {
        "id": "ME-AL",
        "label": "Maine at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": 6.85,
        "sourceNote": "Statewide popular vote winner receives Maine's two at-large electoral votes."
      },
      {
        "id": "ME-1",
        "label": "Maine CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 21.6,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "ME-2",
        "label": "Maine CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -9.04,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ],
    "NE": [
      {
        "id": "NE-AL",
        "label": "Nebraska at-large",
        "kind": "statewide",
        "electoralVotes": 2,
        "baselineMargin": -20.46,
        "sourceNote": "Statewide popular vote winner receives Nebraska's two at-large electoral votes."
      },
      {
        "id": "NE-1",
        "label": "Nebraska CD-1",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -12.97,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-2",
        "label": "Nebraska CD-2",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": 4.59,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      },
      {
        "id": "NE-3",
        "label": "Nebraska CD-3",
        "kind": "congressional-district",
        "electoralVotes": 1,
        "baselineMargin": -53.59,
        "sourceNote": "Congressional district method; district margins are tracked separately from statewide votes."
      }
    ]
  }
} as const;

export const historicalStateDataSource = {
  sourceName: "MIT Election Data and Science Lab, U.S. President 1976-2024",
  sourceUrl: "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/42MVDX",
  retrievedAt: "2026-07-02",
  version: "10.0, released 2026-05-11",
} as const;
