const axios = require('axios');

class ProfitService {
  constructor(){
    this.BASE_URL = 'https://fintual.cl/api/real_assets/'
    this.ASSETS = {
      '15077': 'VeryConservativeStreep',
      '188' : 'ConservativeClooney',
      '187' : 'ModeratePit',
      '186' : 'RiskyNorris'
    }
  }

  async getAssetData(assetId, toDate, fromDate) {

    const urlToFetch = `${this.BASE_URL}/${assetId}/days?to_date=${toDate}&from_date=${fromDate}`;
    const response = await axios.get(urlToFetch);
    if (response.status !== 200) { 
      throw new Error(`No se ha podido obtener la rentabilidad de los fondos para la fecha ${toDate}`);
    }

    return response.data;
  };

  extractIdAndPrice(assetValuesJson) {
  const result = {};

  assetValuesJson.data.forEach(item => {
      const { id } = item;
      const { price } = item.attributes;
      result[id] = price;
  });

  return result;
  }

  calculateProfit(currentValue, previousValue) {
    const profit = ((currentValue - previousValue) / previousValue) * 100;
    return profit;
  };

  async findDayProfit(query) {
    try {
      const { toDate } = query;

      let prevDate = new Date(toDate);
      prevDate.setDate(prevDate.getDate() - 1);
      let formattedPrevDate = prevDate.toLocaleDateString('en-CA', {year: 'numeric',month: '2-digit',day: '2-digit'});

      console.log(`La fecha solicitada-${toDate}`);
      console.log(`La fecha de limite es-${formattedPrevDate}`);
      const allAssetsData = {}
      for (const assetId in this.ASSETS) {
        const assetData = await this.getAssetData(assetId, toDate, formattedPrevDate);
        const extractedIdAndPrice = this.extractIdAndPrice(assetData);
        console.log(`informacion general extraida-${extractedIdAndPrice}`)
        const assetCurrentValueId = `${assetId}-${toDate}`
        const assetPrevValueId = `${assetId}-${formattedPrevDate}`

        const assetProfit = this.calculateProfit(extractedIdAndPrice[assetCurrentValueId], extractedIdAndPrice[assetPrevValueId]);
        console.log(assetProfit)
        allAssetsData[this.ASSETS[assetId]] = assetProfit;
      }
      console.log(allAssetsData)
      return {
        error: false, 
        msg: `Rentabilidad de los fondos obtenidos con éxito para el día ${toDate}`,
        data: allAssetsData
      };

    } catch (error) {
      console.log(error);
      throw new Error(`No se ha podido obtener la rentabilidad de los fondos para la fecha ${toDate}`);
    }
  }

  async findHistoricProfit() {
    try {

      let toDay = new Date();
      const todayFormatted =  toDay.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const startingDataDay = '2019-02-14'

      const allAssetsHistoricData = {}

      for (const assetId in this.ASSETS) {

        const assetHistoricData = {};
        const assetData = await this.getAssetData(assetId, todayFormatted, startingDataDay);
        const extractedIdAndPrice = this.extractIdAndPrice(assetData);

        let orderedPricesValues = Object.keys(extractedIdAndPrice).sort().reduce(
          (obj, key) => { 
            obj[key] = extractedIdAndPrice[key]; 
            return obj;
          }, 
          {}
        );

        Object.keys(orderedPricesValues).slice(1).forEach((key, i) => {
          const ProfitDay = key.replace(`${assetId}-`, '');
          const Profit = this.calculateProfit(orderedPricesValues[key], orderedPricesValues[Object.keys(orderedPricesValues)[i]]);

          assetHistoricData[ProfitDay] = Profit;
          
        });

        allAssetsHistoricData[this.ASSETS[assetId]] = assetHistoricData;
      }

      return {
        error: false, 
        msg: `Rentabilidad historica de los fondos obtenidos con éxito`,
        data: allAssetsHistoricData
      };

    } catch (error) {
      console.log(error);
      throw new Error(`No se ha podido obtener la rentabilidad de los fondos para la fecha ${toDate}`);
    }
  }
}

module.exports = ProfitService;
