import React from 'react';
import NavWrapper from '../NavWrapper/';

const Layout = (props) => {
  return (
    <div>
      <NavWrapper>
        {props.children}
      </NavWrapper>
    </div>
  );
}

export default Layout;
