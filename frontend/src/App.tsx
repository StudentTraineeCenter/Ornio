import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Prazdno from './pages/Prazdno'
import ZapisnikPage from './pages/ZapisnikPage'
import PtakPage from './pages/PtakPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/denik" replace />} />
          <Route
            path="denik"
            element={<Prazdno text="Vyber výlet v seznamu vlevo." />}
          />
          <Route path="denik/:zapisnikId" element={<ZapisnikPage />} />
          <Route
            path="encyklopedie"
            element={<Prazdno text="Vyber druh v seznamu vlevo." />}
          />
          <Route path="encyklopedie/:druhId" element={<PtakPage />} />
          <Route
            path="encyklopedie/:druhId"
            element={<Prazdno text="Detail druhu bude v dalším kroku." />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}