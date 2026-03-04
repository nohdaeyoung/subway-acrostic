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
  "3": [["s-daehwa", "s-juyeop", "s-jeongbalsan", "s-madu", "s-baekseok", "s-daegok", "s-hwajeong", "s-wondang", "s-wonheung", "s-samsong", "s-jichuk", "s-gupabal", "s-yeonsinnae", "s-bulgwang", "s-nokbeon", "s-hongje", "s-muakjae", "s-dongnimmun", "s-gyeongbokgung", "s-anguk", "s-jongno3ga", "s-euljiro3", "s-chungmuro", "s-dongguk", "s-yaksu", "s-geumho", "s-oksu", "s-apgujeong", "s-sinsa", "s-jamwon", "s-gosok", "s-gyodae", "s-nambu", "s-yangjae", "s-maebong", "s-dogok", "s-daechee", "s-hagye", "s-daechi2", "s-ilwon", "s-suseo", "s-garak", "s-police", "s-ogeum"]],
  "4": [["s-jinjeop", "s-onam", "s-byeolnaebyelgaram", "s-buramsan", "s-sanggye", "s-nowon", "s-changdong", "s-ssangmun", "s-suyu", "s-mia", "s-mia3", "s-gireum", "s-sungsin", "s-hansung", "s-hyehwa", "s-dongdaemun", "s-dongdaemunhist", "s-chungmuro", "s-myeongdong", "s-hoehyeon", "s-seoulstation", "s-sookmyung", "s-samgakji", "s-sinyongsan", "s-ichon", "s-dongjak", "s-sadang", "s-namtaeryeong", "s-seoleksan", "s-gyeongmagongwon", "s-daegongwon", "s-gwacheon", "s-jeongbu", "s-indeogwon", "s-pyeongchon", "s-beomgye", "s-geumjeong", "s-sanbon", "s-surisan", "s-daeyami", "s-banwol", "s-sangnoksu", "s-handaeap", "s-jungang_ansan", "s-gojan", "s-choji", "s-ansan", "s-neunggil", "s-jeongwang", "s-oido"]],
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
  "9": [["s-gaehwa9", "s-gimpo", "s-airport9", "s-sinbanghwa", "s-magongnaru", "s-yangcheonhyanggyo", "s-gayang", "s-jeungmi", "s-deungchon", "s-yeomchang", "s-sinmok", "s-seonyudo", "s-dangsan", "s-gukhoe", "s-yeouido", "s-saetgang", "s-noryangjin", "s-nodeul", "s-heukseok", "s-dongjak", "s-guhban", "s-sinbanpo", "s-gosok", "s-sapyeong", "s-sinnonhyeon", "s-eonju", "s-seonjeongneung", "s-samsungjungang", "s-bongeunsa", "s-jonghap", "s-samjeon", "s-seokchon9", "s-seokchon", "s-songpa9", "s-hangangjung", "s-olympic", "s-dunchonoryun", "s-bokhun"]],
  shinbundang: [["s-sinsa_sb", "s-nonhyeon_sb", "s-sinnonhyeon", "s-gangnam", "s-yangjae", "s-yangjae_citizen", "s-cheonggyesan", "s-pangyo", "s-jeongja", "s-migeum", "s-dongcheon", "s-suji", "s-seongbok", "s-sanghyeon", "s-gwanggyo_jungang", "s-gwanggyo"]],
  gyeongui: [
    // 경의선 본선: 임진강 → 가좌
    ["s-imjingang", "s-uncheon", "s-munsan", "s-paju_g", "s-wollong", "s-geumchon", "s-geumneung", "s-unjeong_g", "s-yadang", "s-tanhyeon", "s-ilsan", "s-pungsan_g", "s-baekma_g", "s-goksan", "s-daegok", "s-neunggok", "s-haengsin", "s-ganmae", "s-hwajeon", "s-susaek", "s-dmc", "s-gasan_g"],
    // 서울역 지선: 가좌 → 신촌 → 서울역 (종점)
    ["s-gasan_g", "s-sinchon_g", "s-seoulstation"],
    // 중앙선: 가좌 → 홍대입구 → 서강대 → 공덕 → 효창공원앞 → 용산 → 지평
    ["s-gasan_g", "s-hongdae", "s-seogang", "s-gongdeok", "s-hyochang", "s-yongsan", "s-ichon", "s-seobinggo", "s-hannam_g", "s-oksu_g", "s-eungbong", "s-wangsimni", "s-cheongnyangni", "s-hoegi", "s-jungnang", "s-mangu", "s-mangu_g", "s-yangwon", "s-guri", "s-dunnae", "s-yangjeong_g", "s-deokso", "s-dohim", "s-paldang", "s-ungilsan", "s-yangsu", "s-sinwon_g", "s-guksu", "s-asin", "s-obin", "s-yangpyeong_g", "s-wondeok", "s-yongmun_g", "s-jipyeong"],
  ],
  suin: [["s-cheongnyangni", "s-wangsimni", "s-seoullsup", "s-apgujeong_r", "s-gangnamgu", "s-seonjeongneung", "s-seolleung", "s-hanti", "s-dogok", "s-gurong", "s-gaepodong", "s-daemosanip", "s-suseo", "s-bokjeong", "s-gachondae", "s-taepyeong", "s-moran", "s-yatap", "s-imae", "s-seohyeon", "s-sunae", "s-jeongja", "s-migeum", "s-ori", "s-jukjeon", "s-bojeong", "s-guseong", "s-singal", "s-giheung", "s-sanggal", "s-cheongmyeong", "s-yeongtong", "s-mangpo", "s-maetankweon", "s-suwoncity", "s-maegyo", "s-suwon", "s-gosaek", "s-omokcheon", "s-eocheon", "s-yamok", "s-sari", "s-handaeap", "s-jungang_ansan", "s-gojan", "s-choji", "s-ansan", "s-singilon", "s-jeongwang", "s-oido", "s-dalwol", "s-wolgot", "s-sorae", "s-icnohyeon", "s-hogupo", "s-namdongip", "s-woninaje", "s-yeonsu", "s-songdo_s", "s-inha", "s-sungui", "s-sinpo_k", "s-incheon_s"]],
  arex: [["s-incheonairport2", "s-incheonairport1", "s-yeongjong", "s-cheongna", "s-geomam", "s-gyeyang", "s-gimpo", "s-magongnaru", "s-dmc", "s-hongdae", "s-gongdeok", "s-seoulstation"]],
  ui: [["s-bukhansan", "s-solgol", "s-4.19", "s-gaori", "s-hwagye_ui", "s-samyang", "s-samyanng", "s-solsaem", "s-bukhansan_bog", "s-jeongneung_ui", "s-sungsin", "s-boramae", "s-sinseol"]],
  sillim: [["s-gwanak", "s-seouluniv_s", "s-sillim_s", "s-sillim2", "s-dangok", "s-boramae_hosp", "s-boramae_park", "s-boramae_s", "s-seoyul", "s-daebang_s", "s-sindaebang_s"]],
  gyeongchun: [
    // 본선: 청량리 → 춘천
    ["s-cheongnyangni", "s-hoegi", "s-jungnang", "s-mangu", "s-mangu_g", "s-sinnae", "s-galmae", "s-byeolnae", "s-toegyewon", "s-sarung", "s-geumgok", "s-pyeongnae", "s-maseok", "s-daeseongri", "s-cheongpyeong", "s-sangcheon", "s-gapyeong", "s-gulbongsan", "s-baegyangri", "s-gangchon", "s-kimyujeong", "s-namchuncheon", "s-chuncheon"],
    // 광운대 지선: 광운대 → 상봉 (본선 합류)
    ["s-gwangundae", "s-mangu"],
  ],
  seohaeseon: [["s-daegok", "s-neunggok", "s-gimpo", "s-wonjong", "s-bucheon_stadium", "s-sosa", "s-sosaeul", "s-siheungdaeya", "s-sincheon", "s-sinhyeon", "s-siheungsicheong", "s-siheungneunggok", "s-dalmi", "s-seonbu", "s-choji", "s-siu", "s-wonsi"]],
  gtxa: [["s-unjeong", "s-kintex", "s-daegok", "s-changneung", "s-yeonsinnae", "s-seoulstation", "s-samseong", "s-suseo", "s-seongnam_gtx", "s-guseong", "s-dongtan"]],
  gimpo_gold: [["s-gimpo", "s-gochon", "s-pungmu", "s-sau", "s-geolpo", "s-unyang", "s-janggi", "s-masan_gp", "s-gurae", "s-yangchon"]],
  everline: [["s-giheung", "s-gangnamdae", "s-jiseok", "s-eojeong", "s-dongbaek", "s-chodang", "s-samga", "s-yongin_city", "s-myeongjidae", "s-gimnyangjang", "s-undongjangsongdam", "s-gojin", "s-bopyeong", "s-dunjeon", "s-jeondae"]],
  uijeongbu: [["s-balgok", "s-hoeryong", "s-beomgol", "s-lrt_uijeongbu", "s-uijeongbu_city", "s-heungseong", "s-uijeongbu_center", "s-dongo", "s-saemal", "s-ggbuk", "s-hyoja", "s-gonje", "s-eoryong", "s-songsan_uj", "s-tapseok"]],
  incheon1: [["s-geomdan_hosu", "s-singeomdan", "s-ara", "s-gyeyang", "s-gyulhyeon", "s-bakchon", "s-imhak", "s-gyesan", "s-gyeongin", "s-jakjeon", "s-galsan", "s-bupyeong_gu", "s-bupyeong_market", "s-bupyeong", "s-dongsu", "s-bupyeong3", "s-ganseok5", "s-incheonsicheong", "s-yesulhoe", "s-incheon_terminal", "s-munhak", "s-seonhak", "s-sinyeonsu", "s-woninjae", "s-dongchun_ic", "s-dongmak", "s-campustown", "s-technopark", "s-jisik", "s-incheondae", "s-centralpark", "s-ibd", "s-songdo_light"]],
  incheon2: [["s-geomdan_oryu", "s-wanggil", "s-geomdan4", "s-majeon", "s-wanjeong", "s-dokjeong", "s-geomam", "s-geombawi", "s-asiad", "s-seogu", "s-gajeong", "s-gajeong_market", "s-seongnam_ic", "s-seobu_women", "s-incheon_gajwa", "s-gajaeul", "s-juan_ind", "s-juan", "s-siminpark", "s-seokbawi", "s-incheonsicheong", "s-seokcheon", "s-moraenae", "s-mansu", "s-namdong_gu", "s-incheondae_park", "s-unyeon"]],
};

