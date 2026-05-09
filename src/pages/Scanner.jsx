import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { ScanLine, ShieldCheck, XCircle, RefreshCw, CameraOff } from 'lucide-react';

export default function Scanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  
  const [status, setStatus] = useState('scanning'); // scanning, success, denied, no-camera
  
  const masterPayload = "msauth://secure-gate/master-pass-2026-X9F2K";

  useEffect(() => {
    initCamera();
    return () => stopCamera();
  }, []);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStatus('scanning');
      }
    } catch (err) {
      console.error(err);
      setStatus('no-camera');
    }
  };

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
  };

  const onVideoReady = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(scanFrame);
  };

  const scanFrame = () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c || v.readyState < v.HAVE_ENOUGH_DATA) {
      if (status === 'scanning') {
        rafRef.current = requestAnimationFrame(scanFrame);
      }
      return;
    }

    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    
    const code = jsQR(imgData.data, imgData.width, imgData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code && code.data) {
      handleScan(code.data);
    } else {
      if (status === 'scanning') {
        rafRef.current = requestAnimationFrame(scanFrame);
      }
    }
  };

  const handleScan = (data) => {
    if (data === masterPayload) {
      setStatus('success');
      playSuccessSound();
    } else {
      setStatus('denied');
      playErrorSound();
    }
  };

  const resetScanner = () => {
    setStatus('scanning');
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(scanFrame);
  };

  const playSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
      g.gain.setValueAtTime(0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  };

  const playErrorSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Gate Scanner</h2>
        <p style={{ color: 'var(--text-muted)' }}>Point camera at the QR code</p>
      </div>

      <div className="scanner-container">
        
        {status === 'scanning' && (
          <div className="scan-overlay">
            <div className="scan-box">
              <div className="scan-box-bottom-left"></div>
              <div className="scan-box-bottom-right"></div>
              <div className="scan-line"></div>
            </div>
          </div>
        )}

        <video 
          ref={videoRef} 
          onLoadedData={onVideoReady}
          style={{ width: '100%', display: status === 'no-camera' ? 'none' : 'block', background: '#000', aspectRatio: '3/4', objectFit: 'cover' }}
          playsInline
          muted
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {status === 'no-camera' && (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--surface)' }}>
            <CameraOff size={48} color="var(--brand)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Camera Denied</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please allow camera access to scan passes.</p>
            <button onClick={initCamera} className="btn btn-primary">Try Again</button>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-slide-up" style={{ 
            position: 'absolute', inset: 0, 
            background: 'rgba(16, 185, 129, 0.95)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white'
          }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', background: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem', color: '#10b981',
              boxShadow: '0 0 40px rgba(255,255,255,0.4)'
            }}>
              <ShieldCheck size={48} />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>GRANTED</h2>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, opacity: 0.9, marginBottom: '2rem' }}>Entry Allowed</p>
            <button onClick={resetScanner} className="btn" style={{ background: 'white', color: '#10b981' }}>
              <ScanLine size={18} /> Scan Next
            </button>
          </div>
        )}

        {status === 'denied' && (
          <div className="animate-slide-up" style={{ 
            position: 'absolute', inset: 0, 
            background: 'rgba(239, 68, 68, 0.95)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white'
          }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', background: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem', color: '#ef4444',
              boxShadow: '0 0 40px rgba(255,255,255,0.4)'
            }}>
              <XCircle size={48} />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>DENIED</h2>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, opacity: 0.9, marginBottom: '2rem' }}>Invalid QR Code</p>
            <button onClick={resetScanner} className="btn" style={{ background: 'white', color: '#ef4444' }}>
              <RefreshCw size={18} /> Try Again
            </button>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: status === 'scanning' ? 'var(--brand)' : 'var(--border)' }}></div>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: status === 'success' ? '#10b981' : 'var(--border)' }}></div>
      </div>
    </div>
  );
}
