export interface LineInfo {
  id: string;
  name: string;
  color: string;
}

export interface StationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  lines: string[];
}

export const SEOUL_LINES: Record<string, LineInfo> = {
  "1": { id: "1", name: "1호선", color: "#0052A4" },
  "2": { id: "2", name: "2호선", color: "#00A84D" },
  "3": { id: "3", name: "3호선", color: "#EF7C1C" },
  "4": { id: "4", name: "4호선", color: "#00A4E3" },
  "5": { id: "5", name: "5호선", color: "#996CAC" },
  "6": { id: "6", name: "6호선", color: "#CD7C2F" },
  "7": { id: "7", name: "7호선", color: "#747F00" },
  "8": { id: "8", name: "8호선", color: "#E6186C" },
  "9": { id: "9", name: "9호선", color: "#BDB092" },
  shinbundang: { id: "shinbundang", name: "신분당선", color: "#A71E31" },
  gyeongui: { id: "gyeongui", name: "경의중앙선", color: "#73C7A6" },
  suin: { id: "suin", name: "수인분당선", color: "#F5A200" },
  arex: { id: "arex", name: "공항철도", color: "#0090D2" },
  ui: { id: "ui", name: "우이신설선", color: "#B0CE18" },
  sillim: { id: "sillim", name: "신림선", color: "#6789CA" },
  gyeongchun: { id: "gyeongchun", name: "경춘선", color: "#0C8E72" },
  seohaeseon: { id: "seohaeseon", name: "서해선", color: "#8BC53F" },
  gtxa: { id: "gtxa", name: "GTX-A", color: "#9A6292" },
  gimpo_gold: { id: "gimpo_gold", name: "김포골드라인", color: "#AD8602" },
  everline: { id: "everline", name: "에버라인", color: "#56AB4A" },
  uijeongbu: { id: "uijeongbu", name: "의정부경전철", color: "#FDA600" },
  incheon1: { id: "incheon1", name: "인천1호선", color: "#759CCE" },
  incheon2: { id: "incheon2", name: "인천2호선", color: "#ED8B00" },
};

