import React from 'react';
import SmplWiseLogo from '../assets/smplwise_logo.svg';
import SmplWiseIcon from '../assets/smplwise_icon.svg';
import partnerLogo from '../assets/cyber_hive_logo.png';
import { Image } from 'antd';
import { GrafanaService } from '../services/GrafanaService';
import { grafanaConfig } from '../config';

interface LogoProps {
  type?: 'smplwise' | 'smplwise-icon' | 'partner' | 'client';
  clientId?: string;
  color?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ 
  type = 'smplwise',
  clientId,
  color = '#ffffff',
  style,
}) => {
  const [clientLogoUrl, setClientLogoUrl] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   if (type === 'client' && clientId) {
  //     getClientLogo(clientId).then(url => {
  //       if (url) setClientLogoUrl(url.toString());
  //     });
  //   }
  // }, [type, clientId]);

  if (type === 'smplwise' || type === 'smplwise-icon') {
    return (
      <div style={{ color, ...style }}>
        {type === 'smplwise' ? <SmplWiseLogo /> : <SmplWiseIcon />}
      </div>
    );
  }

  return (
    <Image
      src={type === 'partner' ? partnerLogo : clientLogoUrl || ''}
      alt={`${type} logo`}
      preview={false}
      style={style}
    />
  );
}; 