import styles from '../styles/checkoutPayment.module.css';
import CheckoutPayment from '../components/CheckoutPayment';
import { useRouter } from 'next/router';

export default function checkoutPaymentPage() {
    const router = useRouter();
    return (
        <div className={styles.mainContainer}>
            <CheckoutPayment pid={router.query.pid} gid={router.query.gid} pcl={router.query.pcl} title={router.query.title} />
        </div>
    );
}