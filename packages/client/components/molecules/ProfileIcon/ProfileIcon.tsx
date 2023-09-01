import Base64Icon from "@/components/atoms/Base64Icon/Base64Icon";
import Text from "@/components/atoms/Text";

interface ProfileIconProps {
  icon: string;
  badgeValue: number;
  trimColor: string;
}

export default function ProfileIcon({
  icon,
  badgeValue,
  trimColor,
}: ProfileIconProps): JSX.Element {
  return (
    <div className="w-14 h-14 rounded-xl bg-polarNight-0 flex items-center justify-center relative">
      <div className="max-h-full aspect-square">
        <Base64Icon src={icon} description="profile" />
      </div>
      <div
        className="w-10/12 h-1 rounded-lg absolute bottom-0"
        style={{ backgroundColor: trimColor }}
      />
      <div className="w-8 h-8 bg-polarNight-3 rounded-full absolute -top-4 -right-4 flex items-center justify-center">
        <Text>{badgeValue}</Text>
      </div>
    </div>
  );
}
