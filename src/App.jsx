import { Routes, Route, BrowserRouter} from 'react-router-dom';
import ShowPc from './components/ShowPc';


function App() {
 

  return (
    
     <BrowserRouter>
    <Routes>
      <Route path='/' element={<ShowPc></ShowPc>}></Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
