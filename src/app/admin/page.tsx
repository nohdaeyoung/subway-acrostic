"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import {
  getAdminSettings,
  saveAdminSettings,
  type AdminSettings,
} from "@/lib/admin-settings";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    googleVerification: "",
    naverVerification: "",
    googleAnalyticsId: "",
    customHead: "",
    customBody: "",
  });
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/");
      return;
    }
    setSettings(getAdminSettings());
    setReady(true);
  }, [router]);

  if (!ready) return null;

  function handleChange(key: keyof AdminSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    saveAdminSettings(settings);
    // Set verification cookies for SSR meta tag generation (1 year)
    const maxAge = 365 * 24 * 3600;
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `g_verify=${encodeURIComponent(settings.googleVerification)}; path=/; max-age=${maxAge}; SameSite=Strict${secure}`;
    document.cookie = `n_verify=${encodeURIComponent(settings.naverVerification)}; path=/; max-age=${maxAge}; SameSite=Strict${secure}`;
    setSaved(true);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
  }

  const inputCls =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300:ring-gray-500";

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">관리자 설정</h1>
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700:text-gray-200">
            ← 홈으로
          </a>
        </div>

        <div className="space-y-5">
          {/* 검색 도구 인증 */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              검색 도구 인증
            </h2>

            {/* 원인 설명 */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-800 leading-relaxed">
              <p className="font-semibold mb-1">⚠️ 왜 크롤러가 인식하지 못하나요?</p>
              <p>Google·Naver 크롤러는 <strong>브라우저 쿠키나 localStorage를 사용하지 않습니다.</strong> 크롤러가 페이지를 요청할 때 이미 HTML 안에 meta 태그가 있어야 합니다.</p>
            </div>

            {/* 해결 방법 */}
            <div className="bg-gray-50 rounded-lg p-4 text-xs space-y-3">
              <p className="font-semibold text-gray-700">✅ 해결 방법: Vercel 환경변수 설정</p>
              <ol className="list-decimal ml-4 space-y-2 text-gray-600">
                <li>
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 underline">Vercel Dashboard</a>
                  {" → 프로젝트 → Settings → Environment Variables"}
                </li>
                <li>아래 값을 추가하고 <strong>Save</strong></li>
                <li>Deployments 탭에서 <strong>Redeploy</strong> 실행</li>
              </ol>

              <div className="space-y-2 mt-1">
                <div>
                  <p className="text-gray-500 mb-1">Google Search Console</p>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-1.5 font-mono">
                    <span className="text-blue-700 font-semibold">GOOGLE_SITE_VERIFICATION</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-gray-600 truncate">
                      {settings.googleVerification || <em className="text-gray-400 not-italic">아래 필드에 코드 입력</em>}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">네이버 서치어드바이저</p>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-1.5 font-mono">
                    <span className="text-green-700 font-semibold">NAVER_SITE_VERIFICATION</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-gray-600 truncate">
                      {settings.naverVerification || <em className="text-gray-400 not-italic">아래 필드에 코드 입력</em>}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 코드 입력 필드 */}
            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Google 인증 코드 <span className="text-gray-400">(content 값만)</span>
                </label>
                <input
                  type="text"
                  value={settings.googleVerification}
                  onChange={(e) => handleChange("googleVerification", e.target.value)}
                  placeholder="예: AbCdEf1234567890abcdef..."
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  네이버 인증 코드 <span className="text-gray-400">(content 값만)</span>
                </label>
                <input
                  type="text"
                  value={settings.naverVerification}
                  onChange={(e) => handleChange("naverVerification", e.target.value)}
                  placeholder="예: AbCdEf1234567890abcdef..."
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          {/* 애널리틱스 */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              애널리틱스
            </h2>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Google Analytics 4 측정 ID
              </label>
              <input
                type="text"
                value={settings.googleAnalyticsId}
                onChange={(e) =>
                  handleChange("googleAnalyticsId", e.target.value)
                }
                placeholder="예: G-XXXXXXXXXX"
                className={inputCls}
              />
              <p className="text-xs text-gray-400 mt-1">
                GA4 스트림의 측정 ID를 입력하세요. 저장 후 페이지 새로고침 시
                gtag 스크립트가 삽입됩니다.
              </p>
            </div>
          </section>

          {/* 커스텀 코드 */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              커스텀 코드 삽입
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  &lt;head&gt; 삽입 코드
                </label>
                <textarea
                  value={settings.customHead}
                  onChange={(e) => handleChange("customHead", e.target.value)}
                  rows={5}
                  placeholder={"<script>...</script>\n<meta ...>"}
                  className={`${inputCls} font-mono resize-y`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  &lt;body&gt; 상단 삽입 코드
                </label>
                <textarea
                  value={settings.customBody}
                  onChange={(e) => handleChange("customBody", e.target.value)}
                  rows={5}
                  placeholder={"<noscript>...</noscript>"}
                  className={`${inputCls} font-mono resize-y`}
                />
              </div>
            </div>
          </section>

          {/* 저장 */}
          <div className="flex items-center gap-3 pb-6">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700:bg-gray-200 transition-colors"
            >
              {saved ? "저장됨 ✓" : "저장"}
            </button>
            <button
              onClick={() => setSettings(getAdminSettings())}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700:text-gray-200 transition-colors"
            >
              되돌리기
            </button>
            <p className="text-xs text-gray-400">
              저장 후 페이지 새로고침 시 적용됩니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
