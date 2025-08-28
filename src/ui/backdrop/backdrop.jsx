import React from 'react';
import backdrop from './backdrop.module.css'
import {createPortal} from "react-dom";

const Backdrop = ({send, children, onClick}) => {
	const protalContainer = document.getElementById('portal-container');
	if(!send){
		return null;
	}

	return createPortal(
		<div className={backdrop.backdrop} onClick={onClick}>
			{children}
		</div>,
		protalContainer
	);
};

export default Backdrop;