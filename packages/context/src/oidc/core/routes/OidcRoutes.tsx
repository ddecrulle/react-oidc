import React, { ComponentType, FC, PropsWithChildren, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getPath } from './route-utils';
import CallbackComponent from '../default-component/Callback.component';

const propTypes = {
  callbackComponent: PropTypes.elementType,
  redirect_uri: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const defaultProps: Partial<OidcRoutesProps> = {

};

type OidcRoutesProps = {
  callbackSuccessComponent?: ComponentType;
  callbackErrorComponent?: ComponentType;
  configurationName:string;
  redirect_uri: string;
};

const OidcRoutes: FC<PropsWithChildren<OidcRoutesProps>> = ({
  callbackErrorComponent,
  callbackSuccessComponent, redirect_uri,
  children, configurationName
}) => {
  // This exist because in next.js window outside useEffect is null
  const pathname = window ? window.location.pathname : '';
  
  const [path, setPath] = useState(pathname);
  
  useEffect(() => {
    const setNewPath = () => setPath(window.location.pathname);
    setNewPath();
    window.addEventListener('popstate', setNewPath, false);
    return () => window.removeEventListener('popstate', setNewPath, false);
  });
  
  const callbackPath = getPath(redirect_uri);

  switch (path) {
    case callbackPath:
      return <CallbackComponent callBackError={callbackErrorComponent} callBackSuccess={callbackSuccessComponent} configurationName={configurationName} />;
    default:
      return <>{children}</>;
  }
};

// @ts-ignore
OidcRoutes.propTypes = propTypes;
OidcRoutes.defaultProps = defaultProps;

export default React.memo(OidcRoutes);
