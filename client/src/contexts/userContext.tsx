import Cotter from "cotter";
import { CotterAccessToken } from "cotter-token-js";
import { Config } from "cotter/lib/binder";
import User from "cotter/lib/models/User";
import { createContext } from "react";

export interface CotterContextInterface {
  isLoggedIn: boolean;
  isLoading: boolean;
  getCotter?: (config?: Config) => Cotter;
  user?: User;
  apiKeyID: string;
  logout: (logoutPath?: String) => Promise<void>;
  checkLoggedIn: () => Promise<void>;
  getAccessToken: () => Promise<CotterAccessToken | null>;
}

const stub = (): never => {
  throw new Error("You forgot to wrap your component in <CotterProvider>.");
};

export const initialContext: CotterContextInterface = {
  isLoggedIn: false,
  isLoading: typeof window !== "undefined",
  logout: stub,
  getCotter: stub,
  getAccessToken: stub,
  checkLoggedIn: stub,
  apiKeyID: "",
};

const CotterContext = createContext<CotterContextInterface>(initialContext);

export default CotterContext;
