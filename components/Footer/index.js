import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Footer = () => {
	return (
		<>
			<footer className="footer tx-cennter" id="footer">
				<span>Copyright © {new Date().getFullYear()} E-Talk.vn</span>
				<div className="d-flex flex-wrap">
					<a href={`#true`} className="">
						LICENSE
					</a>
					<a href={`#true`} className="mg-x-30">
						POLICIES
					</a>
					<a href={`#true`} className="">
						SUPPORT
					</a>
				</div>
			</footer>
			<a href={true} id="scroll-to-top">
				<FontAwesomeIcon icon="chevron-up" className="fas fa-chevron-up" />
			</a>
		</>
	);
};

export default Footer;
