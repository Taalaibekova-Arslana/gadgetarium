/* eslint-disable prefer-const */
import scss from './ProductsRecom.module.scss';
import { Rate, Skeleton, Tooltip } from 'antd';
import AddBasketButton from '../../../../ui/customButtons/AddBasketButton.tsx';
import { IconFileLike, IconHeart, IconScale } from '@tabler/icons-react';
import ShowMoreButton from '@/src/ui/customButtons/ShowMoreButton.tsx';
import { IconRedHeart } from '@/src/assets/icons';
import { useBasketPutProductMutation } from '@/src/redux/api/basket';
import { useFavoritePutProductMutation } from '@/src/redux/api/favorite';
import { useComparisonPatchProductsMutation } from '@/src/redux/api/comparison';
import { useGetProductsRecomQuery } from '@/src/redux/api/productsRecom/index.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import CustomModal from '@/src/ui/modalAdmin/CustomModal.tsx';
import ModalLogin from '@/src/ui/customModalLogin/ModalLogin.tsx';

const ProductsRecom = () => {
	const [comparisonPatchProduct] = useComparisonPatchProductsMutation();
	const [basketPutProduct] = useBasketPutProductMutation();
	const [putFavoriteProduct] = useFavoritePutProductMutation();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState(false);

	const handleShowAllPhones = (page: number) => {
		let size = 5 + page;
		searchParams.set('RecomPage', '1');
		searchParams.set('RecomSize', size.toString());
		setSearchParams(searchParams);
		navigate(`/?${searchParams.toString()}`);
	};

	const handlePaginationResult = () => {
		searchParams.set('RecomPage', '1');
		searchParams.set('RecomSize', '5');
		setSearchParams(searchParams);
		navigate(`/?${searchParams.toString()}`);
	};

	const { data, isLoading, refetch } = useGetProductsRecomQuery({
		page: `page=${searchParams.get('RecomPage') || ''}`,
		size: `size=${searchParams.get('RecomSize') || ''}`
	});

	const handleScaleClick = async (subGadgetId: number) => {
		if (localStorage.getItem('isAuth') === 'true') {
			await comparisonPatchProduct(subGadgetId);
		} else {
			setOpenModal(true);
		}
		refetch();
	};

	const handleHeartClick = async (subGadgetId: number) => {
		if (localStorage.getItem('isAuth') === 'true') {
			await putFavoriteProduct(subGadgetId);
		} else {
			setOpenModal(true);
		}
		refetch();
	};

	const handleBasket = async (subGadgetId: number) => {
		if (localStorage.getItem('isAuth') === 'true') {
			await basketPutProduct({
				id: subGadgetId,
				basket: false
			});
		} else {
			setOpenModal(true);
		}

		refetch();
	};

	return (
		<div id="популярные категории" className={scss.ProductsRecom}>
			<div className="container">
				<div className={scss.content}>
					<h2 className={scss.recom_text}>Мы рекомендуем</h2>
					<div className={scss.title}>
						<div className={scss.product_cards}>
							{isLoading ? (
								<>
									<Skeleton.Button
										active
										block
										style={{ width: 290, height: 450 }}
									/>
									<Skeleton.Button
										active
										block
										style={{ width: 290, height: 450 }}
									/>
									<Skeleton.Button
										active
										block
										style={{ width: 290, height: 450 }}
									/>
									<Skeleton.Button
										active
										block
										style={{ width: 290, height: 450 }}
									/>
									<Skeleton.Button
										active
										block
										style={{ width: 290, height: 450 }}
									/>
								</>
							) : (
								<>
									{data?.mainPages.map((el) => (
										<div className={scss.div_product_map} key={el.id}>
											<div className={scss.div_icons}>
												<div className={scss.minus_promotion}>
													<IconFileLike />
												</div>
												<div className={scss.div_two_icons}>
													<button
														onClick={() => handleScaleClick(el.subGadgetId)}
													>
														<Tooltip
															title={
																el.comparison
																	? 'Удалить из сравнения'
																	: 'Добавить к сравнению'
															}
															color="#c11bab"
														>
															<IconScale
																className={
																	el.comparison
																		? `${scss.scale} ${scss.active}`
																		: scss.scale
																}
															/>
														</Tooltip>
													</button>
													<Tooltip
														title={
															el.likes
																? 'Удалить из избранного'
																: 'Добавить в избранное'
														}
														color="#c11bab"
													>
														<button
															className={scss.heart}
															onClick={() => handleHeartClick(el.subGadgetId)}
														>
															{el.likes ? <IconRedHeart /> : <IconHeart />}
														</button>
													</Tooltip>
												</div>
											</div>
											<div
												onClick={() =>
													navigate(`/api/gadget/by-id/${el.gadgetId}`)
												}
												className={scss.div_img}
											>
												<img
													className={scss.img_product}
													src={el.image}
													alt={el.nameOfGadget}
												/>
											</div>
											<div className={scss.div_product_contents}>
												<p className={scss.tag_color_green}>
													В наличии ({el.quantity})
												</p>
												<h3>
													{el.nameOfGadget.length > 28 ? (
														<>
															{el.nameOfGadget.slice(0, 22)}
															<Tooltip title={el.nameOfGadget} color="#c11bab">
																<span style={{ cursor: 'pointer' }}>...</span>
															</Tooltip>
														</>
													) : (
														el.nameOfGadget
													)}
												</h3>
												<p>
													Рейтинг{' '}
													<Rate allowHalf disabled defaultValue={el.rating} />(
													{el.rating})
												</p>
												<div className={scss.div_buttons_and_price}>
													<div className={scss.product_price}>
														<h2>{el.price} c</h2>
													</div>
													{el.basket === true ? (
														<button
															onClick={() => navigate('/basket')}
															className={scss.add_bas_button_active}
														>
															Перейти в корзину
														</button>
													) : (
														<AddBasketButton
															onClick={() => handleBasket(el.subGadgetId)}
															className={scss.add_bas_button}
														>
															В корзину
														</AddBasketButton>
													)}
												</div>
											</div>
										</div>
									))}
								</>
							)}
						</div>
						{data?.mainPages.length !== 0 && (
							<div className={scss.show_more_button}>
								{data?.mainPages.length.toString() ===
								(searchParams.get('RecomSize') || '5') ? (
									<ShowMoreButton
										children={'Показать ещё'}
										onClick={() => handleShowAllPhones(data?.mainPages.length)}
									/>
								) : (
									<ShowMoreButton
										children={'Скрыть'}
										onClick={handlePaginationResult}
									/>
								)}
							</div>
						)}
					</div>
				</div>
				<div>
					<CustomModal isModalOpen={openModal} setIsModalOpen={setOpenModal}>
						<ModalLogin setOpenModal={setOpenModal} />
					</CustomModal>
				</div>
			</div>
		</div>
	);
};

export default ProductsRecom;
