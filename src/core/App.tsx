import * as React from 'react';
import {Providers} from "./Providers.tsx";
import {Router} from "./Router.tsx";
import {css} from "../../styled-system/css";
import {SWRConfig} from "swr";
import {authenticatedFetcher} from "@Utils/axios.config.ts";
import {toaster, Toaster} from "@Components/layout/Toaster.tsx";

const appStyles = css({
    minHeight: "100vh",
    '@supports (min-height: 100svh)': {
        minHeight: '100svh'
    }
})

export const App: React.FC = () => {
  return (
      <Providers>
          <SWRConfig value={{
              fetcher: authenticatedFetcher,
              revalidateOnFocus: false,
              onError: (err) => {
                  console.error(err);
                  toaster.error({title: "Nastala chyba při komunikaci se serverem."});
              }
          }}>
              <div className={appStyles}>
                  <Router/>
                  <Toaster/>
              </div>
          </SWRConfig>
      </Providers>
  )
}