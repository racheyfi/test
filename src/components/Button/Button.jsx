import React from 'react';
import './Button.scss';

const SideBar = ({ value, action }) => {

    return (
        <button className="snyk_button" type='button' onClick={() => action()}> {value}</button>
    );
};

export default SideBar;
