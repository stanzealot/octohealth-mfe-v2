export interface BrandingPayload {
  primaryColor:      string;
  primaryLightColor: string;
  primaryDarkColor:  string;
  logoUrl:           string | null;
  companyName:       string;
}

/**
 * MOCK: Simulates API save with 800ms delay.
 * Replace with real API call when backend provides the endpoint:
 *   await api.post('/settings/branding', payload)
 */
export async function mockSaveBranding(payload: BrandingPayload): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 800));
  // No-op — branding-store handles localStorage persistence
  console.log('[mock] Branding saved:', payload);
}

/**
 * MOCK: Presigned URL flow — converts file to base64 data URL.
 * Replace with real presigned URL flow when backend provides endpoint:
 *   const { uploadUrl, fileUrl } = await api.get('/settings/branding/logo-upload-url')
 *   await fetch(uploadUrl, { method: 'PUT', body: file })
 *   return fileUrl
 */
export async function mockGetPresignedUrl(file: File): Promise<{ uploadUrl: string; fileUrl: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  // In the mock, uploadUrl === fileUrl (both are the base64 data URL)
  return { uploadUrl: dataUrl, fileUrl: dataUrl };
}
