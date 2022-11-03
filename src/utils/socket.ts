// safe parse data from socket's response
export const parseData = (data: string) => {
  try {
    return { status: true, data: JSON.parse(data) };
  } catch (e) {
    return { status: false, data };
  }
};

// check if the raw data from socket is price level data (an array of 3 numbers [price, count, amount])
export const isRawPriceData = (data: any[]) => data.every(Number.isFinite);

// check if the raw data from socket is a bundle of raw data of the price level (usually receive them at very first response)
export const isBulkRawPriceData = (data: any[]) => {
  return data.every(isRawPriceData);
};
