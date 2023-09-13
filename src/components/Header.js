import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const Header = () => {
  useEffect(() => {
    document.title = 'UNI-X';
  }, []);

  return (
    <Helmet>
      <link rel="icon" type="image/png" href="https://cdn-icons-png.flaticon.com/512/814/814070.png" />
    </Helmet>
  );
};

export default Header;