// All stations with real lat/lng coordinates
export const SEOUL_STATIONS: StationData[] = [
  // ===== Line 1 =====
  { id: "s-dobongsan", name: "도봉산", lat: 37.6890, lng: 127.0449, lines: ["1", "7"] },
  { id: "s-dobong", name: "도봉", lat: 37.6793, lng: 127.0437, lines: ["1"] },
  { id: "s-bangnak", name: "방학", lat: 37.6672, lng: 127.0442, lines: ["1"] },
  { id: "s-changdong", name: "창동", lat: 37.6530, lng: 127.0479, lines: ["1", "4"] },
  { id: "s-nokcheon", name: "녹천", lat: 37.6458, lng: 127.0504, lines: ["1"] },
  { id: "s-wolge", name: "월계", lat: 37.6285, lng: 127.0582, lines: ["1"] },
  { id: "s-gwangundae", name: "광운대", lat: 37.6226, lng: 127.0611, lines: ["1"] },
  { id: "s-seokgye", name: "석계", lat: 37.6148, lng: 127.0656, lines: ["1", "6"] },
  { id: "s-sinimun", name: "신이문", lat: 37.6025, lng: 127.0675, lines: ["1"] },
  { id: "s-oedaeap", name: "외대앞", lat: 37.5950, lng: 127.0628, lines: ["1"] },
  { id: "s-hoegi", name: "회기", lat: 37.5894, lng: 127.0579, lines: ["1", "gyeongui", "gyeongchun"] },
  { id: "s-cheongnyangni", name: "청량리", lat: 37.5804, lng: 127.0469, lines: ["1", "gyeongui", "suin", "gyeongchun"] },
  { id: "s-jegi", name: "제기동", lat: 37.5786, lng: 127.0374, lines: ["1"] },
  { id: "s-sinseol", name: "신설동", lat: 37.5756, lng: 127.0250, lines: ["1", "2", "ui"] },
  { id: "s-dongmyo", name: "동묘앞", lat: 37.5720, lng: 127.0163, lines: ["1", "6"] },
  { id: "s-dongdaemun", name: "동대문", lat: 37.5710, lng: 127.0093, lines: ["1", "4"] },
  { id: "s-jongno5ga", name: "종로5가", lat: 37.5710, lng: 127.0023, lines: ["1"] },
  { id: "s-jongno3ga", name: "종로3가", lat: 37.5712, lng: 126.9916, lines: ["1", "3", "5"] },
  { id: "s-jonggak", name: "종각", lat: 37.5700, lng: 126.9831, lines: ["1"] },
  { id: "s-sicheong", name: "시청", lat: 37.5649, lng: 126.9773, lines: ["1", "2"] },
  { id: "s-seoulstation", name: "서울역", lat: 37.5547, lng: 126.9706, lines: ["1", "4", "arex", "gyeongui", "gtxa"] },
  { id: "s-namyeong", name: "남영", lat: 37.5413, lng: 126.9720, lines: ["1"] },
  { id: "s-yongsan", name: "용산", lat: 37.5299, lng: 126.9644, lines: ["1", "gyeongui"] },
  { id: "s-noryangjin", name: "노량진", lat: 37.5131, lng: 126.9426, lines: ["1", "9"] },
  { id: "s-daebang", name: "대방", lat: 37.5130, lng: 126.9267, lines: ["1"] },
  { id: "s-singil", name: "신길", lat: 37.5169, lng: 126.9175, lines: ["1", "5"] },
  { id: "s-yeongdeungpo", name: "영등포", lat: 37.5156, lng: 126.9078, lines: ["1"] },
  { id: "s-sindorim", name: "신도림", lat: 37.5088, lng: 126.8912, lines: ["1", "2"] },
  { id: "s-guro", name: "구로", lat: 37.5032, lng: 126.8826, lines: ["1"] },
  { id: "s-gasandigital", name: "가산디지털단지", lat: 37.4817, lng: 126.8827, lines: ["1", "7"] },
  { id: "s-doksan", name: "독산", lat: 37.4656, lng: 126.8897, lines: ["1"] },
  { id: "s-geumcheon", name: "금천구청", lat: 37.4556, lng: 126.8942, lines: ["1"] },
  { id: "s-gwangmyeong", name: "광명", lat: 37.4164, lng: 126.8850, lines: ["1"] },

  // ===== Line 1 연천 방면 (경원선) =====
  { id: "s-mangwolsa", name: "망월사", lat: 37.7103, lng: 127.0475, lines: ["1"] },
  // 회룡(s-hoeryong) 이미 존재
  { id: "s-uijeongbu", name: "의정부", lat: 37.7387, lng: 127.0459, lines: ["1"] },
  { id: "s-ganeung", name: "가능", lat: 37.7486, lng: 127.0443, lines: ["1"] },
  { id: "s-nokyang", name: "녹양", lat: 37.7602, lng: 127.0432, lines: ["1"] },
  { id: "s-yangju", name: "양주", lat: 37.7742, lng: 127.0448, lines: ["1"] },
  { id: "s-deokgye", name: "덕계", lat: 37.8197, lng: 127.0569, lines: ["1"] },
  { id: "s-deokjeong", name: "덕정", lat: 37.8432, lng: 127.0620, lines: ["1"] },
  { id: "s-jihaeng", name: "지행", lat: 37.8917, lng: 127.0572, lines: ["1"] },
  { id: "s-dongducheon_jungang", name: "동두천중앙", lat: 37.9005, lng: 127.0564, lines: ["1"] },
  { id: "s-bosan", name: "보산", lat: 37.9140, lng: 127.0573, lines: ["1"] },
  { id: "s-dongducheon", name: "동두천", lat: 37.9277, lng: 127.0561, lines: ["1"] },
  { id: "s-soyosan", name: "소요산", lat: 37.9480, lng: 127.0608, lines: ["1"] },
  { id: "s-choseongri", name: "초성리", lat: 37.9813, lng: 127.0684, lines: ["1"] },
  { id: "s-hantangang", name: "한탄강", lat: 38.0030, lng: 127.0700, lines: ["1"] },
  { id: "s-jeongok", name: "전곡", lat: 38.0246, lng: 127.0719, lines: ["1"] },
  { id: "s-yeoncheon", name: "연천", lat: 38.1007, lng: 127.0737, lines: ["1"] },

  // ===== Line 1 인천 방면 (경인선) =====
  { id: "s-guil", name: "구일", lat: 37.4964, lng: 126.8709, lines: ["1"] },
  { id: "s-gaebong", name: "개봉", lat: 37.4935, lng: 126.8570, lines: ["1"] },
  { id: "s-oryudong", name: "오류동", lat: 37.4956, lng: 126.8427, lines: ["1"] },
  // 온수(s-onsu) 이미 존재
  { id: "s-yeokgok", name: "역곡", lat: 37.4852, lng: 126.8118, lines: ["1"] },
  // 소사(s-sosa) 이미 존재
  { id: "s-bucheon", name: "부천", lat: 37.4848, lng: 126.7829, lines: ["1"] },
  { id: "s-jungdong", name: "중동", lat: 37.4867, lng: 126.7640, lines: ["1"] },
  { id: "s-songnae", name: "송내", lat: 37.4877, lng: 126.7529, lines: ["1"] },
  { id: "s-bugae", name: "부개", lat: 37.4885, lng: 126.7407, lines: ["1"] },
  // 부평(s-bupyeong) 이미 존재
  { id: "s-baekun", name: "백운", lat: 37.4835, lng: 126.7075, lines: ["1"] },
  { id: "s-dongam", name: "동암", lat: 37.4711, lng: 126.7029, lines: ["1"] },
  { id: "s-ganseok", name: "간석", lat: 37.4648, lng: 126.6934, lines: ["1"] },
  // 주안(s-juan) 이미 존재
  { id: "s-dohwa", name: "도화", lat: 37.4661, lng: 126.6683, lines: ["1"] },
  { id: "s-jemulpo", name: "제물포", lat: 37.4668, lng: 126.6570, lines: ["1"] },
  { id: "s-dowon", name: "도원", lat: 37.4688, lng: 126.6424, lines: ["1"] },
  { id: "s-dongincheon", name: "동인천", lat: 37.4751, lng: 126.6331, lines: ["1"] },
  // 인천(s-incheon_s) 이미 존재

  // ===== Line 1 천안/신창 방면 (경부선) =====
  { id: "s-seoksu", name: "석수", lat: 37.4350, lng: 126.9032, lines: ["1"] },
  { id: "s-gwanak_st", name: "관악", lat: 37.4187, lng: 126.9091, lines: ["1"] },
  { id: "s-anyang", name: "안양", lat: 37.4023, lng: 126.9212, lines: ["1"] },
  { id: "s-myeonghak", name: "명학", lat: 37.3843, lng: 126.9336, lines: ["1"] },
  { id: "s-geumjeong", name: "금정", lat: 37.3723, lng: 126.9434, lines: ["1", "4"] },
  { id: "s-gunpo", name: "군포", lat: 37.3537, lng: 126.9485, lines: ["1"] },
  { id: "s-dangjeong", name: "당정", lat: 37.3433, lng: 126.9484, lines: ["1"] },
  { id: "s-uiwang", name: "의왕", lat: 37.3209, lng: 126.9503, lines: ["1"] },
  { id: "s-skku", name: "성균관대", lat: 37.2998, lng: 126.9729, lines: ["1"] },
  { id: "s-hwaseo", name: "화서", lat: 37.2840, lng: 126.9905, lines: ["1"] },
  // 수원(s-suwon) 이미 존재
  { id: "s-seryu", name: "세류", lat: 37.2442, lng: 127.0141, lines: ["1"] },
  { id: "s-byeongjeom", name: "병점", lat: 37.2039, lng: 127.0402, lines: ["1"] },
  { id: "s-seodongtan", name: "서동탄", lat: 37.1957, lng: 127.0520, lines: ["1"] },
  { id: "s-sema", name: "세마", lat: 37.1869, lng: 127.0423, lines: ["1"] },
  { id: "s-osandae", name: "오산대", lat: 37.1704, lng: 127.0601, lines: ["1"] },
  { id: "s-osan", name: "오산", lat: 37.1441, lng: 127.0686, lines: ["1"] },
  { id: "s-jinwi", name: "진위", lat: 37.1098, lng: 127.0632, lines: ["1"] },
  { id: "s-songtan", name: "송탄", lat: 37.0751, lng: 127.0553, lines: ["1"] },
  { id: "s-seojeongri", name: "서정리", lat: 37.0567, lng: 127.0508, lines: ["1"] },
  { id: "s-pyeongtaek", name: "평택", lat: 36.9916, lng: 127.0862, lines: ["1"] },
  { id: "s-seonghwan", name: "성환", lat: 36.9158, lng: 127.1276, lines: ["1"] },
  { id: "s-jiksan", name: "직산", lat: 36.8700, lng: 127.1446, lines: ["1"] },
  { id: "s-dujeong", name: "두정", lat: 36.8327, lng: 127.1490, lines: ["1"] },
  { id: "s-cheonan", name: "천안", lat: 36.8103, lng: 127.1468, lines: ["1"] },
  { id: "s-bongmyeong", name: "봉명", lat: 36.8008, lng: 127.1353, lines: ["1"] },
  { id: "s-ssangyong", name: "쌍용", lat: 36.7937, lng: 127.1213, lines: ["1"] },
  { id: "s-asan", name: "아산", lat: 36.7921, lng: 127.1045, lines: ["1"] },
  { id: "s-tangjeong", name: "탕정", lat: 36.7882, lng: 127.0844, lines: ["1"] },
  { id: "s-baebang", name: "배방", lat: 36.7764, lng: 127.0531, lines: ["1"] },
  { id: "s-onyang", name: "온양온천", lat: 36.7815, lng: 127.0027, lines: ["1"] },
  { id: "s-sinchang", name: "신창", lat: 36.7698, lng: 126.9499, lines: ["1"] },

  // ===== Line 2 (순환) =====
  { id: "s-euljiro1", name: "을지로입구", lat: 37.5660, lng: 126.9822, lines: ["2"] },
  { id: "s-euljiro3", name: "을지로3가", lat: 37.5663, lng: 126.9922, lines: ["2", "3"] },
  { id: "s-euljiro4", name: "을지로4가", lat: 37.5665, lng: 127.0010, lines: ["2", "5"] },
  { id: "s-dongdaemunhist", name: "동대문역사문화공원", lat: 37.5653, lng: 127.0073, lines: ["2", "4", "5"] },
  { id: "s-sindang", name: "신당", lat: 37.5658, lng: 127.0182, lines: ["2", "6"] },
  { id: "s-sangwangsimni", name: "상왕십리", lat: 37.5649, lng: 127.0289, lines: ["2"] },
  { id: "s-wangsimni", name: "왕십리", lat: 37.5614, lng: 127.0370, lines: ["2", "5", "gyeongui", "suin"] },
  { id: "s-hanyangdae", name: "한양대", lat: 37.5554, lng: 127.0437, lines: ["2"] },
  { id: "s-ttukseom", name: "뚝섬", lat: 37.5474, lng: 127.0470, lines: ["2"] },
  { id: "s-seongsu", name: "성수", lat: 37.5445, lng: 127.0557, lines: ["2"] },
  { id: "s-geondae", name: "건대입구", lat: 37.5404, lng: 127.0694, lines: ["2", "7"] },
  { id: "s-guui", name: "구의", lat: 37.5353, lng: 127.0862, lines: ["2"] },
  { id: "s-gangbyeon", name: "강변", lat: 37.5348, lng: 127.0939, lines: ["2"] },
  { id: "s-jamsilnaru", name: "잠실나루", lat: 37.5218, lng: 127.1015, lines: ["2"] },
  { id: "s-jamsil", name: "잠실", lat: 37.5133, lng: 127.0998, lines: ["2", "8"] },
  { id: "s-jamsilnew", name: "잠실새내", lat: 37.5117, lng: 127.0862, lines: ["2"] },
  { id: "s-jonghap", name: "종합운동장", lat: 37.5106, lng: 127.0738, lines: ["2", "9"] },
  { id: "s-samseong", name: "삼성", lat: 37.5089, lng: 127.0636, lines: ["2", "gtxa"] },
  { id: "s-seolleung", name: "선릉", lat: 37.5046, lng: 127.0491, lines: ["2", "suin"] },
  { id: "s-yeoksam", name: "역삼", lat: 37.5007, lng: 127.0366, lines: ["2"] },
  { id: "s-gangnam", name: "강남", lat: 37.4979, lng: 127.0276, lines: ["2", "shinbundang"] },
  { id: "s-gyodae", name: "교대", lat: 37.4934, lng: 127.0143, lines: ["2", "3"] },
  { id: "s-seocho", name: "서초", lat: 37.4920, lng: 127.0076, lines: ["2"] },
  { id: "s-bangbae", name: "방배", lat: 37.4816, lng: 126.9977, lines: ["2"] },
  { id: "s-sadang", name: "사당", lat: 37.4764, lng: 126.9816, lines: ["2", "4"] },
  { id: "s-nakseongdae", name: "낙성대", lat: 37.4768, lng: 126.9636, lines: ["2"] },
  { id: "s-seouluniv", name: "서울대입구", lat: 37.4816, lng: 126.9528, lines: ["2"] },
  { id: "s-bongcheon", name: "봉천", lat: 37.4826, lng: 126.9417, lines: ["2"] },
  { id: "s-sillim2", name: "신림", lat: 37.4840, lng: 126.9290, lines: ["2", "sillim"] },
  { id: "s-sindaebang", name: "신대방", lat: 37.4877, lng: 126.9133, lines: ["2"] },
  { id: "s-gurodigital", name: "구로디지털단지", lat: 37.4853, lng: 126.9014, lines: ["2"] },
  { id: "s-daelim", name: "대림", lat: 37.4933, lng: 126.8950, lines: ["2", "7"] },
  // ===== Line 2 신정지선 =====
  { id: "s-dorimcheon", name: "도림천", lat: 37.5144, lng: 126.8828, lines: ["2"] },
  { id: "s-yangcheongucheong", name: "양천구청", lat: 37.5122, lng: 126.8656, lines: ["2"] },
  { id: "s-sinjeongnegeori", name: "신정네거리", lat: 37.5200, lng: 126.8528, lines: ["2"] },
  { id: "s-mullae", name: "문래", lat: 37.5179, lng: 126.8972, lines: ["2"] },
  { id: "s-ydpgucheong", name: "영등포구청", lat: 37.5243, lng: 126.8960, lines: ["2", "5"] },
  { id: "s-dangsan", name: "당산", lat: 37.5346, lng: 126.9029, lines: ["2", "9"] },
  { id: "s-hapjeong", name: "합정", lat: 37.5495, lng: 126.9136, lines: ["2", "6"] },
  { id: "s-hongdae", name: "홍대입구", lat: 37.5573, lng: 126.9252, lines: ["2", "arex", "gyeongui"] },
  { id: "s-sinchon", name: "신촌", lat: 37.5555, lng: 126.9367, lines: ["2"] },
  { id: "s-ewha", name: "이대", lat: 37.5567, lng: 126.9457, lines: ["2"] },
  { id: "s-ahyeon", name: "아현", lat: 37.5572, lng: 126.9565, lines: ["2"] },
  { id: "s-chungjeongno", name: "충정로", lat: 37.5599, lng: 126.9636, lines: ["2", "5"] },

  // ===== Line 2 성수지선 =====
  { id: "s-sindap", name: "신답", lat: 37.5700, lng: 127.0465, lines: ["2"] },
  { id: "s-yongdap", name: "용답", lat: 37.5619, lng: 127.0509, lines: ["2"] },
  { id: "s-yongdu", name: "용두", lat: 37.5740, lng: 127.0381, lines: ["2"] },

  // ===== Line 3 =====
  { id: "s-daehwa", name: "대화", lat: 37.6763, lng: 126.7470, lines: ["3"] },
  { id: "s-juyeop", name: "주엽", lat: 37.6702, lng: 126.7612, lines: ["3"] },
  { id: "s-jeongbalsan", name: "정발산", lat: 37.6597, lng: 126.7733, lines: ["3"] },
  { id: "s-baekseokmaeul", name: "마두", lat: 37.6521, lng: 126.7774, lines: ["3"] },
  { id: "s-baekseok3", name: "백석", lat: 37.6430, lng: 126.7879, lines: ["3"] },
  { id: "s-daegok", name: "대곡", lat: 37.6309, lng: 126.8105, lines: ["3", "gyeongui", "seohaeseon", "gtxa"] },
  { id: "s-hwajeong", name: "화정", lat: 37.6346, lng: 126.8327, lines: ["3"] },
  { id: "s-wondang", name: "원당", lat: 37.6533, lng: 126.8431, lines: ["3"] },
  { id: "s-wonheung", name: "원흥", lat: 37.6507, lng: 126.8726, lines: ["3"] },
  { id: "s-samsong", name: "삼송", lat: 37.6531, lng: 126.8956, lines: ["3"] },
  { id: "s-jichuk", name: "지축", lat: 37.6480, lng: 126.9139, lines: ["3"] },
  { id: "s-gupabal", name: "구파발", lat: 37.6370, lng: 126.9190, lines: ["3"] },
  { id: "s-yeonsinnae", name: "연신내", lat: 37.6190, lng: 126.9207, lines: ["3", "6", "gtxa"] },
  { id: "s-bulgwang", name: "불광", lat: 37.6100, lng: 126.9298, lines: ["3", "6"] },
  { id: "s-nokbeon", name: "녹번", lat: 37.6010, lng: 126.9355, lines: ["3"] },
  { id: "s-hongje", name: "홍제", lat: 37.5875, lng: 126.9433, lines: ["3"] },
  { id: "s-muakjae", name: "무악재", lat: 37.5829, lng: 126.9502, lines: ["3"] },
  { id: "s-dongnimmun", name: "독립문", lat: 37.5727, lng: 126.9605, lines: ["3"] },
  { id: "s-gyeongbokgung", name: "경복궁", lat: 37.5760, lng: 126.9737, lines: ["3"] },
  { id: "s-anguk", name: "안국", lat: 37.5760, lng: 126.9856, lines: ["3"] },
  // jongno3ga already defined above
  { id: "s-chungmuro", name: "충무로", lat: 37.5611, lng: 126.9940, lines: ["3", "4"] },
  { id: "s-dongguk", name: "동국대입구", lat: 37.5580, lng: 127.0004, lines: ["3"] },
  { id: "s-yaksu", name: "약수", lat: 37.5546, lng: 127.0102, lines: ["3", "6"] },
  { id: "s-geumho", name: "금호", lat: 37.5475, lng: 127.0147, lines: ["3"] },
  { id: "s-oksu", name: "옥수", lat: 37.5403, lng: 127.0172, lines: ["3", "gyeongui"] },
  { id: "s-apgujeong", name: "압구정", lat: 37.5271, lng: 127.0284, lines: ["3"] },
  { id: "s-sinsa", name: "신사", lat: 37.5168, lng: 127.0199, lines: ["3"] },
  { id: "s-jamwon", name: "잠원", lat: 37.5120, lng: 127.0134, lines: ["3"] },
  { id: "s-gosok", name: "고속터미널", lat: 37.5048, lng: 127.0050, lines: ["3", "7", "9"] },
  // gyodae already defined
  { id: "s-nambu", name: "남부터미널", lat: 37.4856, lng: 127.0154, lines: ["3"] },
  { id: "s-yangjae", name: "양재", lat: 37.4843, lng: 127.0343, lines: ["3", "shinbundang"] },
  { id: "s-maebong", name: "매봉", lat: 37.4870, lng: 127.0466, lines: ["3"] },
  { id: "s-dogok", name: "도곡", lat: 37.4915, lng: 127.0554, lines: ["3", "suin"] },
  { id: "s-daechee", name: "대치", lat: 37.4944, lng: 127.0636, lines: ["3"] },
  { id: "s-hagye", name: "학여울", lat: 37.4968, lng: 127.0716, lines: ["3"] },
  { id: "s-daechi2", name: "대청", lat: 37.4918, lng: 127.0797, lines: ["3"] },
  { id: "s-ilwon", name: "일원", lat: 37.4865, lng: 127.0862, lines: ["3"] },
  { id: "s-suseo", name: "수서", lat: 37.4865, lng: 127.1015, lines: ["3", "suin", "gtxa"] },
  { id: "s-garak", name: "가락시장", lat: 37.4927, lng: 127.1182, lines: ["3", "8"] },
  { id: "s-police", name: "경찰병원", lat: 37.4959, lng: 127.1256, lines: ["3"] },
  { id: "s-ogeum", name: "오금", lat: 37.5023, lng: 127.1283, lines: ["3", "5"] },

  // ===== Line 4 =====
  // ===== Line 4 진접선 =====
  { id: "s-jinjeop", name: "진접", lat: 37.7205, lng: 127.2032, lines: ["4"] },
  { id: "s-onam", name: "오남", lat: 37.7055, lng: 127.1930, lines: ["4"] },
  { id: "s-byeolnaebyelgaram", name: "별내별가람", lat: 37.6678, lng: 127.1160, lines: ["4"] },
  { id: "s-buramsan", name: "불암산", lat: 37.6700, lng: 127.0788, lines: ["4"] },
  { id: "s-sanggye", name: "상계", lat: 37.6610, lng: 127.0734, lines: ["4"] },
  { id: "s-nowon", name: "노원", lat: 37.6564, lng: 127.0616, lines: ["4", "7"] },
  { id: "s-ssangmun", name: "쌍문", lat: 37.6484, lng: 127.0340, lines: ["4"] },
  { id: "s-suyu", name: "수유", lat: 37.6383, lng: 127.0254, lines: ["4"] },
  { id: "s-mia", name: "미아", lat: 37.6265, lng: 127.0278, lines: ["4"] },
  { id: "s-mia3", name: "미아사거리", lat: 37.6135, lng: 127.0300, lines: ["4"] },
  { id: "s-gireum", name: "길음", lat: 37.6030, lng: 127.0250, lines: ["4"] },
  { id: "s-sungsin", name: "성신여대입구", lat: 37.5926, lng: 127.0163, lines: ["4", "ui"] },
  { id: "s-hansung", name: "한성대입구", lat: 37.5886, lng: 127.0065, lines: ["4"] },
  { id: "s-hyehwa", name: "혜화", lat: 37.5842, lng: 127.0018, lines: ["4"] },
  // dongdaemun already defined
  // dongdaemunhist already defined
  // chungmuro already defined
  { id: "s-myeongdong", name: "명동", lat: 37.5607, lng: 126.9862, lines: ["4"] },
  { id: "s-hoehyeon", name: "회현", lat: 37.5580, lng: 126.9812, lines: ["4"] },
  // seoulstation already defined
  { id: "s-sookmyung", name: "숙대입구", lat: 37.5460, lng: 126.9723, lines: ["4"] },
  { id: "s-sinyongsan", name: "신용산", lat: 37.5291, lng: 126.9679, lines: ["4"] },
  { id: "s-samgakji", name: "삼각지", lat: 37.5345, lng: 126.9733, lines: ["4", "6"] },
  { id: "s-ichon", name: "이촌", lat: 37.5216, lng: 126.9715, lines: ["4", "gyeongui"] },
  { id: "s-dongjak", name: "동작", lat: 37.5028, lng: 126.9803, lines: ["4", "9"] },
  // sadang already defined
  { id: "s-namtaeryeong", name: "남태령", lat: 37.4646, lng: 126.9834, lines: ["4"] },
  { id: "s-seoleksan", name: "선바위", lat: 37.4519, lng: 127.0021, lines: ["4"] },
  { id: "s-gyeongmagongwon", name: "경마공원", lat: 37.4440, lng: 127.0078, lines: ["4"] },
  { id: "s-daegongwon", name: "대공원", lat: 37.4356, lng: 127.0065, lines: ["4"] },
  { id: "s-gwacheon", name: "과천", lat: 37.4330, lng: 126.9969, lines: ["4"] },
  { id: "s-jeongbu", name: "정부과천청사", lat: 37.4265, lng: 126.9899, lines: ["4"] },
  { id: "s-indeogwon", name: "인덕원", lat: 37.4020, lng: 126.9767, lines: ["4"] },
  { id: "s-pyeongchon", name: "평촌", lat: 37.3942, lng: 126.9643, lines: ["4"] },
  { id: "s-beomgye", name: "범계", lat: 37.3901, lng: 126.9522, lines: ["4"] },
  { id: "s-sanbon", name: "산본", lat: 37.3581, lng: 126.9330, lines: ["4"] },

  // ===== Line 4 안산선 =====
  { id: "s-surisan", name: "수리산", lat: 37.3502, lng: 126.9255, lines: ["4"] },
  { id: "s-daeyami", name: "대야미", lat: 37.3282, lng: 126.9173, lines: ["4"] },
  { id: "s-banwol", name: "반월", lat: 37.3121, lng: 126.9035, lines: ["4"] },
  { id: "s-sangnoksu", name: "상록수", lat: 37.3027, lng: 126.8664, lines: ["4"] },
  { id: "s-handaeap", name: "한대앞", lat: 37.3098, lng: 126.8536, lines: ["4"] },
  { id: "s-jungang_ansan", name: "중앙", lat: 37.3160, lng: 126.8386, lines: ["4"] },
  { id: "s-gojan", name: "고잔", lat: 37.3169, lng: 126.8231, lines: ["4"] },
  // 초지(s-choji) 이미 존재
  { id: "s-ansan", name: "안산", lat: 37.3271, lng: 126.7885, lines: ["4"] },
  { id: "s-neunggil", name: "능길", lat: 37.3375, lng: 126.7673, lines: ["4", "suin"] },
  { id: "s-jeongwang", name: "정왕", lat: 37.3517, lng: 126.7428, lines: ["4"] },
  // 오이도(s-oido) 이미 존재

  // ===== Line 5 =====
  { id: "s-banghwa", name: "방화", lat: 37.5775, lng: 126.8128, lines: ["5"] },
  { id: "s-gaehwa", name: "개화산", lat: 37.5722, lng: 126.8061, lines: ["5"] },
  { id: "s-gimpo", name: "김포공항", lat: 37.5617, lng: 126.8010, lines: ["5", "9", "arex", "gimpo_gold"] },
  { id: "s-songjeong5", name: "송정", lat: 37.5611, lng: 126.8119, lines: ["5"] },
  { id: "s-magongnaru", name: "마곡나루", lat: 37.5672, lng: 126.8290, lines: ["9", "arex"] },
  { id: "s-magok", name: "마곡", lat: 37.5602, lng: 126.8254, lines: ["5"] },
  { id: "s-balsan", name: "발산", lat: 37.5586, lng: 126.8372, lines: ["5"] },
  { id: "s-ujangsan", name: "우장산", lat: 37.5489, lng: 126.8364, lines: ["5"] },
  { id: "s-hwagok", name: "화곡", lat: 37.5412, lng: 126.8399, lines: ["5"] },
  { id: "s-kkachisan", name: "까치산", lat: 37.5329, lng: 126.8466, lines: ["5", "2"] },
  { id: "s-sinjeong", name: "신정", lat: 37.5248, lng: 126.8540, lines: ["5"] },
  { id: "s-mokdong", name: "목동", lat: 37.5252, lng: 126.8649, lines: ["5"] },
  { id: "s-omokgyo", name: "오목교", lat: 37.5243, lng: 126.8754, lines: ["5"] },
  { id: "s-yangpyeong", name: "양평", lat: 37.5248, lng: 126.8850, lines: ["5"] },
  // ydpgucheong already defined
  { id: "s-ydpmarket", name: "영등포시장", lat: 37.5221, lng: 126.9069, lines: ["5"] },
  { id: "s-sinan", name: "신길", lat: 37.5156, lng: 126.9167, lines: ["5"] },
  { id: "s-yeouido", name: "여의도", lat: 37.5217, lng: 126.9246, lines: ["5", "9"] },
  { id: "s-yeouinaru", name: "여의나루", lat: 37.5270, lng: 126.9329, lines: ["5"] },
  { id: "s-mapo", name: "마포", lat: 37.5393, lng: 126.9462, lines: ["5"] },
  { id: "s-gongdeok", name: "공덕", lat: 37.5441, lng: 126.9517, lines: ["5", "6", "arex", "gyeongui"] },
  { id: "s-aehogaejon", name: "애오개", lat: 37.5536, lng: 126.9569, lines: ["5"] },
  // chungjeongno already defined
  { id: "s-seodaemun", name: "서대문", lat: 37.5658, lng: 126.9665, lines: ["5"] },
  { id: "s-gwanghwamun", name: "광화문", lat: 37.5710, lng: 126.9768, lines: ["5"] },
  // jongno3ga already defined
  // euljiro4 already defined
  // dongdaemunhist already defined
  { id: "s-cheonggu", name: "청구", lat: 37.5601, lng: 127.0141, lines: ["5", "6"] },
  { id: "s-singeumho", name: "신금호", lat: 37.5549, lng: 127.0196, lines: ["5"] },
  { id: "s-haengdang", name: "행당", lat: 37.5573, lng: 127.0296, lines: ["5"] },
  // wangsimni already defined
  { id: "s-majang", name: "마장", lat: 37.5659, lng: 127.0443, lines: ["5"] },
  { id: "s-dapsimni", name: "답십리", lat: 37.5667, lng: 127.0523, lines: ["5"] },
  { id: "s-janghanpyeong", name: "장한평", lat: 37.5613, lng: 127.0644, lines: ["5"] },
  { id: "s-gunja", name: "군자", lat: 37.5574, lng: 127.0798, lines: ["5", "7"] },
  { id: "s-achasan", name: "아차산", lat: 37.5511, lng: 127.0870, lines: ["5"] },
  { id: "s-gwangnaru", name: "광나루", lat: 37.5450, lng: 127.1036, lines: ["5"] },
  { id: "s-cheonho", name: "천호", lat: 37.5388, lng: 127.1237, lines: ["5", "8"] },
  { id: "s-gangdong", name: "강동", lat: 37.5352, lng: 127.1317, lines: ["5"] },
  { id: "s-gildonggil", name: "길동", lat: 37.5349, lng: 127.1435, lines: ["5"] },
  { id: "s-gubi", name: "굽은다리", lat: 37.5456, lng: 127.1428, lines: ["5"] },
  { id: "s-myeongil", name: "명일", lat: 37.5514, lng: 127.1439, lines: ["5"] },
  { id: "s-godeok", name: "고덕", lat: 37.5550, lng: 127.1542, lines: ["5"] },
  { id: "s-sangil", name: "상일동", lat: 37.5563, lng: 127.1665, lines: ["5"] },
  { id: "s-gangil", name: "강일", lat: 37.5575, lng: 127.1758, lines: ["5"] },
  { id: "s-misa", name: "미사", lat: 37.5631, lng: 127.1928, lines: ["5"] },
  { id: "s-hanam_pungsan", name: "하남풍산", lat: 37.5520, lng: 127.2036, lines: ["5"] },
  { id: "s-hanam_city", name: "하남시청", lat: 37.5418, lng: 127.2067, lines: ["5"] },
  { id: "s-hanam", name: "하남검단산", lat: 37.5398, lng: 127.2236, lines: ["5"] },
  { id: "s-macheon", name: "마천", lat: 37.4971, lng: 127.1510, lines: ["5"] },

  // ===== Line 5 마천지선 중간역 =====
  { id: "s-dunchondong", name: "둔촌동", lat: 37.5278, lng: 127.1361, lines: ["5"] },
  { id: "s-bangi", name: "방이", lat: 37.5086, lng: 127.1258, lines: ["5"] },
  { id: "s-gaerong", name: "개롱", lat: 37.4981, lng: 127.1350, lines: ["5"] },
  { id: "s-geoyeo", name: "거여", lat: 37.4933, lng: 127.1436, lines: ["5"] },

  // ===== Line 6 =====

  // ===== Line 6 응암순환 구간 =====
  { id: "s-yeokchon", name: "역촌", lat: 37.6061, lng: 126.9228, lines: ["6"] },
  { id: "s-dokbawi", name: "독바위", lat: 37.6186, lng: 126.9328, lines: ["6"] },
  { id: "s-gusan", name: "구산", lat: 37.6114, lng: 126.9172, lines: ["6"] },
  { id: "s-mapogu", name: "마포구청", lat: 37.5639, lng: 126.9031, lines: ["6"] },
  { id: "s-eungam", name: "응암", lat: 37.5991, lng: 126.9139, lines: ["6"] },
  { id: "s-saemaeul", name: "새절", lat: 37.5908, lng: 126.9132, lines: ["6"] },
  { id: "s-jeungsan", name: "증산", lat: 37.5837, lng: 126.9098, lines: ["6"] },
  { id: "s-dmc", name: "디지털미디어시티", lat: 37.5767, lng: 126.8997, lines: ["6", "arex", "gyeongui"] },
  { id: "s-worldcup", name: "월드컵경기장", lat: 37.5683, lng: 126.8975, lines: ["6"] },
  { id: "s-mangwon", name: "망원", lat: 37.5560, lng: 126.9105, lines: ["6"] },
  // hapjeong already defined
  { id: "s-sangsu", name: "상수", lat: 37.5473, lng: 126.9229, lines: ["6"] },
  { id: "s-gwangheungcang", name: "광흥창", lat: 37.5475, lng: 126.9324, lines: ["6"] },
  { id: "s-daheung", name: "대흥", lat: 37.5478, lng: 126.9429, lines: ["6"] },
  // gongdeok already defined
  { id: "s-hyochang", name: "효창공원앞", lat: 37.5397, lng: 126.9619, lines: ["6"] },
  // samgakji already defined
  { id: "s-noksapyeong", name: "녹사평", lat: 37.5340, lng: 126.9868, lines: ["6"] },
  { id: "s-itaewon", name: "이태원", lat: 37.5347, lng: 126.9946, lines: ["6"] },
  { id: "s-hangangjin", name: "한강진", lat: 37.5398, lng: 127.0000, lines: ["6"] },
  { id: "s-beotigo", name: "버티고개", lat: 37.5478, lng: 127.0067, lines: ["6"] },
  // yaksu already defined
  // cheonggu already defined
  // sindang already defined
  // dongmyo already defined
  { id: "s-changsin", name: "창신", lat: 37.5792, lng: 127.0138, lines: ["6"] },
  { id: "s-boramae", name: "보문", lat: 37.5854, lng: 127.0191, lines: ["6"] },
  { id: "s-annam", name: "안암", lat: 37.5862, lng: 127.0290, lines: ["6"] },
  { id: "s-korea_univ", name: "고려대", lat: 37.5897, lng: 127.0355, lines: ["6"] },
  { id: "s-wolkok", name: "월곡", lat: 37.5999, lng: 127.0406, lines: ["6"] },
  { id: "s-sangwolkok", name: "상월곡", lat: 37.6056, lng: 127.0476, lines: ["6"] },
  { id: "s-dolgotzge", name: "돌곶이", lat: 37.6107, lng: 127.0527, lines: ["6"] },
  // seokgye already defined
  { id: "s-taereung", name: "태릉입구", lat: 37.6181, lng: 127.0748, lines: ["6", "7"] },
  { id: "s-hwarangdae", name: "화랑대", lat: 37.6204, lng: 127.0844, lines: ["6"] },
  { id: "s-bonghwasan", name: "봉화산", lat: 37.6169, lng: 127.0914, lines: ["6"] },
  { id: "s-sinnae", name: "신내", lat: 37.6133, lng: 127.1025, lines: ["6"] },

  // ===== Line 7 =====
  // ===== Line 7 북부 연장 =====
  { id: "s-madeul", name: "마들", lat: 37.6647, lng: 127.0578, lines: ["7"] },
  { id: "s-suraksan", name: "수락산", lat: 37.6778, lng: 127.0553, lines: ["7"] },
  { id: "s-jangam", name: "장암", lat: 37.7000, lng: 127.0531, lines: ["7"] },
  // dobongsan already defined
  // nowon already defined
  { id: "s-junggye", name: "중계", lat: 37.6446, lng: 127.0650, lines: ["7"] },
  { id: "s-hagye7", name: "하계", lat: 37.6350, lng: 127.0660, lines: ["7"] },
  { id: "s-gongneung", name: "공릉", lat: 37.6254, lng: 127.0730, lines: ["7"] },
  // taereung already defined
  { id: "s-meogeol", name: "먹골", lat: 37.6106, lng: 127.0778, lines: ["7"] },
  { id: "s-junghwa", name: "중화", lat: 37.6025, lng: 127.0792, lines: ["7"] },
  { id: "s-mangu", name: "상봉", lat: 37.5963, lng: 127.0857, lines: ["7", "gyeongui", "gyeongchun"] },
  { id: "s-myeonmok", name: "면목", lat: 37.5886, lng: 127.0875, lines: ["7"] },
  { id: "s-sagajeong", name: "사가정", lat: 37.5808, lng: 127.0883, lines: ["7"] },
  { id: "s-yongmasan", name: "용마산", lat: 37.5736, lng: 127.0867, lines: ["7"] },
  { id: "s-junggok", name: "중곡", lat: 37.5647, lng: 127.0838, lines: ["7"] },
  // gunja already defined
  { id: "s-eorinyi", name: "어린이대공원", lat: 37.5484, lng: 127.0747, lines: ["7"] },
  // geondae already defined
  { id: "s-jayang", name: "자양", lat: 37.5313, lng: 127.0657, lines: ["7"] },
  { id: "s-cheongdam", name: "청담", lat: 37.5193, lng: 127.0526, lines: ["7"] },
  { id: "s-gangnamgu", name: "강남구청", lat: 37.5170, lng: 127.0413, lines: ["7", "suin"] },
  { id: "s-hak", name: "학동", lat: 37.5146, lng: 127.0317, lines: ["7"] },
  { id: "s-nonhyeon", name: "논현", lat: 37.5107, lng: 127.0235, lines: ["7"] },
  { id: "s-banpo", name: "반포", lat: 37.5084, lng: 127.0125, lines: ["7"] },
  // gosok already defined
  { id: "s-naebang", name: "내방", lat: 37.4882, lng: 126.9966, lines: ["7"] },
  { id: "s-total", name: "총신대입구", lat: 37.4878, lng: 126.9820, lines: ["7"] },
  { id: "s-namsung", name: "남성", lat: 37.4844, lng: 126.9711, lines: ["7"] },
  { id: "s-sungbuk", name: "숭실대입구", lat: 37.4961, lng: 126.9539, lines: ["7"] },
  { id: "s-sangdo", name: "상도", lat: 37.5028, lng: 126.9478, lines: ["7"] },
  { id: "s-jangseungbae", name: "장승배기", lat: 37.5025, lng: 126.9395, lines: ["7"] },
  { id: "s-sinpung", name: "신풍", lat: 37.5000, lng: 126.9100, lines: ["7"] },
  { id: "s-boramae7", name: "보라매", lat: 37.4990, lng: 126.9218, lines: ["7"] },
  { id: "s-sindaebang3", name: "신대방삼거리", lat: 37.4997, lng: 126.9283, lines: ["7"] },
  { id: "s-namguro", name: "남구로", lat: 37.4876, lng: 126.8875, lines: ["7"] },
  // daelim already defined
  // gasandigital already defined
  { id: "s-cheolsan", name: "철산", lat: 37.4741, lng: 126.8667, lines: ["7"] },
  { id: "s-gwangmyeongsageori", name: "광명사거리", lat: 37.4792, lng: 126.8547, lines: ["7"] },
  { id: "s-chungan", name: "천왕", lat: 37.4867, lng: 126.8386, lines: ["7"] },
  { id: "s-onsu", name: "온수", lat: 37.4920, lng: 126.8230, lines: ["7", "1"] },

  // ===== Line 7 인천 연장 =====
  { id: "s-kkachiul", name: "까치울", lat: 37.5062, lng: 126.8110, lines: ["7"] },
  // 부천종합운동장(s-bucheon_stadium) 이미 존재
  { id: "s-chunui", name: "춘의", lat: 37.5037, lng: 126.7871, lines: ["7"] },
  { id: "s-sinjungdong", name: "신중동", lat: 37.5031, lng: 126.7762, lines: ["7"] },
  { id: "s-bucheonsicheong", name: "부천시청", lat: 37.5046, lng: 126.7636, lines: ["7"] },
  { id: "s-sangdong", name: "상동", lat: 37.5058, lng: 126.7531, lines: ["7"] },
  { id: "s-samsancheyukgwan", name: "삼산체육관", lat: 37.5064, lng: 126.7421, lines: ["7"] },
  { id: "s-gulpocheon", name: "굴포천", lat: 37.5070, lng: 126.7315, lines: ["7"] },
  { id: "s-sangok", name: "산곡", lat: 37.5085, lng: 126.7035, lines: ["7"] },
  // 부평구청(s-bupyeong_gu) 이미 인천1호선에 존재 - "7" 추가
  // 석남(s-seongnam_ic) 이미 인천2호선에 존재 - "7" 추가 완료

  // ===== Line 8 =====
  // ===== Line 8 별내선 연장 =====
  { id: "s-dasan", name: "다산", lat: 37.6242, lng: 127.1498, lines: ["8"] },
  { id: "s-donggureung", name: "동구릉", lat: 37.6106, lng: 127.1381, lines: ["8"] },
  { id: "s-jangjahosugongwon", name: "장자호수공원", lat: 37.5872, lng: 127.1379, lines: ["8"] },
  // 구리(s-guri) 이미 존재 - "8" 추가
  { id: "s-amsayeoksa", name: "암사역사공원", lat: 37.5568, lng: 127.1358, lines: ["8"] },
  { id: "s-amsa", name: "암사", lat: 37.5509, lng: 127.1271, lines: ["8"] },
  // cheonho already defined
  { id: "s-gangdong8", name: "강동구청", lat: 37.5308, lng: 127.1206, lines: ["8"] },
  { id: "s-mongchon", name: "몽촌토성", lat: 37.5165, lng: 127.1134, lines: ["8"] },
  // jamsil already defined
  { id: "s-jamsil8", name: "잠실(8)", lat: 37.5133, lng: 127.0999, lines: ["8"] },
  { id: "s-seokchon", name: "석촌", lat: 37.5056, lng: 127.1050, lines: ["8", "9"] },
  { id: "s-songpa", name: "송파", lat: 37.4998, lng: 127.1095, lines: ["8"] },
  // garak already defined
  { id: "s-moran", name: "모란", lat: 37.4321, lng: 127.1293, lines: ["8", "suin"] },

  // ===== Line 8 남부 구간 =====
  { id: "s-munjeong", name: "문정", lat: 37.4859, lng: 127.1224, lines: ["8"] },
  { id: "s-jangji", name: "장지", lat: 37.4782, lng: 127.1263, lines: ["8"] },
  // 복정(s-bokjeong) 이미 존재
  { id: "s-namwirye", name: "남위례", lat: 37.4628, lng: 127.1392, lines: ["8"] },
  { id: "s-sanseong", name: "산성", lat: 37.4569, lng: 127.1500, lines: ["8"] },
  { id: "s-namhansanseong", name: "남한산성입구", lat: 37.4517, lng: 127.1597, lines: ["8"] },
  { id: "s-dandaeogeori", name: "단대오거리", lat: 37.4450, lng: 127.1567, lines: ["8"] },
  { id: "s-sinheung", name: "신흥", lat: 37.4408, lng: 127.1475, lines: ["8"] },
  { id: "s-sujin", name: "수진", lat: 37.4375, lng: 127.1408, lines: ["8"] },

  // ===== Line 9 =====

  // ===== Line 9 추가역 =====
  { id: "s-sinbanghwa", name: "신방화", lat: 37.5675, lng: 126.8167, lines: ["9"] },
  { id: "s-yangcheonhyanggyo", name: "양천향교", lat: 37.5683, lng: 126.8414, lines: ["9"] },
  { id: "s-gayang", name: "가양", lat: 37.5611, lng: 126.8553, lines: ["9"] },
  { id: "s-jeungmi", name: "증미", lat: 37.5575, lng: 126.8617, lines: ["9"] },
  { id: "s-deungchon", name: "등촌", lat: 37.5511, lng: 126.8647, lines: ["9"] },
  { id: "s-gukhoe", name: "국회의사당", lat: 37.5286, lng: 126.9175, lines: ["9"] },
  { id: "s-nodeul", name: "노들", lat: 37.5131, lng: 126.9531, lines: ["9"] },
  { id: "s-heukseok", name: "흑석", lat: 37.5089, lng: 126.9636, lines: ["9"] },
  { id: "s-seonjeongneung", name: "선정릉", lat: 37.5103, lng: 127.0439, lines: ["9"] },
  { id: "s-eonju", name: "언주", lat: 37.5072, lng: 127.0339, lines: ["9"] },
  { id: "s-samsungjungang", name: "삼성중앙", lat: 37.5128, lng: 127.0525, lines: ["9"] },
  { id: "s-dunchonoryun", name: "둔촌오륜", lat: 37.5198, lng: 127.1384, lines: ["9"] },
  { id: "s-gaehwa9", name: "개화", lat: 37.5786, lng: 126.7983, lines: ["9"] },
  // gimpo already defined
  { id: "s-airport9", name: "공항시장", lat: 37.5601, lng: 126.8117, lines: ["9"] },
  { id: "s-sinmok", name: "신목동", lat: 37.5442, lng: 126.8831, lines: ["9"] },
  { id: "s-yeomchang", name: "염창", lat: 37.5469, lng: 126.8747, lines: ["9"] },
  // dangsan already defined
  { id: "s-seonyudo", name: "선유도", lat: 37.5344, lng: 126.8938, lines: ["9"] },
  { id: "s-noryangjin9", name: "노량진", lat: 37.5131, lng: 126.9427, lines: ["9"] },
  // yeouido already defined
  { id: "s-saetgang", name: "샛강", lat: 37.5176, lng: 126.9310, lines: ["9"] },
  // dongjak already defined
  { id: "s-guhban", name: "구반포", lat: 37.5014, lng: 126.9872, lines: ["9"] },
  { id: "s-sinbanpo", name: "신반포", lat: 37.5033, lng: 126.9958, lines: ["9"] },
  // gosok already defined
  { id: "s-sapyeong", name: "사평", lat: 37.5073, lng: 127.0134, lines: ["9"] },
  { id: "s-bongeunsa", name: "봉은사", lat: 37.5142, lng: 127.0603, lines: ["9"] },
  // jonghap already defined
  { id: "s-samjeon", name: "삼전", lat: 37.5040, lng: 127.0872, lines: ["9"] },
  { id: "s-seokchon9", name: "석촌고분", lat: 37.5010, lng: 127.1010, lines: ["9"] },
  { id: "s-songpa9", name: "송파나루", lat: 37.5113, lng: 127.1128, lines: ["9"] },
  { id: "s-hangangjung", name: "한성백제", lat: 37.5167, lng: 127.1162, lines: ["9"] },
  { id: "s-olympic", name: "올림픽공원", lat: 37.5160, lng: 127.1304, lines: ["5", "9"] },
  { id: "s-bokhun", name: "중앙보훈병원", lat: 37.5288, lng: 127.1485, lines: ["9"] },

  // ===== 신분당선 =====
  { id: "s-sinsa_sb", name: "신사", lat: 37.5168, lng: 127.0199, lines: ["shinbundang"] },
  { id: "s-nonhyeon_sb", name: "논현", lat: 37.5110, lng: 127.0213, lines: ["shinbundang"] },
  { id: "s-sinnonhyeon", name: "신논현", lat: 37.5045, lng: 127.0249, lines: ["9", "shinbundang"] },
  // gangnam already defined
  // yangjae already defined
  { id: "s-yangjae_citizen", name: "양재시민의숲", lat: 37.4703, lng: 127.0404, lines: ["shinbundang"] },
  { id: "s-cheonggyesan", name: "청계산입구", lat: 37.4485, lng: 127.0544, lines: ["shinbundang"] },
  { id: "s-pangyo", name: "판교", lat: 37.3952, lng: 127.1117, lines: ["shinbundang"] },
  { id: "s-jeongja", name: "정자", lat: 37.3668, lng: 127.1083, lines: ["shinbundang", "suin"] },
  { id: "s-migeum", name: "미금", lat: 37.3512, lng: 127.1098, lines: ["shinbundang", "suin"] },
  { id: "s-dongcheon", name: "동천", lat: 37.3381, lng: 127.1028, lines: ["shinbundang"] },
  { id: "s-suji", name: "수지구청", lat: 37.3224, lng: 127.0942, lines: ["shinbundang"] },
  { id: "s-seongbok", name: "성복", lat: 37.3110, lng: 127.0748, lines: ["shinbundang"] },
  { id: "s-sanghyeon", name: "상현", lat: 37.2976, lng: 127.0693, lines: ["shinbundang"] },
  { id: "s-gwanggyo_jungang", name: "광교중앙", lat: 37.2886, lng: 127.0515, lines: ["shinbundang"] },
  { id: "s-gwanggyo", name: "광교", lat: 37.3021, lng: 127.0443, lines: ["shinbundang"] },

  // ===== 경의중앙선 (주요역) =====
  { id: "s-munsan", name: "문산", lat: 37.8590, lng: 126.7855, lines: ["gyeongui"] },
  { id: "s-geumchon", name: "금촌", lat: 37.7695, lng: 126.7680, lines: ["gyeongui"] },
  { id: "s-ilsan", name: "일산", lat: 37.6655, lng: 126.7734, lines: ["gyeongui"] },
  // daegok already defined
  { id: "s-neunggok", name: "능곡", lat: 37.6263, lng: 126.7768, lines: ["gyeongui", "seohaeseon"] },
  { id: "s-haengsin", name: "행신", lat: 37.6125, lng: 126.8164, lines: ["gyeongui"] },
  { id: "s-ganmae", name: "강매", lat: 37.5966, lng: 126.8418, lines: ["gyeongui"] },
  // dmc already defined
  { id: "s-gasan_g", name: "가좌", lat: 37.5702, lng: 126.9129, lines: ["gyeongui"] },
  // hongdae already defined
  // gongdeok already defined
  // seoulstation already defined
  { id: "s-oksu_g", name: "옥수", lat: 37.5403, lng: 127.0172, lines: ["gyeongui"] },
  // wangsimni already defined
  // mangu (sangbong) already defined
  { id: "s-mangu_g", name: "망우", lat: 37.5987, lng: 127.0920, lines: ["gyeongui", "gyeongchun"] },
  { id: "s-yangwon", name: "양원", lat: 37.6072, lng: 127.1045, lines: ["gyeongui"] },
  { id: "s-guri", name: "구리", lat: 37.6028, lng: 127.1431, lines: ["8", "gyeongui"] },
  { id: "s-dunnae", name: "도농", lat: 37.6072, lng: 127.1407, lines: ["gyeongui"] },
  { id: "s-yangjeong_g", name: "양정", lat: 37.5934, lng: 127.1547, lines: ["gyeongui"] },
  { id: "s-deokso", name: "덕소", lat: 37.5850, lng: 127.1720, lines: ["gyeongui"] },
  { id: "s-yongmun_g", name: "용문", lat: 37.5236, lng: 127.6099, lines: ["gyeongui"] },

  // ===== 수인분당선 (주요역) =====
  { id: "s-cheongnyangni_s", name: "청량리", lat: 37.5804, lng: 127.0469, lines: ["suin"] },
  // wangsimni already defined
  // seolleung already defined
  // gangnamgu already defined
  // suseo already defined
  // dogok already defined
  { id: "s-bokjeong", name: "복정", lat: 37.4712, lng: 127.1262, lines: ["suin", "8"] },
  { id: "s-imae", name: "이매", lat: 37.4019, lng: 127.1297, lines: ["suin"] },
  // jeongja already defined
  { id: "s-sunae", name: "서현", lat: 37.3838, lng: 127.1234, lines: ["suin"] },
  { id: "s-ori", name: "오리", lat: 37.3395, lng: 127.1080, lines: ["suin"] },
  { id: "s-jukjeon", name: "죽전", lat: 37.3246, lng: 127.1079, lines: ["suin"] },
  { id: "s-bojeong", name: "보정", lat: 37.3128, lng: 127.1085, lines: ["suin"] },
  { id: "s-giheung", name: "기흥", lat: 37.2748, lng: 127.1155, lines: ["suin", "everline"] },
  { id: "s-mangpo", name: "망포", lat: 37.2555, lng: 127.0710, lines: ["suin"] },
  { id: "s-suwon", name: "수원", lat: 37.2663, lng: 127.0018, lines: ["suin", "1"] },
  { id: "s-oido", name: "오이도", lat: 37.3620, lng: 126.7384, lines: ["suin", "4"] },
  { id: "s-incheon_s", name: "인천", lat: 37.4758, lng: 126.6169, lines: ["suin", "1"] },

  // ===== 공항철도 =====
  { id: "s-incheonairport1", name: "인천공항1터미널", lat: 37.4614, lng: 126.4407, lines: ["arex"] },
  { id: "s-incheonairport2", name: "인천공항2터미널", lat: 37.4686, lng: 126.4153, lines: ["arex"] },
  { id: "s-geomam", name: "검암", lat: 37.5619, lng: 126.6781, lines: ["arex", "incheon2"] },
  { id: "s-gyeyang", name: "계양", lat: 37.5687, lng: 126.7254, lines: ["arex", "incheon1"] },
  // gimpo already defined
  // dmc already defined
  // hongdae already defined
  // gongdeok already defined
  // seoulstation already defined

  // ===== 우이신설선 =====
  { id: "s-bukhansan", name: "북한산우이", lat: 37.6634, lng: 127.0130, lines: ["ui"] },
  { id: "s-solgol", name: "솔밭공원", lat: 37.6565, lng: 127.0140, lines: ["ui"] },
  { id: "s-samyang", name: "삼양사거리", lat: 37.6451, lng: 127.0149, lines: ["ui"] },
  { id: "s-samyanng", name: "삼양", lat: 37.6389, lng: 127.0139, lines: ["ui"] },
  { id: "s-hwagye_ui", name: "화계", lat: 37.6320, lng: 127.0150, lines: ["ui"] },
  { id: "s-gaori", name: "가오리", lat: 37.6250, lng: 127.0149, lines: ["ui"] },
  { id: "s-4.19", name: "4·19민주묘지", lat: 37.6200, lng: 127.0170, lines: ["ui"] },
  { id: "s-ssongshin", name: "성신여대입구", lat: 37.5926, lng: 127.0163, lines: ["ui"] },
  // sinseol already defined

  // ===== 신림선 =====
  { id: "s-gwanak", name: "관악산", lat: 37.4493, lng: 126.9289, lines: ["sillim"] },
  { id: "s-seouluniv_s", name: "서울대벤처타운", lat: 37.4567, lng: 126.9308, lines: ["sillim"] },
  { id: "s-sillim_s", name: "서원", lat: 37.4634, lng: 126.9297, lines: ["sillim"] },
  { id: "s-nangok", name: "난곡", lat: 37.4700, lng: 126.9295, lines: ["sillim"] },
  { id: "s-nanghyang", name: "난향", lat: 37.4767, lng: 126.9302, lines: ["sillim"] },
  { id: "s-sillimsta", name: "신림", lat: 37.4840, lng: 126.9290, lines: ["sillim"] },
  { id: "s-dangok", name: "당곡", lat: 37.4870, lng: 126.9305, lines: ["sillim"] },
  // sillim2 already defined (line 2 신림)
  { id: "s-boramae_s", name: "보라매", lat: 37.4955, lng: 126.9196, lines: ["sillim"] },
  { id: "s-boramae_park", name: "보라매공원", lat: 37.4979, lng: 126.9138, lines: ["sillim"] },
  { id: "s-boramae_hosp", name: "보라매병원", lat: 37.5021, lng: 126.9082, lines: ["sillim"] },
  { id: "s-daebang_s", name: "대방", lat: 37.5130, lng: 126.9267, lines: ["sillim"] },
  { id: "s-seoyul", name: "서울지방병무청", lat: 37.5084, lng: 126.9042, lines: ["sillim"] },
  { id: "s-sindaebang_s", name: "샛강", lat: 37.5103, lng: 126.9118, lines: ["sillim"] },

  // ===== 경춘선 (new stations) =====
  { id: "s-jungnang", name: "중랑", lat: 37.5969, lng: 127.0716, lines: ["gyeongchun"] },
  // 상봉, 망우 already defined
  { id: "s-galmae", name: "갈매", lat: 37.6388, lng: 127.1181, lines: ["gyeongchun"] },
  { id: "s-byeolnae", name: "별내", lat: 37.6422, lng: 127.1272, lines: ["8", "gyeongchun"] },
  { id: "s-toegyewon", name: "퇴계원", lat: 37.6644, lng: 127.1370, lines: ["gyeongchun"] },
  { id: "s-sarung", name: "사릉", lat: 37.6728, lng: 127.1687, lines: ["gyeongchun"] },
  { id: "s-geumgok", name: "금곡", lat: 37.6756, lng: 127.1930, lines: ["gyeongchun"] },
  { id: "s-pyeongnae", name: "평내호평", lat: 37.6585, lng: 127.2070, lines: ["gyeongchun"] },
  { id: "s-maseok", name: "마석", lat: 37.6507, lng: 127.2394, lines: ["gyeongchun"] },
  { id: "s-daeseongri", name: "대성리", lat: 37.6833, lng: 127.3125, lines: ["gyeongchun"] },
  { id: "s-cheongpyeong", name: "청평", lat: 37.7167, lng: 127.3689, lines: ["gyeongchun"] },
  { id: "s-sangcheon", name: "상천", lat: 37.7333, lng: 127.4097, lines: ["gyeongchun"] },
  { id: "s-gapyeong", name: "가평", lat: 37.8119, lng: 127.5111, lines: ["gyeongchun"] },
  { id: "s-gulbongsan", name: "굴봉산", lat: 37.8186, lng: 127.5356, lines: ["gyeongchun"] },
  { id: "s-baegyangri", name: "백양리", lat: 37.8301, lng: 127.5728, lines: ["gyeongchun"] },
  { id: "s-gangchon", name: "강촌", lat: 37.8180, lng: 127.6065, lines: ["gyeongchun"] },
  { id: "s-kimyujeong", name: "김유정", lat: 37.8362, lng: 127.6398, lines: ["gyeongchun"] },
  { id: "s-namchuncheon", name: "남춘천", lat: 37.8649, lng: 127.7117, lines: ["gyeongchun"] },
  { id: "s-chuncheon", name: "춘천", lat: 37.8851, lng: 127.7180, lines: ["gyeongchun"] },

  // ===== 서해선 (대곡소사 + 소사원시) =====
  // 대곡, 능곡 already defined
  { id: "s-goksan", name: "곡산", lat: 37.6457, lng: 126.8018, lines: ["seohaeseon"] },
  { id: "s-wonjong", name: "원종", lat: 37.5385, lng: 126.7940, lines: ["seohaeseon"] },
  { id: "s-bucheon_stadium", name: "부천종합운동장", lat: 37.5054, lng: 126.7974, lines: ["7", "seohaeseon"] },
  { id: "s-sosa", name: "소사", lat: 37.4832, lng: 126.7988, lines: ["1", "seohaeseon"] },
  { id: "s-sosaeul", name: "소새울", lat: 37.4678, lng: 126.7982, lines: ["seohaeseon"] },
  { id: "s-siheungdaeya", name: "시흥대야", lat: 37.4507, lng: 126.7948, lines: ["seohaeseon"] },
  { id: "s-siheungsicheong", name: "시흥시청", lat: 37.3820, lng: 126.8060, lines: ["seohaeseon"] },
  { id: "s-siheungneunggok", name: "시흥능곡", lat: 37.3693, lng: 126.8083, lines: ["seohaeseon"] },
  { id: "s-dalmi", name: "달미", lat: 37.3495, lng: 126.8087, lines: ["seohaeseon"] },
  { id: "s-seonbu", name: "선부", lat: 37.3370, lng: 126.8070, lines: ["seohaeseon"] },
  { id: "s-choji", name: "초지", lat: 37.3209, lng: 126.8056, lines: ["4", "seohaeseon"] },
  { id: "s-wonsi", name: "원시", lat: 37.3026, lng: 126.7868, lines: ["seohaeseon"] },

  // ===== GTX-A (new stations) =====
  { id: "s-unjeong", name: "운정", lat: 37.7147, lng: 126.7548, lines: ["gtxa"] },
  { id: "s-kintex", name: "킨텍스", lat: 37.6697, lng: 126.7477, lines: ["gtxa"] },
  // 대곡, 연신내, 서울역, 삼성, 수서 already defined
  { id: "s-changneung", name: "창릉", lat: 37.6370, lng: 126.8700, lines: ["gtxa"] },
  { id: "s-seongnam_gtx", name: "성남", lat: 37.3937, lng: 127.1206, lines: ["gtxa"] },
  { id: "s-guseong", name: "구성", lat: 37.2994, lng: 127.1058, lines: ["gtxa"] },
  { id: "s-dongtan", name: "동탄", lat: 37.2004, lng: 127.0956, lines: ["gtxa"] },

  // ===== 김포골드라인 =====
  // 김포공항 already defined
  { id: "s-gochon", name: "고촌", lat: 37.6016, lng: 126.7703, lines: ["gimpo_gold"] },
  { id: "s-pungmu", name: "풍무", lat: 37.6121, lng: 126.7334, lines: ["gimpo_gold"] },
  { id: "s-sau", name: "사우(김포시청)", lat: 37.6214, lng: 126.7167, lines: ["gimpo_gold"] },
  { id: "s-geolpo", name: "걸포북변", lat: 37.6314, lng: 126.7046, lines: ["gimpo_gold"] },
  { id: "s-unyang", name: "운양", lat: 37.6538, lng: 126.6824, lines: ["gimpo_gold"] },
  { id: "s-janggi", name: "장기", lat: 37.6449, lng: 126.6678, lines: ["gimpo_gold"] },
  { id: "s-masan_gp", name: "마산", lat: 37.6450, lng: 126.6484, lines: ["gimpo_gold"] },
  { id: "s-gurae", name: "구래", lat: 37.6452, lng: 126.6290, lines: ["gimpo_gold"] },
  { id: "s-yangchon", name: "양촌", lat: 37.6478, lng: 126.6112, lines: ["gimpo_gold"] },

  // ===== 용인에버라인 =====
  // 기흥 already defined
  { id: "s-gangnamdae", name: "강남대", lat: 37.2710, lng: 127.1260, lines: ["everline"] },
  { id: "s-jiseok", name: "지석", lat: 37.2675, lng: 127.1385, lines: ["everline"] },
  { id: "s-eojeong", name: "어정", lat: 37.2650, lng: 127.1525, lines: ["everline"] },
  { id: "s-dongbaek", name: "동백", lat: 37.2680, lng: 127.1550, lines: ["everline"] },
  { id: "s-chodang", name: "초당", lat: 37.2625, lng: 127.1637, lines: ["everline"] },
  { id: "s-samga", name: "삼가", lat: 37.2550, lng: 127.1705, lines: ["everline"] },
  { id: "s-yongin_city", name: "시청·용인대", lat: 37.2410, lng: 127.1780, lines: ["everline"] },
  { id: "s-myeongjidae", name: "명지대", lat: 37.2385, lng: 127.1900, lines: ["everline"] },
  { id: "s-gimnyangjang", name: "김량장", lat: 37.2320, lng: 127.2020, lines: ["everline"] },
  { id: "s-undongjangsongdam", name: "운동장·송담대", lat: 37.2275, lng: 127.2100, lines: ["everline"] },
  { id: "s-gojin", name: "고진", lat: 37.2195, lng: 127.2180, lines: ["everline"] },
  { id: "s-bopyeong", name: "보평", lat: 37.2110, lng: 127.2237, lines: ["everline"] },
  { id: "s-dunjeon", name: "둔전", lat: 37.2010, lng: 127.2265, lines: ["everline"] },
  { id: "s-jeondae", name: "전대·에버랜드", lat: 37.1920, lng: 127.2300, lines: ["everline"] },

  // ===== 의정부경전철 =====
  { id: "s-balgok", name: "발곡", lat: 37.7270, lng: 127.0529, lines: ["uijeongbu"] },
  { id: "s-hoeryong", name: "회룡", lat: 37.7236, lng: 127.0480, lines: ["1", "uijeongbu"] },
  { id: "s-beomgol", name: "범골", lat: 37.7287, lng: 127.0440, lines: ["uijeongbu"] },
  { id: "s-lrt_uijeongbu", name: "경전철의정부", lat: 37.7373, lng: 127.0433, lines: ["uijeongbu"] },
  { id: "s-uijeongbu_city", name: "의정부시청", lat: 37.7391, lng: 127.0350, lines: ["uijeongbu"] },
  { id: "s-heungseong", name: "흥선", lat: 37.7432, lng: 127.0370, lines: ["uijeongbu"] },
  { id: "s-uijeongbu_center", name: "의정부중앙", lat: 37.7436, lng: 127.0500, lines: ["uijeongbu"] },
  { id: "s-dongo", name: "동오", lat: 37.7452, lng: 127.0570, lines: ["uijeongbu"] },
  { id: "s-saemal", name: "새말", lat: 37.7488, lng: 127.0640, lines: ["uijeongbu"] },
  { id: "s-ggbuk", name: "경기도청북부청사", lat: 37.7507, lng: 127.0716, lines: ["uijeongbu"] },
  { id: "s-hyoja", name: "효자", lat: 37.7539, lng: 127.0770, lines: ["uijeongbu"] },
  { id: "s-gonje", name: "곤제", lat: 37.7505, lng: 127.0840, lines: ["uijeongbu"] },
  { id: "s-eoryong", name: "어룡", lat: 37.7427, lng: 127.0850, lines: ["uijeongbu"] },
  { id: "s-songsan_uj", name: "송산", lat: 37.7372, lng: 127.0870, lines: ["uijeongbu"] },
  { id: "s-tapseok", name: "탑석", lat: 37.7335, lng: 127.0890, lines: ["uijeongbu"] },

  // ===== 인천1호선 =====
  // 계양 already defined (shared with arex)
  { id: "s-gyulhyeon", name: "귤현", lat: 37.5552, lng: 126.7280, lines: ["incheon1"] },
  { id: "s-bakchon", name: "박촌", lat: 37.5437, lng: 126.7338, lines: ["incheon1"] },
  { id: "s-imhak", name: "임학", lat: 37.5360, lng: 126.7398, lines: ["incheon1"] },
  { id: "s-gyesan", name: "계산", lat: 37.5270, lng: 126.7433, lines: ["incheon1"] },
  { id: "s-gyeongin", name: "경인교대입구", lat: 37.5220, lng: 126.7440, lines: ["incheon1"] },
  { id: "s-jakjeon", name: "작전", lat: 37.5150, lng: 126.7415, lines: ["incheon1"] },
  { id: "s-galsan", name: "갈산", lat: 37.5068, lng: 126.7375, lines: ["incheon1"] },
  { id: "s-bupyeong_gu", name: "부평구청", lat: 37.5098, lng: 126.7218, lines: ["7", "incheon1"] },
  { id: "s-bupyeong_market", name: "부평시장", lat: 37.5010, lng: 126.7220, lines: ["incheon1"] },
  { id: "s-bupyeong", name: "부평", lat: 37.4908, lng: 126.7234, lines: ["1", "incheon1"] },
  { id: "s-dongsu", name: "동수", lat: 37.4833, lng: 126.7324, lines: ["incheon1"] },
  { id: "s-bupyeong3", name: "부평삼거리", lat: 37.4817, lng: 126.7437, lines: ["incheon1"] },
  { id: "s-ganseok5", name: "간석오거리", lat: 37.4719, lng: 126.7516, lines: ["incheon1"] },
  { id: "s-incheonsicheong", name: "인천시청", lat: 37.4630, lng: 126.7500, lines: ["incheon1"] },
  { id: "s-yesulhoe", name: "예술회관", lat: 37.4530, lng: 126.7399, lines: ["incheon1"] },
  { id: "s-incheon_terminal", name: "인천터미널", lat: 37.4465, lng: 126.7346, lines: ["incheon1"] },
  { id: "s-munhak", name: "문학경기장", lat: 37.4340, lng: 126.7320, lines: ["incheon1"] },
  { id: "s-seonhak", name: "선학", lat: 37.4275, lng: 126.6990, lines: ["incheon1"] },
  { id: "s-sinyeonsu", name: "신연수", lat: 37.4178, lng: 126.6938, lines: ["incheon1"] },
  { id: "s-woninjae", name: "원인재", lat: 37.4131, lng: 126.6881, lines: ["incheon1"] },
  { id: "s-dongchun_ic", name: "동춘", lat: 37.4046, lng: 126.6797, lines: ["incheon1"] },
  { id: "s-dongmak", name: "동막", lat: 37.3986, lng: 126.6732, lines: ["incheon1"] },
  { id: "s-campustown", name: "캠퍼스타운", lat: 37.3874, lng: 126.6615, lines: ["incheon1"] },
  { id: "s-technopark", name: "테크노파크", lat: 37.3817, lng: 126.6563, lines: ["incheon1"] },
  { id: "s-jisik", name: "지식정보단지", lat: 37.3768, lng: 126.6463, lines: ["incheon1"] },
  { id: "s-incheondae", name: "인천대입구", lat: 37.3853, lng: 126.6389, lines: ["incheon1"] },
  { id: "s-centralpark", name: "센트럴파크", lat: 37.3932, lng: 126.6347, lines: ["incheon1"] },
  { id: "s-ibd", name: "국제업무지구", lat: 37.3991, lng: 126.6305, lines: ["incheon1"] },

  // ===== 인천2호선 =====
  { id: "s-geomdan_oryu", name: "검단오류", lat: 37.5928, lng: 126.6313, lines: ["incheon2"] },
  { id: "s-wanggil", name: "왕길", lat: 37.5850, lng: 126.6430, lines: ["incheon2"] },
  { id: "s-geomdan4", name: "검단사거리", lat: 37.5780, lng: 126.6520, lines: ["incheon2"] },
  { id: "s-majeon", name: "마전", lat: 37.5730, lng: 126.6620, lines: ["incheon2"] },
  { id: "s-wanjeong", name: "완정", lat: 37.5680, lng: 126.6700, lines: ["incheon2"] },
  { id: "s-dokjeong", name: "독정", lat: 37.5650, lng: 126.6750, lines: ["incheon2"] },
  // 검암 already defined (shared with arex)
  { id: "s-geombawi", name: "검바위", lat: 37.5530, lng: 126.6850, lines: ["incheon2"] },
  { id: "s-asiad", name: "아시아드경기장", lat: 37.5413, lng: 126.6760, lines: ["incheon2"] },
  { id: "s-seogu", name: "서구청", lat: 37.5380, lng: 126.6700, lines: ["incheon2"] },
  { id: "s-gajeong", name: "가정", lat: 37.5300, lng: 126.6750, lines: ["incheon2"] },
  { id: "s-gajeong_market", name: "가정중앙시장", lat: 37.5220, lng: 126.6800, lines: ["incheon2"] },
  { id: "s-seongnam_ic", name: "석남", lat: 37.5062, lng: 126.6762, lines: ["7", "incheon2"] },
  { id: "s-seobu_women", name: "서부여성회관", lat: 37.4990, lng: 126.6860, lines: ["incheon2"] },
  { id: "s-incheon_gajwa", name: "인천가좌", lat: 37.4920, lng: 126.6920, lines: ["incheon2"] },
  { id: "s-gajaeul", name: "가재울", lat: 37.4850, lng: 126.6960, lines: ["incheon2"] },
  { id: "s-juan_ind", name: "주안국가산단", lat: 37.4750, lng: 126.7010, lines: ["incheon2"] },
  { id: "s-juan", name: "주안", lat: 37.4649, lng: 126.6802, lines: ["1", "incheon2"] },
  { id: "s-siminpark", name: "시민공원", lat: 37.4580, lng: 126.7120, lines: ["incheon2"] },
  { id: "s-seokbawi", name: "석바위시장", lat: 37.4500, lng: 126.7220, lines: ["incheon2"] },
  { id: "s-incheondae_park", name: "인천대공원", lat: 37.4420, lng: 126.7350, lines: ["incheon2"] },
  { id: "s-namdong_gu", name: "남동구청", lat: 37.4410, lng: 126.7470, lines: ["incheon2"] },
  { id: "s-ganseok_ic", name: "간석", lat: 37.4390, lng: 126.7560, lines: ["incheon2"] },
  { id: "s-mansu", name: "만수", lat: 37.4350, lng: 126.7650, lines: ["incheon2"] },
  { id: "s-namdong_ind", name: "남동인더스파크", lat: 37.4260, lng: 126.7680, lines: ["incheon2"] },
  { id: "s-hogupo", name: "호구포", lat: 37.4200, lng: 126.7730, lines: ["incheon2"] },
  { id: "s-unyeon", name: "운연", lat: 37.4120, lng: 126.7680, lines: ["incheon2"] },
];

