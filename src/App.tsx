import React from 'react';
import logo from './logo.png';
import './App.css';

import {
  calcAvgCubicWeight,
  IProduct,
  fetchProductData,
} from './utils/data-utils';

function App() {
  // get products
  const [products, setProducts] = React.useState<Array<IProduct>>([]);

  // get product categories
  const [categoryCounts, setCategoryCounts] = React.useState<{
    [index: string]: number;
  }>({});

  // state for dropdown
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');

  // sideEffect on page load - fetch data
  React.useEffect(() => {
    const fetch = async () => {
      const fetchedProds = await fetchProductData();
      console.info('fetched  data from proxy...');
      setProducts(fetchedProds);
    };
    fetch();
  }, []); // fires once on page load

  // side effect - calculate counts for each category based on products in state
  React.useEffect(() => {
    let counts: { [key: string]: number } = {};
    products.forEach((item) => {
      counts[item.category] = counts[item.category] + 1 || 1;
    });

    setCategoryCounts(counts);
  }, [products]); // counts triggered any time fetched products state changes

  // handlers
  const onDropdownClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.info(`selected: ${event.target.value || 'null'}`);
    setSelectedCategory(event.target.value);
  };

  return (
    <div className='App'>
      <header className='App-logo'>
        <img src={logo} className='App-logo' alt='logo' />
      </header>
      {products.length === 0 ? (
        <div className='App-loading'> LOADING ... </div>
      ) : (
        <>
          <div className='App-body'>
            <p>
              The average cubic weight for all products in the{' '}
              <select
                className='App-dropdown-products'
                onChange={onDropdownClick}
              >
                <option value=''>Please Choose</option>
                {Object.keys(categoryCounts).map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>{' '}
              category is:{' '}
              <span>
                {' '}
                {calcAvgCubicWeight(
                  products,
                  selectedCategory,
                  categoryCounts[selectedCategory] || 0
                )}{' '}
              </span>{' '}
              kgs.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
