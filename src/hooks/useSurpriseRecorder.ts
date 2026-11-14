import { useCallback, useEffect, useRef, useState } from 'react';
import {
  saveVideoToLocalDeviceStorage,
  triggerBrowserVideoDownload,
} from '../utils/localVideoStorage';

export type RecorderStatus =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'stopping'
  | 'saved'
  | 'error';

function pickSupportedMimeType(): { mimeType: string; ext: string } {
  if (typeof MediaRecorder === 'undefined') {
    return { mimeType: '', ext: 'mp4' };
  }
  const candidates = [
    { mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', ext: 'mp4' },
    { mimeType: 'video/mp4;codecs=avc1,mp4a.40.2', ext: 'mp4' },
    { mimeType: 'video/mp4;codecs=h264,aac', ext: 'mp4' },
    { mimeType: 'video/mp4', ext: 'mp4' },
    { mimeType: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { mimeType: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { mimeType: 'video/webm', ext: 'webm' },
  ];
  for (const item of candidates) {
    if (MediaRecorder.isTypeSupported(item.mimeType)) {
      return item;
    }
  }
  return { mimeType: '', ext: 'mp4' };
}

function buildFileName(ext: string): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(
    now.getHours()
  )}-${pad(now.getMinutes())}`;
  return `Purbasha_Birthday_Surprise_${stamp}.${ext}`;
}

export function useSurpriseRecorder() {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedFileName, setRecordedFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const camStreamRef = useRef<MediaStream | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);

  const cleanupStreams = useCallback(() => {
    if (elapsedTimerRef.current !== null) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
    if (camStreamRef.current) {
      camStreamRef.current.getTracks().forEach((t) => t.stop());
      camStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupStreams();
    };
  }, [cleanupStreams]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const stopRecording = useCallback(() => {
    setAutoSaveCountdown(null);
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      cleanupStreams();
      return;
    }
    setStatus('stopping');
    try {
      recorder.stop();
    } catch {
      cleanupStreams();
      setStatus('error');
      setErrorMessage('রেকর্ডিং সম্পন্ন করতে সমস্যা হয়েছে।');
    }
  }, [cleanupStreams]);

  const startRecording = useCallback(async () => {
    setErrorMessage(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      setErrorMessage('আপনার ব্রাউজারে ক্যামেরা ও মাইক্রোফোন রেকর্ডিং সাপোর্ট করছে না।');
      return;
    }

    setStatus('requesting');

    let camStream: MediaStream;
    try {
      camStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      setStatus('error');
      setErrorMessage(
        'ভিডিও ও সাউন্ড সেভ করার জন্য Camera এবং Microphone পারমিশন Allow করা জরুরি।'
      );
      return;
    }

    try {
      camStreamRef.current = camStream;

      const { mimeType, ext } = pickSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(camStream, {
            mimeType,
            videoBitsPerSecond: 900_000,
          })
        : new MediaRecorder(camStream);

      chunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const resolvedMime = mimeType || recorder.mimeType || 'video/mp4';
        const resolvedExt = resolvedMime.includes('webm') ? 'webm' : ext;
        const blob = new Blob(chunksRef.current, { type: resolvedMime });
        const fileName = buildFileName(resolvedExt);

        cleanupStreams();

        // Save in browser local storage (IndexedDB + localStorage metadata) & trigger MP4 download
        await saveVideoToLocalDeviceStorage(blob, fileName);
        const objectUrl = triggerBrowserVideoDownload(blob, fileName);

        setRecordedBlob(blob);
        setRecordedFileName(fileName);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return objectUrl;
        });
        setStatus('saved');
        setShowSavedToast(true);
      };

      recorder.start(1000);
      setElapsedSeconds(0);
      setAutoSaveCountdown(null);
      setShowSavedToast(false);
      setErrorMessage(null);
      setStatus('recording');
      setIsModalOpen(false);

      elapsedTimerRef.current = window.setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } catch {
      camStream.getTracks().forEach((t) => t.stop());
      setStatus('error');
      setErrorMessage('রেকর্ডিং শুরু করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  }, [cleanupStreams]);

  const downloadSavedCopy = useCallback(() => {
    if (!recordedBlob) return;
    triggerBrowserVideoDownload(
      recordedBlob,
      recordedFileName || buildFileName('mp4')
    );
  }, [recordedBlob, recordedFileName]);

  const resetRecorder = useCallback(() => {
    setRecordedBlob(null);
    setRecordedFileName('');
    setShowSavedToast(false);
    setAutoSaveCountdown(null);
    setErrorMessage(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setStatus('idle');
    setIsModalOpen(false);
  }, []);

  return {
    status,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    showSavedToast,
    dismissSavedToast: () => setShowSavedToast(false),
    elapsedSeconds,
    autoSaveCountdown,
    setAutoSaveCountdown,
    errorMessage,
    recordedBlob,
    recordedFileName,
    previewUrl,
    startRecording,
    stopRecording,
    downloadSavedCopy,
    resetRecorder,
  };
}
