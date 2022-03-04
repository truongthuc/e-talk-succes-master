import React, { useState, useEffect, useReducer } from 'react';
import Pagination from 'react-js-pagination';
import { GetNotifications } from '~/api/studentAPI';
import { getFormattedDate, randomId } from '~/utils';
import { getStudentLayout } from '~/components/Layout';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { i18n, withTranslation } from '~/i18n';

import Router, { useRouter } from 'next/router';

const fakeData = [
	{
		CreatedBy: 'Admin',
		CreatedDate: '2020-10-06T22:11:35.2005909+07:00',
		NotificationContent:
			'Dành tặng cho các học viên tại E-learn khi giới thiệu và giúp bạn bè đăng ký học khóa học tại E-learn để cải thiện ngay trình độ Tiếng Anh.',
		NotificationID: randomId(),
		NotificationIMG:
			'https://www.campusfrance.org/sites/default/files/parrainage.jpg',
		NotificationTitle: 'Chương Trình “Giúp Bạn Học Ngay, Nhận Quà Liền Tay',
		URL: '/ElearnStudent/AnnouncementsDetail?ID=1',
	},
	{
		CreatedBy: 'Admin',
		CreatedDate: '2020-10-06T22:11:35.2005909+07:00',
		NotificationContent:
			'Dành tặng cho các học viên tại E-learn khi giới thiệu và giúp bạn bè đăng ký học khóa học tại E-learn để cải thiện ngay trình độ Tiếng Anh.',
		NotificationID: randomId(),
		NotificationIMG:
			'https://www.campusfrance.org/sites/default/files/parrainage.jpg',
		NotificationTitle: 'Chương Trình “Giúp Bạn Học Ngay, Nhận Quà Liền Tay',
		URL: '/ElearnStudent/AnnouncementsDetail?ID=1',
	},
	{
		CreatedBy: 'Admin',
		CreatedDate: '2020-10-06T22:11:35.2005909+07:00',
		NotificationContent:
			'Dành tặng cho các học viên tại E-learn khi giới thiệu và giúp bạn bè đăng ký học khóa học tại E-learn để cải thiện ngay trình độ Tiếng Anh.',
		NotificationID: randomId(),
		NotificationIMG:
			'https://www.campusfrance.org/sites/default/files/parrainage.jpg',
		NotificationTitle: 'Chương Trình “Giúp Bạn Học Ngay, Nhận Quà Liền Tay',
		URL: '/ElearnStudent/AnnouncementsDetail?ID=1',
	},
	{
		CreatedBy: 'Admin',
		CreatedDate: '2020-10-06T22:11:35.2005909+07:00',
		NotificationContent:
			'Dành tặng cho các học viên tại E-learn khi giới thiệu và giúp bạn bè đăng ký học khóa học tại E-learn để cải thiện ngay trình độ Tiếng Anh.',
		NotificationID: randomId(),
		NotificationIMG:
			'https://www.campusfrance.org/sites/default/files/parrainage.jpg',
		NotificationTitle: 'Chương Trình “Giúp Bạn Học Ngay, Nhận Quà Liền Tay',
		URL: '/ElearnStudent/AnnouncementsDetail?ID=1',
	},
	{
		CreatedBy: 'Admin',
		CreatedDate: '2020-10-06T22:11:35.2005909+07:00',
		NotificationContent:
			'Dành tặng cho các học viên tại E-learn khi giới thiệu và giúp bạn bè đăng ký học khóa học tại E-learn để cải thiện ngay trình độ Tiếng Anh.',
		NotificationID: randomId(),
		NotificationIMG:
			'https://www.campusfrance.org/sites/default/files/parrainage.jpg',
		NotificationTitle: 'Chương Trình “Giúp Bạn Học Ngay, Nhận Quà Liền Tay',
		URL: '/ElearnStudent/AnnouncementsDetail?ID=1',
	},
	{
		CreatedBy: 'Admin',
		CreatedDate: '2020-10-06T22:11:35.2005909+07:00',
		NotificationContent:
			'Dành tặng cho các học viên tại E-learn khi giới thiệu và giúp bạn bè đăng ký học khóa học tại E-learn để cải thiện ngay trình độ Tiếng Anh.',
		NotificationID: randomId(),
		NotificationIMG:
			'https://www.campusfrance.org/sites/default/files/parrainage.jpg',
		NotificationTitle: 'Chương Trình “Giúp Bạn Học Ngay, Nhận Quà Liền Tay',
		URL: '/ElearnStudent/AnnouncementsDetail?ID=1',
	},
];

