/**
 * CardActionMenu
 *
 * Horizontal row of icon-button actions, matching the monolith's ActionMenu
 * that sits inside the gray action bar on each grid card.
 *
 * Uses the same SVG-path icons as the monolith (inlined as React components
 * so they work across federation boundaries without SVGR/vite config changes).
 */
import React, { memo } from 'react';
import { Flex, Box } from '@chakra-ui/react';

/* ─── Inline SVG icons (paths copied from monolith /assets/action-menu) ─ */

const EyeIcon = memo(() => (
  <svg width="18" height="13" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.139 5.77219C17.1144 5.71664 16.5188 4.39547 15.1948 3.07148C13.4307 1.30734 11.2025 0.375 8.74999 0.375C6.29749 0.375 4.06929 1.30734 2.30515 3.07148C0.981165 4.39547 0.382806 5.71875 0.361009 5.77219C0.329026 5.84413 0.3125 5.92198 0.3125 6.0007C0.3125 6.07943 0.329026 6.15728 0.361009 6.22922C0.385618 6.28477 0.981165 7.60523 2.30515 8.92922C4.06929 10.6927 6.29749 11.625 8.74999 11.625C11.2025 11.625 13.4307 10.6927 15.1948 8.92922C16.5188 7.60523 17.1144 6.28477 17.139 6.22922C17.171 6.15728 17.1875 6.07943 17.1875 6.0007C17.1875 5.92198 17.171 5.84413 17.139 5.77219ZM8.74999 10.5C6.58577 10.5 4.69507 9.7132 3.12992 8.16211C2.48771 7.52346 1.94134 6.7952 1.50781 6C1.94123 5.20472 2.48761 4.47645 3.12992 3.83789C4.69507 2.2868 6.58577 1.5 8.74999 1.5C10.9142 1.5 12.8049 2.2868 14.3701 3.83789C15.0135 4.4763 15.5611 5.20457 15.9957 6C15.4887 6.94641 13.2802 10.5 8.74999 10.5ZM8.74999 2.625C8.08248 2.625 7.42996 2.82294 6.87494 3.19379C6.31993 3.56464 5.88735 4.09174 5.6319 4.70844C5.37645 5.32514 5.30962 6.00374 5.43984 6.65843C5.57007 7.31312 5.89151 7.91448 6.36351 8.38649C6.83551 8.85849 7.43688 9.17993 8.09156 9.31015C8.74625 9.44038 9.42485 9.37354 10.0416 9.11809C10.6583 8.86265 11.1854 8.43007 11.5562 7.87505C11.9271 7.32003 12.125 6.66751 12.125 6C12.1241 5.10518 11.7682 4.24728 11.1355 3.61454C10.5027 2.98181 9.64481 2.62593 8.74999 2.625ZM8.74999 8.25C8.30499 8.25 7.86997 8.11804 7.49996 7.87081C7.12995 7.62357 6.84156 7.27217 6.67126 6.86104C6.50097 6.4499 6.45641 5.9975 6.54323 5.56105C6.63004 5.12459 6.84433 4.72368 7.159 4.40901C7.47367 4.09434 7.87458 3.88005 8.31104 3.79323C8.7475 3.70642 9.1999 3.75097 9.61103 3.92127C10.0222 4.09157 10.3736 4.37996 10.6208 4.74997C10.868 5.11998 11 5.55499 11 6C11 6.59674 10.7629 7.16903 10.341 7.59099C9.91903 8.01295 9.34673 8.25 8.74999 8.25Z" fill="currentColor"/>
  </svg>
));

const EditIcon = memo(() => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.7334 4.15866L10.5912 1.0171C10.4867 0.912603 10.3627 0.829713 10.2262 0.77316C10.0897 0.716607 9.94335 0.6875 9.79559 0.6875C9.64783 0.6875 9.50152 0.716607 9.36501 0.77316C9.22851 0.829713 9.10447 0.912603 9.00001 1.0171L0.329771 9.68733C0.224851 9.79142 0.141667 9.91532 0.0850551 10.0518C0.0284434 10.1884 -0.000466481 10.3348 5.69176e-06 10.4826V13.6248C5.69176e-06 13.9232 0.118532 14.2093 0.329511 14.4203C0.540489 14.6313 0.826637 14.7498 1.12501 14.7498H12.9375C13.0867 14.7498 13.2298 14.6906 13.3353 14.5851C13.4407 14.4796 13.5 14.3365 13.5 14.1873C13.5 14.0381 13.4407 13.8951 13.3353 13.7896C13.2298 13.6841 13.0867 13.6248 12.9375 13.6248H5.85844L13.7334 5.74983C13.8379 5.64536 13.9208 5.52133 13.9774 5.38482C14.0339 5.24831 14.063 5.102 14.063 4.95424C14.063 4.80649 14.0339 4.66017 13.9774 4.52367C13.9208 4.38716 13.8379 4.26313 13.7334 4.15866ZM4.26727 13.6248H1.12501V10.4826L7.31251 4.29506L10.4548 7.43733L4.26727 13.6248ZM11.25 6.6421L8.10844 3.49983L9.79594 1.81233L12.9375 4.9546L11.25 6.6421Z" fill="currentColor"/>
  </svg>
));

