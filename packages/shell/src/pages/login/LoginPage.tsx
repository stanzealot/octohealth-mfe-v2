import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { Box, VStack, Flex, Text, Field, Input, Button, Spinner } from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema } from '../../schema';
import { useLogin } from '../../lib/auth/auth-hooks';
import type { LoginCredentials } from '../../lib/auth/auth-service';

export default function LoginPage() {
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: 'hunter.bailey67@hotmail.com',
      password: '',
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  const isPending = loginMutation.isPending;

  return (
    <Box w="100%">
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <VStack gap="20px" align="stretch">
          {}
          <Field.Root invalid={!!errors.username}>
            <Field.Label
              fontSize="14px"
              fontWeight="500"
              color="#344054"
              fontFamily="Montserrat, sans-serif"
              mb="6px"
            >
              Email or Username{' '}
              <Box as="span" color="#D92D20">
                *
              </Box>
            </Field.Label>
            <Input
              {...register('username')}
              type="text"
              placeholder="username or email@example.com"
              h="44px"
              fontSize="14px"
              fontFamily="Montserrat, sans-serif"
              color="#101828"
              border="1px solid #D0D5DD"
              borderRadius="8px"
              px="14px"
              _focus={{
                borderColor: '#0C6525',
                boxShadow: '0 0 0 4px rgba(12,101,37,0.06)',
                outline: 'none',
              }}
              _placeholder={{ color: '#667085' }}
              disabled={isPending}
            />
            {errors.username && (
              <Field.ErrorText fontSize="12px" color="#D92D20" mt="4px">
                {errors.username.message}
              </Field.ErrorText>
            )}
          </Field.Root>

          {}
          <Field.Root invalid={!!errors.password}>
            <Field.Label
              fontSize="14px"
              fontWeight="500"
              color="#344054"
              fontFamily="Montserrat, sans-serif"
              mb="6px"
            >
              Password{' '}
              <Box as="span" color="#D92D20">
                *
              </Box>
            </Field.Label>
            <Box position="relative" w="100%">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                h="44px"
                fontSize="14px"
                fontFamily="Montserrat, sans-serif"
                color="#101828"
                border="1px solid #D0D5DD"
                borderRadius="8px"
                px="14px"
                pr="44px"
                _focus={{
                  borderColor: '#0C6525',
                  boxShadow: '0 0 0 4px rgba(12,101,37,0.06)',
                  outline: 'none',
                }}
                _placeholder={{ color: '#667085' }}
                disabled={isPending}
              />
              <Box
                position="absolute"
                right="14px"
                top="50%"
                transform="translateY(-50%)"
                cursor="pointer"
                color="#667085"
                onClick={() => setShowPassword((p) => !p)}
                display="flex"
                alignItems="center"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Box>
            </Box>
            {errors.password && (
              <Field.ErrorText fontSize="12px" color="#D92D20" mt="4px">
                {errors.password.message}
              </Field.ErrorText>
            )}
          </Field.Root>

          {}
          <Flex justify="flex-end" mt="-8px">
            <Link
              to="/forgot-password"
              style={{
                fontSize: '14px',
                color: '#0C6526',
                fontWeight: '500',
                textDecoration: 'none',
              }}
            >
              Forgot Password?
            </Link>
          </Flex>

          {}
          <Button
            type="submit"
            w="100%"
            h="44px"
            bg="#0C6525"
            color="white"
            fontSize="14px"
            fontWeight="600"
            fontFamily="Montserrat, sans-serif"
            borderRadius="8px"
            border="1px solid #0C6525"
            mt="8px"
            disabled={isPending}
            _hover={{ bg: '#0A5522', borderColor: '#0A5522' }}
            _active={{ bg: '#084420' }}
          >
            {isPending ? (
              <Flex align="center" gap="8px">
                <Spinner size="sm" color="white" />
                <Text>Signing in...</Text>
              </Flex>
            ) : (
              'Login'
            )}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
