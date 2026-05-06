import React, { useState, useEffect } from 'react';
import { Box, Flex, VStack, Text } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/* ─── Types ─────────────────────────────────────────────────────────── */
export interface MenuItem {
  id?: string;
  label: string;
  code?: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
  /** Passed from shell (PrivateWrapper reads auth-store directly) */
  menu?: MenuItem[];
}

/* ─── Helpers ───────────────────────────────────────────────────────── */
const normalizePath = (path: string | undefined): string | null => {
  if (!path) return null;
  const clean = path.replace(/^\/+/, '');
  return clean ? `/${clean}` : null;
};

const hasActiveChild = (children: MenuItem[] | undefined, currentPath: string): boolean => {
  if (!children || children.length === 0) return false;
  return children.some((child) => {
    const p = normalizePath(child.path);
    if (p && (currentPath === p || currentPath.startsWith(p + '/'))) return true;
    return hasActiveChild(child.children, currentPath);
  });
};

/* ─── NavItem ───────────────────────────────────────────────────────── */
function NavItem({ item, depth = 0 }: { item: MenuItem; depth?: number }) {
  const location = useLocation();
  const hasChildren = !!item.children?.length;
  const itemPath = normalizePath(item.path);
  const isChildActive = hasActiveChild(item.children, location.pathname);
  const isExactActive = itemPath
    ? location.pathname === itemPath || location.pathname.startsWith(itemPath + '/')
    : false;
  const isActive = isExactActive || isChildActive;

  const [open, setOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [location.pathname, isChildActive]);

  const paddingLeft = depth > 0 ? '2.8rem' : '1.4rem';

  const activeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `1.1rem 1.4rem 1.1rem ${paddingLeft}`,
    borderRadius: '6px',
    background: 'var(--brand-primary-light)',
    borderLeft: '0.3rem solid var(--brand-primary)',
    fontWeight: 600,
    color: 'var(--brand-primary)',
    textDecoration: 'none',
    width: '100%',
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.4rem',
    transition: 'background 0.15s',
  };

  const normalStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `1.1rem 1.4rem 1.1rem ${paddingLeft}`,
    borderRadius: '6px',
    background: 'transparent',
    borderLeft: '0.3rem solid transparent',
    fontWeight: 400,
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    width: '100%',
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.4rem',
    transition: 'background 0.15s',
  };

  const Dot = () => (
    <Box
      w="8px"
      h="8px"
      borderRadius="50%"
      bg={isActive ? 'var(--brand-primary)' : 'var(--surface-border)'}
      flexShrink={0}
    />
  );

  /* Parent with children */
  if (hasChildren) {
    return (
      <Box>
        <Box
          style={isActive ? activeStyle : normalStyle}
          onClick={() => setOpen((p) => !p)}
          _hover={{ background: 'var(--brand-primary-light)' }}
          role="button"
        >
          <Flex align="center" gap="1rem">
            <Dot />
            <Text
              as="span"
              fontSize="1.4rem"
              fontFamily="Montserrat, sans-serif"
              fontWeight={isActive ? 600 : 400}
              color={isActive ? 'var(--brand-primary)' : 'var(--text-secondary)'}
            >
              {item.label}
            </Text>
          </Flex>
          <Box
            as={ChevronRight}
            size={16}
            color="var(--text-placeholder)"
            style={{
              transition: 'transform 0.25s ease',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Box>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="sub"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <Box pl="0.8rem">
                {item.children!.map((child, i) => (
                  <NavItem key={child.id ?? child.label ?? i} item={child} depth={depth + 1} />
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    );
  }

  /* Leaf node */
  if (itemPath) {
    return (
      <NavLink
        to={itemPath}
        style={({ isActive: navActive }) => (navActive ? activeStyle : { ...normalStyle })}
        onMouseEnter={(e) => {
          if (!(e.currentTarget as HTMLAnchorElement).classList.contains('active'))
            (e.currentTarget as HTMLElement).style.background = 'var(--brand-primary-light)';
        }}
        onMouseLeave={(e) => {
          if (!(e.currentTarget as HTMLAnchorElement).classList.contains('active'))
            (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        <Flex align="center" gap="1rem">
          <Dot />
          <Text as="span" fontSize="1.4rem" fontFamily="Montserrat, sans-serif" color="inherit">
            {item.label}
          </Text>
        </Flex>
      </NavLink>
    );
  }

  return (
    <Box style={normalStyle} _hover={{ background: 'var(--brand-primary-light)' }}>
      <Flex align="center" gap="1rem">
        <Dot />
        <Text as="span" fontSize="1.4rem" fontFamily="Montserrat, sans-serif" color="var(--text-secondary)">
          {item.label}
        </Text>
      </Flex>
    </Box>
  );
}

/* ─── Sidebar ───────────────────────────────────────────────────────── */
export default function Sidebar({ isOpen, menu = [] }: SidebarProps) {
  return (
    <Box
      id="left-panel"
      position="fixed"
      left={0}
      top={0}
      zIndex={999}
      w={isOpen ? '25rem' : 0}
      h="100vh"
      bg="var(--surface-sidebar)"
      overflow="hidden"
      transition="width 0.25s ease"
      boxShadow="var(--shadow-sidebar)"
      display="flex"
      flexDir="column"
    >
      {/* Header */}
      <Flex bg="var(--brand-primary)" h="7.2rem" flexShrink={0} align="center" px="1.6rem" gap="1rem">
        <Flex
          align="center"
          justify="center"
          w="32px"
          h="32px"
          bg="rgba(255,255,255,0.2)"
          borderRadius="8px"
          flexShrink={0}
        >
          <Text color="white" fontWeight="800" fontSize="1.6rem">B</Text>
        </Flex>
        <Text color="white" fontWeight="700" fontSize="1.6rem" fontFamily="Montserrat, sans-serif">
          Bastion
        </Text>
      </Flex>

      {/* Scrollable nav */}
      <Box
        flex={1}
        minH={0}
        overflowY="auto"
        overflowX="hidden"
        css={{
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: 'var(--surface-border)', borderRadius: '3px' },
        }}
      >
        <VStack px="1rem" py="2.4rem" align="stretch" gap="0.2rem">
          {menu.length === 0 ? (
            <Box px="1.4rem" py="1rem">
              <Text fontSize="1.2rem" color="var(--text-placeholder)" fontFamily="Montserrat, sans-serif">
                No menu items
              </Text>
            </Box>
          ) : (
            menu.map((item, i) => (
              <NavItem key={item.id ?? item.label ?? i} item={item} />
            ))
          )}
        </VStack>
      </Box>

      {/* Footer */}
      <Flex
        h="7.6rem"
        flexShrink={0}
        borderTop="1px solid var(--surface-border)"
        align="center"
        px="1.6rem"
        bg="var(--surface-sidebar)"
        gap="0.8rem"
      >
        <Flex
          align="center"
          justify="center"
          w="28px"
          h="28px"
          bg="var(--brand-primary)"
          borderRadius="6px"
          flexShrink={0}
        >
          <Text color="white" fontWeight="800" fontSize="1.3rem">O</Text>
        </Flex>
        <Text fontWeight="700" fontSize="1.4rem" color="var(--brand-primary)" fontFamily="Montserrat, sans-serif">
          OctoHealth
        </Text>
      </Flex>
    </Box>
  );
}
