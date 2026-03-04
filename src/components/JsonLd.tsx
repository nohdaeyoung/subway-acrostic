const BASE_URL = "https://m.324.ing";

export function WebAppJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "지하철 N행시",
    url: BASE_URL,
    description:
      "서울·부산 지하철역 이름으로 N행시(삼행시·사행시)를 작성하고 노선도 위에서 열람하는 웹 서비스",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web Browser",
    inLanguage: "ko",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    author: {
      "@type": "Organization",
      name: "지하철 N행시",
      url: BASE_URL,
    },
    about: [
      { "@type": "Thing", name: "N행시" },
      { "@type": "Thing", name: "지하철" },
      { "@type": "Thing", name: "서울 지하철" },
      { "@type": "Thing", name: "부산 지하철" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "N행시란 무엇인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "N행시는 주어진 단어의 각 글자(음절)로 시작하는 문장을 만드는 한국의 언어 유희입니다. 예를 들어 '강남'으로 삼행시를 지으면 '강'으로 시작하는 문장과 '남'으로 시작하는 문장 두 줄을 만듭니다. 영어의 Acrostic Poetry와 유사합니다.",
        },
      },
      {
        "@type": "Question",
        name: "지하철 N행시는 어떻게 사용하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "지도 뷰 또는 목록 뷰에서 원하는 지하철역을 클릭하면 해당 역 이름으로 작성된 N행시를 바로 볼 수 있습니다. 서울과 부산의 700개 이상 역을 지원합니다.",
        },
      },
      {
        "@type": "Question",
        name: "직접 N행시를 작성하거나 수정할 수 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "현재는 관리자 계정으로 로그인해야 N행시를 직접 작성하거나 수정할 수 있습니다. 관리자 버튼을 눌러 로그인 후 역을 클릭하면 편집 기능이 활성화됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "서울과 부산 외에 다른 도시도 지원하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "현재는 서울 수도권(1~9호선 및 신분당선·경의중앙선·GTX-A 등 22개 이상 노선)과 부산 지하철(1~4호선 및 동해선)을 지원합니다. 향후 대구·광주·대전 등 다른 도시도 추가할 예정입니다.",
        },
      },
      {
        "@type": "Question",
        name: "N행시 데이터는 어디에 저장되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "현재 N행시 데이터는 시딩 데이터와 함께 브라우저 로컬스토리지에 저장됩니다. 서버 기반 저장소로의 전환을 검토하고 있습니다.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