const TrashIcon = memo(() => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.9375 2.375H10.125V1.8125C10.125 1.36495 9.94721 0.935725 9.63074 0.619257C9.31428 0.30279 8.88505 0.125 8.4375 0.125H5.0625C4.61495 0.125 4.18572 0.30279 3.86926 0.619257C3.55279 0.935725 3.375 1.36495 3.375 1.8125V2.375H0.5625C0.413316 2.375 0.270242 2.43426 0.164753 2.53975C0.0592633 2.64524 0 2.78832 0 2.9375C0 3.08668 0.0592633 3.22976 0.164753 3.33525C0.270242 3.44074 0.413316 3.5 0.5625 3.5H1.125V13.625C1.125 13.9234 1.24353 14.2095 1.4545 14.4205C1.66548 14.6315 1.95163 14.75 2.25 14.75H11.25C11.5484 14.75 11.8345 14.6315 12.0455 14.4205C12.2565 14.2095 12.375 13.9234 12.375 13.625V3.5H12.9375C13.0867 3.5 13.2298 3.44074 13.3352 3.33525C13.4407 3.22976 13.5 3.08668 13.5 2.9375C13.5 2.78832 13.4407 2.64524 13.3352 2.53975C13.2298 2.43426 13.0867 2.375 12.9375 2.375ZM4.5 1.8125C4.5 1.66332 4.55926 1.52024 4.66475 1.41475C4.77024 1.30926 4.91332 1.25 5.0625 1.25H8.4375C8.58668 1.25 8.72976 1.30926 8.83525 1.41475C8.94074 1.52024 9 1.66332 9 1.8125V2.375H4.5V1.8125ZM11.25 13.625H2.25V3.5H11.25V13.625ZM5.625 6.3125V10.8125C5.625 10.9617 5.56574 11.1048 5.46025 11.2102C5.35476 11.3157 5.21168 11.375 5.0625 11.375C4.91332 11.375 4.77024 11.3157 4.66475 11.2102C4.55926 11.1048 4.5 10.9617 4.5 10.8125V6.3125C4.5 6.16332 4.55926 6.02024 4.66475 5.91475C4.77024 5.80926 4.91332 5.75 5.0625 5.75C5.21168 5.75 5.35476 5.80926 5.46025 5.91475C5.56574 6.02024 5.625 6.16332 5.625 6.3125ZM9 6.3125V10.8125C9 10.9617 8.94074 11.1048 8.83525 11.2102C8.72976 11.3157 8.58668 11.375 8.4375 11.375C8.28832 11.375 8.14524 11.3157 8.03975 11.2102C7.93426 11.1048 7.875 10.9617 7.875 10.8125V6.3125C7.875 6.16332 7.93426 6.02024 8.03975 5.91475C8.14524 5.80926 8.28832 5.75 8.4375 5.75C8.58668 5.75 8.72976 5.80926 8.83525 5.91475C8.94074 6.02024 9 6.16332 9 6.3125Z" fill="currentColor"/>
  </svg>
));

const RequestIcon = memo(() => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.9375 0.8125H1.5625C1.26413 0.8125 0.977983 0.931026 0.767005 1.142C0.556026 1.35298 0.4375 1.63913 0.4375 1.9375V12.0625C0.4375 12.3609 0.556026 12.647 0.767005 12.858C0.977983 13.069 1.26413 13.1875 1.5625 13.1875H13.9375C14.2359 13.1875 14.522 13.069 14.733 12.858C14.944 12.647 15.0625 12.3609 15.0625 12.0625V1.9375C15.0625 1.63913 14.944 1.35298 14.733 1.142C14.522 0.931026 14.2359 0.8125 13.9375 0.8125ZM13.9375 12.0625H1.5625V1.9375H13.9375V12.0625ZM11.125 4.1875C11.125 5.08261 10.7694 5.94105 10.1365 6.57399C9.50355 7.20692 8.64511 7.5625 7.75 7.5625C6.85489 7.5625 5.99645 7.20692 5.36351 6.57399C4.73058 5.94105 4.375 5.08261 4.375 4.1875C4.375 4.03832 4.43426 3.89524 4.53975 3.78975C4.64524 3.68426 4.78832 3.625 4.9375 3.625C5.08668 3.625 5.22976 3.68426 5.33525 3.78975C5.44074 3.89524 5.5 4.03832 5.5 4.1875C5.5 4.78424 5.73705 5.35653 6.15901 5.77849C6.58097 6.20045 7.15326 6.4375 7.75 6.4375C8.34674 6.4375 8.91903 6.20045 9.34099 5.77849C9.76295 5.35653 10 4.78424 10 4.1875C10 4.03832 10.0593 3.89524 10.1648 3.78975C10.2702 3.68426 10.4133 3.625 10.5625 3.625C10.7117 3.625 10.8548 3.68426 10.9602 3.78975C11.0657 3.89524 11.125 4.03832 11.125 4.1875Z" fill="currentColor"/>
  </svg>
));

const UserPlusIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H3.75C2.95435 11.25 2.19129 11.5661 1.62868 12.1287C1.06607 12.6913 0.75 13.4544 0.75 14.25V15.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.375 8.25C8.03185 8.25 9.375 6.90685 9.375 5.25C9.375 3.59315 8.03185 2.25 6.375 2.25C4.71815 2.25 3.375 3.59315 3.375 5.25C3.375 6.90685 4.71815 8.25 6.375 8.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 6V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.25 8.25H12.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

const CloneIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 6.75H8.25C7.42157 6.75 6.75 7.42157 6.75 8.25V15C6.75 15.8284 7.42157 16.5 8.25 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V8.25C16.5 7.42157 15.8284 6.75 15 6.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.75 11.25H3C2.60218 11.25 2.22064 11.092 1.93934 10.8107C1.65804 10.5294 1.5 10.1478 1.5 9.75V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H9.75C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

const ArchiveIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.75 6V15.75H2.25V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.25 2.25H0.75V6H17.25V2.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 9H10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

/* ─── Icon registry ───────────────────────────────────────────────── */
type IconEntry = {
  component: React.ComponentType;
  color?: string;   // override — defaults to var(--text-secondary)
};

const ICON_REGISTRY: Record<string, IconEntry> = {
  'View':            { component: EyeIcon },
  'Edit':            { component: EditIcon },
  'Delete':          { component: TrashIcon, color: 'var(--status-danger)' },
  'Request Service': { component: RequestIcon },
  'Assign':          { component: UserPlusIcon },
  'Register Patient':{ component: UserPlusIcon },
  'Clone':           { component: CloneIcon },
  'Archive':         { component: ArchiveIcon },
};

/* ─── Types ──────────────────────────────────────────────────────── */
export interface CardAction {
  label: string;
  cta?: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** When true, cta is still called directly — parent handles confirmation */
  allowPopover?: boolean;
  confirmationText?: string;
}

interface CardActionMenuProps {
  actions: CardAction[];
}

/* ─── Single icon button with tooltip ──────────────────────────────── */
const ActionIconButton = memo(function ActionIconButton({ action }: { action: CardAction }) {
  const entry      = ICON_REGISTRY[action.label] ?? { component: RequestIcon };
  const IconComp   = entry.component;
  const color      = entry.color ?? 'var(--text-secondary)';
  const isDisabled = action.disabled || action.loading;
  const isDanger   = action.label === 'Delete';

  return (
    /* Outer wrapper — `role="group"` lets CSS parent-hover selector target the tooltip */
    <Box position="relative" display="inline-flex" role="group">

      {/* ── Tooltip label ──────────────────────────────────────── */}
      <Box
        as="span"
        position="absolute"
        bottom="calc(100% + 9px)"
        left="50%"
        pointerEvents="none"
        zIndex={50}
        /* Initial state: invisible, slightly lower */
        css={{
          transform: 'translateX(-50%) translateY(4px)',
          opacity: 0,
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          /* Reveal when the group wrapper is hovered */
          '[role="group"]:hover &': {
            opacity: 1,
            transform: 'translateX(-50%) translateY(0)',
          },
          /* Down-pointing arrow */
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: 'var(--text-primary) transparent transparent transparent',
          },
        }}
      >
        <Box
          bg="var(--text-primary)"
          color="var(--surface-card)"
          px="0.9rem"
          py="0.35rem"
          borderRadius="6px"
          fontSize="1.1rem"
          fontFamily="Montserrat, sans-serif"
          fontWeight="500"
          whiteSpace="nowrap"
          lineHeight="1.4"
          boxShadow="0 2px 8px rgba(0,0,0,0.18)"
        >
          {action.label}
        </Box>
      </Box>

      {/* ── Icon button ────────────────────────────────────────── */}
      <Box
        as="button"
        aria-label={action.label}
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="3.2rem"
        h="3.2rem"
        borderRadius="8px"
        border="none"
        bg="transparent"
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        color={color}
        opacity={isDisabled ? 0.45 : 1}
        transition="background 0.15s, transform 0.15s, opacity 0.15s"
        _hover={
          isDisabled ? {} : {
            bg: isDanger ? 'rgba(240,68,56,0.1)' : 'rgba(0,0,0,0.06)',
            transform: 'scale(1.15)',
          }
        }
        _active={isDisabled ? {} : { transform: 'scale(0.95)' }}
        onClick={isDisabled ? undefined : action.cta}
      >
        <IconComp />
      </Box>
    </Box>
  );
});

/* ─── CardActionMenu ─────────────────────────────────────────────── */
const CardActionMenu = memo(function CardActionMenu({ actions }: CardActionMenuProps) {
  return (
    <Flex align="center" justify="center" gap="0.4rem" minW="fit-content">
      {actions.map((action) => (
        <ActionIconButton key={action.label} action={action} />
      ))}
    </Flex>
  );
});

export default CardActionMenu;
