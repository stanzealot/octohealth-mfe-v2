import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Menu, Bell, LogOut, LockKeyhole } from 'lucide-react';
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
}

function getInitials(firstName?: string, lastName?: string, email?: string): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return 'U';
}

export default function TopBar({ sidebarOpen, onToggleSidebar, user, onLogout }: TopBarProps) {
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
      h="7.2rem"
      align="center"
      justify="space-between"
      bg="white"
      px={{ base: '1.6rem', md: '2.4rem' }}
      boxShadow="4px 4px 40px rgba(0,0,0,0.05)"
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
        color="#344054"
        onClick={onToggleSidebar}
        transition="background 0.2s"
        _hover={{ bg: '#F9FAFB' }}
      >
        <Menu size={20} />
      </Box>

      {/* Right — bell + avatar */}
      <Flex align="center" gap="1.2rem">
        <Flex
          align="center" justify="center"
          bg="#F0F2F5"
          borderRadius="50%"
          w="4rem" h="4rem"
          cursor="pointer"
          _hover={{ bg: '#E4E7EC' }}
          transition="background 0.2s"
        >
          <Bell size={18} color="#344054" />
        </Flex>

        {/* Avatar + dropdown */}
        <Box position="relative" ref={dropdownRef}>
          <Flex
            align="center" justify="center"
            w="4rem" h="4rem"
            borderRadius="50%"
            bg="#C7522A"
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
                style={{ position: 'absolute', right: 0, top: 'calc(100% + 12px)', zIndex: 200, minWidth: '280px' }}
              >
                <Box
                  bg="white"
                  borderRadius="12px"
                  boxShadow="0 4px 20px rgba(0,0,0,0.12)"
                  border="1px solid #E5E7EB"
                  overflow="hidden"
                >
                  {/* User info */}
                  <Flex gap="1.2rem" p="1.6rem" borderBottom="1px solid #F3F4F6">
                    <Flex
                      align="center" justify="center"
                      w="4rem" h="4rem"
                      borderRadius="50%"
                      bg="#C7522A"
                      color="white"
                      fontWeight="600"
                      fontSize="1.4rem"
                      fontFamily="Montserrat, sans-serif"
                      flexShrink={0}
                    >
                      {initials}
                    </Flex>
                    <Flex direction="column" justify="center" flex={1} overflow="hidden">
                      <Text fontSize="1.4rem" fontWeight="600" color="#111827" fontFamily="Montserrat, sans-serif" noOfLines={1}>
                        {displayName}
                      </Text>
                      <Text fontSize="1.2rem" color="#6B7280" fontFamily="Montserrat, sans-serif" noOfLines={1}>
                        {userEmail}
                      </Text>
                      <Flex gap="0.4rem" mt="0.4rem">
                        <Text fontSize="1.1rem" color="#6B7280" fontFamily="Montserrat, sans-serif">Role:</Text>
                        <Text fontSize="1.1rem" fontWeight="500" color="#111827" fontFamily="Montserrat, sans-serif">{userRole}</Text>
                      </Flex>
                    </Flex>
                  </Flex>

                  {/* Actions */}
                  <Box p="0.8rem">
                    <Flex
                      as="button" w="100%"
                      align="center" gap="1.2rem"
                      p="1rem 1.2rem"
                      borderRadius="8px"
                      cursor="pointer"
                      border="none"
                      bg="transparent"
                      _hover={{ bg: '#F9FAFB' }}
                      transition="background 0.2s"
                    >
                      <Flex align="center" justify="center" w="32px" h="32px" borderRadius="8px" bg="#F3F4F6">
                        <LockKeyhole size={16} color="#6B7280" />
                      </Flex>
                      <Text fontSize="1.4rem" color="#374151" fontWeight="500" fontFamily="Montserrat, sans-serif">
                        Reset password
                      </Text>
                    </Flex>

                    <Flex
                      as="button" w="100%"
                      align="center" gap="1.2rem"
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
                        <LogOut size={16} color="#DC2626" />
                      </Flex>
                      <Text fontSize="1.4rem" color="#DC2626" fontWeight="500" fontFamily="Montserrat, sans-serif">
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
