import React, { Suspense, lazy, useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth-store';
import { authService } from '../lib/auth/auth-service';
import { useAuthActions } from '../store/auth-store';
import { useColorMode, useColorModeActions } from '../store/color-mode-store';

const Sidebar = lazy(() => import('sharedUi/Sidebar'));
const TopBar  = lazy(() => import('sharedUi/TopBar'));

const PAGE_VARIANTS: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
  exit:    { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

interface Props {
  children: React.ReactNode;
}

export default function PrivateWrapper({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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
    <Flex h="100vh" overflow="hidden" bg="#F8F9FA">
      {/* Sidebar — receives menu from auth-store via props */}
      <Suspense fallback={null}>
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
          menu={menu}
        />
      </Suspense>

      {/* Main column */}
      <Flex
        flex={1}
        flexDir="column"
        h="100vh"
        overflow="hidden"
        minW={0}
        style={{ marginLeft: sidebarOpen ? '25rem' : 0, transition: 'margin-left 0.25s ease' }}
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
        <Box as="main" flex={1} minH={0} overflowY="auto" overflowX="hidden" mt="7.2rem" p="2rem">
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
