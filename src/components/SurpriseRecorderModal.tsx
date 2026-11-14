import React from 'react';
import {
  CheckCircle2,
  Download,
  Loader2,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import { RecorderStatus } from '../hooks/useSurpriseRecorder';

interface SurpriseRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: RecorderStatus;
  recordedBlob: Blob | null;
  recordedFileName: string;
  previewUrl: string | null;
  onDownloadCopy: () => void;
  onResetRecorder: () => void;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const SurpriseRecorderModal: React.FC<SurpriseRecorderModalProps> = ({
  isOpen,
  onClose,
  status,
  recordedBlob,
  recordedFileName,
  previewUrl,
  onDownloadCopy,
  onResetRecorder,
}) => {
  if (!isOpen) return null;

  const fileSizeMb = recordedBlob ? (recordedBlob.size / (1024 * 1024)).toFixed(1) : '0.0';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recorder-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 backdrop-blur-md p-3.5 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-emerald-400/40 bg-gradient-to-b from-[#120d26] via-[#0b0e20] to-[#050714] text-white p-5 sm:p-6 shadow-[0_20px_70px_rgba(16,185,129,0.28)]">
        <button
          type="button"
          onClick={onClose}
          disabled={status === 'stopping'}
          aria-label="Close video preview"
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition cursor-pointer disabled:opacity-40"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-rose-500/30 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h2 id="recorder-modal-title" className="font-syne text-sm sm:text-base font-bold text-emerald-100">
              Saved Surprise Video
            </h2>
            <p className="text-[11px] text-zinc-400">
              Video + Audio Recording
            </p>
          </div>
        </div>

        {status === 'stopping' && (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm font-semibold text-zinc-200">
              ভিডিও সেভ ও ডাউনলোড প্রস্তুত হচ্ছে...
            </p>
          </div>
        )}

        {status === 'saved' && previewUrl && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-950/40 p-3 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-100 leading-relaxed font-sans-ui space-y-1">
                <p>ভিডিওটি সফলভাবে আপনার ডিভাইসে ডাউনলোড এবং লোকাল স্টোরেজে সেভ হয়েছে!</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/15 bg-black">
              <video
                src={previewUrl}
                controls
                playsInline
                className="w-full max-h-52 object-contain bg-black"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
              <span className="truncate max-w-[70%]">{recordedFileName}</span>
              <span className="font-semibold text-zinc-200">{fileSizeMb} MB</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDownloadCopy}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-extrabold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download MP4 Again</span>
              </button>
              <button
                type="button"
                onClick={onResetRecorder}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-rose-500/20 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-rose-200 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
