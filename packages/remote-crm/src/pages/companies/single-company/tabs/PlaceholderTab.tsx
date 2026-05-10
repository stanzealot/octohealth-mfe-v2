import React, { memo } from 'react';
import { Box, Text } from '@chakra-ui/react';

export const PlaceholderTab = memo(function PlaceholderTab({ name }: { name: string }) {
  return (
    <Box p="3.2rem" textAlign="center">
      <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
        {name} — coming soon
      </Text>
    </Box>
  );
});
export default PlaceholderTab;
