import React from 'react';
import './SideBar.scss';

const SideBar = (props) => {
    return (
        <div className="snyk_side-bar">
            <h5 className="snyk_side-bar__title">{props.title}</h5>
            {props.children}
        </div>
    );
};

export default SideBar;