const BlogItem = ({
	NotificationID,
	NotificationTitle,
	NotificationIMG,
	CreatedBy,
	CreatedDate,
	NotificationContent,
	URL,
	isLoading,
}) => {
	return (
		<div className="card card-event">
			{isLoading ? (
				<Skeleton height={150} />
			) : (
				<img src={NotificationIMG} className="card-img-top" alt="" />
			)}

			<div className="card-body tx-13">
				<h5>{isLoading ? <Skeleton /> : NotificationTitle}</h5>
				<p className="meta mg-t-5">
					{isLoading ? (
						<Skeleton width={100} />
					) : (
						<>
							<span className="author main-color bg-transparent">
								{CreatedBy}
							</span>
							<span className="tx-12 tx-color-03">
								{getFormattedDate(CreatedDate)}
							</span>
						</>
					)}
				</p>
				{isLoading ? (
					<Skeleton count={3} />
				) : (
					<p
						className="mg-b-0 mg-t-10 tx-thumbnail"
						dangerouslySetInnerHTML={{ __html: NotificationContent }}
					></p>
				)}
			</div>
		</div>
	);
};

const Discount = ({ t }) => {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [state, setState] = useState([]);
	const [loading, setLoading] = useState(false);

	const handlePageChange = (pageNumber) => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAPI({
				page: pageNumber,
			});
		}
	};

	const getAPI = async (params) => {
		setLoading(true);
		const res = await GetNotifications(params);
		if (res.Code === 200) {
			setState(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (!localStorage.getItem('isLogin')) {
			router.push({
				pathname: '/',
			});
		} else {
			let RoleID = parseInt(localStorage.getItem('RoleID'));
			if (RoleID !== 5) {
				localStorage.clear();
				router.push({
					pathname: '/',
				});
			}
		}

		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		getAPI({
			UID: UID,
			Token: Token,
			Page: 1,
		});
		$('body').removeClass('show-aside');
	}, []);

	return (
		<>
			<h1 className="main-title-page">{t('other-announcements')}</h1>
			<div className="blog__wrapper">
				<div className="row row-sm mg-b-25 blog-list">
					{loading ? (
						<>
							{' '}
							<div className="col-md-6 col-lg-4 mg-t-20">
								{' '}
								<BlogItem isLoading={loading} />
							</div>{' '}
							<div className="col-md-6 col-lg-4 mg-t-20">
								{' '}
								<BlogItem isLoading={loading} />
							</div>{' '}
							<div className="col-md-6 col-lg-4 mg-t-20">
								{' '}
								<BlogItem isLoading={loading} />
							</div>{' '}
						</>
					) : !!state && Array.isArray(state) && state.length > 0 ? (
						state.map((item) => (
							<div
								className="col-md-6 col-lg-4 mg-t-20"
								key={item.NotificationID}
							>
								<BlogItem
									NotificationID={item.ID}
									NotificationTitle={item.TitlePost}
									NotificationIMG={item.PostIMG}
									CreatedBy={item.CreatedBy}
									CreatedDate={item.CreatedDate}
									NotificationContent={item.ContentPost}
									URL={item.URL}
									isLoading={loading}
								/>
							</div>
						))
					) : (
						<div className="col-12">
							<span className="tx-danger tx-medium">
								Hiện không có thông báo nào
							</span>
						</div>
					)}
				</div>
				{pageSize < totalResult && (
					<Pagination
						innerClass="pagination justify-content-center"
						activePage={page}
						itemsCountPerPage={pageSize}
						totalItemsCount={totalResult}
						pageRangeDisplayed={3}
						itemClass="page-item"
						linkClass="page-link"
						onChange={handlePageChange.bind(this)}
					/>
				)}
			</div>
		</>
	);
};

// Discount.getLayout = getStudentLayout;
// export default Discount;

Discount.getLayout = getStudentLayout;
Discount.getInitialProps = async () => ({
	namespacesRequired: ['common'],
});

export default withTranslation('common')(Discount);
