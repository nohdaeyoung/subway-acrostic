"use client";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                 flex items-center gap-2 px-4 py-2.5
                 bg-gray-900 text-white text-sm rounded-full shadow-lg
                 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7l3.5 3.5L12 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {message}
    </div>
  );
}
