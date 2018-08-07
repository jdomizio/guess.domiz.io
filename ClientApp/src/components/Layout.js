import React from 'react';

import './Layout.css';

const Layout = props => (
    <main className="guess-layout">
        <header className="guess-header">guess.domiz.io</header>
        {props.children}
    </main>  
);

export default Layout;
