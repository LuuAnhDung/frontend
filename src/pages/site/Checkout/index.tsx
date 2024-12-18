import { CaretRightOutlined } from '@ant-design/icons';
import { Col, Collapse, CollapseProps, Divider, Row, Select, Skeleton, theme, Radio, message } from 'antd';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ButtonCmp from '../../../components/Button';
import { RootState } from '../../../store/store';
import { IOrder } from '../../../types/order.type';
import {
  useCreateOrderMutation,
  useGetRetrieveCartQuery,
  useGetUserQuery,
  useCreateVnpayUrlMutation,
  useGetTotalPriceQuery
} from '../client.service';
import { clearCart } from '../client.slice';
import './Checkout.scss';
import DetailItem from './components/DetailItem';
const text = `
Name on card
NGUYEN VAN A

Card number
**** 0123

Expiry date
6/2028
`;

const Checkout = () => {
  const { token } = theme.useToken();
  const [createOrder] = useCreateOrderMutation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Visa');
  const [expandedPanel, setExpandedPanel] = useState(['1']);
  const [createVnpayUrl] = useCreateVnpayUrlMutation();

  const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
    // {
    //   key: '1',
    //   label: (
    //     <div>
    //       <Radio
    //         value='Visa'
    //         checked={selectedPaymentMethod === 'Visa'}
    //         onChange={() => {
    //           if (expandedPanel.includes('1')) {
    //             setExpandedPanel([]);
    //           } else {
    //             setExpandedPanel(['1']);
    //           }
    //           setSelectedPaymentMethod('Visa');
    //         }}
    //       >
    //         Visa **** 0123
    //       </Radio>
    //     </div>
    //   ),
    //   children: <p>{text}</p>,
    //   style: panelStyle
    // },
    {
      key: '4',
      label: (
        <div>
          <Radio
            value='VN Pay'
            checked={selectedPaymentMethod === 'VN Pay'}
            onChange={() => {
              if (expandedPanel.includes('4')) {
                setExpandedPanel([]);
              } else {
                setExpandedPanel(['4']);
              }
              setSelectedPaymentMethod('VN Pay');
            }}
          >
            VN Pay
          </Radio>
        </div>
      ),
      children: <p>{updatedText}</p>,
      style: panelStyle
    }
  ];

  const panelStyle = {
    marginBottom: 0,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: '1px solid rgba(0, 0, 0, 0.1)'
  };

  const cart = useSelector((state: RootState) => state.client.cart);

  const selectedCoupon = useSelector((state: RootState) => state.client.selectedCoupon);
  const storedCourseId = sessionStorage.getItem('selectedCourse');
  const courseIds = storedCourseId ? [storedCourseId] : cart.items.map((item) => item.courseId);

  const userId = useSelector((state: RootState) => state.auth.userId);

  const { data: cartData, isFetching: isCartFetching } = useGetRetrieveCartQuery(
    { courseIds, userId },
    {
      skip: !courseIds.length
    }
  );

  const { data: totalPriceData } = useGetTotalPriceQuery({
    courseIds: courseIds.join(','),
    couponCode: selectedCoupon || undefined
  });

  const cartItems = cartData?.cart.items || [];
  const totalPrice = totalPriceData?.totalPrice || 0;
  const discountPrice = totalPriceData?.discountPrice || 0;

  const { data: userData } = useGetUserQuery(userId, {
    skip: !userId
  });

  const updatedText = text.replace('NGUYEN VAN A', userData?.user.name || 'NGUYEN VAN A');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(cart?.items);
  

  // const checkoutHandler = () => {
  //   const couponCode = selectedCoupon !== null && selectedCoupon !== undefined ? selectedCoupon : null;

  //   let items = cart?.items || [];

  //   if (storedCourseId) {
  //     items = [{ courseId: storedCourseId }];
  //   }

  //   const newOrder = {
  //     items: items,
  //     user: {
  //       _id: userData?.user._id,
  //       email: userData?.user.email,
  //       name: userData?.user.name,
  //       phone: userData?.user.phone
  //     },
  //     transaction: {
  //       method: selectedPaymentMethod
  //     },
  //     couponCode: couponCode,
  //     totalPrice: totalPrice,
  //     note: 'No caption',
  //     vatFee: totalPrice * 0.1
  //   };

  //   createOrder(newOrder as Omit<IOrder, '_id'>)
  //     .unwrap()
  //     .then((result) => {
  //       if (result.order._id) {
  //         if (selectedPaymentMethod === 'VN Pay') {
  //           createVnpayUrl({
  //             orderId: result.order._id,
  //             amount: totalPrice * 23000
  //           })
  //             .unwrap()
  //             .then((paymentResponse) => {
  //               dispatch(clearCart());
  //               window.location.href = paymentResponse.redirectUrl;
  //             })
  //             .catch(() => {
  //               void message.error('An error occurred while processing your request. Please try again later 1.');
  //             });
  //         } else {
  //           dispatch(clearCart());
  //           navigate(`/order-completed?orderId=${result.order._id}`);
  //         }
  //       }
  //     })
  //     .catch(() => {
  //       void message.error('An error occurred while processing your request. Please try again later 2.');
  //     });
  // };
  const checkoutHandler = () => {
    try {
      const couponCode = selectedCoupon ?? null; // Sử dụng toán tử nullish coalescing
      let items = cart?.items || [];
  
      if (storedCourseId) {
        items = [{ courseId: storedCourseId }];
      }
  
      const user = userData?.user;
      if (!user) {
        void message.error("User information is missing. Please log in again.");
        return;
      }
  
      const newOrder = {
        items: items,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
        transaction: {
          method: selectedPaymentMethod,
        },
        couponCode: couponCode,
        totalPrice: totalPrice,
        note: "No caption",
        vatFee: totalPrice * 0.1,
      };
  
      createOrder(newOrder as Omit<IOrder, "_id">)
        .unwrap()
        .then((result) => {
          if (result?.order?._id) {
            // if (selectedPaymentMethod === "VN Pay") {
            //   createVnpayUrl({
            //     orderId: result.order._id,
            //     amount: totalPrice * 25000,
            //   })
            //     .unwrap()
            //     .then((paymentResponse) => {
            //       dispatch(clearCart());
            //       window.location.href = paymentResponse.redirectUrl;
            //     })
            //     .catch((error) => {
            //       console.error("VN Pay error:", error);
            //       void message.error("An error occurred while processing your VN Pay request. Please try again later.");
            //     });
            // } else {
              dispatch(clearCart());
              navigate(`/order-completed?orderId=${result.order._id}`);
            //}
          } else {
            void message.error("Failed to create order. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Order creation error:", error);
          void message.error("An error occurred while processing your request. Please try again later.");
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      void message.error("An unexpected error occurred. Please try again later.");
    }
  };
  
  return (
    <div className='checkout'>
      <div className='checkout__wrap'>
        <div className='container'>
          <Row className='row-wrap'>
            <Col className='checkout__col checkout__col--left'>
              <h2 className='checkout__title'>Checkout</h2>
              <h3 className='checkout__billing-title'>Billing address</h3>
              <div className='checkout__countries'>
                <div className='checkout__countries-header'>
                  <span className='checkout__countries-header-item checkout__countries-title'>Country</span>
                  <span className='checkout__countries-header-item checkout__countries-required'>Required</span>
                </div>
                <div className='checkout__countries-body'>
                  <Select
                    className='checkout__countries-select'
                    defaultValue='Viet Nam'
                    style={{ width: '50%' }}
                    options={[
                      { value: 'Viet Nam', label: 'Viet Nam' },
                    ]}
                  />

                  <div className='checkout__countries-condition-term'>
                    {/* Udemy is required by law to collect applicable transaction taxes for purchases made in certain tax
                    jurisdictions. */}
                  </div>
                </div>

                <div className='checkout__payment-methods'>
                  <div className='checkout__payment-header'>
                    <h3 className='checkout__payment-title'>Payment method</h3>
                    <span className='checkout__payment-secured'>Secured connection</span>
                  </div>
                  <div className='checkout__payment-body'>
                    <Collapse
                      className='checkout__payment-content'
                      accordion
                      bordered={false}
                      activeKey={expandedPanel}
                      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                      style={{ background: token.colorBgContainer }}
                      items={getItems(panelStyle)}
                    />
                  </div>
                </div>
                <div className='checkout__orders-detail'>
                  <h3 className='checkout__orders-detail-title'>Order details</h3>
                  {isCartFetching && <Skeleton />}
                  {!isCartFetching &&
                    cartItems.map((cartItem: { _id: string; name: string; thumbnail: string; finalPrice: number }) => {
                      return <DetailItem key={cartItem._id} courseItem={cartItem} />;
                    })}
                </div>
              </div>
            </Col>
            <Col className='checkout__col checkout__col--right'>
              <Row className='checkout__col--right-wrap'>
                <Col className='col'>
                  <div className='checkout__summary'>
                    <h3 className='checkout__summary-title'>Summary</h3>
                    <div className='checkout__summary-row checkout__summary-price'>
                      <span className='checkout__summary-col checkout__summary-price-label'>Original Price:</span>
                      <span className='checkout__summary-col checkout__summary-price-text'>
                        ${discountPrice + totalPrice}
                      </span>
                    </div>
                    <div className='checkout__summary-row checkout__summary-price'>
                      <span className='checkout__summary-col checkout__summary-price-label'>Discount Price:</span>
                      <span className='checkout__summary-col checkout__summary-price-text'>${discountPrice}</span>
                    </div>
                    <Divider className='checkout__summary-divider' />
                    <div className='checkout__summary-row checkout__summary-total'>
                      <span className='checkout__summary-col checkout__summary-total-label'>Total:</span>
                      <span className='checkout__summary-col checkout__summary-total-text'>${totalPrice}</span>
                    </div>

                    <div className='checkout__summary-notify'>
                      By completing your purchase you agree to these <Link to='/'> Terms of Service.</Link>
                    </div>
                    <ButtonCmp onClick={checkoutHandler} className='checkout__summary-btn btn btn-primary btn-md'>
                      Complete Checkout
                    </ButtonCmp>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
