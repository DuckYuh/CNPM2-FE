import { Routes, Route } from 'react-router-dom'
import CustomerListPage from '~/pages/customers/page'

function App() {
  return (
    <Routes>
      <Route path='/customers' element={<CustomerListPage />} />
    </Routes>
  )
}

export default App
