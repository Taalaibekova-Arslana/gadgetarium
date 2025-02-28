/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
import scss from './InfoProduct.module.scss';
import { ReactNode, useState } from 'react';
// import { Tabs } from 'antd';
// import type { TabsProps } from 'antd';
import { CharacteristicsPage } from './CharacteristicsPage';
import DescriptionPage from './DescriptionPage';
import ReviewsPage from './ReviewsPage';
import { IconBurgerMenu } from '@/src/assets/icons';
// import { useParams } from 'react-router-dom';
// import { useGetCardProductQuery } from '@/src/redux/api/cardProductPage';
// import { useGetUserPostPDSQuery } from '@/src/redux/api/pdf';

interface ComponentsTypesArray {
	children: ReactNode;
	id: number;
}

const ComponentArray: ComponentsTypesArray[] = [
	{
		id: 1,
		children: <DescriptionPage />
	},
	{
		id: 2,
		children: <CharacteristicsPage />
	},
	{
		id: 3,
		children: <ReviewsPage />
	}
];
console.log(ComponentArray);

const InfoProduct = () => {
	const [component, setComponent] = useState<number>(1);
	// const useparams = useParams<{ productId: string }>();
	const [result, setResult] = useState<number>(0);
	// const [pdfUrl, setPdfUrl] = useState<string>('');
	// const { data: cardProductData } = useGetCardProductQuery({
	// 	id: Number(useparams.productId!)
	// });
	// const pdfParam = `key=${pdfUrl}` || '';

	// const handlePDFApiFunk = (pdfUrlProduct: string) => {
	// 	setPdfUrl(pdfUrlProduct.slice(54, 100));
	// };
	// const { data: pdfData } = useGetUserPostPDSQuery(pdfParam);
	// console.log(pdfData);
	
	return (
		<div className={scss.ContainerInfoProduct}>
			<div className="container">
				<div className={scss.content}>
					<div className={scss.navbar_product_info_buttons}>
						<nav>
							<ul>
								<p
									className={
										component === 1
											? `${scss.nooActive} ${scss.active}`
											: `${scss.nooActive}`
									}
									onClick={() => {
										setComponent(1);
										setResult(0);
									}}
								>
									Описание
								</p>
								<div
									className={
										component === 1
											? `${scss.nooActiveDiv} ${scss.activeDiv}`
											: `${scss.nooActiveDiv}`
									}
								></div>
							</ul>
							<ul>
								<p
									className={
										component === 2
											? `${scss.nooActive} ${scss.active}`
											: `${scss.nooActive}`
									}
									onClick={() => {
										setComponent(2);
										setResult(1);
									}}
								>
									Характеристики
								</p>
								<div
									className={
										component === 2
											? `${scss.nooActiveDiv} ${scss.activeDiv}`
											: `${scss.nooActiveDiv}`
									}
								></div>
							</ul>
							<ul>
								<p
									className={
										component === 3
											? `${scss.nooActive} ${scss.active}`
											: `${scss.nooActive}`
									}
									onClick={() => {
										setComponent(3);
										setResult(2);
									}}
								>
									Отзывы
								</p>
								<div
									className={
										component === 3
											? `${scss.nooActiveDiv} ${scss.activeDiv}`
											: `${scss.nooActiveDiv}`
									}
								></div>
							</ul>
						</nav>

						<div
							className={scss.document_content_div}
							// onClick={() => handlePDFApiFunk(cardProductData?.pdfUrl!)}
						>
							<IconBurgerMenu />
							<p>Скачать документ.pdf</p>
						</div>
					</div>
					{ComponentArray.slice(result, component).map((item) => (
						<div key={item.id}>{item.children}</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default InfoProduct;
