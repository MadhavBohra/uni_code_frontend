"use client"
// app/context/TestContext.js
import React, { createContext, useContext, useState } from 'react';

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [testStarted, setTestStarted] = useState(false);

  return (
    <TestContext.Provider value={{ testStarted, setTestStarted }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};
