import { Routes, Route } from 'react-router-dom'
import CustomerListPage from '~/pages/customers/page'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/customers' element={<CustomerListPage />} />
      </Route>
    </Routes>
  )
}

export default App
