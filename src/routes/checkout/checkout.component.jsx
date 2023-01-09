import { useSelector, useDispatch } from 'react-redux';
import Button, { BUTTON_TYPE_CLASSES } from '../../components/button/button.component';
import { setNewOrder } from '../../utils/server/serverService';
import {
  selectCartItems,
  selectCartTotal,
} from '../../store/cart/cart.selector';

import CheckoutItem from '../../components/checkout-item/checkout-item.component';
import { clearAllItemFromCart } from '../../store/cart/cart.action';
import {
  CheckoutContainer,
  CheckoutHeader,
  HeaderBlock,
  Total,
} from './checkout.styles';

const Checkout = () => {
  const dispatch = useDispatch();
  const clearItemHandler = () =>{
    dispatch(clearAllItemFromCart());
  }
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  let NewOrder;
  const checkoutCart = async () => {
    if (cartItems.length > 0) {
      NewOrder = await setNewOrder(cartItems);
    }
    if(NewOrder.message){
      alert('there was an error creating the order');
    }
    else{
      clearItemHandler();};
  };
  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <HeaderBlock>
          <span>Product</span>
        </HeaderBlock>
        <HeaderBlock>
          <span>Description</span>
        </HeaderBlock>
        <HeaderBlock>
          <span>Quantity</span>
        </HeaderBlock>
        <HeaderBlock>
          <span>Price</span>
        </HeaderBlock>
        <HeaderBlock>
          <span>Remove</span>
        </HeaderBlock>
      </CheckoutHeader>
      {cartItems.map((cartItem) => (
        <CheckoutItem key={cartItem.id} cartItem={cartItem} />
      ))}
      <Total>Total: ${cartTotal}</Total>
      <Button
        buttonType={BUTTON_TYPE_CLASSES.inverted}
        onClick={checkoutCart}
      >
        Buy Now!
      </Button>
    </CheckoutContainer>
  );
};

export default Checkout;
