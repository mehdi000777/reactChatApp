import { Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PersistLogin from "./components/PersistLogin";


function App() {
  return (
    <Routes>
      <Route element={<Layout />} >
        <Route path="/">
          <Route element={<PersistLogin />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Route>
      </Route>
    </Routes >
  );
}

export default App;
