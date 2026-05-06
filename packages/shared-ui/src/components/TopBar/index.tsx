import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Menu, Bell, LogOut, LockKeyhole, Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface TopBarUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  /** Passed from shell (PrivateWrapper reads auth-store directly) */
  user?: TopBarUser | null;
  /** Called when user clicks Log out */
  onLogout?: () => void;
  /** Current color mode — passed from shell color-mode-store */
  colorMode?: 'light' | 'dark';
  /** Called when user clicks the sun/moon toggle */
  onToggleColorMode?: () => void;
}

function getInitials(firstName?: string, lastName?: string, email?: string): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return 'U';
}

export default function TopBar({
  sidebarOpen,
  onToggleSidebar,
  user,
  onLogout,
  colorMode = 'light',
  onToggleColorMode,
}: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = useCallback(() => {
    setDropdownOpen(false);
    onLogout?.();
  }, [onLogout]);

  const initials = getInitials(user?.firstName, user?.lastName, user?.email);
  const displayName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || 'User'
    : 'User';
  const userEmail = user?.email ?? '';
  const userRole = user?.role ?? 'Admin';

  return (
    <Flex
      position="fixed"
      top={0}
      right={0}
      width={sidebarOpen ? 'calc(100vw - 25rem)' : '100vw'}
      transition="width 0.25s ease"
      css={{ '@media (max-width: 767px)': { width: '100vw !important' } }}
      h="7.2rem"
      align="center"
      justify="space-between"
      bg="var(--surface-topbar)"
      px={{ base: '1.6rem', md: '2.4rem' }}
      boxShadow="var(--shadow-topbar)"
      zIndex={100}
    >
      {/* Hamburger */}
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="4rem"
        h="4rem"
        borderRadius="50%"
        border="none"
        bg="transparent"
        cursor="pointer"
        color="var(--text-secondary)"
        onClick={onToggleSidebar}
        transition="background 0.2s"
        _hover={{ bg: 'var(--hover-bg)' }}
      >
        <Menu size={20} />
      </Box>

      {/* Right — dark mode + bell + avatar */}
      <Flex align="center" gap="1.2rem">
        {/* Dark mode toggle */}
        <Flex
          as="button"
          align="center"
          justify="center"
          bg="var(--hover-bg)"
          borderRadius="50%"
          w="4rem"
          h="4rem"
          cursor="pointer"
          border="none"
          _hover={{ bg: 'var(--surface-border)' }}
          transition="background 0.2s"
          onClick={onToggleColorMode}
          title={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {colorMode === 'dark'
            ? <Sun size={18} color="var(--text-secondary)" />
            : <Moon size={18} color="var(--text-secondary)" />
          }
        </Flex>

        {/* Bell */}
        <Flex
          align="center"
          justify="center"
          bg="var(--hover-bg)"
          borderRadius="50%"
          w="4rem"
          h="4rem"
          cursor="pointer"
          _hover={{ bg: 'var(--surface-border)' }}
          transition="background 0.2s"
        >
          <Bell size={18} color="var(--text-secondary)" />
        </Flex>

        {/* Avatar + dropdown */}
        <Box position="relative" ref={dropdownRef}>
          <Flex
            align="center"
            justify="center"
            w="4rem"
            h="4rem"
            borderRadius="50%"
            bg="var(--brand-accent)"
            color="white"
            fontWeight="600"
            fontSize="1.4rem"
            fontFamily="Montserrat, sans-serif"
            cursor="pointer"
            userSelect="none"
            flexShrink={0}
            onClick={() => setDropdownOpen((p) => !p)}
          >
            {initials}
          </Flex>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 12px)',
                  zIndex: 200,
                  minWidth: '280px',
                }}
              >
                <Box
                  bg="var(--surface-card)"
                  borderRadius="12px"
                  boxShadow="var(--shadow-dropdown)"
                  border="1px solid var(--surface-border)"
                  overflow="hidden"
                >
                  {/* User info */}
                  <Flex gap="1.2rem" p="1.6rem" borderBottom="1px solid var(--surface-border)">
                    <Flex
                      align="center"
                      justify="center"
                      w="4rem"
                      h="4rem"
                      borderRadius="50%"
                      bg="var(--brand-accent)"
                      color="white"
                      fontWeight="600"
                      fontSize="1.4rem"
                      fontFamily="Montserrat, sans-serif"
                      flexShrink={0}
                    >
                      {initials}
                    </Flex>
                    <Flex direction="column" justify="center" flex={1} overflow="hidden">
                      <Text
                        fontSize="1.4rem"
                        fontWeight="600"
                        color="var(--text-primary)"
                        fontFamily="Montserrat, sans-serif"
                        noOfLines={1}
                      >
                        {displayName}
                      </Text>
                      <Text
                        fontSize="1.2rem"
                        color="var(--text-muted)"
                        fontFamily="Montserrat, sans-serif"
                        noOfLines={1}
                      >
                        {userEmail}
                      </Text>
                      <Flex gap="0.4rem" mt="0.4rem">
                        <Text fontSize="1.1rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
                          Role:
                        </Text>
                        <Text fontSize="1.1rem" fontWeight="500" color="var(--text-primary)" fontFamily="Montserrat, sans-serif">
                          {userRole}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>

                  {/* Actions */}
                  <Box p="0.8rem">
                    <Flex
                      as="button"
                      w="100%"
                      align="center"
                      gap="1.2rem"
                      p="1rem 1.2rem"
                      borderRadius="8px"
                      cursor="pointer"
                      border="none"
                      bg="transparent"
                      _hover={{ bg: 'var(--hover-bg)' }}
                      transition="background 0.2s"
                    >
                      <Flex align="center" justify="center" w="32px" h="32px" borderRadius="8px" bg="var(--hover-bg)">
                        <LockKeyhole size={16} color="var(--text-muted)" />
                      </Flex>
                      <Text fontSize="1.4rem" color="var(--text-secondary)" fontWeight="500" fontFamily="Montserrat, sans-serif">
                        Reset password
                      </Text>
                    </Flex>

                    <Flex
                      as="button"
                      w="100%"
                      align="center"
                      gap="1.2rem"
                      p="1rem 1.2rem"
                      borderRadius="8px"
                      cursor="pointer"
                      border="none"
                      bg="transparent"
                      _hover={{ bg: '#FEF2F2' }}
                      transition="background 0.2s"
                      mt="0.4rem"
                      onClick={handleLogout}
                    >
                      <Flex align="center" justify="center" w="32px" h="32px" borderRadius="8px" bg="#FEE2E2">
                        <LogOut size={16} color="var(--status-danger)" />
                      </Flex>
                      <Text fontSize="1.4rem" color="var(--status-danger)" fontWeight="500" fontFamily="Montserrat, sans-serif">
                        Log out
                      </Text>
                    </Flex>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Flex>
    </Flex>
  );
}
