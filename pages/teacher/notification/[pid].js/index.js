import React, { useState, useEffect, useReducer } from 'react';
import { getNotificationDetailAPI } from '~/api/studentAPI';
import { getFormattedDate } from '~/utils';
import { getLayout } from '~/components/Layout';
import dayjs from 'dayjs';
import './index.module.scss';
const fakeData = {
	CreatedBy: 'Admin',

	CreatedDate: '2020-10-06T23:43:02.4839004+07:00',

	NotificationContent: `
    E-talk khuyến khích học viên giới thiệu bạn bè đến cùng học tại E-talk.vn, để nhận được <strong>điểm thưởng dưới dạng&nbsp;voucher - ưu đãi học phí cho cả 2 bạn.</strong></p>
    <p><u><strong>1. Nội dung:</strong></u></p>
    <p><strong>Cứ giới thiệu thành công 1 bạn bè</strong> cùng học tại&nbsp;E-talk, cả 2 bạn sẽ nhận được <strong>100,000 vnđ cho mỗi bạn</strong>&nbsp;(sử dụng được cho tất cả&nbsp;khóa học tại E-talk).</p>
    <p><strong>Giới thiệu càng nhiều, ưu đãi càng nhiều</strong></p>
    <p><u><strong>2. Cách thức tham gia:</strong></u></p>
    <p>Mỗi học viên E-talk đều&nbsp;có 1 link chia sẻ với Code riêng biệt.</p>
    <p>Bạn hãy&nbsp;dùng link này để giới thiệu/ chia sẻ E-talk với người thân/ bạn bè qua&nbsp;Mail/ Facebook hoặc các công cụ khác. Khi bạn bè/ người thân của bạn dùng link này để vào E-talk và đăng kí thành công khóa học (trở thành Học viên mới của E-talk), cả 2 bạn sẽ được nhận ngay:</p>
    <ul>
      <li>Học viên mới (người được giới thiệu): nhận ưu đãi 100,000 vnđ, áp dụng ngay cho khóa học vừa đăng ký</li>
      <li>Học viên cũ (người giới thiệu): nhận điểm thưởng 100,000 vnđ, áp dụng giảm trừ vào học phí cho tất cả khóa học tại E-talk. Và được cộng dồn. Ví dụ : Giới thiệu thành công 5 người, khóa học tiếp theo bạn được giảm 500.000 đ.&nbsp;</li>
    </ul>
    <p>Khi giới thiệu thành công, bạn sẽ nhận được thông báo tại trang:</p>
    <p>[Mypage.e-talk.vn --&gt;&nbsp;Giới thiệu bạn bè --&gt;&nbsp;Báo cáo]</p>
    <p><u><strong>3. Điều kiện &amp; Điều khoản tham gia:</strong></u></p>
    <p>Để tham gia chương trình “ Thêm bạn – Thêm vui” một cách hợp lệ học viên lưu ý:</p>
    <ul style="list-style-type:square">
      <li>Người tham gia giới thiệu phải là học viên tại E-Talk</li>
      <li>Người được giới thiệu phải hoàn toàn mới tại E-Talk.</li>
      <li>Link dùng để giới thiệu/ chia sẻ: [Mypage.e-talk.vn --&gt; Giới thiệu bạn --&gt; Nội dung]</li>
      <li>Số lượng giới thiệu không giới hạn.&nbsp;<strong>Giới thiệu được xem là thành công</strong>&nbsp;khi người được giới thiệu hoàn thành học phí và thủ tục nhập học</li>
      <li>Học viên được giới thiệu bởi nhiều người thì chỉ được tính cho người giới thiệu cuối cùng (VD: Học viên A được giới thiệu bởi B và C thì link được A click vào cuối cùng của ai sẽ&nbsp;được tính ưu đãi cho người đó)</li>
      <li>Học viên giới thiệu thành công được cập nhật tại:&nbsp;Mypage.e-talk.vn --&gt; Giới thiệu bạn --&gt; Báo cáo</li>
      <li>Chỉ áp dụng giảm trừ học phí cho khóa học tại E-talk, không có giá trị quy đổi thành tiền hay chuyển nhượng.</li>
      <li>Điều kiện và điều khoản chung được áp dụng.</li>
    </ul>
    <p>Chương trình áp dùng động thời cùng chương trình nộp học phí qua tài khoản ngân hàng được tặng thêm 1 buổi học cho khóa học phản xạ.</p>
    <p><u><strong>4. Thời gian áp dụng: </strong></u>từ 10/10 cho đến khi có thông báo mới</p>
    <p><u><strong>5. Hotline:</strong></u>&nbsp;0903 329 682/ 0972 917 027</p></div>`,

	NotificationID: 1,

	NotificationIMG:
		'https://www.campusfrance.org/sites/default/files/parrainage.jpg',

	NotificationTitle: 'Chương Trình “Giúp Bạn Học Ngay, Nhận Quà Liền Tay',
};

const BlogDetail = () => {
	const [state, setState] = useState(null);
	const [loading, setLoading] = useState(false);

	const getAPI = async (params) => {
		setLoading(true);
		const res = await getNotificationDetailAPI(params);
		if (res.Code === 1) {
			setState(res.Data);
		}
		setState(fakeData);
		setLoading(false);
	};

	useEffect(() => {
		let search = window.location.search;
		let params = new URLSearchParams(search);
		let ID = params.get('ID');
		getAPI({
			NotificationID: ID,
		});
	}, []);

	return (
		<>
			{loading ? (
				<></>
			) : (
				<>
					{!!state ? (
						<>
							<div className="banner-blog">
								<div className="post-detail-cover">
									<img
										src={state.NotificationIMG}
										alt="banner"
										className="banner-img"
									/>
								</div>
							</div>
							<div className="content-blog pd-15">
								<div className="post-content">
									<div className="thread_title">
										<span>{state.NotificationTitle}</span>
									</div>
									<div className="author">
										{/* <a href={"#"} className="avatar">
              <img src={state.IMG ? state.IMG : "../assets/img/default-avatar.png"} alt="avatar" />
              </a> */}
										<div className="author-information">
											<span className="main-color bg-transparent username">
												<span className="hasVerifiedBadge">
													{state.CreatedBy}
												</span>
											</span>
											<div className="date-comment-view">
												<span className="date">
													<span
														className="DateTime"
														title={dayjs(state.CreatedDate).format('LLLL')}
													>
														{getFormattedDate(state.CreatedDate)}
													</span>
												</span>
											</div>
										</div>
									</div>
									<article
										dangerouslySetInnerHTML={{
											__html: state.NotificationContent,
										}}
									></article>
								</div>
							</div>
						</>
					) : (
						<div className="card card-custom shadow">
							<div className="card-body tx-center">
								<span className="d-block tx-center tx-danger tx-medium">
									Không có thông báo nào
								</span>
								<img
									src="/static/img/no-data.svg"
									alt="banner"
									className="wd-200 mg-b-15"
								/>
							</div>
						</div>
					)}{' '}
				</>
			)}
		</>
	);
};
BlogDetail.getLayout = getLayout;
export default BlogDetail;
