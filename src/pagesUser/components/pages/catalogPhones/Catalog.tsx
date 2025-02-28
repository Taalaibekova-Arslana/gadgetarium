/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams
} from 'react-router-dom';
import scss from './Catalog.module.scss';
import arrow from '@/src/assets/map/arrowtop.png';
import arrowDown from '@/src/assets/map/arrowDown.png';
import arrowBlue from '@/src/assets/map/arrowTopBlue.png';
import arrowBlueBottom from '@/src/assets/map/arrowBottomBlue.png';
import { gBiteCatalog, moreGBiteCatalog } from '@/src/data/Catalog';
import React, { useState } from 'react';
import { useGetFiltredGadgetQuery } from '@/src/redux/api/filterGadget';
import { IconHeart, IconScale, IconX, IconFileLike } from '@tabler/icons-react';
import PhonesDropdown from '@/src/ui/catalogPhonesDropdown/PhonesDropdown';
import { Rate, Skeleton, Tooltip } from 'antd';
import {
	useBasketPutProductMutation
	// useGetBasketQuery
} from '@/src/redux/api/basket';
import { useFavoritePutProductMutation } from '@/src/redux/api/favorite';
import { useComparisonPatchProductsMutation } from '@/src/redux/api/comparison';
import { useSubCategoriesQuery } from '@/src/redux/api/catalogProducts';
import AddBasketButton from '@/src/ui/customButtons/AddBasketButton';
import { IconRedHeart } from '@/src/assets/icons';
import CustomModal from '@/src/ui/modalAdmin/CustomModal';
import ModalLogin from '@/src/ui/customModalLogin/ModalLogin';
import ShowMoreButton from '@/src/ui/customButtons/ShowMoreButton';
import emptyImg from '@/src/assets/sammy-the-man-trying-to-find-the-right-document 1.png';
import { ViewedProducts } from '@/src/ui/ViewedProducts/ViewedProducts';
import { useGetAllColorsApiQuery } from '@/src/redux/api/colors';
// import { ViewedProducts } from '@/src/ui/viewedProducts/ViewedProducts';
// import { ViewedProducts } from '@/src/ui/viewedProducts/ViewedProducts';
const Catalog = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const { filtredIds } = useParams();
	const { data: allColors } = useGetAllColorsApiQuery();
	const { data: subCategories = [] } = useSubCategoriesQuery(
		Number(filtredIds!)
	);
	const [addProductBasket] = useBasketPutProductMutation();
	const [addProductsForFavorite] = useFavoritePutProductMutation();
	const [addComparisonProducts] = useComparisonPatchProductsMutation();
	// const { data: BasketData = [] } = useGetBasketQuery();
	const [priceLow, setPriceLow] = useState<string>('');
	const [priceHigh, setPriceHigh] = useState('');
	const [categoryArray, setCategoryArray] = useState(() => {
		const brands = searchParams.getAll('brand');
		return brands?.length ? brands : [];
	});
	const [filtredForColors, setFiltredForColors] = useState(() => {
		const colour = searchParams.getAll('colour');
		return colour?.length ? colour : [];
	});
	const [filtredMemoryArray, setFiltredMemoryArray] = useState(() => {
		const memory = searchParams.getAll('memory');
		return memory.length ? memory : [];
	});
	const [filtredRamArray, setFiltredRamArray] = useState(() => {
		const ram = searchParams.getAll('ram');
		return ram.length ? ram : [];
	});
	const [reduceOne, setReduceOne] = useState(false);
	const [reduceTwo, setReduceTwo] = useState(false);
	const [reduceThree, setReduceThree] = useState(false);
	const [reduceFour, setReduceFour] = useState(false);
	const [reduceFive, setReduceFive] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	// !

	const [hideColours, setHideColours] = useState(false);

	const [, setAllPhones] = useState<boolean>(false);
	const [, setAllPhonesHide] = useState(false);

	const handleShowAllPhones = (page: number) => {
		setAllPhones(true);
		setAllPhonesHide(true);
		let size = 12 + page;
		searchParams.set('page', '1');
		searchParams.set('size', size.toString());
		setSearchParams(searchParams);
		navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
	};

	const handleHideAllPhones = () => {
		searchParams.set('page', '1');
		searchParams.set('size', '12');
		setSearchParams(searchParams);
		navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		setAllPhones(false);
		setAllPhonesHide(false);
	};

	const handleRemoveCategories = () => {
		setPriceHigh('');
		setPriceLow('');
		searchParams.delete('brand');
		searchParams.delete('discount');
		searchParams.delete('sort');
		searchParams.delete('colour');
		searchParams.delete('costFrom');
		searchParams.delete('costUpTo');
		searchParams.delete('page');
		searchParams.delete('size');
		searchParams.delete('memory');
		searchParams.delete('ram');
		setSearchParams(searchParams);
		setCategoryArray([]);
		setFiltredForColors([]);
		setFiltredMemoryArray([]);
		setFiltredRamArray([]);
		setReduceOne(true);
		setReduceTwo(true);
		setReduceThree(true);
		setReduceFour(true);
		setReduceFive(true);
	};

	const handleSelectedCategory = (category: string) => {
		if (!categoryArray.includes(category)) {
			searchParams.append('brand', category);
			setCategoryArray((prevValue) => [...prevValue, category]);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		} else {
			const removeIsBrand = categoryArray.filter((c) => c !== category);
			searchParams.delete('brand');
			searchParams.delete('sort');
			searchParams.delete('discount');
			searchParams.delete('colour');
			removeIsBrand.forEach((c) => searchParams.append('brand', c));
			setCategoryArray(removeIsBrand);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		}
	};

	const handleMemoryProductsFunk = (memory: string) => {
		if (!filtredMemoryArray.includes(memory)) {
			searchParams.append('memory', memory);
			setFiltredMemoryArray((prevValue) => [...prevValue, memory]);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		} else {
			const removeProductsMemory = filtredMemoryArray.filter(
				(c) => c !== memory
			);
			searchParams.delete('memory');
			removeProductsMemory.forEach((e) => searchParams.append('memory', e));
			setFiltredMemoryArray(removeProductsMemory);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		}
	};

	const handleRamProductsFunk = (ram: string) => {
		if (!filtredRamArray.includes(ram)) {
			searchParams.append('ram', ram);
			setFiltredRamArray((prevValue) => [...prevValue, ram]);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		} else {
			const removeProductsForRam = filtredRamArray.filter((c) => c !== ram);
			searchParams.delete('ram');
			removeProductsForRam.forEach((c) => searchParams.append('ram', c));
			setFiltredRamArray(removeProductsForRam);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		}
	};

	const handleColorsFiltredProducts = (colors: string) => {
		if (!filtredForColors.includes(colors)) {
			searchParams.append('colour', colors);
			setFiltredForColors((prevValue) => [...prevValue, colors]);
			setSearchParams(searchParams);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		} else {
			const removeColors = filtredForColors.filter((c) => c !== colors);
			searchParams.delete('colour');
			removeColors.forEach((c) => searchParams.append('colour', c));
			setFiltredForColors(removeColors);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		}
	};

	const changeInputValueFunk = (e: React.ChangeEvent<HTMLInputElement>) => {
		const numberValue = Number(e.target.value);
		if (!isNaN(numberValue)) {
			setPriceLow(numberValue.toString());
			searchParams.set('costFrom', numberValue.toString());
			setSearchParams(searchParams);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		} else {
			searchParams.delete('costFrom');
			setSearchParams(searchParams);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		}
		if (numberValue === 0) {
			searchParams.delete('costFrom');
			setSearchParams(searchParams);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		}
	};
	const changeInputValueFunk2 = (e: React.ChangeEvent<HTMLInputElement>) => {
		const numberValue = Number(e.target.value);
		if (!isNaN(numberValue)) {
			setPriceHigh(numberValue.toString());
			searchParams.set('costUpTo', numberValue.toString());
			setSearchParams(searchParams);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		} else {
			searchParams.delete('costUpTo');
			setSearchParams(searchParams);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		}
		if (numberValue === 0) {
			searchParams.delete('costUpTo');
			setSearchParams(searchParams);
			navigate(`/catalog/${filtredIds}/filtred?${searchParams.toString()}`);
		}
	};

	const {
		data: posts,
		isLoading,
		refetch
	} = useGetFiltredGadgetQuery({
		id: Number(filtredIds),
		brand: [searchParams.toString()],
		colour: [searchParams.toString()],
		costFrom: Number(searchParams),
		costUpTo: Number(searchParams),
		page: `page=${searchParams.get('page') || ''}`,
		size: `size=${searchParams.get('size') || ''}`,
		memory: [searchParams.toString()],
		ram: [searchParams.toString()]
	});

	console.log(posts, 'array');

	const handleBasketProductsFunk = async (subGadgetId: number) => {
		if (localStorage.getItem('isAuth') === 'true') {
			await addProductBasket({ id: subGadgetId, basket: false });
		} else {
			setOpenModal(true);
		}
		refetch();
	};

	const handleAddProductsFavoriteFunk = async (subGadgetId: number) => {
		try {
			if (localStorage.getItem('isAuth') === 'true') {
				await addProductsForFavorite(subGadgetId);
			} else {
				setOpenModal(true);
			}
		} catch (error) {
			console.error(error);
		}
		refetch();
	};
	const handleAddProductsComparisonFunk = async (subGadgetId: number) => {
		if (localStorage.getItem('isAuth') === 'true') {
			await addComparisonProducts(subGadgetId);
		} else {
			setOpenModal(true);
		}
		refetch();
	};

	return (
		<section className={scss.catalog}>
			<div className="container">
				<div className={scss.content}>
					<p className={scss.navigationP} onClick={() => navigate('/')}>
						Главная » <h3>Смартфоны</h3>
					</p>
					<div className={scss.divHeading}>
						<h3>Cмартфоны</h3>
						<span></span>
						<div className={scss.borderDiv}>
							<div></div>
						</div>
					</div>

					<div className={scss.divGlobal}>
						<div className={scss.divLeft}>
							<p>Найдено {posts?.responses.length} Товаров</p>
							<div className={scss.divBackgroundLeft}>
								<h4 onClick={handleRemoveCategories}>Сбросить все фильтры</h4>
								<div className={scss.divLine}></div>
								{reduceOne ? (
									<div>
										<div
											className={scss.category}
											onClick={() => setReduceOne(false)}
										>
											<p>Категория</p>
											<img src={arrowDown} alt="ArrowDown" />
										</div>
									</div>
								) : (
									<div>
										<div
											className={scss.category}
											onClick={() => setReduceOne(true)}
										>
											<p>Категория</p>
											<img src={arrow} alt="ArrowTop" />
										</div>

										<div className={scss.categoriesDiv}>
											{subCategories?.map((e, index) => (
												<div className={scss.categories} key={index}>
													<input
														id={e.categoryName}
														type="checkbox"
														checked={categoryArray.includes(e.categoryName)}
														// data-category-name={e.categoryName}
														onChange={() =>
															handleSelectedCategory(e.categoryName)
														}
													/>
													<label htmlFor={e.categoryName}>
														<p>{e.categoryName}</p>
													</label>
												</div>
											))}
										</div>
									</div>
								)}

								<div className={scss.divLine}></div>

								{reduceTwo ? (
									<div>
										<div
											className={scss.costDiv}
											onClick={() => setReduceTwo(false)}
										>
											<p>Стоимость</p>
											<img src={arrowDown} alt="ArrowDown" />
										</div>
										<div className={scss.anotherCostDiv}></div>
									</div>
								) : (
									<div>
										<div
											className={scss.costDiv}
											onClick={() => setReduceTwo(true)}
										>
											<p>Стоимость</p>
											<img src={arrow} alt="ArrowTop" />
										</div>

										<div className={scss.priceDiv}>
											<input
												type="text"
												value={priceLow}
												onChange={changeInputValueFunk}
											/>
											{/* <input type="text" /> */}
											<p className={scss.pOne}>от</p>
											<input
												type="text"
												value={priceHigh}
												onChange={changeInputValueFunk2}
											/>
											<p className={scss.pTwo}>до</p>
										</div>
										<div className={scss.priceChangerDiv}>
											<div className={scss.progress}></div>
											<input
												className={scss.price}
												type="range"
												value={priceLow}
												onChange={changeInputValueFunk}
												max="25000"
												min="0"
											/>
											<div className={scss.progressTwo}></div>
											<input
												className={scss.priceTwo}
												value={priceHigh}
												onChange={changeInputValueFunk2}
												type="range"
												min="0"
												max="200000"
											/>
										</div>
									</div>
								)}
								<div className={scss.divLine}></div>
								{reduceThree ? (
									<div>
										<div
											className={scss.colourDiv}
											onClick={() => setReduceThree(false)}
										>
											<p>Цвет</p>
											<img src={arrowDown} alt="ArrowDown" />
										</div>
									</div>
								) : (
									<div>
										{hideColours ? (
											<div>
												<div
													className={scss.colourDiv}
													onClick={() => setReduceThree(true)}
												>
													<p>Цвет</p>
													<img src={arrow} alt="ArrowTop" />
												</div>
												<div
													className={scss.clapDiv}
													onClick={() => setHideColours(false)}
												>
													<img src={arrowBlueBottom} alt="ArrowTop" />
													<p>Раскрыть </p>
												</div>
											</div>
										) : (
											<div>
												<div
													className={scss.colourDiv}
													onClick={() => setReduceThree(true)}
												>
													<p>Цвет</p>
													<img src={arrow} alt="ArrowTop" />
												</div>

												{allColors?.countList.map((e, index) => (
													<div className={scss.colours} key={index}>
														<input
															id={e.colorName}
															type="checkbox"
															checked={filtredForColors.includes(e.colorName)}
															onChange={() =>
																handleColorsFiltredProducts(e.colorName)
															}
														/>
														<label htmlFor={e.colorName}>
															<p>{e.colorName}</p>
															<span>({e.colorQuantity})</span>
														</label>
													</div>
												))}

												<div
													className={scss.clapDiv}
													onClick={() => setHideColours(true)}
												>
													<img src={arrowBlue} alt="ArrowTop" />
													<p>Скрыть</p>
												</div>
											</div>
										)}
									</div>
								)}

								<div className={scss.divLine}></div>

								{reduceFour ? (
									<div>
										<div
											className={scss.gbDiv}
											onClick={() => setReduceFour(false)}
										>
											<p>Объем памяти (GB)</p>
											<img src={arrowDown} alt="ArrowDown" />
										</div>
									</div>
								) : (
									<div>
										<div
											className={scss.gbDiv}
											onClick={() => setReduceFour(true)}
										>
											<p>Объем памяти (GB)</p>
											<img src={arrow} alt="ArrowTop" />
										</div>

										{gBiteCatalog.map((e, index) => (
											<div key={index} className={scss.gigabytes}>
												<input
													id={e.gb}
													type="checkbox"
													onChange={() => handleMemoryProductsFunk(e.nameGb)}
													checked={filtredMemoryArray.includes(e.nameGb)}
												/>
												<label htmlFor={e.gb}>
													<p>{e.gb}</p>
												</label>
											</div>
										))}

										<div className={scss.gigabytesMoreDiv}>
											<img src={arrowBlueBottom} alt="BlueBottomArrow" />
											<p>Еще 14</p>
										</div>
									</div>
								)}

								<div className={scss.divLine}></div>

								{reduceFive ? (
									<div>
										<div
											className={scss.moreGbDiv}
											onClick={() => setReduceFive(false)}
										>
											<p>Объем оперативной памяти (GB)</p>
											<img src={arrowDown} alt="ArrowDown" />
										</div>
									</div>
								) : (
									<div>
										<div
											className={scss.moreGbDiv}
											onClick={() => setReduceFive(true)}
										>
											<p>Объем оперативной памяти (GB)</p>
											<img src={arrow} alt="ArrowTop" />
										</div>

										{moreGBiteCatalog.map((e, index) => (
											<div key={index} className={scss.moreGb}>
												<input
													id={e.gb}
													type="checkbox"
													checked={filtredRamArray.includes(e.nameRam)}
													onChange={() => handleRamProductsFunk(e.nameRam)}
												/>
												<label htmlFor={e.gb}>
													<p>{e.gb}</p>
												</label>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
						<div className={scss.divRight}>
							<div className={scss.filterDiv}>
								<div className={scss.categoriesRight}>
									{categoryArray &&
										categoryArray.map((categories, index) => (
											<div key={index} className={scss.category_right}>
												<p onClick={() => handleSelectedCategory(categories)}>
													{categories}
												</p>
												<IconX
													onClick={() => handleSelectedCategory(categories)}
												/>
											</div>
										))}
									{filtredForColors &&
										filtredForColors.map((e, index) => (
											<div key={index} className={scss.category_right}>
												<p onClick={() => handleColorsFiltredProducts(e)}>
													{e}
												</p>
												<IconX onClick={() => handleColorsFiltredProducts(e)} />
											</div>
										))}
									{filtredMemoryArray &&
										filtredMemoryArray.map((e, index) => (
											<div key={index} className={scss.category_right}>
												<p onClick={() => handleMemoryProductsFunk(e)}>{e}</p>
												<IconX onClick={() => handleMemoryProductsFunk(e)} />
											</div>
										))}
									{filtredRamArray &&
										filtredRamArray.map((e, index) => (
											<div key={index} className={scss.category_right}>
												<p onClick={() => handleRamProductsFunk(e)}>{e}</p>
												<IconX onClick={() => handleRamProductsFunk(e)} />
											</div>
										))}
								</div>
								<div className={scss.sortDiv}>
									<PhonesDropdown />
								</div>
							</div>
							<div className={scss.cardss}>
								{isLoading ? (
									<>
										<div className={scss.skeleton_cards}>
											<Skeleton.Button
												active
												block
												style={{ width: 275, height: 450 }}
											/>
											<Skeleton.Button
												active
												block
												style={{ width: 275, height: 450 }}
											/>
											<Skeleton.Button
												active
												block
												style={{ width: 275, height: 450 }}
											/>
											<Skeleton.Button
												active
												block
												style={{ width: 275, height: 450 }}
											/>
											<Skeleton.Button
												active
												block
												style={{ width: 275, height: 450 }}
											/>
											<Skeleton.Button
												active
												block
												style={{ width: 275, height: 450 }}
											/>
											<Skeleton.Button
												active
												block
												style={{ width: 275, height: 450 }}
											/>
											<Skeleton.Button
												active
												block
												style={{ width: 275, height: 450 }}
											/>
											<Skeleton.Button
												active
												block
												style={{ width: 275, height: 450 }}
											/>
										</div>
									</>
								) : (
									<>
										{posts?.responses.length === 0 ? (
											<>
												<div className={scss.length_n}>
													<div className={scss.not_found_cards}>
														<img src={emptyImg} alt="" />
														<p>Нет товаров</p>
													</div>
												</div>
											</>
										) : (
											<>
												{posts?.responses.map((e) => (
													<div className={scss.cards} key={e.id}>
														<div className={scss.card}>
															<div
																className={
																	e.percent === 0 &&
																	e.newProduct === true &&
																	e.recommend === true
																		? `${scss.top_card} ${scss.active_top_card}`
																		: `${scss.top_card}`
																}
															>
																<>
																	<p
																		className={
																			e.percent
																				? `${scss.p} ${scss.percent}`
																				: `${scss.p}`
																		}
																	>
																		{e.percent}%
																	</p>
																	<div
																		className={
																			e.newProduct && e.percent === 0
																				? `${scss.new_product_nome} ${scss.active_new_product}`
																				: `${scss.new_product_nome}`
																		}
																	>
																		New
																	</div>
																	<div
																		className={
																			e.recommend && e.percent === 0
																				? `${scss.recommend_nome} ${scss.active_recommend}`
																				: `${scss.recommend_nome}`
																		}
																	>
																		<IconFileLike />
																	</div>
																</>
																<div className={scss.top_icons}>
																	<button
																		onClick={() =>
																			handleAddProductsComparisonFunk(
																				e.subGadgetId
																			)
																		}
																	>
																		<Tooltip
																			title={
																				e.comparison
																					? 'Удалить из сравнения'
																					: 'Добавить к сравнению'
																			}
																			color="#c11bab"
																		>
																			<IconScale
																				className={
																					e.comparison
																						? `${scss.scale} ${scss.active}`
																						: scss.scale
																				}
																			/>
																		</Tooltip>
																	</button>
																	<Tooltip
																		title={
																			e.likes
																				? 'Удалить из избранного'
																				: 'Добавить в избранное'
																		}
																		color="#c11bab"
																	>
																		<button
																			className={scss.icon_heart}
																			onClick={() =>
																				handleAddProductsFavoriteFunk(
																					e.subGadgetId
																				)
																			}
																		>
																			{e.likes ? (
																				<IconRedHeart />
																			) : (
																				<IconHeart />
																			)}
																		</button>
																	</Tooltip>
																</div>
															</div>
															<div className={scss.middle_image_card}>
																<Link to={`/api/gadget/by-id/${e.gadgetId}`}>
																	{e.image ? (
																		<img src={e.image} alt="Phone" />
																	) : (
																		<div>Phone</div>
																	)}
																</Link>
															</div>
															<div className={scss.middle_card}>
																<p className={scss.phone_quantity}>
																	В наличии ({e.quantity})
																</p>
																<h3>
																	{e.brandNameOfGadget.length > 28 ? (
																		<>
																			{e.brandNameOfGadget.slice(0, 22)}
																			<Tooltip
																				title={e.brandNameOfGadget}
																				color="#c11bab"
																			>
																				<span style={{ cursor: 'pointer' }}>
																					...
																				</span>
																			</Tooltip>
																		</>
																	) : (
																		e.brandNameOfGadget
																	)}
																	{/* {e.brandNameOfGadget}
																	{ e.memory}
																	{ e.colour} */}
																</h3>
																<div className={scss.phone_rating}>
																	<p>Рейтинг</p>
																	<Rate disabled defaultValue={e.rating} />
																	<p>({e.rating})</p>
																</div>
															</div>
															<div className={scss.bottom_card}>
																<div className={scss.phone_prices}>
																	<p className={scss.phone_price}>
																		{e.price} c
																	</p>
																	{e.percent !== 0 && (
																		<p className={scss.phone_old_price}>
																			{e.currentPrice} c
																		</p>
																	)}
																</div>
																{e.basked ? (
																	<button
																		className={scss.active_basket_button}
																		onClick={() => navigate('/basket')}
																	>
																		Перейти в <br /> корзину
																	</button>
																) : (
																	<AddBasketButton
																		onClick={() =>
																			handleBasketProductsFunk(e.subGadgetId)
																		}
																		className={scss.bottom_cart}
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
									</>
								)}
							</div>
							{posts?.responses.length !== 0 && (
								<>
									<div className={scss.showButtons}>
										{posts?.responses.length.toString() ===
										(searchParams.get('size') || '12') ? (
											<ShowMoreButton
												children={'Показать ещё'}
												onClick={() =>
													handleShowAllPhones(posts?.responses.length)
												}
											/>
										) : (
											<ShowMoreButton
												children={'Скрыть'}
												onClick={handleHideAllPhones}
											/>
										)}
									</div>
								</>
							)}
						</div>
					</div>
					<ViewedProducts />
					<div>
						<CustomModal isModalOpen={openModal} setIsModalOpen={setOpenModal}>
							<ModalLogin setOpenModal={setOpenModal} />
						</CustomModal>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Catalog;
