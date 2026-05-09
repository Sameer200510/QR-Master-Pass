import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ShieldCheck, Zap } from 'lucide-react';

export default function Generator() {
  const qrRef = useRef(null);
  
  // Custom URI scheme so normal phone cameras won't know how to open it
  // It will try to open an app that doesn't exist, protecting the QR from generic scanning
  const masterPayload = "msauth://secure-gate/master-pass-2026-X9F2K";

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    // Create a Blob from the SVG data
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      // Create canvas with enough space for border and padding
      canvas.width = img.width + 60;
      canvas.height = img.height + 60;
      
      // Draw white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw red border
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 16;
      ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
      
      // Draw QR code
      ctx.drawImage(img, 30, 30);
      
      // Add "MS" text
      ctx.fillStyle = "white";
      ctx.fillRect(canvas.width - 60, canvas.height - 50, 45, 35);
      
      ctx.font = "bold 32px Outfit, sans-serif";
      ctx.fillStyle = "black";
      ctx.fillText("MS", canvas.width - 55, canvas.height - 23);
      
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "MS_Master_Pass.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem 0' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.5rem 1rem', borderRadius: '99px', 
          background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
          fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
          marginBottom: '1rem'
        }}>
          <ShieldCheck size={14} /> Official Master Gate
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>
          The Master Pass
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.5 }}>
          This single QR code grants unlimited entry. Display it at the gate or print it out.
        </p>
      </div>

      <div className="card animate-slide-up" style={{ 
        padding: '2.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '2rem',
        borderRadius: '2rem'
      }}>
        <div ref={qrRef} className="qr-master-wrapper">
          <div className="qr-master-border"></div>
          <QRCodeSVG 
            value={masterPayload}
            size={240}
            level={"H"}
            includeMargin={true}
            style={{ display: 'block' }}
          />
          <div className="qr-master-ms">MS</div>
        </div>

        <button onClick={downloadQR} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
          <Download size={20} /> Download Master QR
        </button>
      </div>

    </div>
  );
}
