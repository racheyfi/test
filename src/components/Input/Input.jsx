import React from 'react';
import './Input.scss';

const Input = (props) => {
    const { getValue  ,placeholder,name} = props;
    return (
        <input name={name} placeholder={placeholder}
               onChange={e => getValue(e.target.value)}  className="snyk_input"/>
    );
}
export default Input;
