

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function PrivateLayout() {
  // Renders Navbar + nested routes (Outlet)
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

//hehe
