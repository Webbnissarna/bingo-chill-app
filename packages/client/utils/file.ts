export async function loadFileUTF8ContentFromPicker(
  accept: string,
): Promise<string | undefined> {
  const input =
    (document.querySelector(
      "#__loadFileUTF8ContentFromPicker",
    ) as HTMLInputElement) ?? document.createElement("input");
  input.type = "file";
  input.accept = accept;

  const selectionPromise = new Promise<File | undefined>((resolve) => {
    input.onchange = () => resolve(input.files?.[0]);
  });

  input.click();

  const file = await selectionPromise;

  if (!file) return undefined;

  const reader = new FileReader();
  reader.readAsText(file);
  return await new Promise<string>((resolve) =>
    reader.addEventListener("load", () => resolve(reader.result as string)),
  );
}

export function downloadContentAsFile(
  content: string,
  fileName: string,
  contentType: string,
) {
  const anchor =
    (document.querySelector("#__downloadContentAsFile") as HTMLAnchorElement) ??
    document.createElement("a");

  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
}

export function copyToClipboard(content: string): Promise<void> {
  return navigator.clipboard.writeText(content);
}
