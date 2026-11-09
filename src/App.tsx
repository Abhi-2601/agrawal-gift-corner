import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthBootstrap from './components/auth/AuthBootstrap';
import AdminLayout from './components/admin/AdminLayout';
import ScrollToTop from './components/layout/ScrollToTop';
import StorefrontLayout from './components/layout/StorefrontLayout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import TrackOrderPage from './pages/TrackOrderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import CancellationPage from './pages/CancellationPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthBootstrap />
      <ScrollToTop />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2D2320',
            color: '#FFFCF8',
            borderRadius: '10px',
            fontSize: '13px',
          },
        }}
      />

      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<AccountPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/cancellation" element={<CancellationPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
