import { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateBacking } from "../reducers/user";
import { useRouter } from "next/router";
import Styles from "../styles/CheckoutPayment"

export default function CheckoutPayment(props) {

    const [payment, setPayment] = useState('');
    const dispatch = useDispatch();
    const router = useRouter();

    const user = useSelector((state) => state.user.value);

    const {pid, pcl, gid, gurl, title} = props;


const handlePayment = () => {
    if (payment) {
      setPayment('You already paid ! Thanks but no !')
        return;
    }
    console.log('data to send to put/backin : gid:  ', gid, 'user.token', user.token, 'pid:', pid)

    fetch(`http://localhost:3000/projects/backing`, {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({projectId: gid, token: user.token, pledgeId: pid})
        })
        .then(response => response.json())
        .then(data => {
                
            if (data.result) {
              console.log('le retour du checkout : ', data.newChecks)
                dispatch(updateBacking(data.newChecks))
                setPayment("Congratulations and thank you for your support")
                setTimeout(() => {
                  router.push(`/project/${gurl}`)
                }, 3000)
            } else {
                return;
            }
        })
}

  return (
    <>
      <p>PAYMENT FOR {title}</p>
      <p>{pcl} €</p>
      <button onClick={() => handlePayment()}>VALIDATE PAYMENT</button>
    <p>{payment}</p>
      
    </>
  );
}