/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react';
import scss from './WrapperPay.module.scss';
import {
	Link,
	Route,
	Routes,
	useLocation,
	useNavigate
} from 'react-router-dom';
import Delivery from '@/src/pagesUser/components/pages/placingAnOrder/Delivery.tsx';
import Review from '@/src/pagesUser/components/pages/placingAnOrder/Review.tsx';
import { useGetBasketOrderGadgetQuery } from '@/src/redux/api/basket';
import Payment from './Payment';

const WrapperPay: FC = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { data: basketOrder } = useGetBasketOrderGadgetQuery([
		window.location.search.substring(1)
	]);


	const handleMain = () => {
		navigate('/');
	};
	const handleBasket = () => {
		navigate(`/basket?${window.location.search.substring(1)}`);
	};
	const handleDecor = () => {
		navigate(`/pay/delivery`);
	};

	const handleNavigateEdit = () => {
		navigate('/basket');
	};



	return (
		<>
			<section className={scss.WrapperPay}>
				<div className="container">
					<div className={scss.content}>
						<div className={scss.bread_crumbs}>
							<span onClick={handleMain}> Главная »</span>
							<span onClick={handleBasket}> Корзина »</span>{' '}
							<span className={scss.decor} onClick={handleDecor}>
								Оформление заказа
							</span>
						</div>
						<h1>Оформление заказа</h1>
						<hr />
						<div className={scss.left_and_right_block}>
							{/*!left_block*/}
							<div className={scss.left_block}>
								<div>
									<div className={scss.transition_numbers}>
										<div className={scss.number_one}>
											<Link
												to={`/pay/delivery`}
												className={
													pathname === '/pay/delivery' ||
													pathname === '/pay/payment' ||
													pathname === '/pay/review'
														? `${scss.delivery_link} ${scss.active}`
														: `${scss.delivery_link}`
												}
											>
												1
											</Link>
											<div
												className={
													pathname === '/pay/delivery' ||
													pathname === '/pay/payment' ||
													pathname === '/pay/review'
														? `${scss.line} ${scss.active}`
														: `${scss.line}`
												}
											></div>
											<p>Варианты доставки</p>
										</div>
										<div className={scss.number_two}>
											<Link
												// onClick={() =>
												// 	navigateWithValidation(
												// 		`/pay/payment?${window.location.search.substring(1)}`
												// 	)
												// }
												to={`/pay/payment?${window.location.search.substring(1)}`}
												className={
													pathname === '/pay/payment' ||
													pathname === '/pay/review'
														? `${scss.payment_link} ${scss.active}`
														: `${scss.payment_link}`
												}
											>
												2
											</Link>
											<p>Оплата</p>
										</div>
										<div className={scss.number_three}>
											<Link
												// onClick={() =>
												// 	navigateWithValidation(
												// 		`/pay/review?${window.location.search.substring(1)}`
												// 	)
												// }
												to={`/pay/review?${window.location.search.substring(1)}`}
												className={
													pathname === '/pay/review'
														? `${scss.review_link} ${scss.active}`
														: `${scss.review_link}`
												}
											>
												3
											</Link>
											<div
												className={
													pathname === '/pay/review'
														? `${scss.line} ${scss.active}`
														: `${scss.line}`
												}
											></div>
											<p>Обзор заказа</p>
										</div>
									</div>
								</div>
								<div className={scss.content_routes}>
									<Routes>
										<Route
											path="/delivery"
											element={
												// <Delivery onCompletion={handleDeliveryCompletion} />
												<Delivery />
											}
										/>
										<Route path="/payment" element={<Payment />} />
										<Route path="/review" element={<Review />} />
									</Routes>
								</div>
							</div>
							{/*!right_block*/}
							<div className={scss.right_block}>
								<div className={scss.order_price}>
									<div className={scss.card_order_price}>
										<div className={scss.title}>
											<p>Сумма заказа</p>
											<h5
												style={{ cursor: 'pointer' }}
												onClick={handleNavigateEdit}
											>
												Изменить
											</h5>
										</div>
										<div className={scss.line}>.</div>
										<div>
											<p className={scss.quantity_order}>
												Количество товаров:
												<span> {basketOrder?.basketAmounts.quantity} шт</span>
											</p>
											<p className={scss.your_seil}>
												Ваша скидка:
												<span>{basketOrder?.basketAmounts.discountPrice}с</span>
											</p>
											<p className={scss.sum}>
												Сумма:
												<span>{basketOrder?.basketAmounts.price} с</span>
											</p>
										</div>
										<h4 className={scss.total}>
											Итого:{' '}
											<span>{basketOrder?.basketAmounts.currentPrice} с</span>
										</h4>
									</div>
									<div className={scss.cards_phones}>
										{basketOrder?.gadgetResponse.map((item) => (
											<div key={item.id} className={scss.phone_card}>
												<img className={scss.image} src={item.image} alt="" />
												<div className={scss.phone_texts}>
													<p className={scss.name}>{item.nameOfGadget}</p>
													<p>Артикул:{item.article}</p>
													<p> Кол-во:{item.quantity}</p>
													<p>Размер:{item.memory}</p>
													<p>Цвет:{item.colour}</p>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
export default WrapperPay;