// Ordered station IDs per line (for drawing polylines)
export const SEOUL_LINE_ROUTES: Record<string, string[][]> = {
  "1": [
    // 본선: 도봉산 → 구로 → 금천구청
    ["s-dobongsan", "s-dobong", "s-bangnak", "s-changdong", "s-nokcheon", "s-wolge", "s-gwangundae", "s-seokgye", "s-sinimun", "s-oedaeap", "s-hoegi", "s-cheongnyangni", "s-jegi", "s-sinseol", "s-dongmyo", "s-dongdaemun", "s-jongno5ga", "s-jongno3ga", "s-jonggak", "s-sicheong", "s-seoulstation", "s-namyeong", "s-yongsan", "s-noryangjin", "s-daebang", "s-singil", "s-yeongdeungpo", "s-sindorim", "s-guro", "s-gasandigital", "s-doksan", "s-geumcheon"],
    // 연천 방면 (경원선): 도봉산 → 연천
    ["s-dobongsan", "s-mangwolsa", "s-hoeryong", "s-uijeongbu", "s-ganeung", "s-nokyang", "s-yangju", "s-deokgye", "s-deokjeong", "s-jihaeng", "s-dongducheon_jungang", "s-bosan", "s-dongducheon", "s-soyosan", "s-choseongri", "s-hantangang", "s-jeongok", "s-yeoncheon"],
    // 인천 방면 (경인선): 구로 → 인천
    ["s-guro", "s-guil", "s-gaebong", "s-oryudong", "s-onsu", "s-yeokgok", "s-sosa", "s-bucheon", "s-jungdong", "s-songnae", "s-bugae", "s-bupyeong", "s-baekun", "s-dongam", "s-ganseok", "s-juan", "s-dohwa", "s-jemulpo", "s-dowon", "s-dongincheon", "s-incheon_s"],
    // 천안/신창 방면 (경부선): 금천구청 → 신창
    ["s-geumcheon", "s-seoksu", "s-gwanak_st", "s-anyang", "s-myeonghak", "s-geumjeong", "s-gunpo", "s-dangjeong", "s-uiwang", "s-skku", "s-hwaseo", "s-suwon", "s-seryu", "s-byeongjeom", "s-sema", "s-osandae", "s-osan", "s-jinwi", "s-songtan", "s-seojeongri", "s-pyeongtaek", "s-seonghwan", "s-jiksan", "s-dujeong", "s-cheonan", "s-bongmyeong", "s-ssangyong", "s-asan", "s-tangjeong", "s-baebang", "s-onyang", "s-sinchang"],
    // 서동탄 지선: 병점 → 서동탄
    ["s-byeongjeom", "s-seodongtan"],
    // 광명셔틀: 금천구청 → 광명
    ["s-geumcheon", "s-gwangmyeong"],
  ],
  "2": [
    // 순환선
    ["s-sicheong", "s-euljiro1", "s-euljiro3", "s-euljiro4", "s-dongdaemunhist", "s-sindang", "s-sangwangsimni", "s-wangsimni", "s-hanyangdae", "s-ttukseom", "s-seongsu", "s-geondae", "s-guui", "s-gangbyeon", "s-jamsilnaru", "s-jamsil", "s-jamsilnew", "s-jonghap", "s-samseong", "s-seolleung", "s-yeoksam", "s-gangnam", "s-gyodae", "s-seocho", "s-bangbae", "s-sadang", "s-nakseongdae", "s-seouluniv", "s-bongcheon", "s-sillim2", "s-sindaebang", "s-gurodigital", "s-daelim", "s-sindorim", "s-mullae", "s-ydpgucheong", "s-dangsan", "s-hapjeong", "s-hongdae", "s-sinchon", "s-ewha", "s-ahyeon", "s-chungjeongno", "s-sicheong"],
    // 성수지선
    ["s-seongsu", "s-yongdap", "s-sindap", "s-yongdu", "s-sinseol"],
    // 신정지선
    ["s-sindorim", "s-dorimcheon", "s-yangcheongucheong", "s-sinjeongnegeori", "s-kkachisan"]
  ],
  "3": [["s-daehwa", "s-juyeop", "s-jeongbalsan", "s-baekseokmaeul", "s-baekseok3", "s-daegok", "s-hwajeong", "s-wondang", "s-wonheung", "s-samsong", "s-jichuk", "s-gupabal", "s-yeonsinnae", "s-bulgwang", "s-nokbeon", "s-hongje", "s-muakjae", "s-dongnimmun", "s-gyeongbokgung", "s-anguk", "s-jongno3ga", "s-euljiro3", "s-chungmuro", "s-dongguk", "s-yaksu", "s-geumho", "s-oksu", "s-apgujeong", "s-sinsa", "s-jamwon", "s-gosok", "s-gyodae", "s-nambu", "s-yangjae", "s-maebong", "s-dogok", "s-daechee", "s-hagye", "s-daechi2", "s-ilwon", "s-suseo", "s-garak", "s-police", "s-ogeum"]],
  "4": [["s-jinjeop", "s-onam", "s-byeolnaebyelgaram", "s-buramsan", "s-sanggye", "s-nowon", "s-changdong", "s-ssangmun", "s-suyu", "s-mia", "s-mia3", "s-gireum", "s-sungsin", "s-hansung", "s-hyehwa", "s-dongdaemun", "s-dongdaemunhist", "s-chungmuro", "s-myeongdong", "s-hoehyeon", "s-seoulstation", "s-sookmyung", "s-sinyongsan", "s-samgakji", "s-ichon", "s-dongjak", "s-sadang", "s-namtaeryeong", "s-seoleksan", "s-gyeongmagongwon", "s-daegongwon", "s-gwacheon", "s-jeongbu", "s-indeogwon", "s-pyeongchon", "s-beomgye", "s-geumjeong", "s-sanbon", "s-surisan", "s-daeyami", "s-banwol", "s-sangnoksu", "s-handaeap", "s-jungang_ansan", "s-gojan", "s-choji", "s-ansan", "s-neunggil", "s-jeongwang", "s-oido"]],
  "5": [["s-banghwa", "s-gaehwa", "s-gimpo", "s-songjeong5", "s-magok", "s-balsan", "s-ujangsan", "s-hwagok", "s-kkachisan", "s-sinjeong", "s-mokdong", "s-omokgyo", "s-yangpyeong", "s-ydpgucheong", "s-ydpmarket", "s-sinan", "s-yeouido", "s-yeouinaru", "s-mapo", "s-gongdeok", "s-aehogaejon", "s-chungjeongno", "s-seodaemun", "s-gwanghwamun", "s-jongno3ga", "s-euljiro4", "s-dongdaemunhist", "s-cheonggu", "s-singeumho", "s-haengdang", "s-wangsimni", "s-majang", "s-dapsimni", "s-janghanpyeong", "s-gunja", "s-achasan", "s-gwangnaru", "s-cheonho", "s-gangdong", "s-gildonggil", "s-gubi", "s-myeongil", "s-godeok", "s-sangil", "s-gangil", "s-misa", "s-hanam_pungsan", "s-hanam_city", "s-hanam"],
    ["s-gangdong", "s-dunchondong", "s-olympic", "s-bangi", "s-ogeum", "s-gaerong", "s-geoyeo", "s-macheon"]],
  "6": [
    // 본선
    ["s-eungam", "s-saemaeul", "s-jeungsan", "s-dmc", "s-worldcup", "s-mapogu", "s-mangwon", "s-hapjeong", "s-sangsu", "s-gwangheungcang", "s-daheung", "s-gongdeok", "s-hyochang", "s-samgakji", "s-noksapyeong", "s-itaewon", "s-hangangjin", "s-beotigo", "s-yaksu", "s-cheonggu", "s-sindang", "s-dongmyo", "s-changsin", "s-boramae", "s-annam", "s-korea_univ", "s-wolkok", "s-sangwolkok", "s-dolgotzge", "s-seokgye", "s-taereung", "s-hwarangdae", "s-bonghwasan", "s-sinnae"],
    // 응암순환
    ["s-eungam", "s-yeokchon", "s-bulgwang", "s-dokbawi", "s-yeonsinnae", "s-gusan", "s-eungam"]
  ],
  "7": [["s-jangam", "s-dobongsan", "s-suraksan", "s-madeul", "s-nowon", "s-junggye", "s-hagye7", "s-gongneung", "s-taereung", "s-meogeol", "s-junghwa", "s-mangu", "s-myeonmok", "s-sagajeong", "s-yongmasan", "s-junggok", "s-gunja", "s-eorinyi", "s-geondae", "s-jayang", "s-cheongdam", "s-gangnamgu", "s-hak", "s-nonhyeon", "s-banpo", "s-gosok", "s-naebang", "s-total", "s-namsung", "s-sungbuk", "s-sangdo", "s-jangseungbae", "s-sindaebang3", "s-boramae7", "s-sinpung", "s-daelim", "s-namguro", "s-gasandigital", "s-cheolsan", "s-gwangmyeongsageori", "s-chungan", "s-onsu", "s-kkachiul", "s-bucheon_stadium", "s-chunui", "s-sinjungdong", "s-bucheonsicheong", "s-sangdong", "s-samsancheyukgwan", "s-gulpocheon", "s-bupyeong_gu", "s-sangok", "s-seongnam_ic"]],
  "8": [["s-byeolnae", "s-dasan", "s-donggureung", "s-guri", "s-jangjahosugongwon", "s-amsayeoksa", "s-amsa", "s-cheonho", "s-gangdong8", "s-mongchon", "s-jamsil", "s-seokchon", "s-songpa", "s-garak", "s-munjeong", "s-jangji", "s-bokjeong", "s-namwirye", "s-sanseong", "s-namhansanseong", "s-dandaeogeori", "s-sinheung", "s-sujin", "s-moran"]],
  "9": [["s-gaehwa9", "s-gimpo", "s-airport9", "s-sinbanghwa", "s-magongnaru", "s-yangcheonhyanggyo", "s-gayang", "s-jeungmi", "s-deungchon", "s-yeomchang", "s-sinmok", "s-dangsan", "s-seonyudo", "s-gukhoe", "s-yeouido", "s-saetgang", "s-nodeul", "s-noryangjin", "s-heukseok", "s-dongjak", "s-guhban", "s-sinbanpo", "s-gosok", "s-sapyeong", "s-sinnonhyeon", "s-seonjeongneung", "s-eonju", "s-samsungjungang", "s-bongeunsa", "s-jonghap", "s-samjeon", "s-seokchon9", "s-seokchon", "s-songpa9", "s-hangangjung", "s-olympic", "s-dunchonoryun", "s-bokhun"]],
  shinbundang: [["s-sinsa_sb", "s-nonhyeon_sb", "s-sinnonhyeon", "s-gangnam", "s-yangjae", "s-yangjae_citizen", "s-cheonggyesan", "s-pangyo", "s-jeongja", "s-migeum", "s-dongcheon", "s-suji", "s-seongbok", "s-sanghyeon", "s-gwanggyo_jungang", "s-gwanggyo"]],
  gyeongui: [["s-munsan", "s-geumchon", "s-ilsan", "s-daegok", "s-neunggok", "s-haengsin", "s-ganmae", "s-dmc", "s-gasan_g", "s-hongdae", "s-gongdeok", "s-seoulstation", "s-ichon", "s-oksu", "s-wangsimni", "s-mangu", "s-mangu_g", "s-yangwon", "s-guri", "s-dunnae", "s-yangjeong_g", "s-deokso"]],
  suin: [["s-cheongnyangni", "s-wangsimni", "s-seolleung", "s-gangnamgu", "s-dogok", "s-suseo", "s-bokjeong", "s-moran", "s-imae", "s-jeongja", "s-sunae", "s-ori", "s-jukjeon", "s-bojeong", "s-giheung", "s-mangpo", "s-suwon"]],
  arex: [["s-incheonairport2", "s-incheonairport1", "s-geomam", "s-gyeyang", "s-gimpo", "s-dmc", "s-hongdae", "s-gongdeok", "s-seoulstation"]],
  ui: [["s-bukhansan", "s-solgol", "s-samyang", "s-samyanng", "s-hwagye_ui", "s-gaori", "s-4.19", "s-sungsin", "s-sinseol"]],
  sillim: [["s-gwanak", "s-seouluniv_s", "s-sillim_s", "s-nangok", "s-nanghyang", "s-sillimsta", "s-dangok", "s-sillim2", "s-boramae_s", "s-boramae_park", "s-boramae_hosp", "s-daebang_s"]],
  gyeongchun: [["s-cheongnyangni", "s-hoegi", "s-jungnang", "s-mangu", "s-mangu_g", "s-galmae", "s-byeolnae", "s-toegyewon", "s-sarung", "s-geumgok", "s-pyeongnae", "s-maseok", "s-daeseongri", "s-cheongpyeong", "s-sangcheon", "s-gapyeong", "s-gulbongsan", "s-baegyangri", "s-gangchon", "s-kimyujeong", "s-namchuncheon", "s-chuncheon"]],
  seohaeseon: [["s-daegok", "s-neunggok", "s-goksan", "s-wonjong", "s-bucheon_stadium", "s-sosa", "s-sosaeul", "s-siheungdaeya", "s-siheungsicheong", "s-siheungneunggok", "s-dalmi", "s-seonbu", "s-choji", "s-wonsi"]],
  gtxa: [["s-unjeong", "s-kintex", "s-daegok", "s-changneung", "s-yeonsinnae", "s-seoulstation", "s-samseong", "s-suseo", "s-seongnam_gtx", "s-guseong", "s-dongtan"]],
  gimpo_gold: [["s-gimpo", "s-gochon", "s-pungmu", "s-sau", "s-geolpo", "s-unyang", "s-janggi", "s-masan_gp", "s-gurae", "s-yangchon"]],
  everline: [["s-giheung", "s-gangnamdae", "s-jiseok", "s-eojeong", "s-dongbaek", "s-chodang", "s-samga", "s-yongin_city", "s-myeongjidae", "s-gimnyangjang", "s-undongjangsongdam", "s-gojin", "s-bopyeong", "s-dunjeon", "s-jeondae"]],
  uijeongbu: [["s-balgok", "s-hoeryong", "s-beomgol", "s-lrt_uijeongbu", "s-uijeongbu_city", "s-heungseong", "s-uijeongbu_center", "s-dongo", "s-saemal", "s-ggbuk", "s-hyoja", "s-gonje", "s-eoryong", "s-songsan_uj", "s-tapseok"]],
  incheon1: [["s-gyeyang", "s-gyulhyeon", "s-bakchon", "s-imhak", "s-gyesan", "s-gyeongin", "s-jakjeon", "s-galsan", "s-bupyeong_gu", "s-bupyeong_market", "s-bupyeong", "s-dongsu", "s-bupyeong3", "s-ganseok5", "s-incheonsicheong", "s-yesulhoe", "s-incheon_terminal", "s-munhak", "s-seonhak", "s-sinyeonsu", "s-woninjae", "s-dongchun_ic", "s-dongmak", "s-campustown", "s-technopark", "s-jisik", "s-incheondae", "s-centralpark", "s-ibd"]],
  incheon2: [["s-geomdan_oryu", "s-wanggil", "s-geomdan4", "s-majeon", "s-wanjeong", "s-dokjeong", "s-geomam", "s-geombawi", "s-asiad", "s-seogu", "s-gajeong", "s-gajeong_market", "s-seongnam_ic", "s-seobu_women", "s-incheon_gajwa", "s-gajaeul", "s-juan_ind", "s-juan", "s-siminpark", "s-seokbawi", "s-incheondae_park", "s-namdong_gu", "s-ganseok_ic", "s-mansu", "s-namdong_ind", "s-hogupo", "s-unyeon"]],
};
