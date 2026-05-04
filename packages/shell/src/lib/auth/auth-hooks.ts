import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService, type LoginCredentials } from './auth-service';
import { useAuthActions, useAuthStore } from '../../store/auth-store';

export function useLogin() {
  const { login } = useAuthActions();
  const navigate = useNavigate();

  return useMutation({
    // API call lives here — not inside the store
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Populate the in-memory store (and sessionStorage) with the response
      login({
        user:         data.user,
        accessToken:  data.access_token,
        refreshToken: data.refresh_token,
        menu:         data.menu,
      });
      navigate('/crm/contacts', { replace: true });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message ?? 'Invalid credentials. Please try again.';
      toast.error(msg);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  return () => {
    authService.logout().finally(() => {
      logout();
      navigate('/', { replace: true });
    });
  };
}

export function useAuthInitialization() {
  const store = useAuthStore();
  return { isLoading: store.isLoading };
}
