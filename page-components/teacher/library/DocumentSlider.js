import React, { useState, useEffect, useRef } from 'react';
import { getLibraryByCategoryID, getListLibraryNew } from '~/api/teacherAPI';
import LibraryCard from './LibraryCard';
import Skeleton from 'react-loading-skeleton';
import './DocumentSlider.module.scss';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
SwiperCore.use([Navigation]);

const SkeletonCourse = () => {
	return (
		<>
			<Skeleton height={100} className="mg-b-5" />
			<Skeleton className="mg-b-5" />
			<Skeleton className="mg-b-5" />
		</>
	);
};

const DocumentSlider = ({
	categoryID,
	slideTitle,
	moreLink,
	titleIcon,
	getNewest = false,
	limitSlide = 5,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [listItems, setListItems] = useState(null);
	const slideRef = useRef(true);

	const getAPI = async () =>
		(await getNewest) === true
			? getListLibraryNew()
			: getLibraryByCategoryID({ CategoryLibraryID: categoryID });

	const getCourseLists = async () => {
		const res = await getAPI();
		res.Code === 1 && setListItems(res.Data);
		setIsLoading(false);
	};

	useEffect(() => {
		getCourseLists();
		return () => {
			slideRef.current = false;
		};
	}, []);

	return (
		<div className="foundations">
			<div className="d-xl-flex align-items-center justify-content-between mg-b-15">
				<h4 className="mg-b-0">
					<FontAwesomeIcon
						icon={titleIcon}
						className={`fas ${titleIcon} mg-r-10-f`}
					/>
					{slideTitle}
				</h4>
				{!!moreLink && (
					<div className="more-btn">
						<a href={true}>More ›</a>
					</div>
				)}
			</div>
			{isLoading ? (
				<div className="d-flex">
					<div className="col-3">
						<SkeletonCourse />
					</div>
					<div className="col-3">
						<SkeletonCourse />
					</div>
					<div className="col-3">
						<SkeletonCourse />
					</div>
					<div className="col-3">
						<SkeletonCourse />
					</div>
				</div>
			) : !!listItems && listItems.length > 0 ? (
				<Swiper
					slidesPerView={2}
					onSlideChange={() => console.log('slide change')}
					onSwiper={(swiper) => console.log(swiper)}
					direction="horizontal"
					loop={false}
					slidesPerVie={2}
					spaceBetween={20}
					navigation
					breakpoints={{
						320: {
							slidesPerView: 2,
							spaceBetween: 20,
						},
						600: {
							slidesPerView: 3,
							spaceBetween: 20,
						},
						992: {
							slidesPerView: 4,
							spaceBetween: 20,
						},
						1400: {
							slidesPerView: limitSlide,
							spaceBetween: 20,
						},
					}}
				>
					{listItems.map((item, index) => (
						<SwiperSlide key={`${item.ID}`}>
							<LibraryCard
								title={item.LibraryName}
								imageUrl={item.BackgroundIMGThumbnails}
								urlDownload={item.LinkFile}
								category={slideTitle}
							/>
						</SwiperSlide>
					))}
					...
				</Swiper>
			) : (
				<h6 className="tx-gray-500">This category not have any documents</h6>
			)}
		</div>
	);
};

DocumentSlider.defaultProps = {
	titleIcon: 'fa-book-open',
};

export default DocumentSlider;
