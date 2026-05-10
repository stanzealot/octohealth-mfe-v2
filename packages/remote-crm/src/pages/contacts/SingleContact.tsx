import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { AdvancedButton } from 'sharedUi/AppButton';
import { mockContacts } from '../../mock/contacts';

export default function SingleContact() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contact = mockContacts.find((c) => c.id === id);

  if (!contact) {
    return (
      <Box bg="white" p="2rem 2.5rem" borderRadius="0.8rem" border="1px solid #EAECF0">
        <Text fontSize="1.6rem" color="#667085" fontFamily="Montserrat, sans-serif">
          Contact not found.
        </Text>
        <AdvancedButton
          variant="gray-outline"
          onClick={() => navigate(-1)}
          style={{ marginTop: '1.6rem' }}
        >
          Go Back
        </AdvancedButton>
      </Box>
    );
  }

  return (
    <Box bg="white" p="2rem 2.5rem" borderRadius="0.8rem" border="1px solid #EAECF0">
      <Flex align="center" gap="1.2rem" mb="2.4rem">
        <Box
          as="button"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="3.6rem"
          h="3.6rem"
          borderRadius="8px"
          border="1px solid #E4E7EC"
          bg="white"
          cursor="pointer"
          color="#667085"
          onClick={() => navigate(-1)}
          _hover={{ bg: '#F9FAFB' }}
        >
          <ArrowLeft size={18} />
        </Box>
        <Text
          fontSize="1.8rem"
          fontWeight={700}
          color="#1D2939"
          fontFamily="Montserrat, sans-serif"
        >
          Contact Details
        </Text>
      </Flex>

      <Flex gap="2rem" align="flex-start" flexWrap="wrap">
        {}
        <Flex
          align="center"
          justify="center"
          w="8rem"
          h="8rem"
          borderRadius="50%"
          bg="#E0FAEC"
          color="#0C6525"
          fontWeight={700}
          fontSize="2.4rem"
          fontFamily="Montserrat, sans-serif"
          flexShrink={0}
        >
          {contact.firstName[0]}
          {contact.lastName[0]}
        </Flex>

        {}
        <Box
          flex={1}
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
          gap="2rem"
          minW={0}
        >
          {[
            { label: 'First Name', value: contact.firstName },
            { label: 'Last Name', value: contact.lastName },
            { label: 'Title', value: contact.prefix || '-' },
            { label: 'Gender', value: contact.gender || '-' },
            { label: 'Email', value: contact.email || '-' },
            { label: 'Phone', value: contact.phone || '-' },
            {
              label: 'Date of Birth',
              value: contact.dateOfBirth ? new Date(contact.dateOfBirth).toLocaleDateString() : '-',
            },
            { label: 'Status', value: contact.contactStatus },
            { label: 'Reg. Number', value: contact.membership?.regNumber || '-' },
            { label: 'Reg. Date', value: contact.membership?.regDate || '-' },
            { label: 'Created At', value: new Date(contact.createdAt).toLocaleDateString() },
          ].map((field) => (
            <Box key={field.label}>
              <Text
                fontSize="1.2rem"
                color="#98A2B3"
                fontFamily="Montserrat, sans-serif"
                mb="0.4rem"
              >
                {field.label}
              </Text>
              <Text
                fontSize="1.4rem"
                fontWeight={500}
                color="#344054"
                fontFamily="Montserrat, sans-serif"
              >
                {field.value}
              </Text>
            </Box>
          ))}
        </Box>
      </Flex>
    </Box>
  );
}
