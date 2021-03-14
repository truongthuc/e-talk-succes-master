import React, { useState, useEffect } from 'react';
import { getLayout } from '~/components/Layout';
import DocumentSlider from '~/page-components/teacher/library/DocumentSlider';
import Skeleton from 'react-loading-skeleton';
import { getListCategoryLibrary } from '~/api/teacherAPI';

const Library = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [categories, setCategories] = useState([]);

	const getCategories = async () => {
		setIsLoading(true);
		const res = await getListCategoryLibrary();
		if (res.Code !== 1) return;
		setCategories(res.Data);
		setIsLoading(false);
	};

	useEffect(() => {
		getCategories();
	}, []);

	return (
		<>
			<h1 className="main-title-page">Libraries</h1>
			<div className="library-wrap">
				{/*s1*/}
				<div className="row mg-b-30">
					<div className="col-sm-12 col-ms-12 bannerAndSlide">
						<div className="banner-slide">
							<DocumentSlider
								categoryID={2}
								slideTitle="New Cirriculum"
								getNewest={true}
							/>
							{/*/foundation*/}
						</div>
					</div>
				</div>
				{!!categories &&
					categories.length > 0 &&
					[...categories].map((category) => (
						<DocumentSlider
							key={`${category.ID}`}
							categoryID={category.ID}
							slideTitle={category.CategoryLibrary}
						/>
					))}
			</div>
		</>
	);
};

Library.getLayout = getLayout;

export default Library;
