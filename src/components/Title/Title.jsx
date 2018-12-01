import React from 'react';
import './Title.scss';

const Title = (props) => {
    const { text } = props;
    return (
        <header id="header">
            <span>{text}</span>
            <img id="logo" src="https://snyk.io/wp-content/themes/snyk_v2_etyhadar/dist/images/svg/logo.svg" />
        </header>
    );
}
export default Title;
