import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC, ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

const QueryProvider: FC<IProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
