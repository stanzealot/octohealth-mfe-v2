import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth-store';
import { authService } from '../lib/auth/auth-service';
import { useAuthActions } from '../store/auth-store';
import { useColorMode, useColorModeActions } from '../store/color-mode-store';
import { useIsMobile } from '../hooks/useIsMobile';

const Sidebar = lazy(() => import('sharedUi/Sidebar'));
const TopBar  = lazy(() => import('sharedUi/TopBar'));

const PAGE_VARIANTS: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: 15,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

interface Props {
  children: React.ReactNode;
}

export default function PrivateWrapper({ children }: Props) {
  const isMobile = useIsMobile();

  // Default open on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 768
  );

  const location = useLocation();
  const navigate = useNavigate();

  // Auto-close sidebar on route change when mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  // Read auth data directly — PrivateWrapper is in the same shell package as the store
  const { user, menu } = useAuth();
  const { logout } = useAuthActions();
  const { colorMode } = useColorMode();
  const { toggleColorMode } = useColorModeActions();

  const handleLogout = () => {
    authService.logout().finally(() => {
      logout();
      navigate('/', { replace: true });
    });
  };

  return (
    <Flex h="100vh" overflow="hidden" bg="var(--surface-bg)">
      {/* Sidebar — receives menu from auth-store via props */}
      <Suspense fallback={null}>
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
          menu={menu}
        />
      </Suspense>

      {/* Backdrop overlay — mobile only, shown when sidebar is open */}
      {isMobile && sidebarOpen && (
        <Box
          position="fixed"
          inset={0}
          bg="rgba(0,0,0,0.45)"
          zIndex={998}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main column */}
      <Flex
        flex={1}
        flexDir="column"
        h="100vh"
        overflow="hidden"
        minW={0}
        style={{
          marginLeft: isMobile ? 0 : (sidebarOpen ? '25rem' : 0),
          transition: 'margin-left 0.25s ease',
        }}
      >
        {/* TopBar — receives user from auth-store via props */}
        <Suspense fallback={null}>
          <TopBar
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((p) => !p)}
            user={user}
            onLogout={handleLogout}
            colorMode={colorMode}
            onToggleColorMode={toggleColorMode}
          />
        </Suspense>

        {/* Page content */}
        <Box as="main" flex={1} minH={0} overflowY="auto" overflowX="hidden" mt="7.2rem" p={{ base: '1.2rem', md: '2rem' }} bg="var(--surface-bg)">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={PAGE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Flex>
    </Flex>
  );
}
