"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const BookingModalContext = createContext(null);

export function BookingModalProvider({ children }) {
  const [type, setType] = useState(null);
  const [prefill, setPrefill] = useState({});

  const openModal = useCallback((nextType, nextPrefill = {}) => {
    setType(nextType);
    setPrefill(nextPrefill);
  }, []);

  const closeModal = useCallback(() => {
    setType(null);
  }, []);

  const value = useMemo(
    () => ({ type, prefill, openModal, closeModal }),
    [type, prefill, openModal, closeModal]
  );

  return (
    <BookingModalContext.Provider value={value}>{children}</BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used within a BookingModalProvider");
  }
  return ctx;
}
