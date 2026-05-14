import React, { memo, useState, useMemo, useCallback } from 'react';
import { Stack, Badge, Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Filter } from 'lucide-react';
import type { Tariff } from '../../types';
import { mockTariffs, filterTariffsData, groupTariffsByProvider } from '../../mock';
import { getTariffStatusColor } from '../../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppButton = React.lazy(() => import('sharedUi/AppButton')) as any;

// ─── Inline search input (no dependency on sharedUi AppInput) ──────────────
function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Box position="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search here..."
        style={{
          width: '26rem',
          padding: '0.8rem 1.2rem',
          border: '1px solid var(--surface-border)',
          borderRadius: '6px',
          fontSize: '1.4rem',
          fontFamily: 'Montserrat, sans-serif',
          background: 'var(--surface-card)',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--brand-primary)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--surface-border)';
        }}
      />
    </Box>
  );
}

// ─── Table header cell style ────────────────────────────────────────────────
const TH_STYLE: React.CSSProperties = {
  padding: '1.2rem 1.6rem',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '1.2rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  whiteSpace: 'nowrap',
};

const TD_STYLE: React.CSSProperties = {
  padding: '1.2rem 1.6rem',
  fontSize: '1.4rem',
  color: 'var(--text-secondary)',
  fontFamily: 'Montserrat, sans-serif',
  borderBottom: '1px solid var(--table-border)',
};

