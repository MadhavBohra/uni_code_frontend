"use client"
import React, { createContext, useContext, useState } from 'react';

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [testStarted, setTestStarted] = useState(false);
  const [testEnded, setTestEnded] = useState(false);

  return (
    <TestContext.Provider value={{ testStarted, setTestStarted, testEnded, setTestEnded }}>
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
