import React from 'react';
import { useBandData } from '../contexts/AdminContext';

const TrackingCodes = () => {
  const bandData = useBandData();
  const tracking = bandData?.band?.tracking;

  if (!tracking) return null;

  return (
    <>
      {/* Meta Pixel Code */}
      {tracking.metaPixelCode && tracking.metaPixelCode.trim() && (
        <div 
          dangerouslySetInnerHTML={{ 
            __html: tracking.metaPixelCode 
          }} 
        />
      )}

      {/* Google Tag Manager Code */}
      {tracking.googleTagManagerCode && tracking.googleTagManagerCode.trim() && (
        <div 
          dangerouslySetInnerHTML={{ 
            __html: tracking.googleTagManagerCode 
          }} 
        />
      )}

      {/* Google Tag Manager NoScript (for GTM body tag) */}
      {tracking.googleTagManagerCode && 
       tracking.googleTagManagerCode.includes('GTM-') && (
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${
              tracking.googleTagManagerCode.match(/GTM-[A-Z0-9]+/)?.[0] || ''
            }`}
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
    </>
  );
};

export default TrackingCodes;