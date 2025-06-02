import { Route, Routes } from 'react-router-dom'
import { Header } from '../../components/header/Header'
import HomePage from '../../components/User/HomePage'
import { Footer } from '../../components/Footer/Footer'

const UserPage = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default UserPage