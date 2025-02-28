/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import scss from './ProductsMainSection.module.scss';
import Input from 'antd/es/input';
import {
	Checkbox,
	ConfigProvider,
	DatePicker,
	Pagination,
	Tooltip,
	message,
	// DatePickerProps,
	// Pagination,
	theme
} from 'antd';
import {
	IconChartCircles,
	IconEdit,
	IconPhotoPlus,
	IconTrash,
	IconX
} from '@tabler/icons-react';
import PhonesDropdown from '@/src/ui/catalogPhonesDropdown/PhonesDropdown';
import CustomModal from '@/src/ui/modalAdmin/CustomModal';
import CancelButtonCustom from '@/src/ui/adminButtons/CancelButtonCustom';
import CustomButtonAdd from '@/src/ui/adminButtons/CustomButtonAdd';
import Infographics from '@/src/ui/infographics/Infographics';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
	useDeleteByIdBannerMutation,
	useDeleteGoodsGadgetMutation,
	useGetGoodGadgetQuery,
	usePostGoodsBannerMutation,
	usePostGoodsDiscountMutation
} from '@/src/redux/api/goods';
import moment from 'moment';
// import dayjs from 'dayjs';
import { usePostUploadMutation } from '@/src/redux/api/pdf';
import { IconDeleteForBanner } from '@/src/assets/icons';
import { useGetSlidersQuery } from '@/src/redux/api/slider';

