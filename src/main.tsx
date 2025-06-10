import { createRoot } from 'react-dom/client'

import HelloWorld from './components/helloWorld'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found!')
createRoot(rootElement).render(<HelloWorld />)
