import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

export interface ChecksumIndicatorProps {
  actual?: string;
  desired?: string;
}

export default function ChecksumIndicator({
  actual,
  desired,
}: ChecksumIndicatorProps): JSX.Element {
  const haveBoth = !!actual && !!desired;
  const bothSame = actual === desired;

  return (
    <div className="font-text text-base text-snowStorm-0">
      <span>Checksum: </span>
      {haveBoth && bothSame && (
        <span className="text-aurora-3">
          {desired} <CheckCircleFilled />
        </span>
      )}
      {haveBoth && !bothSame && (
        <span className="text-aurora-0">
          {actual} (actual) vs {desired} <CloseCircleFilled />
        </span>
      )}
      {!haveBoth && <span className="opacity-30">(N/A)</span>}
    </div>
  );
}
