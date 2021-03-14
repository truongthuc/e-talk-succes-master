import React from 'react';
import Skeleton from 'react-loading-skeleton';

let styleWrapper = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
};
const SkeletonLessonDetail = () => {
	return (
		<section className="mb-3">
			<div style={styleWrapper}>
				<div className="w-50 pr-2">
					<Skeleton height={30} width={`70%`} />
					<div className="mt-2">
						<Skeleton height={150} width={`100%`} />
					</div>
				</div>
				<div className="w-50 pl-2">
					<Skeleton height={30} width={`30%`} />
					<div className="mt-2">
						<Skeleton height={150} width={`100%`} />
					</div>
				</div>
			</div>
			<div className="mt-3">
				<Skeleton height={50} width={`100%`} />
			</div>
			<div className="mt-3">
				<Skeleton height={150} width={`100%`} />
			</div>
		</section>
	);
};

export default SkeletonLessonDetail;
