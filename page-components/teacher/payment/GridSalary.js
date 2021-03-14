import React, { useState, useEffect } from 'react';
import styles from './GridSalary.module.scss';
import { getPaymentInfo } from '~/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import Select from 'react-select';
import { appSettings } from '~/config';
import NumberFormat from 'react-number-format';
import { pad } from '~/utils';
import dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const monthOptions = [
	{
		value: 0,
		label: 'January',
	},
	{
		value: 1,
		label: 'February',
	},
	{
		value: 2,
		label: 'March',
	},
	{
		value: 3,
		label: 'April',
	},
	{
		value: 4,
		label: 'May',
	},
	{
		value: 5,
		label: 'June',
	},
	{
		value: 6,
		label: 'July',
	},
	{
		value: 7,
		label: 'August',
	},
	{
		value: 8,
		label: 'September',
	},
	{
		value: 9,
		label: 'October',
	},
	{
		value: 10,
		label: 'November',
	},
	{
		value: 11,
		label: 'December',
	},
];

const typeOptions = [
	{
		value: 1,
		label: '1st to 15th',
	},
	{
		value: 2,
		label: '16th to end',
	},
];

const now = new Date();

const GridSalary = () => {
	const [data, setData] = useState({});
	const [selectedSection, setSelectedSection] = useState(typeOptions[0]);
	const [month, setMonth] = useState(monthOptions[now.getMonth()]);
	const [isLoading, setIsLoading] = useState(true);
	const loadPaymentData = async () => {
		setIsLoading(true);
		const res = await getPaymentInfo({
			Date:
				selectedSection === 1
					? dayjs(
							`${pad(month.value + 1)}/01/${now.getFullYear()}`,
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY')
					: dayjs(
							`${pad(month.value + 1)}/16/${now.getFullYear()}`,
							'MM/DD/YYYY',
					  ).format('DD/MM/YYYY'),
		});
		if (res.Code == 1) setData(res.Data);
		setIsLoading(false);
	};

	useEffect(() => {
		loadPaymentData();
	}, [selectedSection, month]);

	return (
		<>
			<div className="pay-title">
				<div className="d-md-flex justify-content-between align-items-center">
					<h1 className="mg-md-b-0-f main-title-page mg-b-15-f">Salary</h1>
					<div className="d-flex flex-sm-nowrap flex-wrap">
						<span className="pay-title-times mg-sm-r-10 tx-26 wd-sm-auto wd-100p mg-b-10 mg-sm-b-0 d-inline-block">
							<span className="tx-bold">{now.getFullYear()}</span>
						</span>
						<div className="d-flex">
							<div className="mg-r-10 wd-200">
								<Select
									options={typeOptions}
									onChange={setSelectedSection}
									defaultValue={selectedSection}
									styles={appSettings.selectStyle}
									formatOptionLabel={({ value, label }) => {
										return value === 1 ? (
											<span>
												1<sup>st</sup> to 15<sup>th</sup>
											</span>
										) : (
											<span>
												16<sup>th</sup> to end
											</span>
										);
									}}
								/>
								{/* <select className="form-control" value={selectedSection} onChange={(event) => setSelectedSection(event.target.value)} >
                                <option value="1">The first 2 weeks </option>
                                <option value="2">2 weeks later</option>
                            </select> */}
							</div>
							<div className="wd-150 flex-grow-1">
								<Select
									options={monthOptions}
									onChange={setMonth}
									defaultValue={month}
									styles={appSettings.selectStyle}
								/>
								{/* <select className="form-control" value={month} onChange={(event) => setMonth(event.target.value)}>
                                {new Array(12).fill().map((ele, index) => {
                                    return <option key={`${index}`} value={index + 1}>{monthNames[index]}</option>;
                                })}
                            </select> */}
							</div>
						</div>
					</div>
				</div>
			</div>
			<hr className="kengang" />
			{/*Bang luong tong hop*/}
			<div className="d-table wd-100p tb-salary">
				<div className="table-row form-row">
					{/*  <div className="col-lg-4 mg-b-15 mg-lg-b-0">
                        <div className="card ht-100p">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="pay-syn-title">Participation Incentives</p>

                                    <p className="pay-syn-money">{!isLoading ? <NumberFormat value={`${parseFloat(data.FinishedClass) + parseFloat(data.CourseDeduction)}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={20} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Total classes</p>

                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.TotalClasses}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Finished class</p>
                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.FinishedClass}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text mg-b-0">Course deduction</p>
                                    <p className="pay-syn-text mg-b-0">{!isLoading ? <NumberFormat value={`${data.CourseDeduction}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mg-b-15 mg-lg-b-0">
                        <div className="card ht-100p">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="pay-syn-title">Other Incentives</p>

                                    <p className="pay-syn-money">{!isLoading ? <NumberFormat value={`${parseFloat(data.TeacherRefferalFee) + parseFloat(data.NewStudentSignup) + parseFloat(data.Rewards)}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={20} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Teacher Refferal Fee</p>
                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.TeacherRefferalFee}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">New Student Signup</p>
                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.NewStudentSignup}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text mg-b-0">Rewards</p>
                                    <p className="pay-syn-text mg-b-0">{!isLoading ? <NumberFormat value={`${data.Rewards}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mg-b-15 mg-lg-b-0">
                        <div className="card ht-100p">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="pay-syn-title">Adjustments</p>
                                    <p className="pay-syn-money">{!isLoading ? <NumberFormat value={`${parseFloat(data.BaseSalary) + parseFloat(data.Additions) + parseFloat(data.Deductions)}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={20} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Base salary</p>
                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.BaseSalary}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text">Additions</p>

                                    <p className="pay-syn-text">{!isLoading ? <NumberFormat value={`${data.Additions}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="pay-syn-text mg-b-0">Deductions</p>

                                    <p className="pay-syn-text mg-b-0">{!isLoading ? <NumberFormat value={`${data.Deductions}`} displayType={'text'} thousandSeparator={true} suffix={'$'} /> : <Skeleton count={1} width={40} height={15} />}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                 */}

					<div className="col-lg-3 mg-b-15 mg-lg-b-0">
						<div className="card ht-100p">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<p className="pay-syn-title">Classes</p>
									<p className="pay-syn-money">
										{!isLoading ? (
											<NumberFormat
												value={`${parseFloat(data.FinishedClass)}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={20} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Finished classes</p>
									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.FinishedClass}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-3 mg-b-15 mg-lg-b-0">
						<div className="card ht-100p">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<p className="pay-syn-title">Participation Incentives</p>

									<p className="pay-syn-money">
										{!isLoading ? (
											<NumberFormat
												value={`${
													parseFloat(data.ParticipationIncentives) -
													parseFloat(data.CourseDeduction)
												}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={20} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Participation</p>

									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.ParticipationIncentives}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Course Deduction</p>
									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.CourseDeduction}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-3 mg-b-15 mg-lg-b-0">
						<div className="card ht-100p">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<p className="pay-syn-title">Bonus &amp; Rewards</p>

									<p className="pay-syn-money">
										{!isLoading ? (
											<NumberFormat
												value={`${
													parseFloat(data.TeacherRefferalFee) +
													parseFloat(data.NewStudentSignup) +
													parseFloat(data.Rewards)
												}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={20} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Teacher Referral</p>

									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.TeacherRefferalFee}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">New Student Signup</p>
									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.NewStudentSignup}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text mg-b-0">Other rewards</p>
									<p className="pay-syn-text mg-b-0">
										{!isLoading ? (
											<NumberFormat
												value={`${data.Rewards}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-3 mg-b-15 mg-lg-b-0">
						<div className="card ht-100p">
							<div className="card-body">
								<div className="d-flex justify-content-between">
									<p className="pay-syn-title">Adjustments</p>

									<p className="pay-syn-money">
										{!isLoading ? (
											<NumberFormat
												value={`${
													parseFloat(data.Additions) -
													parseFloat(data.Deductions)
												}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={20} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Addition</p>

									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.Additions}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<p className="pay-syn-text">Deduction</p>
									<p className="pay-syn-text">
										{!isLoading ? (
											<NumberFormat
												value={`${data.Deductions}`}
												displayType={'text'}
												thousandSeparator={true}
												suffix={'$'}
											/>
										) : (
											<Skeleton count={1} width={40} height={15} />
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<h4 className="tx-right mg-t-15 tx-normal">
				Net salary:{' '}
				<span className="tx-primary tx-medium">
					{!isLoading ? (
						<NumberFormat
							value={`${data.NetIncome}`}
							displayType={'text'}
							thousandSeparator={true}
							suffix={'$'}
						/>
					) : (
						<Skeleton count={1} width={40} height={25} />
					)}
				</span>
			</h4>
			{/*/Bang luong tong hop*/}
		</>
	);
};

export default GridSalary;