const ProductsMainSection = () => {
	const [deleteBanner] = useDeleteByIdBannerMutation();
	const [postDiscount] = usePostGoodsDiscountMutation();
	const buttonStyleRef = React.useRef<boolean>(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const [modalForBanner, setModalForBanner] = useState<boolean>(false);
	const { data: banner = [], refetch: Refetch } = useGetSlidersQuery();
	const bannerInputFileRef = useRef<HTMLInputElement>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
	const [isModalOpenBanner, setIsModalOpenBanner] = useState(false);
	const [gadgetId, setGadgetId] = useState<number | null>(null);
	const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
	const [gadgetIds, setGadgetIds] = useState<number[]>([]);
	const [postUploadForBanner] = usePostUploadMutation();

	const [discountSize, setDiscountSize] = useState<number>();
	const [discountStartDay, setDiscountStartDay] = useState<string | string[]>(
		''
	);
	const [discountEndDay, setDiscountEndDay] = useState<string | string[]>('');
	const changeDateFunk = (date: moment.Moment | null) => {
		if (date) {
			const formattedDate = date.format('YYYY-MM-DD');
			searchParams.set('startDate', formattedDate);
			setSearchParams(searchParams); // Update searchParams after setting
		} else return;
	};

	const changeDateFunk2 = (date: moment.Moment | null) => {
		if (date) {
			const formattedDate = date.format('YYYY-MM-DD');
			searchParams.set('endDate', formattedDate);
			setSearchParams(searchParams); // Update searchParams after setting
		} else return;
	};

	const navigate = useNavigate();

	const addProduct = () => {
		navigate('/admin/product-adding/part-1');
	};

	const handleClickBannerInputRef = () => {
		if (bannerInputFileRef.current) {
			bannerInputFileRef.current.click();
		}
	};

	const changeSearchInputValueFunk = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		searchParams.set('keyword', event.target.value);
		setSearchParams(searchParams);
		if (event.target.value === '') {
			searchParams.delete('keyword');
			setSearchParams(searchParams);
		}
	};

	const showModal = () => {
		setIsModalOpen(true);
	};

	const showModalDelete = () => {
		setIsModalOpenDelete(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const handleCancelBanner = () => {
		message.success('Баннер успешно загружен');
		setIsModalOpenBanner(false);
	};

	const showModalBanner = () => {
		setIsModalOpenBanner(true);
	};

	const antdThemeConfig = {
		algorithm: theme.defaultAlgorithm,
		token: {
			colorPrimary: '#cb11ab',
			colorBgContainer: 'transparent'
		}
	};

	const { data, refetch } = useGetGoodGadgetQuery({
		page: `page=${searchParams.get('page') || ''}`,
		size: `size=${searchParams.get('size') || ''}`,
		keyword: `keyword=${searchParams.get('keyword') || ''}`,
		discount: `discount=${searchParams.get('discount') || ''}`,
		endDate: `endDate=${searchParams.get('endDate') || ''}`,
		getType: `getType=${searchParams.get('getType') || ''}`,
		sort: `sort=${searchParams.get('sort') || ''}`,
		startDate: `startDate=${searchParams.get('startDate') || ''}`
	});
	const [deleteGadget] = useDeleteGoodsGadgetMutation();
	const [postBanner] = usePostGoodsBannerMutation();

	const handleProductsCategoryButtons = (categoryText: string) => {
		searchParams.set('getType', categoryText);
		setSearchParams(searchParams);
	};
	const handleDeleteGadget = async () => {
		if (gadgetId !== null) {
			await deleteGadget(gadgetId);
			setGadgetId(null);
			setIsModalOpenDelete(false);
		}
	};

	const handlePostDiscount = async () => {
		const discountData = {
			gadgetId: [...gadgetIds],
			discountSize: Number(discountSize),
			startDay: String(discountStartDay),
			endDay: String(discountEndDay)
		};
		const {
			discountSize: DiscountSize,
			endDay,
			gadgetId,
			startDay
		} = discountData;
		try {
			await postDiscount({
				discountSize: DiscountSize!,
				endDay,
				gadgetId,
				startDay
			});
			setIsModalOpen(false);
			setGadgetIds([]);
			setDiscountSize(0);
			setDiscountEndDay('');
			setDiscountStartDay('');
			refetch();
		} catch (error) {
			console.error(error);
		}
	};

	const handleHover = (id: number | null) => {
		setHoveredItemId(id);
	};

	React.useEffect(() => {
		if (searchParams.get('getType')) {
			buttonStyleRef.current = true;
		} else {
			buttonStyleRef.current = false;
		}
	}, [searchParams]);

	const changeBannerFunk = async (
		e: React.ChangeEvent<HTMLInputElement>,
		bannerLength: number
	) => {
		console.log(bannerLength, e.target.files, 'banner length');

		const files = e.target.files;
		if (files) {
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append('files', files[i]);
			}

			try {
				const response = await postUploadForBanner(formData).unwrap();
				console.log(response.data, 'text');

				await postBanner({
					images: response.data
				});
				Refetch();
			} catch (error) {
				console.error('Error uploading banner:', error);
			}
		}
	};

	const changeProductsPagination = (page: any) => {
		searchParams.set('page', page);
		setSearchParams(searchParams);
	};

	const changeCheckbox = (id: number) => {
		if (!gadgetIds.includes(id)) {
			setGadgetIds((prevValue) => [...prevValue, id]);
		} else {
			const filtred = gadgetIds.filter((c) => c !== id);
			setGadgetIds(filtred);
		}
	};

	const handleDeleteBannerById = async (bannerId: number) => {
		try {
			await deleteBanner(bannerId);
			Refetch();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={scss.ProductsMainSection}>
			<div className="container">
				<div className={scss.content}>
					<div className={scss.left_content}>
						<div className={scss.search_input_buttons}>
							<div>
								<ConfigProvider theme={antdThemeConfig}>
									<Input.Search
										className={scss.search}
										size="large"
										placeholder="Поиск по артикулу или ..."
										allowClear
										// onSearch={onSearch}
										onChange={changeSearchInputValueFunk}
										value={searchParams.get('keyword') ?? ''}
									/>
								</ConfigProvider>
							</div>
							<div className={scss.add_product}>
								{banner.length !== 0 && (
									<button onClick={() => setModalForBanner(true)}>
										Все баннеры
									</button>
								)}
								<button onClick={addProduct}>Добавить товар</button>
								<button onClick={showModal}>Создать скидку</button>
							</div>
						</div>
						<div className={scss.product_buttons}>
							<div className={scss.buttons}>
								<button
									onClick={() => handleProductsCategoryButtons('ALL_PRODUCTS')}
									className={
										searchParams.getAll('getType')?.includes('ALL_PRODUCTS') ||
										buttonStyleRef.current === false
											? `${scss.all_product} ${scss.active}`
											: `${scss.all_product}`
									}
								>
									Все товары
								</button>
								<button
									onClick={() => handleProductsCategoryButtons('ON_SALE')}
									className={
										searchParams.getAll('getType')?.includes('ON_SALE')
											? `${scss.all_product} ${scss.active}`
											: `${scss.all_product}`
									}
								>
									В продаже
								</button>
								<button
									onClick={() => handleProductsCategoryButtons('IN_FAVORITES')}
									className={
										searchParams.getAll('getType')?.includes('IN_FAVORITES')
											? `${scss.all_product} ${scss.active}`
											: `${scss.all_product}`
									}
								>
									В избранном
								</button>
								<button
									onClick={() => handleProductsCategoryButtons('IN_BASKET')}
									className={
										searchParams.getAll('getType')?.includes('IN_BASKET')
											? `${scss.all_product} ${scss.active}`
											: `${scss.all_product}`
									}
								>
									В корзине
								</button>
							</div>
							<button className={scss.banner} onClick={showModalBanner}>
								<IconChartCircles />
								Загрузить баннер
							</button>
						</div>
						<hr />
						<div className={scss.inputs_date}>
							<DatePicker
								className={scss.input_date}
								onChange={(date) => changeDateFunk(date)}
								value={
									searchParams.get('startDate')
										? moment(searchParams.get('startDate'))
										: undefined
								}
								placeholder="От"
							/>
							<DatePicker
								className={scss.input_date}
								onChange={(date) => changeDateFunk2(date)}
								placeholder="До"
								value={
									searchParams.get('endDate')
										? moment(searchParams.get('endDate'))
										: undefined
								}
							/>
						</div>
						<div className={scss.products_card}>
							<div className={scss.product_title}>
								<p>Найдено {data?.paginationGadgets.length} Товаров </p>
								<PhonesDropdown />
							</div>
							<table className={scss.cards}>
								<thead>
									<tr className={scss.card_title}>
										<div className={scss.row_1}>
											<th>ID</th>
											<th>Фото</th>
										</div>
										<div className={scss.rows}>
											<div className={scss.row_2}>
												<th>Артикул</th>
												<th>Наименование товара</th>
												<th>Дата создания</th>
												<th>Кол-во</th>
												<th>Цена товара</th>
											</div>
											<div className={scss.row_3}>
												<th>Текущая цена</th>
												<th>Действия</th>
											</div>
										</div>
									</tr>
								</thead>
								<tbody>
									{data?.paginationGadgets.length === 0 ? (
										<>
											<h2>Пока нет товаров</h2>
										</>
									) : (
										<>
											{data?.paginationGadgets?.map((item, index) => (
												<tr
													key={index}
													className={scss.tr}
													onMouseEnter={() => handleHover(item.subGadgetId)}
													onMouseLeave={() => handleHover(null)}
												>
													<Link
														to={`/admin/goodsPage/product-page/${item?.gadgetId}`}
														className={scss.link_button}
													>
														<div className={scss.card}>
															<div className={scss.three}>
																<td>
																	{hoveredItemId === item.subGadgetId ||
																	gadgetIds.includes(item.gadgetId) ? (
																		<ConfigProvider
																			theme={{
																				components: {
																					Checkbox: {
																						colorPrimary: '#c11bab',
																						colorBgContainer: 'white',
																						algorithm: true
																					}
																				}
																			}}
																		>
																			<Checkbox
																				checked={
																					gadgetIds.includes(item.gadgetId)
																						? true
																						: false
																				}
																				onChange={() =>
																					changeCheckbox(item.gadgetId)
																				}
																				onClick={(e) => {
																					e.preventDefault();
																					e.stopPropagation();
																				}}
																			/>
																		</ConfigProvider>
																	) : (
																		<p className={scss.id_for_product}>
																			{item.subGadgetId}
																		</p>
																	)}
																</td>
																<img src={item.images} alt="" />
															</div>
															<td>
																{item.article.toString().length > 6 ? (
																	<>
																		{item.article.toString().slice(0, 6)}
																		<Tooltip
																			title={item.article.toString()}
																			color="#c11bab"
																		>
																			<span style={{ cursor: 'pointer' }}>
																				...
																			</span>
																		</Tooltip>
																	</>
																) : (
																	item.article.toString()
																)}
															</td>
															<div className={scss.quantity_name}>
																<td>Кол-во товара {item?.quantity}шт.</td>
																<td className={scss.name}>
																	{item.nameOfGadget.length > 20 ? (
																		<>
																			{item.nameOfGadget.slice(0, 16)}
																			<Tooltip
																				title={item.nameOfGadget}
																				color="#c11bab"
																			>
																				<span style={{ cursor: 'pointer' }}>
																					...
																				</span>
																			</Tooltip>
																		</>
																	) : (
																		item.nameOfGadget
																	)}
																</td>
															</div>
															<div className={scss.date_time}>
																<td>{item?.createdAt}</td>
																{/* <td className={scss.time}>{productName.time}</td> */}
															</div>
															<td>{item?.quantity}</td>
															<div className={scss.price_discount}>
																<td className={scss.price_td}>
																	{item?.price}с
																</td>
																<td className={scss.discount}>
																	{item?.percent}%
																</td>
															</div>
															<td className={scss.price_td}>
																{item?.currentPrice}с
															</td>
															<div className={scss.icons}>
																<IconEdit
																	className={scss.trash}
																	onClick={(e) => {
																		navigate(
																			`/admin/edit-page/${item.gadgetId}`
																		);
																		e.preventDefault();
																		e.stopPropagation();
																	}}
																/>
																<IconTrash
																	onClick={(e) => {
																		showModalDelete();
																		e.stopPropagation();
																		e.preventDefault();
																		setGadgetId(item?.subGadgetId);
																	}}
																/>
															</div>
														</div>
													</Link>
												</tr>
											))}
										</>
									)}
								</tbody>
							</table>
						</div>
						<div className={scss.pagination}>
							{
								<Pagination
									total={data?.allProduct}
									pageSize={data?.size}
									current={data?.page}
									showQuickJumper={true}
									onChange={changeProductsPagination}
								/>
							}
						</div>
					</div>
					<div className={scss.right_content}>
						<Infographics />{' '}
					</div>
				</div>
				<div className={scss.modal_create_newsletter}>
					<CustomModal
						isModalOpen={isModalOpen}
						setIsModalOpen={setIsModalOpen}
					>
						<div className={scss.create_newsletter}>
							<h1>Создать скидку</h1>
							<div className={scss.size_sale}>
								<label className={scss.label} htmlFor="name">
									Размер скидки *
								</label>
								<input
									className={scss.discount}
									value={discountSize}
									onChange={(e) => setDiscountSize(Number(e.target.value))}
									type="number"
									name="name"
									placeholder="0%  "
								/>
							</div>
							<div className={scss.dates}>
								<div>
									<label className={scss.label} htmlFor="name">
										Дата начала скидки *{' '}
									</label>
									<DatePicker
										name="name"
										className={scss.date}
										value={discountStartDay ? moment(discountStartDay) : null}
										onChange={(_date, dateString) =>
											setDiscountStartDay(dateString)
										}
										placeholder="От"
									/>
								</div>
								<div>
									<label className={scss.label} htmlFor="name">
										Дата окончания скидки *
									</label>
									<DatePicker
										name="name"
										className={scss.date}
										value={discountEndDay ? moment(discountEndDay) : null}
										onChange={(_date, dateString) =>
											setDiscountEndDay(dateString)
										}
										placeholder="Выберите дату"
									/>
								</div>
							</div>
							<div className={scss.buttons}>
								<CancelButtonCustom onClick={handleCancel}>
									ОТМЕНИТЬ
								</CancelButtonCustom>
								<CustomButtonAdd onClick={handlePostDiscount}>
									ОТПРАВИТЬ
								</CustomButtonAdd>
							</div>
						</div>
					</CustomModal>
					<CustomModal
						isModalOpen={isModalOpenBanner}
						setIsModalOpen={setIsModalOpenBanner}
					>
						<div className={scss.add_banner}>
							<h1>Загрузить баннер</h1>
							{/* <UploadBanner fileList={fileList} setFileList={setFileList} /> */}
							<div
								className={
									banner.length > 0
										? `${scss.noo_active} ${scss.container_add_banner_div}`
										: `${scss.noo_active}`
								}
							>
								<input
									type="file"
									ref={bannerInputFileRef}
									style={{ display: 'none' }}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										changeBannerFunk(e, banner.length)
									}
									multiple
								/>
								<div
									className={
										banner.length >= 6
											? `${scss.icon_and_text_div} ${scss.display_nome_icon_and_text_add_file}`
											: `${scss.icon_and_text_div}`
									}
									onClick={handleClickBannerInputRef}
								>
									<IconPhotoPlus
										color="rgb(145, 150, 158)"
										width={'36px'}
										height={'33px'}
									/>
									<p
										className={
											banner.length >= 1
												? `${scss.noo_active_p} ${scss.active_p}`
												: `${scss.noo_active_p}`
										}
									>
										Нажмите для добавления фотографии
									</p>
								</div>
								{banner.length > 0 &&
									banner.map((el, index) => (
										<div key={index} className={scss.banner_contents}>
											<img src={el.images} alt="banner photo" />
											<div style={{ position: 'relative', right: '25px' }}>
												<div
													style={{ cursor: 'pointer' }}
													onClick={() => handleDeleteBannerById(el.id)}
												>
													<IconDeleteForBanner />
												</div>
											</div>
										</div>
									))}
							</div>
							<div className={scss.buttons_banner}>
								<CancelButtonCustom onClick={handleCancelBanner}>
									ОТМЕНИТЬ
								</CancelButtonCustom>
								<CustomButtonAdd onClick={handleCancelBanner}>
									ОТПРАВИТЬ
								</CustomButtonAdd>
							</div>
						</div>
					</CustomModal>
				</div>
			</div>
			<CustomModal
				isModalOpen={isModalOpenDelete}
				setIsModalOpen={setIsModalOpenDelete}
			>
				<div className={scss.modal}>
					<h2>Вы уверены, что хотите удалить товар?</h2>

					<div className={scss.modal_buttons}>
						<CancelButtonCustom onClick={() => setIsModalOpenDelete(false)}>
							Отменить
						</CancelButtonCustom>
						<CustomButtonAdd onClick={handleDeleteGadget}>
							Удалить
						</CustomButtonAdd>
					</div>
				</div>
			</CustomModal>
			<CustomModal
				isModalOpen={modalForBanner}
				setIsModalOpen={setModalForBanner}
			>
				<div className={scss.modal}>
					<h2>Все баннеры</h2>
					<div
						className={
							banner.length >= 4
								? `${scss.container_banners} ${scss.active_banner_div}`
								: `${scss.container_banners}`
						}
					>
						{banner.map((el) => (
							<div key={el.id} className={scss.image_and_icon_delete_div}>
								<img src={el.images} alt="logo" />
								<IconX
									style={{ cursor: 'pointer' }}
									onClick={() => handleDeleteBannerById(el.id)}
								/>
							</div>
						))}
					</div>
				</div>
			</CustomModal>
		</div>
	);
};

export default ProductsMainSection;
