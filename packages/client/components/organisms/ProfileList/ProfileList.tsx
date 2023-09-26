import ProfileIcon from "@/components/molecules/ProfileIcon/ProfileIcon";

export interface Profile {
  id: string;
  name: string;
  icon: string;
  badgeValue: number;
  trimColor: string;
}

interface ProfileListProps {
  profiles: Profile[];
}

export default function ProfileList({
  profiles,
}: ProfileListProps): JSX.Element {
  return (
    <div className="flex gap-6 p-4 flex-wrap-reverse scrollbar-thin">
      {profiles.map((profile) => (
        <div key={profile.id}>
          <ProfileIcon
            name={profile.name}
            icon={profile.icon}
            badgeValue={profile.badgeValue}
            trimColor={profile.trimColor}
          />
        </div>
      ))}
    </div>
  );
}
