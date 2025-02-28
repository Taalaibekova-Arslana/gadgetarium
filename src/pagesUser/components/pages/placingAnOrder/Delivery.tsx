/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import scss from './Delivery.module.scss';
import { Checkbox, ConfigProvider } from 'antd';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
	useGetDeliveryDataQuery,
	usePostOrderDeliveryMutation
} from '@/src/redux/api/order';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetBasketOrderGadgetQuery } from '@/src/redux/api/basket';
// import { useGetOrderIdQuery } from '@/src/redux/api/payment';
type DeliveryPageTypes = {
	ids: [];
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	address: string;
	price: number;
	discountPrice: number;
};
const Delivery = () => {
	const [isCheckedPickup, setIsCheckedPickup] = useState(false);
	const [isCheckedCourier, setIsCheckedPickupCourier] = useState(false);
	// const [] = useState('true');
	// const [dataIds, setDataIds] = useState([]);
	const navigate = useNavigate();
	const [postOrderDelivery] = usePostOrderDeliveryMutation();
	const [searchParams, setSearchParams] = useSearchParams();
	// const [inputValue, setInputValue] = useState('');
	const { data: returnData } = useGetDeliveryDataQuery({});
	const [orderId, setOrderId] = useState(0);
	const { data: basketOrder } = useGetBasketOrderGadgetQuery([
		window.location.search.substring(1)
	]);
console.log(basketOrder, 'date');

	const {
		handleSubmit,
		reset,
		control,
		setValue,
		formState: { errors }
	} = useForm<DeliveryPageTypes>({
		mode: 'onBlur'
	});

	useEffect(() => {
		if (returnData) {
			setValue('firstName', returnData.firsName);
			setValue('lastName', returnData.lastName);
			setValue('email', returnData.email);
			setValue('phoneNumber', returnData.phoneNumber);
			setValue('address', returnData.address);

			// setFirstName(returnData.firsName);
			// setLastName(returnData.lastName);
			// setEmail(returnData.email);
			// setPhone(returnData.phoneNumber);
			// setAddress(returnData.address);
		}
		// refetch();
	}, [returnData, setValue]);

	const handleOpenChecbox = (ids: number) => {
		setIsCheckedPickup(true);
		setIsCheckedPickupCourier(false);
		searchParams.set('deliveryType', String(isCheckedPickup));
		searchParams.set('subGadgetId', ids.toString());
		setSearchParams(searchParams);
		// postOrderDelivery({
		// 	subGadgetId: [searchParams.toString()],
		// 	deliveryType: searchParams.toString()
		// });/	1`1
	};

	const handleOpenCheckbox2 = (ids: number) => {
		setIsCheckedPickup(false);
		setIsCheckedPickupCourier(true);
		searchParams.set('deliveryType', String(!isCheckedCourier));
		searchParams.set('subGadgetId', ids.toString());
		setSearchParams(searchParams);
		// postOrderDelivery({
		// 	subGadgetId: [searchParams.toString()],
		// 	deliveryType: searchParams.toString()
		// });
	};

	const onSubmit: SubmitHandler<DeliveryPageTypes> = async (data) => {
		const responseObject = {
			address: data.address,
			email: data.email,
			phoneNumber: data.phoneNumber,
			firstName: data.firstName,
			lastName: data.lastName,
			price: basketOrder?.basketAmounts.price ?? 0,
			discountPrice: basketOrder?.basketAmounts.discountPrice ?? 0
		};
		postOrderDelivery({
			subGadgetId: [searchParams.toString()],
			deliveryType: searchParams.toString(),
			...responseObject
		});
		setOrderId(orderId);
		reset();
		navigate(`/pay/payment?${window.location.search.substring(1)}`);
	};

	return (
		<div className={scss.DeliveryOptions}>
			<div className={scss.content}>
				<div>
					<h2> {isCheckedPickup ? 'Варианты доставки' : 'Доставка'}</h2>
					<div className={scss.cards_pickup_courier_delivery}>
						<div
							onClick={() =>
								basketOrder?.gadgetResponse.forEach((c) =>
									handleOpenChecbox(c.id)
								)
							}
							className={scss.checkbox_pickup}
							style={{
								border: isCheckedPickup
									? '2px solid  rgb(203, 17, 171)'
									: '2px solid transparent'
							}}
						>
							<div>
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
											searchParams
												.getAll('deliveryType')
												.some((el) => el === 'false')
												? true
												: false
										}
										onChange={() =>
											basketOrder?.gadgetResponse.forEach((c) =>
												handleOpenChecbox(c.id)
											)
										}
									/>
								</ConfigProvider>
							</div>
							<div className={scss.text_pickup}>
								<h4>Самовывоз из магазина</h4>
								<p>
									Забрать 20 июля, <h5>Бесплатно</h5>
								</p>
							</div>
						</div>
						<div
							onClick={() =>
								basketOrder?.gadgetResponse.forEach((c) =>
									handleOpenCheckbox2(c.id)
								)
							}
							className={scss.checkbox_courier_delivery}
							style={{
								border: isCheckedCourier
									? '2px solid rgb(203, 17, 171)'
									: '2px solid transparent'
							}}
						>
							<div>
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
											searchParams
												.getAll('deliveryType')
												.some((el) => el === 'true')
												? true
												: false
										}
										onChange={() =>
											basketOrder?.gadgetResponse.forEach((c) =>
												handleOpenCheckbox2(c.id)
											)
										}
									/>
								</ConfigProvider>
							</div>
							<div className={scss.text_courier}>
								<h4>Доставка курьером</h4>
								<p>
									Забрать 20 июля, <h5>Бесплатно свыше 10 000 с</h5>
									<p>до 10 000 с — от 200 с</p>
								</p>
							</div>
						</div>
					</div>
					<hr />
					<h2>Личные данные</h2>
					<form
						className={scss.input_personal_data_pickup}
						onSubmit={handleSubmit(onSubmit)}
						style={{ display: isCheckedPickup ? 'flex' : 'none' }}
					>
						<div className={scss.name_and_first_name}>
							<div className={scss.label_input}>
								<label htmlFor="name">Имя *</label>
								<Controller
									name="firstName"
									control={control}
									defaultValue=""
									rules={{
										required: 'Напишите ваше имя обязателен для заполнения',
										minLength: {
											value: 2,
											message:
												'Напишите ваше имя должен содержать минимум 2 символов'
										}
									}}
									render={({ field }) => (
										<input
											style={errors.firstName && { border: '1px solid red' }}
											type="text"
											placeholder="Напишите ваше имя"
											id="firsName"
											{...field}
										/>
									)}
								/>
							</div>
							<div className={scss.label_input}>
								<label htmlFor="name">Фамилия *</label>
								<Controller
									name="lastName"
									control={control}
									defaultValue=""
									rules={{
										required: 'Напишите вашу фамилию обязателен для заполнения',
										minLength: {
											value: 4,
											message:
												'Напишите вашу фамилию должен содержать минимум 4 символов'
										}
									}}
									render={({ field }) => (
										<input
											style={errors.lastName && { border: '1px solid red' }}
											type="text"
											id="lastName"
											placeholder="Напишите вашу фамилию"
											{...field}
										/>
									)}
								/>
							</div>
						</div>
						<div className={scss.email_and_phone_number}>
							<div className={scss.label_input}>
								<label htmlFor="name">E-mail *</label>
								<Controller
									name="email"
									control={control}
									defaultValue=""
									rules={{
										required: 'Email обязателен для заполнения',
										pattern: {
											value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
											message:
												'Введите действительный email адрес с доменом @gmail.com'
										}
									}}
									render={({ field }) => (
										<input
											type="text"
											placeholder="Напишите ваш email"
											className={scss.inputs}
											id="email"
											style={errors.email && { border: '1px solid red' }}
											{...field}
										/>
									)}
								/>
							</div>
							<div className={scss.label_input}>
								<label htmlFor="name">Телефон *</label>
								<Controller
									name="phoneNumber"
									control={control}
									defaultValue=""
									rules={{
										required: 'Телефон номер обязателен для заполнения',
										minLength: {
											value: 9,
											message:
												'Телефон номер должен содержать минимум 9 символов'
										}
									}}
									render={({ field }) => (
										<input
											{...field}
											id="phoneNumber"
											type="text"
											placeholder="+996 (_ _ _) _ _  _ _  _ _"
											style={errors.phoneNumber && { border: '1px solid red' }}
										/>
									)}
								/>
							</div>
						</div>
						{(errors.email && (
							<p style={{ color: 'red' }}>{errors.email.message}</p>
						)) ||
							(errors.firstName && (
								<p style={{ color: 'red' }}>{errors.firstName.message}</p>
							)) ||
							(errors.lastName && (
								<p style={{ color: 'red' }}>{errors.lastName.message}</p>
							)) ||
							(errors.phoneNumber && (
								<p style={{ color: 'red' }}>{errors.phoneNumber.message}</p>
							))}
						<button type="submit">Продолжить</button>
					</form>
					{/* //!FORM 2 */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className={scss.input_personal_data_pickup}
						style={{ display: isCheckedCourier ? 'flex' : 'none' }}
					>
						<div className={scss.name_and_first_name}>
							<div className={scss.label_input}>
								<label htmlFor="name">Имя *</label>
								<Controller
									name="firstName"
									control={control}
									defaultValue=""
									rules={{
										required: 'Напишите ваше имя обязателен для заполнения',
										minLength: {
											value: 2,
											message:
												'Напишите ваше имя должен содержать минимум 2 символов'
										}
									}}
									render={({ field }) => (
										<input
											style={errors.firstName && { border: '1px solid red' }}
											type="text"
											placeholder="Напишите ваше имя"
											id="firsName"
											{...field}
										/>
									)}
								/>
							</div>
							<div className={scss.label_input}>
								<label htmlFor="name">Фамилия *</label>
								<Controller
									name="lastName"
									control={control}
									defaultValue=""
									rules={{
										required: 'Напишите вашу фамилию обязателен для заполнения',
										minLength: {
											value: 4,
											message:
												'Напишите вашу фамилию должен содержать минимум 4 символов'
										}
									}}
									render={({ field }) => (
										<input
											style={errors.lastName && { border: '1px solid red' }}
											type="text"
											id="lastName"
											placeholder="Напишите вашу фамилию"
											{...field}
										/>
									)}
								/>
							</div>
						</div>
						<div className={scss.email_and_phone_number}>
							<div className={scss.label_input}>
								<label htmlFor="name">E-mail *</label>
								<Controller
									name="email"
									control={control}
									defaultValue=""
									rules={{
										required: 'Email обязателен для заполнения',
										pattern: {
											value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
											message:
												'Введите действительный email адрес с доменом @gmail.com'
										}
									}}
									render={({ field }) => (
										<input
											type="text"
											placeholder="Напишите ваш email"
											className={scss.inputs}
											id="email"
											{...field}
										/>
									)}
								/>
							</div>
							<div className={scss.label_input}>
								<label htmlFor="name">Телефон *</label>
								<Controller
									name="phoneNumber"
									control={control}
									defaultValue=""
									rules={{
										required: 'Телефон номер обязателен для заполнения',
										minLength: {
											value: 9,
											message:
												'Телефон номер должен содержать минимум 9 символов'
										}
									}}
									render={({ field }) => (
										<input
											{...field}
											id="phoneNumber"
											type="text"
											placeholder="+996 (_ _ _) _ _  _ _  _ _"
											style={errors.phoneNumber && { border: '1px solid red' }}
										/>
									)}
								/>
							</div>
						</div>
						<div className={scss.label_input}>
							<label htmlFor="name">Адрес доставки *</label>
							<input
								// {...field}
								id="address"
								type="text"
								className={scss.adress_input}
								placeholder="ул.Гражданская 119, кв 4, дом 9"
								style={errors.address && { border: '1px solid red' }}
							/>
							{/* <Controller
								name="address"
								control={control}
								defaultValue=""
								render={({ field }) => (
								)}
							/> */}
						</div>
						{(errors.email && (
							<p style={{ color: 'red' }}>{errors.email.message}</p>
						)) ||
							(errors.firstName && (
								<p style={{ color: 'red' }}>{errors.firstName.message}</p>
							)) ||
							(errors.lastName && (
								<p style={{ color: 'red' }}>{errors.lastName.message}</p>
							)) ||
							(errors.phoneNumber && (
								<p style={{ color: 'red' }}>{errors.phoneNumber.message}</p>
							))}
						<button type="submit">Продолжить</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Delivery;
