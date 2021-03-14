import React from 'react';

const TeacherInformation = ({ IntroduceContent, Experience, Certificate }) => {
	return (
		<>
			<div className="content-block mg-b-30-f">
				<h5 className="main-title">Giới thiệu</h5>
				<div className="introduce-content">{IntroduceContent}</div>
			</div>
			<div className="content-block mg-b-15-f">
				<h5 className="main-title">Học vấn</h5>
				<div className="introduce-content">
					<h5 className="sub-title">
						<i className="fas fa-user-clock mg-r-5"></i>
						Kinh nghiệm
					</h5>
					<div className="table-responsive mg-b-15">
						<table className="table table-borderless table-exp">
							<tbody>
								{!!Experience &&
									Experience.length > 0 &&
									Experience.map((item, index) => (
										<tr key={index}>
											<td className="col-time">
												<span className="from-time">
													{item.Date.split(' - ')[0]}
												</span>
												<span className="icon mg-x-15">
													<i className="fas fa-long-arrow-alt-right"></i>
												</span>
												<span className="to-time">
													{item.Date.split(' - ')[1]}
												</span>
											</td>
											<td className="col-info">
												<p className="role">{item.ExperienceName}</p>
												<p className="description">{item.ExperienceContent}</p>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
					<h5 className="sub-title">
						<i className="fas fa-certificate mg-r-5"></i>Chứng chỉ
					</h5>
					<div className="table-responsive mg-b-30">
						<table className="table table-borderless table-exp">
							<tbody>
								{!!Certificate &&
									Certificate.length > 0 &&
									Certificate.map((item, index) => (
										<tr key={index}>
											<td className="col-time">
												<span className="from-time">{item.Date}</span>
											</td>
											<td className="col-info">
												<p className="role">{item.CertificateName}</p>
												<p className="description">{item.CertificateContent}</p>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default TeacherInformation;
