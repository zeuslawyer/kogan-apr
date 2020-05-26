import axios from 'axios';

export interface IProduct {
  category: string;
  title: string;
  weight?: number; // in gms
  size: {
    width?: number; // in cms
    length?: number; // in cms
    height?: number; // in cms
  };
}

// recursive func for paginated data from KGN endpoint
export function fetchAllData(
  path = '/api/products/1',
  pageCount = 0,
  data = []
): Promise<Array<IProduct>> {
  // base case
  if (path === null) {
    console.log(`Fetched data from ${pageCount} pages. No more pages.`);
    return data;
  }

  const BASE_URL = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com';
  const url = BASE_URL + path;

  return axios
    .get(url)
    .then((res) => {
      const _nextPath = res.data.next;
      console.log('...next page is', _nextPath);
      path = res.data.next;
      data.push(...res.data.objects); // concat data but reuse existing data array
      pageCount++;
      return fetchAllData(path, pageCount, data);
    })
    .catch((e) => {
      if (e.response.status === 404) {
        console.error(
          `Something went wrong while fetching data from ${e.response.config.url}. Returned error ${e.response.status}. `
        );
        return data;
      } else {
        throw e;
      }
    });
}

export function calcAvgCubicWeight(
  prods: Array<IProduct>,
  selectedCategory: string,
  count: number
): string {
  let totalCubicWeight = 0;
  const FACTOR = 250;
  // handle edge cases
  if (prods.length === 0 || selectedCategory === '') return '0';

  // calculate for each, in a single pass through the data
  for (const prod of prods) {
    // check if prod matches filter
    if (prod.category === selectedCategory) {
      // destructure dimensions
      let {
        size: { width, length, height },
      } = prod;

      if (!width || !length || !height) break; // handle null sizes

      totalCubicWeight +=
        // @ts-ignore - dimensions are checked in if condition
        (width / 100) * (length / 100) * (height / 100) * FACTOR;
    }
  }
  if (totalCubicWeight === 0) return '0';
  // else
  return (totalCubicWeight / count).toFixed(2);
}

export async function fetchProductData(): Promise<Array<IProduct>> {
  const TEMP_SERVER = 'https://kgnserver--zubinpratap.repl.co/data';
  try {
    const res = await axios.get(TEMP_SERVER);
    return res.data.products as Array<IProduct>;
  } catch (error) {
    throw new Error(` ${error}. Cannot fetch product data.`);
  }
}
