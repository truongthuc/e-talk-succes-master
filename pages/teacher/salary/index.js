import React from 'react';
import GridSalary from '~/page-components/teacher/payment/GridSalary';
import ClassesDetail from '~/page-components/teacher/payment/ClassesDetail';
import ParticipationDetail from '~/page-components/teacher/payment/ParticipationDetail';
import BonusAndRewards from '~/page-components/teacher/payment/BonusAndRewards';
import Adjustment from '~/page-components/teacher/payment/Adjustment';
import { getLayout } from '~/components/Layout';
const TeacherPayment = () => {
	return (
		<>
			{/*title trang*/}
			<GridSalary />

			<div className="payment__wrap mg-b-30 mg-t-30">
				<ClassesDetail />
				<ParticipationDetail />
				{/* <BonusAndRewards />
				<Adjustment /> */}
			</div>
		</>
	);
};

TeacherPayment.getLayout = getLayout;

export default TeacherPayment;
