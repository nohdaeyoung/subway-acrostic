import type { LineInfo, StationData } from "./seoul-subway";

export const BUSAN_LINES: Record<string, LineInfo> = {
  "1": { id: "1", name: "1호선", color: "#F06A2E" },
  "2": { id: "2", name: "2호선", color: "#2DB14E" },
  "3": { id: "3", name: "3호선", color: "#BB8C00" },
  "4": { id: "4", name: "4호선", color: "#2E63A6" },
  donghae: { id: "donghae", name: "동해선", color: "#0054A6" },
};

export const BUSAN_STATIONS: StationData[] = [
  // ===== Line 1 (노포~신평) =====
  { id: "b-nopo", name: "노포", lat: 35.1972, lng: 129.0860, lines: ["1"] },
  { id: "b-beomeosa", name: "범어사", lat: 35.1920, lng: 129.0746, lines: ["1"] },
  { id: "b-namsan", name: "남산", lat: 35.1771, lng: 129.0573, lines: ["1"] },
  { id: "b-dusilmaeul", name: "두실", lat: 35.1682, lng: 129.0543, lines: ["1"] },
  { id: "b-gupo", name: "구포", lat: 35.1866, lng: 128.9984, lines: ["1"] },
  { id: "b-deokcheon", name: "덕천", lat: 35.1790, lng: 129.0177, lines: ["1", "3"] },
  { id: "b-gunam", name: "구남", lat: 35.1739, lng: 129.0249, lines: ["1"] },
  { id: "b-mandeok", name: "만덕", lat: 35.1722, lng: 129.0332, lines: ["1"] },
  { id: "b-dongrae", name: "동래", lat: 35.1408, lng: 129.0608, lines: ["1", "4"] },
  { id: "b-myeongnyun", name: "명륜", lat: 35.1348, lng: 129.0606, lines: ["1"] },
  { id: "b-seomyeon", name: "서면", lat: 35.1577, lng: 129.0594, lines: ["1", "2"] },
  { id: "b-beomnaegol", name: "범내골", lat: 35.1547, lng: 129.0488, lines: ["1"] },
  { id: "b-bujeon", name: "부전", lat: 35.1583, lng: 129.0611, lines: ["1", "donghae"] },
  { id: "b-choryang", name: "초량", lat: 35.1200, lng: 129.0423, lines: ["1"] },
  { id: "b-busanstation", name: "부산역", lat: 35.1146, lng: 129.0410, lines: ["1"] },
  { id: "b-jungang", name: "중앙", lat: 35.1064, lng: 129.0364, lines: ["1"] },
  { id: "b-nampo", name: "남포", lat: 35.0977, lng: 129.0280, lines: ["1"] },
  { id: "b-jagalchi", name: "자갈치", lat: 35.0965, lng: 129.0300, lines: ["1"] },
  { id: "b-toseong", name: "토성", lat: 35.0977, lng: 129.0169, lines: ["1"] },
  { id: "b-dongdae", name: "동대신", lat: 35.1003, lng: 129.0114, lines: ["1"] },
  { id: "b-seodata", name: "서대신", lat: 35.1015, lng: 129.0057, lines: ["1"] },
  { id: "b-daeti", name: "대티", lat: 35.0993, lng: 128.9930, lines: ["1"] },
  { id: "b-goejeong", name: "괴정", lat: 35.0979, lng: 128.9826, lines: ["1"] },
  { id: "b-sinpyeong", name: "신평", lat: 35.0882, lng: 128.9735, lines: ["1"] },

  // ===== Line 2 (장산~양산) =====
  { id: "b-jangsan", name: "장산", lat: 35.1645, lng: 129.1731, lines: ["2"] },
  { id: "b-jungdong", name: "중동", lat: 35.1596, lng: 129.1636, lines: ["2"] },
  { id: "b-haeundae", name: "해운대", lat: 35.1629, lng: 129.1601, lines: ["2"] },
  { id: "b-dongbaek", name: "동백", lat: 35.1540, lng: 129.1453, lines: ["2"] },
  { id: "b-centumcity", name: "센텀시티", lat: 35.1695, lng: 129.1313, lines: ["2"] },
  { id: "b-bexco", name: "벡스코", lat: 35.1694, lng: 129.1367, lines: ["2"] },
  { id: "b-suyeong", name: "수영", lat: 35.1628, lng: 129.1119, lines: ["2", "3"] },
  { id: "b-gwangan", name: "광안", lat: 35.1541, lng: 129.1012, lines: ["2"] },
  { id: "b-namcheon", name: "남천", lat: 35.1413, lng: 129.0898, lines: ["2"] },
  { id: "b-geumnyeonsan", name: "금련산", lat: 35.1475, lng: 129.0856, lines: ["2"] },
  { id: "b-daeyeon", name: "대연", lat: 35.1368, lng: 129.0809, lines: ["2"] },
  { id: "b-kyungsung", name: "경성대·부경대", lat: 35.1359, lng: 129.0911, lines: ["2"] },
  { id: "b-jigegeol", name: "지게골", lat: 35.1458, lng: 129.0704, lines: ["2"] },
  // seomyeon already defined
  { id: "b-jeonpo", name: "전포", lat: 35.1560, lng: 129.0656, lines: ["2"] },
  { id: "b-gaegeum", name: "개금", lat: 35.1509, lng: 129.0321, lines: ["2"] },
  { id: "b-deokpo", name: "덕포", lat: 35.1627, lng: 128.9885, lines: ["2"] },
  { id: "b-sasang", name: "사상", lat: 35.1524, lng: 128.9813, lines: ["2"] },
  { id: "b-gamjeon", name: "감전", lat: 35.1550, lng: 128.9686, lines: ["2"] },
  { id: "b-jwacheon", name: "주례", lat: 35.1569, lng: 128.9624, lines: ["2"] },
  { id: "b-deokcheon2", name: "덕천", lat: 35.1790, lng: 129.0177, lines: ["2"] },
  { id: "b-hwamyeong", name: "화명", lat: 35.1985, lng: 129.0041, lines: ["2"] },
  { id: "b-yulni", name: "율리", lat: 35.2083, lng: 129.0010, lines: ["2"] },
  { id: "b-dongwon", name: "동원", lat: 35.2187, lng: 129.0086, lines: ["2"] },
  { id: "b-geumgok", name: "금곡", lat: 35.2308, lng: 129.0002, lines: ["2"] },
  { id: "b-hodongg", name: "호포", lat: 35.2355, lng: 128.9898, lines: ["2"] },
  { id: "b-jeungsan_b", name: "증산", lat: 35.2419, lng: 128.9870, lines: ["2"] },
  { id: "b-busan_uni", name: "부산대양산캠퍼스", lat: 35.2489, lng: 128.9906, lines: ["2"] },
  { id: "b-namsangjung", name: "남양산", lat: 35.2608, lng: 128.9930, lines: ["2"] },
  { id: "b-yangsan", name: "양산", lat: 35.3326, lng: 129.0159, lines: ["2"] },

  // ===== Line 3 (수영~대저) =====
  // suyeong already defined
  { id: "b-manmi", name: "망미", lat: 35.1556, lng: 129.1023, lines: ["3"] },
  { id: "b-baesan", name: "배산", lat: 35.1477, lng: 129.0941, lines: ["3"] },
  { id: "b-mulmangeol", name: "물만골", lat: 35.1398, lng: 129.0713, lines: ["3"] },
  { id: "b-yeonsan", name: "연산", lat: 35.1469, lng: 129.0791, lines: ["3"] },
  { id: "b-geojae", name: "거제", lat: 35.1502, lng: 129.0618, lines: ["3"] },
  { id: "b-jonghap_b", name: "종합운동장", lat: 35.1530, lng: 129.0530, lines: ["3"] },
  { id: "b-sajik", name: "사직", lat: 35.1601, lng: 129.0418, lines: ["3"] },
  { id: "b-minam", name: "미남", lat: 35.1719, lng: 129.0468, lines: ["3", "4"] },
  { id: "b-mandeok3", name: "만덕", lat: 35.1797, lng: 129.0350, lines: ["3"] },
  { id: "b-baeul", name: "배울", lat: 35.1837, lng: 129.0300, lines: ["3"] },
  { id: "b-gupo3", name: "구포", lat: 35.1970, lng: 129.0050, lines: ["3"] },
  { id: "b-gangseo", name: "강서구청", lat: 35.2098, lng: 128.9807, lines: ["3"] },
  { id: "b-daejeo", name: "대저", lat: 35.2131, lng: 128.9628, lines: ["3"] },

  // ===== Line 4 (미남~안평) =====
  // minam already defined
  { id: "b-dongrae4", name: "동래", lat: 35.1408, lng: 129.0608, lines: ["4"] },
  { id: "b-suanbo", name: "수안", lat: 35.1395, lng: 129.0695, lines: ["4"] },
  { id: "b-nakmin", name: "낙민", lat: 35.1272, lng: 129.0700, lines: ["4"] },
  { id: "b-chungnyeol", name: "충렬사", lat: 35.1200, lng: 129.0807, lines: ["4"] },
  { id: "b-myeongjang", name: "명장", lat: 35.1258, lng: 129.0882, lines: ["4"] },
  { id: "b-seobu", name: "서동", lat: 35.1296, lng: 129.1038, lines: ["4"] },
  { id: "b-geumsa", name: "금사", lat: 35.1242, lng: 129.1078, lines: ["4"] },
  { id: "b-bansong", name: "반송", lat: 35.1285, lng: 129.1124, lines: ["4"] },
  { id: "b-seokdae", name: "석대", lat: 35.1250, lng: 129.1166, lines: ["4"] },
  { id: "b-youngsan", name: "영산대", lat: 35.1290, lng: 129.1261, lines: ["4"] },
  { id: "b-anpyeong", name: "안평", lat: 35.1347, lng: 129.1343, lines: ["4"] },

  // ===== 동해선 (주요역) =====
  // bujeon already defined
  { id: "b-geoje_d", name: "거제해맞이", lat: 35.1543, lng: 129.0647, lines: ["donghae"] },
  { id: "b-geoyeo", name: "거여", lat: 35.1524, lng: 129.0748, lines: ["donghae"] },
  { id: "b-centum_d", name: "센텀", lat: 35.1698, lng: 129.1303, lines: ["donghae"] },
  { id: "b-songjeong_d", name: "송정", lat: 35.1775, lng: 129.1917, lines: ["donghae"] },
  { id: "b-gijang", name: "기장", lat: 35.2440, lng: 129.2176, lines: ["donghae"] },
  { id: "b-ilgwang", name: "일광", lat: 35.2700, lng: 129.2250, lines: ["donghae"] },
  { id: "b-jeonggwan", name: "정관", lat: 35.3239, lng: 129.1757, lines: ["donghae"] },
];

