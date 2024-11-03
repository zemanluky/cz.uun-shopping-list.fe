import * as React from 'react';
import {Providers} from "./Providers.tsx";
import {Router} from "./Router.tsx";
import {Navbar} from "../components/layout";
import {css} from "../../styled-system/css";

const appStyles = css({
    minHeight: "100vh",
    '@supports (min-height: 100svh)': {
        minHeight: '100svh'
    }
})

export const App: React.FC = () => {
  return (
      <Providers>
          <div className={appStyles}>
              <Navbar />
              <Router />
          </div>
      </Providers>
  )
}