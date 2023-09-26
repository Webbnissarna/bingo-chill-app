import { Base64Icon, Text, TextInputField } from "@/components/atoms";
import ImagePicker from "@/components/molecules/ImagePicker";
import type { DeepPartial } from "@webbnissarna/bingo-chill-common/src/utils/functional";
import { patch } from "@webbnissarna/bingo-chill-common/src/utils/functional";
import { ColorPicker, Modal } from "antd";
import { useState } from "react";

export interface Profile {
  name: string;
  icon: string;
  color: string;
}

export interface ProfileEditorProps {
  profile: Profile;
  onChanged: (newProfile: Profile) => void;
}

export default function ProfileEditor({
  profile,
  onChanged,
}: ProfileEditorProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onModalCancel = () => {
    setIsModalOpen(false);
  };

  const change = (update: DeepPartial<Profile>) => {
    onChanged(patch(profile, update));
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="w-14 h-14 p-1 rounded-xl bg-polarNight-3 flex items-center justify-center relative cursor-pointer hover:bg-frost-3 active:bg-frost-2 transition"
      >
        <div className="max-h-full aspect-square">
          <Base64Icon src={profile.icon} description="profile" />
        </div>
        <div
          className="w-10/12 h-1 rounded-lg absolute bottom-0"
          style={{ backgroundColor: profile.color }}
        />
      </div>
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={onModalCancel}
        footer={[]}
      >
        <div className="w-full grid grid-cols-[1fr_1fr] gap-4 text-right">
          <div className="col-span-2 flex items-center justify-center">
            <ImagePicker
              value={profile.icon}
              onChange={(icon) => change({ icon: icon ?? "" })}
            />
          </div>
          <Text>Name</Text>
          <TextInputField
            value={profile.name}
            onChange={(newName) => change({ name: newName })}
          />
          <Text>Color</Text>
          <div className="text-left">
            <ColorPicker
              disabledAlpha
              value={profile.color}
              onChangeComplete={(value) =>
                change({ color: value.toHexString() })
              }
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
