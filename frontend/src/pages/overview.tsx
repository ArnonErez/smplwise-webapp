import React, { useState, useEffect } from "react";
import { SVG, Path, Container } from '@svgdotjs/svg.js';
import SolarEnergySystem from "../assets/diagrams/solar/solar_energy_system.svg";
import { Flex, Typography } from "antd";
import { useAuth } from "react-oidc-context";

interface FlowPath {
  label: string;
  direction: 'vertical' | 'horizontal';
  speed: 1 | 2 | 3 | 4;
  amount: 1 | 2 | 3 | 4;
  active: boolean;
  reverse?: boolean;
}

export const OverviewPage: React.FC = () => {
  
  const [flows] = useState<FlowPath[]>([
    {
      label: 'tube-panel-house',
      direction: 'vertical',
      speed: 4,
      amount: 1,
      active: true,
    },
    {
      label: 'tube-battery-house',
      direction: 'vertical',
      speed: 2,
      amount: 1,
      active: true,
    },
    {
      label: 'tube-house-powerline',
      direction: 'horizontal',
      speed: 1,
      amount: 3,
      active: true,
      reverse: true,
    }
  ]);

  const lightningPath = 'M3.5,0 L0,4 L2.5,4 L0,8 L7,3 L4,3 L6.5,0 Z';

  useEffect(() => {
    const svgElement = document.querySelector('#solar-energy-system');
    if (!svgElement) return;

    // Synchronize IDs with labels
    const elements = svgElement.querySelectorAll('[inkscape\\:label]');
    elements.forEach(element => {
      const label = element.getAttribute('inkscape:label');
      if (label) element.id = label;
    });

    const draw = SVG(svgElement) as Container;
    const animations: { stop: () => void }[] = [];

    const baseDuration = 2000;

    flows.forEach(flow => {
      const tubeGroup = draw.find(`g#${flow.label}`)[0] as Container;
      const tubePath = tubeGroup?.find('.tube-path')[0] as Path;
      
      if (!tubePath || !flow.active) return;

      // Get the clip path ID from the group
      const clipPathUrl = tubeGroup.attr('clip-path');
      const clipPathId = clipPathUrl?.match(/url\(#(.*?)\)/)?.[1];

      const duration = baseDuration / flow.speed;
      const interval = duration / flow.amount;

      const startAnimation = () => {
        const circle = draw.circle(8)
          .fill('#00ff00')
          .center(0, 0);

        const lightning = draw.path(lightningPath)
          .fill('#ffeb3b')  // Yellow color
          .stroke({ color: '#fdd835', width: 0.5 })  // Slightly darker yellow outline
          .size(8, 8)  // Set size similar to previous circle
          .center(0, 0);

        if (flow.reverse) {
          const endPoint = tubePath.pointAt(tubePath.length());
          // console.log(endPoint);
          circle.center(endPoint.x, endPoint.y);
        }

        if (clipPathId) {
          circle.attr('clip-path', `url(#${clipPathId})`);
        }

        tubeGroup.add(circle);

        // Fixed duration of 2000ms for all animations
        circle.animate(duration).during((pos: number) => {
          const position = flow.reverse ? 1 - pos : pos;
          const point = tubePath.pointAt(position * tubePath.length());
          circle.center(point.x, point.y);
        }).after(() => {
          circle.remove();
        });
      };

      // Interval based on speed level
      const intervalId = setInterval(startAnimation, interval);
      startAnimation(); // Start first animation immediately

      animations.push({
        stop: () => {
          clearInterval(intervalId);
          draw.find('circle').forEach(circle => circle.remove());
        }
      });
    });

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [flows]);

  // const user = useOidcUser();
  // console.log("user", user);

  // const { data: session } = useGetIdentity<IUserSession>();
  // console.log("session (overview)", session);

  return (
    <Flex 
      justify="center"
      align="center"
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        {/* <SolarEnergySystem /> */}
        <Typography.Title level={2}>Welcome to SmplWise</Typography.Title>
      </div>
    </Flex>
  );
};