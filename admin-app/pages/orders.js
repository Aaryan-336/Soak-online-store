import useSWR from 'swr'
import axios from 'axios'
import AdminLayout from '../components/AdminLayout'

const API = process.env.NEXT_PUBLIC_API_URL
const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || sessionStorage.getItem('adminKey')

const fetcher = url => axios.get(url, { headers: { 'x-admin-key': KEY } }).then(r => r.data)

export default function OrdersPage(){
  const { data: orders, mutate } = useSWR(`${API}/orders`, fetcher)

  async function updateStatus(id, status){
    try {
      await axios.put(`${API}/orders/${id}`, { status }, { headers: { 'x-admin-key': KEY } })
      mutate()
    } catch (err) {
      console.error(err)
      alert('Failed to update')
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-serifLab text-2xl mb-4">Orders</h1>
      <div className="space-y-4">
        {orders?.map(o => (
          <div key={o._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{o.name} — ₹{o.amount}</div>
              <div className="text-sm text-gray-600">{o.email} • {new Date(o.createdAt).toLocaleString()}</div>
              <div className="mt-2 text-sm">
                {o.items.map(it => (
                  <div key={it.productId}>• {it.name} ({it.size}) x {it.qty}</div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="text-sm">Status: <span className="font-semibold">{o.status}</span></div>
              <div className="flex gap-2">
                <button onClick={()=>updateStatus(o._id,'paid')} className="px-3 py-1 border rounded">Mark Paid</button>
                <button onClick={()=>updateStatus(o._id,'shipped')} className="px-3 py-1 border rounded">Mark Shipped</button>
                <button onClick={()=>updateStatus(o._id,'delivered')} className="px-3 py-1 border rounded">Mark Delivered</button>
              </div>
            </div>
          </div>
        ))}
        {!orders?.length && <div className="text-gray-600">No orders</div>}
      </div>
    </AdminLayout>
  )
}
