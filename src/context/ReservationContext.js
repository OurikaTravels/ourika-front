import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

export const useReservation = () => {
  return useContext(ReservationContext);
};

export const ReservationProvider = ({ children }) => {
  const [reservationCount, setReservationCount] = useState(0);

  const updateReservationCount = (count) => {
    setReservationCount(count);
  };

  return (
    <ReservationContext.Provider value={{ reservationCount, updateReservationCount }}>
      {children}
    </ReservationContext.Provider>
  );
};