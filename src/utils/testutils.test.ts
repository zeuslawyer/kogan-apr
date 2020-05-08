import { calcAvgCubicWeight, fetchProductData, IProduct } from './data-utils';

// example taken from https://kogan-recruitment.herokuapp.com/challenge/a91646f371577ea6eb20af90b187a4ce/
const DATA: Array<IProduct> = [
  {
    category: 'Holders & Stands',
    title: 'Kogan Adjustable Laptop and Tablet Stand with Mouse Pad',
    weight: 1730,
    size: {
      width: 30,
      length: 40,
      height: 20,
    },
  },
];

it('calculates avg cubic weight', () => {
  expect(calcAvgCubicWeight(DATA, DATA[0].category, DATA.length)).toEqual(
    '6.00'
  );
});

it('fetches data via proxy to get around CORS ', async () => {
  const fetched = await fetchProductData();
  expect(fetched.length).toBeGreaterThanOrEqual(1);
  expect(fetched.length).toEqual(36);
});
