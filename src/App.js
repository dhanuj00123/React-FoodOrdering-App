import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { uiActions } from "./Store/ui-slice";
let isInitial = true;
function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notificationStatus = useSelector((state) => state.ui.notification);
  useEffect(() => {
    const sendCartDate = async () => {
      dispatch(
        uiActions.showNotification({
          status: "Pending",
          title: "Sending...",
          message: "Sending Cart Data To Backend",
        })
      );
      const response = await fetch(
        "https://react-project-763e0-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json",
        { method: "PUT", body: JSON.stringify(cart) }
      );
      if (!response.ok) {
        throw new Error("Something whent wrong");
      }

      const responseData = response.json();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success...",
          message: "Sucessfully Sent Cart Data To Backend",
        })
      );
    };
    if (isInitial) {
      isInitial = false;
      return;
    }
    sendCartDate().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Erroe...",
          message: "Something Went Wrong",
        })
      );
    });
  }, [cart, dispatch]);
  return (
    <Fragment>
      {notificationStatus && (
        <Notification
          status={notificationStatus.status}
          title={notificationStatus.title}
          message={notificationStatus.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
