import { useState } from 'react'
// import viteLogo from '/vite.svg'
import './App.css'
import { IResGetUsers, reqGetUesr } from './api/endpoint/reqres_in/users.get'

function App() {
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState<IResGetUsers['data']>([])

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
            reqGetUesr({ params: { page: 1 } })
              .then((res) => setUsers(res.data.data))
              .catch(() => {})

            // api.reqresIn
            //   .get<IResGetUsers>('/users', { params: { page: 1 } })
            //   .then(({ data: { data } }) => setUsers(data))
            //   .catch(() => {})
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <div>
          <pre style={{ textAlign: 'left' }}>
            {JSON.stringify(users, null, 2)}
          </pre>
        </div>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
