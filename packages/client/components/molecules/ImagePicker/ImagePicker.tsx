import { Base64Icon } from "@/components/atoms";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { useState } from "react";

export interface ImagePickerProps {
  value: string | null;
  onChange: (base64: string | null) => void;
}

export default function ImagePicker({
  value,
  onChange,
}: ImagePickerProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const processFile = async (info: UploadChangeParam<UploadFile>) => {
    if (!info.file.originFileObj) {
      onChange(null);
    }

    try {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      const reader = new FileReader();
      reader.readAsDataURL(info.file.originFileObj as RcFile);
      const base64 = await new Promise<string>((resolve) =>
        reader.addEventListener("load", () => resolve(reader.result as string)),
      );
      onChange(base64);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Upload
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={() => undefined}
        customRequest={() => undefined}
        accept=".jpg,.jpeg,.png"
        onChange={processFile}
        disabled={isLoading}
      >
        <div className="font-text text-xs flex flex-col items-center justify-center text-snowStorm-0">
          {value ? (
            <div className="max-h-full max-w-full p-3 rounded-full overflow-hidden aspect-square flex items-center justify-center">
              <Base64Icon src={value} />
            </div>
          ) : isLoading ? (
            <LoadingOutlined />
          ) : (
            <>
              <PlusOutlined />
              <span>Upload</span>
            </>
          )}
        </div>
      </Upload>
    </div>
  );
}