function TariffListBase() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());

  const filteredData = useMemo(
    () => filterTariffsData(mockTariffs, { search: searchTerm }),
    [searchTerm],
  );

  const groupedTariffs = useMemo(() => groupTariffsByProvider(filteredData), [filteredData]);

  const toggleProviderExpansion = useCallback((providerName: string) => {
    setExpandedProviders((prev) => {
      const next = new Set(prev);
      if (next.has(providerName)) {
        next.delete(providerName);
      } else {
        next.add(providerName);
      }
      return next;
    });
  }, []);

  const handleView = useCallback((id: string) => navigate(`/providers/tariff/${id}`), [navigate]);

  const handleEdit = useCallback(
    (id: string) => navigate(`/providers/tariff/edit/${id}`),
    [navigate],
  );

  const handleDelete = useCallback((_id: string) => {
    // TODO: API call
  }, []);

  const handleAddTariff = useCallback(() => navigate('/providers/tariff/add-tariff'), [navigate]);

  return (
    <Stack
      gap={0}
      bg="var(--surface-card)"
      borderRadius=".8rem"
      border="1px solid var(--surface-border)"
      overflow="hidden"
    >
      {/* Title */}
      <Box px="2.5rem" pt="2rem" pb="1rem">
        <Text
          fontSize="1.8rem"
          fontWeight="700"
          color="var(--text-primary)"
          fontFamily="Montserrat, sans-serif"
        >
          Tariff List
        </Text>
      </Box>

      {/* Toolbar */}
      <Flex px="2.5rem" pb="1.5rem" justify="space-between" align="center" gap={4} flexWrap="wrap">
        <Flex gap={3} align="center" flex="1">
          <SearchBox value={searchTerm} onChange={setSearchTerm} />
          <AppButton variant="outline" leftIcon={<Filter size={16} />} buttonSize="md">
            Filter
          </AppButton>
        </Flex>
        <AppButton variant="primary" onClick={handleAddTariff}>
          + Add tariff
        </AppButton>
      </Flex>

      {/* Collapsible Table */}
      <Box overflowX="auto">
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead>
            <tr
              style={{
                background: 'var(--table-header-bg)',
                borderBottom: '1px solid var(--table-border)',
              }}
            >
              <th style={{ ...TH_STYLE, width: '50px' }} />
              <th style={TH_STYLE}>Tariff Name</th>
              <th style={TH_STYLE}>Effective Date</th>
              <th style={TH_STYLE}>Expiry Date</th>
              <th style={TH_STYLE}>Renew Date</th>
              <th style={TH_STYLE}>Discount</th>
              <th style={TH_STYLE}>Status</th>
              <th style={{ ...TH_STYLE, textAlign: 'center' }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {groupedTariffs.map((group) => {
              const isExpanded = expandedProviders.has(group.providerName);

              return (
                <React.Fragment key={group.providerName}>
                  {/* Provider group row */}
                  <tr
                    style={{
                      background: 'var(--table-header-bg)',
                      borderBottom: '1px solid var(--table-border)',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleProviderExpansion(group.providerName)}
                  >
                    <td style={{ padding: '1.2rem 1.6rem' }}>
                      <button
                        type="button"
                        style={{
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--surface-border)',
                          borderRadius: '4px',
                          background: 'var(--surface-card)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          padding: 0,
                        }}
                      >
                        {isExpanded ? (
                          <Minus size={14} color="var(--text-muted)" strokeWidth={2.5} />
                        ) : (
                          <Plus size={14} color="var(--text-muted)" strokeWidth={2.5} />
                        )}
                      </button>
                    </td>
                    <td
                      colSpan={7}
                      style={{
                        padding: '1.2rem 1.6rem',
                        fontWeight: 600,
                        fontSize: '1.4rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {group.providerName}
                    </td>
                  </tr>

                  {/* Tariff rows */}
                  {isExpanded &&
                    group.tariffs.map((tariff: Tariff) => (
                      <tr
                        key={tariff.id}
                        style={{
                          background: 'var(--surface-card)',
                          borderBottom: '1px solid var(--table-border)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            'var(--table-row-hover)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            'var(--surface-card)';
                        }}
                      >
                        <td style={{ padding: '1.2rem 1.6rem' }} />
                        <td style={TD_STYLE}>{tariff.tariffName}</td>
                        <td style={TD_STYLE}>{tariff.effectiveDate}</td>
                        <td style={TD_STYLE}>{tariff.expiryDate}</td>
                        <td style={TD_STYLE}>{tariff.renewDate}</td>
                        <td style={TD_STYLE}>{tariff.discount}</td>
                        <td style={{ padding: '1.2rem 1.6rem' }}>
                          <Badge
                            colorPalette={getTariffStatusColor(tariff.status)}
                            fontSize="1.2rem"
                            px={3}
                            py={1}
                          >
                            {tariff.status}
                          </Badge>
                        </td>
                        <td style={{ padding: '1.2rem 1.6rem', textAlign: 'center' }}>
                          <Flex gap="0.8rem" justify="center" align="center">
                            <Box
                              as="button"
                              type="button"
                              onClick={() => handleView(tariff.id)}
                              fontSize="1.2rem"
                              fontFamily="Montserrat, sans-serif"
                              color="var(--brand-primary)"
                              bg="transparent"
                              border="none"
                              cursor="pointer"
                              px="0.8rem"
                              py="0.4rem"
                              borderRadius="4px"
                              _hover={{ bg: 'var(--brand-primary-light)' }}
                              transition="background 0.15s"
                            >
                              View
                            </Box>
                            <Box
                              as="button"
                              type="button"
                              onClick={() => handleEdit(tariff.id)}
                              fontSize="1.2rem"
                              fontFamily="Montserrat, sans-serif"
                              color="var(--text-muted)"
                              bg="transparent"
                              border="none"
                              cursor="pointer"
                              px="0.8rem"
                              py="0.4rem"
                              borderRadius="4px"
                              _hover={{ bg: 'var(--hover-bg)', color: 'var(--text-primary)' }}
                              transition="all 0.15s"
                            >
                              Edit
                            </Box>
                            <Box
                              as="button"
                              type="button"
                              onClick={() => handleDelete(tariff.id)}
                              fontSize="1.2rem"
                              fontFamily="Montserrat, sans-serif"
                              color="var(--status-danger)"
                              bg="transparent"
                              border="none"
                              cursor="pointer"
                              px="0.8rem"
                              py="0.4rem"
                              borderRadius="4px"
                              _hover={{ bg: 'rgba(240,68,56,0.08)' }}
                              transition="background 0.15s"
                            >
                              Delete
                            </Box>
                          </Flex>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        {groupedTariffs.length === 0 && (
          <Box p={8} textAlign="center">
            <Text fontSize="1.6rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
              No tariffs found
            </Text>
          </Box>
        )}
      </Box>
    </Stack>
  );
}

export const TariffList = memo(TariffListBase);
export default TariffList;
