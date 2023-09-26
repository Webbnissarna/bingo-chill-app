import { Spin } from "antd";

export interface FullPageLoadingTemplateProps {}

export default function FullPageLoadingTemplate({}: FullPageLoadingTemplateProps): JSX.Element {
  return (
    <div className="w-screen h-screen max-w-full max-h-full bg-polarNight-0 flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
}
