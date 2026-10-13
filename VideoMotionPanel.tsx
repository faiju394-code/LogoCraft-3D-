import React, { useState, useRef, useEffect } from 'react';
import { LogoConfig, VideoMotionConfig } from '../../types/logo';
import { Video, Play, Pause, Film, Sliders, Music, Volume2, VolumeX, Trash2, AlertCircle, Check } from 'lucide-react';

interface VideoMotionPanelProps {
  config: LogoConfig;
  onChange: (updater: (prev: LogoConfig) => LogoConfig) => void;
}

export const VideoMotionPanel: React.FC<VideoMotionPanelProps> = ({ config, onChange }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const motionConfig = config.videoMotion || {
    enabled: false,
    startZoom: 1,
    endZoom: 1.5,
    panX: 0,
    panY: 0,
    duration: 5,
    easing: 'ease-in-out',
    transitionType: 'zoom',
    transitionDuration: 1,
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMsg('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMsg('Video file size must be under 100MB.');
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    onChange((prev) => ({
      ...prev,
      videoMotion: {
        ...(prev.videoMotion || motionConfig),
        enabled: true,
        videoUrl,
        videoFileName: file.name,
      },
    }));
    setSuccessMsg('Video imported successfully into timeline!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // ADD BACKGROUND MUSIC FROM PHONE
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg)$/i)) {
      setErrorMsg('Please select a valid audio file (MP3, WAV, M4A, AAC).');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setErrorMsg('Audio file size must be under 30MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioFileName(file.name);
    setSuccessMsg('Background music added successfully!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const updateMotion = (updater: (prev: VideoMotionConfig) => VideoMotionConfig) => {
    onChange((prev) => ({
      ...prev,
      videoMotion: updater(prev.videoMotion || motionConfig),
    }));
  };

  const toggleVideoPlayback = () => {
    if (!videoPreviewRef.current) return;
    if (isPlaying) {
      videoPreviewRef.current.pause();
      if (audioPreviewRef.current) audioPreviewRef.current.pause();
      setIsPlaying(false);
    } else {
      videoPreviewRef.current.play().then(() => {
        if (audioPreviewRef.current && audioUrl) {
          audioPreviewRef.current.currentTime = videoPreviewRef.current?.currentTime || 0;
          audioPreviewRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
      }).catch((err) => {
        setErrorMsg('Failed to play video preview: ' + err.message);
      });
    }
  };

  // Sync audio volume and mute
  useEffect(() => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.volume = isMuted ? 0 : audioVolume;
    }
  }, [audioVolume, isMuted]);

  return (
    <div className="space-y-5 pb-6">
      {/* Error / Success Banners */}
      {errorMsg && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl flex items-start gap-2 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 font-bold">×</button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Video Import Button */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>Video Import & Timeline</span>
          </label>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.onchange = (e: any) => handleVideoUpload(e);
            input.click();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Film className="w-4 h-4" />
          <span>Import Video Clip from Gallery</span>
        </button>

        {motionConfig.videoUrl && (
          <div className="space-y-3 pt-3 border-t border-slate-800/60">
            <div className="relative aspect-video rounded-xl bg-black overflow-hidden flex items-center justify-center border border-slate-800">
              <video
                ref={videoPreviewRef}
                src={motionConfig.videoUrl}
                className="w-full h-full object-contain"
                onEnded={() => {
                  setIsPlaying(false);
                  if (audioPreviewRef.current) audioPreviewRef.current.pause();
                }}
                loop
                playsInline
              />

              {/* Hidden Audio Element for Background Music */}
              {audioUrl && (
                <audio
                  ref={audioPreviewRef}
                  src={audioUrl}
                  loop
                />
              )}

              <button
                onClick={toggleVideoPlayback}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </div>
              </button>
            </div>
            <div className="text-[11px] text-slate-400 truncate text-center font-mono">
              {motionConfig.videoFileName || 'video-clip.mp4'}
            </div>
          </div>
        )}
      </div>

      {/* 2. ADD BACKGROUND MUSIC FROM PHONE (FEATURE 2) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span>Background Music (MP3, WAV, AAC)</span>
          </label>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'audio/*,.mp3,.wav,.m4a,.aac';
            input.onchange = (e: any) => handleAudioUpload(e);
            input.click();
          }}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
        >
          <Music className="w-4 h-4 text-amber-400" />
          <span>+ Add Music from Phone Storage</span>
        </button>

        {audioUrl && (
          <div className="space-y-3 pt-3 border-t border-slate-800/60">
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 truncate">
                <Music className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-200 truncate">{audioFileName || 'background-music.mp3'}</span>
              </div>
              <button
                onClick={() => {
                  setAudioUrl(null);
                  setAudioFileName(null);
                  if (audioPreviewRef.current) audioPreviewRef.current.pause();
                }}
                className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg"
                title="Remove Music"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Music Volume & Mute Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Music Volume</span>
                <span className="font-mono text-amber-400">{Math.round(audioVolume * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : audioVolume}
                  onChange={(e) => {
                    setAudioVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Keyframe Zoom & Motion Controls */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Start / End Zoom & Motion</span>
        </label>

        {/* Start Zoom */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Start Zoom Scale</span>
            <span className="font-mono text-amber-400">{motionConfig.startZoom}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={motionConfig.startZoom}
            onChange={(e) => updateMotion((prev) => ({ ...prev, startZoom: Number(e.target.value) }))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* End Zoom */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>End Zoom Scale</span>
            <span className="font-mono text-amber-400">{motionConfig.endZoom}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={motionConfig.endZoom}
            onChange={(e) => updateMotion((prev) => ({ ...prev, endZoom: Number(e.target.value) }))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Timeline Duration */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Animation Duration</span>
            <span className="font-mono text-amber-400">{motionConfig.duration}s</span>
          </div>
          <input
            type="range"
            min="2"
            max="15"
            value={motionConfig.duration}
            onChange={(e) => updateMotion((prev) => ({ ...prev, duration: Number(e.target.value) }))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
