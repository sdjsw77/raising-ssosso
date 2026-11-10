import { useState } from "react";

interface SaveModalProps {
  open: boolean;
  day: number;
  onReset: () => void;
  onExport: () => string;
  onImport: (json: string) => boolean;
  onClose: () => void;
}

export default function SaveModal({
  open,
  day,
  onReset,
  onExport,
  onImport,
  onClose,
}: SaveModalProps) {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    const json = onExport();
    navigator.clipboard?.writeText?.(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    const ok = onImport(importText.trim());
    if (ok) {
      setImportText("");
      setImportError(false);
      onClose();
    } else {
      setImportError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="princess-card max-w-md w-full p-5 sm:p-6 my-auto text-left relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="text-3xl">💾</span>
            <h2 className="font-display text-xl text-pink-950 mt-1">저장 & 불러오기</h2>
            <p className="text-xs text-pink-500">
              선택마다 자동 저장됩니다 (현재: Day {day})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-pink-400 hover:text-pink-700 text-xl font-bold p-1 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Auto save note */}
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 mb-3 flex items-center gap-2">
          <span>✅</span>
          <span>브라우저 새로고침이나 재방문 시에도 언제나 이어서 플레이할 수 있어요.</span>
        </div>

        {/* Export */}
        <div className="mb-3">
          <div className="text-xs font-bold text-pink-800 mb-1">
            저장 데이터 백업 (남자친구/여자친구와 공유 가능)
          </div>
          <button
            onClick={handleCopy}
            className="princess-btn-secondary w-full py-2 rounded-full text-xs font-bold"
          >
            {copied ? "클립보드에 복사 완료! 💖" : "세이브 데이터 복사하기 📋"}
          </button>
        </div>

        {/* Import */}
        <div className="mb-3">
          <div className="text-xs font-bold text-pink-800 mb-1">데이터 불러오기</div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="복사해둔 세이브 데이터를 여기에 붙여넣으세요"
            rows={3}
            className="w-full p-2.5 rounded-xl text-xs border border-pink-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 font-mono resize-none mb-1.5"
          />
          {importError && (
            <div className="text-[11px] text-rose-600 mb-1">
              올바른 세이브 데이터가 아닙니다.
            </div>
          )}
          <button
            onClick={handleImport}
            disabled={!importText.trim()}
            className="princess-btn-secondary w-full py-2 rounded-full text-xs font-bold disabled:opacity-50"
          >
            이어서 하기 📥
          </button>
        </div>

        {/* Reset */}
        <div className="pt-2 border-t border-pink-200">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline w-full text-center py-1"
            >
              처음부터 새로 시작 (초기화)
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center text-xs">
              <p className="text-rose-800 font-bold mb-2">
                정말 처음부터 다시 시작할까요? 현재 기록이 모두 지워집니다.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    onReset();
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white"
                >
                  초기화 확인
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="princess-btn-secondary px-4 py-1.5 rounded-full text-xs"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
