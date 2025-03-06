import styles from '../styles/layout.module.css';
import CheckoutPayment from '../components/CheckoutPayment';

export default function checkoutPaymentPage(props) {

    return (
        <div className={styles.mainContainer}>
            <CheckoutPayment pid={props.pid} gurl={props.gurl} />
        </div>
    );
}