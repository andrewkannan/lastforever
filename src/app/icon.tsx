import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import path from 'path';

export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

export default function Icon() {
  const tulipData = readFileSync(path.join(process.cwd(), 'public', 'tulip-head.png'));
  const tulipSrc = `data:image/png;base64,${tulipData.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img src={tulipSrc} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
        <div style={{
          position: 'absolute',
          color: '#fbfaf6',
          fontSize: 180,
          fontFamily: 'serif',
          textShadow: '0px 4px 15px rgba(0,0,0,0.6)',
        }}>
          A&K
        </div>
      </div>
    ),
    { ...size }
  );
}
