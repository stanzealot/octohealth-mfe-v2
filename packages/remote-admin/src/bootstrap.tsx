/**
 * Standalone dev preview for remote-admin.
 * In production (federation), ChakraProvider comes from shell.
 * This file is only used when running remote-admin preview directly.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsModule from './pages/settings/SettingsModule';

// Minimal system for standalone preview — shell provides the real theme in production
const system = createSystem(defaultConfig);

// Apply default CSS vars for standalone dev
const root = document.documentElement;
root.style.setProperty('--brand-primary', '#0C6525');
root.style.setProperty('--brand-primary-light', '#F0F9F5');
root.style.setProperty('--brand-primary-dark', '#094a1b');
root.style.setProperty('--brand-accent', '#C7522A');
root.style.setProperty('--brand-secondary', '#667085');
root.style.setProperty('--surface-bg', '#F8F9FA');
root.style.setProperty('--surface-card', '#FFFFFF');
root.style.setProperty('--surface-border', '#E2E8F0');
root.style.setProperty('--surface-sidebar', '#FFFFFF');
root.style.setProperty('--surface-topbar', '#FFFFFF');
root.style.setProperty('--text-primary', '#101828');
root.style.setProperty('--text-secondary', '#344054');
root.style.setProperty('--text-muted', '#667085');
root.style.setProperty('--text-placeholder', '#98A2B3');
root.style.setProperty('--hover-bg', '#F0F2F5');
root.style.setProperty('--table-header-bg', '#F9FAFB');
root.style.setProperty('--table-border', '#E5E7EB');
root.style.setProperty('--table-row-hover', '#F9FAFB');
root.style.setProperty('--status-success', '#12B76A');
root.style.setProperty('--status-warning', '#F79009');
root.style.setProperty('--status-danger', '#F04438');
root.style.setProperty('--status-info', '#2E90FA');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ChakraProvider value={system}>
    <BrowserRouter>
      <SettingsModule />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </ChakraProvider>,
);
