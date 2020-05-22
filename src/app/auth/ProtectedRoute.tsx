import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { observer } from "mobx-react-lite";

interface IProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: any;
  redirectPath: string;
  isAuthenticated: () => boolean;
}

const ProtectedRoute: React.FC<IProps> = ({
  component: Component,
  isAuthenticated,
  redirectPath,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        isAuthenticated() ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: redirectPath,
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  );
};

export default observer(ProtectedRoute);
