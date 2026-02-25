import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import PublicLayout from "@/components/layouts/PublicLayout";
import AppLayout from "@/components/layouts/AppLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RestaurantLogin from "@/pages/RestaurantLogin";
import RestaurantRegister from "@/pages/RestaurantRegister";
import NotFound from "@/pages/NotFound";

import AppHome from "@/pages/app/Home";
import Search from "@/pages/app/Search";
import Restaurants from "@/pages/app/Restaurants";
import RestaurantDetail from "@/pages/app/RestaurantDetail";
import Confirm from "@/pages/app/Confirm";
import Queue from "@/pages/app/Queue";
import ReservationDetail from "@/pages/app/ReservationDetail";

import Dashboard from "@/pages/restaurant/Dashboard";
import Settings from "@/pages/restaurant/Settings";
import Tables from "@/pages/restaurant/Tables";
import QueueManagement from "@/pages/restaurant/QueueManagement";
import AdminReservations from "@/pages/restaurant/Reservations";
import Staff from "@/pages/restaurant/Staff";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/restaurant/login" element={<RestaurantLogin />} />
              <Route path="/restaurant/register" element={<RestaurantRegister />} />
            </Route>

            {/* Client App */}
            <Route element={<ProtectedRoute tipo_usuario="cliente"><AppLayout /></ProtectedRoute>}>
              <Route path="/app" element={<AppHome />} />
              <Route path="/app/search" element={<Search />} />
              <Route path="/app/restaurants" element={<Restaurants />} />
              <Route path="/app/restaurants/:id" element={<RestaurantDetail />} />
              <Route path="/app/confirm" element={<Confirm />} />
              <Route path="/app/queue" element={<Queue />} />
              <Route path="/app/reservations/:id" element={<ReservationDetail />} />
            </Route>

            {/* Restaurant Admin */}
            <Route element={<ProtectedRoute tipo_usuario="restaurante"><AdminLayout /></ProtectedRoute>}>
              <Route path="/restaurant/dashboard" element={<Dashboard />} />
              <Route path="/restaurant/settings" element={<Settings />} />
              <Route path="/restaurant/tables" element={<Tables />} />
              <Route path="/restaurant/queue" element={<QueueManagement />} />
              <Route path="/restaurant/reservations" element={<AdminReservations />} />
              <Route path="/restaurant/staff" element={<Staff />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
