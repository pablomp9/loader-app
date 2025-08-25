import React, { useEffect } from 'react';

const BannerAd = ({ adSlot, adFormat = 'auto', className = '' }) => {
  useEffect(() => {
    // Push the ad to Google AdSense
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.log('AdSense error:', error);
      }
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-488264623350466"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default BannerAd;
