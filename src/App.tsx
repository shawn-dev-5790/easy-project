import { useState } from 'react'
// import viteLogo from '/vite.svg'
import './App.css'
import { api } from './manager/api/ApiManager'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href='https://vitejs.dev' target='_blank'>
          {/* <img src={viteLogo} className='logo' alt='Vite logo' /> */}
        </a>
        <a href='https://react.dev' target='_blank'></a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button
          onClick={() => {
            setCount((count) => count + 1)

            api.reqresIn
              .get('/users?page=1')
              .then((d) => console.log(d))
              .catch((e) => console.log(e))

            api.base
              .get('/users?page=1')
              .then((d) => console.log(d))
              .catch((e) => console.log(e))
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
