import { useQuery } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { sleep } from "../utils/helpers/request.helper";
import InitializingContent from "../components/initializing/Content";

interface IProps {
  children: ReactNode;
}
const InitializingProvider: FC<IProps> = ({ children }) => {
  const { isPending } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      await sleep(1500);
      return { initialized: true }; // Return something meaningful
    },
  });

  if (isPending) {
    return <InitializingContent />;
  }

  return <>{children}</>;
};

export default InitializingProvider;
