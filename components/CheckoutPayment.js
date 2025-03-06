import { useState, useEffect } from "react"
import { useSelector } from "react-redux";

export default function CheckoutPayment(props) {

    const [payment, setPayment] = useState('');


    const user = useSelector((state) => state.user.value);

    const {pid, pcl, gid, title} = props;


const handlePayment = () => {
    if (payment) {
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
                setPayment("Congratulations and thank you for your support")
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