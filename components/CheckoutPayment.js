import { useState, useEffect } from "react"
import { useSelector } from "react-redux";

export default function CheckoutPayment(props) {

    const [payment, setPayment] = useState('');

    const [project, setProject] = useState({});

    const user = useSelector((state) => state.user.value);
    
    useEffect(() => {

        fetch(`/projects/${props.gurl}`)
        .then(response => response.json())
        .then(data => {
            setProject(data.project)
        });
    }, [])


const handlePayment = () => {

    fetch(`/projects/backing`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({projectId: project._id, token: user.token, pledgeId: props.pid})
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
      <p>PAYMENT FOR {project.title}</p>
      <p>{project.detail.pledges[gid-1].contributionLevel} €</p>
      <button onClick={() => handlePayment()}>VALIDATE PAYMENT</button>
      
    </>
  );
}