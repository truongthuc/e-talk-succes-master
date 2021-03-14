import React, { useState, useEffect } from 'react';
import { getPaymentHistory } from '~/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'react-js-pagination';
import NumberFormat from 'react-number-format';
import { Accordion, Card, Button } from 'react-bootstrap';
import { randomId } from '~/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const fakeData = [
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
];

const RenderRow = ({ data, ...others }) => {
	const { scheduleTime, lessonName, studentName, finishType, amount } = data;
	return (
		<tr>
			<td data-title="No." className="tx-center">
				{others.number + 1 || 0}
			</td>
			<td data-title="Schedule time" className="tx-nowrap">
				{scheduleTime}
			</td>

			<td data-title="Lesson name" className="tx-center">
				{lessonName}
			</td>
			<td data-title="Lesson name" className="tx-center">
				{studentName}
			</td>
			<td data-title="Finish type" className="tx-center">
				{finishType}
			</td>
			<td data-title="Amount" className="tx-center">
				<NumberFormat
					value={`${amount}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>
		</tr>
	);
};

const ParticipationDetail = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const loadClassesAPI = async () => {
		setIsLoading(true);
		const params = {
			Page: parseInt(pageNumber), //Int
		};
		const res = await getPaymentHistory(params);
		//res.Code === 1 ? setData(res.Data) : setData([]);
		setPageSize(10);
		setTotalResult(fakeData.length);
		setData(fakeData);
		setIsLoading(false);
		console.log('fakeDataLenght', fakeData.length);
	};

	useEffect(() => {
		loadClassesAPI();
	}, [pageNumber]);

	useEffect(() => {
		console.log(fakeData);
	}, [pageSize, totalResult]);

	return (
		<>
			<div className="mg-b-30">
				<Accordion>
					<Card>
						<Accordion.Toggle as={Card.Header} eventKey="0">
							<div className="d-flex align-items-center justify-content-between">
								<div className="d-flex align-items-center  flex-grow-1">
									<h5 className="tx-dark mg-lg-b-0 mg-b-0">
										Participation Incentives
									</h5>
									<div className="v-divider"></div>
									<p className="mg-b-0 tx-20 tx-bold tx-primary">450$</p>
								</div>

								<span className="tx-black btn-collapse">
									<FontAwesomeIcon
										icon="caret-down"
										className="fas fa-caret-down"
									/>
								</span>
							</div>
						</Accordion.Toggle>
						<Accordion.Collapse eventKey="0">
							<Card.Body>
								<div className="">
									<table className="table tx-center table-small">
										<thead className="bg-light">
											<tr>
												<th>Unit Price ($)</th>
												<th>Quantity</th>
											</tr>
										</thead>
										<tbody>
											<tr className="bd-b ">
												<td>$1.00</td>
												<td>115</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div className="mg-t-30">
									<table className="table responsive-table-vertical table-schedule-log table-hover table-small">
										<thead className="bg-light">
											<tr className="gv-bg-table">
												<th className="tx-center">No.</th>
												<th className="tx-left">Schedule Time</th>
												<th className="tx-center">Lession Name</th>
												<th className="tx-center">Student Name</th>
												<th className="tx-center">Finish Type</th>
												<th className="tx-center">Amount ($)</th>
											</tr>
										</thead>
										<tbody>
											{isLoading ? (
												<>
													<tr>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
													</tr>
													<tr>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
													</tr>
													<tr>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
													</tr>
													<tr>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
													</tr>
												</>
											) : !!data && !!data.length > 0 ? (
												data.map((item, index) => (
													<RenderRow
														key={`${index}`}
														data={item}
														number={index}
													/>
												))
											) : (
												<tr>
													<td colSpan={4}>
														<span className="tx-danger d-block tx-center tx-medium tx-16">
															No classes record.
														</span>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
								<div className="d-flex flex-wrap justify-content-between mg-t-15">
									<div className="tx-gray-500 mg-y-10">
										Total records: {totalResult}
									</div>
									{totalResult > pageSize && (
										<Pagination
											innerClass="pagination"
											activePage={pageNumber}
											itemsCountPerPage={pageSize}
											totalItemsCount={totalResult}
											pageRangeDisplayed={5}
											onChange={(page) => setPageNumber(page)}
											itemClass="page-item"
											linkClass="page-link"
											activeClass="active"
										/>
									)}
								</div>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
				</Accordion>
			</div>
		</>
	);
};

export default ParticipationDetail;
