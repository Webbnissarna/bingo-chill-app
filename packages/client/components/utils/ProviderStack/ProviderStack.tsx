import DefaultServiceRegistryProvider from "@/services/ServiceRegistry/ServiceRegistryContext";
import { nordThemeColors } from "@webbnissarna/bingo-chill-common/src/utils/theme";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";

export interface ProviderStackProps {
  children: ReactNode;
}

export default function ProviderStack({
  children,
}: ProviderStackProps): JSX.Element {
  return (
    <DefaultServiceRegistryProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: nordThemeColors.frost[3],
          },
          components: {
            Upload: {
              actionsColor: "#f00",
              colorBgMask: "#ff0",
              colorBorder: nordThemeColors.polarNight[3],
              colorFillAlter: nordThemeColors.polarNight[0],
              colorPrimary: nordThemeColors.frost[3],
              colorPrimaryHover: "#a80",
              colorText: nordThemeColors.snowStorm[2],
              colorTextDescription: "#e09",
              controlHeightLG: 25,
            },
            Select: {
              clearBg: nordThemeColors.polarNight[3],
              multipleItemBg: nordThemeColors.polarNight[1],
              optionActiveBg: nordThemeColors.polarNight[3],
              optionSelectedBg: nordThemeColors.polarNight[1],
              selectorBg: nordThemeColors.polarNight[0],
              optionSelectedColor: nordThemeColors.snowStorm[0],
              multipleItemBorderColor: nordThemeColors.polarNight[0],
              colorText: nordThemeColors.snowStorm[0],
              colorBgElevated: nordThemeColors.polarNight[0],
              colorTextPlaceholder: nordThemeColors.snowStorm[2],
              colorBorder: nordThemeColors.polarNight[1],
            },
            Table: {
              borderColor: nordThemeColors.polarNight[0],
              headerBg: nordThemeColors.polarNight[0],
              headerColor: nordThemeColors.frost[2],
              headerSplitColor: nordThemeColors.polarNight[3],
              rowHoverBg: nordThemeColors.polarNight[2],
              colorBgContainer: nordThemeColors.polarNight[1],
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </DefaultServiceRegistryProvider>
  );
}
