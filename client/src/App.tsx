import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GuardedRoute from "./components/GuardedRoute";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import Gifting from "./pages/Gifting";
import About from "./pages/About";
import WhyHappiNuts from "./pages/WhyHappiNuts";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import MyOrders from "./pages/MyOrders";
import Admin from "./pages/Admin";
import { FaqPage, PrivacyPolicyPage, ShippingInfoPage, ReturnsPage, TermsPage } from "./pages/InfoPages";

function Router() {
  return (
    <Switch>
      <Route path={"/"}>
        <GuardedRoute pageKey="home" pageName="Home">
          <Home />
        </GuardedRoute>
      </Route>
      <Route path={"/shop"}>
        <GuardedRoute pageKey="shop" pageName="Shop">
          <Shop />
        </GuardedRoute>
      </Route>
      <Route path={"/product/:id"}>
        <GuardedRoute pageKey="product-details" pageName="Product Details">
          <ProductDetails />
        </GuardedRoute>
      </Route>
      <Route path={"/categories"}>
        <GuardedRoute pageKey="categories" pageName="Categories">
          <Categories />
        </GuardedRoute>
      </Route>
      <Route path={"/gifting"}>
        <GuardedRoute pageKey="gifting" pageName="Gifting">
          <Gifting />
        </GuardedRoute>
      </Route>
      <Route path={"/about"}>
        <GuardedRoute pageKey="about" pageName="About Us">
          <About />
        </GuardedRoute>
      </Route>
      <Route path={"/why-happi-nuts"}>
        <GuardedRoute pageKey="why-happi-nuts" pageName="Why Happi Nuts">
          <WhyHappiNuts />
        </GuardedRoute>
      </Route>
      <Route path={"/contact"}>
        <GuardedRoute pageKey="contact" pageName="Contact">
          <Contact />
        </GuardedRoute>
      </Route>
      <Route path={"/cart"}>
        <GuardedRoute pageKey="cart" pageName="Cart">
          <Cart />
        </GuardedRoute>
      </Route>
      <Route path={"/checkout"}>
        <GuardedRoute pageKey="checkout" pageName="Checkout">
          <Checkout />
        </GuardedRoute>
      </Route>
      <Route path={"/wishlist"}>
        <GuardedRoute pageKey="wishlist" pageName="Wishlist">
          <Wishlist />
        </GuardedRoute>
      </Route>
      <Route path={"/login"}>
        <GuardedRoute pageKey="login" pageName="Login">
          <Login />
        </GuardedRoute>
      </Route>
      <Route path={"/signup"}>
        <GuardedRoute pageKey="signup" pageName="Sign Up">
          <Signup />
        </GuardedRoute>
      </Route>
      <Route path={"/account"}>
        <GuardedRoute pageKey="account" pageName="Account">
          <Account />
        </GuardedRoute>
      </Route>
      <Route path={"/my-orders"}>
        <GuardedRoute pageKey="account" pageName="My Orders">
          <MyOrders />
        </GuardedRoute>
      </Route>
      <Route path={"/admin"} component={Admin} />
      <Route path={"/faq"}>
        <GuardedRoute pageKey="faq" pageName="FAQ">
          <FaqPage />
        </GuardedRoute>
      </Route>
      <Route path={"/terms"}>
        <GuardedRoute pageKey="terms" pageName="Terms & Conditions">
          <TermsPage />
        </GuardedRoute>
      </Route>
      <Route path={"/terms-and-conditions"}>
        <GuardedRoute pageKey="terms" pageName="Terms & Conditions">
          <TermsPage />
        </GuardedRoute>
      </Route>
      <Route path={"/privacy-policy"}>
        <GuardedRoute pageKey="privacy-policy" pageName="Privacy Policy">
          <PrivacyPolicyPage />
        </GuardedRoute>
      </Route>
      <Route path={"/shipping-info"}>
        <GuardedRoute pageKey="shipping-info" pageName="Shipping Info">
          <ShippingInfoPage />
        </GuardedRoute>
      </Route>
      <Route path={"/returns"}>
        <GuardedRoute pageKey="returns" pageName="Returns">
          <ReturnsPage />
        </GuardedRoute>
      </Route>
      <Route path={"/404"}>
        <GuardedRoute pageKey="not-found" pageName="Page Not Found">
          <NotFound />
        </GuardedRoute>
      </Route>
      {/* Final fallback route */}
      <Route>
        <GuardedRoute pageKey="not-found" pageName="Page Not Found">
          <NotFound />
        </GuardedRoute>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Header />
          <Router />
          <Footer />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;