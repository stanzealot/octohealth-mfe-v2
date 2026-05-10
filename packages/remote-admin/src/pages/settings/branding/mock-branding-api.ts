export interface BrandingPayload {
  primaryColor: string;
  primaryLightColor: string;
  primaryDarkColor: string;
  logoUrl: string | null;
  companyName: string;
}

export async function mockSaveBranding(payload: BrandingPayload): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 800));

  console.log('[mock] Branding saved:', payload);
}

export async function mockGetPresignedUrl(
  file: File,
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return { uploadUrl: dataUrl, fileUrl: dataUrl };
}
