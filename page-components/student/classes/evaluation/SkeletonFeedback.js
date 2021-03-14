import React, { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

let styleWrapper = {
	margin: '5px',
	padding: '15px',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	borderRadius: '5px',
};

let widthScreen;

const SkeletonFeedback = () => {
	useEffect(() => {
		widthScreen = window.innerWidth;
	});
	return (
		<section>
			<ul className="list pd-l-0-f">
				<li className="card" style={styleWrapper}>
					<div
						className="text-center"
						style={{ width: widthScreen > 600 ? '100px' : '60px' }}
					>
						<Skeleton
							circle={true}
							height={widthScreen > 600 ? 100 : 60}
							width={widthScreen > 600 ? 100 : 60}
						/>
					</div>
					<div
						className="pd-l-15"
						style={{ width: `calc(100% - ${widthScreen > 600 ? 100 : 60}px)` }}
					>
						<Skeleton className="mb-2" height={20} width={50} />
						<br />
						<Skeleton className="mb-2" height={70} width={`100%`} />
						<br />
						<Skeleton className="mb-2" height={20} width={`90%`} />
						<br />
						<Skeleton className="mb-2" height={20} width={50} />
						<br />
					</div>
				</li>
			</ul>
		</section>
	);
};

export default SkeletonFeedback;