export const BUSAN_LINE_ROUTES: Record<string, string[][]> = {
  "1": [["s-nopo", "b-beomeosa", "b-namsan", "b-dusilmaeul", "b-mandeok", "b-gunam", "b-deokcheon", "b-gupo", "b-dongrae", "b-myeongnyun", "b-seomyeon", "b-beomnaegol", "b-bujeon", "b-choryang", "b-busanstation", "b-jungang", "b-nampo", "b-jagalchi", "b-toseong", "b-dongdae", "b-seodata", "b-daeti", "b-goejeong", "b-sinpyeong"].map(id => id.replace("s-", "b-"))],
  "2": [["b-jangsan", "b-jungdong", "b-haeundae", "b-dongbaek", "b-centumcity", "b-bexco", "b-suyeong", "b-gwangan", "b-namcheon", "b-geumnyeonsan", "b-daeyeon", "b-kyungsung", "b-jigegeol", "b-seomyeon", "b-jeonpo", "b-gaegeum", "b-deokpo", "b-sasang", "b-gamjeon", "b-jwacheon", "b-hwamyeong", "b-yulni", "b-dongwon", "b-geumgok", "b-hodongg", "b-jeungsan_b", "b-busan_uni", "b-namsangjung", "b-yangsan"]],
  "3": [["b-suyeong", "b-manmi", "b-baesan", "b-mulmangeol", "b-yeonsan", "b-geojae", "b-jonghap_b", "b-sajik", "b-minam", "b-mandeok3", "b-baeul", "b-gupo3", "b-gangseo", "b-daejeo"]],
  "4": [["b-minam", "b-dongrae4", "b-suanbo", "b-nakmin", "b-chungnyeol", "b-myeongjang", "b-seobu", "b-geumsa", "b-bansong", "b-seokdae", "b-youngsan", "b-anpyeong"]],
  donghae: [["b-bujeon", "b-geoje_d", "b-geoyeo", "b-centum_d", "b-songjeong_d", "b-gijang", "b-ilgwang", "b-jeonggwan"]],
};
