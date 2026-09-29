import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImg, setCapturedImg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImg(null);
      setErrorMsg(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setErrorMsg('Unable to access camera. Please check permissions or upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImg(dataUrl);
    }
  };

  const handleConfirm = () => {
    if (capturedImg) {
      onCapture(capturedImg);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Camera className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Capture Problem Photo</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg ? (
          <div className="my-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            {errorMsg}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-slate-950">
            {!capturedImg ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-72 w-full object-cover"
              />
            ) : (
              <img
                src={capturedImg}
                alt="Captured snapshot"
                className="h-72 w-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        <div className="mt-5 flex items-center justify-end space-x-3">
          {capturedImg ? (
            <>
              <button
                type="button"
                onClick={() => setCapturedImg(null)}
                className="inline-flex items-center space-x-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
              >
                <Check className="h-4 w-4" />
                <span>Use Photo</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!!errorMsg}
              onClick={handleTakeSnapshot}
              className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Camera className="h-5 w-5" />
              <span>Capture Photo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
