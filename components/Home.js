import styles from "../styles/layout.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [projectsFromDB, setProjectsFromDB] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/projects/all")
      .then((response) => response.json())
      .then((data) => {
        data.result && setProjectsFromDB(data.projectsData);
      });
  }, []);

  const projects = projectsFromDB.map((data, i) => {
    let totalContributed = 10000; // !!! remplacer par un map/boucle de data.progressions
    let percent = (totalContributed / data.goal) * 100;
    return (
      <div key={i} onClick={() => router.push(`/project/${data.pageURL}`)}>
        <h3>{data.title}</h3>
        <p>{data.pitch}</p>
        <div>
          <p>{percent} %</p>
          <p>{totalContributed}</p>
          <p>{data.goal}</p>
        </div>
      </div>
    );
  });

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h2>Discover our top projects</h2>
      <div>{projects}</div>
    </>
  );
}
