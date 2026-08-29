function fallbackCopy(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) {
    throw new Error("Copy failed");
  }
}

export async function copyTextToClipboard(text: string) {
  if (!navigator.clipboard?.writeText) {
    fallbackCopy(text);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    fallbackCopy(text);
  }
}
