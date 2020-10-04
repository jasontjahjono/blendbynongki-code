import React, { useEffect, useState } from "react";
import Cotter from "cotter";
import { Config } from "cotter/lib/binder";
import User from "cotter/lib/models/User";
import CotterContext from "./userContext";
import { CotterAccessToken } from "cotter-token-js";

export interface CotterProviderOptions extends Config {
  children?: React.ReactNode;
  apiKeyID: string;
}

const CotterProvider = (opts: CotterProviderOptions) => {
  let { children, apiKeyID } = opts;
  const [loggedIn, setloggedIn] = useState(false);
  const [loading, setloading] = useState(true);
  const [user, setuser] = useState<User | undefined>(undefined);

  const getCotter = (config?: Config) => {
    if (config && config.ApiKeyID) {
      const c = new Cotter(config);
      return c;
    } else {
      const c = new Cotter(apiKeyID);
      return c;
    }
  };

  useEffect(() => {
    if (apiKeyID) {
      checkLoggedIn();
    }
  }, [apiKeyID]);

  const checkLoggedIn = async () => {
    const cotter = getCotter();
    const accessToken = await cotter.tokenHandler.getAccessToken();
    if (accessToken && accessToken.token?.length > 0) {
      setloggedIn(true);
      const usr = cotter.getLoggedInUser();
      setuser(usr);
    } else {
      setloggedIn(false);
      setuser(undefined);
    }
    setloading(false);
  };

  const getAccessToken = async (): Promise<CotterAccessToken | null> => {
    if (apiKeyID) {
      const cotter = getCotter();
      const accessToken = await cotter.tokenHandler.getAccessToken();
      return accessToken;
    } else {
      throw new Error(
        "ApiKeyID is undefined, you may forgot to wrap your component in <CotterProvider>"
      );
    }
  };
  const logout = async (): Promise<void> => {
    if (apiKeyID) {
      const cotter = getCotter();
      await cotter.logOut();
      setloggedIn(false);
      setuser(undefined);
    } else {
      throw new Error(
        "ApiKeyID is undefined, you may forgot to wrap your component in <CotterProvider>"
      );
    }
  };

  return (
    <CotterContext.Provider
      value={{
        checkLoggedIn: checkLoggedIn,
        isLoggedIn: loggedIn,
        isLoading: typeof window === "undefined" || loading,
        getCotter: getCotter,
        user: user,
        apiKeyID: apiKeyID,
        logout: logout,
        getAccessToken: getAccessToken,
      }}
    >
      {children}
    </CotterContext.Provider>
  );
};

export default CotterProvider;
