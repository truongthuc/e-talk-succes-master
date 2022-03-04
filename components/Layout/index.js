import React, { useEffect, useContext, useState } from 'react';
import Header from '~/components/Header';
import Footer from '~/components//Footer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n } from '~/i18n';
import { I18nContext } from 'next-i18next';
import Select, { components } from 'react-select';
import { appSettings } from '~/config';
import Menu from '~/components/Menu';
import { teacherGetHolidays } from '~/api/teacherAPI';
import { useRouter } from 'next/router';

import { Modal } from 'react-bootstrap';
import { loadPopup } from '~/api/loadPopup';
import ReactHtmlParser from 'react-html-parser';

let isShowNoti = false;

function ModalNoti(props) {
	const { data, close } = props;

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header>
				<Modal.Title
					id="contained-modal-title-vcenter"
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<img
						src="/static/img/logo.png"
						alt=""
						style={{ width: 80, height: 'auto' }}
					/>

					<i
						onClick={() => close()}
						className="fas fa-times"
						style={{ color: '#f12b71' }}
					/>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>{ReactHtmlParser(data?.PopupContent)}</Modal.Body>
		</Modal>
	);
}

const Layout = ({
	children,
	title = 'E-talk Elearning',
	isStudent = false,
}) => {
	const router = useRouter();
	useEffect(() => {
		isStudent ? (appSettings.UID = 1071) : (appSettings.UID = 20);
	}, [isStudent]);

	const [modalShow, setModalShow] = useState(false);

	const [data, setData] = useState(false);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		try {
			const response = await loadPopup();
			console.log('response: ', response?.data);
			setData(response?.data);

			if (response?.data?.IsHide !== undefined && !response?.data?.IsHide) {
				isShowNoti = true;
				setModalShow(!modalShow);
			}
		} catch (error) {
			console.log('components/Layout - getData: ', error);
		}
	};

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await teacherGetHolidays({
					UID: UID,
					Token: Token,
					Page: 1,
				});
				if (res.Code === 403) {
					localStorage.clear();
					router.push('/login/signin');
				}
			} catch (error) {
				console.log('Error: ', error);
			}
		})();
	}, [router]);

	return (
		<>
			<Head>
				<title>{title}</title>
				<script src="/static/assets/js/dashforge.js"></script>
				<script src="/static/js/dashforge.aside.js"></script>
				<script src="/static/js/custom.js"></script>
			</Head>
			<Menu isStudent={isStudent} />
			<main className="content ht-100vh pd-0-f testthu">
				<Header isStudent={isStudent} />
				<div className="content-body" id="body-content">
					{children}
				</div>
				<Footer />
			</main>
			<div className="modal-message-noti">
				<ModalNoti
					show={isShowNoti}
					onHide={() => {
						isShowNoti = false;
						setModalShow(!modalShow);
					}}
					data={data}
					close={() => {
						isShowNoti = false;
						setModalShow(!modalShow);
					}}
				/>
			</div>
		</>
	);
};
export const getLayout = (page) => <Layout>{page}</Layout>;

export const getStudentLayout = (page) => (
	<Layout isStudent={true}>{page}</Layout>
);

export default Layout;
