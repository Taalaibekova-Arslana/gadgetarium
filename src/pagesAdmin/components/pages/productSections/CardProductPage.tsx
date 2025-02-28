/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-explicit-any */
import scss from './CardProductPage.module.scss';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useState } from 'react';
import {
	IconArrowLeft,
	IconArrowRight,
	IconFileLike,
	IconTrash
} from '@tabler/icons-react';
import {
	Button,
	ConfigProvider,
	InputNumber,
	Modal,
	Rate,
	Tooltip
} from 'antd';
import ColorButton from '@/src/ui/colours/Colour';
import InfoProduct from './InfoProduct';
import { ProductDetails } from './ProductDetails';
import { useDeleteGoodsGadgetMutation } from '@/src/redux/api/goods';
import { useGetCardProductQuery } from '@/src/redux/api/cardProductPage';
import { useGetProductsColorsApiQuery } from '@/src/redux/api/productColorApi';
import { useGetProductMemoryQuery } from '@/src/redux/api/memoryForProductApi';
import { useGetCharacteristicsProductQuery } from '@/src/redux/api/characteristicsAPI';

const CardProductPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteByIdApi] = useDeleteGoodsGadgetMutation();
	const [subGadgetId, setSubGadgetId] = useState<number>(0);
	const [countIsProduct, _] = useState<string>('1');
	const [countInput, setCountInput] = useState<string>('1');
	const { productId } = useParams();
	const { data: characteristicsApi } = useGetCharacteristicsProductQuery(
		productId!
	);
	const [isSlider, setIsSlider] = useState<number>(1);
	const [sliderResult, setSliderresult] = useState<number>(0);
	const [contentIsModal, setContentIsModal] = useState<string>('');
	const [modal2Open, setModal2Open] = useState(false);
	const navigate = useNavigate();
	const { data: productColor } = useGetProductsColorsApiQuery(productId!);
	const { data, isLoading, refetch } = useGetCardProductQuery({
		id: Number(productId),
		color: searchParams.get('color') ? searchParams.toString() : '',
		memory: searchParams.get('memory')
			? `memory=${searchParams.get('memory')}`
			: '',
		quantity: searchParams.get('quantity')
			? `quantity=${searchParams.get('quantity')}`
			: ''
	});
	const { data: productMemoryData } = useGetProductMemoryQuery({
		gadgetId: Number(productId),
		color: `color=${data?.mainColour}`
	});
	const [resultProductPage, setResultProductPage] = useState<boolean>(true);
	const handleIndexSlider = (index: number) => {
		if (index === 0) {
			setIsSlider(1);
			setSliderresult(0);
		} else if (index === 1) {
			setIsSlider(2);
			setSliderresult(1);
		} else if (index === 2) {
			setIsSlider(3);
			setSliderresult(2);
		} else if (index === 3) {
			setIsSlider(4);
			setSliderresult(3);
		} else if (index === 4) {
			setIsSlider(5);
			setSliderresult(4);
		} else if (index === 5) {
			setIsSlider(6);
			setSliderresult(5);
		} else if (index === 6) {
			setIsSlider(7);
			setSliderresult(6);
		}
	};

	const hnadleModalDelete = (id: number) => {
		setSubGadgetId(id);
		setDeleteModal(true);
	};
	async function handleDeleteProductById() {
		try {
			await deleteByIdApi(subGadgetId);
			setDeleteModal(false);
			refetch();
			if (!data) {
				navigate('/admin');
			}
		} catch (error) {
			console.error(error);
		}
	}

	const handleColorProductFunk = (color: string) => {
		searchParams.set('color', color);
		searchParams.delete('memory');
		setSearchParams(searchParams);
		// navigate(`/api/gadget/by-id/${productId}?${searchParams.toString()}`);
	};

	const handleMinuesProductQuantity = () => {
		setCountInput((prevValue) => {
			const newValue = Math.max((parseInt(prevValue) || 0) - 1, 1);
			searchParams.set('quantity', newValue.toString());
			setSearchParams(searchParams);
			return newValue.toString();
		});
	};

	const changeCountInputFunk = (event: string | number | null) => {
		if (event !== null) {
			const newValue = event.toString();
			setCountInput(newValue);
			searchParams.set('quantity', newValue);
			setSearchParams(searchParams);
		}
	};

	const handleEnterCountProduct = () => {
		searchParams.set('quantity', countInput);
		setSearchParams(searchParams);
	};

	const handleCountProduct = () => {
		setCountInput((prevValue) => {
			const newValue = (parseInt(prevValue) || 0) + 1;
			searchParams.set('quantity', newValue.toString());
			setSearchParams(searchParams);
			return newValue.toString();
		});
	};

	const handleMemoryProductFunk = (memory: string) => {
		searchParams.set('memory', memory);
		setSearchParams(searchParams);
		// navigate(`/api/gadget/by-id/${productId}?${searchParams.toString()}`);
	};

	return (
		<>
			<section className={scss.CardProductPage}>
				<div className="container">
					{isLoading ? (
						<h1>IsLoading...</h1>
					) : (
						<div className={scss.content}>
							<div className={scss.content_main_text_page}>
								<div className={scss.div_content_product_and_pages}>
									<p onClick={() => navigate('/admin')}>Товары »</p>
									{resultProductPage ? (
										<p onClick={() => navigate('')}>{data?.nameOfGadget}</p>
									) : (
										<p>Детали товара</p>
									)}
								</div>
								<div className={scss.div_brad_product}>
									{resultProductPage ? (
										data?.brandLogo ? (
											<img src={data?.brandLogo} alt="logo" />
										) : (
											<h2>{data?.nameOfGadget}</h2>
										)
									) : (
										<h2 className={scss.product_details_text}>Детали товара</h2>
									)}
									<div></div>
								</div>
							</div>
							<div className={scss.product_buttons}>
								<button
									className={
										resultProductPage
											? `${scss.button_noo_active} ${scss.button_active}`
											: `${scss.button_noo_active}`
									}
									onClick={() => setResultProductPage(true)}
								>
									Товар
								</button>
								<button
									className={
										!resultProductPage
											? `${scss.button_noo_active} ${scss.button_active}`
											: `${scss.button_noo_active}`
									}
									onClick={() => setResultProductPage(false)}
								>
									Детали товара
								</button>
							</div>
							{resultProductPage ? (
								<div className={scss.display_keen_slider}>
									<div className={scss.slider_div_contents}>
										<div className={scss.slider_div}>
											{data?.images
												.slice(sliderResult, isSlider)
												.map((item, index) => (
													<img
														onClick={() => {
															setContentIsModal(item);
															setModal2Open(!modal2Open);
														}}
														src={item}
														key={index}
														alt={data.nameOfGadget}
													/>
												))}
										</div>
										<div className={scss.photosProduct}>
											<IconArrowLeft
												style={
													sliderResult === 0
														? { color: 'black' }
														: { color: 'rgb(203, 17, 171)', cursor: 'pointer' }
												}
												onClick={() => {
													if (isSlider === 1 && sliderResult === 0) {
														null;
													} else {
														setIsSlider((prevValue) => prevValue - 1);
														setSliderresult((prevValue) => prevValue - 1);
													}
												}}
											/>
											{data?.images.slice(0, 6)?.map((item, index) => (
												<>
													<div
														className={
															index === sliderResult
																? `${scss.slider_photos_div} ${scss.activeBorder}`
																: `${scss.slider_photos_div}`
														}
														key={index}
													>
														<img
															onClick={() => handleIndexSlider(index)}
															src={item}
															alt={data.nameOfGadget}
														/>
													</div>
												</>
											))}
											<IconArrowRight
												style={
													sliderResult === 5
														? { color: 'black' }
														: { color: 'rgb(203, 17, 171)', cursor: 'pointer' }
												}
												onClick={() => {
													if (isSlider === 6 && sliderResult === 5) {
														null;
													} else {
														setIsSlider((prevValue) => prevValue + 1);
														setSliderresult((prevValue) => prevValue + 1);
													}
												}}
											/>
										</div>
									</div>
									<div className={scss.product_info}>
										<h3>
											{data?.nameOfGadget.length! > 28 ? (
												<>
													{data?.nameOfGadget.slice(0, 22)}
													<Tooltip>
														<span style={{ cursor: 'pointer' }}>...</span>
													</Tooltip>
												</>
											) : (
												data?.nameOfGadget
											)}
										</h3>
										<div className={scss.product_content}>
											<div className={scss.border_and_contents}>
												<div className={scss.product_rating_and_numbers}>
													<p className={scss.text_buy_product}>
														В наличии {data?.quantity}
													</p>
													<p>
														Артикул: <span>{data?.articleNumber}</span>
													</p>
													<div>
														<Rate defaultValue={data?.rating} />
														<p>({data?.rating.toLocaleString()})</p>
													</div>
												</div>
												<div></div>
											</div>
											<div className={scss.colors_and_price_info_div_product}>
												<div className={scss.title_texts_and_price}>
													<h3>Цвет товара:</h3>
													<h3>Количество:</h3>
													<div className={scss.prices_div}>
														{data?.percent !== 0 && (
															<div
																className={
																	data?.percent !== 0
																		? `${scss.noo_active_percent} ${scss.active_percent_div}`
																		: `${scss.noo_active_percent}`
																}
															>
																{data?.percent} %
															</div>
														)}
														{data?.newProduct && data.percent === 0 && (
															<div
																className={
																	data.newProduct && data.percent === 0
																		? `${scss.new_product} ${scss.active_new_product}`
																		: `${scss.new_product}`
																}
															>
																New
															</div>
														)}
														{data?.recommend && data.percent === 0 && (
															<div
																className={
																	data.recommend && data.percent === 0
																		? `${scss.noo_active_percent} ${scss.active_recommend}`
																		: `${scss.noo_active_percent}`
																}
															>
																<IconFileLike />
															</div>
														)}
														<h2>{data?.price} c</h2>
														{data?.percent !== 0 && (
															<h3 className={scss.previous_price}>
																{data?.currentPrice} c
															</h3>
														)}
													</div>
												</div>
												<div className={scss.product_colors_and_content}>
													<div className={scss.product_colors}>
														{productColor?.map((el, index) => (
															<div key={index}>
																<ColorButton
																	onClick={() => {
																		handleColorProductFunk(el);
																	}}
																	width="26px"
																	height="26px"
																	backgroundColor={el}
																/>
															</div>
														))}
													</div>
													<div className={scss.div_buttons_counts}>
														<button onClick={handleMinuesProductQuantity}>
															-
														</button>
														{/* <ConfigProvider
														theme={{
															components: {
																InputNumber: {
																	colorText: 'rgb(43, 44, 47)',
																	algorithm: true
																}
															}
														}}
													> */}
														<InputNumber
															className={scss.input_for_quantity}
															min={1}
															max={data?.quantity}
															// defaultValue={data?.quantity}
															defaultValue={Number(
																searchParams.get('quantity')
																	? searchParams.get('quantity')
																	: countIsProduct
															)}
															type="text"
															onChange={changeCountInputFunk}
															value={Number(
																searchParams.get('quantity')
																	? searchParams.get('quantity')
																	: countInput
															)}
															onKeyPress={(
																e: React.KeyboardEvent<HTMLInputElement>
															) => {
																if (e.key === 'Enter') {
																	handleEnterCountProduct();
																}
															}}
														/>
														{/* </ConfigProvider> */}
														<button onClick={handleCountProduct}>+</button>
													</div>
													<div className={scss.border_div}></div>
												</div>
												<div className={scss.product_info_container}>
													<div
														className={scss.product_info_main_text_and_buttons}
													>
														<h3>Коротко о товаре:</h3>
														<div
															className={scss.div_buttons_favorite_and_basket}
														>
															<button
																className={scss.nooActiveButton}
																onClick={() =>
																	data && hnadleModalDelete(data?.subGadgetId)
																}
															>
																<IconTrash color="rgb(144, 156, 181)" />
															</button>
															<Button
																onClick={() =>
																	navigate(`/admin/edit-page/${data?.gadgetId}`)
																}
																className={scss.add_bas_button}
															>
																редактировать
															</Button>
														</div>
													</div>
													<div className={scss.buttons_for_memory}>
														{productMemoryData &&
															productMemoryData?.map((el, index) => (
																<Button
																	onClick={() => {
																		handleMemoryProductFunk(el);
																	}}
																	className={scss.active_memory_button}
																	key={index}
																>
																	{el}
																</Button>
															))}
													</div>
													<div className={scss.info_product}>
														{characteristicsApi?.mainCharacteristics.Экран &&
															characteristicsApi.mainCharacteristics.Экран
																.Размер && (
																<div className={scss.div_screen}>
																	<p>
																		Экран............................................
																	</p>
																	<h4>
																		{
																			characteristicsApi?.mainCharacteristics
																				.Экран.Размер
																		}
																	</h4>
																</div>
															)}
														<div className={scss.div_screen}>
															<p>
																Цвет..............................................
															</p>
															<h4>{data?.mainColour}</h4>
														</div>
														<div className={scss.div_screen}>
															<p>Дата выпуска..............................</p>
															<h4>{data?.releaseDate}</h4>
														</div>

														<div className={scss.div_screen}>
															<p>
																Память.........................................
															</p>
															<h4>{data?.memory}</h4>
														</div>
														<div className={scss.div_screen}>
															<p>
																SIM-карты...................................
															</p>
															<h4>{data?.countSim}</h4>
														</div>
														<div className={scss.div_screen}>
															<p>Гарантия (месяцев)...................</p>
															<h4>{data?.warranty}</h4>
														</div>
														{characteristicsApi?.mainCharacteristics
															.Производительность &&
															characteristicsApi.mainCharacteristics
																.Производительность.Чипсет && (
																<div className={scss.div_screen}>
																	<p>Производительность.................</p>
																	<h4>
																		{
																			characteristicsApi.mainCharacteristics
																				.Производительность.Чипсет
																		}
																	</h4>
																</div>
															)}

														{characteristicsApi?.mainCharacteristics[
															'Дизайн и корпус'
														] &&
															characteristicsApi.mainCharacteristics[
																'Дизайн и корпус'
															].Вес && (
																<div className={scss.div_screen}>
																	<p>Производительность.................</p>
																	<h4>
																		{
																			characteristicsApi.mainCharacteristics[
																				'Дизайн и корпус'
																			].Вес
																		}
																	</h4>
																</div>
															)}
														{characteristicsApi?.mainCharacteristics.Батарея &&
															characteristicsApi.mainCharacteristics.Батарея[
																'Беспроводная зарядка'
															] && (
																<div className={scss.div_screen}>
																	<p>
																		Батарея........................................
																	</p>
																	<h4>
																		{
																			characteristicsApi.mainCharacteristics
																				.Батарея['Беспроводная зарядка']
																		}
																	</h4>
																</div>
															)}

														<div className={scss.div_screen}>
															<p>
																Процент.......................................
															</p>
															<h4>{data?.percent}</h4>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							) : (
								<ProductDetails />
							)}
						</div>
					)}
				</div>
				{resultProductPage && <InfoProduct />}
			</section>
			<ConfigProvider
				theme={{
					components: {
						Modal: {
							colorBgElevated: 'white',
							algorithm: true
						}
					}
				}}
			>
				<Modal
					title="Iphones"
					centered
					open={modal2Open}
					onOk={() => setModal2Open(false)}
					onCancel={() => setModal2Open(false)}
				>
					<div className={scss.container_modal_img}>
						<img
							className={scss.modal_img}
							src={contentIsModal}
							alt={data?.nameOfGadget}
						/>
					</div>
				</Modal>
				<Modal
					onOk={() => setDeleteModal(false)}
					onCancel={() => setDeleteModal(false)}
					centered
					open={deleteModal}
					footer={false}
				>
					<div className={scss.container_modal_img}>
						<div className={scss.content_delete_for_div}>
							<h3>Вы уверены, что хотите удалить товар?</h3>
							<div className={scss.buttons}>
								<Button
									className={scss.button_cancel}
									onClick={() => setDeleteModal(false)}
								>
									Отменить
								</Button>
								<Button
									className={scss.button_delete}
									onClick={handleDeleteProductById}
								>
									Удалить
								</Button>
							</div>
						</div>
					</div>
				</Modal>
			</ConfigProvider>
		</>
	);
};

export default CardProductPage;
