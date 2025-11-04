import ReactDOM from 'react-dom/client'
import './index.css'

import App from './App'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store'

import { Toaster } from 'sonner'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster richColors position='top-center' />
    </Provider>
  </BrowserRouter>
)
