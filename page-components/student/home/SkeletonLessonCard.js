import React from 'react';
import Skeleton from 'react-loading-skeleton';

let styleWrapper = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
};
let styleSection = {
	border: '1px solid #e1e1e1',
	borderRadius: '10px',
	padding: '10px',
	margin: '10px 0',
};
const SkeletonLessonCard = () => {
	return (
		<section style={styleSection}>
			<div style={styleWrapper}>
				<div className="pr-1" style={{ width: '30%' }}>
					<Skeleton width={`100%`} height={200} />
				</div>
				<div className="pl-1" style={{ width: '70%' }}>
					<div className="w-100 mb-2">
						<Skeleton width={`30%`} height={20} />
					</div>
					<div className="w-100 mb-2">
						<Skeleton width={`50%`} height={30} />
					</div>
					<div className="w-100 mb-4">
						<Skeleton width={`80%`} height={40} />
					</div>
					<div className="w-100">
						<Skeleton width={100} height={40} />
					</div>
				</div>
			</div>
		</section>
	);
};

export default SkeletonLessonCard;
