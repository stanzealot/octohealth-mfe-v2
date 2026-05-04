import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ContactsList from './ContactsList';
import SingleContact from './SingleContact';

export default function ContactsModule() {
  return (
    <Routes>
      <Route index element={<ContactsList />} />
      <Route path="contacts"     element={<ContactsList />} />
      <Route path="contacts/:id" element={<SingleContact />} />
    </Routes>
  );
}
