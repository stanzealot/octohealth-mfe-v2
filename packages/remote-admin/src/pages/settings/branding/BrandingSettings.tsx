import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Text, Grid, GridItem } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import ColorPickerField from './ColorPickerField';
import LogoUploadField from './LogoUploadField';
import BrandingPreview from './BrandingPreview';
import { mockGetPresignedUrl, mockSaveBranding } from './mock-branding-api';

// Enable the colord mix plugin for shade generation
extend([mixPlugin]);

/** Auto-generate light + dark shades from a hex primary color */
function deriveShades(hex: string) {
  try {
    return {
      light: colord(hex).mix('#ffffff', 0.9).toHex(),
      dark:  colord(hex).mix('#000000', 0.3).toHex(),
    };
  } catch {
    return { light: '#F0F9F5', dark: '#094a1b' };
  }
}

/** Read a CSS custom property from the document root */
function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Apply CSS vars instantly to the document root.
 * This is what creates the "live preview" effect — all CSS-var-based components
 * update immediately without a page reload.
 */
function applyLiveBranding(primary: string, light: string, dark: string) {
  const root = document.documentElement;
  root.style.setProperty('--brand-primary',       primary);
  root.style.setProperty('--brand-primary-light', light);
  root.style.setProperty('--brand-primary-dark',  dark);
}

