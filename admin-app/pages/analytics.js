import useSWR from 'swr'
import axios from 'axios'
import AdminLayout from '../components/AdminLayout'
import { useMemo } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL
const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || sessionStorage.getItem('adminKey')
const fetcher = url => axios.get(url, { headers: { 'x-admin-key': KEY } }).then(r => r.data)

export default function AnalyticsPage(){
  const { data } = useSWR(`${API}/analytics`, fetcher)

  const last7 = useMemo(() => {
    if (!data?.salesByDay) return []
    // ensure last 7 days present
    return data.salesByDay
  }, [data])

  return (
    <AdminLayout>
      <h1 className="font-serifLab text-2xl mb-4">Sales analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-semibold">₹{data?.totalRevenue || 0}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-semibold">{data?.totalOrders || 0}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Top Products</div>
          <div className="mt-2 space-y-2">
            {data?.topProducts?.map(tp => (
              <div key={tp.productId} className="flex items-center gap-3">
                <img src={tp.image || '/logo.jpg'} className="w-12 h-12 object-cover rounded" />
                <div>
                  <div className="text-sm">{tp.name}</div>
                  <div className="text-xs text-gray-500">Sold: {tp.qtySold}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Sales (last days)</h3>
        <div className="flex gap-3 overflow-x-auto">
          {last7.map(d => (
            <div key={d._id} className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">{d._id}</div>
              <div className="font-semibold">₹{d.dayRevenue}</div>
              <div className="text-xs text-gray-500">{d.orders} orders</div>
            </div>
          ))}
          {!last7?.length && <div className="text-gray-500">No recent sales</div>}
        </div>
      </div>
    </AdminLayout>
  )
}

