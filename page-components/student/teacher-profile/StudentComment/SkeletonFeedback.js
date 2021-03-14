import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useWindowSize } from '~/hooks/useWindowSize';
let styleWrapper = {
	margin: '5px',
	padding: '15px',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	borderRadius: '5px',
};

const SkeletonFeedback = () => {
	const { width, height } = useWindowSize();
	return (
		<section>
			<ul className="list pd-l-0-f">
				<li className="card" style={styleWrapper}>
					<div
						className="text-center"
						style={{ width: width > 600 ? '100px' : '60px' }}
					>
						<Skeleton
							circle={true}
							height={width > 600 ? 100 : 60}
							width={width > 600 ? 100 : 60}
						/>
					</div>
					<div
						className="pd-l-15"
						style={{ width: `calc(100% - ${width > 600 ? 100 : 60}px)` }}
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
