import { generate, redDark } from '@ant-design/colors';
import { ConfigProvider, theme } from "antd";
import type { ThemeConfig } from 'antd';
import type { AliasToken } from 'antd/es/theme/internal';
import {
  type PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

// Base colors from your current setup
const baseColors = {
  primary: '#EF5200',
  background: '#393939',
  componentBackground: '#FA802A',
  success: '#17b64e',
  error: '#e87779',
  warning: '#dc8111',
};

// Generate color palette
const palette = {
  dark:{
    primary: generate(baseColors.primary),
    background: generate(baseColors.background, {theme: "dark"}),
    componentBackground: generate(baseColors.componentBackground),
    success: generate(baseColors.success),
    error: generate(baseColors.error),
    warning: generate(baseColors.warning),
},
  light: {
    primary: generate(baseColors.primary),
    background: generate("#cfcfcf"),
    componentBackground: generate(baseColors.componentBackground),
    success: generate(baseColors.success),
    error: generate(baseColors.error),
    warning: generate(baseColors.warning),
  }
};

const darkTheme = {
  token: {
    // Base colors
    colorPrimary: baseColors.primary,
    colorSuccess: baseColors.success,
    colorError: baseColors.error,
    colorWarning: baseColors.warning,
    colorInfo: palette.dark.primary[4],
    colorPrimaryBg: palette.dark.primary[9],
    colorBgContainer: palette.dark.background[1],
    colorBgBase: palette.dark.background[0],
    colorBgLayout: palette.dark.background[2],
    colorBgElevated: palette.dark.background[3],
    colorBgSpotlight: palette.dark.background[5],
    colorBorder: palette.dark.background[9],
    colorBorderSecondary: palette.dark.background[8],
    colorLink: palette.dark.warning[0],
    colorTextBase: '#ffffff',
    
    // Component specific
    // contentPadding: 8,
    sidebarWidth: 200,
  },
  components: {
    Layout: {
      headerBg: palette.dark.primary[5],
      headerHeight: 48,
      // contentPadding: 8,
      siderBg: palette.dark.background[2],
      triggerBg: palette.dark.background[2],
      triggerColor: '#ffffff',
      triggerHoverBg: palette.dark.primary[8],
      triggerBorderColor: palette.dark.primary[0],
      bodyBg: palette.dark.background[1],
      // modalBg: palette.dark.background[4],
    },
    Menu: {
      collapsedWidth: 50,
      darkItemBg: palette.dark.background[4],
      darkItemSelectedBg: palette.dark.primary[4],
      darkItemHoverBg: palette.dark.primary[5],
      darkExpandIconColor: '#ffffff',
      darkItemColor: '#ffffff',
      darkItemSelectedColor: '#ffffff',
      darkItemFontWeight: 600,
      darkSubMenuItemBg: palette.dark.primary[4],
      darkSubMenuItemSelectedBg: palette.dark.primary[6],
      darkSubMenuItemHoverBg: palette.dark.primary[5],
      darkSubMenuItemColor: '#000000',
      darkSubMenuItemSelectedColor: '#000000',
      darkSubMenuItemHoverColor: '#000000',
      darkPopupBg: palette.dark.background[3],

      horizontalMenuHeight: 38,
    },
    Button: {
      colorPrimary: palette.dark.primary[6],
      colorPrimaryHover: palette.dark.primary[5],
      colorPrimaryActive: palette.dark.primary[4],
      colorLink: palette.dark.warning[5],
    },
    Tabs: {
      colorPrimary: palette.dark.primary[3],
      colorPrimaryHover: palette.dark.primary[5],
      margin: 0,
    },
  }
};

const lightTheme = {
  token: {
    // Base colors
    colorPrimary: baseColors.primary,
    colorSuccess: baseColors.success,
    colorError: baseColors.error,
    colorWarning: baseColors.warning,
    colorInfo: palette.light.primary[4],
    colorPrimaryBg: palette.light.primary[1],
    colorBgContainer: palette.light.background[1],
    colorBgBase: palette.light. background[4],
    colorBgLayout: palette.light.background[5],
    colorBgElevated: palette.light.background[6],
    colorBgSpotlight: palette.light.background[5],
    colorBorder: palette.light.background[6],
    colorBorderSecondary: palette.light.background[5],
    colorLink: palette.light.warning[9],
    colorTextBase: '#000000',
    
    // Component specific
    contentPadding: 8,
    sidebarWidth: 200,
    sidebarCollapsedWidth: 80,
  },
  components: {
    Layout: {
      headerBg: palette.light.primary[5],
      headerHeight: 48,
      // contentPadding: 8,
      siderBg: palette.light.background[2],
      triggerBg: palette.light.background[2],
      triggerColor: '#000000',
      triggerHoverBg: palette.light.background[8],
      triggerBorderColor: palette.light.background[0],
      bodyBg: palette.light.background[0], // #F77867
    },
    Menu: {
      darkItemBg: palette.light.background[3],
      darkItemSelectedBg: palette.light.primary[4],
      darkItemHoverBg: palette.light.primary[5],
      darkExpandIconColor: '#000000',
      darkItemColor: '#000000',
      darkItemSelectedColor: '#000000',
      darkItemHoverColor: '#000000',
      darkSubMenuItemBg: palette.light.background[3],
      darkSubMenuItemSelectedBg: palette.light.background[4],
      darkSubMenuItemHoverBg: palette.light.primary[5],
      darkPopupBg: palette.light.background[3],
      
    },
    Button: {
      colorPrimary: palette.light.primary[6],
      colorPrimaryHover: palette.light.primary[5],
      colorPrimaryActive: palette.light.primary[4],
      colorLink: palette.light.warning[5],
    },
    Tabs: {
      colorPrimary: palette.light.primary[3],
      colorPrimaryHover: palette.light.primary[5],
      margin: 0,
    },
  }
};

type ColorModeContextType = {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'dark',
  setMode: () => undefined,
});

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const colorModeFromLocalStorage = localStorage.getItem("colorMode") as 'light' | 'dark';
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState<'light' | 'dark'>(
    colorModeFromLocalStorage || systemPreference
  );

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  const { darkAlgorithm, defaultAlgorithm } = theme;

  return (
    <ColorModeContext.Provider value={{ mode, setMode }}>
      <ConfigProvider
        theme={{
          token: mode === "light" ? lightTheme.token : darkTheme.token,
          // token: darkTheme.token,
          components: mode === "light" ? lightTheme.components : darkTheme.components,
          // algorithm: darkAlgorithm,
          algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};
