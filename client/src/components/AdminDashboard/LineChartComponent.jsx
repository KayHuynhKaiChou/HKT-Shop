import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// eslint-disable-next-line react/prop-types
export default function LineChartComponent({statisticTypeProduct = []}) {

  const data = statisticTypeProduct?.map(products => {
    return {
      type: products.type,
      ['đã bán']: products.totalSoldNum,
      ['tồn kho']: products.totalInStockNum
    }
  })

    return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tồn kho" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="đã bán" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
    );
}