export default function BrandingSettings() {
  // Initialise from CSS vars already applied by branding-store on shell load
  const [primaryColor, setPrimaryColor] = useState<string>(() =>
    getCSSVar('--brand-primary') || '#0C6525'
  );
  const [companyName, setCompanyName]   = useState('Bastion');
  const [logoUrl, setLogoUrl]           = useState<string | null>(null);
  const [isSaving, setIsSaving]         = useState(false);
  const [isUploading, setIsUploading]   = useState(false);

  // Derived shades update whenever primaryColor changes
  const shades = deriveShades(primaryColor);

  // Also try to read saved branding-store values via shell federation store
  // We do this lazily to avoid blocking render
  useEffect(() => {
    import('shell/branding-store').then((m: any) => {
      const state = m.useBrandingStore?.getState();
      if (state?.branding) {
        const b = state.branding;
        if (b.primaryColor) setPrimaryColor(b.primaryColor);
        if (b.companyName)  setCompanyName(b.companyName);
        if (b.logoUrl)      setLogoUrl(b.logoUrl);
      }
    }).catch(() => {
      // Running standalone — ignore
    });
  }, []);

  /** Live preview: update CSS vars instantly while user picks color */
  const handleColorChange = useCallback((color: string) => {
    setPrimaryColor(color);
    const s = deriveShades(color);
    applyLiveBranding(color, s.light, s.dark);

    // Also forward to shell branding-store preview if available (no-save)
    import('shell/branding-store').then((m: any) => {
      m.useBrandingStore?.getState()?.previewBranding({
        primaryColor: color,
        primaryLightColor: s.light,
        primaryDarkColor: s.dark,
        logoUrl,
        companyName,
      });
    }).catch(() => {});
  }, [logoUrl, companyName]);

  const handleLogoFile = async (file: File) => {
    setIsUploading(true);
    try {
      const { fileUrl } = await mockGetPresignedUrl(file);
      setLogoUrl(fileUrl);
    } catch {
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const cfg = {
        primaryColor,
        primaryLightColor: shades.light,
        primaryDarkColor:  shades.dark,
        logoUrl,
        companyName,
      };

      // Mock API call
      await mockSaveBranding(cfg);

      // Persist to shell branding-store (+ localStorage) if available
      await import('shell/branding-store').then((m: any) => {
        return m.useBrandingStore?.getState()?.saveBranding(cfg);
      }).catch(() => {
        // Standalone — save directly to localStorage
        try { localStorage.setItem('octohealth-branding', JSON.stringify(cfg)); } catch {}
      });

      toast.success('Branding saved successfully!');
    } catch {
      toast.error('Failed to save branding. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box maxW="960px">
      {/* Page header */}
      <Box mb="3.2rem">
        <Text
          fontSize="2.2rem"
          fontWeight="700"
          color="var(--text-primary)"
          fontFamily="Montserrat, sans-serif"
          mb="0.4rem"
        >
          Branding Settings
        </Text>
        <Text fontSize="1.4rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
          Customize the look and feel for your organization. Changes apply instantly across the app.
        </Text>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '1.2fr 1fr' }} gap="4rem">
        {/* ── Left column: controls ── */}
        <GridItem>
          <Flex direction="column" gap="3.2rem">
            {/* Company name */}
            <Box>
              <Text
                fontSize="1.3rem"
                fontWeight="500"
                color="var(--text-secondary)"
                fontFamily="Montserrat, sans-serif"
                mb="0.8rem"
              >
                Company Name
              </Text>
              <Box
                as="input"
                value={companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                p="1rem 1.4rem"
                borderRadius="8px"
                border="1px solid var(--surface-border)"
                bg="var(--surface-card)"
                color="var(--text-primary)"
                fontSize="1.4rem"
                fontFamily="Montserrat, sans-serif"
                w="100%"
                h="4.4rem"
                outline="none"
                transition="border-color 0.2s"
                _focus={{ borderColor: 'var(--brand-primary)' }}
              />
            </Box>

            {/* Logo upload */}
            <LogoUploadField
              logoUrl={logoUrl}
              onChange={setLogoUrl}
              onFile={handleLogoFile}
            />
            {isUploading && (
              <Text fontSize="1.2rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
                Uploading logo…
              </Text>
            )}

            {/* Primary color picker */}
            <ColorPickerField
              label="Primary Color"
              value={primaryColor}
              onChange={handleColorChange}
            />

            {/* Auto-generated shades */}
            <Box>
              <Text
                fontSize="1.3rem"
                fontWeight="500"
                color="var(--text-secondary)"
                fontFamily="Montserrat, sans-serif"
                mb="1rem"
              >
                Auto-generated Shades
              </Text>
              <Flex gap="1.2rem" flexWrap="wrap">
                {[
                  { label: 'Light  (90% white)', color: shades.light },
                  { label: 'Dark (30% black)',   color: shades.dark  },
                ].map((s) => (
                  <Flex key={s.label} align="center" gap="1rem" p="1rem" borderRadius="8px"
                        border="1px solid var(--surface-border)" bg="var(--surface-bg)">
                    <Box
                      w="3.2rem"
                      h="3.2rem"
                      borderRadius="6px"
                      bg={s.color}
                      border="1px solid var(--surface-border)"
                      flexShrink={0}
                    />
                    <Box>
                      <Text fontSize="1.1rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
                        {s.label}
                      </Text>
                      <Text fontSize="1.2rem" fontFamily="monospace" color="var(--text-secondary)">
                        {s.color}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Box>

            {/* Save button */}
            <Box
              as="button"
              onClick={handleSave}
              disabled={isSaving}
              px="2.4rem"
              h="4.4rem"
              borderRadius="8px"
              bg="var(--brand-primary)"
              color="white"
              fontSize="1.4rem"
              fontWeight="600"
              fontFamily="Montserrat, sans-serif"
              border="none"
              cursor={isSaving ? 'not-allowed' : 'pointer'}
              opacity={isSaving ? 0.7 : 1}
              alignSelf="flex-start"
              transition="opacity 0.2s"
              _hover={{ opacity: isSaving ? 0.7 : 0.9 }}
            >
              {isSaving ? 'Saving…' : 'Save Branding'}
            </Box>
          </Flex>
        </GridItem>

        {/* ── Right column: live preview ── */}
        <GridItem>
          <Box
            position={{ base: 'static', lg: 'sticky' }}
            top="9rem"
          >
            <Text
              fontSize="1.3rem"
              fontWeight="500"
              color="var(--text-secondary)"
              fontFamily="Montserrat, sans-serif"
              mb="1.2rem"
            >
              Live Preview
            </Text>
            <BrandingPreview
              primaryColor={primaryColor}
              primaryLightColor={shades.light}
              companyName={companyName}
              logoUrl={logoUrl}
            />
            <Text
              fontSize="1.1rem"
              color="var(--text-placeholder)"
              fontFamily="Montserrat, sans-serif"
              mt="0.8rem"
              textAlign="center"
            >
              Preview updates as you pick colors
            </Text>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
