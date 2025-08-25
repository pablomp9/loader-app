import React, { useEffect } from 'react';

const SidebarAd = ({ adSlot, className = '' }) => {
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
    <div className={`sidebar-ad ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-488264623350466"
        data-ad-slot={adSlot}
        data-ad-format="vertical"
        data-full-width-responsive="false"
      />
    </div>
  );
};

export default SidebarAd;
